import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { Plus, Upload } from "lucide-react";
import {
  deleteAdminLocation,
  importAdminLocationsCsv,
  listAdminLocations,
  type AdminHelpLocation,
} from "@/lib/locations.functions";

export const Route = createFileRoute("/_authenticated/admin/mapa/")({
  component: LocationsList,
});

const typeLabels: Record<string, string> = {
  conselho_tutelar: "Conselho Tutelar",
  creas: "CREAS",
  cras: "CRAS",
  delegacia: "Delegacia",
  disque: "Disque 100",
  mp: "Ministério Público",
};

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = (values[i] ?? "").trim()));
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

function LocationsList() {
  const qc = useQueryClient();
  const listFn = useServerFn(listAdminLocations);
  const delFn = useServerFn(deleteAdminLocation);
  const importFn = useServerFn(importAdminLocationsCsv);
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const q = useQuery({ queryKey: ["admin-locations"], queryFn: () => listFn() });
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-locations"] }),
  });
  const importMut = useMutation({
    mutationFn: (rows: Record<string, string>[]) => importFn({ data: { rows } }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["admin-locations"] });
      const errs = res.errors.length ? ` (${res.errors.length} linha(s) com erro)` : "";
      setImportMsg(`${res.inserted} local(is) importado(s)${errs}.`);
    },
    onError: (e: Error) => setImportMsg(e.message),
  });

  const locations = (q.data?.locations ?? []) as AdminHelpLocation[];

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setImportMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length === 0) {
      setImportMsg("CSV vazio ou inválido. Verifique o cabeçalho.");
      return;
    }
    importMut.mutate(rows);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Mapa de ajuda</h2>
          <p className="text-sm text-muted-foreground">
            Conselhos Tutelares, CREAS, CRAS, delegacias e órgãos de proteção.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            onChange={onFile}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={importMut.isPending}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            <Upload className="size-4" /> {importMut.isPending ? "Importando..." : "Importar CSV"}
          </button>
          <Link
            to="/admin/mapa/$id"
            params={{ id: "new" }}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-4 py-2 text-sm font-semibold"
          >
            <Plus className="size-4" /> Novo local
          </Link>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        CSV: <code>name,type,state,city,address,phone,hours,official_url,lat,lng</code> — type entre{" "}
        {Object.keys(typeLabels).join(", ")}.
      </p>

      {importMsg && (
        <div className="mt-4 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
          {importMsg}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Nome</th>
              <th className="text-left px-4 py-3">Tipo</th>
              <th className="text-left px-4 py-3">Cidade / UF</th>
              <th className="text-left px-4 py-3">Telefone</th>
              <th className="text-right px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Carregando…
                </td>
              </tr>
            )}
            {!q.isLoading && locations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum local cadastrado.
                </td>
              </tr>
            )}
            {locations.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{l.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{typeLabels[l.type] ?? l.type}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {l.city} / {l.state}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{l.phone ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/admin/mapa/$id"
                    params={{ id: l.id }}
                    className="text-sm font-semibold text-[color:var(--red-inst)] hover:underline mr-3"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Excluir "${l.name}"?`)) del.mutate(l.id);
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
