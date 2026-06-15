import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireRole } from "@/lib/require-role";

const PRIMARY_ADMIN_EMAIL = "luizotaviomscv@gmail.com";

/** Public server fn — exposes the Turnstile site key to the browser. */
export const getTurnstileSiteKey = createServerFn({ method: "GET" }).handler(async () => {
  return { siteKey: process.env.TURNSTILE_SITE_KEY ?? null };
});

/** Public — call before signInWithPassword. Returns lockout status. */
export const checkLoginAllowed = createServerFn({ method: "POST" })
  .inputValidator((i) => z.object({ email: z.string().email().max(255) }).parse(i))
  .handler(async ({ data }) => {
    const { checkAccountLockout } = await import("@/lib/security.server");
    return await checkAccountLockout(data.email);
  });

/**
 * Public — verifies a Turnstile token and records the login outcome.
 * Used both for failed and successful attempts. On success, opens admin session
 * and logs `login`; on failure increments rate limiter & may lock the account.
 */
export const recordLoginAttemptV2 = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        email: z.string().email().max(255),
        success: z.boolean(),
        captchaToken: z.string().min(1).max(2048).nullable().optional(),
        reason: z.string().max(200).optional(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const { verifyTurnstile, recordAttempt, openAdminSession } =
      await import("@/lib/security.server");
    const { logAudit } = await import("@/lib/audit.server");

    // Always verify CAPTCHA when present; track failures.
    if (data.captchaToken !== undefined) {
      const cap = await verifyTurnstile(data.captchaToken ?? null);
      if (!cap.success) {
        await recordAttempt(data.email, false, "captcha_failed");
        await logAudit({
          action: "captcha_failed",
          userEmail: data.email,
          metadata: { codes: cap.errorCodes ?? [] },
        });
        return { ok: false, reason: "captcha_failed" as const };
      }
    }

    await recordAttempt(data.email, data.success, data.reason);

    if (!data.success) {
      await logAudit({
        action: "login_failed",
        userEmail: data.email,
        metadata: { reason: data.reason ?? null },
      });
      return { ok: false, reason: "login_failed" as const };
    }

    // success path: resolve user_id + role and open admin session
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let userId: string | null = null;
    try {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      userId =
        list?.users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase())?.id ?? null;
    } catch {
      /* ignore */
    }
    let role: string | null = null;
    if (userId) {
      const { data: roles } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      role = (roles ?? []).map((r) => r.role).join(",") || null;
      await openAdminSession(userId, data.email, role);
    }
    await logAudit({ action: "login", userId, userEmail: data.email, userRole: role });
    return { ok: true };
  });

/** Authenticated — close current admin session + audit logout. */
export const recordAdminLogout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { closeAdminSession } = await import("@/lib/security.server");
    const { logAudit } = await import("@/lib/audit.server");
    await closeAdminSession(context.userId);
    await logAudit({ action: "logout", userId: context.userId });
    return { ok: true };
  });

/** Audit-only helpers for MFA lifecycle events emitted by the client. */
const mfaActionSchema = z.enum([
  "mfa_enabled",
  "mfa_disabled",
  "mfa_success",
  "mfa_failed",
  "mfa_reset",
]);

export const recordMfaEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        action: mfaActionSchema,
        metadata: z
          .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
          .optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const { logAudit } = await import("@/lib/audit.server");
    await logAudit({
      action: data.action,
      userId: context.userId,
      metadata: data.metadata ?? null,
    });
    return { ok: true };
  });

/**
 * Idempotent bootstrap of the primary administrator account.
 * - If luizotaviomscv@gmail.com does not exist: create it (email_confirmed),
 *   send a password recovery link, and assign admin role.
 * - If exists without admin role: assign admin role.
 * - If exists with admin role: no-op.
 *
 * Public (no auth) — but only acts once per email; safe to call repeatedly.
 */
