import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Compass,
  Eye,
  GraduationCap,
  Globe2,
  HeartHandshake,
  MapPin,
  Megaphone,
  Network,
  Phone,
  School,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import heroImg from "@/assets/ribbon.jpg";

const SITE_URL = "https://minhainfanciaprotegida.com.br";
const PAGE_URL = `${SITE_URL}/objetivos`;

export const Route = createFileRoute("/objetivos")({
  head: () => ({
    meta: [
      { title: "Nossa Missão e Objetivos — Infância Protegida" },
      {
        name: "description",
        content:
          "Conheça a missão, os objetivos e o impacto do Infância Protegida: conscientizar, prevenir e fortalecer a rede de proteção a crianças e adolescentes no Brasil.",
      },
      {
        name: "keywords",
        content:
          "missão, objetivos, infância protegida, proteção infantil, prevenção, maio laranja, conscientização",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Nossa Missão e Objetivos — Infância Protegida" },
      {
        property: "og:description",
        content:
          "Transformar informação em proteção: nossa missão, objetivos centrais, impacto e públicos atendidos.",
      },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: heroImg },
      { property: "og:site_name", content: "Infância Protegida" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nossa Missão e Objetivos — Infância Protegida" },
      {
        name: "twitter:description",
        content: "Missão, objetivos, impacto e públicos atendidos pelo portal Infância Protegida.",
      },
      { name: "twitter:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Nossa Missão e Objetivos — Infância Protegida",
          url: PAGE_URL,
          inLanguage: "pt-BR",
          description:
            "Missão e objetivos do portal Infância Protegida: conscientizar, prevenir e fortalecer a rede de proteção a crianças e adolescentes.",
          mainEntity: {
            "@type": "Organization",
            name: "Infância Protegida",
            url: SITE_URL,
            areaServed: "BR",
            mission:
              "Transformar informação em proteção, ajudando famílias, educadores, profissionais e a sociedade a reconhecer sinais de violência e fortalecer a rede de proteção infantil.",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL + "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Nossa Missão e Objetivos",
                item: PAGE_URL,
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": PAGE_URL + "#webpage",
            url: PAGE_URL,
            name: "Nossa Missão e Objetivos — Infância Protegida",
            inLanguage: "pt-BR",
            isPartOf: { "@id": SITE_URL + "/#website" },
            about: { "@id": SITE_URL + "/#organization" },
            mainEntity: { "@id": SITE_URL + "/#organization" },
            mentions: [
              { "@id": SITE_URL + "/#maio-laranja" },
              { "@id": SITE_URL + "/#term-protecao-infantil" },
              { "@id": SITE_URL + "/#term-educacao-preventiva" },
              { "@id": SITE_URL + "/#term-disque-100" },
            ],
          },
        ]),
      },
    ],
  }),
  component: Page,
});

interface Objetivo {
  title: string;
  text: string;
}

const objetivos: Objetivo[] = [
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

interface IconItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

const impacto: IconItem[] = [
  {
    icon: Megaphone,
    title: "Conscientização social",
    text: "Levar o tema da proteção infantil para o debate público, tirando a violência da invisibilidade.",
  },
  {
    icon: BookOpen,
    title: "Educação preventiva",
    text: "Oferecer conteúdo claro para famílias, escolas e profissionais reconhecerem sinais antes que a violência se aprofunde.",
  },
  {
    icon: ShieldCheck,
    title: "Combate ao abuso infantil",
    text: "Reforçar canais oficiais de denúncia e direitos garantidos pelo ECA.",
  },
  {
    icon: Shield,
    title: "Enfrentamento da exploração sexual",
    text: "Informar sobre redes de exploração, riscos online e legislação aplicável.",
  },
  {
    icon: Network,
    title: "Fortalecimento da rede de proteção",
    text: "Conectar pessoas aos Conselhos Tutelares, Delegacias especializadas, CREAS e Ministério Público.",
  },
];

const publicos: IconItem[] = [
  {
    icon: Users,
    title: "Pais e responsáveis",
    text: "Para reconhecer sinais e agir com segurança.",
  },
  {
    icon: GraduationCap,
    title: "Educadores",
    text: "Para identificar e acolher de forma protetiva.",
  },
  { icon: School, title: "Escolas", text: "Para construir protocolos e cultura de prevenção." },
  { icon: Shield, title: "Conselheiros tutelares", text: "Para apoio em materiais e legislação." },
  {
    icon: HeartHandshake,
    title: "Assistência social",
    text: "CRAS, CREAS e profissionais da rede.",
  },
  { icon: Globe2, title: "Comunidade em geral", text: "Porque proteger é tarefa coletiva." },
];

const comoAjudar: IconItem[] = [
  { icon: BookOpen, title: "Informar", text: "Conteúdo verificado e gratuito." },
  { icon: Compass, title: "Orientar", text: "Guias práticos passo a passo." },
  { icon: ShieldCheck, title: "Prevenir", text: "Sinais de alerta e fatores de risco." },
  { icon: Megaphone, title: "Conscientizar", text: "Mobilização em torno do Maio Laranja." },
  { icon: Network, title: "Conectar", text: "Direcionar ao órgão certo, na hora certa." },
  {
    icon: Phone,
    title: "Denunciar",
    text: "Caminhos oficiais: Disque 100, Conselho Tutelar, Polícia.",
  },
];

const fontesChips = [
  "MDHC",
  "ECA — Lei 8.069/1990",
  "Lei 13.431/2017",
  "Lei 15.211/2025 (ECA Digital)",
  "FBSP — Anuário",
  "Unicef Brasil",
  "SafeNet",
];

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="flex items-center gap-3 mb-5">
      <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[color:var(--orange-soft)] text-[color:var(--orange)] shrink-0">
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--orange)]">
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
          {title}
        </h2>
      </div>
    </header>
  );
}

