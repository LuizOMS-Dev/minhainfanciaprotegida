import { createFileRoute } from "@tanstack/react-router";
import { Goal, Info, AlertCircle, Compass, Phone, Users } from "lucide-react";
import heroImg from "@/assets/ribbon.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/objetivos")({
  head: () => ({
    meta: [
      { title: "Objetivos — Infância Protegida" },
      {
        name: "description",
        content:
          "Informar, conscientizar, orientar e divulgar canais oficiais de denúncia. Conheça os objetivos do portal Infância Protegida.",
      },
      { property: "og:title", content: "Objetivos — Infância Protegida" },
      {
        property: "og:description",
        content: "O que o portal Infância Protegida busca alcançar na prevenção ao abuso infantil.",
      },
      { property: "og:url", content: "/objetivos" },
      { property: "og:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/objetivos" }],
  }),
  component: Page,
});

const goals = [
  {
    icon: Info,
    title: "Informar com responsabilidade",
    text: "Disponibilizar conteúdo verificado, baseado em fontes oficiais, sobre violência sexual contra crianças e adolescentes no Brasil.",
  },
  {
    icon: AlertCircle,
    title: "Conscientizar a sociedade",
    text: "Mostrar a dimensão real do problema, desmontar mitos e ampliar o debate público — especialmente durante o Maio Laranja.",
  },
  {
    icon: Compass,
    title: "Orientar famílias e educadores",
    text: "Ensinar a reconhecer sinais de alerta, conversar com crianças sobre autoproteção e agir de forma adequada diante de suspeitas.",
  },
  {
    icon: Phone,
    title: "Divulgar canais oficiais",
    text: "Aproximar o cidadão do Disque 100, Conselhos Tutelares, delegacias especializadas e centros de apoio em todo o país.",
  },
  {
    icon: Users,
    title: "Fortalecer a rede de proteção",
    text: "Apoiar a articulação entre escolas, famílias, profissionais de saúde, órgãos públicos e sociedade civil organizada.",
  },
  {
    icon: Goal,
    title: "Prevenir a próxima violência",
    text: "Cada criança informada, cada adulto que aprende a escutar e cada denúncia que sai do silêncio reduz a chance de uma nova violência acontecer.",
  },
];

function Page() {
  return (
    <>
      <PageHero
        image={heroImg}
        eyebrow="Objetivos"
        title="O que o Infância Protegida busca alcançar."
        description="Seis compromissos públicos que orientam nossa atuação diária — da informação à mobilização."
        icon={<Goal className="size-3.5" aria-hidden />}
        variant="orange"
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Nossos compromissos"
            title="Prevenção começa com clareza."
            description="Listamos abaixo, em linguagem direta, o que esperamos contribuir junto à sociedade brasileira."
          />

          <ol className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
            {goals.map((g, i) => (
              <Reveal key={g.title} delay={i * 60}>
                <li className="h-full rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-orange text-[color:var(--navy-deep)] mb-4">
                    <g.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-semibold mb-2">
                    <span className="text-[color:var(--orange)] mr-2">{String(i + 1).padStart(2, "0")}</span>
                    {g.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{g.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
