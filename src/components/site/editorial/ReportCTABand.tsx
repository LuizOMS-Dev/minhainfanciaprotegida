import { Link } from "@tanstack/react-router";
import { Phone, AlertCircle, MapPin, ArrowRight } from "lucide-react";

export function ReportCTABand() {
  return (
    <aside
      aria-label="Como denunciar"
      className="my-12 rounded-3xl border border-[color:var(--orange)]/40 bg-gradient-to-br from-[color:var(--orange-soft)] to-card p-6 sm:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--navy-deep)] text-[color:var(--orange)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em]">
            Bloco essencial
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-[color:var(--navy-deep)] leading-tight">
            Suspeita de violência contra uma criança?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-foreground/80 leading-relaxed max-w-xl">
            Em <strong>risco imediato, ligue 190</strong>. Para denúncia, o{" "}
            <strong>Disque 100</strong> é gratuito, anônimo e funciona 24 horas, todos os dias.
          </p>
          <Link
            to="/denuncia"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[color:var(--red-inst)] hover:underline"
          >
            Ver guia completo de denúncia
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-3">
          <a
            href="tel:100"
            className="flex items-center gap-3 rounded-2xl bg-[color:var(--orange)] text-[color:var(--navy-deep)] p-4 shadow-sm hover:brightness-95 transition"
          >
            <Phone className="size-6 shrink-0" aria-hidden />
            <div>
              <p className="font-display font-bold leading-tight">Disque 100</p>
              <p className="text-xs leading-snug">Denúncia 24h, gratuita e anônima</p>
            </div>
          </a>
          <a
            href="tel:190"
            className="flex items-center gap-3 rounded-2xl bg-[color:var(--red-inst)] text-white p-4 shadow-sm hover:brightness-110 transition"
          >
            <AlertCircle className="size-6 shrink-0" aria-hidden />
            <div>
              <p className="font-display font-bold leading-tight">Emergência 190</p>
              <p className="text-xs leading-snug text-white/90">Risco imediato — Polícia Militar</p>
            </div>
          </a>
          <Link
            to="/mapa"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-[color:var(--navy-deep)]/40 transition"
          >
            <MapPin className="size-6 shrink-0 text-[color:var(--navy-deep)]" aria-hidden />
            <div>
              <p className="font-display font-bold text-[color:var(--navy-deep)] leading-tight">
                Conselho Tutelar
              </p>
              <p className="text-xs text-muted-foreground leading-snug">Encontre a unidade mais próxima</p>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}
