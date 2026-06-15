// Server-only security helpers: CAPTCHA verification, brute-force lockouts,
// admin session tracking. NEVER import from client code.
import { extractIp, extractUserAgent, logAudit } from "@/lib/audit.server";

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_WINDOW_MIN = 15;
const LOCKOUT_DURATION_MIN = 15;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface LockoutStatus {
  locked: boolean;
  locked_until?: string;
  minutes_remaining?: number;
}

export async function checkAccountLockout(email: string): Promise<LockoutStatus> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const normalized = email.toLowerCase().trim();
  const { data } = await supabaseAdmin
    .from("account_lockouts")
    .select("locked_until")
    .eq("email", normalized)
    .maybeSingle();
  if (!data) return { locked: false };
  const until = new Date(data.locked_until);
  if (until.getTime() <= Date.now()) {
    // Expired — clean up
    await supabaseAdmin.from("account_lockouts").delete().eq("email", normalized);
    await logAudit({ action: "account_unlocked", userEmail: normalized });
    return { locked: false };
  }
  return {
    locked: true,
    locked_until: data.locked_until,
    minutes_remaining: Math.ceil((until.getTime() - Date.now()) / 60_000),
  };
}

export async function recordAttempt(
  email: string | null,
  success: boolean,
  reason?: string,
): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const normalized = email?.toLowerCase().trim() ?? null;
  const ip = extractIp();
  const ua = extractUserAgent();

  await supabaseAdmin.from("login_attempts").insert({
    email: normalized,
    ip_address: ip,
    success,
    reason: reason ?? null,
    user_agent: ua,
  });

  if (success || !normalized) return;

  // Count failures in the last N minutes (per email + IP)
  const sinceIso = new Date(Date.now() - LOCKOUT_WINDOW_MIN * 60_000).toISOString();
  const { count } = await supabaseAdmin
    .from("login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("success", false)
    .eq("email", normalized)
    .gte("created_at", sinceIso);

  if ((count ?? 0) >= LOCKOUT_THRESHOLD) {
    const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MIN * 60_000).toISOString();
    await supabaseAdmin.from("account_lockouts").upsert(
      {
        email: normalized,
        locked_until: lockedUntil,
        reason: `${count} failed attempts in ${LOCKOUT_WINDOW_MIN}min`,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    );
    await logAudit({
      action: "brute_force_detected",
      userEmail: normalized,
      metadata: { attempts: count, window_minutes: LOCKOUT_WINDOW_MIN, ip },
    });
    await logAudit({
      action: "account_locked",
      userEmail: normalized,
      metadata: { locked_until: lockedUntil, duration_minutes: LOCKOUT_DURATION_MIN },
    });
  }
}

export interface TurnstileResult {
  success: boolean;
  errorCodes?: string[];
}

export async function verifyTurnstile(token: string | null): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[security] TURNSTILE_SECRET_KEY missing — skipping verification");
    return { success: true }; // soft-fail to avoid lockout if misconfigured
  }
  if (!token) return { success: false, errorCodes: ["missing-input-response"] };

  const ip = extractIp();
  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (ip) form.set("remoteip", ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: form });
    const json = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    return { success: json.success === true, errorCodes: json["error-codes"] };
  } catch (e) {
    console.warn("[security] turnstile verify error", e);
    return { success: false, errorCodes: ["network-error"] };
  }
}

export async function openAdminSession(
  userId: string,
  userEmail: string | null,
  userRole: string | null,
): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("admin_sessions").insert({
    user_id: userId,
    user_email: userEmail,
    user_role: userRole,
    ip_address: extractIp(),
    user_agent: extractUserAgent(),
  });
}

export async function closeAdminSession(userId: string): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Close the most recent open session for this user.
  const { data: open } = await supabaseAdmin
    .from("admin_sessions")
    .select("id")
    .eq("user_id", userId)
    .is("logout_at", null)
    .order("login_at", { ascending: false })
    .limit(1);
  const id = open?.[0]?.id;
  if (!id) return;
  await supabaseAdmin
    .from("admin_sessions")
    .update({ logout_at: new Date().toISOString() })
    .eq("id", id);
}
