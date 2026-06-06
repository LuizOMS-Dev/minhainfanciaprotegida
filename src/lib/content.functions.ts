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
  timeline?: { date: string; text: string }[];
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
        .from("profiles")
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
        "id, type, slug, title, subtitle, body, category, cover_url, primary_source_label, primary_source_url, publish_at, last_verified_at, updated_at, author_id, reviewer_id, status",
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
        .from("profiles")
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

