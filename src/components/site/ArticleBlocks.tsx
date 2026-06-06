import { Info, Lightbulb, BookOpenCheck, ListChecks, ShieldAlert, Phone, MapPin, ArrowRight, GraduationCap, Home as HomeIcon, Wifi, Library, AlertCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SafeHtml } from "@/components/site/SafeHtml";
import type { LawItem } from "@/content/laws";
import type { NationalContextItem } from "@/content/nationalContext";
import type { RiskItem } from "@/content/risks";
import type { LibraryItem } from "@/content/library";

/* ─────────────────── Bloco "Entenda o assunto" ─────────────────── */

export function UnderstandBlock({ html }: { html: string | null | undefined }) {
  if (!html) return null;
  return (
    <section
      aria-label="Entenda o assunto"
      className="mt-12 rounded-3xl border border-[color:var(--orange)]/30 bg-[color:var(--orange-soft)]/40 p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl font-bold flex items-center gap-2 text-[color:var(--navy-deep)]">
        <Info className="size-5 text-[color:var(--orange)]" aria-hidden />
        Entenda o assunto
      </h2>
      <SafeHtml
        html={html}
        className="mt-3 prose prose-neutral max-w-none text-foreground/90 leading-relaxed"
      />
    </section>
  );
}

/* ─────────────────── Bloco "O que aprendemos" (casos) ─────────────────── */

export function LessonsBlock({ html }: { html: string | null | undefined }) {
  if (!html) return null;
  return (
    <section
      aria-label="O que aprendemos com este caso"
      className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl font-bold flex items-center gap-2 text-[color:var(--navy-deep)]">
        <Lightbulb className="size-5 text-[color:var(--orange)]" aria-hidden />
        O que aprendemos com este caso
      </h2>
      <SafeHtml
        html={html}
        className="mt-3 prose prose-neutral max-w-none text-foreground/90 leading-relaxed"
      />
    </section>
  );
}

/* ─────────────────── Contexto nacional ─────────────────── */

