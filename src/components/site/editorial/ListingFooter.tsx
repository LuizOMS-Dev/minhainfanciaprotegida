import { Link } from "@tanstack/react-router";
import { ShieldCheck, BookOpenCheck, ArrowRight } from "lucide-react";

interface Props {
  kind: "news" | "case";
}

export function ListingFooter({ kind }: Props) {
  const isNews = kind === "news";
  return (
    <section
      aria-label="Sobre esta editoria"
      className="mt-20 border-t border-border bg-card"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--orange)]">
              Sobre esta editoria
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-[color:var(--navy-deep)] leading-tight">
              {isNews
                ? "Notícias verificadas, sem sensacionalismo"
                : "Casos reais, com aprendizado e proteção"}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {isNews
                ? "Cada notícia passa por revisão editorial e é vinculada a fontes oficiais. Atualizamos quando há novos dados verificáveis."
                : "Casos publicados aqui são reais e verificáveis. Vítimas nunca são identificadas. O objetivo é educativo: aprender com situações para fortalecer prevenção e proteção."}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-5">
            <ShieldCheck className="size-6 text-[color:var(--orange)]" aria-hidden />
            <h3 className="mt-3 font-display font-bold text-[color:var(--navy-deep)]">
              Critérios editoriais
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Verificação de fontes, marcação de gravidade, data de última verificação e revisão por
              equipe responsável.
            </p>
            <Link
              to="/metodologia"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[color:var(--red-inst)] hover:underline"
            >
              Nossa metodologia <ArrowRight className="size-3" aria-hidden />
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-background p-5">
            <BookOpenCheck className="size-6 text-[color:var(--orange)]" aria-hidden />
            <h3 className="mt-3 font-display font-bold text-[color:var(--navy-deep)]">
              Fontes oficiais
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Trabalhamos com órgãos públicos, leis brasileiras e dados de pesquisas reconhecidas.
            </p>
            <Link
              to="/fontes"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[color:var(--red-inst)] hover:underline"
            >
              Ver fontes utilizadas <ArrowRight className="size-3" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
