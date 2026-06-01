import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Eye,
  HandHeart,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import heroImg from "@/assets/hero-protection.jpg";
import silenceImg from "@/assets/silence.jpg";
import ribbonImg from "@/assets/ribbon.jpg";
import joyImg from "@/assets/children-joy.jpg";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { AnimatedNumber } from "@/components/site/AnimatedNumber";
import { SourceTag } from "@/components/site/SourceTag";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Infância Protegida — Maio Laranja · Campanha Nacional" },
      {
        name: "description",
        content:
          "Uma infância protegida muda o futuro de uma sociedade. Conscientização, sinais de alerta, legislação e canais oficiais de denúncia. Disque 100.",
      },
      { property: "og:title", content: "Infância Protegida — Campanha Maio Laranja" },
      {
        property: "og:description",
        content:
          "Milhares de crianças sofrem em silêncio. Informação, atenção e denúncia salvam vidas.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const stats = [
  {
    value: 75984,
    suffix: "",
    label: "Denúncias de violações de direitos de crianças e adolescentes",
    detail: "Recebidas pelo Disque 100 em 2023 — violência sexual entre as três principais.",
    source: "Ministério dos Direitos Humanos e da Cidadania (MDHC)",
    year: "2024",
    url: "https://www.gov.br/mdh/pt-br/assuntos/noticias/2024/maio/disque-100-recebeu-mais-de-75-mil-denuncias-de-violacoes-contra-criancas-e-adolescentes-em-2023",
  },
  {
    value: 60,
    suffix: "%",
    label: "Dos casos ocorrem dentro da própria casa",
    detail: "Maioria dos abusos é cometida por pessoas conhecidas do círculo familiar.",
    source: "Childhood Brasil",
    year: "2023",
    url: "https://www.childhood.org.br/",
  },
  {
    value: 1,
    prefix: "a cada ",
    suffix: " minutos",
    customDisplay: "8",
    label: "Uma criança ou adolescente é vítima de violência sexual no Brasil",
    detail: "Estimativa com base nas denúncias oficiais ao Disque 100.",
    source: "Disque 100 / MDHC",
    year: "2023",
    url: "https://www.gov.br/mdh/pt-br/disque100",
  },
  {
    value: 1,
    prefix: "1 em ",
    suffix: "",
    customDisplay: "5",
    label: "Meninas sofre algum tipo de violência sexual antes dos 18 anos no mundo",
    detail: "Estimativa global do Fundo das Nações Unidas para a Infância.",
    source: "UNICEF",
    year: "2020",
    url: "https://www.unicef.org/brazil/protecao-de-criancas-e-adolescentes",
  },
];

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[color:var(--navy-deep)] text-white">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(11,20,45,0.92) 0%, rgba(11,20,45,0.78) 45%, rgba(232,108,42,0.35) 100%), url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 opacity-30 mix-blend-overlay" aria-hidden>
          <div className="absolute -top-24 -left-24 size-96 rounded-full bg-[color:var(--orange)] blur-3xl" />
          <div className="absolute bottom-0 right-0 size-[28rem] rounded-full bg-[color:var(--red-inst)] blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-44">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur">
              <Sparkles className="size-3.5 text-[color:var(--orange)]" aria-hidden />
              18 de Maio · Dia Nacional de Combate ao Abuso e Exploração Sexual
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] text-balance max-w-4xl">
              Uma infância protegida{" "}
              <span className="bg-gradient-to-r from-[color:var(--orange)] via-amber-300 to-[color:var(--orange)] bg-clip-text text-transparent">
                muda o futuro
              </span>{" "}
              de uma sociedade.
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/85 leading-relaxed">
              Milhares de crianças sofrem em silêncio. Informação, atenção e denúncia salvam vidas.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/denuncia"
                className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--red-inst)] px-7 py-4 text-base font-semibold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition"
              >
                <Phone className="size-5" aria-hidden />
                Denunciar Agora
                <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                to="/sinais"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-base font-semibold backdrop-blur hover:bg-white/10 transition"
              >
                <Eye className="size-5" aria-hidden />
                Entender os Sinais
              </Link>
            </div>
          </Reveal>

          <Reveal delay={480}>
            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
              {[
                ["100", "Disque Direitos Humanos"],
                ["190", "Polícia Militar"],
                ["192", "SAMU"],
                ["181", "Disque-Denúncia"],
              ].map(([num, label]) => (
                <div
                  key={num}
                  className="bg-[color:var(--navy-deep)]/80 backdrop-blur px-5 py-5 flex flex-col gap-1"
                >
                  <a
                    href={`tel:${num}`}
                    className="font-display text-3xl sm:text-4xl font-semibold text-[color:var(--orange)] hover:underline underline-offset-4"
                  >
                    {num}
                  </a>
                  <span className="text-xs sm:text-sm text-white/75">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* MARQUEE OFICIAL */}
      <section className="bg-[color:var(--orange)] text-[color:var(--navy-deep)] py-4 overflow-hidden border-y border-[color:var(--navy-deep)]/10">
        <div className="flex gap-12 whitespace-nowrap animate-marquee font-display text-lg sm:text-xl font-semibold">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12 shrink-0">
              <span>★ Maio Laranja</span>
              <span>★ Disque 100</span>
              <span>★ ECA — Lei 8.069/90</span>
              <span>★ Denuncie. É gratuito e anônimo.</span>
              <span>★ Proteger é dever de todos</span>
              <span>★ 18 de Maio</span>
              <span>★ UNICEF Brasil</span>
              <span>★ Childhood Brasil</span>
            </div>
          ))}
        </div>
      </section>

      {/* ESTATÍSTICAS */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Dados oficiais"
            title="A realidade da infância no Brasil"
            description="Cada número representa uma vida. Todos os dados abaixo são extraídos de fontes oficiais e públicas — clique para acessar a referência completa."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <article className="group h-full rounded-2xl border border-border bg-card p-6 hover-lift relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-orange" aria-hidden />
                  <p className="font-display text-5xl font-semibold text-[color:var(--navy)] leading-none">
                    {s.prefix}
                    {"customDisplay" in s ? (
                      <span>{(s as { customDisplay: string }).customDisplay}</span>
                    ) : (
                      <AnimatedNumber value={s.value} />
                    )}
                    {s.suffix}
                  </p>
                  <h3 className="mt-4 text-base font-semibold leading-snug">{s.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.detail}</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <SourceTag source={s.source} year={s.year} url={s.url} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SILÊNCIO QUE FERE */}
      <section className="relative py-20 sm:py-32 bg-[color:var(--navy-deep)] text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-elegant">
              <img
                src={silenceImg}
                alt="Silhueta de criança olhando pela janela, simbolizando crianças que sofrem em silêncio"
                loading="lazy"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/80 to-transparent" />
            </div>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--orange)]">
              O silêncio que machuca
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-balance">
              A violência sexual contra crianças acontece, na maioria das vezes, dentro de casa.
            </h2>
            <p className="mt-5 text-white/80 text-lg leading-relaxed">
              Em cerca de 60% dos casos, o agressor é alguém da família ou do convívio próximo. O
              medo, a vergonha e a dependência emocional fazem com que muitas crianças não consigam
              pedir ajuda. Reconhecer os sinais é o primeiro passo para romper esse ciclo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/sinais"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-6 py-3 font-semibold hover:opacity-95"
              >
                Conhecer os sinais <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/como-ajudar"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-white/10"
              >
                Como acolher
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/60">
              Fonte: Childhood Brasil & Fórum Brasileiro de Segurança Pública (Anuário 2024).
            </p>
          </Reveal>
        </div>
      </section>

      {/* O QUE VOCÊ ENCONTRA */}
      <section className="py-20 sm:py-28 bg-[color:var(--orange-soft)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Conteúdo da campanha"
            title="Informação que protege"
            description="Tudo o que você precisa para reconhecer, acolher, agir e denunciar — em um só lugar."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { to: "/maio-laranja", icon: Heart, title: "Maio Laranja", desc: "Origem, história e por que o dia 18 de maio importa.", img: ribbonImg },
              { to: "/sinais", icon: Eye, title: "Identificar Sinais", desc: "Mudanças de comportamento que merecem atenção.", img: joyImg },
              { to: "/como-ajudar", icon: HandHeart, title: "Como Ajudar", desc: "Escutar, acolher, não julgar, proteger e denunciar.", img: heroImg },
              { to: "/denuncia", icon: Phone, title: "Canais de Denúncia", desc: "Telefones oficiais que funcionam 24 horas.", img: silenceImg },
              { to: "/legislacao", icon: Scale, title: "Legislação", desc: "ECA, Constituição e direitos fundamentais.", img: ribbonImg },
              { to: "/mapa", icon: MapPin, title: "Mapa de Ajuda", desc: "Conselhos tutelares, delegacias e centros de apoio.", img: joyImg },
            ].map((c, i) => (
              <Reveal key={c.to} delay={i * 70}>
                <Link to={c.to} className="block h-full">
                  <article className="h-full rounded-2xl overflow-hidden bg-card border border-border hover-lift group">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={c.img}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/70 via-transparent" />
                      <span className="absolute top-4 left-4 inline-flex size-10 items-center justify-center rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)]">
                        <c.icon className="size-5" aria-hidden />
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-semibold">{c.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--red-inst)]">
                        Acessar <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative isolate overflow-hidden py-24 sm:py-32 bg-gradient-red text-white">
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -top-32 left-1/3 size-[30rem] rounded-full bg-white blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <ShieldAlert className="mx-auto size-12 text-white/90" aria-hidden />
            <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-balance">
              Não fique em silêncio.
            </h2>
            <p className="mt-5 text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Ao denunciar você protege uma criança e ajuda a interromper um ciclo de violência. A
              denúncia é anônima, gratuita e funciona 24 horas.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="tel:100"
                className="inline-flex items-center gap-2 rounded-full bg-white text-[color:var(--red-inst)] px-8 py-4 text-lg font-bold hover:scale-[1.02] transition"
              >
                <Phone className="size-5" /> Ligar 100
              </a>
              <Link
                to="/denuncia"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-8 py-4 text-lg font-semibold hover:bg-white/10"
              >
                <MessageCircle className="size-5" />
                Outros canais
              </Link>
            </div>
            <p className="mt-8 text-sm text-white/70">
              Fonte oficial:{" "}
              <a
                href="https://www.gov.br/mdh/pt-br/disque100"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                Ministério dos Direitos Humanos e da Cidadania — Disque 100
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* BLOCO FONTES */}
      <section className="py-16 bg-background border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Conteúdo baseado em fontes oficiais
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4 text-sm font-medium text-muted-foreground">
              {[
                "Ministério dos Direitos Humanos",
                "Disque 100",
                "UNICEF",
                "Childhood Brasil",
                "CONANDA",
                "ECA — Lei 8.069/90",
                "Ministério Público",
                "Polícia Federal",
                "ONU",
              ].map((n) => (
                <span key={n} className="inline-flex items-center gap-2">
                  <BookOpen className="size-4 text-[color:var(--orange)]" aria-hidden />
                  {n}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
