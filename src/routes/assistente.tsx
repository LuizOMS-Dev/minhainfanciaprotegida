import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { MessageSquarePlus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useChatThreads } from "@/hooks/use-chat-threads";

export const Route = createFileRoute("/assistente")({
  head: () => ({
    meta: [
      { title: "Assistente IA de Acolhimento · Minha Infância Protegida" },
      {
        name: "description",
        content:
          "Tire dúvidas sobre proteção infantil com nosso assistente informativo. Não substitui Disque 100, Conselho Tutelar ou polícia.",
      },
      { property: "og:title", content: "Assistente IA de Acolhimento" },
      {
        property: "og:description",
        content:
          "Assistente informativo sobre proteção de crianças e adolescentes. Canal não-oficial.",
      },
    ],
  }),
  component: AssistantLayout,
});

function AssistantLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { threads, createThread, deleteThread } = useChatThreads();

  const activeId = pathname.startsWith("/assistente/")
    ? pathname.slice("/assistente/".length).split("/")[0]
    : undefined;

  // If at /assistente exactly, pick or create a thread and navigate
  useEffect(() => {
    if (pathname !== "/assistente") return;
    const first = threads[0];
    if (first) {
      void navigate({ to: "/assistente/$threadId", params: { threadId: first.id } });
    } else {
      const created = createThread();
      void navigate({ to: "/assistente/$threadId", params: { threadId: created.id } });
    }
  }, [pathname, threads, createThread, navigate]);

  function handleNew() {
    const t = createThread();
    void navigate({ to: "/assistente/$threadId", params: { threadId: t.id } });
  }

  function handleDelete(id: string) {
    deleteThread(id);
    if (activeId === id) {
      const remaining = threads.filter((t) => t.id !== id);
      if (remaining[0]) {
        void navigate({ to: "/assistente/$threadId", params: { threadId: remaining[0].id } });
      } else {
        void navigate({ to: "/assistente" });
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-0 sm:px-4 lg:px-8 py-0 sm:py-6">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0 md:gap-4 min-h-[calc(100dvh-8rem)] md:min-h-[calc(100dvh-10rem)] md:rounded-2xl md:border md:border-border md:overflow-hidden md:shadow-sm md:bg-card">
        {/* Sidebar de threads */}
        <aside className="border-b md:border-b-0 md:border-r border-border bg-card/50 flex flex-col">
          <div className="p-3 border-b border-border">
            <button
              onClick={handleNew}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-3 py-2.5 text-sm font-semibold hover:opacity-95 transition-opacity"
            >
              <MessageSquarePlus className="size-4" aria-hidden />
              Nova conversa
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-2 max-h-[40vh] md:max-h-none">
            {threads.length === 0 && (
              <p className="px-2 py-3 text-xs text-muted-foreground">
                Suas conversas aparecerão aqui (salvas só neste navegador).
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {threads.map((t) => {
                const isActive = t.id === activeId;
                return (
                  <li key={t.id} className="group flex items-stretch gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        navigate({ to: "/assistente/$threadId", params: { threadId: t.id } })
                      }
                      className={`flex-1 text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                        isActive
                          ? "bg-[color:var(--orange-soft)] text-foreground"
                          : "hover:bg-muted text-foreground/80"
                      }`}
                      title={t.title}
                    >
                      {t.title}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      className="opacity-0 group-hover:opacity-100 inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-[color:var(--red-inst)] hover:bg-muted transition-all"
                      aria-label={`Excluir conversa ${t.title}`}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Chat */}
        <section className="min-h-[60vh] md:min-h-0 flex flex-col">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
