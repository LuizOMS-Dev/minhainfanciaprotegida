import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireAdminContext } from "@/lib/require-admin";

const postTypeSchema = z.enum(["feed", "carousel", "reel", "story"]);
const editableStatusSchema = z.enum(["draft", "review", "scheduled"]);
const postStatusSchema = z.enum([
  "draft",
  "review",
  "scheduled",
  "publishing",
  "published",
  "failed",
  "cancelled",
]);

const safeHttpUrl = z
  .string()
  .url()
  .refine((v) => /^https:\/\//i.test(v), {
    message: "Use uma URL publica HTTPS para midia enviada a Meta.",
  });

const mediaSchema = z.object({
  kind: z.enum(["image", "video"]),
  url: safeHttpUrl.optional().or(z.literal("")),
  alt: z.string().max(250).optional().nullable(),
});

const upsertPostSchema = z.object({
  id: z.string().uuid().optional(),
  type: postTypeSchema,
  title: z.string().min(3).max(180),
  caption: z.string().max(2200).optional().nullable(),
  hashtags: z.array(z.string().min(1).max(80)).max(30).default([]),
  media: z.array(mediaSchema).max(10).default([]),
  scheduled_at: z.string().datetime().optional().nullable().or(z.literal("")),
  status: editableStatusSchema.default("draft"),
});

export type InstagramPostType = z.infer<typeof postTypeSchema>;
export type InstagramPostStatus = z.infer<typeof postStatusSchema>;

export interface InstagramSocialAccount {
  id: string;
  provider: "instagram";
  ig_user_id: string | null;
  username: string | null;
  account_name: string | null;
  account_type: string | null;
  scopes: string[] | unknown;
  token_expires_at: string | null;
  status: string;
  last_test_at: string | null;
  last_error: string | null;
  updated_at: string;
}

