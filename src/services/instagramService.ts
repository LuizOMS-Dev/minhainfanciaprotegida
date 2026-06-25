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

const DEFAULT_SCOPES = ["instagram_business_basic", "instagram_business_content_publish"];

function getInstagramConfig() {
  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
  const tokenKey = process.env.INSTAGRAM_TOKEN_ENCRYPTION_KEY;
  if (!appId || !appSecret || !redirectUri || !tokenKey) {
    throw new Error("OAuth da Meta ainda nao configurado no servidor.");
  }
  return {
    appId,
    appSecret,
    redirectUri,
    tokenKey,
    scopes: (process.env.INSTAGRAM_SCOPES ?? DEFAULT_SCOPES.join(","))
      .split(/[,\s]+/)
      .map((scope) => scope.trim())
      .filter(Boolean),
  };
}

function oauthConfigured() {
  try {
    getInstagramConfig();
    return true;
  } catch {
    return false;
  }
}

function getCryptoApi() {
  if (!globalThis.crypto?.subtle || !globalThis.crypto.getRandomValues) {
    throw new Error("Web Crypto indisponivel no runtime.");
  }
  return globalThis.crypto;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function concatBytes(left: Uint8Array, right: Uint8Array) {
  const combined = new Uint8Array(left.length + right.length);
  combined.set(left, 0);
  combined.set(right, left.length);
  return combined;
}

function encryptionKey(raw: string) {
  const key = base64UrlToBytes(raw);
  if (key.length !== 32) throw new Error("INSTAGRAM_TOKEN_ENCRYPTION_KEY deve ter 32 bytes em base64.");
  return key;
}

async function importAesKey(rawKey: string, usages: KeyUsage[]) {
  return getCryptoApi().subtle.importKey("raw", encryptionKey(rawKey), { name: "AES-GCM" }, false, usages);
}

function randomToken(byteLength: number) {
  const bytes = new Uint8Array(byteLength);
  getCryptoApi().getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

async function encryptToken(token: string, rawKey: string) {
  const cryptoApi = getCryptoApi();
  const iv = new Uint8Array(12);
  cryptoApi.getRandomValues(iv);
  const key = await importAesKey(rawKey, ["encrypt"]);
  const encryptedWithTag = new Uint8Array(
    await cryptoApi.subtle.encrypt({ name: "AES-GCM", iv, tagLength: 128 }, key, new TextEncoder().encode(token)),
  );
  const encrypted = encryptedWithTag.slice(0, -16);
  const tag = encryptedWithTag.slice(-16);
  return `v1:${bytesToBase64Url(iv)}:${bytesToBase64Url(tag)}:${bytesToBase64Url(encrypted)}`;
}

async function decryptToken(ciphertext: string, rawKey: string) {
  const [version, ivRaw, tagRaw, encryptedRaw] = ciphertext.split(":");
  if (version !== "v1" || !ivRaw || !tagRaw || !encryptedRaw) {
    throw new Error("Token Instagram em formato invalido.");
  }
  const cryptoApi = getCryptoApi();
  const key = await importAesKey(rawKey, ["decrypt"]);
  const decrypted = await cryptoApi.subtle.decrypt(
    { name: "AES-GCM", iv: base64UrlToBytes(ivRaw), tagLength: 128 },
    key,
    concatBytes(base64UrlToBytes(encryptedRaw), base64UrlToBytes(tagRaw)),
  );
  return new TextDecoder().decode(decrypted);
}

async function hashState(state: string) {
  const digest = await getCryptoApi().subtle.digest("SHA-256", new TextEncoder().encode(state));
  return bytesToHex(new Uint8Array(digest));
}

function buildAuthorizeUrl(state: string) {
  const config = getInstagramConfig();
  const url = new URL("https://api.instagram.com/oauth/authorize");
  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", config.scopes.join(","));
  url.searchParams.set("state", state);
  return url.toString();
}

async function readJsonResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { raw: text };
  }
}

async function exchangeCodeForShortToken(code: string) {
  const config = getInstagramConfig();
  const response = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.appId,
      client_secret: config.appSecret,
      grant_type: "authorization_code",
      redirect_uri: config.redirectUri,
      code,
    }),
  });
  const payload = await readJsonResponse(response);
  if (!response.ok || typeof payload.access_token !== "string") {
    throw new Error("A Meta recusou a troca do codigo OAuth.");
  }
  return {
    accessToken: payload.access_token,
    userId: typeof payload.user_id === "number" || typeof payload.user_id === "string"
      ? String(payload.user_id)
      : null,
  };
}

async function exchangeForLongLivedToken(shortToken: string) {
  const config = getInstagramConfig();
  const url = new URL("https://graph.instagram.com/access_token");
  url.searchParams.set("grant_type", "ig_exchange_token");
  url.searchParams.set("client_secret", config.appSecret);
  url.searchParams.set("access_token", shortToken);
  const response = await fetch(url);
  const payload = await readJsonResponse(response);
  if (!response.ok || typeof payload.access_token !== "string") {
    return { accessToken: shortToken, expiresIn: 3600 };
  }
  return {
    accessToken: payload.access_token,
    expiresIn: typeof payload.expires_in === "number" ? payload.expires_in : 60 * 24 * 60 * 60,
  };
}

async function fetchInstagramProfile(accessToken: string) {
  const query = async (fields: string) => {
    const url = new URL("https://graph.instagram.com/me");
    url.searchParams.set("fields", fields);
    url.searchParams.set("access_token", accessToken);
    const response = await fetch(url);
    const payload = await readJsonResponse(response);
    if (!response.ok) throw new Error("Nao foi possivel consultar o perfil Instagram.");
    return payload;
  };

  try {
    return await query("user_id,username,account_type");
  } catch {
    return await query("id,username,account_type");
  }
}

