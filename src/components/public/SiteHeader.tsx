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
import { GlobalSearch } from "@/components/shared/GlobalSearch";

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
  { to: "/assistente", label: "Assistente IA", desc: "Tire dúvidas com nosso assistente (não-oficial)", icon: MessageCircleHeart },
  { to: "/maio-laranja", label: "Maio Laranja", desc: "Sobre a campanha 18 de maio", icon: Ribbon },
  { to: "/mapa", label: "Mapa de Ajuda", desc: "Conselhos, delegacias e centros de apoio", icon: MapPin },
  { to: "/faq", label: "Perguntas Frequentes", desc: "Dúvidas comuns sobre denúncia e proteção", icon: HelpCircle },
  { to: "/sobre", label: "Sobre o Projeto", desc: "Quem somos e por que existimos", icon: Info },
  { to: "/objetivos", label: "Objetivos", desc: "Missão e metas da campanha", icon: Target },
  { to: "/metodologia", label: "Metodologia", desc: "Como produzimos o conteúdo", icon: FlaskConical },
  { to: "/fontes", label: "Fontes Utilizadas", desc: "Referências oficiais consultadas", icon: BookOpen },
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
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)]" : ""
      }`}
    >
      {/* Faixa de emergência */}
      <div
        className="strip-shine animate-strip-flow w-full text-white"
        style={{
          backgroundImage:
            "linear-gradient(100deg, #7a0e1c 0%, #b81830 30%, #f0435e 50%, #b81830 70%, #7a0e1c 100%)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-[11px] tracking-wide sm:gap-2.5 sm:px-6 sm:text-xs lg:px-8">
          <span className="animate-dot-blink inline-flex size-1.5 shrink-0 rounded-full bg-white shadow-[0_0_8px_2px_rgb(255_255_255/0.7)]" />
          <span className="font-extrabold uppercase tracking-[0.22em]">
            Denuncie agora
          </span>
          <a
            href="tel:100"
            className="animate-cta-pulse inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-bold text-[#a11226] transition-all hover:bg-white/90 hover:shadow active:scale-95"
            aria-label="Ligar para Disque 100"
          >
            <Phone className="animate-bell size-3" aria-hidden />
            Disque 100
          </a>
          <span className="hidden font-medium text-white/80 md:inline">
            24h · gratuito e anônimo
          </span>
        </div>
      </div>

      {/* Barra principal — linha única */}
      <div
        className={`border-b border-border/50 bg-background/95 backdrop-blur-xl transition-all ${
          scrolled ? "bg-background/98" : ""
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1500px] items-center gap-4 px-4 transition-all sm:px-6 lg:px-8 ${
            scrolled ? "h-16 lg:h-[72px]" : "h-[76px] lg:h-[84px]"
          }`}
        >
          {/* Marca */}
          <Link
            to="/"
            className="group flex min-w-0 shrink-0 items-center gap-3"
            aria-label="Página inicial"
          >
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff9a3d] to-[#ef5b0c] shadow-[0_8px_20px_-8px_rgb(242_98_15/0.65)] ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <ShieldAlert className="size-6 text-white" strokeWidth={2.25} aria-hidden />
            </span>
            <span className="hidden min-w-0 flex-col leading-none min-[400px]:flex">
              <span className="truncate font-display text-[21px] font-semibold tracking-tight text-foreground antialiased">
                Infância Protegida
              </span>
              <span className="mt-1.5 text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#ef5b0c]">
                Maio Laranja
              </span>
            </span>
          </Link>

          {/* Navegação inline (desktop largo) */}
          <nav
            className="hidden min-w-0 flex-1 items-center justify-center xl:flex"
            aria-label="Navegação principal"
          >
            <ul className="flex items-center">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group relative inline-block whitespace-nowrap px-2.5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-foreground/60 transition-all duration-300 ease-out hover:-translate-y-[1px] hover:text-foreground 2xl:text-[12px] after:absolute after:inset-x-2.5 after:bottom-1.5 after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-[#ff9a3d] after:via-[#f2620f] after:to-[#d92240] after:opacity-0 after:scale-x-[0.3] after:origin-center after:transition-all after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:opacity-100 hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] focus-visible:rounded-md"
                    activeProps={{
                      className:
                        "text-foreground after:opacity-100 after:scale-x-100",
                    }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="relative" ref={moreRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={moreOpen}
                  className={`relative inline-flex items-center gap-1 whitespace-nowrap px-2.5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 ease-out hover:-translate-y-[1px] 2xl:text-[12px] after:absolute after:inset-x-2.5 after:bottom-1.5 after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-[#ff9a3d] after:via-[#f2620f] after:to-[#d92240] after:transition-all after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    moreOpen
                      ? "text-foreground after:opacity-100 after:scale-x-100 after:origin-center"
                      : "text-foreground/60 hover:text-foreground after:opacity-0 after:scale-x-[0.3] after:origin-center hover:after:opacity-100 hover:after:scale-x-100"
                  }`}
                >
                  Mais
                  <ChevronDown
                    className={`size-3 transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {moreOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 z-50 mt-2 w-[360px] overflow-hidden rounded-2xl border border-border/70 bg-background shadow-2xl shadow-black/15 animate-fade-in"
                  >
                    <div className="border-b border-border/60 bg-gradient-to-br from-[#fff3e8] to-transparent px-5 py-4 dark:from-white/5">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#f2620f]">
                        Explorar
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold text-foreground">
                        Mais sobre o projeto
                      </p>
                    </div>
                    <div className="max-h-[65vh] overflow-y-auto p-2.5">
                      {moreNav.map((m) => {
                        const Icon = m.icon;
                        return (
                          <Link
                            key={m.to}
                            to={m.to}
                            role="menuitem"
                            onClick={() => setMoreOpen(false)}
                            className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted/70"
                            activeProps={{ className: "bg-muted/70" }}
                          >
                            <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e2] text-[#f2620f] transition-all group-hover:bg-gradient-to-br group-hover:from-[#ff9a3d] group-hover:to-[#f2620f] group-hover:text-white dark:bg-white/10">
                              <Icon className="size-[18px]" aria-hidden />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold text-foreground">
                                {m.label}
                              </span>
                              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
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

          {/* Ações desktop */}
          <div className="hidden shrink-0 items-center gap-1.5 xl:flex">
            <GlobalSearch compact />
            <span className="mx-1 h-6 w-px bg-border/50" aria-hidden />
            <Link
              to="/denuncia"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-b from-[#d92240] to-[#a11226] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-[0_8px_20px_-8px_rgb(217_34_64/0.7)] transition-all hover:shadow-[0_10px_24px_-8px_rgb(217_34_64/0.8)] hover:brightness-110 active:translate-y-px 2xl:px-5 2xl:text-[12px]"
            >
              <Phone className="size-3.5" aria-hidden />
              Denuncie Agora
            </Link>
          </div>

          {/* Mobile / tablet */}
          <div className="ml-auto flex items-center gap-1.5 xl:hidden">
            <GlobalSearch />
            <Link
              to="/denuncia"
              className="hidden items-center gap-1.5 rounded-full bg-gradient-to-b from-[#d92240] to-[#a11226] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm sm:inline-flex"
              aria-label="Denunciar agora"
            >
              <Phone className="size-3.5" aria-hidden />
              Denunciar
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-11 min-h-11 min-w-11 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div id="mobile-nav" className="border-t border-border/60 bg-background xl:hidden animate-fade-in">
          <nav
            className="flex max-h-[calc(100dvh-9rem)] flex-col gap-0.5 overflow-y-auto px-4 py-4"
            aria-label="Navegação móvel"
          >
            {mobileNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-xl px-4 py-3 text-[15px] font-semibold text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
                activeProps={{ className: "bg-[#fff0e2] text-[#c24a0e] dark:bg-white/10 dark:text-[color:var(--orange)]" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/denuncia"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#d92240] to-[#a11226] px-4 py-3 font-extrabold uppercase tracking-wider text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
            >
              <Phone className="size-4" aria-hidden /> Denunciar agora
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
