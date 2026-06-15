import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  KeyRound,
  MapPin,
  MonitorSmartphone,
  Newspaper,
  Pencil,
  Plus,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { type RecentActivityItem } from "@/services/dashboardService";
import { useDashboardOverview, useDashboardActivity } from "@/hooks/useDashboard";
import {
  AdminError,
  AdminSkeleton,
  KpiCard,
  QuickActionCard,
  SectionCard,
} from "@/components/admin/AdminUI";
import { useUserRole } from "@/hooks/useUserRole";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: DashboardPage,
});

const ACTION_LABEL: Record<string, string> = {
  login: "Login",
  logout: "Logout",
  login_failed: "Falha de login",
  unauthorized_access: "Acesso negado",
  content_create: "Conteúdo criado",
  content_update: "Conteúdo editado",
  content_delete: "Conteúdo excluído",
  content_publish: "Publicação",
  content_unpublish: "Despublicação",
  user_create: "Usuário criado",
  user_update: "Usuário atualizado",
  user_delete: "Usuário excluído",
  role_change: "Papel alterado",
  password_reset: "Senha redefinida",
  csv_import: "Importação CSV",
  library_change: "Biblioteca",
  location_change: "Mapa",
  email_not_verified_login_attempt: "E-mail não verificado",
  brute_force_detected: "Força bruta detectada",
  account_locked: "Conta bloqueada",
  account_unlocked: "Conta desbloqueada",
  captcha_failed: "Falha de CAPTCHA",
  captcha_bypassed_attempt: "Tentativa de burlar CAPTCHA",
  login_blocked_by_captcha: "Login bloqueado por CAPTCHA",
  mfa_enabled: "MFA habilitado",
  mfa_disabled: "MFA desabilitado",
  mfa_success: "MFA validado",
  mfa_failed: "MFA falhou",
  mfa_reset: "MFA resetado",
  admin_export: "Exportação administrativa",
  recovery_code_generated: "Recovery codes gerados",
  recovery_code_regenerated: "Recovery codes regerados",
  recovery_code_used: "Recovery code usado",
  csp_violation: "Violação de CSP",
};

const CRITICAL = new Set([
  "brute_force_detected",
  "account_locked",
  "unauthorized_access",
  "captcha_failed",
  "captcha_bypassed_attempt",
  "csp_violation",
  "mfa_failed",
  "mfa_disabled",
]);

function categoryFor(action: string): { label: string; color: string } {
  if (action.startsWith("content_")) return { label: "Publicação", color: "bg-blue-50 text-blue-700" };
  if (action.startsWith("mfa_") || action.startsWith("recovery_code_"))
    return { label: "MFA", color: "bg-purple-50 text-purple-700" };
  if (action.startsWith("user_") || action === "role_change")
    return { label: "Usuário", color: "bg-amber-50 text-amber-700" };
  if (
    action === "library_change" ||
    action === "location_change" ||
    action === "csv_import" ||
    action === "admin_export"
  )
    return { label: "Conteúdo", color: "bg-emerald-50 text-emerald-700" };
  if (CRITICAL.has(action) || action === "login_failed")
    return { label: "Segurança", color: "bg-[color:var(--red-inst)]/10 text-[color:var(--red-inst)]" };
  return { label: "Sistema", color: "bg-muted text-muted-foreground" };
}

