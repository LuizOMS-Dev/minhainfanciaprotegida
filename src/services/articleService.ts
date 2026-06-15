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


import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireRole } from "@/services/roleService";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";

const articleTypeSchema = z.enum(["news", "case", "risk", "guide"]);
const statusSchema = z.enum(["draft", "review", "scheduled", "published", "archived"]);

export interface AdminArticle {
  id: string;
  type: "news" | "case" | "risk" | "guide";
  title: string;
  subtitle: string | null;
  slug: string;
  category: string | null;
  body: string | null;
  cover_url: string | null;
  primary_source_label: string | null;
  primary_source_url: string | null;
  status: "draft" | "review" | "scheduled" | "published" | "archived";
  publish_at: string | null;
  last_verified_at: string | null;
  author_id: string | null;
  reviewer_id: string | null;
  created_at: string;
  updated_at: string;
  /** Campos editoriais avançados. */
  reading_minutes: number | null;
  understand: string | null;
  lessons: string | null;
  timeline: { date: string; text: string; title?: string }[] | null;
  faq: { q: string; a: string }[] | null;
  related_laws: string[] | null;
  related_signal_tags: string[] | null;
  national_context: string[] | null;
  /** Fase 1 — ação, alerta, gravidade, impacto, confiança, resumo IA. */
  action_steps: string[] | null;
  warning_indicators: string[] | null;
  severity_level: "baixo" | "medio" | "alto" | "gravissimo" | null;
  impact_summary: string | null;
  source_confidence: "alta" | "media" | "baixa" | null;
  ai_summary: string | null;
}

export const listAdminArticles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ type: articleTypeSchema.optional() }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    await requireRole(context.supabase, context.userId, ["admin", "editor", "revisor"]);
    let q = context.supabase
      .from("articles")
      .select("*")
      .order("updated_at", { ascending: false });
    if (data.type) q = q.eq("type", data.type);
    const { data: rows, error } = await q;
    if (error) {
      console.error("[admin.listArticles] supabase error", error);
      throw new Error("Não foi possível carregar os conteúdos.");
    }
    return { articles: (rows ?? []) as AdminArticle[] };
  });

export const getAdminArticle = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireRole(context.supabase, context.userId, ["admin", "editor", "revisor"]);
    const { data: row, error } = await context.supabase
      .from("articles")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) {
      console.error("[admin.getArticle] supabase error", error);
      throw new Error("Não foi possível carregar o conteúdo.");
    }
    return { article: row as AdminArticle | null };
  });

// Only allow safe web URL protocols to prevent stored XSS via javascript:/data: URIs
const safeHttpUrl = z
  .string()
  .url()
  .refine((v) => /^https?:\/\//i.test(v), {
    message: "Apenas URLs http(s) são permitidas.",
  });

const sourceSchema = z.object({
  label: z.string().min(1).max(255),
  url: safeHttpUrl,
  position: z.number().int().min(0).max(999).default(0),
});

const timelineSchema = z
  .array(
    z.object({
      date: z.string().min(1).max(40),
      text: z.string().min(1).max(800),
      title: z.string().max(200).optional(),
    }),
  )
  .max(50);

const faqSchema = z
  .array(
    z.object({
      q: z.string().min(1).max(300),
      a: z.string().min(1).max(4000),
    }),
  )
  .max(30);

const slugListSchema = z.array(z.string().min(1).max(80)).max(30);
const actionStepsSchema = z.array(z.string().min(1).max(200)).max(20);
const warningIndicatorsSchema = z.array(z.string().min(1).max(120)).max(20);
const severitySchema = z.enum(["baixo", "medio", "alto", "gravissimo"]);
const confidenceSchema = z.enum(["alta", "media", "baixa"]);

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  type: articleTypeSchema,
  title: z.string().min(3).max(255),
  subtitle: z.string().max(500).optional().nullable(),
  slug: z.string().min(2).max(180).regex(/^[a-z0-9-]+$/),
  category: z.string().max(80).optional().nullable(),
  body: z.string().max(20000).optional().nullable(),
  cover_url: safeHttpUrl.optional().nullable().or(z.literal("")),
  primary_source_label: z.string().max(255).optional().nullable(),
  primary_source_url: safeHttpUrl.optional().nullable().or(z.literal("")),
  status: statusSchema,
  publish_at: z.string().datetime().optional().nullable().or(z.literal("")),
  last_verified_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable().or(z.literal("")),
  sources: z.array(sourceSchema).max(50).optional(),
  // Editoriais avançados
  reading_minutes: z.number().int().min(1).max(120).optional().nullable(),
  understand: z.string().max(8000).optional().nullable(),
  lessons: z.string().max(8000).optional().nullable(),
  timeline: timelineSchema.optional().nullable(),
  faq: faqSchema.optional().nullable(),
  related_laws: slugListSchema.optional().nullable(),
  related_signal_tags: slugListSchema.optional().nullable(),
  national_context: slugListSchema.optional().nullable(),
  // Fase 1 — ação, alerta, gravidade, impacto, confiança, resumo IA
  action_steps: actionStepsSchema.optional().nullable(),
  warning_indicators: warningIndicatorsSchema.optional().nullable(),
  severity_level: severitySchema.optional().nullable().or(z.literal("")),
  impact_summary: z.string().max(4000).optional().nullable(),
  source_confidence: confidenceSchema.optional().nullable().or(z.literal("")),
  ai_summary: z.string().max(1500).optional().nullable(),
});

