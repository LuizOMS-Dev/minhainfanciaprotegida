import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { cases } from "@/content/cases";
import { EditorialArticleCard } from "@/components/site/EditorialArticleCard";
import { Reveal } from "@/components/site/Reveal";
import { ListingHero } from "@/components/site/editorial/ListingHero";
import { CategoryChips } from "@/components/site/editorial/CategoryChips";
import { ReportCTABand } from "@/components/site/editorial/ReportCTABand";
import { ListingFooter } from "@/components/site/editorial/ListingFooter";
import { listPublishedArticles } from "@/lib/content.functions";
import journalismImg from "@/assets/journalism.jpg";

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
  const firstBatch = all.slice(1, 7);
  const remaining = all.slice(7);

  const meta = [
    { label: "Casos publicados", value: String(all.length) },
    { label: "Critério", value: "Apenas fontes oficiais" },
  ];

  return (
    <>
      <ListingHero
        eyebrow="Casos reais e reportagens"
        title="Histórias reais que mudaram leis"
        description="Casos verificados com fontes oficiais. Vítimas nunca são identificadas — o objetivo é educativo, para fortalecer prevenção e proteção."
        meta={meta}
      />

      <CategoryChips
        categories={TAGS}
        value={tag}
        onChange={setTag}
        label="Filtrar casos por categoria"
      />

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {all.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">
              Nenhum caso nesta categoria no momento.
            </p>
          ) : (
            <>
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

              {firstBatch.length > 0 && (
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {firstBatch.map((c, i) => (
                    <Reveal key={c.key} delay={(i + 1) * 40}>
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

              <ReportCTABand />

              {remaining.length > 0 && (
                <>
                  <div className="mt-4 mb-6 flex items-end justify-between">
                    <h2 className="font-display text-xl sm:text-2xl font-semibold text-[color:var(--navy-deep)]">
                      Mais casos
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {remaining.length} {remaining.length === 1 ? "publicação" : "publicações"}
                    </span>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {remaining.map((c, i) => (
                      <Reveal key={c.key} delay={(i + 1) * 30}>
                        <EditorialArticleCard
                          to="/casos/$slug"
                          kind="case"
                          variant="compact"
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
                </>
              )}
            </>
          )}
        </div>
      </section>

      <ListingFooter kind="case" />
    </>
  );
}
