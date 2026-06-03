# Evolução do Portal — preservando 100% da identidade visual

> Garantia: zero alteração de paleta, tipografia, layout, animações ou estrutura visual. Apenas novas páginas (no mesmo padrão de cards/hero já aprovado), novos conteúdos e infra de backend.

---

## FASE 1 — Auditoria e validação de conteúdo (PRIORIDADE MÁXIMA)

Antes de criar qualquer novo recurso, revisar e corrigir todo o conteúdo atual contra fontes oficiais:

- **Caso Felca** — confirmar data do vídeo (06/08/2025), número de visualizações, e a tramitação real do PL 2.628/2022 → Lei nº 15.211/2025 (sanção em 17/09/2025). Fonte: Agência Câmara, Agência Senado, Planalto.
- **Caso Mineblox / Vitória** — revisar a redação para evitar afirmações jurídicas indevidas; tratar como "caso relatado" com fonte SaferNet/G1; remover detalhes não confirmados.
- **ECA Digital (Lei 15.211/2025)** — descrever apenas o que está no texto sancionado; remover interpretações.
- **Estatísticas Disque 100, SaferNet, UNICEF** — reconferir números do Balanço 2024 (MDHC) e Indicadores SaferNet; atualizar onde houver dado mais recente.
- **Leis citadas** (8.069/90, 9.970/2000, 13.431/2017, 14.344/2022, 15.211/2025, CP 217-A/218/218-B/218-C, Lei Carolina Dieckmann) — conferir números, anos e ementas.
- **Telefones** — Disque 100, 181, 190, SaferNet (helpline@safernet.org.br).
- **Links externos** — testar todos; substituir os quebrados.

Adicionar em cada artigo/estatística:
- Fonte oficial com link.
- **Data da última verificação** (campo `lastVerified`).
- **Responsável pela revisão** (campo `reviewedBy`).

Criar componente `<ReferencesBlock>` padronizado ao final de cada artigo: Fonte principal · Fontes complementares · Links oficiais · Última revisão · Revisor.

---

## FASE 2 — Backend (Lovable Cloud)

Ativar Lovable Cloud. Tabelas:

- `profiles` (id, display_name, role) + enum `app_role` (`admin`, `editor`, `revisor`) na tabela separada `user_roles` com função `has_role()` (security definer).
- `articles` — id, type (`news`|`case`|`risk`|`guide`), title, subtitle, slug, category, body (markdown), cover_url, author_id, reviewer_id, status (`draft`|`review`|`scheduled`|`published`|`archived`), publish_at, last_verified_at, created_at, updated_at.
- `article_sources` — article_id, label, url, is_primary.
- `library_items` — title, description, category, file_url, source_org, year, tags[].
- `help_locations` — name, type (`conselho_tutelar`|`delegacia`|`creas`|`cras`|`mp`), state, city, address, phone, hours, official_url, lat, lng.

RLS:
- Leitura pública apenas para `status='published'`.
- Escrita/edição apenas para `admin` e `editor` via `has_role()`.
- Storage bucket público `media` para uploads de imagem/PDF.

---

## FASE 3 — Painel administrativo `/admin`

Rotas sob `_authenticated/admin/`:
- Dashboard (contadores + últimos itens).
- CRUD de notícias, casos, riscos, guias (mesmo schema `articles`, filtrado por `type`).
- Editor com: título, subtítulo, categoria, data, fonte principal, fontes complementares (repetível), link oficial, status, autor/editor, upload de capa, agendamento (`publish_at`), markdown.
- Biblioteca: CRUD `library_items` + upload de PDF.
- Mapa: CRUD `help_locations` + import CSV.
- Lista de usuários e papéis.

Login: email/senha + Google (via broker Lovable). Página `/auth`.

---

## FASE 4 — Busca e filtros

Página `/buscar` com busca full-text (Postgres `tsvector`) sobre `articles` + `library_items`. Filtros: tema, categoria, faixa etária, tipo, ano, fonte, status. Componente `<SearchBar>` reaproveitado no header.

---

## FASE 5 — Mapa de ajuda funcional

Página `/mapa` evoluída:
- Busca por cidade/UF consulta `help_locations`.
- Cards: nome, endereço, telefone, horário, link oficial, botão "Abrir no Google Maps" (`https://www.google.com/maps/dir/?api=1&destination=...`).
- Seed inicial com Conselhos Tutelares das capitais + Disque 100 + delegacias DECCA/DEAM principais (dados públicos).
- Fallback: se cidade não tiver registro, exibir Disque 100 + orientação para Conselho Tutelar local.

---

## FASE 6 — Novas seções de conteúdo

- `/pais` — Guia para Pais e Responsáveis: controle parental, tempo de tela, configurações de Roblox/Discord/TikTok/Instagram/WhatsApp/jogos online, sinais de alerta, como conversar.
- `/escolas` — Guia para Escolas e Educadores: identificação de sinais, protocolo de suspeita, escuta protegida (Lei 13.431/2017), encaminhamento, comunicação com responsáveis.
- `/biblioteca` — Biblioteca digital com filtros, download e visualização. Curadoria inicial: UNICEF, SaferNet, MDHC, Childhood Brasil, MPF, CONANDA.

---

## FASE 7 — SEO avançado

- JSON-LD por rota: `Organization` (root), `NewsArticle` (notícias), `Article` (casos/guias), `FAQPage` (`/faq`), `BreadcrumbList`.
- OpenGraph + Twitter Cards dinâmicos por rota (`head()` por leaf route).
- Sitemap.xml dinâmico (já existe) — incluir artigos publicados.
- Robots.txt revisado.
- URLs amigáveis via `slug`.

---

## FASE 8 — Analytics

- Google Analytics 4 (gtag) — script no `__root.tsx` com ID configurável via secret.
- Microsoft Clarity — script opcional.
- Google Search Console — meta-tag de verificação.
- Dashboard admin: contadores de visualizações (tabela `page_views` simples + incremento server-fn).

---

## FASE 9 — Acessibilidade e Performance

- Navegação por teclado, foco visível, ARIA, alt em todas as imagens, contraste AA.
- Lazy loading, `fetchpriority="high"` no hero, `loading="lazy"` no resto.
- Compressão de imagens geradas (já jpg).
- Cache headers em assets estáticos.

---

## Perguntas antes de começar

Como o escopo é muito grande, preciso confirmar prioridade e algumas decisões para entregar com qualidade. Vou perguntar a seguir.
