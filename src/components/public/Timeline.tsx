import { CalendarDays, Calendar, FileText, RefreshCw, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const fmtFull = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
const fmtShort = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function safeFormat(input: string, short = false): string {
  if (/^\d{4}$/.test(input)) return input;
  if (/^\d{4}-\d{2}$/.test(input)) {
    const [y, m] = input.split("-");
    const d = new Date(Number(y), Number(m) - 1, 1);
    return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(d);
  }
  const d = new Date(input);
  if (isNaN(d.getTime())) return input;
  return (short ? fmtShort : fmtFull).format(d);
}

export type TimelineKind = "event" | "publish" | "update" | "verify" | "milestone";

export interface TimelineItem {
  date: string;
  text: string;
  title?: string;
  kind?: TimelineKind;
}

const KIND_STYLES: Record<TimelineKind, { label: string; icon: typeof Calendar; dot: string; ring: string; chip: string }> = {
  event:     { label: "Acontecimento",        icon: Calendar,    dot: "bg-[color:var(--red-inst)]",    ring: "ring-[color:var(--red-inst)]/30",    chip: "bg-[color:var(--red-inst)]/10 text-[color:var(--red-inst)]" },
  publish:   { label: "Publicação",          icon: FileText,    dot: "bg-[color:var(--orange)]",      ring: "ring-[color:var(--orange)]/30",      chip: "bg-[color:var(--orange)]/15 text-[color:var(--navy-deep)]" },
  update:    { label: "Atualização",         icon: RefreshCw,   dot: "bg-[color:var(--navy-deep)]",   ring: "ring-[color:var(--navy-deep)]/20",   chip: "bg-[color:var(--navy-deep)]/10 text-[color:var(--navy-deep)]" },
  verify:    { label: "Verificação editorial", icon: BadgeCheck,  dot: "bg-emerald-600",                ring: "ring-emerald-600/25",                chip: "bg-emerald-100 text-emerald-900" },
  milestone: { label: "Marco",                 icon: CalendarDays, dot: "bg-[color:var(--orange)]",      ring: "ring-[color:var(--orange)]/30",      chip: "bg-[color:var(--orange)]/15 text-[color:var(--navy-deep)]" },
};

function toTs(s: string): number {
  if (/^\d{4}$/.test(s)) return new Date(`${s}-01-01`).getTime();
  if (/^\d{4}-\d{2}$/.test(s)) return new Date(`${s}-01`).getTime();
  const t = new Date(s).getTime();
  return isNaN(t) ? 0 : t;
}

export function Timeline({
  items,
  heading = "Linha do tempo",
  meta,
}: {
  items: TimelineItem[];
  heading?: string;
  meta?: { publishAt?: string | null; updatedAt?: string | null; verifiedAt?: string | null };
}) {
  const merged = useMemo<TimelineItem[]>(() => {
    const base: TimelineItem[] = (items ?? []).map((it) => ({ ...it, kind: it.kind ?? "milestone" }));
    if (meta?.publishAt) base.push({ date: meta.publishAt, title: "Publicação original", text: "Conteúdo publicado no Infância Protegida.", kind: "publish" });
    if (meta?.updatedAt && meta.updatedAt !== meta?.publishAt) base.push({ date: meta.updatedAt, title: "Última atualização", text: "Revisão editorial mais recente do conteúdo.", kind: "update" });
    if (meta?.verifiedAt) base.push({ date: meta.verifiedAt, title: "Verificação editorial", text: "Fontes oficiais reconferidas pela equipe.", kind: "verify" });
    return base
      .filter((x) => toTs(x.date) > 0)
      .sort((a, b) => toTs(a.date) - toTs(b.date));
  }, [items, meta?.publishAt, meta?.updatedAt, meta?.verifiedAt]);

  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLOListElement | null>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = Number((visible.target as HTMLElement).dataset.idx);
          if (!Number.isNaN(idx)) setActive(idx);
        }
      },
      { root, threshold: [0.4, 0.7, 1], rootMargin: "0px -25% 0px -25%" }
    );
    cardRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [merged.length]);

  const scrollTo = (i: number) => {
    const el = cardRefs.current[i];
    if (el && scrollerRef.current) {
      scrollerRef.current.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
      setActive(i);
    }
  };

  if (!merged.length) return null;

  const progress = ((active + 1) / merged.length) * 100;

  return (
    <section
      aria-label={heading}
      className="mt-12 rounded-3xl border border-border bg-gradient-to-br from-card to-[color:var(--navy-deep)]/[0.03] p-6 sm:p-8 overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2 text-[color:var(--navy-deep)]">
            <CalendarDays className="size-5 text-[color:var(--orange)]" aria-hidden /> {heading}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Navegue pelos marcos cronológicos — clique em um ponto ou role horizontalmente.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Marco anterior"
            onClick={() => scrollTo(Math.max(0, active - 1))}
            disabled={active === 0}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background hover:bg-muted disabled:opacity-40 transition"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Próximo marco"
            onClick={() => scrollTo(Math.min(merged.length - 1, active + 1))}
            disabled={active === merged.length - 1}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background hover:bg-muted disabled:opacity-40 transition"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Progress rail */}
      <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-border/60">
        <div
          className="h-full bg-gradient-to-r from-[color:var(--orange)] to-[color:var(--red-inst)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span>{safeFormat(merged[0].date, true)}</span>
        <span>{active + 1} / {merged.length}</span>
        <span>{safeFormat(merged[merged.length - 1].date, true)}</span>
      </div>

      {/* Scroll-snap rail */}
      <ol
        ref={scrollerRef}
        className="mt-6 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2 scroll-smooth [scrollbar-width:thin]"
      >
        {merged.map((it, i) => {
          const k = KIND_STYLES[it.kind ?? "milestone"];
          const Icon = k.icon;
          const isActive = i === active;
          return (
            <li
              key={i}
              data-idx={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-[44%] lg:w-[34%]"
            >
              <button
                type="button"
                onClick={() => scrollTo(i)}
                aria-pressed={isActive}
                className={`group h-full w-full text-left rounded-2xl border p-5 transition-all duration-300 ${
                  isActive
                    ? `border-[color:var(--orange)] bg-background shadow-xl ring-4 ${k.ring} scale-[1.01]`
                    : "border-border bg-background/70 hover:bg-background hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`inline-flex size-8 items-center justify-center rounded-full text-white shadow-sm ${k.dot}`}>
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${k.chip}`}>
                    {k.label}
                  </span>
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--orange)]">
                  {safeFormat(it.date)}
                </p>
                {it.title && (
                  <p className="mt-1 font-display text-base font-bold leading-snug text-[color:var(--navy-deep)]">
                    {it.title}
                  </p>
                )}
                <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{it.text}</p>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Dot navigator */}
      <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
        {merged.map((it, i) => {
          const k = KIND_STYLES[it.kind ?? "milestone"];
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Ir para marco ${i + 1}: ${it.title ?? safeFormat(it.date)}`}
              className={`transition-all rounded-full ${
                isActive ? `w-8 h-2 ${k.dot}` : "w-2 h-2 bg-border hover:bg-muted-foreground/50"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
