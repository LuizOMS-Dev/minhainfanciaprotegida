import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Save, Eye } from "lucide-react";
import {
  getAdminArticle,
  upsertAdminArticle,
  type AdminArticle,
} from "@/lib/admin.functions";
import { RichTextEditor } from "@/components/site/RichTextEditor";
import { SafeHtml, readingTimeMinutes } from "@/components/site/SafeHtml";


export const Route = createFileRoute("/_authenticated/admin/article/$id")({
  head: () => ({
    meta: [
      { title: "Editor de conteúdo — Infância Protegida" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ArticleEditor,
});

type FormState = {
  type: AdminArticle["type"];
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  body: string;
  cover_url: string;
  primary_source_label: string;
  primary_source_url: string;
  status: AdminArticle["status"];
  publish_at: string;
  last_verified_at: string;
};

const empty: FormState = {
  type: "news",
  title: "",
  subtitle: "",
  slug: "",
  category: "",
  body: "",
  cover_url: "",
  primary_source_label: "",
  primary_source_url: "",
  status: "draft",
  publish_at: "",
  last_verified_at: new Date().toISOString().slice(0, 10),
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120);
}

function ArticleEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getFn = useServerFn(getAdminArticle);
  const upsertFn = useServerFn(upsertAdminArticle);
  const isNew = id === "new";

  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);


  const q = useQuery({
    queryKey: ["admin-article", id],
    queryFn: () => getFn({ data: { id } }),
    enabled: !isNew,
  });

  useEffect(() => {
    const a = q.data?.article;
    if (a) {
      setForm({
        type: a.type,
        title: a.title,
        subtitle: a.subtitle ?? "",
        slug: a.slug,
        category: a.category ?? "",
        body: a.body ?? "",
        cover_url: a.cover_url ?? "",
        primary_source_label: a.primary_source_label ?? "",
        primary_source_url: a.primary_source_url ?? "",
        status: a.status,
        publish_at: a.publish_at ? a.publish_at.slice(0, 16) : "",
        last_verified_at: a.last_verified_at ?? "",
      });
    }
  }, [q.data]);

  const save = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      upsertFn({ data: payload as never }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-articles"] });
      navigate({ to: "/admin" });
    },
    onError: (e: Error) => setError(e.message),
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({
      ...f,
      [key]: value,
      ...(key === "title" && !f.slug ? { slug: slugify(String(value)) } : {}),
    }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    save.mutate({
      ...(isNew ? {} : { id }),
      type: form.type,
      title: form.title,
      subtitle: form.subtitle || null,
      slug: form.slug || slugify(form.title),
      category: form.category || null,
      body: form.body || null,
      cover_url: form.cover_url || null,
      primary_source_label: form.primary_source_label || null,
      primary_source_url: form.primary_source_url || null,
      status: form.status,
      publish_at: form.publish_at ? new Date(form.publish_at).toISOString() : null,
      last_verified_at: form.last_verified_at || null,
    });
  }

  return (
    <section className="bg-background min-h-[80vh] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Voltar
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold">
          {isNew ? "Novo conteúdo" : "Editar conteúdo"}
        </h1>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Tipo *">
              <select
                value={form.type}
                onChange={(e) => update("type", e.target.value as AdminArticle["type"])}
                className={inputCls}
              >
                <option value="news">Notícia</option>
                <option value="case">Caso real</option>
                <option value="risk">Risco online</option>
                <option value="guide">Guia / Conteúdo educativo</option>
              </select>
            </Field>
            <Field label="Status *">
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value as AdminArticle["status"])}
                className={inputCls}
              >
                <option value="draft">Rascunho</option>
                <option value="review">Em revisão</option>
                <option value="scheduled">Agendado</option>
                <option value="published">Publicado</option>
                <option value="archived">Arquivado</option>
              </select>
            </Field>
          </div>

          <Field label="Título *">
            <input value={form.title} onChange={(e) => update("title", e.target.value)} required maxLength={255} className={inputCls} />
          </Field>
          <Field label="Subtítulo">
            <input value={form.subtitle} onChange={(e) => update("subtitle", e.target.value)} maxLength={500} className={inputCls} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Slug (URL) *" hint="Apenas minúsculas, números e hífen">
              <input value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} required className={inputCls} />
            </Field>
            <Field label="Categoria">
              <input value={form.category} onChange={(e) => update("category", e.target.value)} className={inputCls} />
            </Field>
          </div>

          <Field label="Imagem de capa (URL)">
            <input type="url" value={form.cover_url} onChange={(e) => update("cover_url", e.target.value)} className={inputCls} placeholder="https://..." />
          </Field>

          <Field label="Conteúdo">
            <RichTextEditor value={form.body} onChange={(html) => update("body", html)} placeholder="Escreva o conteúdo da publicação..." />
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{readingTimeMinutes(form.body)} min de leitura</span>
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                <Eye className="size-3" /> {showPreview ? "Ocultar preview" : "Visualizar preview"}
              </button>
            </div>
            {showPreview && form.body && (
              <div className="mt-3 rounded-xl border border-border bg-card p-5">
                <SafeHtml html={form.body} className="prose prose-neutral max-w-none" />
              </div>
            )}
          </Field>


          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Fonte principal — rótulo">
              <input value={form.primary_source_label} onChange={(e) => update("primary_source_label", e.target.value)} className={inputCls} placeholder="Ex: Agência Câmara" />
            </Field>
            <Field label="Fonte principal — URL">
              <input type="url" value={form.primary_source_url} onChange={(e) => update("primary_source_url", e.target.value)} className={inputCls} placeholder="https://..." />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Agendar publicação">
              <input type="datetime-local" value={form.publish_at} onChange={(e) => update("publish_at", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Última verificação editorial">
              <input type="date" value={form.last_verified_at} onChange={(e) => update("last_verified_at", e.target.value)} className={inputCls} />
            </Field>
          </div>

          {error && <p className="text-sm text-[color:var(--red-inst)]">{error}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <Link to="/admin" className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold">
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
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl bg-card border border-border px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
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
