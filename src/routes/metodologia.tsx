import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Eye,
  FileSearch,
  FlaskConical,
  Gavel,
  HeartHandshake,
  Languages,
  Library,
  MapPin,
  PenTool,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import heroImg from "@/assets/journalism.jpg";

const SITE_URL = "https://minhainfanciaprotegida.com.br";
const PAGE_URL = `${SITE_URL}/metodologia`;

export const Route = createFileRoute("/metodologia")({
  head: () => ({
    meta: [
      { title: "Metodologia — Como produzimos o conteúdo | Infância Protegida" },
      {
        name: "description",
        content:
          "Como o Infância Protegida pesquisa, verifica, escreve e revisa seu conteúdo: fontes oficiais, legislação brasileira, critérios de qualidade e compromisso editorial.",
      },
      {
        name: "keywords",
        content:
          "metodologia, fontes oficiais, ECA, transparência, critérios editoriais, infância protegida, verificação, jornalismo de proteção",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "Infância Protegida" },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "Metodologia — Como produzimos o conteúdo | Infância Protegida",
      },
      {
        property: "og:description",
        content:
          "Pesquisa em fontes oficiais, verificação cruzada, revisão editorial e atualização contínua: conheça nossa metodologia.",
      },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: heroImg },
      { property: "og:site_name", content: "Infância Protegida" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Metodologia — Como produzimos o conteúdo",
      },
      {
        name: "twitter:description",
        content:
          "Fontes oficiais, verificação cruzada, linguagem protetiva e revisão periódica.",
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
          name: "Metodologia — Infância Protegida",
          url: PAGE_URL,
          inLanguage: "pt-BR",
          description:
            "Critérios editoriais, hierarquia de fontes, verificação e revisão usadas pelo portal Infância Protegida.",
          mainEntity: {
            "@type": "Organization",
            name: "Infância Protegida",
            url: SITE_URL,
            areaServed: "BR",
            knowsAbout: [
              "Proteção infantil",
              "Estatuto da Criança e do Adolescente",
              "Prevenção à violência sexual",
              "Maio Laranja",
            ],
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
              { "@type": "ListItem", position: 2, name: "Metodologia", item: PAGE_URL },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": PAGE_URL + "#webpage",
            url: PAGE_URL,
            name: "Metodologia — Infância Protegida",
            inLanguage: "pt-BR",
            isPartOf: { "@id": SITE_URL + "/#website" },
            about: { "@id": SITE_URL + "/#organization" },
            mainEntity: { "@id": SITE_URL + "/#organization" },
            mentions: [
              { "@id": SITE_URL + "/#maio-laranja" },
              { "@id": SITE_URL + "/#term-eca" },
              { "@id": SITE_URL + "/#term-protecao-infantil" },
            ],
          },
        ]),
      },
    ],
  }),
  component: Page,
});

interface Step {
  n: string;
  icon: LucideIcon;
  title: string;
  text: string;
}

const etapas: Step[] = [
  {
    n: "01",
    icon: FileSearch,
    title: "Pesquisa em fontes oficiais",
    text: "Buscamos dados em gov.br, MDHC, UNICEF, FBSP, SaferNet, Senado, Câmara e órgãos especializados — sempre priorizando documentos primários.",
  },
  {
    n: "02",
    icon: CheckCircle2,
    title: "Verificação cruzada das informações",
    text: "Toda estatística é confrontada em pelo menos duas fontes independentes, com data de referência explícita antes da publicação.",
  },
  {
    n: "03",
    icon: Gavel,
    title: "Análise da legislação vigente",
    text: "Consultamos o ECA (Lei 8.069/1990), a Lei 13.431/2017, a Lei 15.211/2025 (ECA Digital) e demais normas aplicáveis a cada tema.",
  },
  {
    n: "04",
    icon: Languages,
    title: "Adaptação para linguagem acessível",
    text: "Traduzimos termos técnicos e jurídicos para uma linguagem clara, respeitosa e protetiva, seguindo as diretrizes da ANDI e do UNICEF.",
  },
  {
    n: "05",
    icon: PenTool,
    title: "Revisão editorial",
    text: "Cada material passa por revisão de conteúdo, fontes, ortografia e tom — com foco em proteção, sem sensacionalismo e sem exposição de vítimas.",
  },
  {
    n: "06",
    icon: Upload,
    title: "Publicação e monitoramento",
    text: "Após publicação, acompanhamos correções, atualizações legislativas e novos dados para manter o conteúdo sempre confiável.",
  },
];

interface IconItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

