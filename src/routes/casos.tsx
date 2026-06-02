import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { cases } from "@/content/cases";
import { ArticleCard } from "@/components/site/ArticleCard";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/casos")({
  head: () => ({
    meta: [
      { title: "Casos reais e reportagens — Infância Protegida" },
      {
        name: "description",
        content:
          "Casos verificados que marcaram o combate ao abuso e à exploração sexual de crianças e adolescentes no Brasil — do Caso Araceli ao Caso Felca e Mineblox. Fontes oficiais.",
      },
      { property: "og:title", content: "Casos reais — Infância Protegida" },
      {
        property: "og:description",
        content: "Casos que mudaram leis e a forma como o Brasil enfrenta a violência contra crianças.",
      },
    ],
    links: [{ rel: "canonical", href: "/casos" }],
  }),
  component: CasosPage,
});

const TAGS = ["Todos", "Histórico", "Legislação", "Repercussão nacional", "Ambiente digital", "Operação policial"] as const;

function CasosPage() {
  const [tag, setTag] = useState<(typeof TAGS)[number]>("Todos");
  const list = useMemo(() => {
    const filtered = tag === "Todos" ? cases : cases.filter((c) => c.tag === tag);
    return [...filtered].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [tag]);

  return (
    <>
      <section className="bg-[color:var(--navy-deep)] text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Casos e reportagens"
            title="Histórias reais que mudaram leis"
            description="Cada caso reúne dados verificados, repercussão social e impacto legislativo. Todas as referências levam a fontes oficiais."
            invert
          />
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Filtrar casos por categoria">
            {TAGS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tag === t}
                onClick={() => setTag(t)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] ${
                  tag === t
                    ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)] border-[color:var(--orange)]"
                    : "bg-card text-foreground border-border hover:border-[color:var(--orange)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60}>
                <ArticleCard
                  title={c.title}
                  date={c.date}
                  excerpt={`${c.summary}\n\nImpacto: ${c.impact}`}
                  image={c.image}
                  tag={c.tag}
                  source={c.source}
                  href={c.source.url}
                />
              </Reveal>
            ))}
          </div>

          {list.length === 0 && (
            <p className="text-center text-muted-foreground py-12">Nenhum caso nesta categoria.</p>
          )}
        </div>
      </section>
    </>
  );
}
