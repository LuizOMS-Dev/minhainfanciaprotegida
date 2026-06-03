import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
    let q = context.supabase
      .from("articles")
      .select("*")
      .order("updated_at", { ascending: false });
    if (data.type) q = q.eq("type", data.type);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { articles: (rows ?? []) as AdminArticle[] };
  });

export const getAdminArticle = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("articles")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { article: row as AdminArticle | null };
  });

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  type: articleTypeSchema,
  title: z.string().min(3).max(255),
  subtitle: z.string().max(500).optional().nullable(),
  slug: z.string().min(2).max(180).regex(/^[a-z0-9-]+$/),
  category: z.string().max(80).optional().nullable(),
  body: z.string().max(20000).optional().nullable(),
  cover_url: z.string().url().optional().nullable().or(z.literal("")),
  primary_source_label: z.string().max(255).optional().nullable(),
  primary_source_url: z.string().url().optional().nullable().or(z.literal("")),
  status: statusSchema,
  publish_at: z.string().datetime().optional().nullable().or(z.literal("")),
  last_verified_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable().or(z.literal("")),
});

export const upsertAdminArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => upsertSchema.parse(input))
  .handler(async ({ data, context }) => {
    const payload = {
      ...data,
      cover_url: data.cover_url || null,
      primary_source_url: data.primary_source_url || null,
      publish_at: data.publish_at || null,
      last_verified_at: data.last_verified_at || null,
      author_id: context.userId,
    };
    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("articles")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return { article: row as AdminArticle };
    }
    const { data: row, error } = await context.supabase
      .from("articles")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { article: row as AdminArticle };
  });

export const deleteAdminArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("articles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Self-promote to admin ONLY if there are no admins yet (first user wins).
 * Subsequent admins must be added by an existing admin.
 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { count, error: countErr } = await context.supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(countErr.message);
    if ((count ?? 0) > 0) {
      return { claimed: false, reason: "already_has_admin" as const };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { claimed: true };
  });

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { roles: (data ?? []).map((r) => r.role as string) };
  });