const criterios: IconItem[] = [
  {
    icon: ClipboardCheck,
    title: "Precisão",
    text: "Toda informação é checada em documentos oficiais antes de ser publicada — números, leis e datas conferidos um a um.",
  },
  {
    icon: Eye,
    title: "Transparência",
    text: "Fontes citadas de forma visível, com link para o documento original sempre que possível.",
  },
  {
    icon: RefreshCw,
    title: "Atualização constante",
    text: "Revisões periódicas após novas leis, novos relatórios e a cada edição do Anuário Brasileiro de Segurança Pública.",
  },
  {
    icon: HeartHandshake,
    title: "Responsabilidade social",
    text: "Trabalhamos com a consciência de que conteúdo sobre infância pode salvar — ou expor — vidas. A escolha das palavras importa.",
  },
  {
    icon: ShieldCheck,
    title: "Linguagem protetiva",
    text: "Seguimos as diretrizes da ANDI e do UNICEF: sem detalhes que revitimizem, sem exposição e sem dramatização.",
  },
  {
    icon: Scale,
    title: "Respeito às vítimas",
    text: "Nunca publicamos nomes, fotos, depoimentos ou qualquer dado capaz de identificar crianças e adolescentes.",
  },
];

interface Fonte {
  nome: string;
  desc: string;
}

const fontes: Fonte[] = [
  {
    nome: "UNICEF",
    desc: "Referência global em direitos da criança, com relatórios sobre violência, educação e proteção online.",
  },
  {
    nome: "Childhood Brasil",
    desc: "Organização brasileira dedicada ao enfrentamento da exploração sexual de crianças e adolescentes.",
  },
  {
    nome: "SaferNet Brasil",
    desc: "Principal referência nacional em segurança digital, denúncias online e prevenção a crimes virtuais.",
  },
  {
    nome: "Ministério dos Direitos Humanos e da Cidadania (MDHC)",
    desc: "Órgão federal responsável por políticas públicas de proteção, dados do Disque 100 e campanhas oficiais.",
  },
  {
    nome: "Governo Federal — gov.br",
    desc: "Portal oficial com leis, decretos, dados abertos e programas de proteção à infância.",
  },
  {
    nome: "ECA — Estatuto da Criança e do Adolescente",
    desc: "Lei 8.069/1990, marco legal da proteção integral no Brasil — base de todo conteúdo jurídico do portal.",
  },
  {
    nome: "Disque 100",
    desc: "Canal oficial de denúncia de violações de direitos humanos, com dados publicados pelo MDHC.",
  },
  {
    nome: "Ministério Público",
    desc: "Atua na fiscalização e proteção dos direitos da infância em todo o território nacional.",
  },
  {
    nome: "Polícia Federal",
    desc: "Responsável pela investigação de crimes cibernéticos contra crianças e adolescentes em escala nacional.",
  },
];

