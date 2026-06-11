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
import heroNoticias from "@/assets/hero-noticias.jpg";

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
  readingMinutes?: number | null;
  authorName?: string | null;
  verifiedAt?: string | null;
  severity?: string | null;
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
      readingMinutes: a.reading_minutes,
      authorName: a.author_name,
      verifiedAt: a.last_verified_at,
      severity: a.severity_level,
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

  const featured = all[0];
  const rest = all.slice(1);

  return (
    <>
      <PageHero
        image={heroNoticias}
        eyebrow="Notícias e conscientização"
        icon={<Newspaper className="size-3.5 text-[color:var(--orange)]" />}
        title="O que está acontecendo agora"
        description="Notícias verificadas, pesquisas e atualizações legais. Esta área é atualizada continuamente pelo painel editorial."
      />

      <section className="py-12 sm:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-wrap gap-2 mb-10 -mx-1 px-1 overflow-x-auto"
            role="tablist"
            aria-label="Filtrar por categoria"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] whitespace-nowrap ${
                  cat === c
                    ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)] border-[color:var(--orange)]"
                    : "bg-card text-foreground border-border hover:border-[color:var(--orange)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {all.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">Nenhuma notícia nesta categoria.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured && (
                <Reveal>
                  <EditorialArticleCard
                    to="/noticias/$slug"
                    kind="news"
                    variant="featured"
                    slug={featured.slug}
                    title={featured.title}
                    subtitle={featured.subtitle}
                    cover={featured.cover ?? journalismImg}
                    category={featured.category}
                    publishAt={featured.publishAt}
                    readingMinutes={featured.readingMinutes}
                    authorName={featured.authorName}
                    verifiedAt={featured.verifiedAt}
                    severity={featured.severity}
                  />
                </Reveal>
              )}
              {rest.map((a, i) => (
                <Reveal key={a.key} delay={(i + 1) * 50}>
                  <EditorialArticleCard
                    to="/noticias/$slug"
                    kind="news"
                    slug={a.slug}
                    title={a.title}
                    subtitle={a.subtitle}
                    cover={a.cover ?? journalismImg}
                    category={a.category}
                    publishAt={a.publishAt}
                    readingMinutes={a.readingMinutes}
                    authorName={a.authorName}
                    verifiedAt={a.verifiedAt}
                    severity={a.severity}
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
