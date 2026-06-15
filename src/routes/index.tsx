import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Eye,
  GraduationCap,
  HandHeart,
  Library,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  ShieldAlert,
  Users,
  Wifi,
} from "lucide-react";
import heroImg from "@/assets/hero-protection.jpg";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { SourceTag } from "@/components/shared/SourceTag";
import { LatestUpdates } from "@/components/public/LatestUpdates";
import { MonthlyAlert } from "@/components/public/MonthlyAlert";
import { Button } from "@/components/ui/button";


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
    <div className="bg-background">
      {/* ALERTA MENSAL / DIA 18 */}
      <MonthlyAlert />

      {/* HERO SECTION - PREMIUM & CLEAN */}
      <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16 lg:pb-24 border-b border-border">
        <div className="absolute inset-0 bg-[color:var(--background)] -z-10" />
        
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-40 mix-blend-multiply pointer-events-none" aria-hidden>
          <div className="w-[600px] h-[600px] rounded-full bg-blue-50/50 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Texto do Hero */}
            <div className="max-w-2xl">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[color:var(--navy)] mb-8 shadow-sm">
                  <span className="inline-block size-2 rounded-full bg-[color:var(--orange)]" />
                  Campanha Nacional Permanente
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.1] tracking-tight text-[color:var(--navy-deep)] text-balance">
                  Proteção é dever de <span className="text-[color:var(--orange)] italic">todos nós.</span>
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Portal institucional dedicado à conscientização, prevenção e combate ao abuso e exploração sexual de crianças e adolescentes. Informação segura que salva vidas.
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Button asChild variant="denuncia" size="xl">
                    <Link to="/denuncia">
                      <Phone aria-hidden />
                      Como Denunciar
                    </Link>
                  </Button>
                  <Button asChild variant="navy" size="xl">
                    <Link to="/sinais" className="group">
                      <Eye aria-hidden />
                      Identificar Sinais
                      <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="mt-10 flex items-center gap-4 text-sm font-medium text-muted-foreground border-t border-border pt-8">
                  <span>Canais Oficiais 24h:</span>
                  <div className="flex gap-4">
                    <a href="tel:100" className="flex items-center gap-1.5 text-[color:var(--navy)] hover:text-[color:var(--orange)] transition-colors"><Phone className="size-4" /> Disque 100</a>
                    <a href="tel:190" className="flex items-center gap-1.5 text-[color:var(--navy)] hover:text-[color:var(--orange)] transition-colors"><Phone className="size-4" /> Polícia 190</a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Imagem do Hero */}
            <Reveal delay={300} className="lg:justify-self-end">
              <div className="relative aspect-[4/5] lg:aspect-[3/4] w-full max-w-lg rounded-2xl overflow-hidden shadow-elegant border border-border/50">
                <img
                  src={heroImg}
                  alt="Crianças brincando de forma segura, representando a infância protegida"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/40 to-transparent mix-blend-overlay" />
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* DADOS ESTATÍSTICOS - CLEAN */}
      <section className="py-20 sm:py-28 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Panorama Nacional"
            title="A urgência da proteção"
            description="Dados oficiais reforçam que a violência sexual ocorre majoritariamente em ambientes familiares. O conhecimento é a principal ferramenta de intervenção."
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <article className="group relative h-full rounded-xl bg-background border border-border p-8 hover-lift">
                  <div className="absolute top-0 left-8 w-12 h-1 bg-[color:var(--orange)] rounded-b-md" />
                  <p className="font-display text-4xl sm:text-5xl font-semibold text-[color:var(--navy)] tracking-tight mt-4">
                    {s.prefix}
                    {"customDisplay" in s ? (
                      <span>{(s as { customDisplay: string }).customDisplay}</span>
                    ) : (
                      <AnimatedNumber value={s.value} />
                    )}
                    {s.suffix}
                  </p>
                  <h3 className="mt-4 text-base font-semibold text-[color:var(--navy-deep)] leading-snug">{s.label}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.detail}</p>
                  <div className="mt-6 pt-6 border-t border-border">
                    <SourceTag source={s.source} year={s.year} url={s.url} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NAVEGAÇÃO POR PÚBLICO — FAMÍLIAS, ESCOLAS E PROTEÇÃO DIGITAL */}
      <section className="py-20 sm:py-28 bg-blue-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Por onde começar"
            title="Encontre o conteúdo certo para você"
            description="Conteúdo organizado por quem mais precisa dele — famílias, escolas e quem cuida da segurança digital das crianças."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                to: "/pais",
                icon: Users,
                title: "Para famílias",
                desc: "Como conversar com seus filhos, aplicar controles parentais e reconhecer sinais precoces.",
                cta: "Guia para famílias",
                accent: "navy" as const,
              },
              {
                to: "/escolas",
                icon: GraduationCap,
                title: "Para escolas",
                desc: "Protocolo de suspeita, escuta protegida e acionamento da Rede de Proteção.",
                cta: "Guia para escolas",
                accent: "orange" as const,
              },
              {
                to: "/riscos-online",
                icon: Wifi,
                title: "Proteção digital",
                desc: "Grooming, adultização, exploração em jogos e configurações de segurança online.",
                cta: "Riscos online",
                accent: "navy" as const,
              },
            ].map((c, i) => {
              const isOrange = c.accent === "orange";
              return (
                <Reveal key={c.to} delay={i * 80}>
                  <Link
                    to={c.to}
                    className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-8 hover-lift"
                  >
                    <div>
                      <span
                        className={`inline-flex size-12 items-center justify-center rounded-xl ${
                          isOrange
                            ? "bg-[color:var(--orange-soft)] text-[color:var(--orange)]"
                            : "bg-[color:var(--navy)]/10 text-[color:var(--navy)]"
                        }`}
                      >
                        <c.icon className="size-6" aria-hidden />
                      </span>
                      <h3 className="mt-6 font-display text-2xl font-semibold text-[color:var(--navy-deep)]">
                        {c.title}
                      </h3>
                      <p className="mt-3 text-muted-foreground leading-relaxed">{c.desc}</p>
                    </div>
                    <div
                      className={`mt-8 inline-flex items-center gap-2 font-semibold ${
                        isOrange ? "text-[color:var(--orange)]" : "text-[color:var(--navy)]"
                      }`}
                    >
                      {c.cta}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ ENCONTRA - GRID INSTITUCIONAL */}
      <section className="py-20 sm:py-28 bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Eixos de Atuação"
            title="Conhecimento e prevenção"
            description="Acesso estruturado a conteúdos de conscientização, materiais de apoio e canais seguros para a garantia dos direitos infantojuvenis."
          />
          
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { to: "/sinais", icon: Eye, title: "Sinais de Alerta", desc: "Comportamentos que exigem atenção imediata." },
              { to: "/biblioteca", icon: Library, title: "Biblioteca", desc: "Cartilhas oficiais, estudos e guias em PDF." },
              { to: "/casos", icon: BookOpen, title: "Dossiês Oficiais", desc: "Casos reais que fundamentam as leis brasileiras." },
              { to: "/legislacao", icon: Scale, title: "Legislação", desc: "Estatuto da Criança e do Adolescente e marcos legais." },
              { to: "/mapa", icon: MapPin, title: "Rede de Proteção", desc: "Mapeamento de Conselhos Tutelares e delegacias." },
              { to: "/como-ajudar", icon: HandHeart, title: "Como Ajudar", desc: "Escutar, acolher e proteger sem revitimizar." },
            ].map((c, i) => (
              <Reveal key={c.to} delay={i * 50}>
                <Link to={c.to} className="group flex flex-col h-full rounded-xl border border-border bg-background p-6 hover:border-[color:var(--navy)]/30 transition-colors shadow-sm hover:shadow-md">
                  <div className="inline-flex size-10 items-center justify-center rounded-lg bg-[color:var(--background)] border border-border mb-5 group-hover:bg-[color:var(--navy)] group-hover:text-white transition-colors">
                    <c.icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[color:var(--navy-deep)]">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-grow">{c.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST UPDATES (NOTÍCIAS) */}
      <LatestUpdates />

      {/* CTA INSTITUCIONAL (DENÚNCIA) */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-[color:var(--navy)] text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Reveal>
            <ShieldAlert className="mx-auto size-14 text-[color:var(--orange)]" aria-hidden />
            <h2 className="mt-8 font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-balance">
              A omissão agrava o crime. Denuncie.
            </h2>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
              A denúncia ao Disque 100 é sigilosa, gratuita e analisada por autoridades competentes. Você não precisa ter provas absolutas, apenas a suspeita fundamentada.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="tel:100"
                className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--red-inst)] text-white px-8 py-3.5 font-bold hover:bg-[color:var(--red-inst)]/90 transition-colors shadow-sm"
              >
                <Phone className="size-5" /> Disque 100
              </a>
              <Link
                to="/denuncia"
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 text-white border border-white/20 px-8 py-3.5 font-semibold hover:bg-white/20 transition-colors"
              >
                <MessageCircle className="size-5" />
                Ver outros canais oficiais
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BLOCO FONTES */}
      <section className="py-12 bg-background border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">Baseado em:</span>
              {["Disque 100", "ECA", "Ministério dos Direitos Humanos", "Childhood Brasil", "UNICEF"].map((n) => (
                <span key={n} className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--navy)]">
                  <BookOpen className="size-4" aria-hidden />
                  {n}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
