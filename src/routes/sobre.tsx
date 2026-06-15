import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  Heart,
  Info,
  Ribbon,
  Sparkles,
  Target,
  UserCircle2,
} from "lucide-react";
import type { ReactNode } from "react";
import { PageHero } from "@/components/public/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { FaqBlock } from "@/components/public/ArticleBlocks";
import heroImg from "@/assets/hero-protection.jpg";

const SITE_URL = "https://minhainfanciaprotegida.com.br";
const PAGE_URL = `${SITE_URL}/sobre`;

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o Projeto — Infância Protegida" },
      {
        name: "description",
        content:
          "A história do Infância Protegida: portal brasileiro criado por Luiz, 16 anos, dedicado à conscientização, prevenção e combate ao abuso e à exploração sexual de crianças e adolescentes.",
      },
      {
        name: "keywords",
        content:
          "infância protegida, sobre o projeto, proteção infantil, abuso sexual infantil, maio laranja, conscientização, prevenção, ECA, denúncia",
      },
      { name: "author", content: "Luiz — Infância Protegida" },
      { name: "robots", content: "index, follow, max-image-preview:large" },

      { property: "og:type", content: "website" },
      { property: "og:title", content: "Sobre o Projeto — Infância Protegida" },
      {
        property: "og:description",
        content:
          "Conheça a história, a missão e o compromisso do portal Infância Protegida com a proteção de crianças e adolescentes no Brasil.",
      },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: heroImg },
      { property: "og:site_name", content: "Infância Protegida" },
      { property: "og:locale", content: "pt_BR" },

      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Sobre o Projeto — Infância Protegida" },
      {
        name: "twitter:description",
        content:
          "Portal brasileiro de conscientização e combate ao abuso e à exploração sexual de crianças e adolescentes.",
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
          name: "Sobre o Projeto — Infância Protegida",
          url: PAGE_URL,
          inLanguage: "pt-BR",
          description:
            "Portal brasileiro de conscientização, educação preventiva e combate ao abuso e à exploração sexual de crianças e adolescentes.",
          isPartOf: {
            "@type": "WebSite",
            name: "Infância Protegida",
            url: SITE_URL,
          },
          about: {
            "@type": "Organization",
            name: "Infância Protegida",
            url: SITE_URL,
            logo: `${SITE_URL}/favicon.ico`,
            founder: {
              "@type": "Person",
              name: "Luiz",
              description:
                "Criador do portal Infância Protegida, 16 anos, idealizador do projeto de conscientização e prevenção.",
            },
            foundingDate: "2025",
            areaServed: "BR",
            mission:
              "Promover a conscientização sobre a proteção infantil, ajudando famílias, escolas e comunidades a identificar situações de risco e conhecer os caminhos corretos para denúncia.",
            sameAs: [
              "https://www.gov.br/mdh/pt-br",
              "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
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
              { "@type": "ListItem", position: 2, name: "Sobre o Projeto", item: PAGE_URL },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": PAGE_URL + "#webpage",
            url: PAGE_URL,
            name: "Sobre o Projeto — Infância Protegida",
            inLanguage: "pt-BR",
            isPartOf: { "@id": SITE_URL + "/#website" },
            about: { "@id": SITE_URL + "/#organization" },
            mainEntity: { "@id": SITE_URL + "/#organization" },
            mentions: [
              { "@id": SITE_URL + "/#maio-laranja" },
              { "@id": SITE_URL + "/#term-protecao-infantil" },
              { "@id": SITE_URL + "/#term-eca" },
              { "@id": SITE_URL + "/#term-disque-100" },
            ],
          },
        ]),
      },
    ],
  }),
  component: Page,
});

interface Section {
  id: string;
  eyebrow: string;
  title: string;
  icon: ReactNode;
  body: ReactNode;
}

