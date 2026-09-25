import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Eye,
  GraduationCap,
  HandHeart,
  Heart,
  Library,
  MapPin,
  MessageCircle,
  Newspaper,
  Phone,
  Scale,
  ShieldAlert,
  Users,
  Wifi,
} from "lucide-react";
import heroImg from "@/assets/hero-protection.jpg";
import silenceImg from "@/assets/silence.jpg";
import ribbonImg from "@/assets/ribbon.jpg";
import joyImg from "@/assets/children-joy.jpg";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { SourceTag } from "@/components/shared/SourceTag";
import { LatestUpdates } from "@/components/public/LatestUpdates";
import { MonthlyAlert } from "@/components/public/MonthlyAlert";


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
      { property: "og:url", content: "https://minhainfanciaprotegida.com.br/" },
    ],
    links: [
      { rel: "canonical", href: "https://minhainfanciaprotegida.com.br/" },
      { rel: "preload", as: "image", href: heroImg, fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://minhainfanciaprotegida.com.br/#homepage",
          url: "https://minhainfanciaprotegida.com.br/",
          name: "Infância Protegida — Maio Laranja · Campanha Nacional",
          inLanguage: "pt-BR",
          isPartOf: { "@id": "https://minhainfanciaprotegida.com.br/#website" },
          about: { "@id": "https://minhainfanciaprotegida.com.br/#organization" },
          mainEntity: { "@id": "https://minhainfanciaprotegida.com.br/#organization" },
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: "https://minhainfanciaprotegida.com.br/android-chrome-512x512.png",
          },
          mentions: [
            { "@id": "https://minhainfanciaprotegida.com.br/#maio-laranja" },
            { "@id": "https://minhainfanciaprotegida.com.br/#term-disque-100" },
            { "@id": "https://minhainfanciaprotegida.com.br/#term-eca" },
            { "@id": "https://minhainfanciaprotegida.com.br/#term-protecao-infantil" },
          ],
        }),
      },
    ],
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
      {/* HERO — aurora animada + entrada escalonada */}
      <section className="relative isolate overflow-hidden bg-[color:var(--navy-deep)] text-white">
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <img
            src={heroImg}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity animate-kenburns"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgba(8,14,32,0.96) 0%, rgba(11,20,45,0.72) 45%, rgba(11,20,45,0.42) 100%)",
            }}
          />
          {/* Auroras */}
          <div className="animate-aurora absolute -left-32 top-[-10%] size-[34rem] rounded-full bg-[#f2620f]/25 blur-[110px]" />
          <div className="animate-aurora absolute right-[-8%] top-[30%] size-[28rem] rounded-full bg-[#d92240]/20 blur-[110px]" style={{ animationDelay: "-5s" }} />
          <div className="animate-aurora absolute bottom-[-20%] left-[35%] size-[30rem] rounded-full bg-[#3b5bff]/15 blur-[120px]" style={{ animationDelay: "-9s" }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-36">
          <h1 className="hero-rise font-display text-[44px] sm:text-6xl lg:text-7xl xl:text-[92px] font-normal leading-[1.0] tracking-tight text-balance max-w-5xl" style={{ animationDelay: "0.1s" }}>
            Proteger é dever de{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#ffb25e] via-[color:var(--orange)] to-[#ff7a3d]">
              todos nós.
            </span>
          </h1>

          <p className="hero-rise mt-6 max-w-2xl text-lg sm:text-xl text-white/75 leading-relaxed" style={{ animationDelay: "0.32s" }}>
            Educar para prevenir. Denunciar para proteger. Juntos contra o abuso e a exploração sexual de crianças e adolescentes.
          </p>

          <div className="hero-rise mt-10 flex flex-wrap items-center gap-3 sm:gap-4" style={{ animationDelay: "0.45s" }}>
            <Link
              to="/sinais"
              className="cta-shine group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-[#ff9a3d] to-[#f2620f] text-white px-7 py-4 text-base font-bold shadow-[0_16px_40px_-12px_rgb(242_98_15/0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-12px_rgb(242_98_15/0.8)] active:translate-y-0"
            >
              <Eye className="size-5" aria-hidden />
              Como Identificar Sinais
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden />
            </Link>
            <Link
              to="/biblioteca"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/[0.07] px-7 py-4 text-base font-bold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/35 hover:bg-white/[0.14]"
            >
              <BookOpen className="size-5" aria-hidden />
              Materiais de Apoio
            </Link>
            <Link
              to="/denuncia"
              className="group inline-flex items-center gap-2 rounded-2xl border border-[#ff5d78]/40 bg-[#d92240]/20 px-7 py-4 text-base font-bold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#d92240]/40"
            >
              <span className="animate-dot-blink inline-block size-2 rounded-full bg-[#ff5d78]" />
              Denunciar Agora
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ["100", "Disque Direitos Humanos", "0.58s", "0deg"],
              ["190", "Polícia Militar", "0.66s", "1.5deg"],
              ["192", "SAMU", "0.74s", "-1.5deg"],
              ["181", "Disque-Denúncia", "0.82s", "0deg"],
            ].map(([num, label, delay, rot]) => (
              <a
                key={num}
                href={`tel:${num}`}
                className="hero-rise animate-card-float group rounded-2xl border border-white/12 bg-white/[0.06] backdrop-blur-xl px-5 py-5 transition-colors duration-300 hover:border-[color:var(--orange)]/40 hover:bg-white/[0.1]"
                style={{ animationDelay: `${delay}, 0s`, ["--float-rot" as string]: rot } as React.CSSProperties}
              >
                <span className="font-display text-3xl sm:text-4xl font-semibold text-white transition-colors duration-300 group-hover:text-[color:var(--orange)]">
                  {num}
                </span>
                <span className="mt-1 block text-xs sm:text-sm text-white/65">{label}</span>
              </a>
            ))}
          </div>

          <div className="hero-rise mt-12 flex items-center gap-3 text-white/50" style={{ animationDelay: "0.95s" }} aria-hidden>
            <span className="flex h-9 w-6 items-start justify-center rounded-full border border-white/25 p-1.5">
              <span className="animate-scroll-hint size-1.5 rounded-full bg-white/80" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">Explore a causa</span>
          </div>
        </div>
      </section>

      {/* ALERTA MENSAL / DIA 18 */}
      <MonthlyAlert />

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
              { to: "/riscos-online", icon: Wifi, title: "Riscos Online", desc: "Adultização, grooming e deepfakes em plataformas e comunidades online.", img: silenceImg },
              { to: "/pais", icon: Users, title: "Para Pais", desc: "Controle parental e configurações em Roblox, Discord, TikTok e mais.", img: joyImg },
              { to: "/escolas", icon: GraduationCap, title: "Para Escolas", desc: "Protocolo de suspeita e escuta protegida para educadores.", img: heroImg },
              { to: "/biblioteca", icon: Library, title: "Biblioteca", desc: "Cartilhas e estudos oficiais (UNICEF, SaferNet, MDHC).", img: ribbonImg },
              { to: "/casos", icon: BookOpen, title: "Casos Reais", desc: "Histórias verificadas que mudaram leis no Brasil.", img: heroImg },
              { to: "/noticias", icon: Newspaper, title: "Notícias", desc: "Atualizações sobre o combate à violência infantil.", img: ribbonImg },
              { to: "/como-ajudar", icon: HandHeart, title: "Como Ajudar", desc: "Escutar, acolher, não julgar, proteger e denunciar.", img: joyImg },
              { to: "/denuncia", icon: Phone, title: "Canais de Denúncia", desc: "Telefones oficiais que funcionam 24 horas.", img: silenceImg },
              { to: "/legislacao", icon: Scale, title: "Legislação", desc: "ECA, Constituição e o novo ECA Digital (Lei 15.211/2025).", img: ribbonImg },
              { to: "/mapa", icon: MapPin, title: "Mapa de Ajuda", desc: "Conselhos tutelares, delegacias e centros de apoio por estado.", img: heroImg },
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

      <LatestUpdates />

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
