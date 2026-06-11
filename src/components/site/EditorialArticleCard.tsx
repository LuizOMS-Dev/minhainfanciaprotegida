import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, ShieldCheck, User } from "lucide-react";

interface Props {
  to: "/noticias/$slug" | "/casos/$slug";
  slug: string;
  variant?: "default" | "featured" | "compact";
  kind: "news" | "case";
  title: string;
  subtitle?: string | null;
  cover?: string | null;
  category?: string | null;
  publishAt: string;
  readingMinutes?: number | null;
  authorName?: string | null;
  verifiedAt?: string | null;
  severity?: string | null;
}

const fmtShort = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

const SEV: Record<string, { label: string; cls: string }> = {
  baixo: { label: "Baixa", cls: "bg-emerald-100 text-emerald-900" },
  medio: { label: "Média", cls: "bg-amber-100 text-amber-900" },
  alto: { label: "Alta", cls: "bg-orange-100 text-orange-900" },
  gravissimo: { label: "Gravíssima", cls: "bg-red-100 text-red-900" },
};

export function EditorialArticleCard(p: Props) {
  const featured = p.variant === "featured";
  const compact = p.variant === "compact";
  const label = p.kind === "news" ? "Notícia" : "Caso real";
  const date = fmtShort.format(new Date(p.publishAt));
  const sev = p.severity ? SEV[p.severity] : null;

  return (
    <Link
      to={p.to}
      params={{ slug: p.slug }}
      className={`group relative flex h-full overflow-hidden rounded-3xl border border-border bg-card hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] ${
        featured ? "lg:flex-row flex-col lg:col-span-2" : "flex-col"
      }`}
      aria-label={p.title}
    >
      <div
        className={`relative overflow-hidden bg-muted ${
          featured ? "lg:w-1/2 aspect-[16/10] lg:aspect-auto" : compact ? "aspect-[16/9]" : "aspect-[16/10]"
        }`}
      >
        {p.cover ? (
          <img
            src={p.cover}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="size-full bg-gradient-to-br from-[color:var(--navy-deep)] to-[color:var(--navy)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/85 via-[color:var(--navy-deep)]/25 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em]">
            {label}
          </span>
          {p.category && (
            <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur text-[color:var(--navy-deep)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
              {p.category}
            </span>
          )}
        </div>

        {sev && (
          <span
            className={`absolute top-3 right-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sev.cls}`}
            title={`Gravidade ${sev.label}`}
          >
            {sev.label}
          </span>
        )}

        {featured && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-[color:var(--red-inst)] text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
            Destaque editorial
          </span>
        )}
      </div>

      <div className={`flex flex-col gap-3 p-5 sm:p-6 ${featured ? "lg:w-1/2 lg:justify-between" : ""}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" aria-hidden />
            <time dateTime={p.publishAt}>{date}</time>
          </span>
          {p.readingMinutes && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden /> {p.readingMinutes} min
            </span>
          )}
          {p.authorName && (
            <span className="inline-flex items-center gap-1 truncate max-w-[160px]">
              <User className="size-3" aria-hidden /> {p.authorName}
            </span>
          )}
        </div>

        <h3
          className={`font-display font-semibold leading-[1.15] text-[color:var(--navy-deep)] group-hover:text-[color:var(--red-inst)] transition-colors text-balance ${
            featured ? "text-2xl sm:text-3xl" : compact ? "text-base" : "text-lg sm:text-xl"
          }`}
        >
          {p.title}
        </h3>

        {p.subtitle && (
          <p
            className={`text-sm text-muted-foreground leading-relaxed ${
              featured ? "line-clamp-3" : "line-clamp-2"
            }`}
          >
            {p.subtitle}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--red-inst)]">
            Ler {p.kind === "news" ? "notícia" : "caso"}
            <ArrowRight className="size-3.5 transition group-hover:translate-x-1" aria-hidden />
          </span>
          {p.verifiedAt && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <ShieldCheck className="size-3 text-[color:var(--orange)]" aria-hidden />
              Verificado
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
