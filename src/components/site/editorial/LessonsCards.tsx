import { Lightbulb } from "lucide-react";
import { SafeHtml } from "@/components/site/SafeHtml";
import { SectionLabel } from "./SectionLabel";

/** Splits HTML into list items (<li>) or paragraphs as discrete lessons. */
function extractItems(html: string): string[] {
  const li = Array.from(html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)).map((m) => m[1].trim());
  if (li.length) return li;
  const p = Array.from(html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)).map((m) => m[1].trim());
  return p.length ? p : [html];
}

export function LessonsCards({ html, number = 4 }: { html?: string | null; number?: number }) {
  if (!html) return null;
  const items = extractItems(html).filter(Boolean).slice(0, 8);
  if (items.length === 0) return null;

  return (
    <section aria-label="O que aprendemos" className="mt-16">
      <SectionLabel
        number={number}
        eyebrow="Aprendizado"
        title="O que aprendemos com este caso"
        description="Lições que ajudam famílias, escolas e a rede de proteção a evitar que situações semelhantes se repitam."
      />
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((it, i) => (
          <li
            key={i}
            className="group flex gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-[color:var(--orange)]/40 hover:shadow-sm"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--orange-soft)] text-[color:var(--orange)]">
              <Lightbulb className="size-5" aria-hidden />
            </span>
            <SafeHtml
              html={it}
              className="text-sm sm:text-base text-foreground/90 leading-relaxed [&_p]:m-0"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
