import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, Trash2, KeyRound } from "lucide-react";
import {
  assignAdminRole,
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  resetUserPassword,
  type AdminUser,
  type AppRole,
} from "@/services/sessionService";

export const Route = createFileRoute("/_authenticated/admin/usuarios/")({
  component: UsersPage,
});

const roles: AppRole[] = ["admin", "editor", "revisor"];

function UsersPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listAdminUsers);
  const assignFn = useServerFn(assignAdminRole);
  const createFn = useServerFn(createAdminUser);
  const deleteFn = useServerFn(deleteAdminUser);
  const resetFn = useServerFn(resetUserPassword);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<AppRole>("editor");

  const q = useQuery({ queryKey: ["admin-users"], queryFn: () => listFn() });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-users"] });

  const assignMut = useMutation({
    mutationFn: (vars: { user_id: string; role: AppRole; action: "add" | "remove" }) =>
      assignFn({ data: vars }),
    onSuccess: invalidate,
    onError: (e: Error) => setError(e.message),
  });
  const createMut = useMutation({
    mutationFn: (vars: { email: string; password: string; display_name?: string; role: AppRole }) =>
      createFn({ data: vars }),
    onSuccess: () => {
      setNotice("Usuário criado com sucesso.");
      setShowForm(false);
      setNewEmail("");
      setNewName("");
      setNewPassword("");
      setNewRole("editor");
      invalidate();
    },
    onError: (e: Error) => setError(e.message),
  });
  const deleteMut = useMutation({
    mutationFn: (user_id: string) => deleteFn({ data: { user_id } }),
    onSuccess: () => {
      setNotice("Usuário excluído.");
      invalidate();
    },
    onError: (e: Error) => setError(e.message),
  });
  const resetMut = useMutation({
    mutationFn: (vars: { user_id: string; password: string }) => resetFn({ data: vars }),
    onSuccess: () => setNotice("Senha redefinida."),
    onError: (e: Error) => setError(e.message),
  });

  const users = (q.data?.users ?? []) as AdminUser[];

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Usuários e papéis</h2>
          <p className="text-sm text-muted-foreground">
            Apenas administradores podem criar usuários, alterar papéis ou excluir contas.
          </p>
        </div>
        <button
          onClick={() => {
            setError(null);
            setNotice(null);
            setShowForm((v) => !v);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--navy-deep)] px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="size-4" /> {showForm ? "Cancelar" : "Novo usuário"}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-[color:var(--red-inst)]/30 bg-[color:var(--red-inst)]/5 px-4 py-3 text-sm text-[color:var(--red-inst)]">
          {error}
        </div>
      )}
      {notice && (
        <div className="mt-4 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
          {notice}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            setNotice(null);
            createMut.mutate({
              email: newEmail.trim(),
              password: newPassword,
              display_name: newName.trim() || undefined,
              role: newRole,
            });
          }}
          className="mt-4 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2"
        >
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            E-mail
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Nome
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Senha provisória (mín. 8)
            <input
              type="text"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Papel
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as AppRole)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-2 flex justify-end">
            <button
              disabled={createMut.isPending}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] px-5 py-2 text-sm font-semibold text-[color:var(--navy-deep)] disabled:opacity-60"
            >
              {createMut.isPending ? "Criando…" : "Criar usuário"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Usuário</th>
              <th className="text-left px-4 py-3">E-mail</th>
              <th className="text-left px-4 py-3">Papéis atuais</th>
              <th className="text-left px-4 py-3">Gerenciar</th>
              <th className="text-right px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Carregando…</td></tr>
            )}
            {!q.isLoading && users.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
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
                          disabled={assignMut.isPending}
                          onClick={() => {
                            setError(null);
                            assignMut.mutate({ user_id: u.user_id, role: r, action: has ? "remove" : "add" });
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
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1.5">
                    <button
                      title="Redefinir senha"
                      onClick={() => {
                        const pwd = window.prompt("Nova senha (mín. 8 caracteres):");
                        if (!pwd || pwd.length < 8) return;
                        setError(null);
                        resetMut.mutate({ user_id: u.user_id, password: pwd });
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-border p-2 hover:bg-muted"
                    >
                      <KeyRound className="size-4" />
                    </button>
                    <button
                      title="Excluir usuário"
                      onClick={() => {
                        if (!window.confirm(`Excluir ${u.email ?? u.user_id}?`)) return;
                        setError(null);
                        deleteMut.mutate(u.user_id);
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-[color:var(--red-inst)]/40 p-2 text-[color:var(--red-inst)] hover:bg-[color:var(--red-inst)]/5"
                    >
                      <Trash2 className="size-4" />
                    </button>
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
