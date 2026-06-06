import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Globe,
  KeyRound,
  Lock,
  Mail,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { getSecurityOverview } from "@/lib/admin-overview.functions";
import {
  AdminError,
  AdminSkeleton,
  KpiCard,
  SectionCard,
  SecurityBadge,
} from "@/components/admin/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/seguranca")({
  head: () => ({
    meta: [
      { title: "Central de segurança — Painel" },
      { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
    ],
  }),
  component: SecurityPage,
});

const ACTION_LABEL: Record<string, string> = {
  brute_force_detected: "Força bruta detectada",
  account_locked: "Conta bloqueada",
  unauthorized_access: "Acesso negado",
  captcha_failed: "Falha de CAPTCHA",
  captcha_bypassed_attempt: "Tentativa de burlar CAPTCHA",
  login_blocked_by_captcha: "Login bloqueado por CAPTCHA",
  csp_violation: "Violação de CSP",
  role_change: "Papel alterado",
  user_delete: "Usuário excluído",
  mfa_failed: "MFA falhou",
  mfa_disabled: "MFA desabilitado",
  mfa_reset: "MFA resetado",
  email_not_verified_login_attempt: "E-mail não verificado",
};

function SecurityPage() {
  const fn = useServerFn(getSecurityOverview);
  const q = useQuery({
    queryKey: ["admin-security-overview"],
    queryFn: () => fn(),
    refetchInterval: 60_000,
  });
  const d = q.data;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold inline-flex items-center gap-2">
          <ShieldCheck className="size-5 text-[color:var(--navy-deep)]" /> Central de segurança
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Visão consolidada das proteções, bloqueios e ameaças do painel.
        </p>
      </div>

      {q.isError && <AdminError message="Falha ao carregar a central de segurança." />}

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          label="Bloqueios ativos"
          value={d?.metrics.activeLockoutCount ?? "—"}
          icon={Lock}
          tone={(d?.metrics.activeLockoutCount ?? 0) > 0 ? "text-[color:var(--red-inst)]" : "text-emerald-600"}
        />
        <KpiCard
          label="Falhas 24h"
          value={d?.metrics.failedLogins24h ?? "—"}
          icon={AlertTriangle}
          tone={(d?.metrics.failedLogins24h ?? 0) > 5 ? "text-amber-600" : "text-muted-foreground"}
        />
        <KpiCard
          label="Falhas 7d"
          value={d?.metrics.failedLogins7d ?? "—"}
          icon={ShieldAlert}
        />
        <KpiCard
          label="Eventos críticos 7d"
          value={d?.metrics.criticalEvents7d ?? "—"}
          icon={ScrollText}
          tone={(d?.metrics.criticalEvents7d ?? 0) > 0 ? "text-[color:var(--red-inst)]" : "text-emerald-600"}
        />
      </div>

      {/* Camadas ativas */}
      <SectionCard
        title="Camadas de proteção"
        description="Todos os controles ativos no painel administrativo."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SecurityBadge
            active
            label="MFA obrigatório"
            detail={`${d?.metrics.mfaEnrolledUsers ?? 0} usuário(s) com recovery codes`}
          />
          <SecurityBadge active label="Turnstile (CAPTCHA)" detail="Cloudflare em /auth" />
          <SecurityBadge active label="Rate limit" detail="5 falhas / 15 min → 15 min" />
          <SecurityBadge active label="E-mail verificado" detail="Bloqueio se não confirmado" />
          <SecurityBadge active label="CSP" detail="Política estrita + report" />
          <SecurityBadge active label="Security headers" detail="HSTS · XFO · nosniff" />
          <SecurityBadge active label="Auditoria" detail="Todos eventos persistidos" />
          <SecurityBadge active label="Backup" detail="CSV/JSON sob demanda" />
        </div>
      </SectionCard>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Lockouts */}
        <SectionCard title="Contas bloqueadas" description="Bloqueios temporários ativos.">
          {q.isLoading && <AdminSkeleton rows={3} />}
          {!q.isLoading && (d?.activeLockouts ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" /> Nenhuma conta bloqueada.
            </p>
          )}
          <ul className="divide-y divide-border">
            {(d?.activeLockouts ?? []).map((l) => (
              <li key={l.email} className="py-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="size-3.5 text-[color:var(--red-inst)]" aria-hidden />
                  <span className="font-medium">{l.email}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Liberado em {new Date(l.locked_until).toLocaleString("pt-BR")}
                  {l.reason && <> · {l.reason}</>}
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Top emails falhando */}
        <SectionCard
          title="E-mails com mais falhas (7d)"
          description="Possíveis alvos de ataque automatizado."
        >
          {q.isLoading && <AdminSkeleton rows={3} />}
          {!q.isLoading && (d?.topFailingEmails ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" /> Nenhum padrão suspeito.
            </p>
          )}
          <ul className="divide-y divide-border">
            {(d?.topFailingEmails ?? []).map((it) => (
              <li
                key={it.email}
                className="py-2 flex items-center justify-between text-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <Mail className="size-3.5 text-muted-foreground" /> {it.email}
                </span>
                <span className="font-semibold text-[color:var(--red-inst)]">
                  {it.failures}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Críticos */}
        <SectionCard title="Eventos críticos recentes" description="Últimos 15 eventos de alta gravidade.">
          {q.isLoading && <AdminSkeleton rows={4} />}
          {!q.isLoading && (d?.recentCriticalEvents ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" /> Sem eventos críticos.
            </p>
          )}
          <ul className="divide-y divide-border">
            {(d?.recentCriticalEvents ?? []).map((e) => (
              <li key={e.id} className="py-2.5">
                <div className="text-sm font-medium text-[color:var(--red-inst)] inline-flex items-center gap-2">
                  <ShieldAlert className="size-3.5" />
                  {ACTION_LABEL[e.action] ?? e.action}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {e.user_email ?? "sistema"} · {new Date(e.created_at).toLocaleString("pt-BR")}
                  {e.target_title && <> · {e.target_title}</>}
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Logins */}
        <SectionCard title="Logins recentes" description="Últimos acessos bem-sucedidos.">
          {q.isLoading && <AdminSkeleton rows={4} />}
          {!q.isLoading && (d?.recentLogins ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum login registrado.</p>
          )}
          <ul className="divide-y divide-border">
            {(d?.recentLogins ?? []).map((l, i) => (
              <li key={`${l.email}-${i}`} className="py-2 flex items-center justify-between text-sm">
                <div>
                  <div className="inline-flex items-center gap-2">
                    <KeyRound className="size-3.5 text-emerald-600" />
                    <span className="font-medium">{l.email ?? "—"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 inline-flex items-center gap-1.5">
                    <Globe className="size-3" /> {l.ip_address ?? "—"}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(l.created_at).toLocaleString("pt-BR")}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Sobre as proteções" description="Como cada camada é aplicada">
        <ul className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <li className="rounded-xl border border-border p-3">
            <strong className="text-foreground">MFA TOTP</strong> nativo do Supabase, obrigatório
            para acesso ao painel. Recovery codes hash SHA-256.
          </li>
          <li className="rounded-xl border border-border p-3">
            <strong className="text-foreground">Turnstile</strong> verifica o token no servidor
            antes de qualquer tentativa de login.
          </li>
          <li className="rounded-xl border border-border p-3">
            <strong className="text-foreground">Rate limit</strong>: 5 falhas em 15 min ativam
            bloqueio de 15 min na <code>account_lockouts</code>.
          </li>
          <li className="rounded-xl border border-border p-3">
            <strong className="text-foreground">CSP</strong>: <code>frame-ancestors 'none'</code>,
            <code> object-src 'none'</code>, relatórios em <code>/api/public/csp-report</code>.
          </li>
          <li className="rounded-xl border border-border p-3">
            <strong className="text-foreground">Headers</strong>: HSTS 2 anos+preload, X-Frame-Options
            DENY, nosniff, Referrer-Policy strict-origin-when-cross-origin.
          </li>
          <li className="rounded-xl border border-border p-3">
            <strong className="text-foreground">Auditoria</strong>: <Database className="inline size-3" />
            {" "}registra todos eventos sensíveis com IP + user-agent.
          </li>
        </ul>
      </SectionCard>
    </section>
  );
}
