import { Link } from "@tanstack/react-router";
import { Menu, Phone, ShieldAlert, X } from "lucide-react";
import { useEffect, useState } from "react";

const nav = [
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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Página inicial">
            <span className="relative inline-flex size-9 items-center justify-center rounded-full bg-gradient-orange shadow-orange">
              <span className="absolute inset-0 rounded-full bg-[color:var(--orange)]/40 animate-ping-slow" />
              <ShieldAlert className="size-4 text-[color:var(--navy-deep)]" aria-hidden />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base sm:text-lg font-semibold tracking-tight">
                Infância Protegida
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Campanha Maio Laranja
              </span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5" aria-label="Navegação principal">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-2.5 py-2 text-[13px] font-medium text-foreground/75 hover:text-foreground rounded-md hover:bg-muted transition-colors whitespace-nowrap"
                activeProps={{ className: "text-[color:var(--orange)] bg-muted/60" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/denuncia"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[color:var(--red-inst)] text-[color:var(--red-inst-foreground)] px-4 py-2 text-sm font-semibold hover:opacity-95 transition shadow-sm whitespace-nowrap"
            >
              <Phone className="size-4" aria-hidden />
              Denunciar
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="xl:hidden inline-flex size-10 items-center justify-center rounded-md hover:bg-muted"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="xl:hidden border-t border-border bg-background animate-fade-in">
            <nav className="px-4 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto" aria-label="Navegação móvel">
              {nav.map((item) => (
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
