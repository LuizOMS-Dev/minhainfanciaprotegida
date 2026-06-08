import { Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, User, ShieldCheck, Clock, CalendarDays, CalendarCheck2, BadgeCheck } from "lucide-react";
import { ShareButtons } from "@/components/site/ShareButtons";
import { SeverityBadge, ConfidenceBadge } from "@/components/site/ArticleBlocks";

const fmtLong = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
const fmtShort = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function safe(d?: string | null) {
  if (!d) return null;
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}

export interface ArticleHeroProps {
  variant: "news" | "case";
  backLabel: string;
  backTo: "/noticias" | "/casos";
  category?: string | null;
  title: string;
  subtitle?: string | null;
  coverUrl?: string | null;
  authorName?: string | null;
  reviewerName?: string | null;
  publishAt?: string | null;
  updatedAt?: string | null;
  verifiedAt?: string | null;
  eventDate?: string | null;
  readingMinutes?: number | null;
  severityLevel?: string | null;
  sourceConfidence?: string | null;
  shareUrl: string;
  shareDescription?: string | null;
}

export function ArticleHero(props: ArticleHeroProps) {
  const isNews = props.variant === "news";
  const cover = props.coverUrl ?? null;
  const overlay = isNews
    ? "linear-gradient(180deg, rgba(11,20,45,0.55) 0%, rgba(11,20,45,0.78) 55%, rgba(11,20,45,0.96) 100%)"
    : "linear-gradient(180deg, rgba(11,20,45,0.65) 0%, rgba(11,20,45,0.85) 55%, rgba(11,20,45,0.97) 100%)";

  return (
    <header className="relative isolate overflow-hidden text-white">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: cover
            ? `${overlay}, url(${cover})`
            : `${overlay}, linear-gradient(135deg, var(--navy-deep), var(--navy))`,
        }}
      />
      {/* subtle orange accent */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 -z-10 size-[28rem] rounded-full bg-[color:var(--orange)]/25 blur-3xl"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-14 sm:pb-20">
        <Link
          to={props.backTo}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden /> {props.backLabel}
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
            {isNews ? "Notícia" : "Caso real"}
          </span>
          {props.category && (
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
              {props.category}
            </span>
          )}
          {props.severityLevel && <SeverityBadge level={props.severityLevel} />}
          {props.sourceConfidence && <ConfidenceBadge level={props.sourceConfidence} />}
        </div>

        <h1 className="mt-5 font-display text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-balance max-w-4xl">
          {props.title}
        </h1>

        {props.subtitle && (
          <p className="mt-5 text-lg sm:text-xl text-white/85 leading-relaxed max-w-3xl text-balance">
            {props.subtitle}
          </p>
        )}

        <dl className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/85">
          {props.authorName && (
            <div className="inline-flex items-center gap-1.5">
              <User className="size-4 text-[color:var(--orange)]" aria-hidden /> {props.authorName}
            </div>
          )}
          {props.reviewerName && (
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-[color:var(--orange)]" aria-hidden /> Revisão: {props.reviewerName}
            </div>
          )}
          {props.readingMinutes && (
            <div className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-[color:var(--orange)]" aria-hidden /> {props.readingMinutes} min de leitura
            </div>
          )}
        </dl>

        <div className="mt-8">
          <DatesStrip
            eventDate={props.eventDate}
            publishAt={props.publishAt}
            updatedAt={props.updatedAt}
            verifiedAt={props.verifiedAt}
          />
        </div>

        <div className="mt-8">
          <ShareButtons
            title={props.title}
            url={props.shareUrl}
            description={props.shareDescription ?? undefined}
          />
        </div>
      </div>
    </header>
  );
}

/* ─────────────────── Faixa cronológica de datas ─────────────────── */

interface DateChipProps {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  date: Date;
  iso: string;
  accent?: boolean;
}

function DateChip({ icon: Icon, label, date, iso, accent }: DateChipProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 backdrop-blur transition ${
        accent
          ? "border-[color:var(--orange)]/60 bg-[color:var(--orange)]/15"
          : "border-white/15 bg-white/5"
      }`}
    >
      <span
        className={`mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full ${
          accent ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)]" : "bg-white/10 text-[color:var(--orange)]"
        }`}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">{label}</p>
        <time dateTime={iso} className="mt-1 block font-display text-sm font-semibold leading-tight text-white">
          {fmtShort.format(date)}
        </time>
        <p className="mt-0.5 text-[11px] text-white/60">{fmtLong.format(date)}</p>
      </div>
    </div>
  );
}

export function DatesStrip({
  eventDate,
  publishAt,
  updatedAt,
  verifiedAt,
}: {
  eventDate?: string | null;
  publishAt?: string | null;
  updatedAt?: string | null;
  verifiedAt?: string | null;
}) {
  const ev = safe(eventDate);
  const pub = safe(publishAt);
  const upd = safe(updatedAt);
  const ver = safe(verifiedAt);

  const chips: React.ReactNode[] = [];
  if (ev) chips.push(<DateChip key="ev" icon={CalendarDays} label="Acontecimento" date={ev} iso={eventDate!} />);
  if (pub) chips.push(<DateChip key="pub" icon={Calendar} label="Publicação" date={pub} iso={publishAt!} accent />);
  if (upd && (!pub || upd.getTime() !== pub.getTime()))
    chips.push(<DateChip key="upd" icon={CalendarCheck2} label="Atualização" date={upd} iso={updatedAt!} />);
  if (ver) chips.push(<DateChip key="ver" icon={BadgeCheck} label="Verificação" date={ver} iso={verifiedAt!} />);

  if (chips.length === 0) return null;

  return (
    <section aria-label="Linha cronológica" className="rounded-3xl border border-white/15 bg-white/5 p-4 sm:p-5 backdrop-blur">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{chips}</div>
    </section>
  );
}
