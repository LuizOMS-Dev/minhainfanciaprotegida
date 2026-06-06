import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listAuditLog, type AuditActionType, type AuditLogRow } from "@/lib/audit.functions";

export const Route = createFileRoute("/_authenticated/admin/auditoria")({
  component: AuditoriaPage,
});

const ACTIONS: AuditActionType[] = [
  "login",
  "logout",
  "login_failed",
  "unauthorized_access",
  "content_create",
  "content_update",
  "content_delete",
  "content_publish",
  "content_unpublish",
  "user_create",
  "user_update",
  "user_delete",
  "role_change",
  "password_reset",
  "csv_import",
  "library_change",
  "location_change",
];

const ACTION_LABEL: Record<AuditActionType, string> = {
  login: "Login",
  logout: "Logout",
  login_failed: "Falha de login",
  unauthorized_access: "Acesso negado",
  content_create: "Conteúdo criado",
  content_update: "Conteúdo editado",
  content_delete: "Conteúdo excluído",
  content_publish: "Publicação",
  content_unpublish: "Despublicação",
  user_create: "Usuário criado",
  user_update: "Usuário atualizado",
  user_delete: "Usuário excluído",
  role_change: "Papel alterado",
  password_reset: "Redefinição de senha",
  csv_import: "Importação CSV",
  library_change: "Biblioteca",
  location_change: "Mapa de ajuda",
};

function fmt(d: string) {
  return new Date(d).toLocaleString("pt-BR");
}

function AuditoriaPage() {
  const listFn = useServerFn(listAuditLog);
  const [action, setAction] = useState<AuditActionType | "">("");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const q = useQuery({
    queryKey: ["audit-log", action, search, fromDate, toDate, page],
    queryFn: () =>
      listFn({
        data: {
          action: action || undefined,
          search: search || undefined,
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
          page,
          pageSize: 50,
        },
      }),
    placeholderData: (prev) => prev,
  });

  const rows: AuditLogRow[] = q.data?.rows ?? [];
  const total = q.data?.total ?? 0;
  const pageSize = q.data?.pageSize ?? 50;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section>
      <div>
        <h2 className="font-display text-xl font-semibold">Auditoria administrativa</h2>
        <p className="text-sm text-muted-foreground">
          Logs somente leitura — registros não podem ser editados nem excluídos.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ação
          <select
            value={action}
            onChange={(e) => {
              setAction(e.target.value as AuditActionType | "");
              setPage(1);
            }}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground"
          >
            <option value="">Todas</option>
            {ACTIONS.map((a) => (
              <option key={a} value={a}>
                {ACTION_LABEL[a]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pesquisar
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="e-mail ou título"
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          De
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Até
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground"
          />
        </label>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Quando</th>
              <th className="text-left px-4 py-3">Usuário</th>
              <th className="text-left px-4 py-3">Papel</th>
              <th className="text-left px-4 py-3">Ação</th>
              <th className="text-left px-4 py-3">Alvo</th>
              <th className="text-left px-4 py-3">IP</th>
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
            {!q.isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum evento registrado.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border align-top">
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{fmt(r.created_at)}</td>
                <td className="px-4 py-3">{r.user_email ?? "—"}</td>
                <td className="px-4 py-3 uppercase text-xs">{r.user_role ?? "—"}</td>
                <td className="px-4 py-3 font-medium">{ACTION_LABEL[r.action] ?? r.action}</td>
                <td className="px-4 py-3">
                  {r.target_title ? (
                    <span>{r.target_title}</span>
                  ) : r.target_type ? (
                    <span className="text-muted-foreground">{r.target_type}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{r.ip_address ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total} eventos · página {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-full border border-border px-3 py-1 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-full border border-border px-3 py-1 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </section>
  );
}
