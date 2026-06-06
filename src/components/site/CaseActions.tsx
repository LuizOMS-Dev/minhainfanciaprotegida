import { Link } from "@tanstack/react-router";
import { AlertTriangle, MapPin, Phone, BookOpen } from "lucide-react";

/**
 * Bloco de CTAs para páginas de detalhe (casos/notícias):
 * - Denúncia (Disque 100 + página de denúncia)
 * - Encaminhamento (mapa de ajuda e biblioteca)
 */
export function CaseActions() {
  return (
    <aside
      aria-label="Como agir diante deste caso"
      className="mt-12 rounded-2xl border-2 border-[color:var(--red-inst)]/30 bg-gradient-to-br from-[color:var(--red-inst)]/5 to-[color:var(--orange)]/5 p-6 sm:p-8"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--red-inst)] text-white">
          <AlertTriangle className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold leading-tight">Suspeita ou presenciou uma situação parecida?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A denúncia é anônima, gratuita e funciona 24 horas. Em situação de risco imediato, ligue 190.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href="tel:100"
          className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-[color:var(--red-inst)] transition"
        >
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[color:var(--red-inst)] text-white">
            <Phone className="size-4" aria-hidden />
          </span>
          <span>
            <span className="block text-xs uppercase tracking-wider text-muted-foreground">Disque 100</span>
            <span className="block font-semibold">Denuncie agora — 24h, anônimo</span>
          </span>
        </a>
        <Link
          to="/denuncia"
          className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-[color:var(--orange)] transition"
        >
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[color:var(--orange)] text-[color:var(--navy-deep)]">
            <AlertTriangle className="size-4" aria-hidden />
          </span>
          <span>
            <span className="block text-xs uppercase tracking-wider text-muted-foreground">Canais oficiais</span>
            <span className="block font-semibold">Como denunciar passo a passo</span>
          </span>
        </Link>
        <Link
          to="/mapa"
          className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-[color:var(--orange)] transition"
        >
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-gradient-orange text-[color:var(--navy-deep)]">
            <MapPin className="size-4" aria-hidden />
          </span>
          <span>
            <span className="block text-xs uppercase tracking-wider text-muted-foreground">Encaminhamento</span>
            <span className="block font-semibold">Conselho Tutelar / Delegacia perto de você</span>
          </span>
        </Link>
        <Link
          to="/biblioteca"
          className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-[color:var(--navy-deep)] transition"
        >
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[color:var(--navy-deep)] text-white">
            <BookOpen className="size-4" aria-hidden />
          </span>
          <span>
            <span className="block text-xs uppercase tracking-wider text-muted-foreground">Apoio e orientação</span>
            <span className="block font-semibold">Materiais para famílias e escolas</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
