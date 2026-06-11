import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listLatestForHome } from "@/lib/content.functions";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { EditorialArticleCard } from "./EditorialArticleCard";

export function LatestUpdates() {
  const fetchLatest = useServerFn(listLatestForHome);
  const { data } = useQuery({
    queryKey: ["home-latest"],
    queryFn: () => fetchLatest(),
  });

  const items = data?.latest ?? [];
  if (items.length === 0) return null;

  const list = items.slice(0, 6);
  const featured = list[0];
  const rest = list.slice(1);

  return (
    <section className="py-20 sm:py-28 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Últimas atualizações"
          title="Publicado recentemente"
          description="Notícias e casos verificados pela equipe editorial. Conteúdo educativo, sem sensacionalismo."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured && (
            <Reveal>
              <EditorialArticleCard
                to={featured.type === "news" ? "/noticias/$slug" : "/casos/$slug"}
                kind={featured.type === "news" ? "news" : "case"}
                variant="featured"
                slug={featured.slug}
                title={featured.title}
                subtitle={featured.subtitle}
                cover={featured.cover_url}
                category={featured.category}
                publishAt={featured.publish_at ?? featured.updated_at}
              />
            </Reveal>
          )}
          {rest.map((a, i) => (
            <Reveal key={a.id} delay={(i + 1) * 50}>
              <EditorialArticleCard
                to={a.type === "news" ? "/noticias/$slug" : "/casos/$slug"}
                kind={a.type === "news" ? "news" : "case"}
                slug={a.slug}
                title={a.title}
                subtitle={a.subtitle}
                cover={a.cover_url}
                category={a.category}
                publishAt={a.publish_at ?? a.updated_at}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
