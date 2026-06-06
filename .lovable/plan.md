## Objetivo

Transformar `/noticias/$slug` e `/casos/$slug` em hubs editoriais profundos, mantendo identidade visual, menus e layout global. Editorial híbrido: editor digita conteúdo curado; servidor calcula relacionamentos automáticos.

## 1. Banco de dados (uma migration)

Novas colunas em `public.articles` (todas opcionais — nada quebra para artigos existentes):

```
reading_minutes      int                  -- opcional; fallback calculado do body
understand           text                 -- "Entenda o assunto" (HTML curto)
lessons              text                 -- "O que aprendemos" (apenas casos)
timeline             jsonb                -- [{date, title, text}]
faq                  jsonb                -- [{q, a}]
related_laws         text[]               -- slugs: "eca-art-227", "lei-13431", "cp-art-217a"...
related_signal_tags  text[]               -- tags em /sinais
national_context     text[]               -- ["maio-laranja","eca","seguranca-digital"...]
```

Sem CHECK em jsonb (regra de migrations). Sem novos GRANTs (tabela já liberada). Tipos do Supabase regenerados após aprovação.

## 2. Server functions (`src/lib/content.functions.ts`)

- `getPublishedArticle` passa a devolver os novos campos no `PublicArticleDetail`.
- Nova `getArticleRelations({ id, type, category, related_laws, related_signal_tags })` retorna em uma chamada:
  - `library`: até 4 itens de `library_items` cuja `category`/`audience` casa com `category` do artigo
  - `signals`: itens estáticos de `src/content/signals.ts` filtrados por `related_signal_tags`
  - `laws`: itens estáticos de `src/content/laws.ts` (ECA, CP, Lei 13.431, Marco Civil) por slug
  - `forParents`, `forSchools`, `forRisks`: 1–2 cards por seção, casados por `category`
  - `relatedNews`, `relatedCases`: 3 itens cruzados (notícia → casos do mesmo tema e vice-versa)
- Tudo via `supabaseAdmin` em paralelo (`Promise.all`); retorno é DTO plano.

## 3. Conteúdo estático curado

```
src/content/laws.ts      -- { slug, label, summary, url } para ECA art. 5/17/18/227, CP 217-A/218-B, Lei 13.431, Marco Civil
src/content/signals.ts   -- já existe; expor helper getByTags(tags)
src/content/nationalContext.ts -- chaves: maio-laranja, eca, direitos-crianca, educacao-preventiva, seguranca-digital → { label, blurb, href }
```

## 4. Novos componentes (`src/components/site/`)

Reusam tokens existentes (navy/orange, font-display, rounded-3xl).

- `ArticleMeta` — cabeçalho com categoria, data, autor, revisor, tempo de leitura
- `UnderstandBlock` — card laranja com "O que aconteceu / Por que importa / Impacto em crianças"
- `LessonsBlock` — variante para casos
- `NationalContextChips` — chips horizontais clicáveis
- `Timeline` — já existe, evoluir para aceitar `title` + ícone marco
- `LegislationBlock` — cards das leis (label, resumo, link oficial)
- `SignalsBlock` — grid resumo com link para `/sinais#tag`
- `ReportChannels` — Disque 100, Conselho Tutelar, Delegacia, MP, Mapa de Ajuda (botões grandes)
- `RelatedMaterials` — cards da biblioteca
- `FaqBlock` — accordion acessível (`<details>`), id por pergunta
- `RecommendedReading` — 3–4 cards "Para Pais / Para Escolas / Riscos / Biblioteca"
- `CaseTimeline` — wrapper do Timeline com etapas fixas (ocorrência → atual)
- Reaproveita: `ShareButtons`, `RelatedArticles`, `ReferencesBlock`, `JsonLd`, `SafeHtml`

## 5. Páginas reformuladas

**`/noticias/$slug`** ordem: Header premium → Imagem → Matéria (`SafeHtml`) → UnderstandBlock → NationalContextChips → Timeline (se houver) → LegislationBlock → SignalsBlock → ReportChannels → RelatedMaterials → FaqBlock → RecommendedReading → RelatedArticles → ReferencesBlock → ShareButtons.

