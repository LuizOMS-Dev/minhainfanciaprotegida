import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  BookMarked,
  FileText,
  Landmark,
  MapPin,
  Newspaper,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";
import { cases } from "@/content/cases";
import { news } from "@/content/news";
import { library } from "@/content/library";
import { helpLocations } from "@/content/helpLocations";

type Group = "Casos" | "Notícias" | "Biblioteca" | "Legislação" | "Mapa" | "Páginas";

interface Entry {
  group: Group;
  title: string;
  subtitle?: string;
  to: string;
  params?: Record<string, string>;
  haystack: string;
  icon: typeof FileText;
}

const pages: Entry[] = [
  { group: "Páginas", title: "Início", to: "/", haystack: "inicio home", icon: ShieldAlert },
  { group: "Páginas", title: "Sinais de alerta", to: "/sinais", haystack: "sinais alerta indicadores", icon: ShieldAlert },
  { group: "Páginas", title: "Riscos online", to: "/riscos-online", haystack: "riscos online internet digital safernet", icon: ShieldAlert },
  { group: "Páginas", title: "Para pais", to: "/pais", haystack: "pais familias responsavel", icon: ShieldAlert },
  { group: "Páginas", title: "Para escolas", to: "/escolas", haystack: "escolas educadores professores", icon: ShieldAlert },
  { group: "Páginas", title: "Como ajudar", to: "/como-ajudar", haystack: "ajudar voluntariado doar", icon: ShieldAlert },
  { group: "Páginas", title: "Denuncie agora", to: "/denuncia", haystack: "denuncia disque 100 conselho tutelar", icon: ShieldAlert },
  { group: "Páginas", title: "Maio Laranja", to: "/maio-laranja", haystack: "maio laranja campanha 18 maio", icon: ShieldAlert },
  { group: "Páginas", title: "Perguntas frequentes", to: "/faq", haystack: "faq duvidas perguntas frequentes", icon: ShieldAlert },
  { group: "Páginas", title: "Sobre o projeto", to: "/sobre", haystack: "sobre projeto missao quem somos", icon: ShieldAlert },
  { group: "Páginas", title: "Objetivos", to: "/objetivos", haystack: "objetivos metas missao", icon: ShieldAlert },
  { group: "Páginas", title: "Metodologia", to: "/metodologia", haystack: "metodologia editorial fontes verificacao", icon: ShieldAlert },
  { group: "Páginas", title: "Fontes utilizadas", to: "/fontes", haystack: "fontes referencias bibliografia", icon: ShieldAlert },
  { group: "Páginas", title: "Mapa de ajuda", to: "/mapa", haystack: "mapa conselho tutelar delegacia centro apoio", icon: MapPin },
];

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buildIndex(): Entry[] {
  return [
    ...cases.map<Entry>((c) => ({
      group: "Casos",
      title: c.title,
      subtitle: `${c.location} · ${c.tag}`,
      to: "/casos/$slug",
      params: { slug: c.slug },
      haystack: norm(`${c.title} ${c.summary} ${c.location} ${c.tag}`),
      icon: FileText,
    })),
    ...news.map<Entry>((n) => ({
      group: "Notícias",
      title: n.title,
      subtitle: `${n.category} · ${new Date(n.date).getFullYear()}`,
      to: "/noticias/$slug",
      params: { slug: n.slug },
      haystack: norm(`${n.title} ${n.excerpt} ${n.category}`),
      icon: Newspaper,
    })),
    ...library.map<Entry>((l) => ({
      group: "Biblioteca",
      title: l.title,
      subtitle: `${l.sourceOrg} · ${l.category}`,
      to: "/biblioteca/$slug",
      params: { slug: l.slug },
      haystack: norm(`${l.title} ${l.description} ${l.sourceOrg} ${l.category} ${l.audience}`),
      icon: BookMarked,
    })),
    ...helpLocations.slice(0, 80).map<Entry>((h) => ({
      group: "Mapa",
      title: h.name,
      subtitle: `${h.city}/${h.state}${h.phone ? ` · ${h.phone}` : ""}`,
      to: "/mapa",
      haystack: norm(`${h.name} ${h.city} ${h.state} ${h.type} ${h.phone ?? ""}`),
      icon: MapPin,
    })),
    {
      group: "Legislação",
      title: "ECA — Estatuto da Criança e do Adolescente",
      subtitle: "Lei 8.069/1990",
      to: "/legislacao",
      haystack: norm("eca estatuto crianca adolescente lei 8069 1990"),
      icon: Landmark,
    },
    {
      group: "Legislação",
      title: "ECA Digital — Lei nº 15.211/2025",
      subtitle: "Lei Felca",
      to: "/legislacao",
      haystack: norm("eca digital lei felca 15211 2025 plataformas"),
      icon: Landmark,
    },
    {
      group: "Legislação",
      title: "Lei nº 13.431/2017 — Escuta especializada",
      to: "/legislacao",
      haystack: norm("lei 13431 escuta especializada depoimento especial"),
      icon: Landmark,
    },
    ...pages.map((p) => ({ ...p, haystack: norm(p.haystack + " " + p.title) })),
  ];
}

