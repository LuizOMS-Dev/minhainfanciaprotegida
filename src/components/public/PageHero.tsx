import { Reveal } from "@/components/shared/Reveal";
import { PageBreadcrumb, type Crumb } from "@/components/shared/PageBreadcrumb";
import type { ReactNode } from "react";

interface PageHeroProps {
  /** Foto opcional, exibida como cartão lateral no header claro. */
  image?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Mantido por compatibilidade — o header claro é sempre sobre off-white. */
  variant?: "navy" | "orange" | "plain";
  align?: "left" | "center";
  /** Mantido por compatibilidade com chamadas existentes. */
  tall?: boolean;
  /** Trilha de breadcrumb opcional, renderizada acima do eyebrow. */
  breadcrumb?: Crumb[];
  /** Slot opcional para CTAs abaixo da descrição. */
  children?: ReactNode;
}

/**
 * Header institucional unificado (redesign v2) — padrão CLARO.
 *
 * Fundo off-white, pill navy suave, título grande em navy e foto opcional
 * como cartão lateral. Sem foto, o conteúdo é centralizado. Movimento limitado
 * ao fade-in discreto do Reveal (respeita prefers-reduced-motion). É o mesmo
 * padrão visual da home e dos hubs já atualizados (sinais, escolas, mapa).
 */
export function PageHero({
  image,
  eyebrow,
  title,
  description,
  icon,
  align,
  breadcrumb,
  children,
}: PageHeroProps) {
  const hasImage = Boolean(image);
  // Sem imagem → centralizado; com imagem → duas colunas (texto à esquerda).
  const centered = align ? align === "center" : !hasImage;

  const content = (
    <div className={centered ? "max-w-3xl mx-auto text-center" : "max-w-xl"}>
      {breadcrumb && breadcrumb.length > 0 && (
        <PageBreadcrumb
          items={breadcrumb}
          className={`mb-6 ${centered ? "flex justify-center" : ""}`}
        />
      )}
      {eyebrow && (
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy)]/10 bg-[color:var(--navy)]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[color:var(--navy-deep)] shadow-sm">
            {icon}
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={120}>
        <h1 className="mt-8 font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-[color:var(--navy-deep)] text-balance">
          {title}
        </h1>
      </Reveal>
      {description && (
        <Reveal delay={220}>
          <p
            className={`mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed ${
              centered ? "max-w-3xl mx-auto" : ""
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
      {children && (
        <Reveal delay={300}>
          <div className="mt-10">{children}</div>
        </Reveal>
      )}
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-[color:var(--background)] pt-16 md:pt-24 lg:pt-32 pb-16 lg:pb-24 border-b border-border">
      <div
        className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 opacity-40 mix-blend-multiply pointer-events-none"
        aria-hidden
      >
        <div className="w-[500px] h-[500px] rounded-full bg-[color:var(--navy)]/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {hasImage ? (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {content}
            <Reveal delay={300} className="lg:justify-self-end w-full">
              <div className="relative aspect-[4/3] w-full max-w-lg rounded-2xl overflow-hidden shadow-elegant border border-border/50">
                <img src={image} alt="" aria-hidden className="size-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/20 to-transparent" />
              </div>
            </Reveal>
          </div>
        ) : (
          content
        )}
      </div>
    </section>
  );
}
