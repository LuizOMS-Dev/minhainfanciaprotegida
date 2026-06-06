// Server fns que alimentam o dashboard executivo, central de segurança,
// atividade recente e pesquisa global do painel administrativo.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireRole } from "@/lib/require-role";
import type { AuditActionType } from "@/lib/audit.functions";

export interface AdminOverview {
  articles: {
    total: number;
    published: number;
    review: number;
    scheduled: number;
    drafts: number;
    archived: number;
  };
  library: number;
  locations: number;
  users: number;
  sessions: { active: number; last24h: number };
  loginAttempts24h: number;
  failedLogins24h: number;
  activeLockouts: number;
}

export interface RecentActivityItem {
  id: string;
  action: string;
  user_email: string | null;
  user_role: string | null;
  target_type: string | null;
  target_title: string | null;
  created_at: string;
}

const sinceIso = (hours: number) =>
  new Date(Date.now() - hours * 3_600_000).toISOString();

async function loadAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminOverview> => {
    await requireRole(context.supabase, context.userId, [
      "admin",
      "editor",
      "revisor",
    ]);
    const admin = await loadAdmin();

    const [
      artTotal,
      artPub,
      artRev,
      artSch,
      artDraft,
      artArch,
      library,
      locations,
      users,
      activeSessions,
      sessions24,
      attempts24,
      failed24,
    ] = await Promise.all([
      admin.from("articles").select("*", { count: "exact", head: true }),
      admin.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
      admin.from("articles").select("*", { count: "exact", head: true }).eq("status", "review"),
      admin.from("articles").select("*", { count: "exact", head: true }).eq("status", "scheduled"),
      admin.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
      admin.from("articles").select("*", { count: "exact", head: true }).eq("status", "archived"),
      admin.from("library_items").select("*", { count: "exact", head: true }),
      admin.from("help_locations").select("*", { count: "exact", head: true }),
      admin.from("profiles").select("*", { count: "exact", head: true }),
      admin.from("admin_sessions").select("*", { count: "exact", head: true }).is("logout_at", null),
      admin.from("admin_sessions").select("*", { count: "exact", head: true }).gte("login_at", sinceIso(24)),
      admin.from("login_attempts").select("*", { count: "exact", head: true }).gte("created_at", sinceIso(24)),
      admin.from("login_attempts").select("*", { count: "exact", head: true }).eq("success", false).gte("created_at", sinceIso(24)),
    ]);

    const { count: lockouts } = await admin
      .from("account_lockouts")
      .select("*", { count: "exact", head: true })
      .gt("locked_until", new Date().toISOString());

    return {
      articles: {
        total: artTotal.count ?? 0,
        published: artPub.count ?? 0,
        review: artRev.count ?? 0,
        scheduled: artSch.count ?? 0,
        drafts: artDraft.count ?? 0,
        archived: artArch.count ?? 0,
      },
      library: library.count ?? 0,
      locations: locations.count ?? 0,
      users: users.count ?? 0,
      sessions: {
        active: activeSessions.count ?? 0,
        last24h: sessions24.count ?? 0,
      },
      loginAttempts24h: attempts24.count ?? 0,
      failedLogins24h: failed24.count ?? 0,
      activeLockouts: lockouts ?? 0,
    };
  });

