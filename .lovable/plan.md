
# Redesign editorial — Notícias e Casos

Recriação completa do layout (sem alterar dados/regras de negócio) das 4 páginas:
`noticias.index.tsx`, `casos.index.tsx`, `noticias.$slug.tsx`, `casos.$slug.tsx`.

## Linguagem visual (aplicada a tudo)

- Fundo branco predominante, muito espaço em branco, leitura confortável no celular.
- Azul-marinho (`--navy-deep`) como cor estrutural; laranja (`--orange`) **apenas** em destaques (CTA, selo de verificação, "Como denunciar", linha-do-tempo ativa).
- Vermelho institucional reservado para a faixa "Como denunciar / Disque 100".
- Tipografia: display serifado já existente para títulos; corpo sans atual.
- Cards: borda sutil `border-border`, `rounded-3xl`, sombras discretas, hover suave (sem efeitos chamativos).
- Sem imagens chocantes, sem tom sensacionalista, sem cronologias inventadas (timeline só renderiza se `timeline.length > 0`).

## 1. Páginas de listagem — `/noticias` e `/casos`

Reescrita com a mesma arquitetura editorial:

1. **PageHero institucional enxuto** — categoria-âncora, H1 curto, 1 linha de subtítulo, sem imagem de fundo pesada.
2. **Filtros horizontais** (chips de categoria) — versão refinada, sticky no topo ao rolar, alto contraste.
3. **Destaque editorial** — 1 card grande (featured) com cover 16/9, título, resumo, autoria, data, tempo de leitura e selo "Verificado" quando aplicável.
4. **Grade 3 colunas no desktop / 1 no mobile** — `EditorialArticleCard` variant `default`, espaçamentos generosos.
5. **Bloco "Como denunciar"** após primeira leva de cards — faixa branca com borda laranja, botões para Disque 100, 190 e Conselho Tutelar.
6. **Listagem complementar** (segunda leva, mais densa) com paginação ou "ver mais".
7. **Rodapé editorial da seção** — explicando o que é a editoria (Notícias = factual; Casos = aprendizado a partir de situações reais e verificáveis) e linka para Metodologia / Fontes.

Sem dependência de Supabase nova — usa os mesmos dados já carregados.

## 2. Página de detalhe — `/casos/$slug`

Reescrita em 11 blocos, na ordem exata pedida:

1. **Hero editorial premium** — `ArticleHero` refinado: categoria, H1, subtítulo curto, data publicação, última atualização, tempo de leitura, share + botão laranja "Como denunciar". Sem cover gigante; cover vira figura abaixo do hero.
2. **Resumo do caso** — `SummaryCard` (já existe), tom neutro.
3. **Por que este tema importa** — `WhyMattersBlock` (já existe), navy + accent laranja.
4. **O que aprendemos** — novo bloco `LessonsBlock`: grid de cards com ícone discreto + frase curta (vem de `a.lessons` / fallback `action_steps`).
5. **Sinais de alerta** — novo `SignalsCards`: cards com ícone, título, 1 linha (mapeia `warning_indicators` e `signals`).
6. **Como agir** — novo `HowToActSteps`: passo a passo numerado (1→N) para famílias / escolas / responsáveis, a partir de `action_steps`.
7. **Como prevenir** — `PreventionTips`: cards de orientações práticas (campo `prevention_tips` se existir; caso não, deriva de `library` relacionada — sem inventar).
8. **Rede de proteção** — `ProtectionNetwork`: destaque para Disque 100 (24h, gratuito, anônimo), 190 emergência, Conselho Tutelar local, Polícia Civil, com ícones e contraste alto.
9. **Materiais relacionados** — cards para guias, biblioteca, legislação e conteúdos educativos (já existe `RelatedMaterials` / `RecommendedReading`, apenas reorganizar).
10. **Referências oficiais** — `ReferencesBlock` existente, em card limpo.
11. **Rodapé editorial** — `EditorialFooter` (já existe): última verificação, equipe, aviso de finalidade educativa.

Blocos **só aparecem se houver dado real** — nada de placeholder.

## 3. Página de detalhe — `/noticias/$slug`

Mesma linguagem, com a ordem específica de notícias:

1. Hero editorial premium
2. Resumo da notícia (`SummaryCard`)
3. **Entenda o assunto** (`UnderstandBlock`)
4. **Por que isso importa** (`WhyMattersBlock` variant news)
5. **Contexto** (`NationalContextChips`)
6. **Linha do tempo** — `Timeline` **renderizada só se `a.timeline?.length > 0`** (sem cronologia artificial)
7. **Legislação relacionada** (`LegislationBlock`) — só se houver
8. **Como agir / onde buscar ajuda** (`ReportChannels` + `ActionStepsBlock`) — só se aplicável
9. **Materiais relacionados** (`RelatedMaterials` + `RecommendedReading`)
10. **FAQ** (`FaqBlock`) — só se houver
11. **Referências oficiais** (`ReferencesBlock`)
12. **Rodapé editorial** (`EditorialFooter`)

## Componentes novos a criar

- `src/components/site/editorial/LessonsBlock.tsx`
- `src/components/site/editorial/SignalsCards.tsx`
- `src/components/site/editorial/HowToActSteps.tsx`
- `src/components/site/editorial/PreventionTips.tsx`
- `src/components/site/editorial/ProtectionNetwork.tsx`
- `src/components/site/editorial/SectionLabel.tsx` (label "01 — Resumo", "02 — Por que importa"…)
- `src/components/site/editorial/ListingHero.tsx` (hero enxuto das listagens)
- `src/components/site/editorial/CategoryChips.tsx` (chips sticky)

Reaproveitados sem mudar comportamento: `ArticleHero`, `SummaryCard`, `WhyMattersBlock`, `EditorialFooter`, `Timeline`, `ReferencesBlock`, `ShareButtons`, `EditorialArticleCard`, `ReportChannels`, `LegislationBlock`, `NationalContextChips`, `UnderstandBlock`, `FaqBlock`, `RelatedMaterials`, `RecommendedReading`.

## Arquivos a editar

- `src/routes/noticias.index.tsx` — reescrita layout
- `src/routes/casos.index.tsx` — reescrita layout
- `src/routes/noticias.$slug.tsx` — nova ordem editorial
- `src/routes/casos.$slug.tsx` — nova ordem editorial (11 blocos)
- `src/components/site/ArticleHero.tsx` — ajuste fino (cover sai do hero, vai para figura abaixo; botão "Como denunciar" mais proeminente)
- Pequenos ajustes em `EditorialArticleCard.tsx` para variante de listagem com mais respiro

## Regras inegociáveis aplicadas no código

- `Timeline` só monta se `items.length > 0` — sem fallback fabricado.
- Cada bloco recebe seu dado; se vazio, retorna `null` (já é o padrão da maioria).
- Nenhuma fonte/referência hardcoded inventada — apenas o que vem de `primary_source_url` + `sources[]`.
- Imagens: nenhuma decorativa adicionada. Cover só se `cover_url` existir.
- Linguagem: sem "exclusivo", "chocante", "revelado". Textos UI neutros e educativos.

## Fora do escopo

- Sem mudanças em schema Supabase, server functions, conteúdo estático (`src/content/*`), header, footer ou outras páginas.
- Sem mexer em SEO/metadata existente (mantém `head()` atual de cada rota).
- Conteúdo real das notícias/casos: a tarefa do usuário foi explícita aqui sobre **layout**; população de conteúdo real é tarefa separada.

Pronto para implementar quando você aprovar.
