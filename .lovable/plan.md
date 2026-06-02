## Objetivo
Preservar 100% da identidade visual atual (paleta laranja Maio Laranja, tipografia, animações, layout) e apenas **enriquecer conteúdo, adicionar recursos e refinar detalhes**. Nada de reformulação.

## O que já foi feito (manter)
- Tons avermelhados discretos em pontos estratégicos ✅
- Componentes `cases.tsx`, `news.tsx`, `online-risks.tsx` na home ✅
- Imagens base integradas ✅

## Novas melhorias

### 1. Promover conteúdo a rotas próprias (com SEO individual)
Resumo na home com CTA "Ver mais" → páginas dedicadas:
- `/casos` — galeria expandida de casos reais e reportagens.
- `/noticias` — **área de notícias e conscientização preparada para atualização contínua** (estrutura tipada em `src/content/news.ts` — adicionar novo card = adicionar 1 objeto ao array; suporta tags, data, fonte, link, imagem).
- `/riscos-online` — página completa sobre riscos digitais atuais.

### 2. Casos reais e reportagens recentes
Incluir casos verificados de grande repercussão, com fonte e link oficial:
- **Caso Felca (2025)** — vídeo-denúncia "Adultização" que viralizou e impulsionou o PL da Adultização (Lei nº 15.211/2025 — ECA Digital). Fontes: G1, Agência Câmara, Senado.
- **Caso Vitória / "Mineblox" (2025)** — adolescente atraída por aliciador através de comunidade de jogo online; usado como alerta sobre grooming em plataformas infantis. Fontes: G1, UOL, SaferNet.
- **Caso Araceli (1973)** — origem do Maio Laranja.
- **Caso Bernardo Boldrini, Caso Henry Borel, Caso Isabella Nardoni** — repercussão nacional sobre violência intrafamiliar.
- **Operações da PF** (Caçada, Luz na Infância) — combate a CSAM.

Cada card: imagem, título, data, resumo, repercussão/impacto legal, `<SourceTag>` com link.

### 3. Riscos da internet (temas atuais)
Subseções com dados SaferNet 2024/2025 e exemplos reais (incluindo Felca e Mineblox como estudos de caso):
- **Adultização e exposição infantil** (caso Felca, ECA Digital)
- **Grooming / aliciamento em jogos e redes** (caso Mineblox, Roblox, Discord)
- **Sextorsão**
- **CSAM e deepfakes** (IA generativa)
- **Cyberbullying**
- **Desafios virais perigosos**
Cada subseção: o que é, sinais de alerta, como agir, base legal (art. 241 ECA, Lei Carolina Dieckmann, ECA Digital).

### 4. Sistema de conteúdo escalável
- `src/content/news.ts`, `src/content/cases.ts`, `src/content/risks.ts` — arrays tipados.
- Componente `<ArticleCard>` reutilizável (mesmo padrão visual).
- Filtro por categoria/tag e ordenação por data nas páginas de notícias e casos.
- Estrutura pronta para o usuário (ou IA em prompts futuros) adicionar novos itens facilmente.

### 5. Novas imagens reais e profissionais
Geradas no mesmo tratamento visual:
- `awareness-school.jpg`, `digital-safety.jpg`, `family-dialogue.jpg`, `journalism.jpg`, `online-grooming.jpg`.

### 6. Validação de dados e fontes
Revisar e atualizar todas as estatísticas com referências verificáveis:
- Disque 100 / MDHC (Balanço 2024)
- SaferNet Brasil (Indicadores 2024)
- UNICEF Brasil, Childhood Brasil
- ECA (Lei 8.069/90), CP arts. 217-A, 218, 218-B, 218-C
- Lei nº 15.211/2025 (ECA Digital / "Lei Felca")
Cada número exibirá `<SourceTag>` com link clicável.

### 7. Refinamentos de a11y, usabilidade e responsividade
Sem alterar o visual:
- `aria-label` em ações críticas (denúncia, telefones).
- `prefers-reduced-motion` em `Reveal` e `AnimatedNumber`.
- Foco visível consistente (`focus-visible:ring`).
- Skip-link "Pular para o conteúdo".
- Contraste AA nos tons avermelhados.
- Ajustes finos em `sm`/`md` (testado a 558px).
- `loading="lazy"` + `decoding="async"` em imagens não-críticas; `fetchpriority="high"` no hero.
- Sitemap atualizado com novas rotas.

## Arquivos previstos
**Novos**
- `src/routes/casos.tsx`, `src/routes/noticias.tsx`, `src/routes/riscos-online.tsx`
- `src/content/cases.ts`, `src/content/news.ts`, `src/content/risks.ts`
- `src/components/site/ArticleCard.tsx`, `src/components/site/SkipLink.tsx`
- 5 imagens em `src/assets/`

**Editados cirurgicamente**
- `src/routes/index.tsx` — resumos com CTA "Ver mais"
- `SiteHeader.tsx`, `SiteFooter.tsx` — novos links
- `sitemap[.]xml.ts` — novas rotas
- `styles.css` — apenas utilitários para `focus-visible` e `prefers-reduced-motion`
- `Reveal.tsx`, `AnimatedNumber.tsx` — respeitar `prefers-reduced-motion`

## Garantias
- **Zero alteração** na paleta, tipografia, espaçamentos, animações ou estrutura de layout.
- Todo novo componente segue exatamente o mesmo padrão visual já aprovado.
- Conteúdo 100% baseado em fontes oficiais e verificáveis.
