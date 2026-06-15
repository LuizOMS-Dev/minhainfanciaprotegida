import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus } from "lucide-react";
import {
  deleteAdminLibrary,
  listAdminLibrary,
  type AdminLibraryItem,
} from "@/lib/library.functions";

export const Route = createFileRoute("/_authenticated/admin/biblioteca/")({
  component: LibraryList,
});

function LibraryList() {
  const qc = useQueryClient();
  const listFn = useServerFn(listAdminLibrary);
  const delFn = useServerFn(deleteAdminLibrary);
  const q = useQuery({ queryKey: ["admin-library"], queryFn: () => listFn() });
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-library"] }),
  });

  const items = (q.data?.items ?? []) as AdminLibraryItem[];

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Biblioteca de materiais</h2>
          <p className="text-sm text-muted-foreground">
            Cartilhas, manuais e documentos de referência.
          </p>
        </div>
        <Link
          to="/admin/biblioteca/$id"
          params={{ id: "new" }}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-4 py-2 text-sm font-semibold"
        >
          <Plus className="size-4" /> Novo material
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Título</th>
              <th className="text-left px-4 py-3">Categoria</th>
              <th className="text-left px-4 py-3">Público</th>
              <th className="text-left px-4 py-3">Fonte</th>
              <th className="text-left px-4 py-3">Ano</th>
              <th className="text-right px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Carregando…
                </td>
              </tr>
            )}
            {!q.isLoading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum material ainda.
                </td>
              </tr>
            )}
            {items.map((it) => (
              <tr key={it.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{it.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{it.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{it.audience}</td>
                <td className="px-4 py-3 text-muted-foreground">{it.source_org}</td>
                <td className="px-4 py-3 text-muted-foreground">{it.year}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/admin/biblioteca/$id"
                    params={{ id: it.id }}
                    className="text-sm font-semibold text-[color:var(--red-inst)] hover:underline mr-3"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Excluir "${it.title}"?`)) del.mutate(it.id);
                    }}
                    className="text-sm font-semibold text-muted-foreground hover:text-[color:var(--red-inst)]"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
