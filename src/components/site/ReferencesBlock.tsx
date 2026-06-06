import { CheckCircle2, ExternalLink, ScrollText } from "lucide-react";

function isSafeHttpUrl(u: string | undefined | null): u is string {
  if (!u) return false;
  return /^https?:\/\//i.test(u.trim());
}

export interface Reference {
  label: string;
  url: string;
}

interface ReferencesBlockProps {
  primary: Reference;
  secondary?: Reference[];
  lastVerified: string; // ISO date
  reviewedBy?: string;
  className?: string;
}

const fmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function ReferencesBlock({
  primary,
  secondary = [],
  lastVerified,
  reviewedBy = "Equipe editorial — Infância Protegida",
  className = "",
}: ReferencesBlockProps) {
  return (
    <aside
      className={`rounded-2xl border border-border bg-card p-6 sm:p-8 ${className}`}
      aria-labelledby="ref-title"
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--orange)]">
        <ScrollText className="size-3.5" aria-hidden />
        <span id="ref-title">Referências oficiais</span>
      </div>

      <div className="mt-4 grid gap-5 md:grid-cols-2">
        {isSafeHttpUrl(primary?.url) && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fonte principal
            </p>
            <a
              href={primary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-start gap-1.5 font-semibold text-foreground hover:text-[color:var(--red-inst)] underline-offset-4 hover:underline"
            >
              {primary.label}
              <ExternalLink className="size-3.5 mt-1 shrink-0" aria-hidden />
            </a>
          </div>
        )}

        {(() => {
          const safe = secondary.filter((s) => isSafeHttpUrl(s.url));
          if (safe.length === 0) return null;
          return (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Fontes complementares
              </p>
              <ul className="mt-1.5 space-y-1.5 text-sm">
                {safe.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1.5 text-foreground/85 hover:text-[color:var(--red-inst)] underline-offset-4 hover:underline"
                    >
                      {s.label}
                      <ExternalLink className="size-3 mt-1 shrink-0" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
      </div>

      <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-[color:var(--orange)]" aria-hidden />
          <span>
            Última verificação:{" "}
            <time dateTime={lastVerified} className="font-semibold text-foreground">
              {fmt.format(new Date(lastVerified))}
            </time>
          </span>
        </span>
        <span>
          Revisado por: <span className="font-semibold text-foreground">{reviewedBy}</span>
        </span>
      </div>
    </aside>
  );
}
