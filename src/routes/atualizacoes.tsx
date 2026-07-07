import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/public/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { Badge } from "@/components/ui/badge";
import { History, Shield, Layout, BookOpen, Search, Eye, Sparkles, Activity } from "lucide-react";
import heroImg from "@/assets/hero-protection.jpg";

const SITE_URL = "https://minhainfanciaprotegida.com.br";
const PAGE_URL = `${SITE_URL}/atualizacoes`;

export const Route = createFileRoute("/atualizacoes")({
  head: () => ({
    meta: [
      { title: "Atualizações do Projeto | Minha Infância Protegida" },
      {
        name: "description",
        content:
          "Acompanhe as melhorias, novidades e evoluções do portal Minha Infância Protegida, incluindo segurança, acessibilidade, conteúdo educativo e recursos de proteção infantil.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Atualizações do Projeto | Minha Infância Protegida" },
      {
        property: "og:description",
        content:
          "Acompanhe as melhorias, novidades e evoluções do portal Minha Infância Protegida, incluindo segurança, acessibilidade, conteúdo educativo e recursos de proteção infantil.",
      },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: heroImg },
      { property: "og:site_name", content: "Infância Protegida" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Atualizações do Projeto | Minha Infância Protegida" },
      {
        name: "twitter:description",
        content:
          "Acompanhe as melhorias, novidades e evoluções do portal Minha Infância Protegida.",
      },
      { name: "twitter:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Atualizações do Projeto | Minha Infância Protegida",
          url: PAGE_URL,
          inLanguage: "pt-BR",
          description:
            "Acompanhe as melhorias, novidades e evoluções do portal Minha Infância Protegida.",
          isPartOf: {
            "@type": "WebSite",
            name: "Infância Protegida",
            url: SITE_URL,
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL + "/" },
            { "@type": "ListItem", position: 2, name: "Atualizações", item: PAGE_URL },
          ],
        }),
      },
    ],
  }),
  component: AtualizacoesPage,
});

const updates = [
  {
    date: "Junho 2026",
    title: "Criação de Hubs Educativos",
    category: "Conteúdo",
    icon: BookOpen,
    desc: "Transformação das páginas públicas em hubs de autoridade, com FAQs para famílias, escolas e rede de proteção.",
    impact: "Maior capacidade educativa e foco em prevenção responsável."
  },
  {
    date: "Junho 2026",
    title: "Melhorias de Acessibilidade e SEO",
    category: "SEO",
    icon: Search,
    desc: "Implementação de dados estruturados automáticos (JSON-LD), atributos ARIA e melhoria no contraste de cores.",
    impact: "Site mais inclusivo e fácil de ser encontrado no Google."
  },
  {
    date: "Junho 2026",
    title: "Reforço de Segurança no Painel Administrativo",
    category: "Segurança",
    icon: Shield,
    desc: "MFA (Múltiplo Fator de Autenticação) obrigatório para áreas críticas e reestruturação rigorosa das roles (admin, editor, reviewer, viewer).",
    impact: "Proteção contra acessos indevidos na gestão de conteúdo."
  },
  {
    date: "Junho 2026",
    title: "Organização da Biblioteca",
    category: "Biblioteca",
    icon: Layout,
    desc: "Refatoração completa para categorizar os documentos por público-alvo (Pais, Escolas, Segurança Digital).",
    impact: "Mais facilidade para encontrar cartilhas e guias vitais."
  },
  {
    date: "Junho 2026",
    title: "Melhorias na Página de Denúncia",
    category: "Rede de Proteção",
    icon: Activity,
    desc: "Reformulação da área de denúncia, orientando usuários com perguntas frequentes e separando emergência (190) de denúncia anônima (100).",
    impact: "Encaminhamento mais rápido e seguro de vítimas e testemunhas."
  },
  {
    date: "Junho 2026",
    title: "Remoção de Login por Provedores Externos",
    category: "Segurança",
    icon: Shield,
    desc: "Remoção de OAuth e Google Login para gestão própria e altamente segura de credenciais.",
    impact: "Maior controle sobre quem tem acesso editorial ao portal."
  },
  {
    date: "Junho 2026",
    title: "Separação entre Site Público e Painel Admin",
    category: "Transparência",
    icon: Sparkles,
    desc: "Desacoplamento de rotas e melhoria de SSR, impedindo injeção indevida e garantindo carregamento ultrarrápido das páginas públicas.",
    impact: "Performance elevada e barreira técnica sólida de segurança."
  },
  {
    date: "Junho 2026",
    title: "Revisão de Linguagem e Termos",
    category: "Conteúdo",
    icon: Eye,
    desc: "Substituição de termos inadequados e remoção de linguagem sensacionalista para evitar revitimização e manter tom institucional.",
    impact: "Abordagem ética, não traumática e focada exclusivamente na prevenção."
  }
];

