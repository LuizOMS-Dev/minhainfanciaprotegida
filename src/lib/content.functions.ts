import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const typeSchema = z.enum(["news", "case", "risk", "guide"]);

export interface PublicArticleSummary {
  id: string;
  type: "news" | "case" | "risk" | "guide";
  slug: string;
  title: string;
  subtitle: string | null;
  category: string | null;
  cover_url: string | null;
  primary_source_label: string | null;
  primary_source_url: string | null;
  publish_at: string | null;
  last_verified_at: string | null;
  updated_at: string;
  author_name: string | null;
  reviewer_name: string | null;
}

export interface PublicArticleDetail extends PublicArticleSummary {
  body: string | null;
  sources: { id: string; label: string; url: string; position: number }[];
  /** Linha do tempo opcional — preenchida apenas para conteúdo estático/curado. */
  timeline?: { date: string; text: string; title?: string }[];
  /* Campos editoriais avançados (todos opcionais). */
  reading_minutes?: number | null;
  understand?: string | null;
  lessons?: string | null;
  faq?: { q: string; a: string }[] | null;
  related_laws?: string[] | null;
  related_signal_tags?: string[] | null;
  national_context?: string[] | null;
  /* Fase 1 — ação, alerta, gravidade, impacto, confiança, resumo IA. */
  action_steps?: string[] | null;
  warning_indicators?: string[] | null;
  severity_level?: "baixo" | "medio" | "alto" | "gravissimo" | null;
  impact_summary?: string | null;
  source_confidence?: "alta" | "media" | "baixa" | null;
  ai_summary?: string | null;
  /* Fase 2 — Dossiê institucional (casos). */
  executive_summary?: string[] | null;
  why_it_matters?: string | null;
  how_to_act?: { step?: number; title: string; description: string }[] | null;
}

function coerceStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const out = value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  return out.length ? out : null;
}

function coerceHowToAct(value: unknown): { step?: number; title: string; description: string }[] | null {
  if (!Array.isArray(value)) return null;
  const out: { step?: number; title: string; description: string }[] = [];
  for (const v of value) {
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      const title = typeof o.title === "string" ? o.title : null;
      const description = typeof o.description === "string" ? o.description : null;
      if (title && description) {
        out.push({
          title,
          description,
          step: typeof o.step === "number" ? o.step : undefined,
        });
      }
    }
  }
  return out.length ? out : null;
}

export const listPublishedArticles = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z
      .object({
        type: typeSchema.optional(),
        limit: z.number().int().min(1).max(50).default(24),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const nowIso = new Date().toISOString();
    let q = supabaseAdmin
      .from("articles")
      .select(
        "id, type, slug, title, subtitle, category, cover_url, primary_source_label, primary_source_url, publish_at, last_verified_at, updated_at, author_id, reviewer_id",
      )
      .eq("status", "published")
      .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
      .order("publish_at", { ascending: false, nullsFirst: false })
      .order("updated_at", { ascending: false })
      .limit(data.limit);
    if (data.type) q = q.eq("type", data.type);

    const { data: rows, error } = await q;
    if (error) { console.error("[content] supabase error", error); throw new Error("Não foi possível carregar o conteúdo."); }

    const ids = Array.from(
      new Set(
        (rows ?? [])
          .flatMap((r) => [r.author_id, r.reviewer_id])
          .filter((v): v is string => Boolean(v)),
      ),
    );
    const profilesById = new Map<string, string>();
    if (ids.length > 0) {
      const { data: profs } = await supabaseAdmin
        .from("public_author_profiles")
        .select("id, display_name")
        .in("id", ids);
      profs?.forEach((p) => profilesById.set(p.id, p.display_name ?? ""));
    }

    const articles: PublicArticleSummary[] = (rows ?? []).map((r) => ({
      id: r.id,
      type: r.type as PublicArticleSummary["type"],
      slug: r.slug,
      title: r.title,
      subtitle: r.subtitle,
      category: r.category,
      cover_url: r.cover_url,
      primary_source_label: r.primary_source_label,
      primary_source_url: r.primary_source_url,
      publish_at: r.publish_at,
      last_verified_at: r.last_verified_at,
      updated_at: r.updated_at,
      author_name: r.author_id ? profilesById.get(r.author_id) ?? null : null,
      reviewer_name: r.reviewer_id ? profilesById.get(r.reviewer_id) ?? null : null,
    }));
    return { articles };
  });

