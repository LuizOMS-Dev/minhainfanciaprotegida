import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, Phone, ShieldAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GlobalSearch } from "@/components/site/GlobalSearch";

const primaryNav = [
  { to: "/", label: "Início" },
  { to: "/sinais", label: "Sinais" },
  { to: "/riscos-online", label: "Riscos Online" },
  { to: "/pais", label: "Para Pais" },
  { to: "/escolas", label: "Para Escolas" },
  { to: "/casos", label: "Casos" },
  { to: "/noticias", label: "Notícias" },
  { to: "/biblioteca", label: "Biblioteca" },
  { to: "/legislacao", label: "Legislação" },
] as const;

const moreNav = [
  { to: "/maio-laranja", label: "Maio Laranja", desc: "Sobre a campanha 18 de maio" },
  { to: "/mapa", label: "Mapa de Ajuda", desc: "Conselhos, delegacias e centros de apoio" },
  { to: "/faq", label: "Perguntas Frequentes", desc: "Dúvidas comuns sobre denúncia e proteção" },
  { to: "/sobre", label: "Sobre o Projeto", desc: "Quem somos e por que existimos" },
  { to: "/objetivos", label: "Objetivos", desc: "Missão e metas da campanha" },
  { to: "/metodologia", label: "Metodologia", desc: "Como produzimos o conteúdo" },
  { to: "/fontes", label: "Fontes Utilizadas", desc: "Referências oficiais consultadas" },
] as const;

const mobileNav = [...primaryNav, ...moreNav.map((m) => ({ to: m.to, label: m.label }))] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <>
      {/* Faixa de emergência permanente */}
      <a
        href="tel:100"
        className="block w-full bg-[color:var(--red-inst)] text-[color:var(--red-inst-foreground)] text-center text-xs sm:text-sm font-semibold tracking-wide py-2 hover:bg-[color:var(--red-inst)]/90 transition-colors"
        aria-label="Ligar para Disque 100 — Disque Direitos Humanos"
      >
        <span className="inline-flex items-center gap-2">
          <ShieldAlert className="size-4" aria-hidden />
          Denuncie agora — Disque 100 · Funciona 24h, é gratuito e anônimo
        </span>
      </a>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-background/60 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-4 lg:gap-6">
          {/* ÁREA 1 — Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 min-w-0" aria-label="Página inicial">
            <span className="relative inline-flex size-9 items-center justify-center rounded-full bg-gradient-orange shadow-orange shrink-0">
              <span className="absolute inset-0 rounded-full bg-[color:var(--orange)]/40 animate-ping-slow" />
              <ShieldAlert className="size-4 text-[color:var(--navy-deep)]" aria-hidden />
            </span>
            <span className="hidden md:flex flex-col leading-tight whitespace-nowrap">
              <span className="font-display text-[15px] font-semibold tracking-tight">
                Infância Protegida
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Campanha Maio Laranja
              </span>
            </span>
          </Link>

          {/* ÁREA 2 — Menu principal */}
          <nav
            className="hidden lg:flex items-center justify-center gap-0.5 min-w-0"
            aria-label="Navegação principal"
          >
            {primaryNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-2 py-2 text-[13px] font-medium text-foreground/75 hover:text-foreground rounded-md hover:bg-muted transition-colors whitespace-nowrap"
                activeProps={{ className: "text-[color:var(--orange)] bg-muted/60" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                className="inline-flex items-center gap-1 px-2 py-2 text-[13px] font-medium text-foreground/75 hover:text-foreground rounded-md hover:bg-muted transition-colors whitespace-nowrap"
              >
                Mais <ChevronDown className={`size-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} aria-hidden />
              </button>
              {moreOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-background shadow-lg p-1 animate-fade-in z-50"
                >
                  {moreNav.map((m) => (
                    <Link
                      key={m.to}
                      to={m.to}
                      role="menuitem"
                      onClick={() => setMoreOpen(false)}
                      className="block px-3 py-2.5 rounded-lg hover:bg-muted"
                      activeProps={{ className: "bg-muted" }}
                    >
                      <span className="block text-sm font-semibold text-foreground">{m.label}</span>
                      <span className="block text-xs text-muted-foreground">{m.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* ÁREA 3 — Busca + Denunciar */}
          <div className="flex items-center gap-2 shrink-0 justify-self-end">
            <GlobalSearch />
            <span
              aria-hidden
              className="hidden sm:block w-px h-6 bg-border/80 mx-1"
            />
            <Link
              to="/denuncia"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[color:var(--red-inst)] text-[color:var(--red-inst-foreground)] px-4 py-2 text-sm font-semibold hover:opacity-95 transition shadow-sm whitespace-nowrap"
            >
              <Phone className="size-4" aria-hidden />
              Denuncie Agora
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex size-10 items-center justify-center rounded-md hover:bg-muted"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-background animate-fade-in">
            <nav className="px-4 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto" aria-label="Navegação móvel">
              {mobileNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-md text-sm font-medium hover:bg-muted"
                  activeProps={{ className: "text-[color:var(--orange)] bg-muted" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/denuncia"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--red-inst)] text-[color:var(--red-inst-foreground)] px-4 py-3 font-semibold"
              >
                <Phone className="size-4" /> Denunciar agora
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
