import { CalendarDays } from "lucide-react";

const fmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function safeFormat(input: string): string {
  // Aceita "YYYY", "YYYY-MM" e "YYYY-MM-DD"; quando incompleto, retorna o próprio texto.
  if (/^\d{4}$/.test(input)) return input;
  if (/^\d{4}-\d{2}$/.test(input)) {
    const [y, m] = input.split("-");
    const date = new Date(Number(y), Number(m) - 1, 1);
    return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
  }
  const d = new Date(input);
  return isNaN(d.getTime()) ? input : fmt.format(d);
}

export function Timeline({ items }: { items: { date: string; text: string }[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-display text-2xl font-bold flex items-center gap-2">
        <CalendarDays className="size-5 text-[color:var(--orange)]" aria-hidden /> Linha do tempo
      </h2>
      <ol className="mt-6 relative border-l-2 border-[color:var(--orange)]/40 pl-6 space-y-6">
        {items.map((it, i) => (
          <li key={i} className="relative">
            <span
              aria-hidden
              className="absolute -left-[31px] top-1.5 size-4 rounded-full border-2 border-[color:var(--orange)] bg-background"
            />
            <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--orange)]">
              {safeFormat(it.date)}
            </p>
            <p className="mt-1 text-foreground/90 leading-relaxed">{it.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
