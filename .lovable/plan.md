# Assistente IA — Acolhimento e Orientação

Adicionar um chatbot real e integrado ao portal, deixando claro em todo momento que **não é canal oficial** e que urgências devem ir ao **Disque 100**, Conselho Tutelar ou Polícia.

## 1. Backend (TanStack server route)

**`src/routes/api/chat.ts`** — endpoint de streaming via AI SDK + Lovable AI Gateway.

- Modelo: `google/gemini-3-flash-preview`.
- `LOVABLE_API_KEY` lida via `process.env` no handler (auto-provisionada).
- System prompt em PT-BR define:
  - Identidade: "Assistente de Acolhimento" do portal Minha Infância Protegida.
  - **AVISO obrigatório** em toda primeira resposta da conversa: não é canal oficial de denúncia, não substitui Disque 100 / Conselho Tutelar / Polícia.
  - Escopo: prioridade absoluta em proteção infantil; permite acolher temas correlatos (família, escola, saúde mental, bullying, riscos online) sempre orientando a procurar canais oficiais.
  - Regras de segurança: em sinais de risco iminente → orientar Disque 100 (24h, gratuito, anônimo), 190 (Polícia) ou 192 (SAMU); nunca pedir dados pessoais identificáveis; nunca diagnosticar; tom acolhedor, claro, sem julgamento.
  - Conhece o site: pode citar páginas internas (/sinais, /riscos-online, /denuncia, /mapa, /biblioteca, /legislacao).
- Helper `src/lib/ai-gateway.server.ts` com `createLovableAiGatewayProvider` (padrão do template).
- Tratamento explícito de 429 (limite) e 402 (créditos).

## 2. Frontend — AI Elements

Instalar: `conversation`, `message`, `prompt-input`, `shimmer`.

**Componente compartilhado** `src/components/site/AssistantChat.tsx`:

- `useChat` com `DefaultChatTransport({ api: "/api/chat" })`.
- `id` derivado do `threadId` ativo (remonta ao trocar de thread).
- Renderiza `message.parts` (não `content`).
- Mensagens do assistente sem fundo (texto direto); mensagens do usuário com bolha `bg-primary text-primary-foreground`.
- Loading com `Shimmer` ("Pensando...").
- Composer com `PromptInputTextarea` + `PromptInputFooter` (botão à direita), foco automático.
- Banner persistente no topo do chat:
  > ⚠️ Não é canal oficial. Em urgências, ligue **100** (Disque Direitos Humanos) ou **190**.
- Sugestões iniciais (chips) quando a thread está vazia: "Como identificar sinais de abuso?", "Como denunciar?", "Riscos online em jogos", "O que é o ECA Digital?".

## 3. Threads em localStorage

**Hook** `src/hooks/use-chat-threads.ts`:

- Bootstrap idempotente guarded por `typeof window !== "undefined"` (não em `useEffect` solto — evita threads duplicadas em StrictMode).
- Forma `{ id, title, updatedAt, messages: UIMessage[] }[]` em `localStorage["mip.chat.threads"]`.
- Título derivado da primeira mensagem do usuário (primeiros ~40 chars).
- Persiste mensagens via `onFinish`/effect com deps completas.

## 4. Rotas e UI

**Página dedicada** `src/routes/assistente.tsx` (`/assistente`):

- Layout com sidebar de threads à esquerda (lista, botão "Nova conversa", deletar como botão **irmão**, não aninhado) e chat à direita.
- Rota dinâmica `src/routes/assistente.$threadId.tsx` para URL por thread; `/assistente` cria/seleciona thread e navega.
- `head()` com title/description próprios + aviso "não-oficial".
- Link no menu principal do `SiteHeader` ("Assistente IA").

**Botão flutuante** `src/components/site/FloatingAssistant.tsx`:

- Renderizado no `__root.tsx` (oculto em rotas `/assistente*` e `/admin*`).
- Botão redondo canto inferior direito, ícone `MessageCircleHeart`, label "Tire suas dúvidas".
- Abre `Sheet` (lateral direita, ~420px) com o mesmo `AssistantChat`, usando uma thread "rápida" ou a thread ativa atual.
- Link "Abrir conversa completa →" navega para `/assistente/:id`.

## 5. SEO/Acessibilidade

- `head()` da página: title "Assistente IA de Acolhimento · Minha Infância Protegida", description deixando claro que é orientação informativa e não substitui denúncia oficial.
- `aria-label` no botão flutuante, foco gerenciado ao abrir o sheet.
- Respeita `prefers-reduced-motion`.

## 6. Arquivos

**Criados:**

- `src/routes/api/chat.ts`
- `src/routes/assistente.tsx`, `src/routes/assistente.$threadId.tsx`
- `src/lib/ai-gateway.server.ts`
- `src/hooks/use-chat-threads.ts`
- `src/components/site/AssistantChat.tsx`
- `src/components/site/FloatingAssistant.tsx`
- `src/components/ai-elements/*` (via CLI)

**Editados:**

- `src/routes/__root.tsx` — renderiza `<FloatingAssistant />`.
- `src/components/site/SiteHeader.tsx` — link "Assistente IA".
- `package.json` — `ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`, `zod` (se faltar).

## Fora de escopo

- Login/sync entre dispositivos (escolha foi localStorage).
- Moderação de conteúdo via API externa.
- Voz/áudio, anexos, ferramentas (tools) — apenas chat texto streaming.