type TimelineRow = { date: string; text: string; title?: string };
type FaqRow = { q: string; a: string };

function coerceTimeline(value: unknown): TimelineRow[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const out: TimelineRow[] = [];
  for (const v of value) {
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      const date = typeof o.date === "string" ? o.date : null;
      const text = typeof o.text === "string" ? o.text : null;
      if (date && text) {
        out.push({ date, text, title: typeof o.title === "string" ? o.title : undefined });
      }
    }
  }
  return out.length ? out : undefined;
}

function coerceFaq(value: unknown): FaqRow[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const out: FaqRow[] = [];
  for (const v of value) {
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      const q = typeof o.q === "string" ? o.q : null;
      const a = typeof o.a === "string" ? o.a : null;
      if (q && a) out.push({ q, a });
    }
  }
  return out.length ? out : undefined;
}

export const getPublishedArticle = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z.object({ type: typeSchema, slug: z.string().min(1).max(200) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const nowIso = new Date().toISOString();
    const { data: row, error } = await supabaseAdmin
      .from("articles")
      .select(
        "id, type, slug, title, subtitle, body, category, cover_url, primary_source_label, primary_source_url, publish_at, last_verified_at, updated_at, author_id, reviewer_id, status, reading_minutes, understand, lessons, timeline, faq, related_laws, related_signal_tags, national_context, action_steps, warning_indicators, severity_level, impact_summary, source_confidence, ai_summary, executive_summary, why_it_matters, how_to_act",
      )
      .eq("type", data.type)
      .eq("slug", data.slug)
      .eq("status", "published")
      .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
      .maybeSingle();
    if (error) { console.error("[content] supabase error", error); throw new Error("Não foi possível carregar o conteúdo."); }
    if (!row) {
      // Fallback: conteúdo estático curado em src/content (casos/notícias).
      if (data.type === "case" || data.type === "news") {
        const { getStaticArticle } = await import("@/content/staticArticles");
        const stat = getStaticArticle(data.type, data.slug);
        if (stat) return { article: stat as PublicArticleDetail };
      }
      return { article: null };
    }

    const [{ data: sources }, { data: profs }] = await Promise.all([
      supabaseAdmin
        .from("article_sources")
        .select("id, label, url, position")
        .eq("article_id", row.id)
        .order("position", { ascending: true }),
      supabaseAdmin
        .from("public_author_profiles")
        .select("id, display_name")
        .in("id", [row.author_id, row.reviewer_id].filter((v): v is string => Boolean(v))),
    ]);

    const profilesById = new Map<string, string>();
    profs?.forEach((p) => profilesById.set(p.id, p.display_name ?? ""));

    const article: PublicArticleDetail = {
      id: row.id,
      type: row.type as PublicArticleDetail["type"],
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle,
      body: row.body,
      category: row.category,
      cover_url: row.cover_url,
      primary_source_label: row.primary_source_label,
      primary_source_url: row.primary_source_url,
      publish_at: row.publish_at,
      last_verified_at: row.last_verified_at,
      updated_at: row.updated_at,
      author_name: row.author_id ? profilesById.get(row.author_id) ?? null : null,
      reviewer_name: row.reviewer_id ? profilesById.get(row.reviewer_id) ?? null : null,
      sources: (sources ?? []).map((s) => ({
        id: s.id,
        label: s.label,
        url: s.url,
        position: s.position,
      })),
      reading_minutes: row.reading_minutes,
      understand: row.understand,
      lessons: row.lessons,
      timeline: coerceTimeline(row.timeline),
      faq: coerceFaq(row.faq) ?? null,
      related_laws: row.related_laws,
      related_signal_tags: row.related_signal_tags,
      national_context: row.national_context,
      action_steps: (row as { action_steps?: string[] | null }).action_steps ?? null,
      warning_indicators: (row as { warning_indicators?: string[] | null }).warning_indicators ?? null,
      severity_level: (row as { severity_level?: PublicArticleDetail["severity_level"] }).severity_level ?? null,
      impact_summary: (row as { impact_summary?: string | null }).impact_summary ?? null,
      source_confidence: (row as { source_confidence?: PublicArticleDetail["source_confidence"] }).source_confidence ?? null,
      ai_summary: (row as { ai_summary?: string | null }).ai_summary ?? null,
      executive_summary: coerceStringArray((row as { executive_summary?: unknown }).executive_summary),
      why_it_matters: (row as { why_it_matters?: string | null }).why_it_matters ?? null,
      how_to_act: coerceHowToAct((row as { how_to_act?: unknown }).how_to_act),
    };
    return { article };
  });

