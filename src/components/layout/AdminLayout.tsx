import { Link, Outlet, useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronDown,
  Database,
  Instagram,
  LayoutDashboard,
  LogOut,
  MapPin,
  MonitorSmartphone,
  Newspaper,
  ScrollText,
  ShieldCheck,
  Users,
  type LucideIcon,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { recordAdminLogout } from "@/services/authService";
import { GlobalSearch } from "@/components/admin/GlobalSearch";
import { useUserRole } from "@/hooks/useUserRole";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  match?: (path: string) => boolean;
  adminOnly?: boolean;
  hideFrom?: ("viewer" | "reviewer" | "editor")[];
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
    label: "Conteúdo",
    defaultOpen: true,
    items: [
      {
        to: "/admin/publicacoes",
        label: "Publicações",
        icon: Newspaper,
        match: (p) => p === "/admin/publicacoes" || p.startsWith("/admin/article"),
      },
      { to: "/admin/instagram", label: "Instagram", icon: Instagram, adminOnly: true },
      { to: "/admin/biblioteca", label: "Biblioteca", icon: BookOpen },
      { to: "/admin/mapa", label: "Rede de Proteção", icon: MapPin },
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

export function AdminLayout() {
  const router = useRouter();
  const navigate = useNavigate();
  const loc = useLocation();
  const qc = useQueryClient();
  const logoutFn = useServerFn(recordAdminLogout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { roles, isAdmin } = useUserRole();

  async function logout() {
    await logoutFn().catch(() => {});
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="bg-background min-h-dvh font-sans text-foreground">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <header className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden rounded-lg border border-border p-2.5 bg-card hover:bg-accent/50"
              aria-label="Abrir menu"
            >
              <LayoutDashboard className="size-4" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--orange)] font-bold inline-flex items-center gap-1.5">
                <ShieldAlert className="size-3.5" /> Infância Protegida
              </p>
              <h1 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-[color:var(--navy-deep)]">
                Painel Administrativo
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <GlobalSearch />
            <div className="hidden sm:flex flex-wrap gap-1">
              {roles.slice(0, 2).map((r) => (
                <span
                  key={r}
                  className="rounded-full bg-[color:var(--orange)]/15 text-[color:var(--navy-deep)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                >
                  {r}
                </span>
              ))}
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <LogOut className="size-4" /> Sair
            </button>
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
          <nav
            className={`${mobileOpen ? "block mb-6" : "hidden"} lg:block lg:sticky lg:top-8 self-start`}
          >
            <div className="space-y-6">
              {navGroups.map((g) => (
                <NavSection
                  key={g.label}
                  group={g}
                  pathname={loc.pathname}
                  roles={roles}
                  isAdmin={isAdmin}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </div>
          </nav>

          <main className="min-w-0 pb-12">
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
  roles,
  isAdmin,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  roles: string[];
  isAdmin: boolean;
  onNavigate: () => void;
}) {
  const items = group.items.filter((i) => {
    if (i.adminOnly && !isAdmin) return false;
    if (i.hideFrom && i.hideFrom.some(role => roles.includes(role))) return false;
    return true;
  });
  
  if (items.length === 0) return null;
  
  const [open, setOpen] = useState(group.defaultOpen ?? true);
  
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-1 mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
      >
        {group.label}
        <ChevronDown
          className={`size-3 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const active = item.match ? item.match(pathname) : pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={item.to as any}
                  onClick={onNavigate}
                  className={`inline-flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[color:var(--navy-deep)] text-white shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className={`size-4 shrink-0 ${active ? "text-white" : "text-muted-foreground/70"}`} />
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
