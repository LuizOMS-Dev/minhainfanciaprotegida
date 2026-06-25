import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  History,
  Image,
  Instagram,
  Link2,
  LockKeyhole,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  Video,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import {
  cancelInstagramPost,
  createInstagramConnectUrl,
  deleteInstagramPost,
  getInstagramDashboard,
  listInstagramLogs,
  listInstagramPosts,
  publishInstagramPost,
  retryInstagramPost,
  testInstagramConnection,
  upsertInstagramPost,
  type InstagramPost,
} from "@/services/instagramService";

export const Route = createFileRoute("/_authenticated/admin/instagram")({
  head: () => ({
    meta: [
      { title: "Instagram | Painel administrativo" },
      { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
    ],
  }),
  component: InstagramAdminPage,
});

type CapabilityStatus = "planned" | "blocked";
type DraftType = "feed" | "carousel" | "reel" | "story";
type DraftStatus = "draft" | "review" | "scheduled";

interface Capability {
  title: string;
  description: string;
  status: CapabilityStatus;
  icon: LucideIcon;
}

const capabilities: Capability[] = [
  {
    title: "Feed",
    description: "Imagem ou video unico via Content Publishing oficial.",
    status: "planned",
    icon: Image,
  },
  {
    title: "Carrossel",
    description: "Sequencia de imagens/videos com validacao antes do envio.",
    status: "planned",
    icon: FileText,
  },
  {
    title: "Reels",
    description: "Video vertical com checagem de formato, duracao e legenda.",
    status: "planned",
    icon: Video,
  },
  {
    title: "Stories",
    description: "Bloqueado ate a Meta confirmar suporte para esta conta Creator.",
    status: "blocked",
    icon: Ban,
  },
];

const workflow = [
  "Salvar rascunho",
  "Revisar conteudo sensivel",
  "Validar midia e legenda",
  "Agendar ou publicar manualmente",
  "Criar container na Meta",
  "Publicar container",
  "Registrar historico seguro",
];

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  review: "Revisao",
  scheduled: "Agendado",
  publishing: "Enviando",
  published: "Publicado",
  failed: "Falha",
  cancelled: "Cancelado",
};

const typeLabels: Record<string, string> = {
  feed: "Feed",
  carousel: "Carrossel",
  reel: "Reels",
  story: "Stories",
};

function statusClass(status: CapabilityStatus) {
  if (status === "planned") return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
  return "bg-[color:var(--red-inst)]/10 text-[color:var(--red-inst)] ring-1 ring-[color:var(--red-inst)]/20";
}

function postStatusClass(status: string) {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "scheduled":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
    case "review":
      return "bg-amber-50 text-amber-800 ring-1 ring-amber-200";
    case "failed":
      return "bg-[color:var(--red-inst)]/10 text-[color:var(--red-inst)] ring-1 ring-[color:var(--red-inst)]/20";
    case "cancelled":
      return "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200";
    default:
      return "bg-muted text-muted-foreground ring-1 ring-border";
  }
}

