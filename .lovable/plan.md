## Enriquecer a página `/objetivos`

Reescrever `src/routes/objetivos.tsx` mantendo a identidade visual do site (`PageHero` + `Reveal` + tokens laranja/navy). Em vez de criar várias faixas largas separadas, tudo o conteúdo novo vive **dentro de um único `<article>` central** (mesma largura do texto principal, `max-w-3xl`), fluindo como uma página institucional única.

### Estrutura final (uma página, conteúdo fluido)

1. **Hero** — `PageHero` variant orange, título **"Nossa Missão e Objetivos"**, eyebrow "Missão e objetivos".

2. **`<article>` central** (`max-w-3xl mx-auto px-4 py-16 space-y-14`) contendo todas as seções abaixo como subtítulos `<h2>` dentro do mesmo bloco — cada uma com pequeno cabeçalho (ícone + eyebrow + título), igual ao padrão da nova página `/sobre`:

   **a) Introdução** — parágrafo:
   > "O Infância Protegida existe para transformar informação em proteção. Nosso objetivo é ajudar famílias, educadores, profissionais e a sociedade a reconhecer sinais de violência, agir de forma preventiva e fortalecer a rede de proteção de crianças e adolescentes."

   **b) Objetivos centrais** — os 5 cards existentes (Prevenir, Informar, Mobilizar, Conectar, Documentar), agora em grid 2 colunas dentro do `max-w-3xl`.

   **c) Nosso Impacto** — lista vertical com 5 itens (Conscientização social, Educação preventiva, Combate ao abuso infantil, Enfrentamento da exploração sexual infantil, Fortalecimento da rede de proteção). Cada item: ícone pequeno + título + 1 frase. Layout de lista, não cards largos.

   **d) Quem queremos alcançar** — grid compacto 2 colunas com 6 mini-cards (Pais e responsáveis, Educadores, Escolas, Conselheiros tutelares, Profissionais da assistência social, Comunidade em geral). Ícones lucide pequenos.

   **e) Como pretendemos ajudar** — grid 3×2 dentro do mesmo container, ícone em círculo laranja + verbo (Informar, Orientar, Prevenir, Conscientizar, Conectar, Denunciar) + 1 frase curta.

   **f) Compromisso com a proteção infantil** — parágrafo institucional + linha de "chips" textuais com as fontes (MDHC, ECA, Lei 13.431/2017, FBSP, Unicef), sem virar bloco gigante.

   **g) Chamada final** — `aside` arredondado com gradiente laranja suave (mesmo estilo da `/sobre`), contendo a frase
   > "Proteger uma criança começa com informação. Cada pessoa conscientizada pode se tornar parte da rede de proteção."
   e três botões `<Link>`: **Identificar Sinais** (`/sinais`), **Como Denunciar** (`/denuncia`), **Mapa de Ajuda** (`/mapa`).

### Metadados (`head()`)

- `title`: "Nossa Missão e Objetivos — Infância Protegida"
- `description`: nova, refletindo as 5 áreas de impacto e públicos
- `og:title` / `og:description` / `og:image` (hero atual `ribbon.jpg`)
- `canonical`: `https://minhainfanciaprotegida.com.br/objetivos`
- JSON-LD: `AboutPage` referenciando a `Organization` Infância Protegida e a missão

### Arquivo afetado

- `src/routes/objetivos.tsx` — reescrita única.
