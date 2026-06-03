# Plano de evolução — Administração, automação e CRUD

Identidade visual atual 100% preservada. Todo o trabalho é em backend, painel `/admin`, server functions e novas rotas de leitura/detalhe.

## Fase 1 — Fundação de administração (entrega imediata)

1. **Usuário administrador principal**
   - Criar conta `luizotaviomscv@gmail.com` via Supabase Auth (sem expor senha — convite por e-mail com link de definição de senha).
   - Inserir papel `admin` em `user_roles`.
   - Login: e-mail/senha + Google (via broker Lovable, já configurado).

2. **Conectar `/noticias` ao banco**
   - Server fn pública (`supabaseAdmin` em handler) listando `articles` onde `type='news'` e `status='published'` e `publish_at <= now()`.
   - Cards exibem fonte, data, revisão e autor (join leve em `profiles`).
   - Página individual `/noticias/$slug` com corpo, `article_sources`, JSON-LD Article.

3. **Conectar `/casos` ao banco**
   - Mesma estrutura, `type='case'`, página `/casos/$slug`, bloco de referências oficiais.

4. **Home dinâmica**
   - Bloco "Últimas atualizações" na `/` consumindo as 3 notícias e 2 casos publicados mais recentes.

5. **Agendamento automático**
   - RLS já filtra `publish_at <= now()`; itens com data futura ficam invisíveis ao público até a hora marcada.

## Fase 2 — CRUD do painel `/admin`

6. **Layout `/admin` (rota `_authenticated/admin`)** com navegação lateral: Notícias, Casos, Riscos, Biblioteca, Mapa, Usuários, Métricas, SEO.

7. **CRUD Notícias / Casos / Riscos / Guias** — formulário único (mesma tabela `articles`, campo `type`): título, slug, subtítulo, capa, corpo (markdown), categoria, status (rascunho/revisão/agendado/publicado), `publish_at`, `last_verified_at`, fonte primária, fontes adicionais (`article_sources`).

8. **CRUD Biblioteca** — upload PDF para bucket `media` (signed upload), campos: título, descrição, categoria, tags, público-alvo, fonte oficial, ano, URL.

9. **CRUD Mapa de Ajuda** — adicionar/editar/excluir Conselho Tutelar, CREAS, CRAS, Delegacia + **importação CSV** (parse client-side, insert em lote via server fn admin).

10. **Gerenciamento de usuários** — listar perfis, atribuir papéis (`admin`, `editor`, `revisor`).

## Fase 3 — Busca, métricas e telemetria

11. **Busca global `/buscar`** — Postgres `tsvector` sobre `articles` + `library_items`; filtros tema, categoria, faixa etária, ano, tipo.

12. **Eventos de telemetria** — tabela `analytics_events` (page_view, search, outbound_click com tipo: `disque100|conselho|whatsapp|external|library_download`). Listener leve no frontend dispara via server fn pública com rate-limit por IP.

13. **Painel de métricas `/admin/metricas`** — agregados: notícias/casos mais acessados, materiais mais baixados, buscas, cliques Disque 100/Conselho/WhatsApp/externos, páginas mais visitadas, tempo médio (derivado dos page_views já vindos do GA4 — exibir top-list local + link para GA4).

## Fase 4 — Páginas institucionais

14. **`/sobre`** — objetivo, missão, critérios de revisão, política de fontes, aviso de iniciativa educativa independente.

15. **`/transparencia`** — metodologia, fontes, últimas atualizações (consulta `articles.last_verified_at` ordenado desc), critérios de verificação.

## Detalhes técnicos

**Banco** (migrations novas, sem quebrar schema atual):
- Trigger `set_updated_at` em `articles` e `library_items`.
- Coluna `tags text[]`, `audience text`, `age_range text` em `library_items` (já existe `audience`; adicionar `tags`).
- Tabela `analytics_events(id, type, path, label, meta jsonb, ip_hash, created_at)` — insert público com rate-limit, leitura só admin.
- Índice `tsvector` em `articles(title, subtitle, body)` e `library_items(title, description)`.
- Storage bucket `media` já existe (privado) — adicionar políticas: leitura pública dos paths em `library/*`, escrita só por `admin|editor`.

**Server functions** (em `src/lib/*.functions.ts`, `supabaseAdmin` apenas dentro de `.handler()`):
- `listPublishedArticles({ type, limit, offset })`
- `getArticleBySlug({ type, slug })`
- `searchContent({ q, filters })`
- `trackEvent({ type, path, label, meta })`
- `adminUpsertArticle`, `adminDeleteArticle`, `adminUpsertLibrary`, `adminUpsertHelpLocation`, `adminImportHelpLocationsCsv`, `adminAssignRole`, `adminMetricsSummary` — todas com `requireSupabaseAuth` + checagem `has_role`.

**Frontend**:
- Painel usa `@/components/ui/*` existentes (shadcn) — identidade preservada.
- Rotas públicas novas: `/noticias/$slug`, `/casos/$slug`, `/buscar`, `/sobre`, `/transparencia`.
- Rotas protegidas: `/_authenticated/admin/*` (gate da integração).

**Sitemap**: incluir slugs publicados (server route já existente passa a buscar do banco).

## Ordem de execução

Vou começar pela **Fase 1** assim que aprovar — entrega o admin logado e o conteúdo dinâmico funcionando. Fase 2 entra na rodada seguinte para evitar uma única migration gigante.

## Confirmação

- Posso enviar o **convite por e-mail** para `luizotaviomscv@gmail.com` (definir senha pelo link)? Se preferir senha provisória, me diga.
- Confirma seguir nesta ordem (Fase 1 agora; Fases 2–4 nas próximas rodadas)?
