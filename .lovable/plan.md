# Redesign — Empatia Institucional

Aplicar a direção escolhida ao portal **Minha Infância Protegida**, mantendo a paleta atual (navy `#0B142D`, laranja `#D9531E`, creme `#F5F1EA`, ink `#1F2937`) e tipografia **Instrument Serif + Work Sans**. Foco no chrome global (topbar, header, hero) + harmonização das seções da home.

## 1. Tokens & tipografia (`src/styles.css` + `__root.tsx`)

- Trocar fontes carregadas: substituir Fraunces/Inter por **Instrument Serif** (display) + **Work Sans** (body) via `<link>` no `__root.tsx`.
- Atualizar `--font-display` e `--font-sans` em `@theme`.
- Adicionar utilitários novos: `glass-card` (backdrop-blur + borda translúcida), `shadow-orange-soft`, e refinar `--shadow-elegant`.
- Garantir que vermelho de emergência (`--red-inst`) mantenha contraste AA na topbar.

## 2. Topbar de emergência (`SiteHeader.tsx`)

- Faixa vermelha mais discreta: ícone alerta + "DENUNCIE AGORA" à esquerda, divisor, "24h, gratuito e anônimo".
- À direita: pílula branca com "Disque 100" e ícone telefone (link `tel:100`), hover suave.
- Layout responsivo: mantém apenas Disque 100 visível em mobile.

## 3. Header principal (`SiteHeader.tsx`)

- Logo: tile arredondado 56px com gradiente laranja + ícone escudo animado (mantém o atual).
- Título "INFÂNCIA PROTEGIDA" em Work Sans bold + sub-eyebrow laranja "Campanha Maio Laranja".
- Busca: input pílula com fundo `slate-100`, foco branco com ring laranja, ícone à esquerda.
- CTA "DENUNCIE AGORA" laranja com sombra suave laranja, ícone de alerta.
- Nav abaixo, em linha própria com borda superior fina, links uppercase tracking-wide, ativo com underline laranja.
- "Mais" no canto direito mantém dropdown atual.

## 4. Hero principal (`src/routes/index.tsx`)

- Bloco full-width 640px, fundo navy `#0B142D` com imagem de mãos/silhuetas em `opacity-50 mix-blend-luminosity` + gradiente vertical para legibilidade.
- Badge "MAIO LARANJA" com ponto pulsando.
- H1 serifado gigante (`Instrument Serif`, 5xl→7xl): "Proteção é compromisso de **todos nós.**" (acento laranja na segunda parte).
- Subtítulo em slate-300.
- Dois CTAs: primário laranja "Como Identificar Sinais" → `/sinais`; secundário glass "Materiais de Apoio" → `/biblioteca`.
- Ornamento SVG floral laranja decorativo no canto inferior direito (opacity 10%).
- Respeitar `prefers-reduced-motion` (sem pulse).

## 5. Harmonização das seções abaixo do hero

Apenas ajustes de estilo para casar com o novo hero (não reescrever lógica):
- **Pilares** (Sinais/Riscos/Pais/Escolas): cards brancos com ícone em tile laranja-suave, hover-lift.
- **Casos em destaque**: manter componentes do dossiê (já alinhados à paleta).
- **Notícias recentes**: cards editoriais com título serifado.
- **Faixa final de denúncia**: bloco navy full-width com Disque 100 + canais.
- **Footer**: pequenos ajustes tipográficos para combinar.

## 6. Acessibilidade & performance

- `aria-label` em ícones-só.
- Contraste AA verificado para todas as combinações.
- `loading="lazy"` em imagens fora do hero.
- `prefers-reduced-motion` desativa pulse/kenburns.
- Sem mudanças de rota, schema ou backend.

## 7. Arquivos afetados

**Editados:**
- `src/styles.css` — fontes, tokens, utilitários.
- `src/routes/__root.tsx` — `<link>` das novas fontes.
- `src/components/site/SiteHeader.tsx` — topbar, header, nav.
- `src/routes/index.tsx` — hero e ajustes leves nas seções.
- `src/components/site/PageHero.tsx`, `ArticleCard.tsx`, `SiteFooter.tsx` — restyle leve para harmonizar.

**Sem alterações:** rotas, loaders, banco de dados, lógica de admin, componentes do dossiê de Casos (já alinhados).

## Fora de escopo

- Redesign das páginas internas (Notícias, Casos detalhe, Admin) — fica para iterações seguintes se desejar.
- Mudanças de conteúdo/copy além das mostradas no hero.
- Novas libs de animação.
