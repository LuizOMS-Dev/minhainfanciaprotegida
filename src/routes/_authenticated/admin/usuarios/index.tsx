import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { assignAdminRole, listAdminUsers, type AdminUser, type AppRole } from "@/lib/users.functions";

export const Route = createFileRoute("/_authenticated/admin/usuarios/")({
  component: UsersPage,
});

const roles: AppRole[] = ["admin", "editor", "revisor"];

function UsersPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listAdminUsers);
  const assignFn = useServerFn(assignAdminRole);
  const [error, setError] = useState<string | null>(null);

  const q = useQuery({ queryKey: ["admin-users"], queryFn: () => listFn() });
  const mut = useMutation({
    mutationFn: (vars: { user_id: string; role: AppRole; action: "add" | "remove" }) =>
      assignFn({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
    onError: (e: Error) => setError(e.message),
  });

  const users = (q.data?.users ?? []) as AdminUser[];

  return (
    <section>
      <div>
        <h2 className="font-display text-xl font-semibold">Usuários e papéis</h2>
        <p className="text-sm text-muted-foreground">
          Atribua papéis para liberar acesso ao painel. Apenas administradores podem alterar papéis.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-[color:var(--red-inst)]/30 bg-[color:var(--red-inst)]/5 px-4 py-3 text-sm text-[color:var(--red-inst)]">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Usuário</th>
              <th className="text-left px-4 py-3">E-mail</th>
              <th className="text-left px-4 py-3">Papéis atuais</th>
              <th className="text-left px-4 py-3">Gerenciar</th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Carregando…</td></tr>
            )}
            {!q.isLoading && users.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                Nenhum usuário cadastrado.
              </td></tr>
            )}
            {users.map((u) => (
              <tr key={u.user_id} className="border-t border-border align-top">
                <td className="px-4 py-3 font-medium">{u.display_name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email ?? "—"}</td>
                <td className="px-4 py-3">
                  {u.roles.length === 0 ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {u.roles.map((r) => (
                        <span key={r} className="inline-flex items-center rounded-full bg-[color:var(--orange)]/15 text-[color:var(--navy-deep)] px-2.5 py-0.5 text-[11px] font-semibold uppercase">
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {roles.map((r) => {
                      const has = u.roles.includes(r);
                      return (
                        <button
                          key={r}
                          disabled={mut.isPending}
                          onClick={() => {
                            setError(null);
                            mut.mutate({ user_id: u.user_id, role: r, action: has ? "remove" : "add" });
                          }}
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors disabled:opacity-60 ${
                            has
                              ? "bg-[color:var(--navy-deep)] text-white"
                              : "border border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {has ? `− ${r}` : `+ ${r}`}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
