import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireAdminContext } from "@/lib/require-admin";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
const CODE_GROUPS = 2;
const GROUP_LEN = 5;
const NUM_CODES = 10;

function randomCode(): string {
  const bytes = new Uint8Array(CODE_GROUPS * GROUP_LEN);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    if (i > 0 && i % GROUP_LEN === 0) out += "-";
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const getRecoveryCodesStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdminContext(context, { roles: ["admin"], requireMfa: false });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("mfa_recovery_codes")
      .select("used_at, created_at")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    const total = data?.length ?? 0;
    const used = (data ?? []).filter((r) => r.used_at !== null).length;
    const generatedAt = (data ?? [])
      .map((r) => r.created_at)
      .sort()
      .pop() ?? null;
    return { total, remaining: total - used, used, generatedAt };
  });

export const generateRecoveryCodes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdminContext(context, { roles: ["admin"], requireMfa: false });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { logAudit } = await import("@/lib/audit.server");

    // check if any codes already exist
    const { count } = await supabaseAdmin
      .from("mfa_recovery_codes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", context.userId);
    const isRegenerate = (count ?? 0) > 0;

    // invalidate existing codes
    if (isRegenerate) {
      await supabaseAdmin
        .from("mfa_recovery_codes")
        .delete()
        .eq("user_id", context.userId);
    }

    const plain: string[] = [];
    const rows: { user_id: string; code_hash: string }[] = [];
    while (plain.length < NUM_CODES) {
      const c = randomCode();
      if (plain.includes(c)) continue;
      plain.push(c);
      rows.push({ user_id: context.userId, code_hash: await sha256Hex(c) });
    }

    const { error } = await supabaseAdmin.from("mfa_recovery_codes").insert(rows);
    if (error) throw new Error(error.message);

    await logAudit({
      action: isRegenerate ? "recovery_code_regenerated" : "recovery_code_generated",
      userId: context.userId,
      userEmail: context.claims.email ?? null,
      metadata: { count: NUM_CODES },
    });

    return { codes: plain };
  });
