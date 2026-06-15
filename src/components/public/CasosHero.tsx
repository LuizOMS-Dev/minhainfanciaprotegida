import { ShieldCheck, FileSearch, CalendarRange, BadgeCheck } from "lucide-react";

interface CasosHeroProps {
  totalCases: number;
  yearRange: { min: number; max: number } | null;
  lastVerifiedLabel: string | null;
}

/**
 * Hero da listagem de Casos — estética "capa de dossiê".
 * Fundo creme com faixa navy superior, metadados editoriais e selo de verificação.
 */
export function CasosHero({ totalCases, yearRange, lastVerifiedLabel }: CasosHeroProps) {
  return (
    <header className="relative isolate overflow-hidden bg-[color:var(--dossier-cream)] text-[color:var(--dossier-ink)]">
      <div className="h-2 w-full bg-[color:var(--navy-deep)]" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 size-[28rem] rounded-full bg-[color:var(--orange)]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--orange)]/40 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.32em] text-[color:var(--navy-deep)]/80">
          <FileSearch className="size-3.5 text-[color:var(--orange)]" aria-hidden />
          Dossiê nacional · Casos reais
        </div>

        <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-balance max-w-4xl text-[color:var(--navy-deep)]">
          Histórias que mudaram leis — e ainda nos ensinam a proteger.
        </h1>

        <p className="mt-5 max-w-3xl text-base sm:text-lg leading-relaxed text-[color:var(--dossier-ink)]/85">
          Cada dossiê reúne fatos verificados, cronologia, repercussão e desdobramentos legais.
          Todas as referências apontam para fontes públicas e oficiais.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <MetaCard
            icon={FileSearch}
            label="Casos publicados"
            value={String(totalCases).padStart(2, "0")}
          />
          <MetaCard
            icon={CalendarRange}
            label="Período coberto"
            value={
              yearRange
                ? yearRange.min === yearRange.max
                  ? String(yearRange.min)
                  : `${yearRange.min} — ${yearRange.max}`
                : "—"
            }
          />
          <MetaCard
            icon={BadgeCheck}
            label="Última verificação"
            value={lastVerifiedLabel ?? "Atualização contínua"}
          />
        </div>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[color:var(--navy-deep)]/15 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--navy-deep)] backdrop-blur">
          <ShieldCheck className="size-4 text-[color:var(--orange)]" aria-hidden />
          Conteúdo verificado · Fontes oficiais
        </div>
      </div>
    </header>
  );
}

function MetaCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[color:var(--dossier-rule)] bg-white/70 p-4 backdrop-blur">
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--navy-deep)] text-[color:var(--orange)]">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--navy-deep)]/70">
          {label}
        </p>
        <p className="mt-1 font-display text-xl font-semibold text-[color:var(--navy-deep)]">{value}</p>
      </div>
    </div>
  );
}