export const bootstrapPrimaryAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { logAudit } = await import("@/lib/audit.server");

  // Find user by email
  let userId: string | null = null;
  try {
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    userId = list?.users.find((u) => u.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL)?.id ?? null;
  } catch (e) {
    console.error("[bootstrapPrimaryAdmin] list error", e);
    throw new Error("Falha ao inicializar administrador principal.");
  }

  let created = false;
  if (!userId) {
    // Generate a random password — the user will reset it via recovery link.
    const random = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
    const { data: createRes, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: PRIMARY_ADMIN_EMAIL,
      password: random,
      email_confirm: true,
      user_metadata: { full_name: "Administrador Principal" },
    });
    if (createErr || !createRes.user) {
      console.error("[bootstrapPrimaryAdmin] create", createErr);
      throw new Error("Não foi possível criar o administrador principal.");
    }
    userId = createRes.user.id;
    created = true;

    // Ensure profile (trigger usually handles, but be explicit)
    await supabaseAdmin
      .from("profiles")
      .upsert({ id: userId, display_name: "Administrador Principal" });

    // Send recovery email so Luiz can set his own password
    try {
      await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: PRIMARY_ADMIN_EMAIL,
      });
    } catch (e) {
      console.warn("[bootstrapPrimaryAdmin] recovery link", e);
    }

    await logAudit({
      action: "user_create",
      userId: null,
      userEmail: PRIMARY_ADMIN_EMAIL,
      targetType: "user",
      targetId: userId,
      targetTitle: PRIMARY_ADMIN_EMAIL,
      metadata: { reason: "primary_admin_bootstrap" },
    });
  }

  // Ensure admin role
  const { data: existing } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  let roleAdded = false;
  if (!existing) {
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (error && !String(error.message).toLowerCase().includes("duplicate")) {
      console.error("[bootstrapPrimaryAdmin] role insert", error);
      throw new Error("Não foi possível atribuir o papel admin.");
    }
    roleAdded = true;
    await logAudit({
      action: "role_change",
      targetType: "user",
      targetId: userId,
      targetTitle: PRIMARY_ADMIN_EMAIL,
      metadata: { op: "add", role: "admin", reason: "primary_admin_bootstrap" },
    });
  }

  return { created, roleAdded, email: PRIMARY_ADMIN_EMAIL };
});

/** Admin-only — list admin sessions. */
export const listAdminSessions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        page: z.number().int().min(1).max(1000).default(1),
        pageSize: z.number().int().min(10).max(200).default(50),
      })
      .parse(i ?? {}),
  )
  .handler(async ({ data, context }) => {
    await requireRole(context.supabase, context.userId, ["admin"]);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;
    const {
      data: rows,
      count,
      error,
    } = await supabaseAdmin
      .from("admin_sessions")
      .select("*", { count: "exact" })
      .order("login_at", { ascending: false })
      .range(from, to);
    if (error) {
      console.error("[listAdminSessions]", error);
      throw new Error("Não foi possível carregar as sessões.");
    }
    return { rows: rows ?? [], total: count ?? 0, page: data.page, pageSize: data.pageSize };
  });

/** Admin-only export — returns text payload; client wraps in Blob. */
const exportSchema = z.object({
  dataset: z.enum(["articles", "library", "locations", "users", "audit"]),
  format: z.enum(["csv", "json"]),
});

function toCsv(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) return "";
  const headers = Array.from(
    rows.reduce<Set<string>>((acc, r) => {
      Object.keys(r).forEach((k) => acc.add(k));
      return acc;
    }, new Set()),
  );
  const esc = (v: unknown): string => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join(
    "\n",
  );
}

export const exportDataset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => exportSchema.parse(i))
  .handler(async ({ data, context }) => {
    await requireRole(context.supabase, context.userId, ["admin"]);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { logAudit } = await import("@/lib/audit.server");

    let rows: Array<Record<string, unknown>> = [];
    switch (data.dataset) {
      case "articles": {
        const { data: r } = await supabaseAdmin.from("articles").select("*");
        rows = (r ?? []) as Array<Record<string, unknown>>;
        break;
      }
      case "library": {
        const { data: r } = await supabaseAdmin.from("library_items").select("*");
        rows = (r ?? []) as Array<Record<string, unknown>>;
        break;
      }
      case "locations": {
        const { data: r } = await supabaseAdmin.from("help_locations").select("*");
        rows = (r ?? []) as Array<Record<string, unknown>>;
        break;
      }
      case "users": {
        const { data: profs } = await supabaseAdmin
          .from("profiles")
          .select("id, display_name, created_at");
        const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
        const rolesByUser = new Map<string, string[]>();
        for (const r of roles ?? []) {
          const arr = rolesByUser.get(r.user_id) ?? [];
          arr.push(r.role as string);
          rolesByUser.set(r.user_id, arr);
        }
        let emails = new Map<string, string | null>();
        try {
          const { data: list } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 200,
          });
          emails = new Map((list?.users ?? []).map((u) => [u.id, u.email ?? null]));
        } catch {
          /* ignore */
        }
        rows = (profs ?? []).map((p) => ({
          id: p.id,
          display_name: p.display_name,
          email: emails.get(p.id) ?? null,
          roles: (rolesByUser.get(p.id) ?? []).join(","),
          created_at: p.created_at,
        }));
        break;
      }
      case "audit": {
        const { data: r } = await supabaseAdmin
          .from("audit_log")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10000);
        rows = (r ?? []) as Array<Record<string, unknown>>;
        break;
      }
    }

    await logAudit({
      action: "admin_export",
      userId: context.userId,
      targetType: data.dataset,
      metadata: { format: data.format, count: rows.length },
    });

    const payload = data.format === "csv" ? toCsv(rows) : JSON.stringify(rows, null, 2);
    return {
      dataset: data.dataset,
      format: data.format,
      count: rows.length,
      payload,
    };
  });