export async function completeInstagramOAuthCallback(rawUrl: string) {
  const url = new URL(rawUrl);
  const code = url.searchParams.get("code")?.replace(/#_$/, "");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) return { ok: false as const, code: "denied" };
  if (!code || !state) return { ok: false as const, code: "missing_code_or_state" };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const stateHash = await hashState(state);
  const { data: stateRow, error: stateErr } = await db(supabaseAdmin)
    .from("instagram_oauth_states")
    .select("id, created_by, expires_at, used_at")
    .eq("state_hash", stateHash)
    .maybeSingle();

  if (stateErr || !stateRow || stateRow.used_at) return { ok: false as const, code: "invalid_state" };
  if (new Date(stateRow.expires_at).getTime() < Date.now()) return { ok: false as const, code: "expired_state" };

  try {
    const config = getInstagramConfig();
    const shortToken = await exchangeCodeForShortToken(code);
    const longToken = await exchangeForLongLivedToken(shortToken.accessToken);
    const profile = await fetchInstagramProfile(longToken.accessToken);
    const igUserId = String(profile.user_id ?? profile.id ?? shortToken.userId ?? "");
    if (!igUserId) throw new Error("Perfil Instagram sem ID retornado pela Meta.");
    const expiresAt = new Date(Date.now() + longToken.expiresIn * 1000).toISOString();
    const encryptedToken = await encryptToken(longToken.accessToken, config.tokenKey);

    const accountPayload = {
      provider: "instagram",
      ig_user_id: igUserId,
      username: typeof profile.username === "string" ? profile.username : null,
      account_name: typeof profile.username === "string" ? profile.username : null,
      account_type: typeof profile.account_type === "string" ? profile.account_type : null,
      scopes: config.scopes,
      token_ciphertext: encryptedToken,
      token_expires_at: expiresAt,
      status: "connected",
      last_test_at: new Date().toISOString(),
      last_error: null,
      connected_by: stateRow.created_by,
      disconnected_at: null,
    };

    const existingAccount = await db(supabaseAdmin)
      .from("social_accounts")
      .select("id")
      .eq("provider", "instagram")
      .eq("ig_user_id", igUserId)
      .is("disconnected_at", null)
      .maybeSingle();

    if (existingAccount.error) throw existingAccount.error;

    const saveAccount = existingAccount.data?.id
      ? await db(supabaseAdmin).from("social_accounts").update(accountPayload).eq("id", existingAccount.data.id)
      : await db(supabaseAdmin).from("social_accounts").insert(accountPayload);

    if (saveAccount.error) throw saveAccount.error;

    await db(supabaseAdmin)
      .from("instagram_oauth_states")
      .update({ used_at: new Date().toISOString() })
      .eq("id", stateRow.id);

    await logInstagramEvent({
      supabase: supabaseAdmin,
      action: "oauth_callback",
      status: "success",
      createdBy: stateRow.created_by,
      response: {
        ig_user_id: igUserId,
        username: typeof profile.username === "string" ? profile.username : null,
        account_type: typeof profile.account_type === "string" ? profile.account_type : null,
      },
    });

    return { ok: true as const, username: typeof profile.username === "string" ? profile.username : null };
  } catch (e) {
    await db(supabaseAdmin)
      .from("instagram_oauth_states")
      .update({ used_at: new Date().toISOString() })
      .eq("id", stateRow.id);
    await logInstagramEvent({
      supabase: supabaseAdmin,
      action: "oauth_callback",
      status: "failed",
      errorCode: "oauth_callback_failed",
      errorMessage: e instanceof Error ? e.message : "Falha ao conectar Instagram.",
      createdBy: stateRow.created_by,
    });
    return { ok: false as const, code: "callback_failed" };
  }
}

export const createInstagramConnectUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireInstagramAdmin(context);
    const state = randomToken(32);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const { error } = await db(context.supabase).from("instagram_oauth_states").insert({
      state_hash: await hashState(state),
      created_by: context.userId,
      expires_at: expiresAt,
      redirect_to: "/admin/instagram",
    });
    if (error) {
      if (isMissingInstagramSchema(error)) {
        throw new Error("A migration OAuth do Instagram ainda nao foi aplicada no Supabase.");
      }
      console.error("[instagram.connect] state error", error);
      throw new Error("Nao foi possivel iniciar a conexao com Instagram.");
    }
    return { url: buildAuthorizeUrl(state) };
  });

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
    const config = getInstagramConfig();
    const token = await decryptToken(account.token_ciphertext, config.tokenKey);
    const profile = await fetchInstagramProfile(token);
    await db(context.supabase)
      .from("social_accounts")
      .update({
        username: typeof profile.username === "string" ? profile.username : null,
        account_name: typeof profile.username === "string" ? profile.username : null,
        account_type: typeof profile.account_type === "string" ? profile.account_type : null,
        last_test_at: new Date().toISOString(),
        last_error: null,
        status: "connected",
      })
      .eq("id", account.id);
    await logInstagramEvent({
      supabase: context.supabase,
      accountId: account.id,
      action: "test_connection",
      status: "success",
      createdBy: context.userId,
      response: {
        username: typeof profile.username === "string" ? profile.username : null,
        account_type: typeof profile.account_type === "string" ? profile.account_type : null,
      },
    });
    return { ok: true, username: typeof profile.username === "string" ? profile.username : null };
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
