// Componentes compartilhados do painel administrativo V3.
// Reutilizam tokens visuais já aprovados (navy, orange, cards arredondados).
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Inbox,
  Loader2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = "text-foreground",
  hint,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
      <div className="rounded-xl bg-muted p-2.5 shrink-0">
        <Icon className={`size-5 ${tone}`} aria-hidden />
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          {label}
        </div>
        <div className="font-display text-2xl font-semibold leading-tight">{value}</div>
        {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function AdminSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-xl bg-muted/60 animate-pulse"
          aria-hidden
        />
      ))}
    </div>
  );
}

export function AdminEmpty({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-10 text-center">
      <Icon className="mx-auto size-8 text-muted-foreground" aria-hidden />
      <p className="mt-3 font-display font-semibold">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function AdminError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--red-inst)]/30 bg-[color:var(--red-inst)]/5 px-4 py-4 text-sm text-[color:var(--red-inst)] flex gap-2">
      <AlertCircle className="size-4 mt-0.5 shrink-0" aria-hidden /> {message}
    </div>
  );
}

export function AdminLoading({ label = "Carregando…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
      <Loader2 className="size-4 animate-spin" aria-hidden /> {label}
    </div>
  );
}

export function QuickActionCard({
  to,
  params,
  icon: Icon,
  title,
  description,
}: {
  to: string;
  params?: Record<string, string>;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params={params as any}
      className="group rounded-2xl border border-border bg-card p-4 hover:border-[color:var(--orange)] hover:shadow-elegant transition-all flex items-start gap-3"
    >
      <div className="rounded-xl bg-[color:var(--navy-deep)] text-white p-2.5 shrink-0">
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <div className="font-display text-sm font-semibold group-hover:text-[color:var(--navy-deep)]">
          {title}
        </div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </Link>
  );
}

export function SecurityBadge({
  active,
  label,
  detail,
}: {
  active: boolean;
  label: string;
  detail?: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 flex items-start gap-3 ${
        active
          ? "border-emerald-200 bg-emerald-50/60"
          : "border-amber-200 bg-amber-50/60"
      }`}
    >
      <div
        className={`rounded-xl p-2 ${
          active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
        }`}
      >
        {active ? (
          <CheckCircle2 className="size-5" aria-hidden />
        ) : (
          <ShieldCheck className="size-5" aria-hidden />
        )}
      </div>
      <div className="min-w-0">
        <div className="font-display text-sm font-semibold text-foreground">{label}</div>
        {detail && (
          <div className="text-xs text-muted-foreground mt-0.5">{detail}</div>
        )}
      </div>
    </div>
  );
}

export function StatusFlow({ current }: { current: string }) {
  const steps = [
    { key: "draft", label: "Rascunho" },
    { key: "review", label: "Revisão" },
    { key: "scheduled", label: "Agendado" },
    { key: "published", label: "Publicado" },
  ];
  const currentIdx = steps.findIndex((s) => s.key === current);
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      {steps.map((s, i) => {
        const reached = currentIdx >= i;
        const active = currentIdx === i;
        return (
          <div key={s.key} className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 font-semibold uppercase tracking-wider ${
                active
                  ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)]"
                  : reached
                    ? "bg-[color:var(--navy-deep)] text-white"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={`w-4 h-px ${reached ? "bg-[color:var(--navy-deep)]" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
