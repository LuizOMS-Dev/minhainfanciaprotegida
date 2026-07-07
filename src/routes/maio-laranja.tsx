import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ExternalLink, Flame, Goal, HeartHandshake, Users } from "lucide-react";
import ribbonImg from "@/assets/ribbon.jpg";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";

export const Route = createFileRoute("/maio-laranja")({
  head: () => ({
    meta: [
      { title: "Maio Laranja — Origem, história e Caso Araceli" },
      {
        name: "description",
        content:
          "O que é o Maio Laranja, a história do 18 de maio, o Caso Araceli e como participar da campanha nacional de combate ao abuso e exploração sexual.",
      },
      { property: "og:title", content: "Maio Laranja — Campanha Nacional" },
      { property: "og:description", content: "História do 18 de maio, Caso Araceli e objetivos da campanha." },
      { property: "og:url", content: "https://minhainfanciaprotegida.com.br/maio-laranja" },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/maio-laranja" }],
  }),
  component: Page,
});

const timeline = [
  {
    year: "1973",
    title: "O Caso Araceli",
    text: "Araceli Crespo, 8 anos, é sequestrada, drogada, estuprada e assassinada em Vitória (ES). O caso até hoje permanece impune e tornou-se símbolo nacional da luta contra a violência sexual infantil.",
    source: "Senado Federal",
    url: "https://www12.senado.leg.br/noticias/materias/2018/05/17/dia-nacional-de-combate-ao-abuso-sexual-infantil-marca-luta-contra-violencia",
  },
  {
    year: "2000",
    title: "Lei nº 9.970/2000",
    text: "É sancionada a lei que institui o dia 18 de maio como Dia Nacional de Combate ao Abuso e à Exploração Sexual de Crianças e Adolescentes — em referência à data do Caso Araceli.",
    source: "Planalto — Lei 9.970/2000",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l9970.htm",
  },
  {
    year: "2013",
    title: "Maio Laranja",
    text: "A campanha nacional Maio Laranja é fortalecida pelo Comitê Nacional de Enfrentamento à Violência Sexual contra Crianças e Adolescentes, com apoio do Governo Federal e da sociedade civil.",
    source: "Governo Federal — MDHC",
    url: "https://www.gov.br/mdh/pt-br/assuntos/noticias/2024/maio",
  },
  {
    year: "Hoje",
    title: "Mobilização permanente",
    text: "Órgãos públicos, escolas, empresas e cidadãos iluminam fachadas de laranja, usam laços e promovem ações educativas durante todo o mês de maio.",
    source: "MDHC",
    url: "https://www.gov.br/mdh/pt-br/assuntos/noticias",
  },
];

function Page() {
  return (
    <>
      <section className="relative overflow-hidden bg-[color:var(--background)] pt-16 md:pt-24 lg:pt-32 pb-16 lg:pb-24 border-b border-border">
        <div
          className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 opacity-40 mix-blend-multiply pointer-events-none"
          aria-hidden
        >
          <div className="w-[500px] h-[500px] rounded-full bg-[color:var(--orange)]/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="max-w-xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy)]/10 bg-[color:var(--navy)]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[color:var(--navy-deep)] shadow-sm">
                <Flame className="size-3.5 text-[color:var(--orange)]" />
                Campanha nacional · 18 de maio
              </span>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-8 font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-[color:var(--navy-deep)] text-balance">
                Maio <span className="text-[color:var(--orange)]">Laranja</span>
              </h1>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Um mês inteiro dedicado a romper o silêncio sobre a violência sexual contra crianças e
                adolescentes. A cor laranja simboliza alerta, urgência e proteção.
              </p>
            </Reveal>
          </div>

          <Reveal delay={300} className="lg:justify-self-end w-full">
            <div className="relative aspect-[4/3] w-full max-w-lg rounded-2xl overflow-hidden shadow-elegant border border-border/50">
              <img src={ribbonImg} alt="" aria-hidden className="size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/20 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--orange)]">
              O que é
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold leading-tight text-balance">
              Uma mobilização nacional pela proteção da infância
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              O <strong>Maio Laranja</strong> é a campanha brasileira de enfrentamento à violência
              sexual contra crianças e adolescentes. A data central é o{" "}
              <strong>18 de maio — Dia Nacional de Combate ao Abuso e à Exploração Sexual de
              Crianças e Adolescentes</strong>, instituído pela{" "}
              <a
                className="underline underline-offset-4 text-foreground hover:text-[color:var(--orange)]"
                href="https://www.planalto.gov.br/ccivil_03/leis/l9970.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lei nº 9.970/2000
              </a>
              .
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              A data foi escolhida em memória de <strong>Araceli Crespo</strong>, menina de 8 anos
              sequestrada, violentada e assassinada em Vitória (ES), em 18 de maio de 1973. O crime
              segue sem punição definitiva — e tornou Araceli o rosto da luta brasileira contra a
              violência sexual infantil.
            </p>
            <a
              href="https://www.gov.br/mdh/pt-br/assuntos/noticias"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--red-inst)] hover:underline"
            >
              Saiba mais no Ministério dos Direitos Humanos
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </Reveal>

          <Reveal delay={140}>
            <div className="rounded-3xl overflow-hidden shadow-elegant relative aspect-square">
              <img src={ribbonImg} alt="Laço laranja, símbolo da campanha Maio Laranja" loading="lazy" className="size-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 sm:py-28 bg-[color:var(--orange-soft)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Linha do tempo"
            title="Da tragédia de Araceli à mobilização nacional"
            description="Como o Brasil construiu, ao longo de cinco décadas, uma data simbólica para enfrentar a violência sexual infantil."
          />
          <ol className="mt-14 relative border-l-2 border-[color:var(--orange)]/40 pl-8 space-y-10">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 80} as="li">
                <div className="absolute -left-[11px] mt-1.5 size-5 rounded-full bg-[color:var(--orange)] ring-4 ring-[color:var(--orange-soft)]" aria-hidden />
                <div className="flex items-baseline gap-3">
                  <CalendarDays className="size-4 text-[color:var(--orange)]" aria-hidden />
                  <span className="font-display text-2xl font-semibold text-[color:var(--navy)]">{t.year}</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold">{t.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{t.text}</p>
                <a href={t.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--red-inst)] hover:underline">
                  Fonte: {t.source} <ExternalLink className="size-3" />
                </a>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* OBJETIVOS */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Objetivos" title="Por que esta campanha existe" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Goal, title: "Conscientizar", text: "Romper o silêncio e levar informação qualificada à sociedade." },
              { icon: Users, title: "Mobilizar", text: "Engajar famílias, escolas, empresas e governos na proteção infantil." },
              { icon: HeartHandshake, title: "Acolher", text: "Oferecer escuta e orientação a vítimas, familiares e comunidades." },
              { icon: Flame, title: "Denunciar", text: "Fortalecer canais oficiais — em especial o Disque 100." },
            ].map((o, i) => (
              <Reveal key={o.title} delay={i * 70}>
                <div className="h-full rounded-2xl border border-border p-6 hover-lift bg-card">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-orange text-[color:var(--navy-deep)]">
                    <o.icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{o.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{o.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMO PARTICIPAR */}
      <section className="py-20 sm:py-28 bg-[color:var(--navy-deep)] text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Participe" title="Como apoiar a campanha" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Use uma peça laranja durante o mês de maio",
              "Compartilhe informações de fontes oficiais nas redes",
              "Ilumine fachadas, vitrines e escolas com luz laranja",
              "Promova rodas de conversa em escolas e empresas",
              "Memorize e divulgue o número 100",
              "Apoie e contribua com organizações como UNICEF e Childhood Brasil",
            ].map((t, i) => (
              <Reveal key={t} delay={i * 60}>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur flex gap-4">
                  <span className="font-display text-3xl text-[color:var(--orange)]">{String(i + 1).padStart(2, "0")}</span>
                  <p className="leading-relaxed text-white/90">{t}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
