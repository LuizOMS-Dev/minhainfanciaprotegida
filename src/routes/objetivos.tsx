import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import heroImg from "@/assets/ribbon.jpg";

export const Route = createFileRoute("/objetivos")({
  head: () => ({
    meta: [
      { title: "Objetivos — Infância Protegida" },
      {
        name: "description",
        content:
          "Objetivos do projeto Infância Protegida: prevenção, informação, mobilização e fortalecimento da rede de proteção a crianças e adolescentes.",
      },
      { property: "og:title", content: "Objetivos — Infância Protegida" },
      {
        property: "og:description",
        content: "Metas e indicadores da campanha contra a violência sexual infantil.",
      },
      { property: "og:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/objetivos" }],
  }),
  component: Page,
});

const objetivos = [
  {
    title: "Prevenir",
    text: "Reduzir a vulnerabilidade de crianças e adolescentes por meio de informação verificada para famílias, escolas e comunidades.",
  },
  {
    title: "Informar",
    text: "Tornar acessíveis sinais de alerta, canais de denúncia e o arcabouço legal (ECA, Lei nº 13.431/2017, Lei nº 15.211/2025).",
  },
  {
    title: "Mobilizar",
    text: "Engajar a sociedade em torno do 18 de maio (Maio Laranja) com materiais prontos para compartilhamento responsável.",
  },
  {
    title: "Conectar",
    text: "Encaminhar denúncias para os órgãos competentes: Disque 100, Conselho Tutelar, Polícia, Ministério Público e CREAS.",
  },
  {
    title: "Documentar",
    text: "Mapear casos públicos, legislação e boas práticas para consulta de jornalistas, pesquisadores e gestores.",
  },
];

function Page() {
  return (
    <>
      <PageHero
        image={heroImg}
        variant="orange"
        eyebrow="Objetivos"
        title="O que queremos alcançar"
        description="Cinco frentes de atuação alinhadas ao Plano Nacional de Enfrentamento à Violência Sexual contra Crianças e Adolescentes."
        icon={<Target className="size-3.5" aria-hidden />}
      />
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {objetivos.map((o, i) => (
            <Reveal key={o.title} delay={i * 80}>
              <article className="rounded-2xl border border-border bg-card p-6 h-full hover-lift">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {o.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {o.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
