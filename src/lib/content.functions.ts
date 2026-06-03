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
    if (!row) return { article: null };

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
