import { Link } from "@tanstack/react-router";
import { Phone, BadgeCheck, CalendarDays, BookOpen } from "lucide-react";

interface CaseSidebarProps {
  publishAt?: string | null;
  updatedAt?: string | null;
  verifiedAt?: string | null;
  eventDate?: string | null;
  timeline?: { date: string; text: string; title?: string }[] | null;
  primarySource?: { label: string; url: string } | null;
  reviewerName?: string | null;
}

const fmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function safe(s?: string | null) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Coluna lateral sticky para o detalhe do caso (≥lg).
 * Mini-timeline, datas-chave, fonte primária e CTA de denúncia.
 */
export function CaseSidebar({
  publishAt,
  updatedAt,
  verifiedAt,
  eventDate,
  timeline,
  primarySource,
  reviewerName,
}: CaseSidebarProps) {
  const dates: { label: string; date: Date; iso: string }[] = [];
  const ev = safe(eventDate);
  const pub = safe(publishAt);
  const upd = safe(updatedAt);
  const ver = safe(verifiedAt);
  if (ev) dates.push({ label: "Acontecimento", date: ev, iso: eventDate! });
  if (pub) dates.push({ label: "Publicação", date: pub, iso: publishAt! });
  if (upd && (!pub || upd.getTime() !== pub.getTime()))
    dates.push({ label: "Atualização", date: upd, iso: updatedAt! });
  if (ver) dates.push({ label: "Verificação", date: ver, iso: verifiedAt! });

  const miniTimeline = (timeline ?? [])
    .map((t) => ({ ...t, d: new Date(t.date) }))
    .filter((t) => !isNaN(t.d.getTime()))
    .sort((a, b) => a.d.getTime() - b.d.getTime())
    .slice(0, 5);

  return (
    <aside className="hidden lg:block lg:sticky lg:top-[140px] space-y-5 self-start">
      <a
        href="tel:100"
        className="flex items-center gap-3 rounded-2xl bg-[color:var(--red-inst)] p-4 text-white shadow-lg hover:brightness-110 transition"
      >
        <Phone className="size-5 shrink-0" aria-hidden />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90">Denúncia 24h</p>
          <p className="font-display text-lg font-bold leading-tight">Ligar Disque 100</p>
        </div>
      </a>

      {dates.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--navy-deep)]/70">
            <CalendarDays className="size-3.5 text-[color:var(--orange)]" aria-hidden />
            Datas-chave
          </div>
          <ul className="mt-3 space-y-2">
            {dates.map((d) => (
              <li key={d.label} className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-semibold text-[color:var(--navy-deep)]">{d.label}</span>
                <time dateTime={d.iso} className="text-muted-foreground">
                  {fmt.format(d.date)}
                </time>
              </li>
            ))}
          </ul>
        </div>
      )}

      {miniTimeline.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--navy-deep)]/70">
            <BookOpen className="size-3.5 text-[color:var(--orange)]" aria-hidden />
            Cronologia
          </div>
          <ol className="mt-3 relative space-y-3 border-l border-border pl-4">
            {miniTimeline.map((t, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[18px] top-1 inline-flex size-2.5 rounded-full bg-[color:var(--orange)] ring-2 ring-white" aria-hidden />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--navy-deep)]/70">
                  {fmt.format(t.d)}
                </p>
                <p className="text-sm text-foreground/80 leading-snug">
                  {t.title ? <strong className="text-[color:var(--navy-deep)]">{t.title}: </strong> : null}
                  {t.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {(primarySource || reviewerName) && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--navy-deep)]/70">
            <BadgeCheck className="size-3.5 text-[color:var(--orange)]" aria-hidden />
            Verificação
          </div>
          {primarySource && (
            <p className="mt-3 text-sm text-foreground/90">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[color:var(--navy-deep)]/70">
                Fonte primária
              </span>
              <a
                href={primarySource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[color:var(--navy-deep)] underline decoration-[color:var(--orange)] underline-offset-4 hover:text-[color:var(--red-inst)]"
              >
                {primarySource.label}
              </a>
            </p>
          )}
          {reviewerName && (
            <p className="mt-3 text-xs text-muted-foreground">
              Revisado por <strong className="text-[color:var(--navy-deep)]">{reviewerName}</strong>
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
