import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { BookOpen, FileText, Newspaper, Plus, Wifi } from "lucide-react";
import {
  claimFirstAdmin,
  deleteAdminArticle,
  getMyRoles,
  listAdminArticles,
  type AdminArticle,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminArticlesList,
});

const typeMeta = {
  news: { label: "Notícia", icon: Newspaper },
  case: { label: "Caso", icon: BookOpen },
  risk: { label: "Risco", icon: Wifi },
  guide: { label: "Guia", icon: FileText },
} as const;

const filters = [
  { key: "all", label: "Todos" },
  { key: "news", label: "Notícias" },
  { key: "case", label: "Casos" },
  { key: "risk", label: "Riscos" },
  { key: "guide", label: "Guias" },
] as const;

type FilterKey = (typeof filters)[number]["key"];

function AdminArticlesList() {
  const qc = useQueryClient();
  const listFn = useServerFn(listAdminArticles);
  const claimFn = useServerFn(claimFirstAdmin);
  const rolesFn = useServerFn(getMyRoles);
  const deleteFn = useServerFn(deleteAdminArticle);
  const [filter, setFilter] = useState<FilterKey>("all");

  const rolesQ = useQuery({ queryKey: ["my-roles"], queryFn: () => rolesFn() });
  const articlesQ = useQuery({
    queryKey: ["admin-articles"],
    queryFn: () => listFn({ data: {} }),
  });

  useEffect(() => {
    if (rolesQ.data && rolesQ.data.roles.length === 0) {
      claimFn().then(() => qc.invalidateQueries({ queryKey: ["my-roles"] }));
    }
  }, [rolesQ.data, claimFn, qc]);

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-articles"] }),
  });

  const allArticles = (articlesQ.data?.articles ?? []) as AdminArticle[];
  const articles = filter === "all" ? allArticles : allArticles.filter((a) => a.type === filter);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Notícias, casos, riscos e guias</h2>
          <p className="text-sm text-muted-foreground">
            Papéis: {rolesQ.data?.roles.join(", ") || "—"}
          </p>
        </div>
        <Link
          to="/admin/article/$id"
          params={{ id: "new" }}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-4 py-2 text-sm font-semibold"
        >
          <Plus className="size-4" /> Novo conteúdo
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
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

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
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
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Carregando…</td></tr>
            )}
            {!articlesQ.isLoading && articles.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                Nenhum conteúdo nesta categoria. Clique em "Novo conteúdo" para criar.
              </td></tr>
            )}
            {articles.map((a) => {
              const meta = typeMeta[a.type];
              return (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold">
                      <meta.icon className="size-3.5 text-[color:var(--orange)]" /> {meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{a.title}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${
                      a.status === "published" ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)]" :
                      a.status === "draft" ? "bg-muted text-muted-foreground" :
                      a.status === "scheduled" ? "bg-blue-100 text-blue-900" :
                      "bg-secondary text-secondary-foreground"
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(a.updated_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/admin/article/$id"
                      params={{ id: a.id }}
                      className="text-sm font-semibold text-[color:var(--red-inst)] hover:underline mr-3"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Excluir "${a.title}"?`)) del.mutate(a.id);
                      }}
                      className="text-sm font-semibold text-muted-foreground hover:text-[color:var(--red-inst)]"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