export const getRecentActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({ limit: z.number().int().min(1).max(50).default(15) }).parse(i ?? {}),
  )
  .handler(async ({ data, context }): Promise<{ items: RecentActivityItem[] }> => {
    await requireRole(context.supabase, context.userId, ["admin", "editor", "revisor"]);
    const admin = await loadAdmin();
    const { data: rows } = await admin
      .from("audit_log")
      .select("id, action, user_email, user_role, target_type, target_title, created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    return { items: (rows ?? []) as RecentActivityItem[] };
  });

export interface SecurityOverview {
  activeLockouts: Array<{
    email: string;
    locked_until: string;
    reason: string | null;
  }>;
  recentCriticalEvents: RecentActivityItem[];
  recentLogins: Array<{
    email: string | null;
    ip_address: string | null;
    created_at: string;
  }>;
  topFailingEmails: Array<{ email: string; failures: number }>;
  metrics: {
    failedLogins24h: number;
    failedLogins7d: number;
    criticalEvents7d: number;
    activeLockoutCount: number;
    mfaEnrolledUsers: number;
  };
}

const CRITICAL_ACTIONS = [
  "brute_force_detected",
  "account_locked",
  "unauthorized_access",
  "captcha_failed",
  "captcha_bypassed_attempt",
  "login_blocked_by_captcha",
  "csp_violation",
  "role_change",
  "user_delete",
  "mfa_failed",
  "mfa_disabled",
  "mfa_reset",
  "email_not_verified_login_attempt",
] as const satisfies readonly AuditActionType[];

export const getSecurityOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SecurityOverview> => {
    await requireRole(context.supabase, context.userId, ["admin"]);
    const admin = await loadAdmin();
    const now = new Date().toISOString();

    const [
      lockoutsRes,
      critRes,
      loginsRes,
      failed24Res,
      failed7dRes,
      crit7dRes,
      activeLockoutCountRes,
      mfaCodesRes,
    ] = await Promise.all([
      admin
        .from("account_lockouts")
        .select("email, locked_until, reason")
        .gt("locked_until", now)
        .order("locked_until", { ascending: false })
        .limit(20),
      admin
        .from("audit_log")
        .select("id, action, user_email, user_role, target_type, target_title, created_at")
        .in("action", [...CRITICAL_ACTIONS])
        .order("created_at", { ascending: false })
        .limit(15),
      admin
        .from("login_attempts")
        .select("email, ip_address, created_at")
        .eq("success", true)
        .order("created_at", { ascending: false })
        .limit(10),
      admin
        .from("login_attempts")
        .select("*", { count: "exact", head: true })
        .eq("success", false)
        .gte("created_at", sinceIso(24)),
      admin
        .from("login_attempts")
        .select("*", { count: "exact", head: true })
        .eq("success", false)
        .gte("created_at", sinceIso(24 * 7)),
      admin
        .from("audit_log")
        .select("*", { count: "exact", head: true })
        .in("action", [...CRITICAL_ACTIONS])
        .gte("created_at", sinceIso(24 * 7)),
      admin
        .from("account_lockouts")
        .select("*", { count: "exact", head: true })
        .gt("locked_until", now),
      admin
        .from("mfa_recovery_codes")
        .select("user_id"),
    ]);

    // top failing emails (aggregate in JS over last 7d)
    const { data: failedRows } = await admin
      .from("login_attempts")
      .select("email")
      .eq("success", false)
      .gte("created_at", sinceIso(24 * 7))
      .limit(2000);
    const failByEmail = new Map<string, number>();
    for (const r of failedRows ?? []) {
      if (!r.email) continue;
      failByEmail.set(r.email, (failByEmail.get(r.email) ?? 0) + 1);
    }
    const topFailing = Array.from(failByEmail.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, failures]) => ({ email, failures }));

    const mfaUsers = new Set((mfaCodesRes.data ?? []).map((r) => r.user_id));

    return {
      activeLockouts: (lockoutsRes.data ?? []) as SecurityOverview["activeLockouts"],
      recentCriticalEvents: (critRes.data ?? []) as RecentActivityItem[],
      recentLogins: (loginsRes.data ?? []) as SecurityOverview["recentLogins"],
      topFailingEmails: topFailing,
      metrics: {
        failedLogins24h: failed24Res.count ?? 0,
        failedLogins7d: failed7dRes.count ?? 0,
        criticalEvents7d: crit7dRes.count ?? 0,
        activeLockoutCount: activeLockoutCountRes.count ?? 0,
        mfaEnrolledUsers: mfaUsers.size,
      },
    };
  });

export interface GlobalSearchResult {
  articles: Array<{ id: string; title: string; slug: string; type: string; status: string }>;
  library: Array<{ id: string; title: string; category: string }>;
  locations: Array<{ id: string; name: string; city: string; state: string }>;
  users: Array<{ user_id: string; display_name: string | null; email: string | null }>;
}

export const adminGlobalSearch = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({ q: z.string().min(1).max(120) }).parse(i),
  )
  .handler(async ({ data, context }): Promise<GlobalSearchResult> => {
    await requireRole(context.supabase, context.userId, ["admin", "editor", "revisor"]);
    const admin = await loadAdmin();
    const term = data.q.replace(/[%,]/g, "").trim();
    if (!term) {
      return { articles: [], library: [], locations: [], users: [] };
    }
    const like = `%${term}%`;

    const [articles, library, locations, profiles] = await Promise.all([
      admin
        .from("articles")
        .select("id, title, slug, type, status")
        .or(`title.ilike.${like},slug.ilike.${like}`)
        .limit(5),
      admin
        .from("library_items")
        .select("id, title, category")
        .ilike("title", like)
        .limit(5),
      admin
        .from("help_locations")
        .select("id, name, city, state")
        .or(`name.ilike.${like},city.ilike.${like}`)
        .limit(5),
      admin
        .from("profiles")
        .select("id, display_name")
        .ilike("display_name", like)
        .limit(5),
    ]);

    let users: GlobalSearchResult["users"] = [];
    if (profiles.data && profiles.data.length > 0) {
      // best-effort enrich with email
      let emailById = new Map<string, string | null>();
      try {
        const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
        emailById = new Map((list?.users ?? []).map((u) => [u.id, u.email ?? null]));
      } catch {
        /* ignore */
      }
      users = profiles.data.map((p) => ({
        user_id: p.id,
        display_name: p.display_name,
        email: emailById.get(p.id) ?? null,
      }));
    }

    return {
      articles: (articles.data ?? []) as GlobalSearchResult["articles"],
      library: (library.data ?? []) as GlobalSearchResult["library"],
      locations: (locations.data ?? []) as GlobalSearchResult["locations"],
      users,
    };
  });
