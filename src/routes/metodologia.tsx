import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import heroImg from "@/assets/journalism.jpg";

export const Route = createFileRoute("/metodologia")({
  head: () => ({
    meta: [
      { title: "Metodologia — Infância Protegida" },
      {
        name: "description",
        content:
          "Como o projeto Infância Protegida produz, verifica e cita seu conteúdo sobre violência sexual contra crianças e adolescentes.",
      },
      { property: "og:title", content: "Metodologia — Infância Protegida" },
      {
        property: "og:description",
        content:
          "Critérios editoriais, hierarquia de fontes, verificação e revisão usadas pelo projeto.",
      },
      { property: "og:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/metodologia" }],
  }),
  component: Page,
});

const passos = [
  {
    n: "01",
    title: "Hierarquia de fontes",
    text: "Priorizamos fontes oficiais (gov.br, MDHC, Senado, Câmara, IBGE), órgãos multilaterais (Unicef, OMS) e bases reconhecidas (FBSP/Anuário, SafeNet).",
  },
  {
    n: "02",
    title: "Verificação cruzada",
    text: "Toda estatística é cruzada em pelo menos duas fontes independentes antes da publicação, com data de referência explícita.",
  },
  {
    n: "03",
    title: "Citação visível",
    text: "Cada bloco de dados traz a fonte ao lado, com link direto para o documento original (PDF, relatório ou lei).",
  },
  {
    n: "04",
    title: "Linguagem protetiva",
    text: "Seguimos diretrizes da Andi e do Unicef para cobertura sobre infância: sem exposição de vítimas, sem detalhes sensacionalistas, com foco na proteção.",
  },
  {
    n: "05",
    title: "Revisão periódica",
    text: "Conteúdos legais e estatísticos são revistos a cada novo Anuário FBSP e a cada alteração legislativa relevante.",
  },
];

function Page() {
  return (
    <>
      <PageHero
        image={heroImg}
        eyebrow="Metodologia"
        title="Como produzimos o conteúdo"
        description="Critérios editoriais usados em todos os artigos, dados e materiais do projeto."
        icon={<FlaskConical className="size-3.5" aria-hidden />}
      />
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-8">
        {passos.map((p, i) => (
          <Reveal key={p.n} delay={i * 80}>
            <article className="flex gap-5 rounded-2xl border border-border bg-card p-6">
              <span className="font-display text-3xl font-semibold text-[color:var(--orange)] shrink-0">
                {p.n}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.text}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </>
  );
}
