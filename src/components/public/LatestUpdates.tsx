import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar } from "lucide-react";
import { listLatestForHome } from "@/services/articleService";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";

const fmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function LatestUpdates() {
  const fetchLatest = useServerFn(listLatestForHome);
  const { data } = useQuery({
    queryKey: ["home-latest"],
    queryFn: () => fetchLatest(),
  });

  const items = data?.latest ?? [];
  if (items.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Últimas atualizações"
          title="Publicado recentemente"
          description="Notícias e casos publicados pela equipe editorial."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((a, i) => {
            const path = a.type === "news" ? "/noticias/$slug" : "/casos/$slug";
            const label = a.type === "news" ? "Notícia" : "Caso";
            const date = a.publish_at ?? a.updated_at;
            return (
              <Reveal key={a.id} delay={i * 60}>
                <Link
                  to={path}
                  params={{ slug: a.slug }}
                  className="group block h-full rounded-2xl overflow-hidden bg-card border border-border hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
                >
                  {a.cover_url && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={a.cover_url}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                        {a.category ?? label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="size-3" aria-hidden />
                        <time dateTime={date}>{fmt.format(new Date(date))}</time>
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-[color:var(--red-inst)] transition-colors">
                      {a.title}
                    </h3>
                    {a.subtitle && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {a.subtitle}
                      </p>
                    )}
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--red-inst)]">
                      Ler {label.toLowerCase()} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