export interface InstagramPost {
  id: string;
  social_account_id: string | null;
  type: InstagramPostType;
  title: string;
  caption: string | null;
  hashtags: string[];
  media: { kind: "image" | "video"; url?: string; alt?: string | null }[];
  scheduled_at: string | null;
  status: InstagramPostStatus;
  publish_attempts: number;
  instagram_media_id: string | null;
  permalink: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface InstagramPublishLog {
  id: string;
  post_id: string | null;
  action: string;
  status: "success" | "failed" | "blocked" | "info";
  error_code: string | null;
  error_message: string | null;
  created_at: string;
}

function db(client: unknown) {
  return client as {
    from: (table: string) => any;
  };
}

function isMissingInstagramSchema(error: unknown) {
  const e = error as { code?: string; message?: string } | null;
  return e?.code === "42P01" || /does not exist|schema cache/i.test(e?.message ?? "");
}

function normalizeHashtags(values: string[]) {
  const seen = new Set<string>();
  const clean: string[] = [];
  for (const raw of values) {
    const tag = raw.trim().replace(/^#/, "").toLowerCase();
    if (!tag || seen.has(tag)) continue;
    if (!/^[a-z0-9_-]+$/i.test(tag)) continue;
    seen.add(tag);
    clean.push(tag);
  }
  return clean.slice(0, 30);
}

async function requireInstagramAdmin(context: {
  supabase: unknown;
  userId: string;
  claims: { aal?: string; email?: string };
}) {
  await requireAdminContext(context as never, { roles: ["admin"], requireMfa: true });
}

async function logInstagramEvent(args: {
  supabase: unknown;
  postId?: string | null;
  accountId?: string | null;
  action: string;
  status: "success" | "failed" | "blocked" | "info";
  errorCode?: string | null;
  errorMessage?: string | null;
  createdBy?: string | null;
  request?: Record<string, unknown> | null;
  response?: Record<string, unknown> | null;
}) {
  const { error } = await db(args.supabase).from("instagram_publish_logs").insert({
    post_id: args.postId ?? null,
    social_account_id: args.accountId ?? null,
    action: args.action,
    status: args.status,
    error_code: args.errorCode ?? null,
    error_message: args.errorMessage ?? null,
    created_by: args.createdBy ?? null,
    request_payload_safe: args.request ?? null,
    response_payload_safe: args.response ?? null,
  });
  if (error && !isMissingInstagramSchema(error)) {
    console.warn("[instagram.log] safe log failed", error);
  }
}

function publishingEnabled() {
  return process.env.INSTAGRAM_AUTO_PUBLISH_ENABLED === "true";
}

function oauthConfigured() {
  return Boolean(
    process.env.INSTAGRAM_APP_ID &&
      process.env.INSTAGRAM_APP_SECRET &&
      process.env.INSTAGRAM_REDIRECT_URI &&
      process.env.INSTAGRAM_TOKEN_ENCRYPTION_KEY,
  );
}

export const getInstagramDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireInstagramAdmin(context);

    const accountQ = await db(context.supabase)
      .from("social_accounts")
      .select("id, provider, ig_user_id, username, account_name, account_type, scopes, token_expires_at, status, last_test_at, last_error, updated_at")
      .eq("provider", "instagram")
      .is("disconnected_at", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (accountQ.error) {
      if (isMissingInstagramSchema(accountQ.error)) {
        return {
          schemaReady: false,
          account: null as InstagramSocialAccount | null,
          counts: { draft: 0, review: 0, scheduled: 0, published: 0, failed: 0, cancelled: 0 },
          capabilities: {
            feed: "planned",
            carousel: "planned",
            reel: "planned",
            story: "blocked",
          },
          config: {
            oauthConfigured: oauthConfigured(),
            publishingEnabled: publishingEnabled(),
          },
        };
      }
      console.error("[instagram.dashboard] account error", accountQ.error);
      throw new Error("Nao foi possivel carregar a conexao do Instagram.");
    }

    const postsQ = await db(context.supabase)
      .from("instagram_posts")
      .select("status")
      .limit(500);

    if (postsQ.error) {
      console.error("[instagram.dashboard] posts error", postsQ.error);
      throw new Error("Nao foi possivel carregar o resumo do Instagram.");
    }

    const counts = { draft: 0, review: 0, scheduled: 0, published: 0, failed: 0, cancelled: 0 };
    for (const row of postsQ.data ?? []) {
      const key = row.status as keyof typeof counts;
      if (key in counts) counts[key] += 1;
    }

    return {
      schemaReady: true,
      account: (accountQ.data ?? null) as InstagramSocialAccount | null,
      counts,
      capabilities: {
        feed: "planned",
        carousel: "planned",
        reel: "planned",
        story: "blocked",
      },
      config: {
        oauthConfigured: oauthConfigured(),
        publishingEnabled: publishingEnabled(),
      },
    };
  });

export const listInstagramPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ status: postStatusSchema.optional() }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    await requireInstagramAdmin(context);

    let q = db(context.supabase)
      .from("instagram_posts")
      .select("id, social_account_id, type, title, caption, hashtags, media, scheduled_at, status, publish_attempts, instagram_media_id, permalink, last_error, created_at, updated_at, published_at")
      .order("scheduled_at", { ascending: true, nullsFirst: false })
      .order("updated_at", { ascending: false })
      .limit(100);
    if (data.status) q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) {
      if (isMissingInstagramSchema(error)) return { schemaReady: false, posts: [] as InstagramPost[] };
      console.error("[instagram.listPosts] supabase error", error);
      throw new Error("Nao foi possivel carregar publicacoes do Instagram.");
    }
    return { schemaReady: true, posts: (rows ?? []) as InstagramPost[] };
  });

export const listInstagramLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ postId: z.string().uuid().optional() }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    await requireInstagramAdmin(context);

    let q = db(context.supabase)
      .from("instagram_publish_logs")
      .select("id, post_id, action, status, error_code, error_message, created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    if (data.postId) q = q.eq("post_id", data.postId);
    const { data: rows, error } = await q;
    if (error) {
      if (isMissingInstagramSchema(error)) return { schemaReady: false, logs: [] as InstagramPublishLog[] };
      console.error("[instagram.listLogs] supabase error", error);
      throw new Error("Nao foi possivel carregar logs do Instagram.");
    }
    return { schemaReady: true, logs: (rows ?? []) as InstagramPublishLog[] };
  });

