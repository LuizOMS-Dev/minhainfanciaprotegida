import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Database, Download } from "lucide-react";
import { exportDataset } from "@/lib/security.functions";

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

const DATASETS: Array<{ key: Dataset; label: string; desc: string }> = [
  { key: "articles", label: "Artigos", desc: "Notícias, casos, riscos e guias." },
  { key: "library", label: "Biblioteca", desc: "Materiais institucionais." },
  { key: "locations", label: "Mapa de ajuda", desc: "Conselhos, CREAS, delegacias." },
  { key: "users", label: "Usuários", desc: "Perfis, papéis e e-mails." },
  { key: "audit", label: "Auditoria", desc: "Últimos 10.000 eventos do log." },
];

function BackupPage() {
  const exportFn = useServerFn(exportDataset);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao exportar.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="space-y-5">
      <header>
        <h2 className="font-display text-xl font-semibold inline-flex items-center gap-2">
          <Database className="size-5" /> Backup administrativo
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Exporte todos os dados do portal em CSV ou JSON. Todas as exportações são auditadas.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-[color:var(--red-inst)]/30 bg-[color:var(--red-inst)]/5 px-4 py-3 text-sm text-[color:var(--red-inst)]">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {DATASETS.map((d) => (
          <div key={d.key} className="rounded-2xl border border-border bg-card p-5">
            <p className="font-display font-semibold">{d.label}</p>
            <p className="text-sm text-muted-foreground mt-1">{d.desc}</p>
            <div className="mt-4 flex gap-2">
              {(["csv", "json"] as Format[]).map((fmt) => (
                <button
                  key={fmt}
                  disabled={busy === `${d.key}:${fmt}`}
                  onClick={() => download(d.key, fmt)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60"
                >
                  <Download className="size-4" /> {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
