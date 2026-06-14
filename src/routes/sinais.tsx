import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Brain,
  GraduationCap,
  Heart,
  Moon,
  Phone,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { InstitutionalHero } from "@/components/site/InstitutionalHero";

export const Route = createFileRoute("/sinais")({
  head: () => ({
    meta: [
      { title: "Sinais de Alerta — Identifique e proteja a tempo" },
      {
        name: "description",
        content:
          "Conheça os sinais que merecem atenção no comportamento, na escola, no sono, nas relações sociais, no uso da internet e nas emoções. Orientação responsável e baseada em fontes oficiais.",
      },
      { property: "og:title", content: "Sinais de Alerta — Infância Protegida" },
      { property: "og:description", content: "Sinais que merecem atenção, acolhimento e orientação profissional." },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/sinais" }],
  }),
  component: Page,
});

type Category = {
  icon: LucideIcon;
  title: string;
  intro: string;
  signs: string[];
};

const categories: Category[] = [
  {
    icon: Heart,
    title: "Comportamento",
    intro: "Mudanças no jeito de ser que persistem ao longo do tempo merecem observação.",
    signs: [
      "Agressividade ou apatia repentinas, sem causa aparente.",
      "Medo excessivo de uma pessoa, lugar ou situação específica.",
      "Comportamentos regressivos (xixi na cama, chupar dedo, falar como bebê).",
      "Sentimento persistente de culpa, vergonha ou autodepreciação.",
    ],
  },
  {
    icon: GraduationCap,
    title: "Escola",
    intro: "A escola costuma ser onde os primeiros sinais ficam visíveis para outros adultos.",
    signs: [
      "Queda repentina no rendimento escolar.",
      "Faltas frequentes, atrasos, recusa em ir para a escola.",
      "Dificuldade de concentração, distração constante em sala.",
      "Resistência ou medo de ficar com determinado adulto do ambiente escolar.",
    ],
  },
  {
    icon: Moon,
    title: "Sono",
    intro: "Alterações no sono são respostas comuns do corpo a situações de estresse.",
    signs: [
      "Insônia ou dificuldade para adormecer.",
      "Pesadelos recorrentes ou terror noturno.",
      "Acordar várias vezes assustada(o) durante a noite.",
      "Medo de dormir sozinha(o) após já ter superado essa fase.",
    ],
  },
  {
    icon: Users,
    title: "Relacionamento social",
    intro: "Mudanças no contato com amigos e familiares podem indicar sofrimento.",
    signs: [
      "Isolamento de amigos, familiares e atividades antes prazerosas.",
      "Dificuldade de confiar em adultos próximos.",
      "Comportamentos sexualizados incompatíveis com a idade.",
      "Dependência excessiva ou apego intenso a um adulto específico.",
    ],
  },
  {
    icon: Wifi,
    title: "Uso da internet",
    intro: "O ambiente digital pode mostrar pistas importantes sobre o que a criança vive.",
    signs: [
      "Esconder a tela ao ver alguém se aproximar.",
      "Uso noturno excessivo ou em horários incomuns.",
      "Novos 'amigos' adultos que insistem em conversas privadas.",
      "Recebimento de presentes virtuais (skins, créditos) sem explicação.",
    ],
  },
  {
    icon: Brain,
    title: "Mudanças emocionais",
    intro: "Emoções intensas e persistentes não devem ser minimizadas.",
    signs: [
      "Tristeza profunda, choro frequente, desânimo persistente.",
      "Ansiedade, irritabilidade, crises de pânico.",
      "Dores de cabeça ou de estômago recorrentes sem causa médica.",
      "Pensamentos de autoagressão — buscar ajuda profissional imediatamente.",
    ],
  },
];

function Page() {
  return (
    <>
      <InstitutionalHero
        eyebrow="Sinais de alerta"
        title="Aprender a enxergar protege"
        description="A maioria das crianças que sofrem violência não consegue verbalizar o que aconteceu. O corpo e o comportamento, no entanto, falam. Conheça os sinais que merecem atenção, acolhimento e orientação profissional."
      />

      {/* Aviso responsável */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-6">
          <div className="rounded-2xl border border-[color:var(--orange)]/40 bg-[color:var(--surface-soft)] p-5 sm:p-6 flex gap-4 items-start">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--orange-soft)] text-[color:var(--orange)]">
              <AlertTriangle className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <p className="text-sm sm:text-base text-foreground/85 leading-relaxed">
              <strong className="text-[color:var(--navy-deep)]">Importante:</strong> um sinal
              isolado não confirma violência, mas sinais persistentes merecem atenção,
              acolhimento e busca por orientação profissional. Em caso de suspeita, procure o
              Conselho Tutelar ou ligue para o Disque 100.
            </p>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-20 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="O que observar"
            title="Sinais agrupados por área da vida"
            description="A combinação de mudanças em várias áreas — e a sua persistência ao longo do tempo — é o que indica a necessidade de buscar orientação."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Reveal key={c.title} delay={i * 60}>
                <article className="h-full rounded-2xl border border-border bg-card p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[color:var(--surface-soft)] text-[color:var(--navy-deep)]">
                    <c.icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-[color:var(--navy-deep)]">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{c.intro}</p>
                  <ul className="mt-4 space-y-2 text-sm text-foreground/85 leading-relaxed">
                    {c.signs.map((s) => (
                      <li key={s} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--orange)]" aria-hidden />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-10 text-xs text-muted-foreground max-w-3xl">
              Referências:{" "}
              <a className="underline underline-offset-2" href="https://www.unicef.org/brazil/protecao-de-criancas-e-adolescentes" target="_blank" rel="noopener noreferrer">UNICEF Brasil</a>
              ,{" "}
              <a className="underline underline-offset-2" href="https://www.childhood.org.br/" target="_blank" rel="noopener noreferrer">Childhood Brasil</a>
              ,{" "}
              <a className="underline underline-offset-2" href="https://www.gov.br/mdh/pt-br/disque100" target="_blank" rel="noopener noreferrer">Disque 100 / MDHC</a>.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA navy institucional */}
      <section className="py-16 bg-[color:var(--navy-deep)] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
              Identificou sinais que se repetem?
            </h2>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              Não é preciso ter certeza para denunciar. A apuração é da autoridade competente —
              o seu papel é proteger e buscar ajuda.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="tel:100" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-7 py-3.5 font-bold">
                <Phone className="size-4" /> Ligar 100
              </a>
              <Link to="/denuncia" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-semibold hover:bg-white/10">
                Como denunciar
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
