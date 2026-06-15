import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronDown,
  FlaskConical,
  HelpCircle,
  Info,
  MapPin,
  Menu,
  MessageCircleHeart,
  Phone,
  Ribbon,
  ShieldAlert,
  Target,
  X,
  type LucideIcon,
} from "lucide-react";
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

type MoreItem = { to: string; label: string; desc: string; icon: LucideIcon };

const moreNav: readonly MoreItem[] = [
  {
    to: "/assistente",
    label: "Assistente IA",
    desc: "Tire dúvidas com nosso assistente (não-oficial)",
    icon: MessageCircleHeart,
  },
  { to: "/maio-laranja", label: "Maio Laranja", desc: "Sobre a campanha 18 de maio", icon: Ribbon },
  {
    to: "/mapa",
    label: "Mapa de Ajuda",
    desc: "Conselhos, delegacias e centros de apoio",
    icon: MapPin,
  },
  {
    to: "/faq",
    label: "Perguntas Frequentes",
    desc: "Dúvidas comuns sobre denúncia e proteção",
    icon: HelpCircle,
  },
  { to: "/sobre", label: "Sobre o Projeto", desc: "Quem somos e por que existimos", icon: Info },
  { to: "/objetivos", label: "Objetivos", desc: "Missão e metas da campanha", icon: Target },
  {
    to: "/metodologia",
    label: "Metodologia",
    desc: "Como produzimos o conteúdo",
    icon: FlaskConical,
  },
  {
    to: "/fontes",
    label: "Fontes Utilizadas",
    desc: "Referências oficiais consultadas",
    icon: BookOpen,
  },
];