export const listLatestForHome = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const nowIso = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select(
      "id, type, slug, title, subtitle, category, cover_url, primary_source_label, primary_source_url, publish_at, updated_at",
    )
    .in("type", ["news", "case"])
    .eq("status", "published")
    .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
    .order("publish_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .limit(5);
  if (error) { console.error("[content] supabase error", error); throw new Error("Não foi possível carregar o conteúdo."); }
  return { latest: data ?? [] };
});

export interface PublicLibraryItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  audience: string;
  source_org: string;
  year: number;
  file_url: string;
  updated_at: string;
}

export const listPublishedLibrary = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("library_items")
    .select("id, title, description, category, audience, source_org, year, file_url, updated_at")
    .order("year", { ascending: false })
    .order("updated_at", { ascending: false });
  if (error) { console.error("[library] supabase error", error); throw new Error("Não foi possível carregar a biblioteca."); }
  return { items: (data ?? []) as PublicLibraryItem[] };
});

export const listRelatedArticles = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        type: typeSchema,
        category: z.string().nullable().optional(),
        limit: z.number().int().min(1).max(6).default(3),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const nowIso = new Date().toISOString();
    const baseSelect = "id, slug, title, subtitle, cover_url, category, publish_at, updated_at";
    const run = async (withCategory: boolean) => {
      let q = supabaseAdmin
        .from("articles")
        .select(baseSelect)
        .eq("type", data.type)
        .eq("status", "published")
        .neq("id", data.id)
        .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
        .order("publish_at", { ascending: false, nullsFirst: false })
        .limit(data.limit);
      if (withCategory && data.category) q = q.eq("category", data.category);
      const { data: rows, error } = await q;
      if (error) throw new Error(error.message);
      return rows ?? [];
    };
    const related = data.category ? await run(true) : [];
    if (related.length < data.limit) {
      const fillers = await run(false);
      const seen = new Set(related.map((r) => r.id));
      for (const f of fillers) {
        if (related.length >= data.limit) break;
        if (!seen.has(f.id)) related.push(f);
      }
    }
    return { related };
  });

/* ─────────── Relações editoriais e leitura cruzada ─────────── */

export interface CrossArticleSummary {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  cover_url: string | null;
  category: string | null;
  publish_at: string | null;
  updated_at: string;
}

export interface ArticleRelations {
  /** Outras notícias relacionadas (mesma categoria ou mais recentes). */
  relatedNews: CrossArticleSummary[];
  /** Casos relacionados (cruzados a partir de notícias, ou siblings em casos). */
  relatedCases: CrossArticleSummary[];
  /** Materiais curados da biblioteca cuja categoria/audiência casa com o tema. */
  library: {
    slug: string;
    title: string;
    description: string;
    category: string;
    audience: string;
    sourceOrg: string;
    year: number;
  }[];
  /** Card de "Para Pais" derivado de notícias categorizadas. */
  parents?: CrossArticleSummary | null;
  /** Card de "Para Escolas". */
  schools?: CrossArticleSummary | null;
}