export const upsertInstagramPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => upsertPostSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireInstagramAdmin(context);
    if (data.type === "story") {
      throw new Error("Stories seguem bloqueados ate confirmacao oficial da Meta para esta conta.");
    }
    if (data.status === "scheduled" && !data.scheduled_at) {
      throw new Error("Informe data e hora para agendar a publicacao.");
    }

    const payload = {
      type: data.type,
      title: data.title.trim(),
      caption: data.caption?.trim() || null,
      hashtags: normalizeHashtags(data.hashtags),
      media: data.media.map((m) => ({
        kind: m.kind,
        url: m.url || null,
        alt: m.alt?.trim() || null,
      })),
      scheduled_at: data.scheduled_at || null,
      status: data.status,
      approved_by: data.status === "scheduled" ? context.userId : null,
      last_error: null,
    };

    let row: unknown;
    if (data.id) {
      const existing = await db(context.supabase)
        .from("instagram_posts")
        .select("status")
        .eq("id", data.id)
        .maybeSingle();
      if (existing.error) {
        if (isMissingInstagramSchema(existing.error)) {
          throw new Error("A migration do Instagram ainda nao foi aplicada no Supabase.");
        }
        throw new Error("Nao foi possivel validar a publicacao.");
      }
      if (["publishing", "published"].includes(existing.data?.status)) {
        throw new Error("Publicacoes ja publicadas ou em envio nao podem ser editadas.");
      }

      const { data: updated, error } = await db(context.supabase)
        .from("instagram_posts")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) {
        if (isMissingInstagramSchema(error)) {
          throw new Error("A migration do Instagram ainda nao foi aplicada no Supabase.");
        }
        console.error("[instagram.upsert] update error", error);
        throw new Error("Nao foi possivel salvar a publicacao.");
      }
      row = updated;
    } else {
      const { data: inserted, error } = await db(context.supabase)
        .from("instagram_posts")
        .insert({ ...payload, created_by: context.userId })
        .select()
        .single();
      if (error) {
        if (isMissingInstagramSchema(error)) {
          throw new Error("A migration do Instagram ainda nao foi aplicada no Supabase.");
        }
        console.error("[instagram.upsert] insert error", error);
        throw new Error("Nao foi possivel criar a publicacao.");
      }
      row = inserted;
    }

    const { logAudit } = await import("@/lib/audit.server");
    await logAudit({
      action: data.id ? "content_update" : "content_create",
      userId: context.userId,
      targetType: "instagram_post",
      targetId: (row as { id?: string }).id ?? data.id ?? null,
      targetTitle: data.title,
      metadata: { status: data.status, type: data.type },
    });

    return { post: row as InstagramPost };
  });

export const deleteInstagramPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireInstagramAdmin(context);
    const { data: prev, error: prevErr } = await db(context.supabase)
      .from("instagram_posts")
      .select("title, status")
      .eq("id", data.id)
      .maybeSingle();
    if (prevErr) {
      if (isMissingInstagramSchema(prevErr)) throw new Error("A migration do Instagram ainda nao foi aplicada no Supabase.");
      throw new Error("Nao foi possivel validar a publicacao.");
    }
    if (!prev) return { ok: true };
    if (!["draft", "review", "failed", "cancelled"].includes(prev.status)) {
      throw new Error("Somente rascunhos, revisoes, falhas ou canceladas podem ser excluidas.");
    }
    const { error } = await db(context.supabase).from("instagram_posts").delete().eq("id", data.id);
    if (error) {
      console.error("[instagram.delete] supabase error", error);
      throw new Error("Nao foi possivel excluir a publicacao.");
    }
    const { logAudit } = await import("@/lib/audit.server");
    await logAudit({
      action: "content_delete",
      userId: context.userId,
      targetType: "instagram_post",
      targetId: data.id,
      targetTitle: prev.title,
    });
    return { ok: true };
  });

export const cancelInstagramPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireInstagramAdmin(context);
    const { data: row, error } = await db(context.supabase)
      .from("instagram_posts")
      .update({ status: "cancelled", publish_lock: null, publish_locked_at: null })
      .eq("id", data.id)
      .in("status", ["draft", "review", "scheduled", "failed"])
      .select()
      .single();
    if (error) {
      if (isMissingInstagramSchema(error)) throw new Error("A migration do Instagram ainda nao foi aplicada no Supabase.");
      console.error("[instagram.cancel] supabase error", error);
      throw new Error("Nao foi possivel cancelar a publicacao.");
    }
    await logInstagramEvent({
      supabase: context.supabase,
      postId: data.id,
      action: "cancel",
      status: "info",
      createdBy: context.userId,
    });
    return { post: row as InstagramPost };
  });

