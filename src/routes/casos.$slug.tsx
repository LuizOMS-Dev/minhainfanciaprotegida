import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery, useQuery, queryOptions } from "@tanstack/react-query";
import {
  getPublishedArticle,
  listRelatedArticles,
  getArticleSiblings,
  getArticleRelations,
} from "@/lib/content.functions";
import { ReferencesBlock } from "@/components/site/ReferencesBlock";
import { JsonLd } from "@/components/site/JsonLd";
import { SafeHtml, readingTimeMinutes } from "@/components/site/SafeHtml";
import { ShareButtons } from "@/components/site/ShareButtons";
import { RelatedArticles, ArticleSiblingNav } from "@/components/site/RelatedArticles";
import { Timeline } from "@/components/site/Timeline";
import { CaseActions } from "@/components/site/CaseActions";
import { ArticleHero } from "@/components/site/ArticleHero";
import {
  UnderstandBlock,
  LessonsBlock,
  NationalContextChips,
  LegislationBlock,
  SignalsBlock,
  ReportChannels,
  RelatedMaterials,
  FaqBlock,
  RecommendedReading,
  AnonymizedNotice,
} from "@/components/site/ArticleBlocks";
import { getLawsBySlugs } from "@/content/laws";
import { getContextByKeys } from "@/content/nationalContext";
import { risks as allRisks } from "@/content/risks";
import { library as allLibrary } from "@/content/library";

function earliestTimelineDate(items?: { date: string }[] | null): string | null {
  if (!items?.length) return null;
  const valid = items
    .map((i) => ({ d: new Date(i.date), raw: i.date }))
    .filter((x) => !isNaN(x.d.getTime()))
    .sort((a, b) => a.d.getTime() - b.d.getTime());
  return valid[0]?.raw ?? null;
}

const SITE = "https://minhainfanciaprotegida.com.br";

const articleQO = (slug: string) =>
  queryOptions({
    queryKey: ["article", "case", slug],
    queryFn: () => getPublishedArticle({ data: { type: "case" as const, slug } }),
  });

