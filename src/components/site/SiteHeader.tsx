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
  { to: "/mapa", label: "Mapa" },
] as const;

const moreNav = [
  { to: "/faq", label: "Perguntas Frequentes", desc: "Dúvidas comuns sobre proteção infantil" },
  { to: "/maio-laranja", label: "Sobre o Projeto", desc: "Campanha 18 de maio e nossa missão" },
  { to: "/como-ajudar", label: "Como Ajudar", desc: "Voluntariado, doação e mobilização" },
  { to: "/biblioteca", label: "Fontes & Metodologia", desc: "Referências, leis e materiais oficiais" },
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
      if (e.key === "Escape") {
        setMoreOpen(false);
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50">
      {/* Faixa de emergência fixa */}
      <a
        href="tel:100"
        className="block w-full bg-[color:var(--red-inst)] text-[color:var(--red-inst-foreground)] text-center text-xs sm:text-sm font-semibold tracking-wide py-2 hover:bg-[color:var(--red-inst)]/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--red-inst)]"
        aria-label="Ligar para Disque 100 — Disque Direitos Humanos, 24h, gratuito e anônimo"
      >
        <span className="inline-flex items-center gap-2">
          <ShieldAlert className="size-4" aria-hidden />
          Denuncie agora · Disque 100 · Funciona 24h · Gratuito e Anônimo
        </span>
      </a>

      <header
        role="banner"
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-background/70 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-[68px] flex items-center gap-4 xl:gap-6">
          {/* Bloco da marca */}
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
            aria-label="Infância Protegida — Página inicial"
          >
            <span className="relative inline-flex size-10 items-center justify-center rounded-full bg-gradient-orange shadow-orange shrink-0">
              <span className="absolute inset-0 rounded-full bg-[color:var(--orange)]/40 animate-ping-slow" />
              <ShieldAlert className="size-5 text-[color:var(--navy-deep)]" aria-hidden />
            </span>
            <span className="hidden sm:flex flex-col leading-tight whitespace-nowrap">
              <span className="font-display text-[15px] xl:text-base font-bold tracking-[0.04em] uppercase text-foreground">
                Infância Protegida
              </span>
              <span className="text-[10px] xl:text-[10.5px] leading-snug text-muted-foreground max-w-[260px] whitespace-normal">
                Portal Brasileiro de Conscientização, Prevenção e Proteção Infantil
              </span>
            </span>
          </Link>

          {/* Navegação principal */}
          <nav
            className="hidden xl:flex flex-1 items-center justify-center gap-1 min-w-0"
            aria-label="Navegação principal"
          >
            {primaryNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative px-3 py-2 text-[13px] font-medium text-foreground/75 hover:text-foreground rounded-md transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
                activeProps={{
                  className:
                    "text-[color:var(--orange)] after:absolute after:left-3 after:right-3 after:-bottom-[6px] after:h-[2px] after:rounded-full after:bg-[color:var(--orange)] after:content-['']",
                }}
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
                className="inline-flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-foreground/75 hover:text-foreground rounded-md transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
              >
                Mais
                <ChevronDown
                  className={`size-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              {moreOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-72 rounded-xl border border-border bg-background shadow-xl p-1.5 animate-fade-in z-50"
                >
                  {moreNav.map((m) => (
                    <Link
                      key={m.label}
                      to={m.to}
                      role="menuitem"
                      onClick={() => setMoreOpen(false)}
                      className="block px-3 py-2.5 rounded-lg hover:bg-muted focus-visible:outline-none focus-visible:bg-muted"
                      activeProps={{ className: "bg-muted" }}
                    >
                      <span className="block text-sm font-semibold text-foreground">{m.label}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">{m.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Cluster direito */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto xl:ml-0">
            <GlobalSearch />
            <span aria-hidden className="hidden sm:block h-7 w-px bg-border" />
            <Link
              to="/denuncia"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[color:var(--red-inst)] text-[color:var(--red-inst-foreground)] px-4 lg:px-5 py-2.5 text-[12px] lg:text-[13px] font-bold uppercase tracking-wider hover:opacity-95 hover:-translate-y-px transition-all shadow-md hover:shadow-lg whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--red-inst)]"
              aria-label="Ir para página de denúncia — Denunciar agora"
            >
              <Phone className="size-4" aria-hidden />
              Denunciar agora
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="xl:hidden inline-flex size-10 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
              aria-label={open ? "Fechar menu de navegação" : "Abrir menu de navegação"}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div
            id="mobile-nav"
            className="xl:hidden border-t border-border bg-background animate-fade-in"
          >
            <nav
              className="px-4 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto"
              aria-label="Navegação móvel"
            >
              {mobileNav.map((item) => (
                <Link
                  key={item.to + item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-md text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:bg-muted"
                  activeProps={{ className: "text-[color:var(--orange)] bg-muted" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/denuncia"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--red-inst)] text-[color:var(--red-inst-foreground)] px-4 py-3 font-bold uppercase tracking-wider text-sm shadow-md"
              >
                <Phone className="size-4" /> Denunciar agora
              </Link>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
