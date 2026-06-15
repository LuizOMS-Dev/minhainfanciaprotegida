import { FileText, CheckCircle2 } from "lucide-react";

interface ExecutiveSummaryBlockProps {
  items: string[] | null | undefined;
}

/**
 * Caixa de abertura "Resumo executivo" — estética dossiê (creme + borda navy).
 * Renderiza 3-5 bullets factuais. Não renderiza se vazio.
 */
export function ExecutiveSummaryBlock({ items }: ExecutiveSummaryBlockProps) {
  if (!items || items.length === 0) return null;

  return (
    <section
      aria-label="Resumo executivo"
      className="mt-10 rounded-3xl border-2 border-[color:var(--navy-deep)]/90 bg-[color:var(--dossier-cream)] p-6 sm:p-8 shadow-[0_20px_45px_-25px_rgba(11,20,45,0.5)]"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--navy-deep)] text-[color:var(--orange)]">
          <FileText className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--navy-deep)]/70">
            Dossiê · Abertura
          </p>
          <h2 className="font-display text-2xl font-bold leading-tight text-[color:var(--navy-deep)]">
            Resumo executivo
          </h2>
        </div>
      </div>

      <ul className="mt-5 grid gap-3">
        {items.map((line, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-xl border border-[color:var(--dossier-rule)] bg-white/70 p-3.5 leading-relaxed text-[color:var(--dossier-ink)]"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[color:var(--orange)]" aria-hidden />
            <span className="text-sm">{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
