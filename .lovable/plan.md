## Objetivo

Concluir os 14 itens pendentes do portal **e popular o banco com notícias e casos REAIS verificados**, garantindo páginas internas ricas, bem organizadas e indexáveis. Zero alteração visual.

---

## Bloco A — Conteúdo real (notícias + casos)

Vou inserir no banco (tabela `articles`) **conteúdo real e verificável** sobre proteção da infância no Brasil, com fonte oficial em cada item.

**Notícias reais (mín. 8):**
- Lei 14.811/2024 — Bullying e cyberbullying como crime (Planalto)
- Lei 13.431/2017 — Escuta especializada e depoimento especial
- Disque 100 — balanço anual mais recente (MDH/Ouvidoria)
- Operação Caçador (PF) — combate à exploração sexual infantil online
- SaferNet Brasil — relatório anual de denúncias
- CPI das Bets / impacto em adolescentes (Senado/Câmara)
- Maio Laranja — campanha nacional 18/05
- ECA — atualizações recentes (Lei 8.069/90 + emendas)

**Casos reais (mín. 6) tratados com **respeito, sem sensacionalismo**, sempre apontando o aprendizado/lei resultante:**
- Caso Araceli (origem do 18 de maio)
- Caso Bernardo Boldrini
- Caso Henry Borel → Lei Henry Borel (14.344/2022)
- Caso Isabella Nardoni → mudanças no ECA
- Caso Ana Hickmann (alienação digital) — referência educativa
- Caso Realengo (impacto escolar e prevenção)

Cada artigo terá: `title`, `subtitle`, `slug`, `category`, `body` (HTML rico com h2/h3, listas, citações, "O que a lei diz", "Como agir", "Onde denunciar"), `cover_url` (Unsplash/Wikimedia com atribuição), `primary_source_label`, `primary_source_url`, `status='published'`, `publish_at`, `last_verified_at`.

Inserção via `supabase--insert` (não migração), mantendo os existentes.

---

## Bloco B — Páginas ricas de notícia/caso (refino do que já existe)

As rotas `/noticias/$slug` e `/casos/$slug` já têm reading time, share, relacionados e siblings. Vou adicionar:

- **Sumário automático (TOC)** gerado dos `<h2>` do corpo
- **Bloco "Fontes e referências"** estruturado (lista `article_sources`)
- **Bloco "O que fazer agora"** com 3 CTAs fixos (Denunciar, Sinais de alerta, Biblioteca)
- **Breadcrumbs** semânticos + JSON-LD `BreadcrumbList`
- **Última verificação editorial** visível ("Verificado em DD/MM/AAAA")
- **Cover responsivo** com `loading="eager"` + `fetchpriority="high"` apenas na primeira dobra

---

## Bloco C — Mapa real (item 3) + CSV (item 4)

- `bun add leaflet react-leaflet leaflet.markercluster @types/leaflet`
- Novo `MapaInterativo.tsx` (CSR-only via dynamic import) com:
  - Tiles OpenStreetMap (sem chave)
  - MarkerCluster por estado
  - Popup com nome, endereço, telefone, horário, link oficial, botão "Como chegar" (Google Maps directions)
  - Filtros laterais por tipo (CT, DPCA, CREAS, Vara da Infância, Disque 100) e por estado
- Rota `/mapa` passa a usar o componente real; mantém fallback de lista.
- Admin `/admin/mapa` já tem import CSV — vou ampliar com **template baixável**, **preview da primeira linha** e **relatório de linhas com erro**.

---

## Bloco D — Busca global (item 8)

- Server fn `searchAll({ q })` que consulta em paralelo `articles`, `library_items`, `help_locations` com `ilike` em colunas-chave (status=published nas articles).
- `SiteHeader`: ícone de busca abre `<Dialog>` (cmdk) com input, resultados agrupados por tipo, navegação por teclado.
- Atalho `Ctrl/Cmd + K`.

---

## Bloco E — Telemetria leve (item 9)

- Nova tabela `event_log (id, kind, target_id, target_type, path, created_at, ua)` com RLS: INSERT anon permitido; SELECT só admin/editor.
- Server fn `logEvent({kind, ...})` chamada nos handlers de: clique em "Denunciar", download da biblioteca, abertura de caso/notícia, clique no mapa.
- Painel `/admin/metricas`: contagem por tipo (últimos 7/30 dias), top 10 conteúdos, top 10 locais.

---

## Bloco F — UX/Nav (item 5 restante)

- `Breadcrumbs.tsx` em todas as páginas internas
- Botão "Voltar ao topo" global (após 600px de scroll)
- Skeletons unificados em listas (notícias, casos, biblioteca, mapa)
- Estados vazios padronizados (`EmptyState.tsx`)

---

## Bloco G — SEO final (item 12)

- Auditar `head()` de **todas** as rotas: title único, description, og:* completos, canonical em folha.
- JSON-LD: `Article`/`NewsArticle` nas leituras (já feito), `BreadcrumbList` em todas as profundas, `FAQPage` em `/faq`, `Organization` no root.
- Rodar `seo_chat--trigger_scan` no final e marcar fixes.

---

## Bloco H — Segurança final (item 13)

- **Headers** no `src/server.ts`: `Content-Security-Policy` (estrito, allow Supabase + OSM tiles + unsplash), `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`.
- **Rate limit** simples em server fns públicas (denúncia, busca, logEvent) usando tabela `rate_limit` com janela deslizante por IP-hash.
- Rodar `security--run_security_scan`, corrigir e marcar findings.

---

## Bloco I — Relatório final (item 14)

Checklist Markdown na resposta final agrupado por:
✅ Implementado · ✅ Corrigido · ✅ Testado · ✅ Validado · ⚠️ Ação manual (ex.: confirmar Google OAuth, revisar conteúdo dos artigos, configurar custom domain se desejar).

---

## Detalhes técnicos importantes

- **Identidade visual intocada**: nenhuma mudança em `styles.css`, fontes, cores, espaçamentos.
- **Inserts vs migrations**: tabelas novas (`event_log`, `rate_limit`) via migration com GRANTs; conteúdo via insert tool.
- **Leaflet em Worker SSR**: import dinâmico só no cliente (`useEffect`) para evitar `window is not defined`.
- **CSP**: precisa liberar `tile.openstreetmap.org`, `*.supabase.co`, `images.unsplash.com`, `upload.wikimedia.org`.
- **Conteúdo dos casos**: tom respeitoso, foco em prevenção e legislação, evita detalhes mórbidos, sempre com fonte oficial (Planalto, MDH, SaferNet, Agência Câmara/Senado).

---

## Ordem de execução

1. Migrations (event_log, rate_limit) + GRANTs
2. Inserts de notícias e casos reais (com fontes)
3. Refino páginas de leitura (TOC, breadcrumbs, fontes)
4. Mapa Leaflet + import CSV refinado
5. Busca global (cmdk + atalho)
6. Telemetria + painel /admin/metricas
7. UX (breadcrumbs, voltar ao topo, skeletons)
8. SEO sweep + headers de segurança + rate limit
9. Scans (SEO + segurança) e correções
10. Relatório final

Posso começar pelo Bloco A (conteúdo real) já na primeira leva?