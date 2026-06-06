# Auditoria técnica + Otimização SEO avançada — Infância Protegida

Sem alterar layout, cores, menus, responsividade ou UX. Todo o trabalho é nos
bastidores: metadados, schema, canonicals, sitemap, robots, favicons,
performance e acessibilidade.

Domínio canônico oficial: **https://minhainfanciaprotegida.com.br**

---

## 1. Correções imediatas de domínio canônico

Trocar todas as referências residuais de `minhainfanciaprotegida.lovable.app` por `minhainfanciaprotegida.com.br`:

- `src/routes/sitemap[.]xml.ts` → `BASE_URL`
- `public/robots.txt` → linha `Sitemap:`
- `src/routes/casos.$slug.tsx` → constante `SITE`
- `src/routes/noticias.$slug.tsx` → constante `SITE`

## 2. Remoção total da página "Galeria"

- Excluir referência em `public/llms.txt` (linha "Galeria").
- `rg` confirma que não há rota, link interno, schema ou breadcrumb apontando para `/galeria` — só o llms.txt remanesce.

## 3. Limpeza de `src/routes/__root.tsx`

- Remover `og:image` / `twitter:image` da raiz (regra TanStack: leaf-only, raiz sobrescreve filhos).
- Remover entradas duplicadas de `description`, `og:description`, `twitter:description`.
- Manter só os defaults sitewide: charset, viewport, theme-color, robots, og:type=website, og:locale, twitter:card, author.
- Adicionar `og:site_name`, `application-name`, `apple-mobile-web-app-title`.
- Trocar o JSON-LD `Organization` por um array com **Organization + WebSite** (WebSite com `potentialAction` SearchAction apontando para `/?q={search_term_string}` para sitelinks searchbox).

## 4. Padronização do `head()` em todas as rotas-folha

Criar um helper `src/lib/seo.ts` exportando `SITE_URL` e funções utilitárias:

```ts
export const SITE_URL = "https://minhainfanciaprotegida.com.br";
export function pageMeta({ path, title, description, image, type }): MetaDescriptor[]
export function canonicalLink(path: string): LinkDescriptor
```

Aplicar em cada rota o conjunto completo (title único, description 140–160, og:*, twitter:*, canonical absoluto). Rotas afetadas:

```text
index, maio-laranja, sinais, riscos-online, pais, escolas,
biblioteca, casos, noticias, como-ajudar, denuncia, legislacao,
mapa, faq, sobre, objetivos, metodologia, fontes
```

Cada uma recebe palavras-chave temáticas distribuídas naturalmente
(abuso infantil, exploração sexual, Maio Laranja, ECA, Disque 100,
proteção infantil, segurança digital, cyberbullying, conselho tutelar,
direitos da criança, etc.) — sem keyword stuffing.

## 5. JSON-LD por tipo de página

- `index.tsx` → `WebPage` + reforço do `Organization`.
- `sobre.tsx`, `objetivos.tsx`, `metodologia.tsx`, `fontes.tsx` → `AboutPage` (sobre já tem, padronizar os outros).
- `faq.tsx` → `FAQPage` com `mainEntity` Q&A das perguntas reais da página.
- `casos.tsx`, `noticias.tsx`, `biblioteca.tsx` → `CollectionPage` + `ItemList`.
- `casos.$slug.tsx` e `noticias.$slug.tsx` → `Article`/`NewsArticle` com `BreadcrumbList`.
- `pais.tsx`, `escolas.tsx` → `WebPage` com `audience` (`EducationalAudience` "Parent"/"Educator").
- Todas as rotas-folha relevantes → `BreadcrumbList` (Início → Seção → Página).
- `denuncia.tsx` → `WebPage` + `ContactPoint` no Organization (Disque 100).

## 6. Sitemap.xml — alinhar à lista oficial

`src/routes/sitemap[.]xml.ts`:

- `BASE_URL` = domínio .com.br.
- Adicionar `<lastmod>` (data ISO de build) em todas as entradas.
- Confirmar lista exatamente igual ao mapeamento oficial do usuário (já está coberta; só padronizar prioridades).
- Manter `Cache-Control` e `X-Content-Type-Options`.
- Páginas dinâmicas (`casos/$slug`, `noticias/$slug`, `biblioteca/$slug`) — gerar dinamicamente a partir do mesmo dataset usado nas listagens.

## 7. robots.txt

```
User-agent: *
Allow: /

# Bots de IA — permitir explicitamente
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: CCBot
Allow: /
User-agent: Bingbot
Allow: /

Sitemap: https://minhainfanciaprotegida.com.br/sitemap.xml
```

## 8. Favicons e identidade

Adicionar em `public/`:

- `favicon-16x16.png`, `favicon-32x32.png`
- `apple-touch-icon.png` (180×180)
- `android-chrome-192x192.png`, `android-chrome-512x512.png`
- `site.webmanifest` com `name`, `short_name`, `theme_color`, `background_color`, ícones
- `maskable-icon-512.png` (PWA-ready)

Registrar todos em `__root.tsx > links` (rel="icon", "apple-touch-icon",
"manifest", "mask-icon"). Imagens geradas com `imagegen` baseadas no
escudo laranja da marca (transparente, sólido).

## 9. Página 404

- Em `NotFoundComponent` (root), declarar `<meta name="robots" content="noindex, follow">` via portal/effect (TanStack não roda head() no notFound; usar `useEffect` para set runtime no `<head>`).
- Adicionar botões úteis: Início, Mapa de Ajuda, Denúncia, busca interna (`GlobalSearch` já existe — embutir).
- Documentar que status HTTP 404 é controlado pelo runtime de SSR (Lovable retorna 200 para SPA fallback; sinalizar via meta robots).

