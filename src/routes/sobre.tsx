import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import heroImg from "@/assets/hero-protection.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o Projeto — Infância Protegida" },
      {
        name: "description",
        content:
          "Conheça o projeto Infância Protegida: missão, valores e compromisso com o enfrentamento à violência sexual contra crianças e adolescentes no Brasil.",
      },
      { property: "og:title", content: "Sobre o Projeto — Infância Protegida" },
      {
        property: "og:description",
        content:
          "Iniciativa de utilidade pública alinhada ao Maio Laranja e às diretrizes do MDHC, ECA e Plano Nacional de Enfrentamento.",
      },
      { property: "og:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero
        image={heroImg}
        eyebrow="Sobre o projeto"
        title="Quem somos e por que existimos"
        description="Infância Protegida é uma iniciativa de utilidade pública dedicada à prevenção da violência sexual contra crianças e adolescentes, alinhada à campanha Maio Laranja e ao Plano Nacional de Enfrentamento."
        icon={<Info className="size-3.5" aria-hidden />}
      />
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 prose-content">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-foreground">Nossa missão</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Combater a invisibilidade da violência sexual contra crianças e adolescentes,
            informando famílias, escolas e profissionais sobre sinais, riscos e canais de
            denúncia oficiais — em especial o <strong>Disque 100</strong>, o Conselho
            Tutelar e as Delegacias Especializadas.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-12 font-display text-3xl font-semibold text-foreground">
            Por que existimos
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Dados do Disque 100 (MDHC) e do Anuário Brasileiro de Segurança Pública
            mostram que a maior parte da violência sexual contra crianças ocorre dentro
            de casa, praticada por pessoas conhecidas. Informar é o primeiro passo para
            quebrar o ciclo do silêncio e proteger.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <h2 className="mt-12 font-display text-3xl font-semibold text-foreground">
            Compromissos
          </h2>
          <ul className="mt-4 space-y-3 text-base text-muted-foreground">
            <li>• Conteúdo gratuito, sem fins lucrativos e de livre compartilhamento.</li>
            <li>• Fontes oficiais (gov.br, ECA, MDHC, Unicef, FBSP) em cada afirmação.</li>
            <li>• Linguagem cuidadosa, sem revitimização e sem exposição de vítimas.</li>
            <li>• Acessibilidade e neutralidade político-partidária.</li>
          </ul>
        </Reveal>
      </section>
    </>
  );
}
