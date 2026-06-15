import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireRole } from "@/lib/require-role";

const actionEnum = z.enum([
  "login",
  "logout",
  "login_failed",
  "unauthorized_access",
  "content_create",
  "content_update",
  "content_delete",
  "content_publish",
  "content_unpublish",
  "user_create",
  "user_update",
  "user_delete",
  "role_change",
  "password_reset",
  "csv_import",
  "library_change",
  "location_change",
  "email_not_verified_login_attempt",
  "brute_force_detected",
  "account_locked",
  "account_unlocked",
  "captcha_failed",
  "captcha_bypassed_attempt",
  "login_blocked_by_captcha",
  "mfa_enabled",
  "mfa_disabled",
  "mfa_success",
  "mfa_failed",
  "mfa_reset",
  "admin_export",
  "recovery_code_generated",
  "recovery_code_used",
  "recovery_code_regenerated",
  "csp_violation",
]);

export type AuditActionType = z.infer<typeof actionEnum>;

type AuditMetadata = null | { [key: string]: string | number | boolean | null };

export interface AuditLogRow {
  id: string;
  user_id: string | null;
  user_email: string | null;
  user_role: string | null;
  action: AuditActionType;
  target_type: string | null;
  target_id: string | null;
  target_title: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: AuditMetadata;
  created_at: string;
}

/**
 * Legacy public unauthenticated login attempt audit — kept for backward
 * compatibility. New code should call `recordLoginAttemptV2` from
 * `security.functions.ts` which handles CAPTCHA + lockout.
 */
export const recordLoginAttempt = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        email: z.string().email().max(255).optional(),
        success: z.boolean(),
        provider: z.enum(["password", "google"]).default("password"),
        reason: z.string().max(200).optional(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const { logAudit } = await import("@/lib/audit.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let userId: string | null = null;
    if (data.success && data.email) {
      try {
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
        userId =
          list?.users.find((u) => u.email?.toLowerCase() === data.email!.toLowerCase())?.id ?? null;
      } catch {
        /* ignore */
      }
    }
    await logAudit({
      action: data.success ? "login" : "login_failed",
      userId,
      userEmail: data.email ?? null,
      metadata: { provider: data.provider, reason: data.reason ?? null },
    });
    return { ok: true };
  });

export const recordLogout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { logAudit } = await import("@/lib/audit.server");
    const { closeAdminSession } = await import("@/lib/security.server");
    await closeAdminSession(context.userId);
    await logAudit({ action: "logout", userId: context.userId });
    return { ok: true };
  });

export const recordUnauthorizedAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ path: z.string().max(300).optional() }).parse(i ?? {}))
  .handler(async ({ data, context }) => {
    const { logAudit } = await import("@/lib/audit.server");
    await logAudit({
      action: "unauthorized_access",
      userId: context.userId,
      metadata: { path: data.path ?? null },
    });
    return { ok: true };
  });

const listSchema = z.object({
  action: actionEnum.optional(),
  userId: z.string().uuid().optional(),
  targetType: z.string().max(80).optional(),
  search: z.string().max(200).optional(),
  fromDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  toDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  page: z.number().int().min(1).max(1000).default(1),
  pageSize: z.number().int().min(10).max(200).default(50),
});

export const listAuditLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => listSchema.parse(i ?? {}))
  .handler(async ({ data, context }) => {
    await requireRole(context.supabase, context.userId, ["admin"]);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;
    let q = supabaseAdmin
      .from("audit_log")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    if (data.action) q = q.eq("action", data.action);
    if (data.userId) q = q.eq("user_id", data.userId);
    if (data.targetType) q = q.eq("target_type", data.targetType);
    if (data.fromDate) q = q.gte("created_at", `${data.fromDate}T00:00:00Z`);
    if (data.toDate) q = q.lte("created_at", `${data.toDate}T23:59:59Z`);
    if (data.search) {
      const term = data.search.replace(/[%,]/g, "");
      q = q.or(`target_title.ilike.%${term}%,user_email.ilike.%${term}%`);
    }
    const { data: rows, count, error } = await q;
    if (error) {
      console.error("[audit.list]", error);
      throw new Error("Não foi possível carregar a auditoria.");
    }
    return {
      rows: (rows ?? []) as AuditLogRow[],
      total: count ?? 0,
      page: data.page,
      pageSize: data.pageSize,
    };
  });