export function GlobalSearch({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const index = useMemo(buildIndex, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) {
      setQ("");
      setActive(0);
    }
  }, [open]);

  const results = useMemo(() => {
    const term = norm(q.trim());
    if (!term) return index.slice(0, 12);
    return index
      .filter((e) => e.haystack.includes(term))
      .slice(0, 30);
  }, [q, index]);

  const grouped = useMemo(() => {
    const m = new Map<Group, Entry[]>();
    results.forEach((r) => {
      const arr = m.get(r.group) ?? [];
      arr.push(r);
      m.set(r.group, arr);
    });
    return Array.from(m.entries());
  }, [results]);

  const go = (e: Entry) => {
    setOpen(false);
    navigate({ to: e.to, params: e.params } as never);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = results[active];
      if (sel) go(sel);
    }
  };

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-card/70 text-muted-foreground hover:text-foreground hover:bg-card hover:border-[color:var(--orange)]/50 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]/40"
          aria-label="Abrir busca global (Ctrl+K)"
        >
          <Search className="size-4 text-[color:var(--orange)]" aria-hidden />
        </button>
      ) : (
      <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-card/70 pl-3 pr-2 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-card hover:border-[color:var(--orange)]/50 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]/40 min-w-[200px]"
        aria-label="Abrir busca global (Ctrl+K)"
      >
        <Search className="size-4 text-[color:var(--orange)]" aria-hidden />
        <span className="flex-1 text-left">Buscar no site…</span>
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex size-10 items-center justify-center rounded-md hover:bg-muted"
        aria-label="Abrir busca"
      >
        <Search className="size-5" />
      </button>
      </>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Busca global"
        >
          <div
            className="mx-auto mt-[10vh] max-w-2xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="size-5 text-muted-foreground" aria-hidden />
              <input
                autoFocus
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Buscar casos, notícias, biblioteca, leis, locais..."
                className="flex-1 bg-transparent text-base focus:outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar busca"
                className="rounded-md p-1 hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {results.length === 0 && (
                <p className="px-6 py-10 text-center text-sm text-muted-foreground">
                  Nada encontrado para "{q}".
                </p>
              )}
              {grouped.map(([group, items]) => (
                <div key={group} className="px-2 pb-2">
                  <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group}
                  </p>
                  {items.map((it) => {
                    const idx = results.indexOf(it);
                    const isActive = idx === active;
                    const Icon = it.icon;
                    return (
                      <button
                        key={`${it.group}-${it.title}-${idx}`}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => go(it)}
                        className={`w-full text-left flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                          isActive ? "bg-muted" : "hover:bg-muted/60"
                        }`}
                      >
                        <span className="mt-0.5 inline-flex size-8 items-center justify-center rounded-lg bg-gradient-orange text-[color:var(--navy-deep)] shrink-0">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold truncate">{it.title}</span>
                          {it.subtitle && (
                            <span className="block text-xs text-muted-foreground truncate">{it.subtitle}</span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="border-t border-border bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>↑↓ navegar · ↵ abrir · esc fechar</span>
              <span>⌘K / Ctrl+K</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
