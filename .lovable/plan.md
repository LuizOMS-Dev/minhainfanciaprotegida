## Plano: Knowledge Graph + Schemas Semânticos + Manifest

Objetivo: fortalecer a marca "Infância Protegida" como entidade reconhecível por Google Knowledge Graph, AI Overviews e LLMs (ChatGPT, Gemini, Claude, Copilot, Perplexity), além de validar o Web App Manifest e adicionar schemas de busca e navegação.

### 1. Knowledge Graph — Entidade "Infância Protegida"

Criar `src/lib/structured-data.ts` centralizando schemas reutilizáveis com `@id` consistentes (ancoragem de entidade).

**Em `__root.tsx`** — expandir o JSON-LD global:
- `Organization` ganha: `alternateName` ("Portal Infância Protegida"), `foundingDate`, `slogan` ("Informação confiável salva vidas"), `keywords` (proteção infantil, Maio Laranja, Disque 100, ECA, abuso infantil, exploração sexual infantil, direitos da criança, educação preventiva), `knowsAbout` (lista de entidades-tópico), `memberOf`/`subjectOf` referenciando Maio Laranja como `Event` recorrente.
- Novo nó `Event` para **Maio Laranja** (`@id: .../#maio-laranja`) com `about`, `organizer` referenciando a Organization, `eventSchedule` anual.
- Novo nó `DefinedTermSet` "Glossário Infância Protegida" com `DefinedTerm` para: Proteção Infantil, Maio Laranja, Abuso Sexual Infantil, Exploração Sexual Infantil, Direitos da Criança, Educação Preventiva, Grooming, Disque 100, ECA — cada um com `@id` próprio e `sameAs` apontando para Wikipedia/gov.br/UNICEF quando aplicável.

### 2. SiteNavigationElement Schema

Adicionar no `__root.tsx` (aparece em todas as páginas) um array `ItemList` de `SiteNavigationElement` mapeando as 14 entradas da navegação principal (Início, Maio Laranja, Identificar Sinais, Riscos Online, Para Pais, Para Escolas, Biblioteca, Casos Reais, Notícias, Como Ajudar, Denúncia, Legislação, Mapa de Ajuda, FAQ) — cada item com `name`, `url`, `position`.

### 3. SearchAction Schema (refinar)

Já existe `SearchAction` no WebSite. Vou:
- Confirmar/ajustar a rota de busca: hoje aponta para `/?q=`. Verificar se `index.tsx` consome `?q=`; se não, ajustar para `/biblioteca?q=` (página que tem busca real) **ou** implementar leitura do `?q=` no index com redirect. Pergunto via plano: usar a busca da Biblioteca como endpoint do SearchAction.

### 4. Consistência Semântica entre páginas institucionais

Em **Sobre, Objetivos, Metodologia, Fontes, Index** — adicionar nos `head().scripts`:
- `AboutPage` / `WebPage` com `mainEntity: { @id: .../#organization }` reforçando que cada página fala da mesma entidade.
- `BreadcrumbList` consistente.
- `mentions` listando as entidades-tópico (Maio Laranja, ECA, Disque 100) com `@id`.

Resultado: todas as páginas institucionais referenciam o **mesmo `@id` de Organization**, sinal forte de entidade única para o Knowledge Graph.

### 5. Web App Manifest — validação e ampliação

Atualizar `public/site.webmanifest`:
- Adicionar `id: "/"`, `categories: ["education", "news", "social"]`, `orientation: "portrait-primary"`, `dir: "ltr"`.
- Separar ícone `maskable` em entrada distinta (hoje usa o mesmo 512 — manter funcional, marcar `purpose` corretamente como `"any"` e `"maskable"`).
- Adicionar `shortcuts` para: Denúncia, Identificar Sinais, Mapa de Ajuda, Biblioteca.
- Adicionar `screenshots` (opcional — só se já existirem assets; caso contrário, omitir para não quebrar validação).
- Garantir tags no `__root.tsx`: `apple-mobile-web-app-capable`, `mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`.

### 6. Detalhes técnicos

**Arquivos a criar:**
- `src/lib/structured-data.ts` — helpers `orgSchema()`, `websiteSchema()`, `navigationSchema()`, `definedTermsSchema()`, `aboutPageSchema(url, name)`, `breadcrumbSchema(items)`.

**Arquivos a editar:**
- `src/routes/__root.tsx` — usar helpers; adicionar SiteNavigationElement, DefinedTermSet, Event(Maio Laranja); meta tags PWA extras.
- `src/routes/index.tsx`, `sobre.tsx`, `objetivos.tsx`, `metodologia.tsx`, `fontes.tsx` — adicionar `AboutPage`/`WebPage` + `BreadcrumbList` referenciando `#organization`.
- `public/site.webmanifest` — campos adicionais + shortcuts.

**Não alterar:** identidade visual, estilo, conteúdo das páginas, navegação existente, rotas, componentes UI.

### 7. Relatório final (entregue após implementação)

Problemas encontrados, problemas corrigidos, melhorias SEO/E-E-A-T/IA/Knowledge Graph/performance/indexação/acessibilidade, pendências dependentes de Google/Bing, pontuação SEO antes/depois (via `seo--trigger_scan`), previsão de impacto orgânico e recomendações para 6 meses.

### Pergunta de decisão

Para o **SearchAction**, o destino atual é `/?q={search_term_string}` mas a home não processa esse parâmetro. Devo:
- (A) Apontar o SearchAction para `/biblioteca?q={search_term_string}` (página que já tem busca), ou
- (B) Implementar leitura de `?q=` na home com redirect para `/biblioteca`?

Sigo com **(A)** por padrão se você só aprovar o plano sem responder.
