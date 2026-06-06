/**
 * Resolver para conteúdo estático (cases.ts, news.ts) no formato
 * `PublicArticleDetail`. Usado como fallback quando o conteúdo não
 * existe no banco — assim as rotas /casos/$slug e /noticias/$slug
 * funcionam para conteúdo curado em código.
 */
import { cases, type TimelineEntry } from "./cases";
import { news } from "./news";

export interface StaticArticleDetail {
  id: string;
  type: "news" | "case";
  slug: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  category: string | null;
  cover_url: string | null;
  primary_source_label: string | null;
  primary_source_url: string | null;
  publish_at: string;
  last_verified_at: string | null;
  updated_at: string;
  author_name: string | null;
  reviewer_name: string | null;
  sources: { id: string; label: string; url: string; position: number }[];
  timeline?: TimelineEntry[];
}

export function getStaticArticle(
  type: "news" | "case",
  slug: string,
): StaticArticleDetail | null {
  if (type === "case") {
    const c = cases.find((x) => x.slug === slug);
    if (!c) return null;
    return {
      id: `static-case-${c.slug}`,
      type: "case",
      slug: c.slug,
      title: c.title,
      subtitle: c.summary,
      body: c.body ?? `<p>${c.summary}</p><h2>Impacto</h2><p>${c.impact}</p>`,
      category: c.tag,
      cover_url: c.image,
      primary_source_label: c.source.name,
      primary_source_url: c.source.url,
      publish_at: c.date,
      last_verified_at: null,
      updated_at: c.date,
      author_name: "Equipe Infância Protegida",
      reviewer_name: null,
      sources: (c.sources ?? []).map((s, i) => ({
        id: `${c.slug}-src-${i}`,
        label: s.label,
        url: s.url,
        position: i,
      })),
      timeline: c.timeline,
    };
  }
  const n = news.find((x) => x.slug === slug);
  if (!n) return null;
  return {
    id: `static-news-${n.slug}`,
    type: "news",
    slug: n.slug,
    title: n.title,
    subtitle: n.excerpt,
    body: n.body ?? `<p>${n.excerpt}</p>`,
    category: n.category,
    cover_url: n.image,
    primary_source_label: n.source.name,
    primary_source_url: n.source.url,
    publish_at: n.date,
    last_verified_at: null,
    updated_at: n.date,
    author_name: "Equipe Infância Protegida",
    reviewer_name: null,
    sources: (n.sources ?? []).map((s, i) => ({
      id: `${n.slug}-src-${i}`,
      label: s.label,
      url: s.url,
      position: i,
    })),
  };
}