export const Route = createFileRoute("/casos/$slug")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(articleQO(params.slug));
    if (!data.article) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    if (!a) return { meta: [{ title: "Caso — Infância Protegida" }] };
    const desc =
      a.subtitle ??
      (a.understand ? a.understand.replace(/<[^>]+>/g, "").slice(0, 155) : a.title);
    const url = `${SITE}/casos/${a.slug}`;
    const faq = a.faq ?? [];
    const scripts: { type: string; children: string }[] = [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: SITE + "/" },
            { "@type": "ListItem", position: 2, name: "Casos", item: SITE + "/casos" },
            { "@type": "ListItem", position: 3, name: a.title, item: url },
          ],
        }),
      },
    ];
    if (faq.length > 0) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((qa) => ({
            "@type": "Question",
            name: qa.q,
            acceptedAnswer: { "@type": "Answer", text: qa.a.replace(/<[^>]+>/g, "") },
          })),
        }),
      });
    }
    return {
      meta: [
        { title: `${a.title} — Infância Protegida` },
        { name: "description", content: desc },
        { property: "og:title", content: a.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(a.cover_url ? [{ property: "og:image" as const, content: a.cover_url }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },
  component: CaseDetail,
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Não foi possível carregar este caso</h1>
      <Link to="/casos" className="mt-6 inline-block text-[color:var(--red-inst)] underline">Voltar para Casos</Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Caso não encontrado</h1>
      <Link to="/casos" className="mt-6 inline-block text-[color:var(--red-inst)] underline">Voltar para Casos</Link>
    </div>
  ),
});

function CaseDetail() {
  const { slug } = Route.useParams();
  const fetchArticle = useServerFn(getPublishedArticle);
  const fetchRelated = useServerFn(listRelatedArticles);
  const fetchSiblings = useServerFn(getArticleSiblings);
  const fetchRelations = useServerFn(getArticleRelations);

  const { data } = useSuspenseQuery({
    ...articleQO(slug),
    queryFn: () => fetchArticle({ data: { type: "case", slug } }),
  });
  const a = data.article!;
  const date = a.publish_at ?? a.updated_at;
  const url = `${SITE}/casos/${a.slug}`;
  const minutes = a.reading_minutes ?? readingTimeMinutes(a.body);

  const { data: rel } = useQuery({
    queryKey: ["related", "case", a.id, a.category],
    queryFn: () => fetchRelated({ data: { id: a.id, type: "case", category: a.category, limit: 3 } }),
    staleTime: 5 * 60_000,
  });
  const { data: sib } = useQuery({
    queryKey: ["siblings", "case", a.id],
    queryFn: () => fetchSiblings({ data: { id: a.id, type: "case", publishAt: date } }),
    staleTime: 5 * 60_000,
  });
  const { data: relations } = useQuery({
    queryKey: ["relations", "case", a.id, a.category],
    queryFn: () => fetchRelations({ data: { id: a.id, type: "case", category: a.category } }),
    staleTime: 5 * 60_000,
  });

  const laws = getLawsBySlugs(a.related_laws);
  const context = getContextByKeys(a.national_context);
  const signals = allRisks.filter((r) => a.related_signal_tags?.includes(r.slug));
  const libraryMatches = (relations?.library ?? [])
    .map((it) => allLibrary.find((l) => l.slug === it.slug || l.title === it.title))
    .filter((v): v is (typeof allLibrary)[number] => Boolean(v))
    .slice(0, 4);

  return (
    <article className="bg-background">
      <header className="border-b border-border bg-[color:var(--navy-deep)] text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link to="/casos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white">
            <ArrowLeft className="size-4" aria-hidden /> Casos
          </Link>
          {a.category && (
            <span className="mt-4 inline-flex items-center rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
              {a.category}
            </span>
          )}
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold leading-tight text-balance">{a.title}</h1>
          {a.subtitle && <p className="mt-3 text-lg text-white/85 leading-relaxed">{a.subtitle}</p>}
          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            <div className="inline-flex items-center gap-1.5"><Calendar className="size-4" aria-hidden /><time dateTime={date}>{fmt.format(new Date(date))}</time></div>
            <div className="inline-flex items-center gap-1.5"><Clock className="size-4" aria-hidden />{minutes} min de leitura</div>
            {a.author_name && <div className="inline-flex items-center gap-1.5"><User className="size-4" aria-hidden /> {a.author_name}</div>}
            {a.reviewer_name && <div className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4" aria-hidden /> Revisão: {a.reviewer_name}</div>}
          </dl>
          <div className="mt-6"><ShareButtons title={a.title} url={url} /></div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <AnonymizedNotice />
        {a.cover_url && (
          <img src={a.cover_url} alt="" loading="lazy" className="mt-8 mb-10 w-full rounded-2xl border border-border object-cover aspect-[16/9]" />
        )}
        {a.body && <SafeHtml html={a.body} className="prose prose-neutral max-w-none text-foreground/90 leading-relaxed" />}

        {a.timeline && a.timeline.length > 0 && (
          <Timeline items={a.timeline} heading="Cronologia do caso" />
        )}
        <UnderstandBlock html={a.understand} />
        <LessonsBlock html={a.lessons} />
        <NationalContextChips items={context} />
        <SignalsBlock items={signals} />
        <RecommendedReading risks={signals} library={libraryMatches} />
        <LegislationBlock items={laws} />
        <ReportChannels />
        <RelatedMaterials items={libraryMatches} />
        <FaqBlock items={a.faq ?? []} />

        <CaseActions />

        {a.primary_source_url && a.primary_source_label && (
          <div className="mt-12">
            <ReferencesBlock
              primary={{ label: a.primary_source_label, url: a.primary_source_url }}
              secondary={a.sources.map((s) => ({ label: s.label, url: s.url }))}
              lastVerified={a.last_verified_at ?? a.updated_at}
              reviewedBy={a.reviewer_name ?? undefined}
            />
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-border">
          <ShareButtons title={a.title} url={url} />
        </div>
      </div>

      <ArticleSiblingNav prev={sib?.prev ?? null} next={sib?.next ?? null} type="case" />
      <RelatedArticles items={rel?.related ?? []} type="case" />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.subtitle ?? undefined,
          datePublished: a.publish_at ?? a.updated_at,
          dateModified: a.updated_at,
          image: a.cover_url ?? undefined,
          mainEntityOfPage: url,
          articleSection: a.category ?? "Casos reais",
          inLanguage: "pt-BR",
          author: a.author_name ? { "@type": "Person", name: a.author_name } : { "@type": "Organization", name: "Infância Protegida" },
          publisher: { "@type": "Organization", name: "Infância Protegida" },
        }}
      />
    </article>
  );
}