function InstagramAdminPage() {
  const qc = useQueryClient();
  const [notice, setNotice] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    title: "",
    type: "feed" as DraftType,
    caption: "",
    hashtags: "",
    mediaUrl: "",
    mediaKind: "image" as "image" | "video",
    scheduled_at: "",
    status: "draft" as DraftStatus,
  });

  const dashboardFn = useServerFn(getInstagramDashboard);
  const listPostsFn = useServerFn(listInstagramPosts);
  const listLogsFn = useServerFn(listInstagramLogs);
  const upsertFn = useServerFn(upsertInstagramPost);
  const publishFn = useServerFn(publishInstagramPost);
  const retryFn = useServerFn(retryInstagramPost);
  const cancelFn = useServerFn(cancelInstagramPost);
  const connectFn = useServerFn(createInstagramConnectUrl);
  const deleteFn = useServerFn(deleteInstagramPost);
  const testFn = useServerFn(testInstagramConnection);

  const dashboardQ = useQuery({
    queryKey: ["instagram-dashboard"],
    queryFn: () => dashboardFn(),
  });

  const postsQ = useQuery({
    queryKey: ["instagram-posts"],
    queryFn: () => listPostsFn({ data: {} }),
  });

  const logsQ = useQuery({
    queryKey: ["instagram-logs"],
    queryFn: () => listLogsFn({ data: {} }),
  });

  const schemaReady = dashboardQ.data?.schemaReady ?? postsQ.data?.schemaReady ?? true;
  const posts = postsQ.data?.posts ?? [];
  const logs = logsQ.data?.logs ?? [];

  const saveMutation = useMutation({
    mutationFn: () =>
      upsertFn({
        data: {
          type: draft.type,
          title: draft.title,
          caption: draft.caption || null,
          hashtags: draft.hashtags
            .split(/[,\s]+/)
            .map((tag) => tag.trim())
            .filter(Boolean),
          media: draft.mediaUrl
            ? [{ kind: draft.mediaKind, url: draft.mediaUrl, alt: draft.title }]
            : [],
          scheduled_at: draft.scheduled_at ? new Date(draft.scheduled_at).toISOString() : null,
          status: draft.status,
        },
      }),
    onSuccess: () => {
      setNotice("Publicacao salva com seguranca.");
      setDraft({
        title: "",
        type: "feed",
        caption: "",
        hashtags: "",
        mediaUrl: "",
        mediaKind: "image",
        scheduled_at: "",
        status: "draft",
      });
      qc.invalidateQueries({ queryKey: ["instagram-dashboard"] });
      qc.invalidateQueries({ queryKey: ["instagram-posts"] });
      qc.invalidateQueries({ queryKey: ["instagram-logs"] });
    },
    onError: (err) => setNotice(err instanceof Error ? err.message : "Falha ao salvar publicacao."),
  });

  const connectMutation = useMutation({
    mutationFn: () => connectFn(),
    onSuccess: (result) => {
      window.location.assign(result.url);
    },
    onError: (err) => setNotice(err instanceof Error ? err.message : "Nao foi possivel iniciar o OAuth Instagram."),
  });

  function simpleMutation(fn: () => Promise<unknown>, success: string) {
    setNotice(null);
    fn()
      .then(() => {
        setNotice(success);
        qc.invalidateQueries({ queryKey: ["instagram-dashboard"] });
        qc.invalidateQueries({ queryKey: ["instagram-posts"] });
        qc.invalidateQueries({ queryKey: ["instagram-logs"] });
      })
      .catch((err) => setNotice(err instanceof Error ? err.message : "Acao nao concluida."));
  }

  const counts = dashboardQ.data?.counts;
  const account = dashboardQ.data?.account;
  const config = dashboardQ.data?.config;
  const formBlocked = !schemaReady || saveMutation.isPending;

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const aDate = a.scheduled_at ?? a.updated_at;
      const bDate = b.scheduled_at ?? b.updated_at;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  }, [posts]);

  return (
    <section className="space-y-7">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-[color:var(--navy-deep)] p-6 text-white shadow-elegant sm:p-8">
        <div className="absolute -right-14 -top-20 size-48 rounded-full bg-[color:var(--orange)]/25 blur-2xl" />
        <div className="absolute bottom-0 right-10 h-28 w-28 rounded-full border border-white/10" />
        <div className="relative max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">
            <Instagram className="size-3.5" /> Modulo Instagram oficial
          </p>
          <h2 className="mt-4 font-display text-2xl font-semibold sm:text-4xl">
            Central Instagram com publicacao protegida
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/72 sm:text-base">
            Planeje, revise e agende posts sem expor tokens. A publicacao real permanece
            bloqueada ate OAuth, App Review, token vault e flag de automacao serem aprovados.
          </p>
        </div>
      </div>

      {notice && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
          {notice}
        </div>
      )}

      {!schemaReady && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <p className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="size-4" /> Migration Instagram ainda nao aplicada
          </p>
          <p className="mt-2 text-sm leading-6">
            O codigo local esta pronto, mas o banco precisa receber a migration
            <code className="mx-1 rounded bg-white/70 px-1.5 py-0.5 text-xs">
              20260619090000_instagram_admin_module.sql
            </code>
            antes de salvar rascunhos reais.
          </p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Conexao
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-[color:var(--navy-deep)]">
                {account ? account.username ?? account.account_name ?? "Conta Instagram" : "Instagram ainda nao conectado"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Metodo preparado para Instagram Login oficial. Tokens ficam somente server-side e criptografados.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
              <Clock className="size-3.5" /> {account?.status ?? "Pendente"}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoRow icon={Link2} label="Metodo" value="Instagram Login oficial" />
            <InfoRow icon={ShieldCheck} label="Conta alvo" value={account?.account_type ?? "Creator profissional"} />
            <InfoRow icon={LockKeyhole} label="OAuth" value={config?.oauthConfigured ? "Configurado" : "Aguardando envs Meta"} />
            <InfoRow icon={RefreshCw} label="Automacao" value={config?.publishingEnabled ? "Ativa" : "Bloqueada por padrao"} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => connectMutation.mutate()}
              disabled={!schemaReady || !config?.oauthConfigured || connectMutation.isPending}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] px-4 py-2 text-sm font-semibold text-[color:var(--navy-deep)] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Instagram className="size-4" /> {config?.oauthConfigured ? "Conectar Instagram" : "Aguardando Meta App"}
            </button>
            <button
              type="button"
              onClick={() => simpleMutation(() => testFn(), "Teste solicitado com seguranca.")}
              disabled={!schemaReady}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className="size-4" /> Testar conexao
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Protecao editorial
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-[color:var(--navy-deep)]">
            Publicacao exige revisao humana
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Para um projeto de protecao infantil, o fluxo padrao nunca publica por acidente.
          </p>
          <ol className="mt-4 space-y-2">
            {workflow.map((step, index) => (
              <li key={step} className="flex items-center gap-3 rounded-2xl bg-muted/45 px-3 py-2 text-sm">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[color:var(--navy-deep)] ring-1 ring-border">
                  {index + 1}
                </span>
                <span className="text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {capabilities.map((item) => (
          <div key={item.title} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[color:var(--orange)]/15 text-[color:var(--navy-deep)]">
                <item.icon className="size-5" />
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass(item.status)}`}>
                {item.status === "planned" ? "Planejado" : "Bloqueado"}
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <Kpi label="Rascunhos" value={counts?.draft ?? 0} />
        <Kpi label="Revisao" value={counts?.review ?? 0} />
        <Kpi label="Agendados" value={counts?.scheduled ?? 0} />
        <Kpi label="Publicados" value={counts?.published ?? 0} />
        <Kpi label="Falhas" value={counts?.failed ?? 0} />
        <Kpi label="Cancelados" value={counts?.cancelled ?? 0} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Nova publicacao
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-[color:var(--navy-deep)]">
                Rascunho e agendamento
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              <Sparkles className="size-3.5" /> Publicacao real bloqueada
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Titulo interno</span>
              <input
                value={draft.title}
                onChange={(e) => setDraft((v) => ({ ...v, title: e.target.value }))}
                disabled={formBlocked}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] disabled:opacity-60"
                placeholder="Ex.: Checklist de seguranca digital"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tipo</span>
              <select
                value={draft.type}
                onChange={(e) => setDraft((v) => ({ ...v, type: e.target.value as DraftType }))}
                disabled={formBlocked}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] disabled:opacity-60"
              >
                <option value="feed">Feed</option>
                <option value="carousel">Carrossel</option>
                <option value="reel">Reels</option>
                <option value="story">Stories bloqueado</option>
              </select>
            </label>
            <label className="space-y-1.5 lg:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Legenda</span>
              <textarea
                value={draft.caption}
                onChange={(e) => setDraft((v) => ({ ...v, caption: e.target.value }))}
                disabled={formBlocked}
                rows={4}
                maxLength={2200}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] disabled:opacity-60"
                placeholder="Texto que sera revisado antes de publicar..."
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hashtags</span>
              <input
                value={draft.hashtags}
                onChange={(e) => setDraft((v) => ({ ...v, hashtags: e.target.value }))}
                disabled={formBlocked}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] disabled:opacity-60"
                placeholder="segurancadigital, infancia"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</span>
              <select
                value={draft.status}
                onChange={(e) => setDraft((v) => ({ ...v, status: e.target.value as DraftStatus }))}
                disabled={formBlocked}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] disabled:opacity-60"
              >
                <option value="draft">Rascunho</option>
                <option value="review">Revisao</option>
                <option value="scheduled">Agendado</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">URL da midia HTTPS</span>
              <input
                value={draft.mediaUrl}
                onChange={(e) => setDraft((v) => ({ ...v, mediaUrl: e.target.value }))}
                disabled={formBlocked}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] disabled:opacity-60"
                placeholder="https://..."
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Agendar para</span>
              <input
                type="datetime-local"
                value={draft.scheduled_at}
                onChange={(e) => setDraft((v) => ({ ...v, scheduled_at: e.target.value }))}
                disabled={formBlocked}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] disabled:opacity-60"
              />
            </label>
          </div>

          <div className="mt-5 rounded-3xl border border-dashed border-border bg-muted/30 p-6 text-center">
            <UploadCloud className="mx-auto size-9 text-muted-foreground" />
            <p className="mt-3 font-semibold text-foreground">Upload dedicado entra na fase de Storage</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Por enquanto a tela aceita URL HTTPS publica/controlada, que e requisito para a Meta buscar a midia.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => saveMutation.mutate()}
              disabled={formBlocked}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--navy-deep)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="size-4" /> Salvar
            </button>
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-[color:var(--red-inst)]/25 px-4 py-2 text-sm font-semibold text-[color:var(--red-inst)] opacity-70"
            >
              <Send className="size-4" /> Publicar agora bloqueado
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Checklist antes de liberar
          </p>
          <div className="mt-4 space-y-3">
            <ChecklistItem done label="Modulo admin visual criado" />
            <ChecklistItem done label="Servico local e migrations criados" />
            <ChecklistItem done={schemaReady} label="Tabelas Supabase aplicadas" />
            <ChecklistItem done={Boolean(config?.oauthConfigured)} label="Meta App e Instagram Login" />
            <ChecklistItem label="Token criptografado server-side" />
            <ChecklistItem done={Boolean(config?.publishingEnabled)} label="Flag de publicacao real ativa" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Calendario e fila
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold">Publicacoes planejadas</h3>
          </div>
          <CalendarDays className="size-5 text-muted-foreground" />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-3 pr-4 text-left">Titulo</th>
                <th className="py-3 pr-4 text-left">Tipo</th>
                <th className="py-3 pr-4 text-left">Status</th>
                <th className="py-3 pr-4 text-left">Data</th>
                <th className="py-3 text-right">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {postsQ.isLoading && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Carregando Instagram...
                  </td>
                </tr>
              )}
              {!postsQ.isLoading && sortedPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Nenhuma publicacao Instagram cadastrada ainda.
                  </td>
                </tr>
              )}
              {sortedPosts.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  onPublish={() => simpleMutation(() => publishFn({ data: { id: post.id } }), "Publicacao enviada.")}
                  onRetry={() => simpleMutation(() => retryFn({ data: { id: post.id } }), "Retry agendado.")}
                  onCancel={() => simpleMutation(() => cancelFn({ data: { id: post.id } }), "Publicacao cancelada.")}
                  onDelete={() => {
                    if (confirm(`Excluir "${post.title}"?`)) {
                      simpleMutation(() => deleteFn({ data: { id: post.id } }), "Publicacao excluida.");
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Historico
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold">Logs seguros</h3>
            </div>
            <History className="size-5 text-muted-foreground" />
          </div>
          <div className="mt-4 space-y-3">
            {logs.length === 0 && (
              <div className="rounded-2xl bg-muted/45 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <AlertTriangle className="size-4 text-amber-600" /> Nenhum log Instagram ainda
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Tentativas, bloqueios seguros, retry e respostas saneadas da Meta aparecerao aqui.
                </p>
              </div>
            )}
            {logs.map((log) => (
              <div key={log.id} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{log.action}</p>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${postStatusClass(log.status)}`}>
                    {log.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(log.created_at).toLocaleString("pt-BR")}
                  {log.error_message ? ` - ${log.error_message}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Limites ativos
          </p>
          <div className="mt-4 space-y-3">
            <SafetyLimit icon={Ban} title="Stories bloqueado" text="Somente sera liberado depois de confirmacao oficial da Meta para esta conta." />
            <SafetyLimit icon={LockKeyhole} title="Tokens fora do navegador" text="Nenhum token e salvo, lido ou renderizado no frontend." />
            <SafetyLimit icon={XCircle} title="Sem bot e sem senha" text="Nao ha scraping, automacao de navegador, senha do Instagram ou metodo nao oficial." />
          </div>
        </div>
      </div>
    </section>
  );
}

function PostRow({
  post,
  onPublish,
  onRetry,
  onCancel,
  onDelete,
}: {
  post: InstagramPost;
  onPublish: () => void;
  onRetry: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const canPublish = ["review", "scheduled", "failed"].includes(post.status);
  const canRetry = post.status === "failed";
  const canCancel = ["draft", "review", "scheduled", "failed"].includes(post.status);
  const canDelete = ["draft", "review", "failed", "cancelled"].includes(post.status);

  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-3 pr-4">
        <div className="font-semibold text-foreground">{post.title}</div>
        <div className="text-xs text-muted-foreground">
          {post.caption ? post.caption.slice(0, 90) : "Sem legenda"}
        </div>
      </td>
      <td className="py-3 pr-4 text-muted-foreground">{typeLabels[post.type] ?? post.type}</td>
      <td className="py-3 pr-4">
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${postStatusClass(post.status)}`}>
          {statusLabels[post.status] ?? post.status}
        </span>
      </td>
      <td className="py-3 pr-4 text-muted-foreground">
        {post.scheduled_at ? new Date(post.scheduled_at).toLocaleString("pt-BR") : "-"}
      </td>
      <td className="py-3 text-right">
        <div className="inline-flex flex-wrap justify-end gap-2">
          {canPublish && (
            <button onClick={onPublish} className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted">
              Publicar
            </button>
          )}
          {canRetry && (
            <button onClick={onRetry} className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted">
              Retry
            </button>
          )}
          {canCancel && (
            <button onClick={onCancel} className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted">
              Cancelar
            </button>
          )}
          {canDelete && (
            <button onClick={onDelete} className="rounded-full border border-[color:var(--red-inst)]/30 px-3 py-1 text-xs font-semibold text-[color:var(--red-inst)] hover:bg-[color:var(--red-inst)]/10">
              <Trash2 className="inline size-3" /> Excluir
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3">
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ChecklistItem({ done = false, label }: { done?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-muted/45 px-3 py-2 text-sm">
      {done ? (
        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
      ) : (
        <Clock className="size-4 shrink-0 text-muted-foreground" />
      )}
      <span className={done ? "font-semibold text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-[color:var(--navy-deep)]">{value}</p>
    </div>
  );
}

function SafetyLimit({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="flex items-center gap-2 font-semibold text-foreground">
        <Icon className="size-4 text-[color:var(--red-inst)]" /> {title}
      </p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
