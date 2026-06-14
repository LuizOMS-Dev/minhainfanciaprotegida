# Reformulação de Casos — Dossiê Institucional

Identidade visual unificada entre `/casos` (listagem) e `/casos/:slug` (detalhe), com a estética **Dossiê Institucional**: fundo creme claro (`#F5F1EA`), navy profundo (`#0B142D`) como tipografia e estrutura, laranja institucional (`#D9531E`) como acento de urgência, e cinza grafite (`#1F2937`) para corpo de texto. Tipografia serifada nos títulos (display), sans-serif refinada no corpo, gerando ar de relatório nacional sério.

## 1. Listagem `/casos/index`

Manter o modelo **Grid editorial + filtros**, mas reconstruído em camadas:

**a) Hero "capa de dossiê"**
- Substituir `PageHero` genérico por um hero próprio em fundo creme com faixa superior navy.
- Eyebrow: "DOSSIÊ NACIONAL · CASOS REAIS".
- H1 serifado grande ("Histórias que mudaram leis").
- Linha de metadados: total de casos publicados, faixa temporal coberta (ano mais antigo → mais recente), data da última verificação.
- Selo "Conteúdo verificado · Fontes oficiais" em destaque.

**b) Caso em destaque (featured)**
- Primeiro caso (mais recente ou marcado) renderiza em layout largo 2 colunas: imagem à esquerda, título serifado + resumo + cronologia mínima + CTA "Ler dossiê" à direita.

**c) Barra de filtros premium (sticky)**
- Filtros por categoria (chips), severidade (Alta/Média/Baixa) e ano.
- Campo de busca por título.
- Contador "X casos · filtrando por Y".
- Sticky ao rolar, com blur sutil sobre o creme.

**d) Grid editorial**
- Cards reformulados (componente novo `CaseCard` ou variante de `ArticleCard`): capa 4:3, chip de categoria + severidade, título serifado, data do acontecimento + data da publicação, fonte primária citada no rodapé do card.
- Empty state ilustrado se filtros não retornarem nada.

**e) Bloco institucional inferior**
- Faixa navy com: "Como verificamos os casos" (link para metodologia) + "Como denunciar" (link para /denuncia) + "Veja a legislação" (link para /legislacao).

## 2. Detalhe `/casos/:slug`

Reestruturado com identidade dossiê, dando destaque a **Resumo executivo / Por que importa** e **Sinais de alerta / Como agir** (escolhas do usuário).

**Nova ordem dos blocos:**

1. **`ArticleHero` (ajuste leve)** — fundo creme escuro com overlay navy, eyebrow "Dossiê · Caso real", título serifado, faixa de datas cronológicas (mantém `DatesStrip` atual).
2. **Resumo executivo (NOVO bloco `ExecutiveSummaryBlock`)** — caixa de abertura em creme com borda navy:
   - 3-5 bullets factuais ("O que aconteceu", "Quando", "Onde", "Quem está envolvido", "Status atual").
   - Lê de novo campo `executive_summary` no artigo (ver §4).
3. **Por que importa (NOVO bloco `WhyItMattersBlock`)** — caixa laranja-suave com ícone de impacto, parágrafo curto explicando relevância nacional/legislativa. Lê de campo `why_it_matters`.
4. `Timeline` (cronologia existente) — visual reforçado para combinar com o dossiê.
5. `UnderstandBlock` ("Entenda o assunto").
6. **Sinais de alerta em destaque** — `SignalsBlock` promovido visualmente: card laranja com borda forte, lista de sinais com ícones, CTA "Ver guia completo de sinais".
7. **Como agir agora (NOVO `HowToActBlock`)** — passo a passo numerado (1. Acolha · 2. Registre · 3. Denuncie · 4. Encaminhe), com botões para Disque 100, /denuncia e /mapa. Substitui visualmente o `CaseActions` atual no meio do artigo (CaseActions vira o fechamento).
8. `LessonsBlock`, `NationalContextChips`, `RecommendedReading`, `LegislationBlock`, `ReportChannels`, `RelatedMaterials`, `FaqBlock` — mantidos, com pequeno restyle para harmonizar com a paleta dossiê.
9. `CaseActions` (fechamento) + `ReferencesBlock` + `ShareButtons` + `ArticleSiblingNav` + `RelatedArticles`.

**Sidebar/coluna lateral em desktop (≥lg):**
- Coluna direita sticky com: mini-timeline navegável, "Datas-chave", "Fontes" e botão "Como denunciar".
- Em mobile vira blocos empilhados no fluxo normal.

## 3. Componentes e arquivos

**Novos:**
- `src/components/site/CaseCard.tsx` — card editorial do dossiê.
- `src/components/site/CasosHero.tsx` — hero da listagem.
- `src/components/site/CasosFilters.tsx` — barra sticky de filtros.
- `src/components/site/ExecutiveSummaryBlock.tsx`
- `src/components/site/WhyItMattersBlock.tsx`
- `src/components/site/HowToActBlock.tsx`
- `src/components/site/CaseSidebar.tsx` — coluna lateral sticky.

**Editados:**
- `src/routes/casos.index.tsx` — nova composição (hero + featured + filtros + grid + faixa institucional).
- `src/routes/casos.$slug.tsx` — layout em 2 colunas (lg+), nova ordem de blocos.
- `src/components/site/ArticleHero.tsx` — variante visual "dossiê" para casos (fundo creme + faixa navy) preservando comportamento atual para notícias.
- `src/components/site/ArticleBlocks.tsx` — pequenos restyles de `SignalsBlock`, `UnderstandBlock` para alinhar à paleta.
- `src/styles.css` — tokens novos: `--dossier-cream: #F5F1EA`, `--dossier-ink: #1F2937`, e classe utilitária para a borda dupla de dossiê.

## 4. Dados / Schema

Para preencher Resumo executivo, Por que importa e Como agir, adicionar 3 colunas opcionais em `articles`:
- `executive_summary jsonb` — array de strings (bullets).
- `why_it_matters text` — parágrafo curto.
- `how_to_act jsonb` — array de `{ step, title, description }` (opcional; se nulo, renderiza versão padrão do bloco).

Migration adiciona colunas + ajusta `getPublishedArticle` para retorná-las. Casos sem esses campos continuam renderizando com fallback (bloco oculto ou conteúdo padrão), nenhum dado existente é alterado.

## 5. Acessibilidade e performance

- Manter `prefers-reduced-motion` em qualquer animação nova.
- Sticky filters e sidebar só em ≥lg.
- `aria-label` em todas as novas regiões.
- Images com `loading="lazy"` exceto hero/featured.
- Manter SSR/loader pattern existente; nenhum `useEffect+fetch`.

## 6. Fora de escopo

- Sem alterações em /noticias (escopo é apenas Casos).
- Sem nova animação 3D ou libs adicionais — só Tailwind + tokens + classes já disponíveis.
- Sem reescrita de `Timeline.tsx`, apenas restyle leve se necessário.
