import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Perguntas Frequentes — Combate ao abuso infantil" },
      {
        name: "description",
        content:
          "Dúvidas comuns sobre denúncia, sigilo, ECA, Conselho Tutelar e atendimento a vítimas de violência sexual contra crianças e adolescentes.",
      },
      { property: "og:title", content: "FAQ — Perguntas Frequentes" },
      { property: "og:description", content: "Tire suas dúvidas sobre denúncia e proteção infantil." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs().map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Page,
});

function faqs() {
  return [
    {
      q: "A denúncia ao Disque 100 é realmente anônima?",
      a: "Sim. O Disque 100 garante o anonimato do denunciante. Você não precisa se identificar e a ligação é gratuita, funcionando 24 horas por dia, todos os dias da semana. Fonte: Ministério dos Direitos Humanos e da Cidadania (gov.br/mdh).",
    },
    {
      q: "O que acontece após eu denunciar?",
      a: "A denúncia é registrada e encaminhada aos órgãos competentes (Conselho Tutelar, Polícia, Ministério Público), que vão investigar e tomar as providências cabíveis. Você não participa da investigação. Fonte: MDHC — Disque 100.",
    },
    {
      q: "Posso denunciar mesmo sem ter certeza?",
      a: "Sim. Suspeita fundamentada é suficiente para acionar o Disque 100 ou o Conselho Tutelar. Quem investiga e confirma os fatos são as autoridades competentes. O ECA, no artigo 13, torna obrigatória a comunicação de suspeita ou confirmação por profissionais de saúde, educação e assistência social.",
    },
    {
      q: "O que é o Conselho Tutelar?",
      a: "É um órgão municipal, autônomo e permanente, encarregado de zelar pelo cumprimento dos direitos da criança e do adolescente (ECA, artigo 131). Existe pelo menos um em cada município brasileiro.",
    },
    {
      q: "Qual a diferença entre abuso e exploração sexual?",
      a: "Abuso sexual é todo ato ou jogo sexual em que uma criança ou adolescente é utilizada para satisfação sexual de um adulto. Exploração sexual envolve troca de favores sexuais por dinheiro, bens ou favores, incluindo prostituição, pornografia e tráfico. Fonte: Childhood Brasil.",
    },
    {
      q: "Crianças costumam mentir sobre abuso?",
      a: "Não. Pesquisas internacionais mostram que falsas alegações de abuso por crianças são extremamente raras. Quando uma criança verbaliza, deve ser ouvida e levada a sério. Fonte: UNICEF.",
    },
    {
      q: "Quais são as penas para esses crimes no Brasil?",
      a: "O estupro de vulnerável (menor de 14 anos) tem pena de reclusão de 8 a 15 anos (CP, art. 217-A). Produzir pornografia infantil tem pena de 4 a 8 anos (ECA, art. 240). Compartilhar esse material tem pena de 3 a 6 anos (ECA, art. 241-A).",
    },
    {
      q: "Como falar com uma criança sobre abuso?",
      a: "Use linguagem simples e adequada à idade, ensine os nomes corretos das partes do corpo, explique a diferença entre 'toque bom' e 'toque ruim' e reforce que ela pode contar com você. Materiais oficiais estão disponíveis no UNICEF Brasil e na Childhood Brasil.",
    },
  ];
}

function Page() {
  const items = faqs();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[color:var(--navy-deep)] text-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
              FAQ
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl font-semibold leading-tight text-balance">
              Perguntas frequentes
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-6 text-lg text-white/85 max-w-2xl">
              Respostas para as dúvidas mais comuns, com base em informações de órgãos oficiais.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Tire suas dúvidas" title="O que você precisa saber" />
          <div className="mt-12 space-y-3">
            {items.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={f.q} delay={i * 40}>
                  <div className="rounded-2xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-md">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full px-5 sm:px-6 py-5 flex items-center gap-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display text-2xl text-[color:var(--orange)] font-semibold w-10 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-semibold text-base sm:text-lg">{f.q}</span>
                      <ChevronDown
                        className={`size-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pl-[68px] text-muted-foreground leading-relaxed animate-fade-in">
                        {f.a}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
