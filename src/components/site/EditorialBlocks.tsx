import { BookOpenCheck, FileText, Sparkles, ShieldCheck, Users, AlertTriangle } from "lucide-react";

const fmtLong = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

/* ─────────────────── Resumo executivo ─────────────────── */
export function SummaryCard({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <section
      aria-label="Resumo"
      className="mt-2 rounded-3xl border border-border bg-gradient-to-br from-[color:var(--orange-soft)] to-card p-6 sm:p-8"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)]">
          <FileText className="size-4" aria-hidden />
        </span>
        <h2 className="font-display text-lg font-bold text-[color:var(--navy-deep)]">
          Resumo
        </h2>
      </div>
      <p className="mt-3 text-base sm:text-lg leading-relaxed text-foreground/90 text-balance">
        {text}
      </p>
    </section>
  );
}

/* ─────────────────── Por que este tema importa ─────────────────── */
export function WhyMattersBlock({
  text,
  variant = "case",
}: {
  text?: string | null;
  variant?: "case" | "news";
}) {
  if (!text) return null;
  return (
    <section
      aria-label="Por que este tema importa"
      className="mt-12 rounded-3xl border border-[color:var(--navy-deep)]/15 bg-[color:var(--navy-deep)] text-white p-6 sm:p-8 overflow-hidden relative"
    >
      <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-[color:var(--orange)]/25 blur-3xl" />
      <div className="relative flex items-center gap-2">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)]">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <h2 className="font-display text-lg font-bold">
          Por que {variant === "news" ? "esta notícia" : "este tema"} importa
        </h2>
      </div>
      <p className="relative mt-3 text-base sm:text-lg leading-relaxed text-white/90 text-balance max-w-3xl">
        {text}
      </p>
    </section>
  );
}

/* ─────────────────── Rodapé editorial ─────────────────── */
interface EditorialFooterProps {
  verifiedAt?: string | null;
  updatedAt?: string | null;
  publishedAt?: string | null;
  reviewer?: string | null;
  author?: string | null;
}

export function EditorialFooter({ verifiedAt, updatedAt, publishedAt, reviewer, author }: EditorialFooterProps) {
  const fmt = (d?: string | null) => (d ? fmtLong.format(new Date(d)) : null);
  return (
    <section
      aria-label="Informações editoriais"
      className="mt-16 rounded-3xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="flex items-center gap-2">
        <BookOpenCheck className="size-5 text-[color:var(--orange)]" aria-hidden />
        <h2 className="font-display text-lg font-bold text-[color:var(--navy-deep)]">
          Informações editoriais
        </h2>
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        {publishedAt && (
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Publicado em</dt>
            <dd className="mt-1 font-semibold text-[color:var(--navy-deep)]">{fmt(publishedAt)}</dd>
          </div>
        )}
        {updatedAt && (
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Última atualização</dt>
            <dd className="mt-1 font-semibold text-[color:var(--navy-deep)]">{fmt(updatedAt)}</dd>
          </div>
        )}
        {verifiedAt && (
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground inline-flex items-center gap-1">
              <ShieldCheck className="size-3 text-[color:var(--orange)]" aria-hidden /> Última verificação
            </dt>
            <dd className="mt-1 font-semibold text-[color:var(--navy-deep)]">{fmt(verifiedAt)}</dd>
          </div>
        )}
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground inline-flex items-center gap-1">
            <Users className="size-3 text-[color:var(--orange)]" aria-hidden /> Equipe editorial
          </dt>
          <dd className="mt-1 text-foreground/85 leading-snug">
            {author && <span className="block">Redação: <strong className="text-[color:var(--navy-deep)]">{author}</strong></span>}
            {reviewer && <span className="block">Revisão: <strong className="text-[color:var(--navy-deep)]">{reviewer}</strong></span>}
            {!author && !reviewer && <span>Equipe Infância Protegida</span>}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex gap-3 rounded-2xl border border-[color:var(--orange)]/30 bg-[color:var(--orange-soft)]/50 p-4">
        <AlertTriangle className="size-4 mt-0.5 shrink-0 text-[color:var(--orange)]" aria-hidden />
        <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
          Este conteúdo tem <strong>finalidade educativa e informativa</strong>. Em situações
          de risco ou suspeita, procure imediatamente os canais oficiais de proteção e
          denúncia — <strong>Disque 100</strong> (24h, gratuito e anônimo) ou{" "}
          <strong>190</strong> em caso de emergência.
        </p>
      </div>
    </section>
  );
}
