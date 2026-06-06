## Ajustes visuais no header (área direita)

### 1. Separador entre busca e botão "Denuncie Agora"
Adicionar um divisor vertical fino entre o botão de busca e o botão vermelho de denúncia, usando um `<span>` decorativo de 1px (`w-px h-5 bg-border`) com `aria-hidden`. Só aparece em `sm+` (onde o botão de denúncia também aparece), para não ficar solto no mobile.

### 2. Caixa "Buscar no site" mais bonita
Refinar o botão-gatilho da busca em `GlobalSearch.tsx`:

- Aumentar levemente a largura mínima e padding (visual de input, não de pílula apertada).
- Borda mais suave (`border-border/70`) com hover `border-[color:var(--orange)]/50` e leve sombra ao passar o mouse.
- Ícone de lupa em destaque (cor `--orange`) à esquerda.
- Texto "Buscar no site…" em `text-muted-foreground` mais claro.
- `kbd ⌘K` com visual de tecla real: fundo `bg-muted`, borda inferior mais escura, fonte mono, padding equilibrado.
- Transição suave em hover/focus + `focus-visible:ring` na cor laranja.

Também refinar o modal aberto (mínimas melhorias):
- Input interno com placeholder mais sutil.
- Header do modal com leve gradiente.

Sem alterar comportamento, atalhos ou resultados — somente estética.

### Arquivos afetados
- `src/components/site/SiteHeader.tsx` — adicionar separador `|`.
- `src/components/site/GlobalSearch.tsx` — restyle do botão-gatilho e leve polimento do modal.
