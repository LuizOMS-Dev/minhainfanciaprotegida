import { Reveal } from "@/components/shared/Reveal";
import type { ReactNode } from "react";

interface PageHeroProps {
  image: string;
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  variant?: "navy" | "orange";
  tall?: boolean;
}

/**
 * Hero compartilhado com imagem de fundo + overlay temático.
 * Mantém o título legível e segue a paleta navy/orange do projeto.
 */
export function PageHero({
  image,
  eyebrow,
  title,
  description,
  icon,
  variant = "navy",
  tall = false,
}: PageHeroProps) {
  const isNavy = variant === "navy";
  const overlay = isNavy
    ? "linear-gradient(120deg, rgba(11,20,45,0.92) 0%, rgba(11,20,45,0.78) 45%, rgba(232,108,42,0.45) 100%)"
    : "linear-gradient(120deg, rgba(232,108,42,0.88) 0%, rgba(232,108,42,0.7) 50%, rgba(11,20,45,0.55) 100%)";
  const textColor = isNavy ? "text-white" : "text-[color:var(--navy-deep)]";
  const subTextColor = isNavy ? "text-white/85" : "text-[color:var(--navy-deep)]/80";
  const chipBorder = isNavy
    ? "border-white/20 bg-white/5 text-white"
    : "border-[color:var(--navy-deep)]/20 bg-white/40 text-[color:var(--navy-deep)]";

  return (
    <section
      className={`relative isolate overflow-hidden ${textColor} ${
        tall ? "py-24 sm:py-32" : "py-20 sm:py-28"
      }`}
    >
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover animate-kenburns"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: overlay }}
        />
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <Reveal>
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${chipBorder}`}
            >
              {icon}
              {eyebrow}
            </span>
          </Reveal>
        )}
        <Reveal delay={120}>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-balance">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={220}>
            <p className={`mt-6 text-lg max-w-2xl leading-relaxed ${subTextColor}`}>{description}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