**`/casos/$slug`** ordem: Header (anonimizado) → Resumo → CaseTimeline → LessonsBlock → SignalsBlock → RecommendedReading (Para Pais/Escolas/Riscos) → LegislationBlock → ReportChannels → RelatedArticles (casos) → RelatedNews → RelatedMaterials → FaqBlock → ReferencesBlock.

Blocos só renderizam quando há dado. Layout colapsa elegantemente em artigos antigos.

## 6. SEO e IA generativa

Cada página emite (via `head().scripts`):

- `NewsArticle` (notícias) ou `Article` (casos), já existente — agora com `articleSection`, `keywords`, `inLanguage: pt-BR`
- `BreadcrumbList` — Home → Notícias|Casos → Título
- `FAQPage` — quando `faq.length > 0`
- `SpeakableSpecification` apontando para `h1` + `.understand`
- `ItemList` agregando matérias relacionadas
- meta `description` derivada do `subtitle` ou primeiros 155 chars de `understand`
- `og:image` apenas no leaf, do `cover_url`
- Trecho semântico no `__root.tsx` JSON-LD `Organization.description` reforçando o posicionamento ("portal brasileiro especializado em prevenção…") — só se ainda não estiver lá

## 7. Casos reais — política de anonimização

- Helper `assertAnonymized(text)` no editor avisa se detectar nomes de menores ou padrões CPF/RG (regex client-side, não bloqueia)
- Componente `AnonymizedNotice` no topo dos casos: "Identidades de vítimas preservadas. Dados conforme registros públicos."
- Documentação no painel `/admin/article/$id` aba Conteúdo com checklist editorial

## 8. Editor (`/admin/article/$id`) — abas

Substitui scroll único por abas (tablist acessível, sem rota nova):

1. **Conteúdo** — title, subtitle, slug, category, cover, body (RichText)
2. **Mídia & SEO** — cover_url, primary source, last_verified, reading_minutes (opcional)
3. **Entenda / Aprendemos** — `understand` (RichText curto), `lessons` (só casos)
4. **Linha do tempo** — repeater {date, title, text}
5. **FAQ** — repeater {q, a}
6. **Relacionamentos** — multi-select de `related_laws` (catálogo de `laws.ts`), `related_signal_tags`, `national_context`
7. **Publicação** — status, publish_at, reviewer, fontes adicionais

`upsertAdminArticle` aceita os novos campos (validação Zod expandida). Persistência atômica.

## 9. Acessibilidade & performance

- FAQ usa `<details>`/`<summary>` nativos (sem JS)
- Timeline com `aria-label` "Linha do tempo do caso"
- Imagens lazy + `aspect-ratio` para evitar CLS
- Todos os blocos novos são server-rendered (sem hydration extra)
- `staleTime` 5 min nas queries de relations

## 10. Riscos & não-objetivos

- **Não** altera homepage, header, footer, menus, cores, tipografia
- **Não** mexe em segurança/MFA/CSP/auditoria
- **Não** introduz IA generativa nesta entrega (decisão do usuário: editorial híbrido)
- Artigos antigos continuam exibindo apenas o que têm; nenhum bloco placeholder

## 11. Detalhes técnicos

- Stack: TanStack Start, server fns em `*.functions.ts`, leitura via `useSuspenseQuery` no loader já existente
- Migration única adicionando colunas + comentários SQL
- Regen `src/integrations/supabase/types.ts` automática após migration aprovada
- Sitemap já cobre `/noticias/$slug` e `/casos/$slug`; nada a mudar
- Sem dependências novas

## 12. Entregáveis do relatório final

Vou reportar: campos criados, server fns novas, componentes novos, blocos por página, schemas JSON-LD emitidos, mudanças no editor, política de anonimização, impacto esperado (SEO semântico + AI Overview + tempo de permanência), e recomendações futuras (IA generativa opcional, página "Tema" agregando notícias+casos+leis por tag, newsletter).

## Ordem de execução

1. Migration (aprovação do usuário) → tipos regenerados
2. `content/laws.ts`, `content/nationalContext.ts`, helpers de signals
3. `content.functions.ts`: estender DTO + `getArticleRelations`
4. Componentes novos em `src/components/site/`
5. Reformular `noticias.$slug.tsx` e `casos.$slug.tsx`
6. Estender `admin/article.$id.tsx` com tabs e `admin.functions.ts` upsert
7. Verificar build, rodar SEO scan e reportar
