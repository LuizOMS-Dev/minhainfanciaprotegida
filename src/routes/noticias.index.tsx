import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Newspaper } from "lucide-react";
import { news } from "@/content/news";
import { EditorialArticleCard } from "@/components/site/EditorialArticleCard";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { listPublishedArticles } from "@/lib/content.functions";
import journalismImg from "@/assets/journalism.jpg";

export const Route = createFileRoute("/noticias/")({
  head: () => ({
    meta: [
      { title: "Notícias e conscientização — Infância Protegida" },
      {
        name: "description",
        content:
          "Atualizações, pesquisas, novas leis e ações sobre o combate à violência sexual contra crianças e adolescentes. Conteúdo verificado e baseado em fontes oficiais.",
      },
      { property: "og:title", content: "Notícias — Infância Protegida" },
      {
        property: "og:description",
        content: "Acompanhe pesquisas, leis e mobilizações pelo direito à infância protegida.",
      },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/noticias" }],
  }),
  component: NoticiasPage,
});

const CATEGORIES = ["Todas", "Legislação", "Campanha", "Pesquisa", "Internet", "Direitos"] as const;

type CardData = {
  key: string;
  slug: string;
  title: string;
  subtitle: string | null;
  cover: string | null;
  category: string | null;
  publishAt: string;
};

function NoticiasPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Todas");
  const fetchPublished = useServerFn(listPublishedArticles);
  const { data: published } = useQuery({
    queryKey: ["published-articles", "news"],
    queryFn: () => fetchPublished({ data: { type: "news", limit: 50 } }),
  });

  const all: CardData[] = useMemo(() => {
    const db: CardData[] = (published?.articles ?? []).map((a) => ({
      key: `db-${a.id}`,
      slug: a.slug,
      title: a.title,
      subtitle: a.subtitle,
      cover: a.cover_url ?? null,
      category: a.category ?? "Notícia",
      publishAt: a.publish_at ?? a.updated_at,
    }));
    const stat: CardData[] = news.map((n) => ({
      key: `s-${n.slug}`,
      slug: n.slug,
      title: n.title,
      subtitle: n.excerpt,
      cover: n.image,
      category: n.category,
      publishAt: n.date,
    }));
    const merged = [...db, ...stat].sort((a, b) => +new Date(b.publishAt) - +new Date(a.publishAt));
    return cat === "Todas" ? merged : merged.filter((x) => x.category === cat);
  }, [published, cat]);

  return (
    <>
      <PageHero
        image={journalismImg}
        eyebrow="Notícias e conscientização"
        title="Notícias e atualizações"
        description="Pesquisas, leis e mobilizações pelo direito à infância protegida. Conteúdo verificado e baseado em fontes oficiais."
        icon={<Newspaper className="size-3.5" aria-hidden />}
      />

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div
            role="tablist"
            aria-label="Filtrar notícias por categoria"
            className="flex flex-wrap gap-2 mb-10"
          >
            {CATEGORIES.map((c) => {
              const active = c === cat;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCat(c)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${
                    active
                      ? "bg-[color:var(--navy-deep)] text-white border-[color:var(--navy-deep)]"
                      : "bg-card text-[color:var(--navy-deep)] border-border hover:border-[color:var(--navy-deep)]/40"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {all.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">
              Nenhuma notícia nesta categoria no momento.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {all.map((a, i) => (
                <Reveal key={a.key} delay={(i % 6) * 40}>
                  <EditorialArticleCard
                    to="/noticias/$slug"
                    kind="news"
                    slug={a.slug}
                    title={a.title}
                    subtitle={a.subtitle}
                    cover={a.cover ?? journalismImg}
                    category={a.category}
                    publishAt={a.publishAt}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
