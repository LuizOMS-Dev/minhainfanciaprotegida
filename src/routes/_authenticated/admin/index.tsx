import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { BookOpen, FileText, LogOut, Newspaper, Plus, ShieldAlert, Wifi } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  claimFirstAdmin,
  deleteAdminArticle,
  getMyRoles,
  listAdminArticles,
  type AdminArticle,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Painel editorial — Infância Protegida" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

const typeMeta = {
  news: { label: "Notícia", icon: Newspaper },
  case: { label: "Caso", icon: BookOpen },
  risk: { label: "Risco", icon: Wifi },
  guide: { label: "Guia", icon: FileText },
} as const;

function AdminDashboard() {
  const navigate = useNavigate();
  const router = useRouter();
  const qc = useQueryClient();
  const listFn = useServerFn(listAdminArticles);
  const claimFn = useServerFn(claimFirstAdmin);
  const rolesFn = useServerFn(getMyRoles);
  const deleteFn = useServerFn(deleteAdminArticle);

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

  async function logout() {
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth" });
  }

  const articles = (articlesQ.data?.articles ?? []) as AdminArticle[];

  return (
    <section className="bg-background min-h-[80vh] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--orange)] font-semibold inline-flex items-center gap-2">
              <ShieldAlert className="size-3.5" /> Painel editorial
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold">
              Conteúdos do portal
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Papéis: {rolesQ.data?.roles.join(", ") || "—"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/_authenticated/admin/article/$id" as any
              params={{ id: "new" }}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-4 py-2 text-sm font-semibold"
            >
              <Plus className="size-4" /> Novo conteúdo
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold"
            >
              <LogOut className="size-4" /> Sair
            </button>
          </div>
        </header>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
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
                  Nenhum conteúdo ainda. Clique em "Novo conteúdo" para criar o primeiro.
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
                        to="/_authenticated/admin/article/$id" as any
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
      </div>
    </section>
  );
}