export const getArticleRelations = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        type: typeSchema,
        category: z.string().nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const nowIso = new Date().toISOString();
    const baseSelect =
      "id, slug, title, subtitle, cover_url, category, publish_at, updated_at";

    const queryByType = async (type: "news" | "case", limit: number) => {
      let q = supabaseAdmin
        .from("articles")
        .select(baseSelect)
        .eq("type", type)
        .eq("status", "published")
        .neq("id", data.id)
        .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
        .order("publish_at", { ascending: false, nullsFirst: false })
        .limit(limit);
      if (data.category) q = q.eq("category", data.category);
      const { data: rows } = await q;
      if (rows && rows.length >= limit) return rows;
      // Fallback sem categoria
      const { data: fillers } = await supabaseAdmin
        .from("articles")
        .select(baseSelect)
        .eq("type", type)
        .eq("status", "published")
        .neq("id", data.id)
        .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
        .order("publish_at", { ascending: false, nullsFirst: false })
        .limit(limit);
      const seen = new Set((rows ?? []).map((r) => r.id));
      const merged = [...(rows ?? [])];
      for (const f of fillers ?? []) {
        if (merged.length >= limit) break;
        if (!seen.has(f.id)) merged.push(f);
      }
      return merged;
    };

    const wantNews = data.type === "case" ? 3 : 3;
    const wantCases = data.type === "news" ? 3 : 3;

    const [news, cases, lib] = await Promise.all([
      queryByType("news", wantNews),
      queryByType("case", wantCases),
      supabaseAdmin
        .from("library_items")
        .select("id, title, description, category, audience, source_org, year, file_url, updated_at")
        .order("year", { ascending: false })
        .limit(60),
    ]);

    // Cruza biblioteca por categoria do artigo, se houver
    const libraryItems = (lib.data ?? [])
      .filter((it) =>
        data.category
          ? it.category?.toLowerCase().includes(data.category.toLowerCase()) ||
            it.audience?.toLowerCase().includes(data.category.toLowerCase())
          : true,
      )
      .slice(0, 4)
      .map((it) => ({
        slug: it.id, // biblioteca pública navega por id; mapeada no consumidor
        title: it.title,
        description: it.description ?? "",
        category: it.category,
        audience: it.audience,
        sourceOrg: it.source_org,
        year: it.year,
      }));

    return {
      relatedNews: data.type === "news"
        ? news.filter((n) => n.id !== data.id) as CrossArticleSummary[]
        : news as CrossArticleSummary[],
      relatedCases: data.type === "case"
        ? cases.filter((c) => c.id !== data.id) as CrossArticleSummary[]
        : cases as CrossArticleSummary[],
      library: libraryItems,
      parents: (news[0] ?? null) as CrossArticleSummary | null,
      schools: (news[1] ?? null) as CrossArticleSummary | null,
    } satisfies ArticleRelations;
  });

export const getArticleSiblings = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z
      .object({
        type: typeSchema,
        publishAt: z.string(),
        id: z.string().uuid(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const nowIso = new Date().toISOString();
    const [{ data: prevRows }, { data: nextRows }] = await Promise.all([
      supabaseAdmin
        .from("articles")
        .select("id, slug, title, publish_at")
        .eq("type", data.type)
        .eq("status", "published")
        .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
        .neq("id", data.id)
        .lt("publish_at", data.publishAt)
        .order("publish_at", { ascending: false })
        .limit(1),
      supabaseAdmin
        .from("articles")
        .select("id, slug, title, publish_at")
        .eq("type", data.type)
        .eq("status", "published")
        .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
        .neq("id", data.id)
        .gt("publish_at", data.publishAt)
        .order("publish_at", { ascending: true })
        .limit(1),
    ]);
    return {
      prev: prevRows?.[0] ? { slug: prevRows[0].slug, title: prevRows[0].title } : null,
      next: nextRows?.[0] ? { slug: nextRows[0].slug, title: nextRows[0].title } : null,
    };
  });

export const listAllPublishedForSitemap = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const nowIso = new Date().toISOString();
  const [{ data: articles }, { data: libs }] = await Promise.all([
    supabaseAdmin
      .from("articles")
      .select("type, slug, updated_at, publish_at")
      .eq("status", "published")
      .or(`publish_at.is.null,publish_at.lte.${nowIso}`),
    supabaseAdmin.from("library_items").select("id, updated_at"),
  ]);
  return { articles: articles ?? [], libraryItems: libs ?? [] };
});
