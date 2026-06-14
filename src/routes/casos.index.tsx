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

  return (
    <>
      <PageHero
        image={journalismImg}
        eyebrow="Casos reais e reportagens"
        title="Casos reais que ajudam a proteger"
        description="Casos verificados com fontes oficiais. Vítimas nunca são identificadas — o objetivo é educativo, para fortalecer prevenção e proteção."
        icon={<BookOpen className="size-3.5" aria-hidden />}
      />

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div
            role="tablist"
            aria-label="Filtrar casos por categoria"
            className="flex flex-wrap gap-2 mb-10"
          >
            {TAGS.map((t) => {
              const active = t === tag;
              return (
                <button
                  key={t}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTag(t)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${
                    active
                      ? "bg-[color:var(--navy-deep)] text-white border-[color:var(--navy-deep)]"
                      : "bg-card text-[color:var(--navy-deep)] border-border hover:border-[color:var(--navy-deep)]/40"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {all.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">
              Nenhum caso nesta categoria no momento.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {all.map((c, i) => (
                <Reveal key={c.key} delay={(i % 6) * 40}>
                  <EditorialArticleCard
                    to="/casos/$slug"
                    kind="case"
                    slug={c.slug}
                    title={c.title}
                    subtitle={c.subtitle}
                    cover={c.cover ?? journalismImg}
                    category={c.category}
                    publishAt={c.publishAt}
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
