interface Props {
  number: number;
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionLabel({ number, eyebrow, title, description }: Props) {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-[color:var(--navy-deep)] text-[color:var(--orange)] text-[11px] font-bold tabular-nums">
          {String(number).padStart(2, "0")}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--navy-deep)]/70">
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-[color:var(--navy-deep)] leading-tight text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </header>
  );
}