function Page() {
  return (
    <>
      <PageHero
        image={heroImg}
        eyebrow="Sobre o projeto"
        title="A História do Infância Protegida"
        description="Um portal brasileiro criado por um jovem de 16 anos para usar a tecnologia como ferramenta de proteção, conscientização e prevenção da violência contra crianças e adolescentes."
        icon={<Info className="size-3.5" aria-hidden />}
        tall
      />

      {/* Sumário rápido */}
      <nav
        aria-label="Sumário desta página"
        className="border-b border-border bg-muted/30"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-foreground/70 hover:text-[color:var(--orange)] transition-colors"
            >
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-14">
        {sections.map((s, i) => (
          <Reveal key={s.id} delay={i * 60}>
            <section id={s.id} className="scroll-mt-24">
              <header className="flex items-center gap-3 mb-5">
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[color:var(--orange-soft)] text-[color:var(--orange)] shrink-0">
                  {s.icon}
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--orange)]">
                    {s.eyebrow}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
                    {s.title}
                  </h2>
                </div>
              </header>
              <div className="prose-content space-y-4 text-[15.5px] leading-relaxed text-foreground/85">
                {s.body}
              </div>
            </section>
          </Reveal>
        ))}

        {/* Mensagem final destacada */}
        <Reveal delay={120}>
          <aside className="rounded-3xl border border-[color:var(--orange)]/30 bg-gradient-to-br from-[color:var(--orange-soft)] via-background to-background p-8 sm:p-10 text-center">
            <Sparkles
              className="size-7 text-[color:var(--orange)] mx-auto"
              aria-hidden
            />
            <p className="mt-4 font-display text-2xl sm:text-3xl font-semibold text-foreground text-balance leading-tight">
              Se este projeto ajudar uma única criança a ser protegida, todo o
              esforço já terá valido a pena.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              — Luiz, criador do Infância Protegida
            </p>
          </aside>
        </Reveal>
      </article>

      {/* FAQ Sobre */}
      <section className="py-20 bg-background border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FaqBlock
            items={[
              {
                q: "O portal Minha Infância Protegida recebe denúncias ou faz investigações?",
                a: "Não. Somos um portal focado exclusivamente na educação, prevenção e conscientização. Não recebemos nem investigamos denúncias. Para isso, encaminhamos os usuários aos canais oficiais e seguros do Estado brasileiro, como o Disque 100, 190 e SaferNet.",
              },
              {
                q: "Como o projeto é financiado?",
                a: "O portal é um projeto independente, sem fins lucrativos, comerciais ou políticos, desenvolvido e mantido voluntariamente. Não aceitamos doações em dinheiro. O objetivo é unicamente servir à sociedade.",
              },
              {
                q: "Como posso ajudar o Infância Protegida?",
                a: "A melhor forma de ajudar é compartilhando os materiais do portal. Envie os links para o grupo da escola, para outros pais e familiares. A informação e a conscientização são as ferramentas mais poderosas para quebrar o ciclo do abuso.",
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}

const sections: Section[] = [
  {
    id: "minha-historia",
    eyebrow: "Minha história",
    title: "Onde tudo começou",
    icon: <UserCircle2 className="size-5" aria-hidden />,
    body: (
      <>
        <p>
          Meu nome é <strong>Luiz</strong>, tenho <strong>16 anos</strong> e sou
          o criador do portal Infância Protegida.
        </p>
        <p>
          A ideia de criar este projeto surgiu após conhecer histórias reais e
          dados alarmantes sobre abuso, violência e exploração sexual de
          crianças e adolescentes no Brasil. Ao perceber que muitas pessoas não
          sabem identificar sinais de alerta, desconhecem os canais de denúncia
          ou não sabem como agir diante de uma suspeita, decidi criar um espaço
          que pudesse ajudar a levar informação confiável para mais pessoas.
        </p>
        <p>
          Mesmo sendo jovem, entendi que a tecnologia poderia ser utilizada
          para algo maior: <strong>proteger vidas</strong> por meio da
          informação, da conscientização e da prevenção.
        </p>
      </>
    ),
  },
  {
    id: "o-que-e",
    eyebrow: "O projeto",
    title: "O que é o Infância Protegida",
    icon: <Info className="size-5" aria-hidden />,
    body: (
      <>
        <p>
          O Infância Protegida é um <strong>portal brasileiro</strong> de
          conscientização, educação preventiva e combate ao abuso e à
          exploração sexual de crianças e adolescentes.
        </p>
        <p>
          O projeto reúne conteúdos educativos, materiais de referência,
          orientações práticas, legislação, canais oficiais de ajuda e
          informações baseadas em fontes confiáveis, com o objetivo de apoiar{" "}
          <strong>pais, responsáveis, professores, educadores</strong> e toda a
          sociedade.
        </p>
      </>
    ),
  },
  {
    id: "missao",
    eyebrow: "Missão",
    title: "Nossa missão",
    icon: <Target className="size-5" aria-hidden />,
    body: (
      <p>
        Promover a conscientização sobre a proteção infantil, ajudando
        famílias, escolas e comunidades a identificar situações de risco,
        prevenir violências e conhecer os caminhos corretos para buscar ajuda e
        realizar denúncias.
      </p>
    ),
  },
  {
    id: "visao",
    eyebrow: "Visão",
    title: "Nossa visão",
    icon: <Eye className="size-5" aria-hidden />,
    body: (
      <p>
        Contribuir para a construção de uma sociedade mais consciente,
        preparada e comprometida com a <strong>proteção integral</strong> de
        crianças e adolescentes.
      </p>
    ),
  },
  {
    id: "compromisso",
    eyebrow: "Compromisso",
    title: "Nosso compromisso",
    icon: <Heart className="size-5" aria-hidden />,
    body: (
      <>
        <p>O Infância Protegida tem o compromisso de:</p>
        <ul className="not-prose grid gap-3 sm:grid-cols-2 mt-2">
          {[
            "Divulgar informações confiáveis e verificadas.",
            "Combater a desinformação.",
            "Promover educação preventiva.",
            "Incentivar a denúncia responsável.",
            "Divulgar direitos garantidos por lei.",
            "Fortalecer a cultura da proteção infantil.",
          ].map((c) => (
            <li
              key={c}
              className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3.5 text-sm text-foreground/85"
            >
              <CheckCircle2
                className="size-4 text-[color:var(--orange)] mt-0.5 shrink-0"
                aria-hidden
              />
              {c}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "por-que-existe",
    eyebrow: "Propósito",
    title: "Por que este projeto existe",
    icon: <Sparkles className="size-5" aria-hidden />,
    body: (
      <>
        <p>
          Milhares de casos de violência contra crianças e adolescentes
          acontecem todos os anos.
        </p>
        <p>
          Muitas dessas situações poderiam ser identificadas mais cedo se mais
          pessoas soubessem <strong>reconhecer os sinais de alerta</strong> e
          conhecessem os canais de proteção disponíveis.
        </p>
        <p>
          O projeto existe para ajudar a preencher essa lacuna, tornando
          informações importantes mais acessíveis e compreensíveis para todos.
        </p>
      </>
    ),
  },
  {
    id: "maio-laranja",
    eyebrow: "Mobilização",
    title: "Maio Laranja e conscientização",
    icon: <Ribbon className="size-5" aria-hidden />,
    body: (
      <>
        <p>
          O portal também apoia os princípios do <strong>Maio Laranja</strong>,
          campanha nacional de combate ao abuso e à exploração sexual de
          crianças e adolescentes.
        </p>
        <p>
          A conscientização é uma das ferramentas mais importantes na prevenção
          da violência infantil.
        </p>
        <p>
          Quando mais pessoas conhecem os sinais, os direitos e os canais de
          denúncia, maiores são as chances de proteger crianças em situação de
          vulnerabilidade.
        </p>
      </>
    ),
  },
  {
    id: "fontes",
    eyebrow: "Transparência",
    title: "Fontes e responsabilidade",
    icon: <BookOpen className="size-5" aria-hidden />,
    body: (
      <>
        <p>
          O conteúdo disponibilizado no portal é produzido com base em
          materiais oficiais, legislações brasileiras, cartilhas educativas e
          referências reconhecidas nacionalmente na área da proteção infantil.
        </p>
        <p>
          O objetivo é fornecer informações <strong>seguras, atualizadas</strong>{" "}
          e úteis para a sociedade.
        </p>
      </>
    ),
  },
  {
    id: "mensagem-final",
    eyebrow: "Mensagem final",
    title: "Proteger é uma responsabilidade coletiva",
    icon: <Heart className="size-5" aria-hidden />,
    body: (
      <>
        <p>
          A proteção da infância não é responsabilidade de apenas uma pessoa,
          instituição ou órgão público.
        </p>
        <p>
          É uma <strong>responsabilidade coletiva</strong>.
        </p>
        <p>
          Cada orientação compartilhada, cada denúncia realizada e cada criança
          protegida representam um passo importante para construir um futuro
          melhor.
        </p>
      </>
    ),
  },
];
