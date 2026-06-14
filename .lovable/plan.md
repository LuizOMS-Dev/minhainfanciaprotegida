# Fase 1 — Campos editoriais, compartilhamento global, sitemap dinâmico e testes

Entrega focada nas fundações. Fases 2 (páginas temáticas + /atualizacoes) e 3 (auditoria de datas + consistência visual + testes pós-deploy) ficam para próximos planos, mas as Fases 1 já reaproveitam o design system existente — `PageHero`, `ArticleCard`, `SectionHeader`, `ArticleBlocks`, tokens `--orange`/`--navy-deep`/`--red-inst`. Nada de novo padrão visual.

## 1. Migration: 6 novos campos em `articles`

Tudo opcional. Sem novos GRANTs (a tabela já tem). Tipos gerados automaticamente após approval.

- `action_steps text[]` — passos práticos ("Acione o Conselho Tutelar", "Disque 100"...).
- `warning_indicators text[]` — sinais de alerta ("isolamento social", "presentes excessivos"...).
- `severity_level text CHECK IN ('baixo','medio','alto','gravissimo')` — selo visual.
- `impact_summary text` — parágrafo sobre impacto nacional.
- `source_confidence text CHECK IN ('alta','media','baixa')` — selo de confiabilidade.
- `ai_summary text` — 50–150 palavras, invisível na UI, injetado em JSON-LD/llms.txt.

`last_verified_at` já existe — apenas passa a ser exibido (“Verificado em”).

## 2. Server / camada de dados

- `src/lib/admin.functions.ts` — `AdminArticle` + `upsertSchema` ganham os 6 campos. Limites Zod: `action_steps` ≤ 20 strings × 200 chars; `warning_indicators` ≤ 20 × 120; `severity_level`/`source_confidence` enums; `impact_summary` ≤ 4000; `ai_summary` ≤ 1500.
- `src/lib/content.functions.ts` — `PublicArticleDetail` expõe os novos campos para Notícias e Casos.
- Sem mudança de RLS.

## 3. Editor admin (já em abas)

`src/routes/_authenticated/admin/article.$id.tsx`:

- Nova aba **“Ação & Alerta”** (entre Editorial e Timeline): `action_steps` (lista editável), `warning_indicators` (chips livres), `severity_level` (select), `source_confidence` (select), `impact_summary` (textarea), `ai_summary` (textarea com contador 50–150 palavras + hint “invisível ao leitor; usado por buscadores e IA”).
- Reaproveita `Field`, `inputCls`, `MultiSelect`, mesmos botões e bordas atuais.

## 4. Hubs editoriais — Notícias e Casos

`src/components/site/ArticleBlocks.tsx`:

- `SeverityBadge`, `ConfidenceBadge` — pílulas usando tokens `--orange`/`--red-inst`/`--navy-deep`, mesmo formato dos badges existentes.
- `ActionStepsBlock` — lista numerada com ícone (Phone, Shield, MessageCircle...), card no padrão atual.
- `WarningIndicatorsBlock` — grid de chips em card destacado.
- `ImpactBlock` — bloco de citação institucional reaproveitando `bg-card border-border`.
- `VerificationLine` — linha de metadados “Publicado em DD/MM/AAAA · Verificado em DD/MM/AAAA”.

Ordem nas páginas (sem reordenar o que já está):

```
Header → cover → matéria
→ ActionStepsBlock (se houver)
→ WarningIndicatorsBlock (se houver)
→ Understand / Lessons
→ ImpactBlock (se houver)
→ Timeline → Legislation → Signals → ReportChannels
→ RelatedMaterials → FAQ → RecommendedReading
→ RelatedArticles → References → ShareButtons
```

JSON-LD enriquecido:
- `NewsArticle`/`Article` ganha `dateModified` (= `last_verified_at`), `abstract` (= `ai_summary` quando preenchido) e `keywords` (`warning_indicators` + categoria).
- Selo `severity_level` aparece junto ao header com `aria-label`.

## 5. Compartilhamento social global

`src/components/site/ShareButtons.tsx` — extensão (mantém visual atual):

- Adicionar LinkedIn, Telegram.
- Prop opcional `description`.
- Botão “Compartilhar” usando `navigator.share()` quando disponível (mobile-first); fallback = ícones individuais já existentes + Copiar Link.
- Toast (já existe `sonner` no projeto) ao copiar.

