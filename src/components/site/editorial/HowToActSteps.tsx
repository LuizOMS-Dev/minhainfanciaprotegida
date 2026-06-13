import { SectionLabel } from "./SectionLabel";

export function HowToActSteps({
  items,
  number = 6,
  title = "Como agir",
  description = "Passo a passo simples para famílias, escolas e responsáveis ao identificar uma situação de risco.",
  eyebrow = "Ação",
}: {
  items?: string[] | null;
  number?: number;
  title?: string;
  description?: string;
  eyebrow?: string;
}) {
  if (!items?.length) return null;
  return (
    <section aria-label={title} className="mt-16">
      <SectionLabel number={number} eyebrow={eyebrow} title={title} description={description} />
      <ol className="relative space-y-4 border-l-2 border-[color:var(--orange)]/30 pl-6">
        {items.map((step, i) => (
          <li key={i} className="relative">
            <span
              aria-hidden
              className="absolute -left-[34px] inline-flex size-8 items-center justify-center rounded-full bg-[color:var(--navy-deep)] text-[color:var(--orange)] text-xs font-bold ring-4 ring-background"
            >
              {i + 1}
            </span>
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">{step}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