export function NationalContextChips({ items }: { items: NationalContextItem[] }) {
  if (!items.length) return null;
  return (
    <section aria-label="Contexto nacional" className="mt-10">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Contexto nacional
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((c) => (
          <Link
            key={c.key}
            to={c.href as "/maio-laranja"}
            className="group inline-flex items-center gap-1.5 rounded-full bg-[color:var(--navy-deep)] text-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-[color:var(--red-inst)] transition-colors"
          >
            {c.label}
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────── Legislação aplicável ─────────────────── */

export function LegislationBlock({ items }: { items: LawItem[] }) {
  if (!items.length) return null;
  return (
    <section
      aria-label="O que diz a legislação"
      className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl font-bold flex items-center gap-2 text-[color:var(--navy-deep)]">
        <BookOpenCheck className="size-5 text-[color:var(--orange)]" aria-hidden />
        O que diz a legislação
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Marcos legais brasileiros que se aplicam diretamente a este tema.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((l) => (
          <li
            key={l.slug}
            className="rounded-2xl border border-border bg-background p-4 hover-lift"
          >
            <span className="inline-flex items-center rounded-full bg-[color:var(--orange)]/15 text-[color:var(--navy-deep)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {l.category}
            </span>
            <h3 className="mt-2 font-display text-sm font-semibold leading-snug text-[color:var(--navy-deep)]">
              {l.label}
            </h3>
            <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed">
              {l.summary}
            </p>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--red-inst)] hover:underline"
            >
              Ler texto oficial <ArrowRight className="size-3" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─────────────────── Sinais relacionados ─────────────────── */

export function SignalsBlock({ items }: { items: RiskItem[] }) {
  if (!items.length) return null;
  return (
    <section
      aria-label="Sinais que podem indicar este tipo de violência"
      className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl font-bold flex items-center gap-2 text-[color:var(--navy-deep)]">
        <ListChecks className="size-5 text-[color:var(--orange)]" aria-hidden />
        Como identificar sinais
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Sinais e situações associadas a este tema. Saiba mais em{" "}
        <Link to="/sinais" className="font-semibold text-[color:var(--red-inst)] hover:underline">
          /sinais
        </Link>.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.slug} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-[color:var(--orange)]" aria-hidden />
                <h3 className="font-display text-sm font-semibold text-[color:var(--navy-deep)]">
                  {r.title}
                </h3>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-foreground/80">
                {r.signs.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--orange)]" />
                    <span className="leading-snug">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────── Como denunciar ─────────────────── */

export function ReportChannels() {
  const items = [
    { label: "Disque 100", desc: "Denúncia anônima 24h", href: "tel:100", icon: Phone, primary: true },
    { label: "Conselho Tutelar", desc: "Órgão local de proteção", href: "/mapa", icon: ShieldAlert },
    { label: "Delegacia Especializada", desc: "DECRADI / DEAM", href: "/mapa", icon: MapPin },
    { label: "Ministério Público", desc: "Promotorias da Infância", href: "/mapa", icon: BookOpenCheck },
    { label: "Mapa de Ajuda", desc: "Centros próximos a você", href: "/mapa", icon: MapPin },
  ];
  return (
    <section
      aria-label="Como denunciar"
      className="mt-12 rounded-3xl bg-[color:var(--navy-deep)] text-white p-6 sm:p-8"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="size-6 text-[color:var(--orange)] shrink-0 mt-0.5" aria-hidden />
        <div>
          <h2 className="font-display text-2xl font-bold">Como denunciar</h2>
          <p className="mt-1 text-sm text-white/80">
            Em situação de risco imediato, ligue 190. Para denúncias, o Disque 100 é gratuito, anônimo e funciona 24 horas.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const Icon = it.icon;
          const isAnchor = it.href.startsWith("tel:");
          const body = (
            <div className={`group flex h-full items-start gap-3 rounded-2xl p-4 transition-colors ${
              it.primary
                ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)] hover:brightness-95"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}>
              <Icon className="size-5 mt-0.5 shrink-0" aria-hidden />
              <div>
                <p className="font-display font-bold leading-tight">{it.label}</p>
                <p className={`mt-0.5 text-xs ${it.primary ? "text-[color:var(--navy-deep)]/80" : "text-white/75"}`}>
                  {it.desc}
                </p>
              </div>
            </div>
          );
          return isAnchor ? (
            <a key={it.label} href={it.href}>{body}</a>
          ) : (
            <Link key={it.label} to={it.href as "/mapa"}>{body}</Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────── Materiais relacionados ─────────────────── */

export function RelatedMaterials({ items }: { items: LibraryItem[] }) {
  if (!items.length) return null;
  return (
    <section
      aria-label="Materiais relacionados na biblioteca"
      className="mt-12"
    >
      <h2 className="font-display text-2xl font-bold flex items-center gap-2 text-[color:var(--navy-deep)]">
        <Library className="size-5 text-[color:var(--orange)]" aria-hidden />
        Materiais relacionados
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <Link
            key={it.slug}
            to="/biblioteca/$slug"
            params={{ slug: it.slug }}
            className="group block rounded-2xl border border-border bg-card p-5 hover-lift"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--red-inst)]">
              {it.category} · {it.audience}
            </span>
            <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-[color:var(--navy-deep)] group-hover:text-[color:var(--red-inst)] transition-colors">
              {it.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{it.description}</p>
            <p className="mt-3 text-[11px] text-muted-foreground">
              {it.sourceOrg} · {it.year}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────── FAQ ─────────────────── */

export interface FaqQA { q: string; a: string }

export function FaqBlock({ items }: { items: FaqQA[] }) {
  if (!items?.length) return null;
  return (
    <section
      aria-label="Perguntas frequentes"
      className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl font-bold text-[color:var(--navy-deep)]">
        Perguntas frequentes
      </h2>
      <div className="mt-5 divide-y divide-border">
        {items.map((qa, i) => (
          <details key={i} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-base font-semibold text-[color:var(--navy-deep)]">
              <span className="leading-snug">{qa.q}</span>
              <span
                aria-hidden
                className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--orange)]/15 text-[color:var(--orange)] transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="mt-3 text-sm text-foreground/85 leading-relaxed">
              <SafeHtml html={qa.a} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────── Leitura recomendada ─────────────────── */

export interface RecommendedSummary {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
}

export function RecommendedReading({
  parents,
  schools,
  risks,
  library,
}: {
  parents?: RecommendedSummary[];
  schools?: RecommendedSummary[];
  risks?: RiskItem[];
  library?: LibraryItem[];
}) {
  const hasAny =
    (parents?.length ?? 0) + (schools?.length ?? 0) + (risks?.length ?? 0) + (library?.length ?? 0) > 0;
  if (!hasAny) return null;

  return (
    <section aria-label="Leitura recomendada" className="mt-12">
      <h2 className="font-display text-2xl font-bold text-[color:var(--navy-deep)]">
        Leitura recomendada
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {parents?.slice(0, 1).map((p) => (
          <RecCard key={`p-${p.id}`} icon={HomeIcon} tag="Para Pais" title={p.title} href="/pais" desc={p.subtitle} />
        ))}
        {schools?.slice(0, 1).map((s) => (
          <RecCard key={`s-${s.id}`} icon={GraduationCap} tag="Para Escolas" title={s.title} href="/escolas" desc={s.subtitle} />
        ))}
        {risks?.slice(0, 1).map((r) => (
          <RecCard key={`r-${r.slug}`} icon={Wifi} tag="Riscos Online" title={r.title} href="/riscos-online" desc={r.summary} />
        ))}
        {library?.slice(0, 1).map((it) => (
          <RecCard
            key={`l-${it.slug}`}
            icon={Library}
            tag="Biblioteca"
            title={it.title}
            href={`/biblioteca/${it.slug}`}
            desc={it.description}
          />
        ))}
      </div>
    </section>
  );
}

function RecCard({
  icon: Icon,
  tag,
  title,
  desc,
  href,
}: {
  icon: typeof HomeIcon;
  tag: string;
  title: string;
  desc?: string | null;
  href: string;
}) {
  const isInternal = href.startsWith("/");
  const inner = (
    <div className="group h-full rounded-2xl border border-border bg-card p-5 hover-lift">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-[color:var(--orange)]" aria-hidden />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--red-inst)]">
          {tag}
        </span>
      </div>
      <h3 className="mt-2 font-display text-sm font-semibold leading-snug text-[color:var(--navy-deep)] group-hover:text-[color:var(--red-inst)] transition-colors">
        {title}
      </h3>
      {desc && <p className="mt-1.5 text-xs text-muted-foreground line-clamp-3">{desc}</p>}
    </div>
  );
  if (!isInternal) return <a href={href}>{inner}</a>;
  return (
    <Link to={href as "/pais"} className="block h-full">
      {inner}
    </Link>
  );
}

/* ─────────────────── Aviso de anonimização ─────────────────── */

export function AnonymizedNotice() {
  return (
    <aside
      role="note"
      className="mt-8 rounded-2xl border border-[color:var(--orange)]/30 bg-[color:var(--orange-soft)]/30 p-4 text-sm text-foreground/85"
    >
      <strong className="font-semibold text-[color:var(--navy-deep)]">
        Identidades preservadas.
      </strong>{" "}
      Vítimas nunca são identificadas. Quando há registro público (mídia nacional ou processo
      transitado em julgado), nomes podem aparecer apenas em fontes externas linkadas — nunca
      em destaque editorial.
    </aside>
  );
}
