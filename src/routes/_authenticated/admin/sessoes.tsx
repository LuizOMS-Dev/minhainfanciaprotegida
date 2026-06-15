import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { MonitorSmartphone } from "lucide-react";
import { listAdminSessions } from "@/lib/security.functions";

export const Route = createFileRoute("/_authenticated/admin/sessoes")({
  head: () => ({
    meta: [
      { title: "Sessões administrativas — Painel" },
      { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
    ],
  }),
  component: SessionsPage,
});

function formatDuration(loginAt: string, logoutAt: string | null): string {
  if (!logoutAt) return "ativa";
  const ms = new Date(logoutAt).getTime() - new Date(loginAt).getTime();
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}min`;
  return `${(ms / 3_600_000).toFixed(1)}h`;
}

function SessionsPage() {
  const listFn = useServerFn(listAdminSessions);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const q = useQuery({
    queryKey: ["admin-sessions", page],
    queryFn: () => listFn({ data: { page, pageSize } }),
  });
  const rows = q.data?.rows ?? [];
  const total = q.data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="space-y-5">
      <header>
        <h2 className="font-display text-xl font-semibold inline-flex items-center gap-2">
          <MonitorSmartphone className="size-5" /> Sessões administrativas
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Histórico de logins no painel, com IP, navegador e duração.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Entrada</th>
              <th className="text-left px-4 py-3">Usuário</th>
              <th className="text-left px-4 py-3">Papel</th>
              <th className="text-left px-4 py-3">IP</th>
              <th className="text-left px-4 py-3">Navegador</th>
              <th className="text-left px-4 py-3">Saída</th>
              <th className="text-left px-4 py-3">Duração</th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  Carregando…
                </td>
              </tr>
            )}
            {!q.isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  Nenhuma sessão registrada.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border align-top">
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(r.login_at).toLocaleString("pt-BR")}
                </td>
                <td className="px-4 py-3">{r.user_email ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.user_role ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.ip_address ?? "—"}</td>
                <td
                  className="px-4 py-3 text-xs text-muted-foreground max-w-[260px] truncate"
                  title={r.user_agent ?? ""}
                >
                  {r.user_agent ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {r.logout_at ? new Date(r.logout_at).toLocaleString("pt-BR") : "—"}
                </td>
                <td className="px-4 py-3">{formatDuration(r.login_at, r.logout_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {total} sessões • página {page} de {pages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full border border-border px-3 py-1 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full border border-border px-3 py-1 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </section>
  );
}
