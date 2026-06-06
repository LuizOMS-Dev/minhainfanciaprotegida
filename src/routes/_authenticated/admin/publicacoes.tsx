import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  BookOpen,
  FileText,
  Newspaper,
  Pencil,
  Plus,
  Search,
  Trash2,
  Wifi,
} from "lucide-react";
import {
  deleteAdminArticle,
  getMyRoles,
  listAdminArticles,
  type AdminArticle,
} from "@/lib/admin.functions";
import { z } from "zod";

const tipoSchema = z.enum([
  "todos",
  "noticias",
  "casos",
  "riscos",
  "guias",
  "para-pais",
  "para-escolas",
]);

const searchSchema = z.object({
  tipo: tipoSchema.optional(),
  status: z
    .enum(["all", "draft", "review", "scheduled", "published", "archived"])
    .optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/admin/publicacoes")({
  validateSearch: (s: Record<string, unknown>) => searchSchema.parse(s),
  component: PublicacoesPage,
});

const TIPO_MAP: Record<
  z.infer<typeof tipoSchema>,
  { label: string; type?: AdminArticle["type"]; category?: string }
> = {
  todos: { label: "Todos" },
  noticias: { label: "Notícias", type: "news" },
  casos: { label: "Casos reais", type: "case" },
  riscos: { label: "Riscos online", type: "risk" },
  guias: { label: "Guias", type: "guide" },
  "para-pais": { label: "Para pais", category: "para-pais" },
  "para-escolas": { label: "Para escolas", category: "para-escolas" },
};

const TIPOS = Object.keys(TIPO_MAP) as Array<keyof typeof TIPO_MAP>;

const typeMeta: Record<AdminArticle["type"], { label: string; icon: typeof Newspaper; color: string }> = {
  news: { label: "Notícia", icon: Newspaper, color: "text-blue-600" },
  case: { label: "Caso", icon: BookOpen, color: "text-purple-600" },
  risk: { label: "Risco", icon: Wifi, color: "text-amber-600" },
  guide: { label: "Guia", icon: FileText, color: "text-emerald-600" },
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

function PublicacoesPage() {
  const qc = useQueryClient();
  const navigate = useNavigate({ from: "/admin/publicacoes" });
  const search = Route.useSearch();
  const tipo = (search.tipo ?? "todos") as keyof typeof TIPO_MAP;
  const status = search.status ?? "all";
  const q = search.q ?? "";

  const listFn = useServerFn(listAdminArticles);
  const deleteFn = useServerFn(deleteAdminArticle);
  const rolesFn = useServerFn(getMyRoles);

  const cfg = TIPO_MAP[tipo];
  const articlesQ = useQuery({
    queryKey: ["admin-articles", cfg.type ?? "all"],
    queryFn: () => listFn({ data: cfg.type ? { type: cfg.type } : {} }),
  });
  const rolesQ = useQuery({ queryKey: ["my-roles"], queryFn: () => rolesFn() });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-articles"] }),
  });

  const roles = rolesQ.data?.roles ?? [];
  const canEdit = roles.some((r) => r === "admin" || r === "editor");
  const canDelete = roles.includes("admin");

  const all = (articlesQ.data?.articles ?? []) as AdminArticle[];
  const articles = useMemo(() => {
    const term = q.trim().toLowerCase();
    return all
      .filter((a) => (cfg.category ? a.category === cfg.category : true))
      .filter((a) => (status === "all" ? true : a.status === status))
      .filter((a) =>
        term ? `${a.title} ${a.slug} ${a.category ?? ""}`.toLowerCase().includes(term) : true,
      );
  }, [all, cfg.category, status, q]);

  function setSearch(patch: Partial<z.infer<typeof searchSchema>>) {
    navigate({
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
    });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Publicações</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie notícias, casos reais, riscos online, guias e conteúdos por público-alvo.
          </p>
        </div>
        {canEdit && (
          <Link
            to="/admin/article/$id"
            params={{ id: "new" }}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-4 py-2 text-sm font-semibold hover:brightness-95"
          >
            <Plus className="size-4" /> Nova publicação
          </Link>
        )}
      </div>

      {/* Tipo */}
      <div className="flex flex-wrap gap-2">
        {TIPOS.map((t) => {
          const active = tipo === t;
          return (
            <button
              key={t}
              onClick={() => setSearch({ tipo: t === "todos" ? undefined : t })}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                active
                  ? "bg-[color:var(--navy-deep)] text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {TIPO_MAP[t].label}
            </button>
          );
        })}
      </div>

      {/* Status + busca */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "draft", "review", "scheduled", "published", "archived"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSearch({ status: s === "all" ? undefined : s })}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                status === s
                  ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)]"
                  : "border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {s === "all" ? "Todos status" : s}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
          <input
            value={q}
            onChange={(e) => setSearch({ q: e.target.value || undefined })}
            placeholder="Buscar título, slug ou categoria"
            className="w-full rounded-full border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-card">
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
                    Erro ao carregar conteúdos.
                  </td>
                </tr>
              )}
              {!articlesQ.isLoading && articles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    Nenhum conteúdo encontrado.
                    {canEdit && ' Clique em "Nova publicação" para criar.'}
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
                      <div className="text-xs text-muted-foreground">
                        /{a.slug}
                        {a.category && <> · {a.category}</>}
                      </div>
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
                            if (
                              confirm(
                                `Excluir "${a.title}"? Esta ação não pode ser desfeita.`,
                              )
                            )
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

      <p className="text-xs text-muted-foreground">
        Dica: <strong>Para pais</strong> e <strong>Para escolas</strong> filtram por
        <code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px]">category</code> ·
        defina <code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px]">para-pais</code> ou
        <code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px]">para-escolas</code> no editor.
      </p>
    </section>
  );
}
