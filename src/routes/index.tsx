import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Eye,
  GraduationCap,
  Library,
  Lightbulb,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
  Users,
  Wifi,
} from "lucide-react";
import heroImg from "@/assets/hero-protection.jpg";
import joyImg from "@/assets/children-joy.jpg";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { AnimatedNumber } from "@/components/site/AnimatedNumber";
import { SourceTag } from "@/components/site/SourceTag";
import { LatestUpdates } from "@/components/site/LatestUpdates";
import { MonthlyAlert } from "@/components/site/MonthlyAlert";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Minha Infância Protegida — Portal Nacional de Proteção Infantil" },
      {
        name: "description",
        content:
          "Proteger a infância é responsabilidade de todos. Informação, prevenção e conscientização para famílias, escolas, educadores e toda a sociedade. Disque 100.",
      },
      { property: "og:title", content: "Minha Infância Protegida" },
      {
        property: "og:description",
        content:
          "Informação, prevenção e conscientização para famílias, escolas e toda a sociedade.",
      },
      { property: "og:url", content: "https://minhainfanciaprotegida.com.br/" },
    ],
    links: [
      { rel: "canonical", href: "https://minhainfanciaprotegida.com.br/" },
      { rel: "preload", as: "image", href: heroImg, fetchpriority: "high" },
    ],
  }),
  component: Index,
});

const stats = [
  {
    value: 75984,
    suffix: "",
    label: "Denúncias de violações de direitos de crianças e adolescentes",
    detail: "Recebidas pelo Disque 100 em 2023.",
    source: "Ministério dos Direitos Humanos e da Cidadania",
    year: "2024",
    url: "https://www.gov.br/mdh/pt-br/assuntos/noticias/2024/maio/disque-100-recebeu-mais-de-75-mil-denuncias-de-violacoes-contra-criancas-e-adolescentes-em-2023",
  },
  {
    value: 60,
    suffix: "%",
    label: "Dos casos ocorrem dentro da própria casa",
    detail: "A maioria dos abusos é cometida por pessoas conhecidas.",
    source: "Childhood Brasil",
    year: "2023",
    url: "https://www.childhood.org.br/",
  },
  {
    value: 1,
    prefix: "1 a cada ",
    suffix: " min",
    customDisplay: "8",
    label: "Uma criança é vítima de violência sexual no Brasil",
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
    label: "Meninas sofre violência sexual antes dos 18 anos no mundo",
    detail: "Estimativa global do UNICEF.",
    source: "UNICEF",
    year: "2020",
    url: "https://www.unicef.org/brazil/protecao-de-criancas-e-adolescentes",
  },
];

const pillars = [
  {
    icon: Lightbulb,
    title: "Informar",
    desc: "Conteúdo verificado a partir de fontes oficiais sobre direitos, riscos e legislação.",
  },
  {
    icon: ShieldCheck,
    title: "Prevenir",
    desc: "Orientações práticas para famílias, escolas e educadores reduzirem riscos.",
  },
  {
    icon: Users,
    title: "Conscientizar",
    desc: "Mobilização da sociedade para reconhecer sinais e romper o silêncio.",
  },
];

const cards = [
  { to: "/noticias", icon: BookOpen, title: "Notícias", desc: "Atualizações sobre o combate à violência infantil." },
  { to: "/casos", icon: Eye, title: "Casos Reais", desc: "Histórias verificadas, com abordagem responsável." },
  { to: "/riscos-online", icon: Wifi, title: "Segurança Digital", desc: "Grooming, deepfakes e proteção em jogos e redes." },
  { to: "/pais", icon: Users, title: "Para Pais", desc: "Controle parental e diálogo com filhos." },
  { to: "/escolas", icon: GraduationCap, title: "Para Escolas", desc: "Protocolos de suspeita e escuta protegida." },
  { to: "/biblioteca", icon: Library, title: "Biblioteca", desc: "Cartilhas e estudos oficiais para download." },
  { to: "/legislacao", icon: Scale, title: "Legislação", desc: "ECA, Constituição e o novo ECA Digital." },
  { to: "/mapa", icon: MapPin, title: "Rede de Proteção", desc: "Conselhos tutelares e centros de apoio por estado." },
];

const sources = [
  "Ministério dos Direitos Humanos",
  "Disque 100",
  "UNICEF",
  "Childhood Brasil",
  "CONANDA",
  "ECA — Lei 8.069/90",
  "Ministério Público",
  "Polícia Federal",
];