function AtualizacoesPage() {
  return (
    <>
      <PageHero
        image={heroImg}
        eyebrow="Histórico"
        title="Atualizações do Projeto"
        breadcrumb={[
          { label: "Início", to: "/" },
          { label: "Atualizações" },
        ]}
        description="Acompanhe as melhorias, novidades e evoluções implementadas no portal Minha Infância Protegida."
        icon={<History className="size-3.5" aria-hidden />}
        tall
      />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        {/* Bloco de transparência */}
        <Reveal>
          <div className="mb-16 rounded-3xl border border-[color:var(--orange)]/30 bg-[color:var(--orange-soft)]/40 p-6 sm:p-10 text-center">
            <Sparkles className="size-8 text-[color:var(--orange)] mx-auto mb-4" aria-hidden />
            <p className="text-lg leading-relaxed text-foreground/90 font-medium">
              Esta página reúne as principais atualizações realizadas no portal, incluindo melhorias de segurança, acessibilidade, organização de conteúdo, recursos educativos e ajustes técnicos importantes para tornar a navegação mais clara, segura e confiável.
            </p>
          </div>
        </Reveal>

        {/* Timeline institucional — histórico de evolução do projeto */}
        <div className="relative">
          <span
            className="absolute left-[15px] sm:left-[19px] top-3 bottom-3 w-px bg-border"
            aria-hidden
          />
          <ol className="space-y-8">
            {updates.map((up, i) => {
              const Icon = up.icon;
              return (
                <Reveal key={i} delay={i * 50} as="li">
                  <div className="relative pl-12 sm:pl-16">
                    <span className="absolute left-0 top-0 inline-flex size-8 sm:size-10 items-center justify-center rounded-full bg-[color:var(--orange-soft)] text-[color:var(--orange)] ring-4 ring-background">
                      <Icon className="size-4 sm:size-5" aria-hidden />
                    </span>
                    <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 hover-lift">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <Badge variant="orange">{up.category}</Badge>
                        <span className="text-sm font-semibold text-muted-foreground">{up.date}</span>
                      </div>
                      <h3 className="mt-3 font-display text-xl sm:text-2xl font-semibold text-[color:var(--navy-deep)]">
                        {up.title}
                      </h3>
                      <p className="mt-2 text-base text-foreground/80 leading-relaxed">{up.desc}</p>
                      <div className="mt-4 flex items-start gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm text-foreground/90">
                        <strong className="font-semibold text-[color:var(--navy-deep)] shrink-0">Impacto:</strong>
                        <span>{up.impact}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>

        {/* CTA final */}
        <Reveal delay={200}>
          <div className="mt-16 flex flex-wrap justify-center gap-4 border-t border-border pt-12">
            <Link
              to="/sobre"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-[color:var(--navy-deep)] hover:bg-muted transition"
            >
              Conheça o projeto
            </Link>
            <Link
              to="/biblioteca"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-[color:var(--navy-deep)] hover:bg-muted transition"
            >
              Acessar biblioteca
            </Link>
            <Link
              to="/denuncia"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--orange)] px-6 py-3 text-sm font-bold text-[color:var(--navy-deep)] hover:opacity-95 transition"
            >
              Ver como denunciar
            </Link>
          </div>
        </Reveal>

      </article>
    </>
  );
}
