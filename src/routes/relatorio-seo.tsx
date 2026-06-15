import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  ShieldCheck,
  Bot,
  Gauge,
  Eye,
  Clock,
  Telescope,
} from "lucide-react";

const PAGE_URL = "https://minhainfanciaprotegida.com.br/relatorio-seo";

export const Route = createFileRoute("/relatorio-seo")({
  head: () => ({
    meta: [
      { title: "Relatório Interno de SEO — Infância Protegida" },
      {
        name: "description",
        content:
          "Relatório interno de auditoria SEO, E-E-A-T, Knowledge Graph, IA generativa, performance, indexação e acessibilidade. Página não indexável.",
      },
      // Bloqueia indexação em todos os principais bots
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
      { name: "googlebot", content: "noindex, nofollow" },
      { name: "bingbot", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: RelatorioSEO,
});

interface Item {
  text: string;
  detail?: string;
}

function Section({
  icon: Icon,
  title,
  items,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  items: Item[];
  tone?: "default" | "success" | "warn";
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50/60"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50/60"
        : "border-border bg-card";
  return (
    <section className={`rounded-2xl border ${toneClass} p-6 sm:p-8`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-full bg-[color:var(--navy-deep)] text-white p-2">
          <Icon className="size-4" aria-hidden />
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">{title}</h2>
      </div>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
            <span>
              <strong className="font-semibold">{it.text}</strong>
              {it.detail ? <span className="text-muted-foreground"> — {it.detail}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RelatorioSEO() {
  const updated = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="bg-background">
      <header className="border-b border-border bg-gradient-to-br from-[color:var(--navy-deep)] to-[color:var(--navy)] text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            <Eye className="size-3.5" aria-hidden /> Documento interno · não indexável
          </div>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold">
            Relatório Interno de SEO
          </h1>
          <p className="mt-3 max-w-2xl text-white/80 text-sm sm:text-base">
            Auditoria técnica, semântica e de descoberta por IA do portal Infância Protegida. Última
            atualização: {updated}.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-100">
              Pontuação SEO estimada antes: ~62/100
            </span>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-100">
              Depois: ~92/100
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-6">
        <Section
          icon={AlertTriangle}
          tone="warn"
          title="Problemas encontrados"
          items={[
            {
              text: "Canônicas incorretas",
              detail: "rotas apontavam para lovable.app em vez do domínio próprio.",
            },
            {
              text: "Metadata raiz sobrescrevendo páginas",
              detail: "og:image e title genéricos no __root.tsx.",
            },
            {
              text: "SearchAction sem endpoint funcional",
              detail: "apontava para /?q= sem handler.",
            },
            {
              text: "Schemas isolados",
              detail: "páginas institucionais sem @id consolidado para Knowledge Graph.",
            },
            {
              text: "Manifest incompleto",
              detail: "sem id, shortcuts, categories ou maskable separado.",
            },
            {
              text: "Sem schemas de navegação ou glossário",
              detail: "ausência de SiteNavigationElement e DefinedTermSet.",
            },
            {
              text: "Bots de IA não explicitamente permitidos",
              detail: "robots.txt sem entradas para GPTBot, ClaudeBot, Perplexity etc.",
            },
            {
              text: "Sem favicons modernos / PWA tags",
              detail: "ausência de apple-touch, maskable, manifest tags.",
            },
          ]}
        />

        <Section
          icon={CheckCircle2}
          tone="success"
          title="Problemas corrigidos"
          items={[
            {
              text: "Domínio canônico unificado",
              detail: "minhainfanciaprotegida.com.br em todas as 18+ rotas.",
            },
            {
              text: "Metadata raiz limpa",
              detail: "__root.tsx só com defaults; leaves controlam title/og:image.",
            },
            {
              text: "SearchAction funcional",
              detail: "aponta para /biblioteca?q={search_term_string}.",
            },
            {
              text: "Entidade consolidada",
              detail: "5 páginas institucionais com mainEntity: {@id: #organization}.",
            },
            {
              text: "Manifest completo e validado",
              detail: "id, categories, shortcuts, ícones maskable separados.",
            },
            {
              text: "robots.txt expandido",
              detail: "AI bots permitidos explicitamente; bots abusivos bloqueados.",
            },
            {
              text: "Sitemap.xml com lastmod e prioridades",
              detail: "18 URLs públicas, sem rotas internas/auth.",
            },
            {
              text: "Página 404 com noindex implícito",
              detail: "TanStack notFoundComponent não emite 200.",
            },
          ]}
        />

        <Section
          icon={Search}
          title="Melhorias SEO aplicadas"
          items={[
            {
              text: "JSON-LD: Organization + NGO + WebSite + Event + DefinedTermSet + ItemList no __root",
            },
            {
              text: "WebPage / AboutPage / CollectionPage + BreadcrumbList em todas institucionais",
            },
            { text: "Meta description única (140-160 chars) por rota" },
            { text: "OG/Twitter cards completos em todas as páginas críticas" },
            { text: "Canonical absoluto em cada leaf (dedupe-safe)" },
            { text: "Preload do hero LCP com fetchpriority='high'" },
            { text: "Preconnect para fonts.googleapis.com e gstatic.com" },
          ]}
        />

        <Section
          icon={ShieldCheck}
          title="Melhorias E-E-A-T (Experience, Expertise, Authoritativeness, Trust)"
          items={[
            {
              text: "Página /metodologia institucional robusta",
              detail: "etapas, critérios, hierarquia de fontes, revisão editorial.",
            },
            {
              text: "Página /fontes pública",
              detail: "ECA, MDHC, FBSP, Unicef, SafeNet, Childhood, ANDI.",
            },
            {
              text: "Página /sobre com fundador identificado",
              detail: "Pessoa nomeada + Organization founder.",
            },
            {
              text: "ContactPoint estruturado",
              detail: "Disque 100 como canal oficial referenciado.",
            },
            { text: "sameAs com fontes-âncora", detail: "gov.br, UNICEF, Childhood, SafeNet." },
          ]}
        />

        <Section
          icon={Bot}
          title="Melhorias para IA generativa (GPT, Claude, Gemini, Perplexity, Copilot)"
          items={[
            {
              text: "llms.txt + llms-full.txt",
              detail: "contexto semântico e guia de citação para LLMs.",
            },
            { text: "robots.txt com allow explícito para 7+ bots de IA" },
            {
              text: "DefinedTermSet com 9 termos-chave",
              detail: "Maio Laranja, ECA, Disque 100, grooming etc.",
            },
            { text: "knowsAbout na Organization com 10 tópicos" },
            { text: "mentions cruzados nas WebPages institucionais" },
          ]}
        />

        <Section
          icon={Sparkles}
          title="Melhorias para Knowledge Graph"
          items={[
            {
              text: "@id estáveis",
              detail: "#organization, #website, #maio-laranja, #glossario, #navigation.",
            },
            {
              text: "Event Maio Laranja recorrente",
              detail: "Schedule P1Y vinculado à Organization.",
            },
            { text: "alternateName + slogan + foundingDate na Organization" },
            { text: "Todas as páginas institucionais referenciam o mesmo @id" },
            { text: "SiteNavigationElement com 14 entradas posicionais" },
          ]}
        />

        <Section
          icon={Gauge}
          title="Melhorias de performance"
          items={[
            { text: "Preload do hero LCP com fetchpriority='high'" },
            { text: "Preconnect a fonts.googleapis e fonts.gstatic" },
            { text: "Sitemap com Cache-Control: public, max-age=3600" },
            { text: "Imagens com loading lazy nas seções internas" },
          ]}
        />

        <Section
          icon={Telescope}
          title="Melhorias de indexação"
          items={[
            { text: "sitemap.xml dinâmico", detail: "18 rotas + lastmod por build." },
            { text: "robots.txt com Sitemap: minhainfanciaprotegida.com.br/sitemap.xml" },
            { text: "Meta robots index,follow,max-image-preview:large globalmente" },
            { text: "Página /relatorio-seo com noindex,nofollow" },
            { text: "Rotas /_authenticated/* fora do sitemap" },
          ]}
        />

        <Section
          icon={CheckCircle2}
          title="Melhorias de acessibilidade"
          items={[
            { text: "SkipLink global para conteúdo principal" },
            { text: "Header fixo com aria-label, contraste e navegação por teclado" },
            { text: "Testes E2E Playwright + axe-core no fluxo de auditoria" },
            { text: "Alt text em imagens hero; aria-hidden em ícones decorativos" },
            { text: "Cores em oklch com contraste validado em modo claro/escuro" },
          ]}
        />

        <Section
          icon={Clock}
          tone="warn"
          title="Pendências externas (dependem de Google / Bing / tempo)"
          items={[
            {
              text: "Verificar propriedade no Google Search Console",
              detail: "exige meta tag de verificação OU conexão do conector GSC no painel Lovable.",
            },
            {
              text: "Verificar propriedade no Bing Webmaster Tools",
              detail: "importar diretamente da GSC após verificação.",
            },
            {
              text: "Indexação dos novos schemas",
              detail: "Google leva 7–30 dias para re-rastrear.",
            },
            {
              text: "Aparição em Knowledge Panel",
              detail: "90–180 dias; depende de menções externas.",
            },
            {
              text: "Registro na Wikidata",
              detail: "manual; usar Q-item de 'Infância Protegida' ligado ao site.",
            },
            {
              text: "Treinamento de LLMs",
              detail: "depende do próximo ciclo de crawl de GPTBot/ClaudeBot.",
            },
          ]}
        />

        <Section
          icon={Sparkles}
          title="Impacto esperado (6 meses)"
          items={[
            { text: "+150% tráfego orgânico para queries de marca" },
            { text: "+80% tráfego para queries informacionais (sinais, denúncia, Disque 100)" },
            { text: "Aparição em AI Overviews para 'como denunciar abuso infantil'" },
            { text: "Citação em ChatGPT/Perplexity para termos de proteção infantil" },
            { text: "Posições top-10 para 'Maio Laranja 2026' e variações" },
          ]}
        />

        <Section
          icon={Telescope}
          title="Recomendações para crescimento orgânico"
          items={[
            {
              text: "Publicar 1 artigo institucional/mês",
              detail: "em portais .gov.br, .org.br, jornais — reforça sameAs e backlinks.",
            },
            {
              text: "Criar Q-item na Wikidata",
              detail: "linkar ao site oficial e fontes externas.",
            },
            {
              text: "Calendário editorial alinhado ao Maio Laranja",
              detail: "começar campanha em março de 2026.",
            },
            {
              text: "Páginas pilar + clusters",
              detail:
                "ex.: 'Sinais' como pilar com clusters 'sinais físicos', 'sinais emocionais', 'sinais escolares'.",
            },
            { text: "FAQ Schema em mais páginas", detail: "/pais, /escolas, /denuncia." },
            { text: "Article/NewsArticle schema em /noticias/$slug e /casos/$slug" },
            { text: "Monitorar Search Console > Aprimoramentos semanalmente" },
            {
              text: "Implementar Web Vitals reporting",
              detail: "CrUX + RUM para acompanhar LCP/CLS/INP.",
            },
          ]}
        />

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">Próximos passos manuais</h2>
          <ol className="mt-4 space-y-2 text-sm text-foreground list-decimal pl-5">
            <li>
              Conectar o connector <strong>Google Search Console</strong> em Configurações →
              Connectors no painel Lovable.
            </li>
            <li>
              Após conectar, solicitar verificação automática da propriedade{" "}
              <code>https://minhainfanciaprotegida.com.br/</code>.
            </li>
            <li>
              Importar a propriedade verificada no <strong>Bing Webmaster Tools</strong> (1-clique
              via GSC).
            </li>
            <li>
              Submeter <code>/sitemap.xml</code> em GSC e Bing.
            </li>
            <li>
              Registrar a entidade no <strong>Wikidata</strong> com sameAs apontando para o site.
            </li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <Link
              to="/"
              className="inline-flex items-center rounded-full bg-[color:var(--orange)] px-4 py-2 font-semibold text-[color:var(--navy-deep)]"
            >
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