const atualizacao: IconItem[] = [
  {
    icon: RefreshCw,
    title: "Revisão periódica",
    text: "Todo conteúdo é reavaliado em intervalos regulares para garantir vigência e exatidão.",
  },
  {
    icon: Gavel,
    title: "Atualização legislativa",
    text: "Novas leis, decretos e resoluções são incorporados assim que entram em vigor.",
  },
  {
    icon: FileSearch,
    title: "Atualização de estatísticas",
    text: "Dados do Anuário FBSP, Disque 100 e relatórios oficiais são atualizados a cada nova edição.",
  },
  {
    icon: BookOpen,
    title: "Atualização de materiais educacionais",
    text: "Guias, cartilhas e infográficos são revistos para refletir as melhores práticas vigentes.",
  },
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
        eyebrow="Metodologia"
        title="Como produzimos o conteúdo"
        description="Pesquisa, verificação, legislação, linguagem acessível e revisão editorial — o processo por trás de cada artigo, dado e material do projeto."
        breadcrumb={[
          { label: "Início", to: "/" },
          { label: "Metodologia" },
        ]}
        icon={<FlaskConical className="size-3.5" aria-hidden />}
      />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-14">
        {/* Introdução institucional */}
        <Reveal>
          <section>
            <SectionHeading
              icon={Sparkles}
              eyebrow="Introdução"
              title="Conteúdo confiável, baseado em fontes oficiais"
            />
            <p className="text-[16px] leading-relaxed text-foreground/85">
              Todo o conteúdo do <strong>Infância Protegida</strong> é
              desenvolvido com base em fontes oficiais, legislação brasileira,
              materiais educacionais reconhecidos e organizações especializadas
              na defesa dos direitos da criança e do adolescente.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-foreground/85">
              O portal <strong>não produz opiniões</strong>: nosso trabalho é
              organizar, verificar e traduzir informações confiáveis para
              facilitar o acesso da população — de famílias e educadores a
              profissionais da rede de proteção.
            </p>
          </section>
        </Reveal>

        {/* Processo */}
        <Reveal delay={60}>
          <section>
            <SectionHeading
              icon={Compass}
              eyebrow="Processo editorial"
              title="Como produzimos o conteúdo"
            />
            <ol className="space-y-4">
              {etapas.map(({ n, icon: Icon, title, text }) => (
                <li
                  key={n}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <span className="font-display text-2xl font-semibold text-[color:var(--orange)] leading-none">
                      {n}
                    </span>
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[color:var(--orange-soft)] text-[color:var(--orange)]">
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>

        {/* Critérios de qualidade */}
        <Reveal delay={120}>
          <section>
            <SectionHeading
              icon={ShieldCheck}
              eyebrow="Qualidade"
              title="Nossos critérios de qualidade"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {criterios.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-border bg-card p-5 hover-lift"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[color:var(--orange-soft)] text-[color:var(--orange)]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Fontes utilizadas */}
        <Reveal delay={180}>
          <section>
            <SectionHeading
              icon={Library}
              eyebrow="Referências"
              title="Fontes utilizadas"
            />
            <p className="mb-5 text-[15px] leading-relaxed text-foreground/85">
              Essas instituições são utilizadas como referência por sua
              autoridade reconhecida nacional e internacionalmente em direitos
              da criança, segurança pública e proteção online.
            </p>
            <ul className="space-y-3">
              {fontes.map((f) => (
                <li
                  key={f.nome}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[color:var(--orange-soft)] text-[color:var(--orange)] shrink-0">
                    <BookOpen className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-[15px]">
                      {f.nome}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                      {f.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Veja a lista completa em{" "}
              <Link
                to="/fontes"
                className="underline underline-offset-2 hover:text-[color:var(--orange)]"
              >
                Fontes Utilizadas
              </Link>
              .
            </p>
          </section>
        </Reveal>

        {/* Compromisso editorial */}
        <Reveal delay={240}>
          <section>
            <SectionHeading
              icon={ShieldAlert}
              eyebrow="Compromisso editorial"
              title="O que somos — e o que não somos"
            />
            <div className="rounded-2xl border-l-4 border-[color:var(--orange)] bg-[color:var(--orange-soft)]/40 p-6">
              <p className="text-[15.5px] leading-relaxed text-foreground/90">
                O <strong>Infância Protegida</strong> não substitui atendimento
                psicológico, jurídico, policial ou assistencial. Nosso papel é{" "}
                <strong>informar, conscientizar e orientar</strong> com base em
                fontes oficiais — e indicar, sempre, os canais e profissionais
                competentes para cada situação.
              </p>
            </div>
          </section>
        </Reveal>

        {/* Atualização de conteúdo */}
        <Reveal delay={300}>
          <section>
            <SectionHeading
              icon={RefreshCw}
              eyebrow="Atualização"
              title="Como mantemos o conteúdo atualizado"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {atualizacao.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[color:var(--orange-soft)] text-[color:var(--orange)] shrink-0">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                      {text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Chamada final */}
        <Reveal delay={360}>
          <aside className="rounded-3xl border border-[color:var(--orange)]/30 bg-gradient-to-br from-[color:var(--orange-soft)] via-background to-background p-8 sm:p-10 text-center">
            <Sparkles
              className="size-7 text-[color:var(--orange)] mx-auto"
              aria-hidden
            />
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-semibold text-foreground text-balance leading-tight">
              Informação confiável salva vidas
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-foreground/85 max-w-2xl mx-auto">
              A proteção infantil começa pelo acesso à informação correta.
              Quanto mais pessoas conhecem os sinais, os direitos e os canais
              de denúncia, maior é a capacidade da sociedade de proteger
              crianças e adolescentes.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/sinais"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-orange text-[color:var(--navy-deep)] px-5 py-2.5 text-sm font-semibold shadow-orange hover:opacity-95 transition"
              >
                <ShieldCheck className="size-4" aria-hidden /> Identificar Sinais
              </Link>
              <Link
                to="/mapa"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--red-inst)] text-[color:var(--red-inst-foreground)] px-5 py-2.5 text-sm font-semibold hover:opacity-95 transition shadow-sm"
              >
                <MapPin className="size-4" aria-hidden /> Mapa de Ajuda
              </Link>
              <Link
                to="/biblioteca"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy)]/30 bg-background text-foreground px-5 py-2.5 text-sm font-semibold hover:bg-muted transition"
              >
                <Library className="size-4" aria-hidden /> Biblioteca
              </Link>
            </div>
          </aside>
        </Reveal>
      </article>
    </>
  );
}
