import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircleHeart, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AssistantChat } from "@/components/public/AssistantChat";
import { useChatThreads } from "@/hooks/use-chat-threads";

const QUICK_THREAD_KEY = "mip.chat.quickThreadId";

export function FloatingAssistant() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [quickId, setQuickId] = useState<string | null>(null);
  const { getThread, updateMessages, createThread } = useChatThreads();

  // Resolve quick thread id (lazy — only when first opened)
  useEffect(() => {
    if (!open || quickId) return;
    if (typeof window === "undefined") return;
    let id = window.localStorage.getItem(QUICK_THREAD_KEY);
    if (!id || !getThread(id)) {
      const t = createThread();
      id = t.id;
      window.localStorage.setItem(QUICK_THREAD_KEY, id);
    }
    setQuickId(id);
  }, [open, quickId, getThread, createThread]);

  // Lock scroll while open (mobile)
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const handleChange = useCallback(
    (messages: Parameters<typeof updateMessages>[1]) => {
      if (!quickId) return;
      updateMessages(quickId, messages);
    },
    [quickId, updateMessages],
  );

  // Hide on assistant and admin routes
  const hidden = pathname.startsWith("/assistente") || pathname.startsWith("/admin");
  if (hidden) return null;

  return (
    <>
      {/* Botão flutuante */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed z-40 bottom-5 right-5 sm:bottom-6 sm:right-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] pl-3 pr-4 py-3 shadow-orange hover:shadow-lg hover:scale-105 active:scale-100 transition-all font-semibold text-sm"
        aria-label="Abrir assistente de acolhimento"
      >
        <span className="relative inline-flex size-7 items-center justify-center rounded-full bg-[color:var(--navy-deep)] text-[color:var(--orange)]">
          <span className="absolute inset-0 rounded-full bg-[color:var(--orange)]/30 animate-ping-slow" />
          <MessageCircleHeart className="size-4" aria-hidden />
        </span>
        <span className="hidden sm:inline">Tire suas dúvidas</span>
        <span className="sm:hidden">Ajuda</span>
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Assistente de acolhimento">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 bg-black/50 backdrop-blur-sm animate-fade-in"
            aria-label="Fechar"
          />
          <div className="w-full sm:w-[440px] max-w-full bg-background shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-gradient-orange">
                  <MessageCircleHeart
                    className="size-4 text-[color:var(--navy-deep)]"
                    aria-hidden
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">Assistente de Acolhimento</p>
                  <p className="text-[10.5px] text-muted-foreground leading-tight">
                    Informativo · não-oficial
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {quickId && (
                  <Link
                    to="/assistente/$threadId"
                    params={{ threadId: quickId }}
                    onClick={() => setOpen(false)}
                    className="text-[11px] font-medium text-[color:var(--orange)] hover:underline px-2"
                  >
                    Abrir página completa
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-muted"
                  aria-label="Fechar"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              {quickId && (
                <AssistantChat
                  key={quickId}
                  threadId={quickId}
                  initialMessages={getThread(quickId)?.messages ?? []}
                  onMessagesChange={handleChange}
                  compact
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
