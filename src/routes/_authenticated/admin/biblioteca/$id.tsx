import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { getAdminLibraryItem, upsertAdminLibrary } from "@/lib/library.functions";

export const Route = createFileRoute("/_authenticated/admin/biblioteca/$id")({
  component: LibraryEditor,
});

const empty = {
  title: "",
  description: "",
  category: "",
  audience: "",
  source_org: "",
  year: new Date().getFullYear(),
  file_url: "",
};

function LibraryEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = id === "new";
  const getFn = useServerFn(getAdminLibraryItem);
  const upsertFn = useServerFn(upsertAdminLibrary);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["admin-library", id],
    queryFn: () => getFn({ data: { id } }),
    enabled: !isNew,
  });

  useEffect(() => {
    const it = q.data?.item;
    if (it) {
      setForm({
        title: it.title,
        description: it.description ?? "",
        category: it.category,
        audience: it.audience,
        source_org: it.source_org,
        year: it.year,
        file_url: it.file_url,
      });
    }
  }, [q.data]);

  const save = useMutation({
    mutationFn: (p: Record<string, unknown>) => upsertFn({ data: p as never }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-library"] });
      navigate({ to: "/admin/biblioteca" });
    },
    onError: (e: Error) => setError(e.message),
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    save.mutate({
      ...(isNew ? {} : { id }),
      title: form.title,
      description: form.description || null,
      category: form.category,
      audience: form.audience,
      source_org: form.source_org,
      year: Number(form.year),
      file_url: form.file_url,
    });
  }

  return (
    <section>
      <Link
        to="/admin/biblioteca"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar
      </Link>
      <h2 className="mt-4 font-display text-2xl font-semibold">
        {isNew ? "Novo material" : "Editar material"}
      </h2>

      <form onSubmit={submit} className="mt-6 space-y-5 max-w-3xl">
        <Field label="Título *">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            maxLength={255}
            className={inputCls}
          />
        </Field>
        <Field label="Descrição">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            maxLength={2000}
            className={inputCls}
          />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Categoria *" hint="Ex: cartilha, manual, pesquisa">
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              className={inputCls}
            />
          </Field>
          <Field label="Público-alvo *" hint="Ex: pais, educadores, jovens">
            <input
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
              required
              className={inputCls}
            />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Fonte / Organização *">
            <input
              value={form.source_org}
              onChange={(e) => setForm({ ...form, source_org: e.target.value })}
              required
              className={inputCls}
            />
          </Field>
          <Field label="Ano *">
            <input
              type="number"
              min={1900}
              max={2100}
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              required
              className={inputCls}
            />
          </Field>
        </div>
        <Field
          label="URL do arquivo (PDF) *"
          hint="Cole a URL pública do PDF (pode ser hospedado em qualquer lugar oficial)."
        >
          <input
            type="url"
            value={form.file_url}
            onChange={(e) => setForm({ ...form, file_url: e.target.value })}
            required
            className={inputCls}
            placeholder="https://..."
          />
        </Field>

        {error && <p className="text-sm text-[color:var(--red-inst)]">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Link
            to="/admin/biblioteca"
            className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={save.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--navy-deep)] text-white px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            <Save className="size-4" /> {save.isPending ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl bg-card border border-border px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="block mt-1 text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}
