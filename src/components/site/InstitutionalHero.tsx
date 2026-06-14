import type { ReactNode } from "react";
import { Reveal } from "@/components/site/Reveal";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  image?: string;
  actions?: ReactNode;
}

/**
 * Hero institucional padrão: fundo branco, azul-marinho como cor principal,
 * laranja apenas em micro-detalhes. Opcionalmente acompanha uma foto.
 */
export function InstitutionalHero({ eyebrow, title, description, image, actions }: Props) {
  return (
    <section className="bg-background border-b border-border">
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 grid gap-10 lg:gap-14 items-center ${
          image ? "lg:grid-cols-12" : ""
        }`}
      >
        <div className={image ? "lg:col-span-7" : "max-w-3xl"}>
          {eyebrow && (
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-[color:var(--surface-soft)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--navy-deep)]">
                <span className="size-1.5 rounded-full bg-[color:var(--orange)]" aria-hidden />
                {eyebrow}
              </div>
            </Reveal>
          )}
          <Reveal delay={80}>
            <h1 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.08] text-[color:var(--navy-deep)] text-balance">
              {title}
            </h1>
          </Reveal>
          {description && (
            <Reveal delay={160}>
              <p className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            </Reveal>
          )}
          {actions && (
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
            </Reveal>
          )}
        </div>
        {image && (
          <div className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border shadow-elegant">
                <img src={image} alt="" className="size-full object-cover" />
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