const mobileNav = [...primaryNav, ...moreNav.map((m) => ({ to: m.to, label: m.label }))] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);

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

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}
    >
      {/* Faixa de emergência — gradiente vermelho com pill Disque 100 */}
      <div
        className="w-full text-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #8a1220 0%, #b81830 35%, #d92240 65%, #8a1220 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs tracking-wide">
          <ShieldAlert className="size-3.5 text-white/90 shrink-0" aria-hidden />
          <span className="font-bold uppercase tracking-[0.18em]">Denuncie agora</span>
          <span className="text-white/55" aria-hidden>
            •
          </span>
          <a
            href="tel:100"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-white/10 px-2.5 py-0.5 font-semibold hover:bg-white/20 transition-colors"
            aria-label="Ligar para Disque 100"
          >
            <Phone className="size-3" aria-hidden />
            Disque 100
          </a>
          <span className="hidden sm:inline text-white/85 font-normal">
            24h, gratuito e anônimo
          </span>
        </div>
      </div>

      {/* Header principal — duas linhas */}
      <div
        className={`border-b border-border/60 bg-background/95 backdrop-blur-xl transition-colors ${
          scrolled ? "bg-background/90" : ""
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Linha 1 — Marca + ações */}
          <div className="flex items-center justify-between h-14 lg:h-[58px] gap-4">
            {/* Marca (logo oficial: escudo laranja) */}
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0"
              aria-label="Página inicial"
            >
              <span className="relative inline-flex size-9 items-center justify-center rounded-full bg-gradient-orange shadow-orange shrink-0 transition-transform group-hover:scale-105">
                <span className="absolute inset-0 rounded-full bg-[color:var(--orange)]/40 animate-ping-slow" />
                <ShieldAlert className="size-4 text-[color:var(--navy-deep)]" aria-hidden />
              </span>
              <span className="flex flex-col leading-tight min-w-0">
                <span className="font-display text-[14px] sm:text-[15px] font-semibold tracking-tight text-foreground truncate">
                  Infância Protegida
                </span>
                <span className="hidden sm:block text-[9px] font-bold uppercase tracking-[0.22em] text-[color:var(--orange)]/90 truncate">
                  Campanha Maio Laranja
                </span>
              </span>
            </Link>

            {/* Ações desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-[220px]">
                <GlobalSearch />
              </div>

              <Link
                to="/denuncia"
                className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--red-inst)] text-[color:var(--red-inst-foreground)] px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider hover:bg-[color:var(--red-inst)]/90 transition-all shadow-sm hover:shadow-md active:translate-y-px whitespace-nowrap"
              >
                <Phone className="size-3.5" aria-hidden />
                Denuncie Agora
              </Link>
            </div>

            {/* Mobile: busca + denuncie + menu */}
            <div className="flex lg:hidden items-center gap-1">
              <GlobalSearch />
              <Link
                to="/denuncia"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--red-inst)] text-[color:var(--red-inst-foreground)] px-3 py-2 text-[11px] font-bold uppercase tracking-wider shadow-sm"
                aria-label="Denunciar agora"
              >
                <Phone className="size-3.5" aria-hidden />
                Denunciar
              </Link>
              <button
                onClick={() => setOpen((v) => !v)}
                className="inline-flex size-11 min-h-11 min-w-11 items-center justify-center rounded-md text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                aria-expanded={open}
                aria-controls="mobile-nav"
              >
                {open ? (
                  <X className="size-5" aria-hidden />
                ) : (
                  <Menu className="size-5" aria-hidden />
                )}
              </button>
            </div>
          </div>

          {/* Linha 2 — Navegação principal (desktop) */}
          <nav
            className="hidden lg:flex items-center justify-center border-t border-border/60 py-2"
            aria-label="Navegação principal"
          >
            <ul className="flex items-center gap-1 xl:gap-2">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="relative inline-block px-2.5 py-1.5 text-[11px] xl:text-[12px] font-bold uppercase tracking-[0.14em] text-foreground/65 hover:text-foreground transition-colors whitespace-nowrap after:absolute after:inset-x-2.5 after:-bottom-2.5 after:h-[2px] after:bg-[color:var(--orange)] after:scale-x-0 after:origin-center after:transition-transform hover:after:scale-x-100"
                    activeProps={{
                      className: "text-[color:var(--orange)] after:scale-x-100",
                    }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="relative ml-1" ref={moreRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={moreOpen}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] xl:text-[12px] font-bold uppercase tracking-[0.14em] text-foreground/65 hover:text-foreground transition-colors"
                >
                  Mais
                  <ChevronDown
                    className={`size-3 transition-transform ${moreOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {moreOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-3 w-[340px] rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/10 overflow-hidden animate-fade-in z-50"
                  >
                    <div className="px-4 py-3 border-b border-border bg-gradient-to-br from-[color:var(--orange-soft)] to-transparent">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--orange)]">
                        Explorar
                      </p>
                      <p className="text-sm font-medium text-foreground/80 mt-0.5">
                        Mais sobre o projeto
                      </p>
                    </div>
                    <div className="p-2 max-h-[70vh] overflow-y-auto">
                      {moreNav.map((m) => {
                        const Icon = m.icon;
                        return (
                          <Link
                            key={m.to}
                            to={m.to}
                            role="menuitem"
                            onClick={() => setMoreOpen(false)}
                            className="group flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors"
                            activeProps={{ className: "bg-muted" }}
                          >
                            <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-lg bg-[color:var(--orange-soft)] text-[color:var(--orange)] group-hover:bg-gradient-orange group-hover:text-[color:var(--navy-deep)] transition-colors shrink-0">
                              <Icon className="size-4" aria-hidden />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-semibold text-foreground">
                                {m.label}
                              </span>
                              <span className="block text-xs text-muted-foreground leading-snug mt-0.5">
                                {m.desc}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div
          id="mobile-nav"
          className="lg:hidden border-t border-border bg-background animate-fade-in"
        >
          <nav
            className="px-4 py-4 flex flex-col gap-1 max-h-[calc(100dvh-8rem)] overflow-y-auto"
            aria-label="Navegação móvel"
          >
            {mobileNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 min-h-11 rounded-md text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
                activeProps={{ className: "text-[color:var(--orange)] bg-muted" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/denuncia"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--red-inst)] text-[color:var(--red-inst-foreground)] px-4 py-3 min-h-11 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
            >
              <Phone className="size-4" aria-hidden /> Denunciar agora
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
