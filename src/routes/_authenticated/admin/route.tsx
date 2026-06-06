import {
  createFileRoute,
  isRedirect,
  Link,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import {
  BookOpen,
  Database,
  LogOut,
  MapPin,
  MonitorSmartphone,
  Newspaper,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getMyRoles } from "@/lib/admin.functions";
import { recordUnauthorizedAccess } from "@/lib/audit.functions";
import { recordAdminLogout } from "@/lib/security.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel editorial — Infância Protegida" },
      { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    try {
      // 1) Active user + e-mail verified
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userRes.user) throw redirect({ to: "/auth" });
      if (!userRes.user.email_confirmed_at) {
        recordUnauthorizedAccess({
          data: { path: `email_not_verified:${location.pathname}` },
        }).catch(() => {});
        await supabase.auth.signOut();
        throw redirect({ to: "/auth" });
      }

      // 2) Role gate
      const { roles } = await getMyRoles();
      if (!roles || roles.length === 0) {
        recordUnauthorizedAccess({ data: { path: location.pathname } }).catch(() => {});
        await supabase.auth.signOut();
        throw redirect({ to: "/auth" });
      }

      // 3) MFA gate (AAL2)
      const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      const needsMfa = aal.data?.nextLevel === "aal2" && aal.data?.currentLevel !== "aal2";

      if (needsMfa) {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const hasVerified = (factors?.totp ?? []).some((f) => f.status === "verified");

        if (hasVerified) {
          // Has factor but didn't complete challenge → force re-auth via /auth
          await supabase.auth.signOut();
          throw redirect({ to: "/auth" });
        }
        // No verified factor → only allow /admin/mfa (enrollment)
        if (location.pathname !== "/admin/mfa") {
          throw redirect({ to: "/admin/mfa" });
        }
      }
    } catch (e) {
      if (isRedirect(e)) throw e;
      throw redirect({ to: "/auth" });
    }
  },
  component: AdminShell,
});

interface NavItem {
  to: string;
  label: string;
  icon: typeof Newspaper;
  exact?: boolean;
  adminOnly?: boolean;
}

const nav: NavItem[] = [
  { to: "/admin", label: "Conteúdos", icon: Newspaper, exact: true },
  { to: "/admin/biblioteca", label: "Biblioteca", icon: BookOpen },
  { to: "/admin/mapa", label: "Mapa de ajuda", icon: MapPin },
  { to: "/admin/usuarios", label: "Usuários", icon: Users, adminOnly: true },
  { to: "/admin/auditoria", label: "Auditoria", icon: ScrollText, adminOnly: true },
  { to: "/admin/sessoes", label: "Sessões", icon: MonitorSmartphone, adminOnly: true },
  { to: "/admin/backup", label: "Backup", icon: Database, adminOnly: true },
  { to: "/admin/mfa", label: "Verificação MFA", icon: ShieldCheck },
];

function AdminShell() {
  const router = useRouter();
  const navigate = useNavigate();
  const loc = useLocation();
  const qc = useQueryClient();
  const logoutFn = useServerFn(recordAdminLogout);

  const rolesQ = useQuery({
    queryKey: ["my-roles"],
    queryFn: () => getMyRoles(),
    staleTime: 60_000,
  });
  const roles = rolesQ.data?.roles ?? [];
  const isAdmin = roles.includes("admin");

  async function logout() {
    await logoutFn().catch(() => {});
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="bg-background min-h-[80vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--orange)] font-semibold inline-flex items-center gap-2">
              <ShieldAlert className="size-3.5" /> Painel editorial
            </p>
            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-semibold">
              Administração do portal
            </h1>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold"
          >
            <LogOut className="size-4" /> Sair
          </button>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav className="lg:sticky lg:top-24 self-start">
            <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {nav.filter((i) => !i.adminOnly || isAdmin).map((item) => {
                const active = item.exact
                  ? loc.pathname === item.to ||
                    loc.pathname.startsWith("/admin/article")
                  : loc.pathname.startsWith(item.to);
                return (
                  <li key={item.to} className="shrink-0">
                    <Link
                      to={item.to}
                      className={`inline-flex items-center gap-2 rounded-full lg:rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                        active
                          ? "bg-[color:var(--navy-deep)] text-white"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