function Index() {
  return (
    <>
      {/* HERO institucional — branco + bloco navy */}
      <section className="relative bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-[color:var(--surface-soft)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--navy-deep)]">
                <span className="size-1.5 rounded-full bg-[color:var(--orange)]" aria-hidden />
                Portal nacional · Campanha permanente
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-[color:var(--navy-deep)] text-balance">
                Proteger a infância é responsabilidade{" "}
                <span className="text-[color:var(--orange)]">de todos</span>.
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Informação, prevenção e conscientização para famílias, escolas, educadores e toda
                a sociedade brasileira.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/denuncia"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--red-inst)] text-white px-6 py-3.5 text-sm font-bold hover:opacity-95 transition-opacity"
                >
                  <Phone className="size-4" aria-hidden />
                  Como denunciar
                </Link>
                <Link
                  to="/sobre"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy-deep)] text-[color:var(--navy-deep)] px-6 py-3.5 text-sm font-bold hover:bg-[color:var(--navy-deep)] hover:text-white transition-colors"
                >
                  Conheça o projeto
                </Link>
                <Link
                  to="/biblioteca"
                  className="inline-flex items-center gap-2 rounded-full text-[color:var(--navy-deep)] px-6 py-3.5 text-sm font-bold hover:bg-[color:var(--surface-soft)] transition-colors"
                >
                  Acessar biblioteca
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={150}>
              <div className="relative">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border shadow-elegant">
                  <img
                    src={heroImg}
                    alt="Criança protegida pela família"
                    className="size-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 rounded-2xl bg-[color:var(--navy-deep)] text-white px-5 py-4 shadow-elegant">
                  <Phone className="size-5 text-[color:var(--orange)]" aria-hidden />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                      Disque Direitos Humanos
                    </p>
                    <p className="font-display text-2xl font-semibold leading-none">100</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ALERTA MENSAL / DIA 18 */}
      <MonthlyAlert />

      {/* MISSÃO */}
      <section className="py-20 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Nossa missão"
            title="Três pilares para uma infância protegida"
            description="Atuamos com seriedade editorial, base científica e linguagem acessível para que cada cidadão se torne agente de proteção."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <article className="h-full rounded-2xl border border-border bg-card p-7">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-[color:var(--surface-soft)] text-[color:var(--navy-deep)]">
                    <p.icon className="size-6" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-[color:var(--navy-deep)]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CARDS PRINCIPAIS */}
      <section className="py-20 sm:py-24 bg-[color:var(--surface-soft)] border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="O que você encontra"
            title="Conteúdo essencial em um só lugar"
            description="Reconhecer, acolher, prevenir e denunciar — com referências oficiais."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c, i) => (
              <Reveal key={c.to} delay={i * 50}>
                <Link to={c.to} className="group block h-full">
                  <article className="h-full rounded-2xl border border-border bg-card p-6 transition-all hover:border-[color:var(--navy-deep)]/30 hover:-translate-y-1 hover:shadow-elegant">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[color:var(--surface-soft)] text-[color:var(--navy-deep)] group-hover:bg-[color:var(--navy-deep)] group-hover:text-white transition-colors">
                      <c.icon className="size-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-semibold text-[color:var(--navy-deep)]">
                      {c.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[color:var(--orange)]">
                      Acessar
                      <ArrowRight className="size-3.5 transition group-hover:translate-x-1" aria-hidden />
                    </span>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ESTATÍSTICAS */}
      <section className="py-20 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Dados oficiais"
            title="A realidade da infância no Brasil"
            description="Cada número representa uma vida. Todos os dados vêm de fontes oficiais e públicas."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 70}>
                <article className="h-full rounded-2xl border border-border bg-card p-6">
                  <p className="font-display text-4xl sm:text-5xl font-semibold text-[color:var(--navy-deep)] leading-none">
                    {s.prefix}
                    {"customDisplay" in s ? (
                      <span>{(s as { customDisplay: string }).customDisplay}</span>
                    ) : (
                      <AnimatedNumber value={s.value} />
                    )}
                    {s.suffix}
                  </p>
                  <h3 className="mt-4 text-sm font-semibold leading-snug text-[color:var(--navy-deep)]">
                    {s.label}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <SourceTag source={s.source} year={s.year} url={s.url} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ÚLTIMAS NOTÍCIAS */}
      <LatestUpdates />

      {/* COMO DENUNCIAR — bloco navy institucional */}
      <section className="relative bg-[color:var(--navy-deep)] text-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--orange)]">
                  Como denunciar
                </p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-balance">
                  Sua denúncia é anônima, gratuita e funciona 24 horas.
                </h2>
                <p className="mt-5 text-base text-white/80 leading-relaxed max-w-md">
                  Ao denunciar, você protege uma criança e ajuda a interromper um ciclo de
                  violência. Use qualquer um dos canais oficiais abaixo.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="tel:100"
                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-6 py-3.5 text-sm font-bold hover:opacity-95"
                  >
                    <Phone className="size-4" /> Ligar 100
                  </a>
                  <Link
                    to="/denuncia"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold hover:bg-white/10"
                  >
                    Outros canais
                  </Link>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={120}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["100", "Disque Direitos Humanos"],
                    ["190", "Polícia Militar"],
                    ["192", "SAMU"],
                    ["181", "Disque-Denúncia"],
                  ].map(([num, label]) => (
                    <a
                      key={num}
                      href={`tel:${num}`}
                      className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur p-6 hover:bg-white/10 transition-colors"
                    >
                      <p className="font-display text-4xl sm:text-5xl font-semibold text-[color:var(--orange)] leading-none">
                        {num}
                      </p>
                      <p className="mt-3 text-sm text-white/80">{label}</p>
                    </a>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FONTES */}
      <section className="py-16 bg-background border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Conteúdo baseado em fontes oficiais
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground">
              {sources.map((n) => (
                <span key={n} className="inline-flex items-center gap-2">
                  <BookOpen className="size-4 text-[color:var(--orange)]" strokeWidth={1.75} aria-hidden />
                  {n}
                </span>
              ))}
              <Link to="/joy" className="sr-only" aria-hidden>
                <img src={joyImg} alt="" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