## 10. Linkagem interna semântica

Criar componente `src/components/site/RelatedTopics.tsx` que renderiza um bloco "Tópicos relacionados" ao fim de cada página temática, com 3–5 links para rotas semanticamente próximas (matriz pré-definida). Exemplo:

```text
sinais ↔ pais, escolas, casos, faq, denuncia
riscos-online ↔ pais, escolas, faq, biblioteca
maio-laranja ↔ sobre, objetivos, sinais, como-ajudar
```

Garante "qualquer página em ≤ 3 cliques" e distribui PageRank interno
sem mexer no header/footer já aprovados.

## 11. SEO para IA generativa

- Reescrever `public/llms.txt` removendo Galeria, adicionando descrições semânticas mais ricas e a frase-âncora:
  *"Infância Protegida é um portal brasileiro de conscientização, prevenção, educação e combate ao abuso e à exploração sexual de crianças e adolescentes."*
- Adicionar `public/llms-full.txt` (versão estendida com seções, escopo, fontes oficiais, datas de revisão).
- Em cada rota temática, garantir 1º parágrafo com **definição clara da entidade** (padrão TL;DR — útil para snippets e citações por LLMs).
- FAQ com `FAQPage` schema + perguntas factuais curtas (ideais para AI Overview).

## 12. Performance / Core Web Vitals

- `__root.tsx`: trocar `<link rel="stylesheet" Google Fonts>` por estratégia "preconnect + preload" do CSS de fonte, mantendo `display=swap` (reduz FOIT/CLS).
- Adicionar `rel="preload" as="image"` na imagem hero do `index.tsx` (LCP candidate).
- Validar `loading="lazy"` em todas as `<img>` fora do above-the-fold (auditoria via `rg`).
- Adicionar `decoding="async"` e `fetchpriority` apropriado.
- GA + Clarity já são `async`; mover Clarity para `defer` carregado após `load` se ainda atrapalhar INP.

## 13. Acessibilidade (reforço)

- Auditar `alt=""` x `alt="descritivo"` em todas as imagens.
- Garantir `aria-current="page"` nos `<Link>` ativos do header (já parcial via `activeProps`).
- Reforçar landmarks: `<main id="conteudo">` já presente; conferir `<nav aria-label>`, `<footer>` e `<header>` semânticos.
- Skip link já existe.

## 14. Open Graph & Twitter — imagens por rota

Para as rotas institucionais e temáticas, garantir `og:image` específica
(já há imagens nos heros importadas). Onde não houver imagem semanticamente
adequada, herdar a imagem social existente (a hospedada em
`storage.googleapis.com` que estava no root) — mas só por rota, no leaf.

## 15. Verificação final

- Confirmar build limpo.
- Rodar `seo--list_findings` antes/depois e marcar fixed os que foram resolvidos.
- Sugerir ao usuário: revalidar sitemap no Google Search Console e Bing Webmaster, registrar `llms.txt` mentalmente para auditoria periódica.

---

## Detalhes técnicos (resumo)

**Arquivos criados**
- `src/lib/seo.ts` (helper de meta tags)
- `src/components/site/RelatedTopics.tsx` (linkagem interna)
- `public/favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`,
  `android-chrome-192x192.png`, `android-chrome-512x512.png`,
  `maskable-icon-512.png`, `site.webmanifest`
- `public/llms-full.txt`

**Arquivos editados**
- `src/routes/__root.tsx` (limpeza head + favicons + WebSite schema)
- `src/routes/sitemap[.]xml.ts` (domínio + lastmod + dinâmicos)
- `public/robots.txt` (domínio + bots IA)
- `public/llms.txt` (remover Galeria, enriquecer)
- Todas as rotas-folha citadas no item 4 (meta + JSON-LD por tipo)
- `src/routes/casos.$slug.tsx`, `noticias.$slug.tsx` (domínio canônico + Article/Breadcrumb)

**Não tocar**
- `src/routeTree.gen.ts`
- `src/integrations/supabase/*`
- `src/components/site/SiteHeader.tsx`, `SiteFooter.tsx`, `PageHero.tsx`
  (componentes visuais já aprovados — só adicionar `RelatedTopics` em
  rotas, sem mexer em header/footer)

## O que depende de fora

Algumas coisas só dão resultado com ação no painel do Google/Bing/Cloudflare
ou tempo de indexação — listadas no relatório final, não bloqueiam a entrega:

- Verificação no Google Search Console (META tag — posso automatizar via
  `google_search_console` se você autorizar a conexão).
- Verificação no Bing Webmaster Tools (cadastro manual no painel).
- Reindexação pelo Google após push do sitemap atualizado.
- Aparecer em AI Overview / Perplexity / Gemini depende de autoridade
  acumulada — preparamos o terreno técnico, mas o crawl/citação leva
  semanas.

## Relatório final

Ao concluir, entrego um resumo com:

1. Problemas encontrados (com gravidade).
2. Problemas corrigidos (com diff resumido).
3. Melhorias E-E-A-T aplicadas.
4. Melhorias para IA generativa.
5. Melhorias de performance / CWV.
6. Cobertura de schema por página.
7. Pendências dependentes de terceiros (Search Console, Bing, tempo).
8. Roadmap orgânico de 6 meses (conteúdo, autoridade, backlinks, monitoramento).
