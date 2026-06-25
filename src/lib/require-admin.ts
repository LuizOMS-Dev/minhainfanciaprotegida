import type { SupabaseClient } from "@supabase/supabase-js";
import { requireRole, type AppRole } from "@/services/roleService";

/**
 * Stronger admin gate to use inside server-fn handlers. Validates:
 * 1. e-mail confirmed
 * 2. one of the allowed roles
 * 3. AAL2 by default - user authenticated with MFA — user authenticated with MFA
 *
 * Use after `requireSupabaseAuth` so `context.supabase`, `context.userId`,
 * and `context.claims` are populated.
 */
export interface AdminGateOptions {
  roles?: AppRole[];
  requireMfa?: boolean;
}

interface SupabaseClaims {
  aal?: string;
  email?: string;
}

export async function requireAdminContext(
  context: {
    supabase: SupabaseClient;
    userId: string;
    claims: SupabaseClaims;
  },
  options: AdminGateOptions = {},
): Promise<void> {
  const { roles = ["admin", "editor", "revisor"], requireMfa = true } = options;

  // 1) e-mail verified — check via admin API (claims do not carry this).
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: u, error: uErr } = await supabaseAdmin.auth.admin.getUserById(context.userId);
  if (uErr || !u.user) {
    throw new Error("Sessão inválida.");
  }
  if (!u.user.email_confirmed_at) {
    const { logAudit } = await import("@/lib/audit.server");
    await logAudit({
      action: "email_not_verified_login_attempt",
      userId: context.userId,
      userEmail: u.user.email ?? null,
    });
    throw new Error("E-mail não verificado. Confirme seu e-mail antes de continuar.");
  }

  // 2) role
  await requireRole(context.supabase, context.userId, roles);

  // 3) MFA (AAL2)
  if (requireMfa && context.claims.aal !== "aal2") {
    const { logAudit } = await import("@/lib/audit.server");
    await logAudit({
      action: "unauthorized_access",
      userId: context.userId,
      metadata: { reason: "mfa_required", aal: context.claims.aal ?? null },
    });
    throw new Error("Verificação em duas etapas obrigatória.");
  }
}
