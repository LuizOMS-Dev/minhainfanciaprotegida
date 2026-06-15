import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, Bot, ShieldAlert, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface AssistantChatProps {
  threadId: string;
  initialMessages?: UIMessage[];
  onMessagesChange?: (messages: UIMessage[]) => void;
  compact?: boolean;
}

const SUGGESTIONS = [
  "Como identificar sinais de abuso em uma criança?",
  "Como denunciar de forma segura e anônima?",
  "Quais são os riscos online em jogos?",
  "O que diz o ECA Digital (Lei Felca)?",
];

function getMessageText(m: UIMessage): string {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

export function AssistantChat({
  threadId,
  initialMessages,
  onMessagesChange,
  compact = false,
}: AssistantChatProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      const msg = err?.message ?? "";
      if (msg.includes("429")) {
        toast.error("Muitas mensagens. Aguarde alguns instantes e tente novamente.");
      } else if (msg.includes("402")) {
        toast.error("Créditos do assistente esgotados. Tente novamente em breve.");
      } else {
        toast.error("Não foi possível obter resposta. Tente novamente.");
      }
    },
  });

  // Persist messages whenever they change
  useEffect(() => {
    if (!onMessagesChange) return;
    if (messages.length === 0 && (!initialMessages || initialMessages.length === 0)) return;
    onMessagesChange(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, threadId]);

  // Autoscroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  // Focus textarea on mount / thread change
  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId]);

  const isBusy = status === "submitted" || status === "streaming";

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    setInput("");
    void sendMessage({ text });
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function handleSuggestion(text: string) {
    if (isBusy) return;
    void sendMessage({ text });
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-background">
      {/* Aviso persistente */}
      <div
        className="shrink-0 border-b border-[color:var(--red-inst)]/20 bg-[color:var(--red-inst)]/5 px-4 py-2.5 text-[12px] leading-snug text-foreground/85 flex items-start gap-2"
        role="note"
      >
        <ShieldAlert
          className="size-4 mt-0.5 text-[color:var(--red-inst)] shrink-0"
          aria-hidden
        />
        <p>
          <strong className="font-semibold">Não é canal oficial.</strong> Sou um assistente
          informativo. Em urgências, ligue{" "}
          <a href="tel:100" className="font-bold underline underline-offset-2">
            100
          </a>{" "}
          (Disque Direitos Humanos) ou{" "}
          <a href="tel:190" className="font-bold underline underline-offset-2">
            190
          </a>{" "}
          (Polícia).
        </p>
      </div>

      {/* Mensagens */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-5">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-orange shadow-orange">
                <Bot
                  className="size-6 text-[color:var(--navy-deep)]"
                  aria-hidden
                />
              </span>
              <div>
                <h2 className="font-display text-2xl text-foreground">
                  Como posso te acolher hoje?
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Tire dúvidas sobre proteção infantil, sinais de risco, leis e como agir.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSuggestion(s)}
                  className="text-left text-sm rounded-xl border border-border bg-card hover:bg-muted/60 hover:border-[color:var(--orange)]/50 transition-colors px-4 py-3 leading-snug"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto flex flex-col gap-5">
            {messages.map((m) => (
              <MessageRow key={m.id} message={m} />
            ))}
            {status === "submitted" && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-7 items-center justify-center rounded-full bg-[color:var(--orange-soft)] text-[color:var(--orange)] shrink-0">
                  <Bot className="size-4" aria-hidden />
                </span>
                <span className="text-sm text-muted-foreground italic animate-pulse">
                  Pensando…
                </span>
              </div>
            )}
            {error && (
              <p className="text-sm text-[color:var(--red-inst)]">
                Não foi possível obter a resposta. Tente novamente.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-border bg-background/95 backdrop-blur-md px-4 py-3"
      >
        <div className="max-w-2xl mx-auto flex items-end gap-2 rounded-2xl border border-border bg-card focus-within:border-[color:var(--orange)]/60 focus-within:ring-2 focus-within:ring-[color:var(--orange)]/20 transition-all px-3 py-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            rows={1}
            placeholder={compact ? "Escreva sua dúvida…" : "Escreva sua dúvida. Enter para enviar, Shift+Enter para nova linha."}
            disabled={isBusy}
            className="flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground max-h-40 py-1.5 disabled:opacity-60"
            aria-label="Mensagem para o assistente"
          />
          <button
            type="submit"
            disabled={isBusy || !input.trim()}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            aria-label="Enviar mensagem"
          >
            <ArrowUp className="size-4" aria-hidden />
          </button>
        </div>
        <p className="max-w-2xl mx-auto mt-2 text-[10.5px] text-muted-foreground/80 text-center">
          O assistente pode cometer erros. Verifique informações importantes.
        </p>
      </form>
    </div>
  );
}

function MessageRow({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = getMessageText(message);

  if (isUser) {
    return (
      <div className="flex items-start gap-3 justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary text-primary-foreground px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
          {text}
        </div>
        <span className="mt-0.5 inline-flex size-7 items-center justify-center rounded-full bg-muted text-foreground shrink-0">
          <User className="size-4" aria-hidden />
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex size-7 items-center justify-center rounded-full bg-[color:var(--orange-soft)] text-[color:var(--orange)] shrink-0">
        <Bot className="size-4" aria-hidden />
      </span>
      <div className="flex-1 min-w-0 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}
