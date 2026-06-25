import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery, useQuery, queryOptions } from "@tanstack/react-query";
import {
  getPublishedArticle,
  listRelatedArticles,
  getArticleSiblings,
  getArticleRelations,
} from "@/services/articleService";
import { ReferencesBlock } from "@/components/public/ReferencesBlock";
import { JsonLd, safeJsonLd } from "@/components/shared/JsonLd";
import { SafeHtml, readingTimeMinutes } from "@/components/shared/SafeHtml";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { RelatedArticles, ArticleSiblingNav } from "@/components/public/RelatedArticles";
import { Timeline } from "@/components/public/Timeline";
import { CaseActions } from "@/components/public/CaseActions";
import { ArticleHero } from "@/components/public/ArticleHero";
import {
  UnderstandBlock,
  NationalContextChips,
  LegislationBlock,
  SignalsBlock,
  ReportChannels,
  RelatedMaterials,
  FaqBlock,
  RecommendedReading,
  ActionStepsBlock,
  WarningIndicatorsBlock,
  ImpactBlock,
} from "@/components/public/ArticleBlocks";
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
    queryKey: ["article", "news", slug],
    queryFn: () => getPublishedArticle({ data: { type: "news" as const, slug } }),
  });

export const Route = createFileRoute("/noticias/$slug")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(articleQO(params.slug));
    if (!data.article) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    if (!a) return { meta: [{ title: "Notícia — Infância Protegida" }] };
    const desc =
      a.subtitle ??
      a.ai_summary ??
      (a.understand ? a.understand.replace(/<[^>]+>/g, "").slice(0, 155) : a.title);
    const url = `${SITE}/noticias/${a.slug}`;
    const faq = a.faq ?? [];
    const scripts: { type: string; children: string }[] = [
      {
        type: "application/ld+json",
        children: safeJsonLd({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: SITE + "/" },
            { "@type": "ListItem", position: 2, name: "Notícias", item: SITE + "/noticias" },
            { "@type": "ListItem", position: 3, name: a.title, item: url },
          ],
        }),
      },
    ];
    if (faq.length > 0) {
      scripts.push({
        type: "application/ld+json",
        children: safeJsonLd({
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
        { property: "article:published_time", content: a.publish_at ?? a.updated_at },
        { property: "article:modified_time", content: a.updated_at },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },
  component: NewsDetail,
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Não foi possível carregar esta notícia</h1>
      <Link to="/noticias" className="mt-6 inline-block text-[color:var(--red-inst)] underline">Voltar para Notícias</Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Notícia não encontrada</h1>
      <Link to="/noticias" className="mt-6 inline-block text-[color:var(--red-inst)] underline">Voltar para Notícias</Link>
    </div>
  ),
});

function NewsDetail() {
  const { slug } = Route.useParams();
  const fetchArticle = useServerFn(getPublishedArticle);
  const fetchRelated = useServerFn(listRelatedArticles);
  const fetchSiblings = useServerFn(getArticleSiblings);
  const fetchRelations = useServerFn(getArticleRelations);

  const { data } = useSuspenseQuery({
    ...articleQO(slug),
    queryFn: () => fetchArticle({ data: { type: "news", slug } }),
  });
  const a = data.article!;
  const date = a.publish_at ?? a.updated_at;
  const url = `${SITE}/noticias/${a.slug}`;
  const minutes = a.reading_minutes ?? readingTimeMinutes(a.body);

  const { data: rel } = useQuery({
    queryKey: ["related", "news", a.id, a.category],
    queryFn: () => fetchRelated({ data: { id: a.id, type: "news", category: a.category, limit: 3 } }),
    staleTime: 5 * 60_000,
  });
  const { data: sib } = useQuery({
    queryKey: ["siblings", "news", a.id],
    queryFn: () => fetchSiblings({ data: { id: a.id, type: "news", publishAt: date } }),
    staleTime: 5 * 60_000,
  });
  const { data: relations } = useQuery({
    queryKey: ["relations", "news", a.id, a.category],
    queryFn: () => fetchRelations({ data: { id: a.id, type: "news", category: a.category } }),
    staleTime: 5 * 60_000,
  });

  const laws = getLawsBySlugs(a.related_laws);
  const context = getContextByKeys(a.national_context);
  const signals = allRisks.filter((r) => a.related_signal_tags?.includes(r.slug));
  const libraryMatches = (relations?.library ?? [])
    .map((it) => allLibrary.find((l) => l.slug === it.slug || l.title === it.title))
    .filter((v): v is (typeof allLibrary)[number] => Boolean(v))
    .slice(0, 4);

  const eventDate = earliestTimelineDate(a.timeline) ?? a.publish_at ?? a.updated_at;

  return (
    <article className="bg-background">
      <ArticleHero
        variant="news"
        backLabel="Notícias"
        backTo="/noticias"
        category={a.category}
        title={a.title}
        subtitle={a.subtitle}
        coverUrl={a.cover_url}
        authorName={a.author_name}
        reviewerName={a.reviewer_name}
        publishAt={a.publish_at ?? a.updated_at}
        updatedAt={a.updated_at}
        verifiedAt={a.last_verified_at}
        eventDate={eventDate}
        readingMinutes={minutes}
        severityLevel={a.severity_level}
        sourceConfidence={a.source_confidence}
        shareUrl={url}
        shareDescription={a.subtitle}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {a.cover_url && (
          <figure className="mb-10 -mt-24 sm:-mt-32 relative">
            <img
              src={a.cover_url}
              alt=""
              loading="lazy"
              className="w-full rounded-3xl border border-border object-cover aspect-[16/9] shadow-2xl"
            />
          </figure>
        )}
        {a.body && <SafeHtml html={a.body} className="prose prose-neutral max-w-none text-foreground/90 leading-relaxed" />}


        <ActionStepsBlock items={a.action_steps} />
        <WarningIndicatorsBlock items={a.warning_indicators} />
        <UnderstandBlock html={a.understand} />
        <ImpactBlock text={a.impact_summary} />
        <NationalContextChips items={context} />
        <Timeline
          items={a.timeline ?? []}
          meta={{ publishAt: a.publish_at, updatedAt: a.updated_at, verifiedAt: a.last_verified_at }}
        />
        <LegislationBlock items={laws} />
        <SignalsBlock items={signals} />
        <ReportChannels />
        <RelatedMaterials items={libraryMatches} />
        <FaqBlock items={a.faq ?? []} />
        <RecommendedReading risks={signals} library={libraryMatches} />

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
          <ShareButtons title={a.title} url={url} description={a.subtitle ?? undefined} />
        </div>
      </div>

      <ArticleSiblingNav prev={sib?.prev ?? null} next={sib?.next ?? null} type="news" />
      <RelatedArticles items={rel?.related ?? []} type="news" />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: a.title,
          description: a.subtitle ?? a.ai_summary ?? undefined,
          abstract: a.ai_summary ?? undefined,
          datePublished: a.publish_at ?? a.updated_at,
          dateModified: a.last_verified_at ?? a.updated_at,
          image: a.cover_url ?? undefined,
          mainEntityOfPage: url,
          articleSection: a.category ?? undefined,
          keywords: [a.category, ...(a.warning_indicators ?? [])].filter(Boolean).join(", ") || undefined,
          inLanguage: "pt-BR",
          author: a.author_name ? { "@type": "Person", name: a.author_name } : { "@type": "Organization", name: "Infância Protegida" },
          publisher: { "@type": "Organization", name: "Infância Protegida" },
        }}
      />
    </article>
  );
}
