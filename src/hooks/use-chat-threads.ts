import { useCallback, useEffect, useState } from "react";
import type { UIMessage } from "ai";

export interface ChatThread {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
}

const STORAGE_KEY = "mip.chat.threads.v1";

function readThreads(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeThreads(threads: ChatThread[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch {
    /* quota / privacy mode — ignore */
  }
}

function newId() {
  return `t_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function deriveTitle(messages: UIMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "Nova conversa";
  const text = firstUser.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  if (!text) return "Nova conversa";
  return text.length > 48 ? `${text.slice(0, 48).trim()}…` : text;
}

export function useChatThreads() {
  const [threads, setThreads] = useState<ChatThread[]>(() => readThreads());

  // Cross-tab sync
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setThreads(readThreads());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: ChatThread[]) => {
    writeThreads(next);
    setThreads(next);
  }, []);

  const createThread = useCallback((): ChatThread => {
    const thread: ChatThread = {
      id: newId(),
      title: "Nova conversa",
      updatedAt: Date.now(),
      messages: [],
    };
    const current = readThreads();
    persist([thread, ...current]);
    return thread;
  }, [persist]);

  const getThread = useCallback(
    (id: string): ChatThread | undefined => {
      return threads.find((t) => t.id === id) ?? readThreads().find((t) => t.id === id);
    },
    [threads],
  );

  const updateMessages = useCallback(
    (id: string, messages: UIMessage[]) => {
      const current = readThreads();
      const idx = current.findIndex((t) => t.id === id);
      if (idx === -1) {
        // Thread was deleted or doesn't exist yet — recreate it
        const created: ChatThread = {
          id,
          title: deriveTitle(messages),
          updatedAt: Date.now(),
          messages,
        };
        persist([created, ...current]);
        return;
      }
      const updated: ChatThread = {
        ...current[idx],
        messages,
        title: current[idx].title === "Nova conversa" ? deriveTitle(messages) : current[idx].title,
        updatedAt: Date.now(),
      };
      const next = [updated, ...current.filter((t) => t.id !== id)];
      persist(next);
    },
    [persist],
  );

  const deleteThread = useCallback(
    (id: string) => {
      persist(readThreads().filter((t) => t.id !== id));
    },
    [persist],
  );

  const renameThread = useCallback(
    (id: string, title: string) => {
      const current = readThreads();
      persist(current.map((t) => (t.id === id ? { ...t, title } : t)));
    },
    [persist],
  );

  return {
    threads,
    createThread,
    getThread,
    updateMessages,
    deleteThread,
    renameThread,
  };
}
