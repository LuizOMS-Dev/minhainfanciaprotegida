import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowRight, ShieldCheck, Scale, BookOpen, Phone } from "lucide-react";
import { cases } from "@/content/cases";
import { CaseCard } from "@/components/site/CaseCard";
import { CasosHero } from "@/components/site/CasosHero";
import { CasosFilters, type SeverityFilter } from "@/components/site/CasosFilters";
import { Reveal } from "@/components/site/Reveal";
import { listPublishedArticles } from "@/lib/content.functions";
import journalismImg from "@/assets/journalism.jpg";

export const Route = createFileRoute("/casos/")({
  head: () => ({
    meta: [
      { title: "Dossiê nacional · Casos reais — Infância Protegida" },
      {
        name: "description",
        content:
          "Casos verificados que marcaram o combate ao abuso e à exploração sexual de crianças e adolescentes no Brasil — do Caso Araceli ao Caso Felca. Fontes oficiais, cronologia e impacto legislativo.",
      },
      { property: "og:title", content: "Dossiê nacional · Casos reais — Infância Protegida" },
      {
        property: "og:description",
        content: "Casos que mudaram leis e a forma como o Brasil enfrenta a violência contra crianças.",
      },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/casos" }],
  }),
  component: CasosPage,
});

const CATEGORIES = [
  "Todos",
  "Histórico",
  "Legislação",
  "Repercussão nacional",
  "Ambiente digital",
  "Operação policial",
] as const;

interface NormalizedCase {
  key: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string | null;
  severity: string | null;
  eventDate: string | null;
  publishDate: string | null;
  source: { name: string; url?: string } | null;
}

const fmtVerified = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

function CasosPage() {
  const [category, setCategory] = useState<string>("Todos");
  const [severity, setSeverity] = useState<SeverityFilter>("all");
  const [year, setYear] = useState<number | "all">("all");
  const [query, setQuery] = useState("");

  const fetchPublished = useServerFn(listPublishedArticles);
  const { data: published } = useQuery({
    queryKey: ["published-articles", "case"],
    queryFn: () => fetchPublished({ data: { type: "case", limit: 50 } }),
  });

  const merged: NormalizedCase[] = useMemo(() => {
    const fromDb = (published?.articles ?? []).map<NormalizedCase>((a) => ({
      key: `db-${a.id}`,
      slug: a.slug,
      title: a.title,
      excerpt: a.subtitle ?? "",
      image: a.cover_url || journalismImg,
      category: a.category ?? null,
      severity: null,
      eventDate: a.publish_at ?? a.updated_at,
      publishDate: a.publish_at ?? a.updated_at,
      source: a.primary_source_label
        ? { name: a.primary_source_label, url: a.primary_source_url ?? undefined }
        : null,
    }));
    const fromStatic = cases.map<NormalizedCase>((c) => ({
      key: `s-${c.slug}`,
      slug: c.slug,
      title: c.title,
      excerpt: c.summary,
      image: c.image,
      category: c.tag,
      severity: null,
      eventDate: c.date,
      publishDate: c.date,
      source: c.source ? { name: c.source.name, url: c.source.url } : null,
    }));

    const seen = new Set<string>();
    const out: NormalizedCase[] = [];
    for (const item of [...fromDb, ...fromStatic]) {
      if (seen.has(item.slug)) continue;
      seen.add(item.slug);
      out.push(item);
    }
    return out.sort((a, b) => {
      const da = a.eventDate ? +new Date(a.eventDate) : 0;
      const db = b.eventDate ? +new Date(b.eventDate) : 0;
      return db - da;
    });
  }, [published]);

  const years = useMemo(() => {
    const ys = new Set<number>();
    for (const c of merged) {
      if (c.eventDate) {
        const y = new Date(c.eventDate).getFullYear();
        if (!isNaN(y)) ys.add(y);
      }
    }
    return Array.from(ys).sort((a, b) => b - a);
  }, [merged]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return merged.filter((c) => {
      if (category !== "Todos" && c.category !== category) return false;
      if (severity !== "all" && c.severity !== severity) return false;
      if (year !== "all") {
        const y = c.eventDate ? new Date(c.eventDate).getFullYear() : null;
        if (y !== year) return false;
      }
      if (q && !c.title.toLowerCase().includes(q) && !c.excerpt.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [merged, category, severity, year, query]);

  const featured = filtered[0] ?? null;
  const rest = featured ? filtered.slice(1) : [];

  const yearRange = useMemo(() => {
    if (years.length === 0) return null;
    return { min: Math.min(...years), max: Math.max(...years) };
  }, [years]);

  const lastVerifiedLabel = useMemo(() => {
    const latestUpdate = (published?.articles ?? [])
      .map((a) => a.last_verified_at ?? a.updated_at)
      .filter(Boolean)
      .sort()
      .at(-1);
    if (latestUpdate) return fmtVerified.format(new Date(latestUpdate));
    return null;
  }, [published]);

  return (
    <>
      <CasosHero
        totalCases={merged.length}
        yearRange={yearRange}
        lastVerifiedLabel={lastVerifiedLabel}
      />

      <section className="bg-[color:var(--dossier-cream)]/40 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CasosFilters
            categories={[...CATEGORIES]}
            category={category}
            onCategoryChange={setCategory}
            severity={severity}
            onSeverityChange={setSeverity}
            years={years}
            year={year}
            onYearChange={setYear}
            query={query}
            onQueryChange={setQuery}
            total={merged.length}
            filtered={filtered.length}
          />

          {featured && (
            <Reveal>
              <FeaturedCase item={featured} />
            </Reveal>
          )}

          {rest.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold text-[color:var(--navy-deep)] mb-6">
                Todos os dossiês
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((c, i) => (
                  <Reveal key={c.key} delay={i * 50}>
                    <CaseCard
                      slug={c.slug}
                      title={c.title}
                      excerpt={c.excerpt}
                      image={c.image}
                      category={c.category}
                      severity={c.severity}
                      eventDate={c.eventDate}
                      publishDate={c.publishDate}
                      source={c.source}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[color:var(--dossier-rule)] bg-white py-16 text-center">
              <p className="font-display text-xl font-semibold text-[color:var(--navy-deep)]">
                Nenhum caso corresponde aos filtros aplicados.
              </p>
              <button
                onClick={() => {
                  setCategory("Todos");
                  setSeverity("all");
                  setYear("all");
                  setQuery("");
                }}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--red-inst)] hover:underline"
              >
                Limpar filtros <ArrowRight className="size-3.5" aria-hidden />
              </button>
            </div>
          )}
        </div>
      </section>

      <InstitutionalStripe />
    </>
  );
}

function FeaturedCase({ item }: { item: NormalizedCase }) {
  const ev = item.eventDate ? new Date(item.eventDate) : null;
  return (
    <article className="grid gap-0 overflow-hidden rounded-3xl border border-[color:var(--dossier-rule)] bg-white shadow-[0_25px_60px_-30px_rgba(11,20,45,0.45)] lg:grid-cols-[1.1fr_1fr]">
      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden bg-[color:var(--dossier-cream-deep)]">
        <img src={item.image} alt="" className="size-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--navy-deep)]/70 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--orange)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--navy-deep)]">
          <ShieldCheck className="size-3" aria-hidden /> Dossiê em destaque
        </span>
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
        {item.category && (
          <span className="self-start text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--navy-deep)]/70">
            {item.category}
            {ev ? ` · ${ev.getFullYear()}` : ""}
          </span>
        )}
        <h3 className="font-display text-3xl sm:text-4xl font-semibold leading-tight text-[color:var(--navy-deep)] text-balance">
          {item.title}
        </h3>
        <p className="text-base leading-relaxed text-[color:var(--dossier-ink)]/85 line-clamp-4">{item.excerpt}</p>
        {item.source?.name && (
          <p className="text-xs text-[color:var(--navy-deep)]/70">
            Fonte primária: <span className="font-semibold text-[color:var(--navy-deep)]">{item.source.name}</span>
          </p>
        )}
        <Link
          to="/casos/$slug"
          params={{ slug: item.slug }}
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--navy-deep)] px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-[color:var(--red-inst)] transition"
        >
          Ler dossiê completo <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

function InstitutionalStripe() {
  return (
    <section className="bg-[color:var(--navy-deep)] text-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
        <StripeCard
          icon={ShieldCheck}
          title="Como verificamos os casos"
          description="Conheça os critérios editoriais, as fontes oficiais consultadas e o fluxo de revisão antes da publicação."
          to="/metodologia"
          cta="Ver metodologia"
        />
        <StripeCard
          icon={Phone}
          title="Como denunciar"
          description="Canais oficiais 24h, anônimos e gratuitos para denúncia, acolhimento e orientação à rede de proteção."
          to="/denuncia"
          cta="Acessar canais"
        />
        <StripeCard
          icon={Scale}
          title="Legislação aplicável"
          description="ECA, Lei Henry Borel, Lei Mariana Ferrer, Marco Civil e demais marcos legais ligados aos casos publicados."
          to="/legislacao"
          cta="Ver leis"
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
        <BookOpen className="size-3.5 text-[color:var(--orange)]" aria-hidden />
        Portal educativo e independente · Sem fins lucrativos
      </div>
    </section>
  );
}

function StripeCard({
  icon: Icon,
  title,
  description,
  to,
  cta,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
  to: "/metodologia" | "/denuncia" | "/legislacao";
  cta: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:border-[color:var(--orange)]/60 hover:bg-white/[0.07]"
    >
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[color:var(--orange)] text-[color:var(--navy-deep)]">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="font-display text-xl font-bold leading-tight">{title}</h3>
      <p className="text-sm text-white/80 leading-relaxed">{description}</p>
      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--orange)]">
        {cta} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
