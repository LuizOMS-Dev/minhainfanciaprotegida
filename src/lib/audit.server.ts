// Server-only audit logging helper. NEVER import from client code.
import { getRequestHeader } from "@tanstack/react-start/server";

export type AuditAction =
  | "login"
  | "logout"
  | "login_failed"
  | "unauthorized_access"
  | "content_create"
  | "content_update"
  | "content_delete"
  | "content_publish"
  | "content_unpublish"
  | "user_create"
  | "user_update"
  | "user_delete"
  | "role_change"
  | "password_reset"
  | "csv_import"
  | "library_change"
  | "location_change";

export interface LogAuditInput {
  action: AuditAction;
  userId?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  targetTitle?: string | null;
  metadata?: Record<string, unknown> | null;
}

function safeHeader(name: string): string | null {
  try {
    return getRequestHeader(name) ?? null;
  } catch {
    return null;
  }
}

function extractIp(): string | null {
  const xff = safeHeader("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;
  return safeHeader("cf-connecting-ip") ?? safeHeader("x-real-ip");
}

/**
 * Fire-and-forget audit logger. Failures are logged to the server console but
 * never thrown — auditing must not break the user-facing operation.
 */
export async function logAudit(input: LogAuditInput): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let email = input.userEmail ?? null;
    let role = input.userRole ?? null;

    if (input.userId && (!email || !role)) {
      // Best-effort enrichment
      if (!email) {
        try {
          const { data } = await supabaseAdmin.auth.admin.getUserById(input.userId);
          email = data.user?.email ?? null;
        } catch {
          /* ignore */
        }
      }
      if (!role) {
        const { data } = await supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", input.userId);
        role = (data ?? []).map((r) => r.role).join(",") || null;
      }
    }

    const { error } = await supabaseAdmin.from("audit_log").insert({
      user_id: input.userId ?? null,
      user_email: email,
      user_role: role,
      action: input.action,
      target_type: input.targetType ?? null,
      target_id: input.targetId ?? null,
      target_title: input.targetTitle ?? null,
      ip_address: extractIp(),
      user_agent: safeHeader("user-agent"),
      metadata: (input.metadata ?? null) as never,
    });
    if (error) console.warn("[audit] insert failed", error.message);
  } catch (e) {
    console.warn("[audit] logger error", e);
  }
}
