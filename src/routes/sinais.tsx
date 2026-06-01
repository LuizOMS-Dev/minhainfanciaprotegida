import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Brain,
  CloudRain,
  Frown,
  GraduationCap,
  Lock,
  Phone,
  Sparkles,
  UserMinus,
  Waves,
} from "lucide-react";
import listeningImg from "@/assets/listening.jpg";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/sinais")({
  head: () => ({
    meta: [
      { title: "Sinais de Alerta — Identifique o abuso a tempo" },
      {
        name: "description",
        content:
          "Mudanças bruscas de comportamento, medos incomuns, isolamento, queda escolar, ansiedade e tristeza excessiva podem ser sinais. Aprenda a reconhecer.",
      },
      { property: "og:title", content: "Identificar Sinais de Abuso" },
      { property: "og:description", content: "Comportamentos que merecem atenção segundo UNICEF e Childhood Brasil." },
      { property: "og:url", content: "/sinais" },
    ],
    links: [{ rel: "canonical", href: "/sinais" }],
  }),
  component: Page,
});

const signs = [
  { icon: Sparkles, title: "Mudanças bruscas de comportamento", desc: "Alterações repentinas de humor, agressividade ou apatia sem causa aparente." },
  { icon: AlertTriangle, title: "Medos incomuns", desc: "Medo excessivo de uma pessoa específica, de lugares ou de ficar sozinho." },
  { icon: UserMinus, title: "Isolamento", desc: "Afastamento de amigos, familiares e atividades que antes gostava." },
  { icon: GraduationCap, title: "Queda no rendimento escolar", desc: "Dificuldade súbita de concentração, faltas e queda nas notas." },
  { icon: Brain, title: "Ansiedade", desc: "Inquietação, dores de cabeça e de estômago recorrentes sem causa médica." },
  { icon: CloudRain, title: "Tristeza excessiva", desc: "Choro frequente, desânimo persistente e sintomas depressivos." },
  { icon: Frown, title: "Comportamentos regressivos", desc: "Voltar a fazer xixi na cama, chupar dedo ou falar como bebê após já ter superado." },
  { icon: Lock, title: "Segredos e silêncio", desc: "Demonstra ter um segredo importante envolvendo um adulto e demonstra culpa ou vergonha." },
  { icon: Waves, title: "Conhecimento sexual incompatível", desc: "Demonstra conhecimento ou comportamento sexual além do esperado para a idade." },
];

function Page() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[color:var(--navy-deep)] text-white py-20 sm:py-28">
        <div className="absolute inset-0 -z-10 opacity-40" style={{ backgroundImage: `url(${listeningImg})`, backgroundSize: "cover", backgroundPosition: "center" }} aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[color:var(--navy-deep)] via-[color:var(--navy-deep)]/85 to-transparent" aria-hidden />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
              <AlertTriangle className="size-3.5 text-[color:var(--orange)]" /> Atenção · Sinais de alerta
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl font-semibold leading-tight text-balance">
              Aprenda a enxergar o que muitas vezes não é dito
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-6 text-lg text-white/85 max-w-2xl leading-relaxed">
              A maioria das crianças que sofrem violência sexual não verbaliza o que aconteceu. O
              corpo e o comportamento, no entanto, falam. Reconhecer os sinais é proteger.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Comportamentos de alerta"
            title="Sinais que merecem sua atenção"
            description="Nenhum sinal isolado é prova de violência, mas a combinação de comportamentos persistentes deve ser observada com cuidado. Em caso de suspeita, busque orientação."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {signs.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <article className="group h-full rounded-2xl border border-border bg-card p-6 hover-lift relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 size-32 rounded-full bg-[color:var(--orange)]/10 transition-transform duration-700 group-hover:scale-125" aria-hidden />
                  <span className="relative inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-orange text-[color:var(--navy-deep)]">
                    <s.icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="relative mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-10 text-xs text-muted-foreground max-w-3xl">
              Referências:{" "}
              <a className="underline underline-offset-2" href="https://www.unicef.org/brazil/protecao-de-criancas-e-adolescentes" target="_blank" rel="noopener noreferrer">
                UNICEF Brasil — Proteção
              </a>
              ,{" "}
              <a className="underline underline-offset-2" href="https://www.childhood.org.br/" target="_blank" rel="noopener noreferrer">
                Childhood Brasil
              </a>
              ,{" "}
              <a className="underline underline-offset-2" href="https://www.gov.br/mdh/pt-br/disque100" target="_blank" rel="noopener noreferrer">
                Disque 100 / MDHC
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 bg-[color:var(--red-inst)] text-[color:var(--red-inst-foreground)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
              Identificou um ou mais sinais?
            </h2>
            <p className="mt-3 text-white/90 max-w-2xl mx-auto">
              Não espere ter certeza. A denúncia é anônima e quem investiga é a autoridade competente.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href="tel:100" className="inline-flex items-center gap-2 rounded-full bg-white text-[color:var(--red-inst)] px-7 py-3 font-bold">
                <Phone className="size-5" /> Ligar 100
              </a>
              <Link to="/denuncia" className="inline-flex items-center gap-2 rounded-full border border-white/60 px-7 py-3 font-semibold hover:bg-white/10">
                Outros canais
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
