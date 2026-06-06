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
  ChevronDown,
  Database,
  LayoutDashboard,
  LogOut,
  MapPin,
  MonitorSmartphone,
  Newspaper,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getMyRoles } from "@/lib/admin.functions";
import { recordUnauthorizedAccess } from "@/lib/audit.functions";
import { recordAdminLogout } from "@/lib/security.functions";
import { GlobalSearch } from "@/components/admin/GlobalSearch";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel editorial — Infância Protegida" },
      { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    try {
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userRes.user) throw redirect({ to: "/auth" });
      if (!userRes.user.email_confirmed_at) {
        recordUnauthorizedAccess({
          data: { path: `email_not_verified:${location.pathname}` },
        }).catch(() => {});
        await supabase.auth.signOut();
        throw redirect({ to: "/auth" });
      }

      const { roles } = await getMyRoles();
      if (!roles || roles.length === 0) {
        recordUnauthorizedAccess({ data: { path: location.pathname } }).catch(() => {});
        await supabase.auth.signOut();
        throw redirect({ to: "/auth" });
      }

      const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      const needsMfa = aal.data?.nextLevel === "aal2" && aal.data?.currentLevel !== "aal2";

      if (needsMfa) {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const hasVerified = (factors?.totp ?? []).some((f) => f.status === "verified");
        if (hasVerified) {
          await supabase.auth.signOut();
          throw redirect({ to: "/auth" });
        }
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
  icon: LucideIcon;
  match?: (path: string) => boolean;
  adminOnly?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const navGroups: NavGroup[] = [
  {
    label: "Visão geral",
    defaultOpen: true,
    items: [
      {
        to: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        match: (p) => p === "/admin",
      },
    ],
  },
  {
    label: "Publicações",
    defaultOpen: true,
    items: [
      {
        to: "/admin/publicacoes",
        label: "Todos",
        icon: Newspaper,
        match: (p) => p === "/admin/publicacoes" || p.startsWith("/admin/article"),
      },
    ],
  },
  {
    label: "Conteúdo institucional",
    defaultOpen: true,
    items: [
      { to: "/admin/biblioteca", label: "Biblioteca", icon: BookOpen },
      { to: "/admin/mapa", label: "Mapa de ajuda", icon: MapPin },
    ],
  },
  {
    label: "Operação",
    defaultOpen: true,
    items: [
      { to: "/admin/usuarios", label: "Usuários", icon: Users, adminOnly: true },
      { to: "/admin/seguranca", label: "Segurança", icon: ShieldCheck, adminOnly: true },
      { to: "/admin/auditoria", label: "Auditoria", icon: ScrollText, adminOnly: true },
      { to: "/admin/sessoes", label: "Sessões", icon: MonitorSmartphone, adminOnly: true },
      { to: "/admin/backup", label: "Backup", icon: Database, adminOnly: true },
    ],
  },
  {
    label: "Conta",
    defaultOpen: true,
    items: [{ to: "/admin/mfa", label: "Verificação MFA", icon: ShieldCheck }],
  },
];

function AdminShell() {
  const router = useRouter();
  const navigate = useNavigate();
  const loc = useLocation();
  const qc = useQueryClient();
  const logoutFn = useServerFn(recordAdminLogout);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden rounded-full border border-border p-2"
              aria-label="Abrir menu"
            >
              <LayoutDashboard className="size-4" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--orange)] font-semibold inline-flex items-center gap-2">
                <ShieldAlert className="size-3.5" /> Painel editorial
              </p>
              <h1 className="mt-1 font-display text-xl sm:text-2xl font-semibold">
                Administração do portal
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <GlobalSearch />
            <div className="hidden sm:flex flex-wrap gap-1">
              {roles.slice(0, 2).map((r) => (
                <span
                  key={r}
                  className="rounded-full bg-[color:var(--orange)]/15 text-[color:var(--navy-deep)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                >
                  {r}
                </span>
              ))}
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-semibold"
            >
              <LogOut className="size-4" /> Sair
            </button>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
          <nav
            className={`${mobileOpen ? "block" : "hidden"} lg:block lg:sticky lg:top-24 self-start`}
          >
            <div className="space-y-4">
              {navGroups.map((g) => (
                <NavSection
                  key={g.label}
                  group={g}
                  pathname={loc.pathname}
                  isAdmin={isAdmin}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </div>
          </nav>

          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function NavSection({
  group,
  pathname,
  isAdmin,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  isAdmin: boolean;
  onNavigate: () => void;
}) {
  const items = group.items.filter((i) => !i.adminOnly || isAdmin);
  if (items.length === 0) return null;
  const [open, setOpen] = useState(group.defaultOpen ?? true);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        {group.label}
        <ChevronDown
          className={`size-3 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul className="mt-2 flex flex-col gap-0.5">
          {items.map((item) => {
            const active = item.match ? item.match(pathname) : pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={item.to as any}
                  onClick={onNavigate}
                  className={`inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[color:var(--navy-deep)] text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
