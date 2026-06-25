import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireAdminContext } from "@/lib/require-admin";

export interface AdminLibraryItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  audience: string;
  source_org: string;
  year: number;
  file_url: string;
  created_at: string;
  updated_at: string;
}

const safeHttpUrl = z
  .string()
  .url()
  .refine((v) => /^https?:\/\//i.test(v), { message: "Apenas URLs http(s) são permitidas." });

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2).max(255),
  description: z.string().max(2000).optional().nullable(),
  category: z.string().min(1).max(80),
  audience: z.string().min(1).max(80),
  source_org: z.string().min(1).max(160),
  year: z.number().int().min(1900).max(2100),
  file_url: safeHttpUrl,
});

export const listAdminLibrary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdminContext(context, { roles: ["admin", "editor", "revisor"], requireMfa: true });
    const { data, error } = await context.supabase
      .from("library_items")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      console.error("[library.list]", error);
      throw new Error("Não foi possível carregar a biblioteca.");
    }
    return { items: (data ?? []) as AdminLibraryItem[] };
  });

export const getAdminLibraryItem = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await requireAdminContext(context, { roles: ["admin", "editor", "revisor"], requireMfa: true });
    const { data: row, error } = await context.supabase
      .from("library_items")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) {
      console.error("[library.get]", error);
      throw new Error("Não foi possível carregar o item.");
    }
    return { item: row as AdminLibraryItem | null };
  });

export const upsertAdminLibrary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => upsertSchema.parse(i))
  .handler(async ({ data, context }) => {
    await requireAdminContext(context, { roles: ["admin", "editor"], requireMfa: true });
    const payload = { ...data, description: data.description || null };
    const isUpdate = Boolean(data.id);
    let saved: AdminLibraryItem;
    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("library_items")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) {
        console.error("[library.update]", error);
        throw new Error("Não foi possível atualizar o item.");
      }
      saved = row as AdminLibraryItem;
    } else {
      const { data: row, error } = await context.supabase
        .from("library_items")
        .insert(payload)
        .select()
        .single();
      if (error) {
        console.error("[library.insert]", error);
        throw new Error("Não foi possível criar o item.");
      }
      saved = row as AdminLibraryItem;
    }
    const { logAudit } = await import("@/lib/audit.server");
    logAudit({
      action: "library_change",
      userId: context.userId,
      targetType: "library_item",
      targetId: saved.id,
      targetTitle: saved.title,
      metadata: { mode: isUpdate ? "update" : "create" },
    });
    return { item: saved };
  });

export const deleteAdminLibrary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await requireAdminContext(context, { roles: ["admin"], requireMfa: true });
    const { data: prev } = await context.supabase
      .from("library_items")
      .select("title")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await context.supabase.from("library_items").delete().eq("id", data.id);
    if (error) {
      console.error("[library.delete]", error);
      throw new Error("Não foi possível excluir o item.");
    }
    const { logAudit } = await import("@/lib/audit.server");
    logAudit({
      action: "library_change",
      userId: context.userId,
      targetType: "library_item",
      targetId: data.id,
      targetTitle: prev?.title ?? null,
      metadata: { mode: "delete" },
    });
    return { ok: true };
  });
