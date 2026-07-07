import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays, FileText } from "lucide-react";

interface CaseCardProps {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category?: string | null;
  severity?: string | null;
  eventDate?: string | null;
  publishDate?: string | null;
  source?: { name: string; url?: string } | null;
}

const fmtShort = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric" });

const severityStyles: Record<string, { label: string; chip: string }> = {
  gravissimo: { label: "Gravíssimo", chip: "bg-[color:var(--red-inst)] text-white" },
  alto: { label: "Alto", chip: "bg-[color:var(--red-inst)]/90 text-white" },
  medio: { label: "Médio", chip: "bg-[color:var(--orange)] text-[color:var(--navy-deep)]" },
  baixo: { label: "Baixo", chip: "bg-[color:var(--orange-soft)] text-[color:var(--navy-deep)]" },
};

function safeDate(s?: string | null): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Card editorial de Caso (estética dossiê).
 * Capa 4:3, chip de categoria/severidade, datas (acontecimento + publicação), fonte primária.
 */
export function CaseCard({
  slug,
  title,
  excerpt,
  image,
  category,
  severity,
  eventDate,
  publishDate,
  source,
}: CaseCardProps) {
  const ev = safeDate(eventDate);
  const pub = safeDate(publishDate);
  const sev = severity ? severityStyles[severity] : null;

  return (
    <Link
      to="/casos/$slug"
      params={{ slug }}
      aria-label={title}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-elegant hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/70 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {category && (
            <span className="inline-flex items-center rounded-full bg-white/95 text-[color:var(--navy-deep)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur">
              {category}
            </span>
          )}
          {sev && (
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${sev.chip}`}>
              {sev.label}
            </span>
          )}
        </div>

        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-[color:var(--navy-deep)]/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          <FileText className="size-3" aria-hidden /> Dossiê
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[color:var(--navy-deep)]/70">
          {ev && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3 text-[color:var(--orange)]" aria-hidden />
              <span className="font-semibold uppercase tracking-wider">Acontecimento</span>
              <time dateTime={eventDate ?? undefined}>{fmtShort.format(ev)}</time>
            </span>
          )}
          {pub && (!ev || pub.getTime() !== ev.getTime()) && (
            <span className="inline-flex items-center gap-1">
              <span className="font-semibold uppercase tracking-wider">Publicado</span>
              <time dateTime={publishDate ?? undefined}>{fmtShort.format(pub)}</time>
            </span>
          )}
        </div>

        <h3 className="font-display text-lg sm:text-xl font-semibold leading-snug text-[color:var(--navy-deep)] group-hover:text-[color:var(--red-inst)] transition-colors text-balance">
          {title}
          <ArrowUpRight className="ml-1 inline-block size-4 align-text-top opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{excerpt}</p>

        {source?.name && (
          <p className="mt-auto pt-3 border-t border-border text-[11px] text-[color:var(--navy-deep)]/60">
            Fonte primária: <span className="font-semibold text-[color:var(--navy-deep)]">{source.name}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