export const testInstagramConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireInstagramAdmin(context);
    const { data: account, error } = await db(context.supabase)
      .from("social_accounts")
      .select("id, status, token_ciphertext, token_expires_at")
      .eq("provider", "instagram")
      .is("disconnected_at", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      if (isMissingInstagramSchema(error)) {
        throw new Error("A migration do Instagram ainda nao foi aplicada no Supabase.");
      }
      throw new Error("Nao foi possivel carregar a conexao.");
    }
    if (!account) {
      return { ok: false, reason: "Nenhuma conta Instagram conectada." };
    }
    if (!oauthConfigured()) {
      await logInstagramEvent({
        supabase: context.supabase,
        accountId: account.id,
        action: "test_connection",
        status: "blocked",
        errorCode: "oauth_not_configured",
        errorMessage: "Variaveis Meta/OAuth ausentes.",
        createdBy: context.userId,
      });
      return { ok: false, reason: "OAuth da Meta ainda nao configurado no servidor." };
    }
    if (!account.token_ciphertext) {
      return { ok: false, reason: "Token criptografado ausente. Reconecte a conta." };
    }
    return { ok: false, reason: "Teste real bloqueado ate a fase OAuth/token vault ser homologada." };
  });

export const publishInstagramPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireInstagramAdmin(context);

    const { data: post, error } = await db(context.supabase)
      .from("instagram_posts")
      .select("id, social_account_id, type, title, status, media, scheduled_at, publish_attempts")
      .eq("id", data.id)
      .maybeSingle();
    if (error) {
      if (isMissingInstagramSchema(error)) throw new Error("A migration do Instagram ainda nao foi aplicada no Supabase.");
      throw new Error("Nao foi possivel carregar a publicacao.");
    }
    if (!post) throw new Error("Publicacao nao encontrada.");
    if (post.type === "story") throw new Error("Stories seguem bloqueados para esta conta.");
    if (post.status === "published") return { ok: true, reason: "already_published" as const };
    if (!["scheduled", "review", "failed"].includes(post.status)) {
      throw new Error("A publicacao precisa estar em revisao, agendada ou com falha para publicar.");
    }
    if (!Array.isArray(post.media) || post.media.length === 0) {
      throw new Error("Adicione pelo menos uma midia antes de publicar.");
    }
    if (!publishingEnabled()) {
      await logInstagramEvent({
        supabase: context.supabase,
        postId: data.id,
        accountId: post.social_account_id,
        action: "publish",
        status: "blocked",
        errorCode: "publishing_disabled",
        errorMessage: "INSTAGRAM_AUTO_PUBLISH_ENABLED nao esta ativo.",
        createdBy: context.userId,
      });
      throw new Error("Publicacao real bloqueada. Ative INSTAGRAM_AUTO_PUBLISH_ENABLED somente depois da homologacao Meta.");
    }
    if (!oauthConfigured()) {
      await logInstagramEvent({
        supabase: context.supabase,
        postId: data.id,
        accountId: post.social_account_id,
        action: "publish",
        status: "blocked",
        errorCode: "oauth_not_configured",
        errorMessage: "Variaveis Meta/OAuth ausentes.",
        createdBy: context.userId,
      });
      throw new Error("OAuth/token vault ainda nao configurado.");
    }

    await logInstagramEvent({
      supabase: context.supabase,
      postId: data.id,
      accountId: post.social_account_id,
      action: "publish",
      status: "blocked",
      errorCode: "meta_publish_not_homologated",
      errorMessage: "Chamada real a Meta depende de App Review e token vault.",
      createdBy: context.userId,
    });
    throw new Error("Publicacao Meta preparada, mas bloqueada ate App Review, OAuth e token vault serem homologados.");
  });

export const retryInstagramPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireInstagramAdmin(context);
    const { data: row, error } = await db(context.supabase)
      .from("instagram_posts")
      .update({ status: "scheduled", last_error: null, publish_lock: null, publish_locked_at: null })
      .eq("id", data.id)
      .eq("status", "failed")
      .select()
      .single();
    if (error) {
      if (isMissingInstagramSchema(error)) throw new Error("A migration do Instagram ainda nao foi aplicada no Supabase.");
      throw new Error("Somente publicacoes com falha podem ir para retry.");
    }
    await logInstagramEvent({
      supabase: context.supabase,
      postId: data.id,
      action: "retry",
      status: "info",
      createdBy: context.userId,
    });
    return { post: row as InstagramPost };
  });
