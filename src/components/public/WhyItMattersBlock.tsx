import { TrendingUp } from "lucide-react";

interface WhyItMattersBlockProps {
  text: string | null | undefined;
}

/**
 * Bloco "Por que importa" — explica a relevância nacional/legislativa do caso.
 * Estética dossiê com acento laranja.
 */
export function WhyItMattersBlock({ text }: WhyItMattersBlockProps) {
  if (!text || text.trim().length === 0) return null;

  return (
    <section
      aria-label="Por que este caso importa"
      className="mt-10 rounded-2xl border border-[color:var(--orange)]/30 bg-[color:var(--orange)]/5 p-6 sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--orange)] text-[color:var(--navy-deep)] shadow-[var(--shadow-orange)]">
          <TrendingUp className="size-5" aria-hidden />
        </span>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--navy-deep)]/70">
            Impacto
          </p>
          <h2 className="font-display text-2xl font-bold leading-tight text-[color:var(--navy-deep)]">
            Por que este caso importa
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/90">{text}</p>
        </div>
      </div>
    </section>
  );
}