function Page() {
  return (
    <>
      <PageHero
        image={heroImg}
        variant="orange"
        eyebrow="Missão e objetivos"
        title="Nossa Missão e Objetivos"
        description="Transformar informação em proteção. Conheça as cinco frentes de atuação do Infância Protegida e o impacto que buscamos gerar."
        icon={<Target className="size-3.5" aria-hidden />}
      />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-14">
        {/* Introdução */}
        <Reveal>
          <section>
            <SectionHeading icon={Sparkles} eyebrow="Introdução" title="Por que existimos" />
            <p className="text-[16px] leading-relaxed text-foreground/85">
              O <strong>Infância Protegida</strong> existe para transformar informação em proteção.
              Nosso objetivo é ajudar famílias, educadores, profissionais e a sociedade a reconhecer
              sinais de violência, agir de forma preventiva e fortalecer a rede de proteção de
              crianças e adolescentes.
            </p>
          </section>
        </Reveal>

        {/* Objetivos centrais */}
        <Reveal delay={60}>
          <section>
            <SectionHeading
              icon={Target}
              eyebrow="Objetivos centrais"
              title="O que queremos alcançar"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {objetivos.map((o) => (
                <article
                  key={o.title}
                  className="rounded-2xl border border-border bg-card p-5 hover-lift"
                >
                  <h3 className="font-display text-lg font-semibold text-foreground">{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.text}</p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Nosso Impacto */}
        <Reveal delay={120}>
          <section>
            <SectionHeading
              icon={Sparkles}
              eyebrow="Nosso impacto"
              title="Como o projeto contribui"
            />
            <ul className="space-y-3">
              {impacto.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card/60 p-4"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[color:var(--orange-soft)] text-[color:var(--orange)] shrink-0">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground text-[15px]">{title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* Quem queremos alcançar */}
        <Reveal delay={180}>
          <section>
            <SectionHeading icon={Users} eyebrow="Públicos" title="Quem queremos alcançar" />
            <div className="grid gap-3 sm:grid-cols-2">
              {publicos.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[color:var(--orange-soft)] text-[color:var(--orange)] shrink-0">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Como pretendemos ajudar */}
        <Reveal delay={220}>
          <section>
            <SectionHeading icon={Compass} eyebrow="Atuação" title="Como pretendemos ajudar" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {comoAjudar.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-border bg-card p-5 text-center hover-lift"
                >
                  <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-gradient-orange text-[color:var(--navy-deep)] shadow-orange">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-3 font-display text-base font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{text}</p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Compromisso */}
        <Reveal delay={260}>
          <section>
            <SectionHeading
              icon={Eye}
              eyebrow="Transparência"
              title="Compromisso com a proteção infantil"
            />
            <p className="text-[15.5px] leading-relaxed text-foreground/85">
              O Infância Protegida é uma <strong>iniciativa educativa</strong> de utilidade pública,
              sem fins lucrativos. Todo o conteúdo é produzido a partir de fontes oficiais,
              legislação brasileira e materiais de referência reconhecidos nacionalmente, com
              revisão periódica e linguagem protetiva — sem exposição de vítimas.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {fontesChips.map((f) => (
                <li
                  key={f}
                  className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/75"
                >
                  {f}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* Chamada final */}
        <Reveal delay={320}>
          <aside className="rounded-3xl border border-[color:var(--orange)]/30 bg-gradient-to-br from-[color:var(--orange-soft)] via-background to-background p-8 sm:p-10 text-center">
            <Sparkles className="size-7 text-[color:var(--orange)] mx-auto" aria-hidden />
            <p className="mt-4 font-display text-2xl sm:text-3xl font-semibold text-foreground text-balance leading-tight">
              Proteger uma criança começa com informação. Cada pessoa conscientizada pode se tornar
              parte da rede de proteção.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/sinais"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-orange text-[color:var(--navy-deep)] px-5 py-2.5 text-sm font-semibold shadow-orange hover:opacity-95 transition"
              >
                <ShieldCheck className="size-4" aria-hidden /> Identificar Sinais
              </Link>
              <Link
                to="/denuncia"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--red-inst)] text-[color:var(--red-inst-foreground)] px-5 py-2.5 text-sm font-semibold hover:opacity-95 transition shadow-sm"
              >
                <Phone className="size-4" aria-hidden /> Como Denunciar
              </Link>
              <Link
                to="/mapa"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy)]/30 bg-background text-foreground px-5 py-2.5 text-sm font-semibold hover:bg-muted transition"
              >
                <MapPin className="size-4" aria-hidden /> Mapa de Ajuda
              </Link>
            </div>
          </aside>
        </Reveal>
      </article>
    </>
  );
}