Aplicar em: `noticias.$slug`, `casos.$slug`, `biblioteca.$slug` (já tem), `legislacao`, `maio-laranja`, `sinais`, `riscos-online`, `pais`, `escolas`, `faq`, `como-ajudar`. URL e título derivados da rota; descrição = `subtitle`/meta description.

## 6. Sitemap dinâmico

`src/routes/sitemap[.]xml.ts`:

- Server route já é dinâmico — adicionar fetch via `supabaseAdmin` (carregado com `await import` dentro do handler) das `articles` com `status='published' AND (publish_at IS NULL OR publish_at <= now())`.
- Cada artigo emite `/{noticias|casos|riscos|biblioteca}/{slug}` com `lastmod = updated_at`.
- `Cache-Control: public, max-age=300, s-maxage=600` para refletir publicações novas em até ~10 min.
- Não introduz cron — o GET roda fresh a cada hit.

## 7. Metadados, canonical e OG por artigo

Já existem `head()` por slug. Garantias auditadas:

- `canonical` apenas no leaf (regra TanStack já respeitada).
- `og:image` = `cover_url` quando presente; sem default no `__root.tsx`.
- `og:url` absoluto baseado em `https://minhainfanciaprotegida.com.br`.
- `meta description` = `subtitle || ai_summary || primeiros 160 chars do body texto-puro`.
- `article:modified_time` e `article:published_time` adicionados.

## 8. Remoção residual de “Mineblox”

`rg -ni mineblox` hoje retorna vazio no código, mas a fase audita o banco também:

- Server-side query (executada manualmente via `supabase--read_query` durante a implementação) lista `articles` cujo `title|slug|body|subtitle` contenha “mineblox” → relatório ao usuário, exclusão só após confirmação.
- Sem mudança de schema para isso.

## 9. Testes

**Unitários (Vitest)** em `src/lib/__tests__/`:

- `admin-upsert-schema.test.ts` — para cada novo campo: aceita valor válido, rejeita acima do limite, aceita `null/undefined`, rejeita enum inválido em `severity_level`/`source_confidence`.
- `sitemap.test.ts` — função pura que monta `<urlset>` a partir de um array de artigos fake; verifica escaping, ordem, `lastmod`.
- `share-url.test.ts` — helper que constrói URLs WhatsApp/X/Facebook/LinkedIn/Telegram a partir de `{title, url, description}`.

Refatoração mínima: extrair as funções puras (`buildSitemapXml`, `buildShareLinks`) para arquivos testáveis sem rodar o server.

`package.json` ganha script `"test": "vitest run"`. CI não é alterado.

**Pós-deploy (manual via tool)** — checklist que rodo após o build:

1. `invoke-server-function GET /sitemap.xml` → confere que retorna 200, XML válido, contém ao menos uma URL de `/noticias/*` real.
2. `invoke-server-function POST` em `upsertAdminArticle` com payload contendo os 6 novos campos → confirma persistência (`getAdminArticle` em seguida retorna o mesmo objeto).
3. `fetch_website` em `/noticias/<slug>` → confere presença de `<meta property="og:image">`, JSON-LD com `dateModified` e `abstract`.
4. `server-function-logs` filtrado por “admin.upsertArticle” → confirma ausência de erros.

Resultados anexados ao final da implementação.

## 10. Não está nesta fase (Fase 2/3)

- `/tema/$slug` (híbrido) e `/atualizacoes` — Fase 2.
- Auditoria global de datas + revisão visual página a página + `llms.txt`/`llms-full.txt` automáticos — Fase 3.
- Geração de `og:image` por IA — só sob pedido.

## Ordem de execução

1. Migration → aguardar approval → tipos regenerados.
2. `admin.functions.ts` + editor (aba “Ação & Alerta”).
3. `content.functions.ts` + componentes em `ArticleBlocks.tsx`.
4. Páginas `noticias.$slug` e `casos.$slug` integram os novos blocos.
5. `ShareButtons` estendido + aplicado nas páginas listadas.
6. `sitemap[.]xml.ts` carrega artigos publicados.
7. Vitest configurado, testes escritos, `bunx vitest run` verde.
8. Checklist pós-build via `invoke-server-function` e `server-function-logs` → relatório final.
