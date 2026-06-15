import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Newspaper } from "lucide-react";
import { news } from "@/content/news";
import { ArticleCard } from "@/components/site/ArticleCard";
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
          "Atualizações, pesquisas, novas leis e ações sobre o combate à violência sexual contra crianças e adolescentes. Conteúdo atualizado e baseado em fontes oficiais.",
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

function NoticiasPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Todas");
  const fetchPublished = useServerFn(listPublishedArticles);
  const { data: published } = useQuery({
    queryKey: ["published-articles", "news"],
    queryFn: () => fetchPublished({ data: { type: "news", limit: 50 } }),
  });

  const dbList = useMemo(() => {
    const items = published?.articles ?? [];
    return cat === "Todas" ? items : items.filter((n) => n.category === cat);
  }, [published, cat]);

  const staticList = useMemo(() => {
    const filtered = cat === "Todas" ? news : news.filter((n) => n.category === cat);
    return [...filtered].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [cat]);

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
            className="flex flex-wrap gap-2 mb-10"
            role="tablist"
            aria-label="Filtrar por categoria"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] ${
                  cat === c
                    ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)] border-[color:var(--orange)]"
                    : "bg-card text-foreground border-border hover:border-[color:var(--orange)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dbList.map((a, i) => (
              <Reveal key={a.id} delay={i * 60}>
                <Link to="/noticias/$slug" params={{ slug: a.slug }} className="block h-full">
                  <ArticleCard
                    title={a.title}
                    date={a.publish_at ?? a.updated_at}
                    excerpt={a.subtitle ?? ""}
                    image={a.cover_url || journalismImg}
                    tag={a.category ?? "Notícia"}
                    source={{
                      name: a.primary_source_label ?? "Infância Protegida",
                      url: a.primary_source_url ?? "/noticias",
                    }}
                  />
                </Link>
              </Reveal>
            ))}
            {staticList.map((n, i) => (
              <Reveal key={n.slug} delay={(dbList.length + i) * 60}>
                <Link to="/noticias/$slug" params={{ slug: n.slug }} className="block h-full">
                  <ArticleCard
                    title={n.title}
                    date={n.date}
                    excerpt={n.excerpt}
                    image={n.image}
                    tag={n.category}
                    source={n.source}
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
