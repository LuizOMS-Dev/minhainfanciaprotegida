import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { cases } from "@/content/cases";
import { EditorialArticleCard } from "@/components/site/EditorialArticleCard";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { listPublishedArticles } from "@/lib/content.functions";
import journalismImg from "@/assets/journalism.jpg";
import heroCasos from "@/assets/hero-casos.jpg";

export const Route = createFileRoute("/casos/")({
  head: () => ({
    meta: [
      { title: "Casos reais e reportagens — Infância Protegida" },
      {
        name: "description",
        content:
          "Casos verificados que marcaram o combate ao abuso e à exploração sexual de crianças e adolescentes no Brasil. Apenas fontes oficiais.",
      },
      { property: "og:title", content: "Casos reais — Infância Protegida" },
      {
        property: "og:description",
        content: "Casos que mudaram leis e a forma como o Brasil enfrenta a violência contra crianças.",
      },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/casos" }],
  }),
  component: CasosPage,
});

const TAGS = ["Todos", "Histórico", "Legislação", "Repercussão nacional", "Ambiente digital", "Operação policial"] as const;

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

function CasosPage() {
  const [tag, setTag] = useState<(typeof TAGS)[number]>("Todos");
  const fetchPublished = useServerFn(listPublishedArticles);
  const { data: published } = useQuery({
    queryKey: ["published-articles", "case"],
    queryFn: () => fetchPublished({ data: { type: "case", limit: 50 } }),
  });

  const all: CardData[] = useMemo(() => {
    const db: CardData[] = (published?.articles ?? []).map((a) => ({
      key: `db-${a.id}`,
      slug: a.slug,
      title: a.title,
      subtitle: a.subtitle,
      cover: a.cover_url ?? null,
      category: a.category ?? "Caso real",
      publishAt: a.publish_at ?? a.updated_at,
      authorName: a.author_name,
      verifiedAt: a.last_verified_at,
    }));
    const stat: CardData[] = cases.map((c) => ({
      key: `s-${c.slug}`,
      slug: c.slug,
      title: c.title,
      subtitle: c.summary,
      cover: c.image,
      category: c.tag,
      publishAt: c.date,
    }));
    const merged = [...db, ...stat].sort((a, b) => +new Date(b.publishAt) - +new Date(a.publishAt));
    return tag === "Todos" ? merged : merged.filter((x) => x.category === tag);
  }, [published, tag]);

  const featured = all[0];
  const rest = all.slice(1);

  return (
    <>
      <PageHero
        image={heroCasos}
        eyebrow="Casos e reportagens"
        icon={<BookOpen className="size-3.5 text-[color:var(--orange)]" />}
        title="Histórias reais que mudaram leis"
        description="Cada caso reúne dados verificados, repercussão social e impacto legislativo. Todas as referências levam a fontes oficiais."
      />

      <section className="py-12 sm:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-wrap gap-2 mb-10 -mx-1 px-1 overflow-x-auto"
            role="tablist"
            aria-label="Filtrar casos por categoria"
          >
            {TAGS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tag === t}
                onClick={() => setTag(t)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] whitespace-nowrap ${
                  tag === t
                    ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)] border-[color:var(--orange)]"
                    : "bg-card text-foreground border-border hover:border-[color:var(--orange)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {all.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">Nenhum caso nesta categoria.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured && (
                <Reveal>
                  <EditorialArticleCard
                    to="/casos/$slug"
                    kind="case"
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
              {rest.map((c, i) => (
                <Reveal key={c.key} delay={(i + 1) * 50}>
                  <EditorialArticleCard
                    to="/casos/$slug"
                    kind="case"
                    slug={c.slug}
                    title={c.title}
                    subtitle={c.subtitle}
                    cover={c.cover ?? journalismImg}
                    category={c.category}
                    publishAt={c.publishAt}
                    readingMinutes={c.readingMinutes}
                    authorName={c.authorName}
                    verifiedAt={c.verifiedAt}
                    severity={c.severity}
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
