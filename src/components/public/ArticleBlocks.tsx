import { Info, Lightbulb, BookOpenCheck, ListChecks, ShieldAlert, Phone, MapPin, ArrowRight, GraduationCap, Home as HomeIcon, Wifi, Library, AlertCircle, AlertTriangle, BadgeCheck, CheckCircle2, Eye, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SafeHtml } from "@/components/shared/SafeHtml";
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

/* ─────────────────── Como denunciar (bloco destacado) ─────────────────── */

export function ReportChannels() {
  const items = [
    { label: "Disque 100", desc: "Denúncia anônima 24h — gratuito", href: "tel:100", icon: Phone, primary: true, badge: "24h" },
    { label: "Emergência 190", desc: "Risco imediato — Polícia Militar", href: "tel:190", icon: AlertCircle, urgent: true, badge: "Urgente" },
    { label: "Polícia Federal", desc: "Crimes online contra crianças", href: "https://www.gov.br/pf/pt-br/canais_atendimento/denuncie", icon: ShieldAlert },
    { label: "SaferNet", desc: "Denúncia de conteúdo na internet", href: "https://new.safernet.org.br/denuncie", icon: ShieldAlert },
    { label: "Conselho Tutelar", desc: "Órgão local de proteção", href: "/mapa", icon: MapPin },
    { label: "Ministério Público", desc: "Promotorias da Infância", href: "/mapa", icon: BookOpenCheck },
  ];
  const whatToInform = [
    "Nome e idade da criança ou adolescente (se souber)",
    "Endereço completo ou ponto de referência do local",
    "Descrição objetiva do que está acontecendo",
    "Quando e há quanto tempo a situação ocorre",
    "Nome do suspeito e relação com a vítima (se souber)",
    "Existência de testemunhas ou outras crianças no local",
    "Telefone para retorno (opcional — pode ser anônimo)",
    "Qualquer registro: print, foto, áudio ou documento",
  ];
  return (
    <section
      aria-label="Como denunciar"
      className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-[color:var(--navy-deep)] via-[color:var(--navy-deep)] to-[#0a1a2e] text-white shadow-2xl"
    >
      <div className="relative p-6 sm:p-8">
        <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-[color:var(--orange)]/20 blur-3xl" />
        <div className="relative flex items-start gap-3">
          <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--orange)] text-[color:var(--navy-deep)] shadow-lg">
            <AlertCircle className="size-6" aria-hidden />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--orange)]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--orange)]">
              Bloco essencial
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold">Como denunciar</h2>
            <p className="mt-1.5 text-sm sm:text-base text-white/85 leading-relaxed">
              Em <strong>risco imediato, ligue 190</strong>. Para denúncias, o <strong>Disque 100</strong> é gratuito, anônimo e funciona 24 horas, 7 dias por semana, em todo o Brasil.
            </p>
          </div>
        </div>

        <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => {
            const Icon = it.icon;
            const isExternal = it.href.startsWith("http");
            const isTel = it.href.startsWith("tel:");
            const tone = it.primary
              ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)] hover:brightness-95 shadow-lg"
              : it.urgent
                ? "bg-[color:var(--red-inst)] text-white hover:brightness-110 shadow-lg"
                : "bg-white/10 text-white hover:bg-white/15 backdrop-blur";
            const body = (
              <div className={`group relative flex h-full items-start gap-3 rounded-2xl p-4 transition-all hover:-translate-y-0.5 ${tone}`}>
                <Icon className="size-5 mt-0.5 shrink-0" aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display font-bold leading-tight">{it.label}</p>
                    {it.badge && (
                      <span className={`text-[9px] font-bold uppercase tracking-wider rounded-full px-1.5 py-0.5 ${
                        it.primary ? "bg-[color:var(--navy-deep)] text-[color:var(--orange)]" :
                        it.urgent ? "bg-white text-[color:var(--red-inst)]" : "bg-white/20"
                      }`}>{it.badge}</span>
                    )}
                  </div>
                  <p className={`mt-0.5 text-xs leading-snug ${
                    it.primary ? "text-[color:var(--navy-deep)]/80" :
                    it.urgent ? "text-white/90" : "text-white/75"
                  }`}>{it.desc}</p>
                </div>
              </div>
            );
            if (isExternal) return <a key={it.label} href={it.href} target="_blank" rel="noopener noreferrer">{body}</a>;
            if (isTel) return <a key={it.label} href={it.href}>{body}</a>;
            return <Link key={it.label} to={it.href as "/mapa"}>{body}</Link>;
          })}
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20 backdrop-blur p-6 sm:p-8">
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <ListChecks className="size-5 text-[color:var(--orange)]" aria-hidden />
          O que informar na denúncia
        </h3>
        <p className="mt-1 text-xs text-white/70">
          Você não precisa ter todos os dados. Informe o que souber — o atendimento orienta o restante.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {whatToInform.map((t, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-white/90">
              <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-[color:var(--orange)]" aria-hidden />
              <span className="leading-snug">{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[11px] text-white/60 leading-relaxed">
          A denúncia pode ser <strong className="text-white/85">anônima</strong>. Manter o sigilo é direito do denunciante e está previsto em lei.
        </p>
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

/* ─────────────────── Fase 1 — Selos de gravidade e confiança ─────────────────── */

const SEVERITY_LABELS: Record<string, { label: string; tone: string }> = {
  baixo: { label: "Gravidade baixa", tone: "bg-emerald-100 text-emerald-900 border-emerald-300" },
  medio: { label: "Gravidade média", tone: "bg-amber-100 text-amber-900 border-amber-300" },
  alto: { label: "Gravidade alta", tone: "bg-orange-100 text-orange-900 border-orange-300" },
  gravissimo: { label: "Gravidade gravíssima", tone: "bg-red-100 text-red-900 border-red-300" },
};

export function SeverityBadge({ level }: { level?: string | null }) {
  if (!level || !SEVERITY_LABELS[level]) return null;
  const s = SEVERITY_LABELS[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${s.tone}`}
      aria-label={s.label}
    >
      <AlertTriangle className="size-3" aria-hidden /> {s.label}
    </span>
  );
}

const CONFIDENCE_LABELS: Record<string, { label: string; tone: string }> = {
  alta: { label: "Fontes de alta confiabilidade", tone: "bg-[color:var(--navy-deep)] text-white border-[color:var(--navy-deep)]" },
  media: { label: "Fontes de média confiabilidade", tone: "bg-card text-[color:var(--navy-deep)] border-border" },
  baixa: { label: "Fontes de baixa confiabilidade", tone: "bg-muted text-foreground/80 border-border" },
};

export function ConfidenceBadge({ level }: { level?: string | null }) {
  if (!level || !CONFIDENCE_LABELS[level]) return null;
  const s = CONFIDENCE_LABELS[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${s.tone}`}
      aria-label={s.label}
    >
      <BadgeCheck className="size-3" aria-hidden /> {s.label}
    </span>
  );
}

/* ─────────────────── Fase 1 — O que fazer agora ─────────────────── */

export function ActionStepsBlock({ items }: { items?: string[] | null }) {
  if (!items?.length) return null;
  return (
    <section
      aria-label="O que fazer agora"
      className="mt-12 rounded-3xl border border-[color:var(--orange)]/30 bg-[color:var(--orange-soft)]/40 p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl font-bold flex items-center gap-2 text-[color:var(--navy-deep)]">
        <CheckCircle2 className="size-5 text-[color:var(--orange)]" aria-hidden />
        O que fazer agora
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Passos práticos de prevenção, proteção e denúncia.
      </p>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((step, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-2xl border border-border bg-background p-4"
          >
            <span
              aria-hidden
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--navy-deep)] text-white text-xs font-bold"
            >
              {i + 1}
            </span>
            <span className="text-sm text-foreground/90 leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ─────────────────── Fase 1 — Indicadores de alerta ─────────────────── */

export function WarningIndicatorsBlock({ items }: { items?: string[] | null }) {
  if (!items?.length) return null;
  return (
    <section
      aria-label="Indicadores de alerta"
      className="mt-12 rounded-3xl border border-[color:var(--red-inst)]/30 bg-card p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl font-bold flex items-center gap-2 text-[color:var(--navy-deep)]">
        <Eye className="size-5 text-[color:var(--red-inst)]" aria-hidden />
        Indicadores de alerta
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Sinais que podem indicar que uma criança ou adolescente precisa de ajuda.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((w, i) => (
          <li
            key={i}
            className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--red-inst)]/10 text-[color:var(--red-inst)] border border-[color:var(--red-inst)]/30 px-3 py-1.5 text-xs font-semibold"
          >
            <AlertTriangle className="size-3" aria-hidden />
            {w}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─────────────────── Fase 1 — Impacto nacional ─────────────────── */

export function ImpactBlock({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <section
      aria-label="Impacto nacional"
      className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl font-bold flex items-center gap-2 text-[color:var(--navy-deep)]">
        <TrendingUp className="size-5 text-[color:var(--orange)]" aria-hidden />
        Impacto nacional
      </h2>
      <p className="mt-3 text-base text-foreground/90 leading-relaxed">{text}</p>
    </section>
  );
}

/* ─────────────────── Fase 1 — Linha de verificação editorial ─────────────────── */

function formatDate(d: string | null | undefined) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export function VerificationLine({
  publishedAt,
  verifiedAt,
  confidence,
}: {
  publishedAt?: string | null;
  verifiedAt?: string | null;
  confidence?: string | null;
}) {
  const pub = formatDate(publishedAt);
  const ver = formatDate(verifiedAt);
  if (!pub && !ver && !confidence) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      {pub && <span>Publicado em <strong className="text-foreground">{pub}</strong></span>}
      {ver && <span>Verificado em <strong className="text-foreground">{ver}</strong></span>}
      <ConfidenceBadge level={confidence} />
    </div>
  );
}
