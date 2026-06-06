## Correções no `SiteHeader.tsx`

### 1. Nome do projeto visível novamente
Hoje o bloco "Infância Protegida / Campanha Maio Laranja" só aparece em `xl` (≥1280px). Vou mostrá-lo a partir de `md` (≥768px) para que apareça em 1045px e acima. Em telas menores, fica só o ícone.

### 2. Dropdown "Mais" funcionando
O motivo de não abrir/cortar: a `<nav>` está com `overflow-hidden`, o que clipa o painel flutuante do dropdown. Vou:
- Remover `overflow-hidden` da nav.
- Usar `flex-wrap: nowrap` + `min-w-0` na área central para evitar quebra.
- Manter o painel com `z-50` e posicionamento absoluto correto.
- Garantir que o clique fora e `Esc` continuem fechando (já implementado).

### 3. Itens do menu "Mais"
Substituir o conteúdo atual por exatamente:

1. Maio Laranja → `/maio-laranja` ✅ (rota existe)
2. Mapa de Ajuda → `/mapa` ✅
3. FAQ → `/faq` ✅
4. Sobre o Projeto → `/sobre` ⚠️ (rota não existe)
5. Objetivos → `/objetivos` ⚠️ (rota não existe)
6. Metodologia → `/metodologia` ⚠️ (rota não existe)
7. Fontes Utilizadas → `/fontes` ⚠️ (rota não existe)

Para os 4 itens sem rota, vou **criar páginas novas** com conteúdo institucional inicial (hero + texto base) seguindo o padrão `PageHero` já usado nas demais seções. Cada uma terá `head()` próprio (title/description/og) conforme exigido pela arquitetura de rotas.

> Observação: "Como Ajudar" sai do menu "Mais" (não está na nova lista solicitada). A rota `/como-ajudar` continua existindo, apenas deixa de aparecer no dropdown.

### 4. Botão "Denuncie Agora"
Renomear o texto do botão vermelho à direita de "Denunciar" para "Denuncie Agora". Mantém ícone de telefone, cor e link para `/denuncia`.

### 5. Validação
Após as mudanças, verificar visualmente em 1920 / 1366 / 1280 / 1045 (atual) / tablet / mobile que:
- Nome aparece a partir de md.
- "Mais" abre o painel sem ser cortado.
- Nenhuma área invade a outra.
- Botão mostra "Denuncie Agora" sem quebrar linha.

### Arquivos afetados
- `src/components/site/SiteHeader.tsx` — edição
- `src/routes/sobre.tsx` — novo
- `src/routes/objetivos.tsx` — novo
- `src/routes/metodologia.tsx` — novo
- `src/routes/fontes.tsx` — novo
- `src/components/site/GlobalSearch.tsx` — adicionar as 4 páginas novas ao índice de busca
- `src/components/site/SiteFooter.tsx` — opcional: incluir links nas seções institucionais
- `src/routes/sitemap[.]xml.ts` — incluir as 4 novas URLs
