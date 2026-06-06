// Pesquisa global do painel administrativo.
// Atalho ⌘K / Ctrl+K abre o overlay; resultado em até 4 categorias.
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Search, X, BookOpen, MapPin, Newspaper, Users } from "lucide-react";
import { adminGlobalSearch, type GlobalSearchResult } from "@/lib/admin-overview.functions";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [data, setData] = useState<GlobalSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchFn = useServerFn(adminGlobalSearch);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 20);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open || q.trim().length < 2) {
      setData(null);
      return;
    }
    let cancelled = false;
    const id = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchFn({ data: { q: q.trim() } });
        if (!cancelled) setData(res);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [q, open, searchFn]);

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 20);
        }}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
      >
        <Search className="size-3.5" aria-hidden />
        Pesquisar…
        <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-border bg-card shadow-elegant overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border p-3">
              <Search className="size-4 text-muted-foreground" aria-hidden />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar conteúdos, materiais, locais, usuários…"
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                aria-label="Fechar"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {loading && (
                <p className="px-3 py-6 text-sm text-muted-foreground text-center">
                  Pesquisando…
                </p>
              )}
              {!loading && q.trim().length < 2 && (
                <p className="px-3 py-6 text-sm text-muted-foreground text-center">
                  Digite pelo menos 2 caracteres.
                </p>
              )}
              {!loading && data && (
                <Results data={data} onPick={() => setOpen(false)} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Results({
  data,
  onPick,
}: {
  data: GlobalSearchResult;
  onPick: () => void;
}) {
  const total =
    data.articles.length +
    data.library.length +
    data.locations.length +
    data.users.length;
  if (total === 0) {
    return (
      <p className="px-3 py-6 text-sm text-muted-foreground text-center">
        Nenhum resultado.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {data.articles.length > 0 && (
        <Group icon={<Newspaper className="size-3.5" />} title="Conteúdos">
          {data.articles.map((a) => (
            <Link
              key={a.id}
              to="/admin/article/$id"
              params={{ id: a.id }}
              onClick={onPick}
              className="block rounded-xl px-3 py-2 hover:bg-muted"
            >
              <div className="text-sm font-medium">{a.title}</div>
              <div className="text-xs text-muted-foreground">
                {a.type} · {a.status} · /{a.slug}
              </div>
            </Link>
          ))}
        </Group>
      )}
      {data.library.length > 0 && (
        <Group icon={<BookOpen className="size-3.5" />} title="Biblioteca">
          {data.library.map((l) => (
            <Link
              key={l.id}
              to="/admin/biblioteca/$id"
              params={{ id: l.id }}
              onClick={onPick}
              className="block rounded-xl px-3 py-2 hover:bg-muted"
            >
              <div className="text-sm font-medium">{l.title}</div>
              <div className="text-xs text-muted-foreground">{l.category}</div>
            </Link>
          ))}
        </Group>
      )}
      {data.locations.length > 0 && (
        <Group icon={<MapPin className="size-3.5" />} title="Locais">
          {data.locations.map((l) => (
            <Link
              key={l.id}
              to="/admin/mapa/$id"
              params={{ id: l.id }}
              onClick={onPick}
              className="block rounded-xl px-3 py-2 hover:bg-muted"
            >
              <div className="text-sm font-medium">{l.name}</div>
              <div className="text-xs text-muted-foreground">
                {l.city} / {l.state}
              </div>
            </Link>
          ))}
        </Group>
      )}
      {data.users.length > 0 && (
        <Group icon={<Users className="size-3.5" />} title="Usuários">
          {data.users.map((u) => (
            <Link
              key={u.user_id}
              to="/admin/usuarios"
              onClick={onPick}
              className="block rounded-xl px-3 py-2 hover:bg-muted"
            >
              <div className="text-sm font-medium">{u.display_name ?? u.email}</div>
              <div className="text-xs text-muted-foreground">{u.email}</div>
            </Link>
          ))}
        </Group>
      )}
    </div>
  );
}

function Group({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5">
        {icon} {title}
      </p>
      <div>{children}</div>
    </div>
  );
}
