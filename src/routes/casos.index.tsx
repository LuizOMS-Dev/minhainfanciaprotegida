import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowRight, ShieldCheck, Scale, BookOpen, Phone } from "lucide-react";
import { cases } from "@/content/cases";
import { CaseCard } from "@/components/public/CaseCard";
import { CasosHero } from "@/components/public/CasosHero";
import { CasosFilters, type SeverityFilter } from "@/components/public/CasosFilters";
import { Reveal } from "@/components/shared/Reveal";
import { listPublishedArticles } from "@/services/articleService";
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
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://minhainfanciaprotegida.com.br/casos" },
      { property: "og:image", content: "https://minhainfanciaprotegida.com.br/hero-casos.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Dossiê nacional · Casos reais — Infância Protegida" },
      {
        name: "twitter:description",
        content: "Casos que mudaram leis e a forma como o Brasil enfrenta a violência contra crianças.",
      },
      { name: "twitter:image", content: "https://minhainfanciaprotegida.com.br/hero-casos.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/casos" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Dossiê nacional · Casos reais — Infância Protegida",
          "url": "https://minhainfanciaprotegida.com.br/casos",
          "description": "Casos verificados que marcaram o combate ao abuso e à exploração sexual de crianças e adolescentes no Brasil.",
          "isPartOf": { "@id": "https://minhainfanciaprotegida.com.br/#website" }
        })
      }
    ]
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
    <div className="bg-background">
      <CasosHero
        totalCases={merged.length}
        yearRange={yearRange}
        lastVerifiedLabel={lastVerifiedLabel}
      />

      <section className="bg-background border-b border-border py-16 sm:py-24">
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
            <div className="mt-16 pt-16 border-t border-border/50">
              <h2 className="font-display text-2xl font-bold text-[color:var(--navy-deep)] mb-8">
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
            <div className="rounded-2xl border border-dashed border-border bg-card py-20 text-center shadow-sm">
              <p className="font-display text-xl font-medium text-[color:var(--navy-deep)]">
                Nenhum dossiê corresponde aos filtros aplicados.
              </p>
              <button
                onClick={() => {
                  setCategory("Todos");
                  setSeverity("all");
                  setYear("all");
                  setQuery("");
                }}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--navy)] hover:text-[color:var(--orange)] transition-colors"
              >
                Limpar filtros <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </div>
      </section>

      <InstitutionalStripe />
    </div>
  );
}

function FeaturedCase({ item }: { item: NormalizedCase }) {
  const ev = item.eventDate ? new Date(item.eventDate) : null;
  return (
    <article className="group grid gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow lg:grid-cols-[1.1fr_1fr] mt-8">
      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden bg-[color:var(--navy-deep)]">
        <img src={item.image} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--navy-deep)]/70 via-transparent to-transparent" />
        <span className="absolute top-6 left-6 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--navy)] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
          <ShieldCheck className="size-3 text-[color:var(--orange)]" aria-hidden /> Dossiê em destaque
        </span>
      </div>
      <div className="flex flex-col justify-center gap-5 p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[color:var(--orange)]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        {item.category && (
          <span className="self-start text-[10px] font-bold uppercase tracking-widest text-muted-foreground relative z-10">
            {item.category}
            {ev ? ` · ${ev.getFullYear()}` : ""}
          </span>
        )}
        <h3 className="font-display text-3xl sm:text-4xl font-semibold leading-tight text-[color:var(--navy-deep)] text-balance relative z-10">
          {item.title}
        </h3>
        <p className="text-base leading-relaxed text-muted-foreground line-clamp-4 relative z-10">{item.excerpt}</p>
        {item.source?.name && (
          <p className="text-xs text-muted-foreground relative z-10">
            Fonte primária: <span className="font-semibold text-[color:var(--navy)]">{item.source.name}</span>
          </p>
        )}
        <Link
          to="/casos/$slug"
          params={{ slug: item.slug }}
          className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-[color:var(--navy)] px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-white hover:bg-[color:var(--navy-deep)] transition shadow-sm relative z-10"
        >
          Ler dossiê completo <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

function InstitutionalStripe() {
  return (
    <section className="bg-[color:var(--navy)] text-white py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="stripe-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stripe-grid)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-3 relative z-10">
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-white/60 font-semibold relative z-10">
        <BookOpen className="size-4 text-[color:var(--orange)]" aria-hidden />
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
      className="group flex flex-col h-full rounded-xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 hover:border-white/20 transition-all shadow-sm"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-lg bg-[color:var(--orange)] text-[color:var(--navy-deep)] mb-6 shadow-sm">
        <Icon className="size-6" aria-hidden />
      </span>
      <h3 className="font-display text-2xl font-semibold leading-tight text-white">{title}</h3>
      <p className="mt-3 text-sm text-white/80 leading-relaxed flex-grow">{description}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--orange)]">
        {cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}