function DashboardPage() {
  const overviewQ = useDashboardOverview();
  const activityQ = useDashboardActivity(15);
  const { roles, isAdmin, isEditor, isReviewer } = useUserRole();
  const canEdit = isAdmin || isEditor;

  const o = overviewQ.data;

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-border bg-[color:var(--navy-deep)] text-white p-6 sm:p-8 shadow-elegant">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/70 font-semibold">
          <Sparkles className="size-3.5" /> Visão executiva
        </p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold">
          Bem-vindo(a) à central de operações
        </h2>
        <p className="mt-2 text-sm text-white/70 max-w-2xl">
          Acompanhe a saúde editorial, a segurança do painel e os principais
          eventos administrativos em tempo real.
        </p>
      </div>

      {overviewQ.isError && (
        <AdminError message="Falha ao carregar os indicadores." />
      )}

      {/* KPIs editoriais */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Conteúdo editorial
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KpiCard label="Publicados" value={o?.articles.published ?? "—"} icon={CheckCircle2} tone="text-emerald-600" />
          <KpiCard label="Em revisão" value={o?.articles.review ?? "—"} icon={ShieldCheck} tone="text-amber-600" />
          <KpiCard label="Agendados" value={o?.articles.scheduled ?? "—"} icon={Clock} tone="text-blue-600" />
          <KpiCard label="Rascunhos" value={o?.articles.drafts ?? "—"} icon={Pencil} tone="text-muted-foreground" />
          <KpiCard label="Total" value={o?.articles.total ?? "—"} icon={FileText} tone="text-foreground" />
        </div>
      </div>

      {/* KPIs operacionais */}
      {isAdmin && (
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Operação e segurança
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <KpiCard label="Materiais" value={o?.library ?? "—"} icon={BookOpen} />
            <KpiCard label="Locais" value={o?.locations ?? "—"} icon={MapPin} />
            <KpiCard label="Usuários" value={o?.users ?? "—"} icon={Users} />
            <KpiCard
              label="Sessões ativas"
              value={o?.sessions.active ?? "—"}
              icon={MonitorSmartphone}
              hint={`${o?.sessions.last24h ?? 0} nas últimas 24h`}
            />
            <KpiCard
              label="Falhas 24h"
              value={o?.failedLogins24h ?? "—"}
              icon={AlertTriangle}
              tone={(o?.failedLogins24h ?? 0) > 0 ? "text-[color:var(--red-inst)]" : "text-muted-foreground"}
              hint={`${o?.activeLockouts ?? 0} bloqueio(s) ativo(s)`}
            />
          </div>
        </div>
      )}

      {/* Quick actions */}
      <SectionCard title="Ações rápidas" description="Crie ou gerencie em um clique.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {canEdit && (
            <QuickActionCard
              to="/admin/article/$id"
              params={{ id: "new" }}
              icon={Plus}
              title="Nova publicação"
              description="Notícia, caso, risco ou guia"
            />
          )}
          {canEdit && (
            <QuickActionCard
              to="/admin/biblioteca/$id"
              params={{ id: "new" }}
              icon={BookOpen}
              title="Novo material"
              description="Cartilhas e documentos"
            />
          )}
          {canEdit && (
            <QuickActionCard
              to="/admin/mapa/$id"
              params={{ id: "new" }}
              icon={MapPin}
              title="Novo local"
              description="Conselhos, CREAS, delegacias"
            />
          )}
          {isAdmin && (
            <QuickActionCard
              to="/admin/usuarios"
              icon={Users}
              title="Usuários"
              description="Criar e atribuir papéis"
            />
          )}
          {isAdmin && (
            <QuickActionCard
              to="/admin/auditoria"
              icon={ScrollText}
              title="Auditoria"
              description="Investigar eventos"
            />
          )}
          {isAdmin && (
            <QuickActionCard
              to="/admin/seguranca"
              icon={ShieldCheck}
              title="Central de segurança"
              description="Status, lockouts, ameaças"
            />
          )}
          {isAdmin && (
            <QuickActionCard
              to="/admin/backup"
              icon={Database}
              title="Backup"
              description="Exportar dados"
            />
          )}
          <QuickActionCard
            to="/admin/mfa"
            icon={KeyRound}
            title="Verificação MFA"
            description="Gerenciar TOTP e recovery codes"
          />
        </div>
      </SectionCard>

      {/* Recent activity */}
      {isAdmin && (
        <SectionCard
          title="Atividade recente"
          description="Últimos eventos registrados na auditoria."
          action={
            <Link
              to="/admin/auditoria"
              className="text-sm font-semibold text-[color:var(--navy-deep)] hover:underline inline-flex items-center gap-1"
            >
              Ver tudo <Activity className="size-3.5" />
            </Link>
          }
        >
        {activityQ.isLoading && <AdminSkeleton rows={6} />}
        {activityQ.isError && <AdminError message="Falha ao carregar atividade." />}
        {!activityQ.isLoading && (activityQ.data?.items ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum evento ainda.
          </p>
        )}
        <ul className="divide-y divide-border">
          {(activityQ.data?.items ?? []).map((it: RecentActivityItem) => {
            const cat = categoryFor(it.action);
            const isCritical = CRITICAL.has(it.action);
            return (
              <li key={it.id} className="py-3 flex items-start gap-3">
                <span
                  className={`mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cat.color}`}
                >
                  {cat.label}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-medium ${isCritical ? "text-[color:var(--red-inst)]" : ""}`}>
                    {ACTION_LABEL[it.action] ?? it.action}
                    {it.target_title && (
                      <span className="text-muted-foreground font-normal"> · {it.target_title}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {it.user_email ?? "sistema"} · {new Date(it.created_at).toLocaleString("pt-BR")}
                  </div>
                </div>
              </li>
            );
          })}
          </ul>
        </SectionCard>
      )}

      <p className="text-center text-xs text-muted-foreground pt-4">
        Dica: pressione <kbd className="rounded border border-border px-1 font-mono">⌘K</kbd> /{" "}
        <kbd className="rounded border border-border px-1 font-mono">Ctrl K</kbd> para pesquisar.
      </p>
    </section>
  );
}
