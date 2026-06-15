import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  BookOpen,
  Database,
  Download,
  FileText,
  History,
  MapPin,
  ScrollText,
  Users,
} from "lucide-react";
import { exportDataset } from "@/services/authService";
import { listAuditLog } from "@/services/auditService";
import { AdminError, SectionCard } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/backup")({
  head: () => ({
    meta: [
      { title: "Backup administrativo — Painel" },
      { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
    ],
  }),
  component: BackupPage,
});

type Dataset = "articles" | "library" | "locations" | "users" | "audit";
type Format = "csv" | "json";

const DATASETS: Array<{
  key: Dataset;
  label: string;
  desc: string;
  icon: typeof FileText;
}> = [
  { key: "articles", label: "Artigos", desc: "Notícias, casos, riscos e guias.", icon: FileText },
  { key: "library", label: "Biblioteca", desc: "Materiais institucionais.", icon: BookOpen },
  { key: "locations", label: "Mapa de ajuda", desc: "Conselhos, CREAS, delegacias.", icon: MapPin },
  { key: "users", label: "Usuários", desc: "Perfis, papéis e e-mails.", icon: Users },
  { key: "audit", label: "Auditoria", desc: "Últimos 10.000 eventos do log.", icon: ScrollText },
];

const DATASET_LABEL: Record<string, string> = {
  articles: "Artigos",
  library: "Biblioteca",
  locations: "Mapa de ajuda",
  users: "Usuários",
  audit: "Auditoria",
};

function BackupPage() {
  const exportFn = useServerFn(exportDataset);
  const auditFn = useServerFn(listAuditLog);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const historyQ = useQuery({
    queryKey: ["admin-export-history", tick],
    queryFn: () =>
      auditFn({
        data: { action: "admin_export", page: 1, pageSize: 25 },
      }),
  });

  async function download(dataset: Dataset, format: Format) {
    setBusy(`${dataset}:${format}`);
    setError(null);
    try {
      const res = await exportFn({ data: { dataset, format } });
      const mime = format === "csv" ? "text/csv;charset=utf-8" : "application/json";
      const blob = new Blob([res.payload], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const date = new Date().toISOString().slice(0, 10);
      a.download = `infancia-protegida_${dataset}_${date}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setTick((t) => t + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao exportar.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold inline-flex items-center gap-2">
          <Database className="size-5" /> Central de backup
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Exporte qualquer conjunto de dados em CSV ou JSON. Toda exportação é auditada.
        </p>
      </div>

      {error && <AdminError message={error} />}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DATASETS.map((d) => (
          <div
            key={d.key}
            className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[color:var(--navy-deep)] text-white p-2.5 shrink-0">
                <d.icon className="size-5" aria-hidden />
              </div>
              <div>
                <p className="font-display font-semibold">{d.label}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{d.desc}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-auto">
              {(["csv", "json"] as Format[]).map((fmt) => (
                <button
                  key={fmt}
                  disabled={busy === `${d.key}:${fmt}`}
                  onClick={() => download(d.key, fmt)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-60"
                >
                  <Download className="size-3.5" />
                  {busy === `${d.key}:${fmt}` ? "Exportando…" : fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SectionCard
        title="Histórico de exportações"
        description="Últimas 25 exportações registradas na auditoria."
        action={<History className="size-4 text-muted-foreground" />}
      >
        {historyQ.isLoading && (
          <p className="text-sm text-muted-foreground py-4 text-center">Carregando…</p>
        )}
        {!historyQ.isLoading && (historyQ.data?.rows ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Nenhuma exportação registrada ainda.
          </p>
        )}
        <ul className="divide-y divide-border">
          {(historyQ.data?.rows ?? []).map((r) => {
            const meta = (r.metadata ?? {}) as Record<string, unknown>;
            const fmt = String(meta.format ?? "—").toUpperCase();
            const count = meta.count ?? "?";
            const ds = DATASET_LABEL[r.target_type ?? ""] ?? r.target_type ?? "—";
            return (
              <li key={r.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    {ds}{" "}
                    <span className="text-muted-foreground font-normal">· {fmt} · {String(count)} registros</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {r.user_email ?? "sistema"} · {new Date(r.created_at).toLocaleString("pt-BR")}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </section>
  );
}