export const upsertAdminArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => upsertSchema.parse(input) as z.infer<typeof upsertSchema>)
  .handler(async ({ data, context }) => {
    await requireRole(context.supabase, context.userId, ["admin", "editor"]);
    const { sources, ...rest } = data;
    const payload = {
      ...rest,
      body: rest.body == null ? rest.body : sanitizeArticleHtml(rest.body),
      cover_url: rest.cover_url || null,
      primary_source_url: rest.primary_source_url || null,
      publish_at: rest.publish_at || null,
      last_verified_at: rest.last_verified_at || null,
      severity_level: rest.severity_level || null,
      source_confidence: rest.source_confidence || null,
      author_id: context.userId,
    };
    let articleId = data.id;
    const isUpdate = Boolean(articleId);
    let prevStatus: string | null = null;
    if (isUpdate) {
      const { data: prev } = await context.supabase
        .from("articles")
        .select("status")
        .eq("id", articleId!)
        .maybeSingle();
      prevStatus = prev?.status ?? null;
      const { data: row, error } = await context.supabase
        .from("articles")
        .update(payload)
        .eq("id", articleId as string)
        .select()
        .single();
      if (error) {
        console.error("[admin.upsertArticle] update error", error);
        throw new Error("Não foi possível salvar o conteúdo.");
      }
      articleId = row.id;
    } else {
      const { data: row, error } = await context.supabase
        .from("articles")
        .insert(payload)
        .select()
        .single();
      if (error) {
        console.error("[admin.upsertArticle] insert error", error);
        throw new Error("Não foi possível salvar o conteúdo.");
      }
      articleId = row.id;
    }

    if (sources) {
      const { error: delErr } = await context.supabase
        .from("article_sources")
        .delete()
        .eq("article_id", articleId);
      if (delErr) {
        console.error("[admin.upsertArticle] sources delete error", delErr);
        throw new Error("Não foi possível atualizar as fontes.");
      }
      if (sources.length > 0) {
        const { error: insErr } = await context.supabase
          .from("article_sources")
          .insert(
            sources.map((s, i) => ({
              article_id: articleId,
              label: s.label,
              url: s.url,
              position: s.position ?? i,
            })),
          );
        if (insErr) {
          console.error("[admin.upsertArticle] sources insert error", insErr);
          throw new Error("Não foi possível salvar as fontes.");
        }
      }
    }

    const { data: full, error: fetchErr } = await context.supabase
      .from("articles")
      .select("*")
      .eq("id", articleId)
      .single();
    if (fetchErr) {
      console.error("[admin.upsertArticle] refetch error", fetchErr);
      throw new Error("Não foi possível recarregar o conteúdo salvo.");
    }

    const { logAudit } = await import("@/lib/audit.server");
    const becamePublished = data.status === "published" && prevStatus !== "published";
    const becameUnpublished = prevStatus === "published" && data.status !== "published";
    const action = !isUpdate
      ? "content_create"
      : becamePublished
        ? "content_publish"
        : becameUnpublished
          ? "content_unpublish"
          : "content_update";
    logAudit({
      action,
      userId: context.userId,
      targetType: `article:${data.type}`,
      targetId: articleId,
      targetTitle: data.title,
      metadata: { status: data.status, slug: data.slug },
    });

    return { article: full as AdminArticle };
  });

export const deleteAdminArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireRole(context.supabase, context.userId, ["admin"]);
    const { data: prev } = await context.supabase
      .from("articles")
      .select("title, type")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await context.supabase.from("articles").delete().eq("id", data.id);
    if (error) {
      console.error("[admin.deleteArticle] supabase error", error);
      throw new Error("Não foi possível excluir o conteúdo.");
    }
    const { logAudit } = await import("@/lib/audit.server");
    logAudit({
      action: "content_delete",
      userId: context.userId,
      targetType: prev?.type ? `article:${prev.type}` : "article",
      targetId: data.id,
      targetTitle: prev?.title ?? null,
    });
    return { ok: true };
  });

/**
 * Self-promote to admin ONLY if there are no admins yet (first user wins).
 * Subsequent admins must be added by an existing admin.
 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Use the admin client so RLS doesn't hide existing admin rows from the
    // current user (which would otherwise let any signed-in user claim admin).
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) {
      console.error("[claimFirstAdmin] count error", countErr);
      throw new Error("Não foi possível validar a reivindicação de administrador.");
    }
    if ((count ?? 0) > 0) {
      return { claimed: false, reason: "already_has_admin" as const };
    }
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) {
      console.error("[claimFirstAdmin] insert error", error);
      throw new Error("Não foi possível registrar o administrador inicial.");
    }
    return { claimed: true };
  });

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) {
      console.error("[getMyRoles] supabase error", error);
      throw new Error("Não foi possível carregar os papéis.");
    }
    return { roles: (data ?? []).map((r) => r.role as string) };
  });
