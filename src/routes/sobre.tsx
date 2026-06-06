import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, ShieldCheck, BookOpen, Megaphone } from "lucide-react";
import heroImg from "@/assets/hero-protection.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o Projeto — Infância Protegida" },
      {
        name: "description",
        content:
          "Conheça a missão e o propósito do Infância Protegida: portal brasileiro de conscientização, prevenção e combate ao abuso sexual infantil.",
      },
      { property: "og:title", content: "Sobre o Projeto — Infância Protegida" },
      {
        property: "og:description",
        content: "Missão, propósito e atuação do portal Infância Protegida no combate ao abuso infantil.",
      },
      { property: "og:url", content: "/sobre" },
      { property: "og:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: Page,
});

const pillars = [
  {
    icon: ShieldCheck,
    title: "Proteção",
    text: "Dar visibilidade aos canais oficiais de denúncia e proteção, como o Disque 100, Conselhos Tutelares e delegacias especializadas.",
  },
  {
    icon: BookOpen,
    title: "Educação preventiva",
    text: "Disponibilizar materiais didáticos, sinais de alerta e orientações para famílias, escolas e profissionais que atuam com crianças.",
  },
  {
    icon: Megaphone,
    title: "Conscientização",
    text: "Mobilizar a sociedade ao redor do Maio Laranja e do combate diário ao abuso e exploração sexual de crianças e adolescentes.",
  },
  {
    icon: HeartHandshake,
    title: "Acolhimento",
    text: "Reunir relatos, casos emblemáticos e informação confiável para que vítimas, famílias e educadores não se sintam sozinhos.",
  },
];

function Page() {
  return (
    <>
      <PageHero
        image={heroImg}
        eyebrow="Sobre o Projeto"
        title="Um portal dedicado à proteção da infância brasileira."
        description="Infância Protegida nasceu para informar, mobilizar e prevenir. Reunimos em um só lugar conhecimento, canais oficiais e histórias que precisam ser ouvidas."
        icon={<HeartHandshake className="size-3.5" aria-hidden />}
        variant="navy"
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Missão"
            title="Quebrar o silêncio em torno do abuso infantil com informação responsável."
            description="Acreditamos que conscientização salva. Crianças protegidas começam por adultos informados — pais, professores, vizinhos, profissionais de saúde e todo cidadão que reconhece os sinais e sabe como agir."
          />

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <article className="h-full rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-orange text-[color:var(--navy-deep)] mb-4">
                    <p.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 prose-invert">
          <SectionHeader
            eyebrow="Nosso propósito"
            title="Combater o abuso infantil exige rede, não silêncio."
          />
          <div className="mt-8 space-y-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
            <p>
              O Brasil registra centenas de milhares de denúncias de violência contra crianças e adolescentes todos os anos —
              e estima-se que a maioria dos casos sequer chega aos canais oficiais. A subnotificação é alimentada pelo medo,
              pelo desconhecimento e pelo silêncio dentro das próprias famílias.
            </p>
            <p>
              <strong className="text-foreground">Infância Protegida</strong> é um portal independente de utilidade pública
              que reúne, organiza e dá visibilidade a conteúdo educativo, legislações, casos emblemáticos, notícias e
              localizações de serviços de proteção. Nosso compromisso é com a clareza, a verdade e o respeito às vítimas.
            </p>
            <p>
              Trabalhamos lado a lado com a campanha <strong className="text-foreground">Maio Laranja</strong>, com base
              no Estatuto da Criança e do Adolescente (ECA, Lei 8.069/1990) e nas diretrizes do Ministério dos Direitos
              Humanos, da UNICEF, da Childhood Brasil e da SaferNet.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
