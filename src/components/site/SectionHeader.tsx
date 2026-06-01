import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}

export function SectionHeader({ eyebrow, title, description, align = "left" }: SectionHeaderProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "";
  return (
    <Reveal>
      <div className={`max-w-3xl ${alignment}`}>
        {eyebrow && (
          <div className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--orange)] mb-4`}>
            <span className="h-px w-8 bg-[color:var(--orange)]" aria-hidden />
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-balance leading-[1.05]">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}
