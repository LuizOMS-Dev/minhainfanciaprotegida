import { CalendarDays } from "lucide-react";
import { useState } from "react";

const fmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function safeFormat(input: string): string {
  if (/^\d{4}$/.test(input)) return input;
  if (/^\d{4}-\d{2}$/.test(input)) {
    const [y, m] = input.split("-");
    const date = new Date(Number(y), Number(m) - 1, 1);
    return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
  }
  const d = new Date(input);
  return isNaN(d.getTime()) ? input : fmt.format(d);
}

export interface TimelineItem {
  date: string;
  text: string;
  /** Marco opcional: título curto do evento. */
  title?: string;
}

export function Timeline({
  items,
  heading = "Linha do tempo",
}: {
  items: TimelineItem[];
  heading?: string;
}) {
  const [active, setActive] = useState<number>(0);
  if (!items?.length) return null;
  return (
    <section
      aria-label={heading}
      className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl font-bold flex items-center gap-2 text-[color:var(--navy-deep)]">
        <CalendarDays className="size-5 text-[color:var(--orange)]" aria-hidden /> {heading}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Clique em um marco para destacá-lo na cronologia.
      </p>
      <ol className="mt-6 relative border-l-2 border-[color:var(--orange)]/40 pl-6 space-y-4">
        {items.map((it, i) => {
          const isActive = i === active;
          return (
            <li key={i} className="relative">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={`w-full text-left rounded-xl px-4 py-3 transition border ${
                  isActive
                    ? "border-[color:var(--orange)] bg-[color:var(--orange)]/10 shadow-sm"
                    : "border-transparent hover:bg-muted/50"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute -left-[31px] top-5 size-4 rounded-full border-2 transition ${
                    isActive
                      ? "border-[color:var(--orange)] bg-[color:var(--orange)] scale-125"
                      : "border-[color:var(--orange)] bg-background"
                  }`}
                />
                <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--orange)]">
                  {safeFormat(it.date)}
                </p>
                {it.title && (
                  <p className="mt-1 font-display font-semibold text-[color:var(--navy-deep)] leading-snug">
                    {it.title}
                  </p>
                )}
                <p className="mt-1 text-foreground/90 leading-relaxed">{it.text}</p>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
