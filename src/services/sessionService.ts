import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireAdminContext } from "@/lib/require-admin";

const roleSchema = z.enum(["admin", "editor", "revisor"]);
export type AppRole = z.infer<typeof roleSchema>;

export interface AdminUser {
  user_id: string;
  email: string | null;
  display_name: string | null;
  roles: AppRole[];
  created_at: string | null;
}

async function ensureAdmin(supabase: typeof import("@/integrations/supabase/client").supabase, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) {
    console.error("[users.ensureAdmin]", error);
    throw new Error("Falha ao validar permissão.");
  }
  if (!data) throw new Error("Acesso restrito a administradores.");
}

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdminContext(context, { roles: ["admin"], requireMfa: true });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profiles, error: pErr } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, created_at")
      .order("created_at", { ascending: false });
    if (pErr) {
      console.error("[users.list.profiles]", pErr);
      throw new Error("Não foi possível listar usuários.");
    }

    const { data: roles, error: rErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role");
    if (rErr) {
      console.error("[users.list.roles]", rErr);
      throw new Error("Não foi possível listar papéis.");
    }
    const rolesByUser = new Map<string, AppRole[]>();
    for (const r of roles ?? []) {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r.role as AppRole);
      rolesByUser.set(r.user_id, arr);
    }

    // Best-effort email lookup via Auth Admin API
    const emailById = new Map<string, string | null>();
    try {
      const { data: authList } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      for (const u of authList?.users ?? []) emailById.set(u.id, u.email ?? null);
    } catch (e) {
      console.warn("[users.list.auth]", e);
    }

    const users: AdminUser[] = (profiles ?? []).map((p) => ({
      user_id: p.id,
      display_name: p.display_name,
      email: emailById.get(p.id) ?? null,
      roles: rolesByUser.get(p.id) ?? [],
      created_at: p.created_at,
    }));
    return { users };
  });

export const assignAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        user_id: z.string().uuid(),
        role: roleSchema,
        action: z.enum(["add", "remove"]),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await requireAdminContext(context, { roles: ["admin"], requireMfa: true });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Guard: don't allow removing the last admin
    if (data.action === "remove" && data.role === "admin") {
      const { count, error } = await supabaseAdmin
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");
      if (error) {
        console.error("[users.assign.count]", error);
        throw new Error("Falha ao validar administradores.");
      }
      if ((count ?? 0) <= 1) {
        throw new Error("Não é possível remover o último administrador.");
      }
    }

    if (data.action === "add") {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: data.user_id, role: data.role });
      if (error && !String(error.message).toLowerCase().includes("duplicate")) {
        console.error("[users.assign.add]", error);
        throw new Error("Não foi possível atribuir o papel.");
      }
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.user_id)
        .eq("role", data.role);
      if (error) {
        console.error("[users.assign.remove]", error);
        throw new Error("Não foi possível remover o papel.");
      }
    }
    const { logAudit } = await import("@/lib/audit.server");
    logAudit({
      action: "role_change",
      userId: context.userId,
      targetType: "user",
      targetId: data.user_id,
      metadata: { role: data.role, op: data.action },
    });
    return { ok: true };
  });

export const createAdminUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        email: z.string().email().max(255),
        password: z.string().min(8).max(128),
        display_name: z.string().min(1).max(120).optional(),
        role: roleSchema,
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await requireAdminContext(context, { roles: ["admin"], requireMfa: true });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.display_name ?? null },
    });
    if (error || !created.user) {
      console.error("[users.create]", error);
      throw new Error(error?.message ?? "Não foi possível criar o usuário.");
    }
    const newUserId = created.user.id;

    // Ensure profile exists (trigger should handle it, but make sure).
    await supabaseAdmin
      .from("profiles")
      .upsert({ id: newUserId, display_name: data.display_name ?? data.email });

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newUserId, role: data.role });
    if (roleErr && !String(roleErr.message).toLowerCase().includes("duplicate")) {
      console.error("[users.create.role]", roleErr);
      throw new Error("Usuário criado, mas não foi possível atribuir o papel.");
    }

    const { logAudit } = await import("@/lib/audit.server");
    logAudit({
      action: "user_create",
      userId: context.userId,
      targetType: "user",
      targetId: newUserId,
      targetTitle: data.email,
      metadata: { role: data.role },
    });
    return { ok: true, user_id: newUserId };
  });

export const deleteAdminUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ user_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await requireAdminContext(context, { roles: ["admin"], requireMfa: true });
    if (data.user_id === context.userId) {
      throw new Error("Você não pode excluir a si mesmo.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Refuse to delete the last admin
    const { data: targetRoles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user_id);
    const isAdminTarget = (targetRoles ?? []).some((r) => r.role === "admin");
    if (isAdminTarget) {
      const { count } = await supabaseAdmin
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");
      if ((count ?? 0) <= 1) {
        throw new Error("Não é possível excluir o último administrador.");
      }
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) {
      console.error("[users.delete]", error);
      throw new Error("Não foi possível excluir o usuário.");
    }
    const { logAudit } = await import("@/lib/audit.server");
    logAudit({
      action: "user_delete",
      userId: context.userId,
      targetType: "user",
      targetId: data.user_id,
    });
    return { ok: true };
  });

export const resetUserPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({ user_id: z.string().uuid(), password: z.string().min(8).max(128) }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await requireAdminContext(context, { roles: ["admin"], requireMfa: true });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
      password: data.password,
    });
    if (error) {
      console.error("[users.resetPassword]", error);
      throw new Error("Não foi possível redefinir a senha.");
    }
    const { logAudit } = await import("@/lib/audit.server");
    logAudit({
      action: "password_reset",
      userId: context.userId,
      targetType: "user",
      targetId: data.user_id,
    });
    return { ok: true };
  });
