import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireRole } from "@/lib/require-role";

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
});

export const upsertAdminArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => upsertSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireRole(context.supabase, context.userId, ["admin", "editor"]);
    const { sources, ...rest } = data;
    const payload = {
      ...rest,
      cover_url: rest.cover_url || null,
      primary_source_url: rest.primary_source_url || null,
      publish_at: rest.publish_at || null,
      last_verified_at: rest.last_verified_at || null,
      author_id: context.userId,
    };
    let articleId = data.id;
    if (articleId) {
      const { data: row, error } = await context.supabase
        .from("articles")
        .update(payload)
        .eq("id", articleId)
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
    return { article: full as AdminArticle };
  });

export const deleteAdminArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireRole(context.supabase, context.userId, ["admin"]);
    const { error } = await context.supabase.from("articles").delete().eq("id", data.id);
    if (error) {
      console.error("[admin.deleteArticle] supabase error", error);
      throw new Error("Não foi possível excluir o conteúdo.");
    }
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
