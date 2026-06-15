import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export interface RelatedItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  cover_url: string | null;
  publish_at: string | null;
  updated_at: string;
  category: string | null;
}

const fmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

export function RelatedArticles({
  items,
  type,
  heading = "Conteúdos relacionados",
}: {
  items: RelatedItem[];
  type: "news" | "case";
  heading?: string;
}) {
  if (!items.length) return null;
  const base = type === "news" ? "/noticias" : "/casos";

  return (
    <section aria-label={heading} className="border-t border-border bg-[color:var(--orange-soft)]/40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="font-display text-2xl font-semibold">{heading}</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {items.map((a) => {
            const date = a.publish_at ?? a.updated_at;
            return (
              <Link
                key={a.id}
                to={type === "news" ? "/noticias/$slug" : "/casos/$slug"}
                params={{ slug: a.slug }}
                className="group block rounded-2xl overflow-hidden bg-card border border-border hover-lift"
              >
                {a.cover_url && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={a.cover_url} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  {a.category && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--red-inst)]">{a.category}</span>
                  )}
                  <h3 className="mt-1.5 font-display text-base font-semibold leading-snug group-hover:text-[color:var(--red-inst)] transition-colors">
                    {a.title}
                  </h3>
                  {a.subtitle && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{a.subtitle}</p>}
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    <time dateTime={date}>{fmt.format(new Date(date))}</time>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-8">
          <Link to={base} className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--red-inst)] hover:underline">
            Ver tudo <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ArticleSiblingNav({
  prev,
  next,
  type,
}: {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
  type: "news" | "case";
}) {
  if (!prev && !next) return null;
  const to = type === "news" ? "/noticias/$slug" : "/casos/$slug";
  return (
    <nav aria-label="Navegar entre conteúdos" className="border-t border-border bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 grid sm:grid-cols-2 gap-4">
        {prev ? (
          <Link to={to} params={{ slug: prev.slug }} className="rounded-2xl border border-border bg-card p-5 hover-lift">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">← Anterior</span>
            <p className="mt-1 font-display font-semibold leading-snug">{prev.title}</p>
          </Link>
        ) : <span />}
        {next ? (
          <Link to={to} params={{ slug: next.slug }} className="rounded-2xl border border-border bg-card p-5 hover-lift text-right">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Próximo →</span>
            <p className="mt-1 font-display font-semibold leading-snug">{next.title}</p>
          </Link>
        ) : <span />}
      </div>
    </nav>
  );
}
