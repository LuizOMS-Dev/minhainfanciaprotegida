import { AlertTriangle } from "lucide-react";
import { SectionLabel } from "./SectionLabel";

export function SignalsCards({
  items,
  number = 5,
}: {
  items?: string[] | null;
  number?: number;
}) {
  if (!items?.length) return null;
  return (
    <section aria-label="Sinais de alerta" className="mt-16">
      <SectionLabel
        number={number}
        eyebrow="Atenção"
        title="Sinais de alerta"
        description="Observar mudanças de comportamento é o primeiro passo da proteção. Nenhum sinal isolado confirma violência — o conjunto e a persistência importam."
      />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--red-inst)]/10 text-[color:var(--red-inst)]">
              <AlertTriangle className="size-4" aria-hidden />
            </span>
            <p className="text-sm text-foreground/90 leading-snug">{s}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
