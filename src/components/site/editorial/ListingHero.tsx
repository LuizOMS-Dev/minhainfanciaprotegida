import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";

interface Props {
  eyebrow: string;
  title: string;
  description: string;
  meta?: { label: string; value: string }[];
}

export function ListingHero({ eyebrow, title, description, meta }: Props) {
  return (
    <header className="relative isolate overflow-hidden border-b border-border bg-background">
      <div
        aria-hidden
        className="absolute -top-32 right-[-10%] -z-10 size-[28rem] rounded-full bg-[color:var(--orange-soft)] blur-3xl opacity-70"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 left-[-10%] -z-10 size-[28rem] rounded-full bg-[color:var(--navy-deep)]/5 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy-deep)]/15 bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--navy-deep)]">
              <span className="size-1.5 rounded-full bg-[color:var(--orange)]" aria-hidden />
              {eyebrow}
            </span>

            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-[color:var(--navy-deep)] text-balance">
              {title}
            </h1>

            <p className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/denuncia"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--red-inst)] text-white px-5 py-2.5 text-sm font-bold uppercase tracking-wider shadow-sm hover:brightness-110 transition"
              >
                <Phone className="size-4" aria-hidden />
                Como denunciar
              </Link>
              <Link
                to="/metodologia"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-[color:var(--navy-deep)] hover:border-[color:var(--navy-deep)] transition"
              >
                Nossa metodologia
              </Link>
            </div>
          </div>

          {meta && meta.length > 0 && (
            <dl className="grid grid-cols-2 gap-3">
              {meta.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {m.label}
                  </dt>
                  <dd className="mt-1.5 font-display text-2xl font-semibold text-[color:var(--navy-deep)]">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </header>
  );
}
