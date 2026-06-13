import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { news } from "@/content/news";
import { EditorialArticleCard } from "@/components/site/EditorialArticleCard";
import { Reveal } from "@/components/site/Reveal";
import { ListingHero } from "@/components/site/editorial/ListingHero";
import { CategoryChips } from "@/components/site/editorial/CategoryChips";
import { ReportCTABand } from "@/components/site/editorial/ReportCTABand";
import { ListingFooter } from "@/components/site/editorial/ListingFooter";
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
      authorName: a.author_name,
      verifiedAt: a.last_verified_at,
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
  const firstBatch = all.slice(1, 7);
  const remaining = all.slice(7);

  const meta = [
    { label: "Conteúdos publicados", value: String(all.length) },
    { label: "Última atualização", value: featured ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(featured.publishAt)) : "—" },
  ];

  return (
    <>
      <ListingHero
        eyebrow="Notícias e conscientização"
        title="O que está acontecendo agora"
        description="Notícias verificadas, pesquisas e atualizações legais sobre proteção da infância. Atualizado pela redação editorial."
        meta={meta}
      />

      <CategoryChips
        categories={CATEGORIES}
        value={cat}
        onChange={setCat}
        label="Filtrar notícias por categoria"
      />

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {all.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">
              Nenhuma notícia nesta categoria no momento.
            </p>
          ) : (
            <>
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

              {firstBatch.length > 0 && (
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {firstBatch.map((a, i) => (
                    <Reveal key={a.key} delay={(i + 1) * 40}>
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

              <ReportCTABand />

              {remaining.length > 0 && (
                <>
                  <div className="mt-4 mb-6 flex items-end justify-between">
                    <h2 className="font-display text-xl sm:text-2xl font-semibold text-[color:var(--navy-deep)]">
                      Mais notícias
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {remaining.length} {remaining.length === 1 ? "publicação" : "publicações"}
                    </span>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {remaining.map((a, i) => (
                      <Reveal key={a.key} delay={(i + 1) * 30}>
                        <EditorialArticleCard
                          to="/noticias/$slug"
                          kind="news"
                          variant="compact"
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
                </>
              )}
            </>
          )}
        </div>
      </section>

      <ListingFooter kind="news" />
    </>
  );
}
