import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Newspaper,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  Wifi,
} from "lucide-react";
import {
  claimFirstAdmin,
  deleteAdminArticle,
  getMyRoles,
  listAdminArticles,
  type AdminArticle,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

const typeMeta = {
  news: { label: "Notícia", icon: Newspaper, color: "text-blue-600" },
  case: { label: "Caso", icon: BookOpen, color: "text-purple-600" },
  risk: { label: "Risco", icon: Wifi, color: "text-amber-600" },
  guide: { label: "Guia", icon: FileText, color: "text-emerald-600" },
} as const;

const filters = [
  { key: "all", label: "Todos" },
  { key: "news", label: "Notícias" },
  { key: "case", label: "Casos" },
  { key: "risk", label: "Riscos" },
  { key: "guide", label: "Guias" },
] as const;

type FilterKey = (typeof filters)[number]["key"];

const roleStyles: Record<string, string> = {
  admin: "bg-[color:var(--red-inst)]/10 text-[color:var(--red-inst)] ring-1 ring-[color:var(--red-inst)]/30",
  editor: "bg-[color:var(--orange)]/15 text-[color:var(--navy-deep)] ring-1 ring-[color:var(--orange)]/40",
  revisor: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
};

function statusStyle(s: string) {
  switch (s) {
    case "published":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "scheduled":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
    case "review":
      return "bg-amber-50 text-amber-800 ring-1 ring-amber-200";
    case "archived":
      return "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200";
    default:
      return "bg-muted text-muted-foreground ring-1 ring-border";
  }
}

function AdminDashboard() {
  const qc = useQueryClient();
  const listFn = useServerFn(listAdminArticles);
  const claimFn = useServerFn(claimFirstAdmin);
  const rolesFn = useServerFn(getMyRoles);
  const deleteFn = useServerFn(deleteAdminArticle);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const rolesQ = useQuery({ queryKey: ["my-roles"], queryFn: () => rolesFn() });
  const articlesQ = useQuery({
    queryKey: ["admin-articles"],
    queryFn: () => listFn({ data: {} }),
  });

  useEffect(() => {
    if (rolesQ.data && rolesQ.data.roles.length === 0) {
      claimFn()
        .then(() => qc.invalidateQueries({ queryKey: ["my-roles"] }))
        .catch(() => void 0);
    }
  }, [rolesQ.data, claimFn, qc]);

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-articles"] }),
  });

  const allArticles = (articlesQ.data?.articles ?? []) as AdminArticle[];

  const stats = useMemo(() => {
    const total = allArticles.length;
    const published = allArticles.filter((a) => a.status === "published").length;
    const drafts = allArticles.filter((a) => a.status === "draft").length;
    const scheduled = allArticles.filter((a) => a.status === "scheduled").length;
    const review = allArticles.filter((a) => a.status === "review").length;
    return { total, published, drafts, scheduled, review };
  }, [allArticles]);

  const articles = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allArticles
      .filter((a) => (filter === "all" ? true : a.type === filter))
      .filter((a) =>
        term ? `${a.title} ${a.slug} ${a.category ?? ""}`.toLowerCase().includes(term) : true,
      );
  }, [allArticles, filter, search]);

  const roles = rolesQ.data?.roles ?? [];
  const canEdit = roles.some((r) => r === "admin" || r === "editor");
  const canDelete = roles.includes("admin");

  return (
    <section className="space-y-8">
      {/* Welcome / Identity bar */}
      <div className="rounded-3xl border border-border bg-gradient-to-br from-[color:var(--navy-deep)] to-[color:var(--navy)] text-white p-6 sm:p-8 shadow-elegant">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/70 font-semibold">
              <Sparkles className="size-3.5" /> Painel editorial
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold">
              Bem-vindo(a) ao centro de controle
            </h2>
            <p className="mt-2 text-sm text-white/70 max-w-xl">
              Publique notícias, mantenha a biblioteca atualizada e gerencie a rede de ajuda — tudo em um só lugar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {roles.length === 0 ? (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Carregando papéis…</span>
            ) : (
              roles.map((r) => (
                <span
                  key={r}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                    roleStyles[r] ?? "bg-white/10 text-white"
                  }`}
                >
                  <ShieldCheck className="inline size-3 mr-1" />
                  {r}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KPI label="Total" value={stats.total} icon={FileText} tone="text-foreground" />
        <KPI label="Publicados" value={stats.published} icon={CheckCircle2} tone="text-emerald-600" />
        <KPI label="Rascunhos" value={stats.drafts} icon={Pencil} tone="text-muted-foreground" />
        <KPI label="Em revisão" value={stats.review} icon={ShieldCheck} tone="text-amber-600" />
        <KPI label="Agendados" value={stats.scheduled} icon={Clock} tone="text-blue-600" />
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-3">
        <QuickAction
          to="/admin/biblioteca"
          icon={BookOpen}
          title="Biblioteca"
          description="Materiais, cartilhas e guias institucionais"
        />
        <QuickAction
          to="/admin/mapa"
          icon={MapPin}
          title="Mapa de ajuda"
          description="Conselhos tutelares, CREAS, delegacias"
        />
        <QuickAction
          to="/admin/usuarios"
          icon={Users}
          title="Usuários"
          description="Atribuir papéis e gerenciar acessos"
        />
      </div>

      {/* Articles section */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden">
        <div className="p-6 sm:p-7 border-b border-border">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-semibold">Conteúdos</h3>
              <p className="text-sm text-muted-foreground">
                Notícias, casos, riscos online e guias publicados no portal.
              </p>
            </div>
            {canEdit && (
              <Link
                to="/admin/article/$id"
                params={{ id: "new" }}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-4 py-2 text-sm font-semibold hover:brightness-95"
              >
                <Plus className="size-4" /> Novo conteúdo
              </Link>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    filter === f.key
                      ? "bg-[color:var(--navy-deep)] text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative ml-auto w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título, slug ou categoria"
                className="w-full rounded-full border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Tipo</th>
                <th className="text-left px-4 py-3">Título</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Atualizado</th>
                <th className="text-right px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {articlesQ.isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    Carregando…
                  </td>
                </tr>
              )}
              {articlesQ.isError && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[color:var(--red-inst)]">
                    Erro ao carregar conteúdos. Verifique suas permissões.
                  </td>
                </tr>
              )}
              {!articlesQ.isLoading && articles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    Nenhum conteúdo encontrado.
                    {canEdit && ' Clique em "Novo conteúdo" para criar.'}
                  </td>
                </tr>
              )}
              {articles.map((a) => {
                const meta = typeMeta[a.type];
                return (
                  <tr key={a.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold">
                        <meta.icon className={`size-3.5 ${meta.color}`} aria-hidden /> {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{a.title}</div>
                      <div className="text-xs text-muted-foreground">/{a.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${statusStyle(a.status)}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(a.updated_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {canEdit && (
                        <Link
                          to="/admin/article/$id"
                          params={{ id: a.id }}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--navy-deep)] hover:underline mr-3"
                        >
                          <Pencil className="size-3.5" /> Editar
                        </Link>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            if (confirm(`Excluir "${a.title}"? Esta ação não pode ser desfeita.`))
                              del.mutate(a.id);
                          }}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-[color:var(--red-inst)]"
                        >
                          <Trash2 className="size-3.5" /> Excluir
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function KPI({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
      <div className="rounded-xl bg-muted p-2.5">
        <Icon className={`size-5 ${tone}`} aria-hidden />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
        <div className="font-display text-2xl font-semibold leading-tight">{value}</div>
      </div>
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: "/admin/biblioteca" | "/admin/mapa" | "/admin/usuarios";
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border bg-card p-5 hover:border-[color:var(--orange)] hover:shadow-elegant transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-[color:var(--navy-deep)] text-white p-2.5">
          <Icon className="size-5" aria-hidden />
        </div>
        <div>
          <div className="font-display text-base font-semibold group-hover:text-[color:var(--navy-deep)]">
            {title}
          </div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
    </Link>
  );
}
