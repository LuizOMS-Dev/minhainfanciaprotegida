import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery, useQuery, queryOptions } from "@tanstack/react-query";
import { ArrowLeft, Calendar, User, ShieldCheck, Clock } from "lucide-react";
import {
  getPublishedArticle,
  listRelatedArticles,
  getArticleSiblings,
} from "@/lib/content.functions";
import { ReferencesBlock } from "@/components/site/ReferencesBlock";
import { JsonLd } from "@/components/site/JsonLd";
import { SafeHtml, readingTimeMinutes } from "@/components/site/SafeHtml";
import { ShareButtons } from "@/components/site/ShareButtons";
import { RelatedArticles, ArticleSiblingNav } from "@/components/site/RelatedArticles";
import { Timeline } from "@/components/site/Timeline";
import { CaseActions } from "@/components/site/CaseActions";

const fmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
const SITE = "https://minhainfanciaprotegida.lovable.app";

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
    return {
      meta: [
        { title: `${a.title} — Infância Protegida` },
        { name: "description", content: a.subtitle ?? a.title },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.subtitle ?? a.title },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `${SITE}/casos/${a.slug}` },
        ...(a.cover_url ? [{ property: "og:image" as const, content: a.cover_url }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `${SITE}/casos/${a.slug}` }],
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

  const { data } = useSuspenseQuery({
    ...articleQO(slug),
    queryFn: () => fetchArticle({ data: { type: "case", slug } }),
  });
  const a = data.article!;
  const date = a.publish_at ?? a.updated_at;
  const url = `${SITE}/casos/${a.slug}`;
  const minutes = readingTimeMinutes(a.body);

  const { data: rel } = useQuery({
    queryKey: ["related", "case", a.id, a.category],
    queryFn: () => fetchRelated({ data: { id: a.id, type: "case", category: a.category, limit: 3 } }),
  });
  const { data: sib } = useQuery({
    queryKey: ["siblings", "case", a.id],
    queryFn: () => fetchSiblings({ data: { id: a.id, type: "case", publishAt: date } }),
  });

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
        {a.cover_url && (
          <img src={a.cover_url} alt="" className="mb-10 w-full rounded-2xl border border-border object-cover aspect-[16/9]" />
        )}
        {a.body && <SafeHtml html={a.body} className="prose prose-neutral max-w-none text-foreground/90 leading-relaxed" />}
        {a.timeline && a.timeline.length > 0 && <Timeline items={a.timeline} />}
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
          author: a.author_name ? { "@type": "Person", name: a.author_name } : { "@type": "Organization", name: "Infância Protegida" },
          publisher: { "@type": "Organization", name: "Infância Protegida" },
        }}
      />
    </article>
  );
}
