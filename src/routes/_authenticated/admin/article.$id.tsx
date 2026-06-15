import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Save, Eye, Plus, Trash2, ShieldAlert } from "lucide-react";
import { getAdminArticle, upsertAdminArticle, type AdminArticle } from "@/lib/admin.functions";
import { RichTextEditor } from "@/components/site/RichTextEditor";
import { SafeHtml, readingTimeMinutes } from "@/components/site/SafeHtml";
import { laws } from "@/content/laws";
import { nationalContext } from "@/content/nationalContext";
import { risks } from "@/content/risks";

export const Route = createFileRoute("/_authenticated/admin/article/$id")({
  head: () => ({
    meta: [
      { title: "Editor de conteúdo — Infância Protegida" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ArticleEditor,
});

type TimelineEntry = { date: string; title?: string; text: string };
type FaqEntry = { q: string; a: string };

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
  reading_minutes: string;
  understand: string;
  lessons: string;
  timeline: TimelineEntry[];
  faq: FaqEntry[];
  related_laws: string[];
  related_signal_tags: string[];
  national_context: string[];
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
  reading_minutes: "",
  understand: "",
  lessons: "",
  timeline: [],
  faq: [],
  related_laws: [],
  related_signal_tags: [],
  national_context: [],
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

const TABS = [
  { id: "conteudo", label: "Conteúdo" },
  { id: "midia", label: "Mídia & SEO" },
  { id: "editorial", label: "Editorial" },
  { id: "timeline", label: "Linha do tempo" },
  { id: "faq", label: "FAQ" },
  { id: "relacionamentos", label: "Relacionamentos" },
  { id: "publicacao", label: "Publicação" },
] as const;
type TabId = (typeof TABS)[number]["id"];

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
  const [tab, setTab] = useState<TabId>("conteudo");

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
        reading_minutes: a.reading_minutes ? String(a.reading_minutes) : "",
        understand: a.understand ?? "",
        lessons: a.lessons ?? "",
        timeline: Array.isArray(a.timeline) ? a.timeline : [],
        faq: Array.isArray(a.faq) ? a.faq : [],
        related_laws: a.related_laws ?? [],
        related_signal_tags: a.related_signal_tags ?? [],
        national_context: a.national_context ?? [],
      });
    }
  }, [q.data]);

  const save = useMutation({
    mutationFn: (payload: Record<string, unknown>) => upsertFn({ data: payload as never }),
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

  const isCase = form.type === "case";

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
      reading_minutes: form.reading_minutes ? Number(form.reading_minutes) : null,
      understand: form.understand || null,
      lessons: isCase ? form.lessons || null : null,
      timeline: form.timeline.length ? form.timeline.filter((t) => t.date && t.text) : null,
      faq: form.faq.length ? form.faq.filter((f) => f.q && f.a) : null,
      related_laws: form.related_laws.length ? form.related_laws : null,
      related_signal_tags: form.related_signal_tags.length ? form.related_signal_tags : null,
      national_context: form.national_context.length ? form.national_context : null,
    });
  }

  const sortedRisks = useMemo(() => [...risks].sort((a, b) => a.title.localeCompare(b.title)), []);

  return (
    <section className="bg-background min-h-[80vh] py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Voltar
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold">
          {isNew ? "Novo conteúdo" : "Editar conteúdo"}
        </h1>

        {isCase && (
          <div className="mt-6 flex gap-3 rounded-xl border border-[color:var(--orange)]/40 bg-[color:var(--orange)]/5 p-4 text-sm">
            <ShieldAlert className="size-5 shrink-0 text-[color:var(--orange)]" />
            <div>
              <strong>Política de anonimização (Casos Reais):</strong> nunca cite o nome da vítima.
              Use iniciais ou idade. Agressores podem ser citados por iniciais ou por processo já
              público. Cidade/UF/ano são permitidos.
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-1 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition ${
                tab === t.id
                  ? "border-[color:var(--orange)] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-5">
          {tab === "conteudo" && (
            <>
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
                <Field label="Categoria">
                  <input
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Título *">
                <input
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  required
                  maxLength={255}
                  className={inputCls}
                />
              </Field>
              <Field label="Subtítulo / olho">
                <input
                  value={form.subtitle}
                  onChange={(e) => update("subtitle", e.target.value)}
                  maxLength={500}
                  className={inputCls}
                />
              </Field>
              <Field label="Slug (URL) *" hint="Apenas minúsculas, números e hífen">
                <input
                  value={form.slug}
                  onChange={(e) => update("slug", slugify(e.target.value))}
                  required
                  className={inputCls}
                />
              </Field>

              <Field label="Conteúdo">
                <RichTextEditor
                  value={form.body}
                  onChange={(html) => update("body", html)}
                  placeholder="Escreva o conteúdo da publicação..."
                />
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{readingTimeMinutes(form.body)} min de leitura</span>
                  <button
                    type="button"
                    onClick={() => setShowPreview((v) => !v)}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    <Eye className="size-3" />{" "}
                    {showPreview ? "Ocultar preview" : "Visualizar preview"}
                  </button>
                </div>
                {showPreview && form.body && (
                  <div className="mt-3 rounded-xl border border-border bg-card p-5">
                    <SafeHtml html={form.body} className="prose prose-neutral max-w-none" />
                  </div>
                )}
              </Field>
            </>
          )}

          {tab === "midia" && (
            <>
              <Field label="Imagem de capa (URL)">
                <input
                  type="url"
                  value={form.cover_url}
                  onChange={(e) => update("cover_url", e.target.value)}
                  className={inputCls}
                  placeholder="https://..."
                />
              </Field>
              {form.cover_url && (
                <img
                  src={form.cover_url}
                  alt=""
                  className="rounded-xl max-h-64 object-cover border border-border"
                />
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Fonte principal — rótulo">
                  <input
                    value={form.primary_source_label}
                    onChange={(e) => update("primary_source_label", e.target.value)}
                    className={inputCls}
                    placeholder="Ex: Agência Câmara"
                  />
                </Field>
                <Field label="Fonte principal — URL">
                  <input
                    type="url"
                    value={form.primary_source_url}
                    onChange={(e) => update("primary_source_url", e.target.value)}
                    className={inputCls}
                    placeholder="https://..."
                  />
                </Field>
              </div>
              <Field label="Tempo de leitura (min) — opcional, calculado automaticamente se vazio">
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={form.reading_minutes}
                  onChange={(e) => update("reading_minutes", e.target.value)}
                  className={inputCls}
                  placeholder={`${readingTimeMinutes(form.body)}`}
                />
              </Field>
            </>
          )}

          {tab === "editorial" && (
            <>
              <Field
                label="Entenda o assunto"
                hint="Contexto educativo curto (HTML simples). Aparece em destaque após a matéria."
              >
                <RichTextEditor
                  value={form.understand}
                  onChange={(html) => update("understand", html)}
                  placeholder="Por que este tema importa?"
                />
              </Field>
              {isCase && (
                <Field
                  label="O que aprendemos"
                  hint="Lições do caso — foco em prevenção e proteção. Nunca exponha a vítima."
                >
                  <RichTextEditor
                    value={form.lessons}
                    onChange={(html) => update("lessons", html)}
                    placeholder="Que sinais poderiam ter sido percebidos? Como prevenir?"
                  />
                </Field>
              )}
            </>
          )}

          {tab === "timeline" && (
            <TimelineEditor value={form.timeline} onChange={(v) => update("timeline", v)} />
          )}

          {tab === "faq" && <FaqEditor value={form.faq} onChange={(v) => update("faq", v)} />}

          {tab === "relacionamentos" && (
            <>
              <MultiSelect
                label="Legislação relacionada"
                hint="Leis e artigos exibidos no bloco de legislação."
                options={laws.map((l) => ({ value: l.slug, label: l.label }))}
                value={form.related_laws}
                onChange={(v) => update("related_laws", v)}
              />
              <MultiSelect
                label="Sinais / riscos relacionados"
                hint="Riscos online associados ao conteúdo."
                options={sortedRisks.map((r) => ({ value: r.slug, label: r.title }))}
                value={form.related_signal_tags}
                onChange={(v) => update("related_signal_tags", v)}
              />
              <MultiSelect
                label="Contexto nacional"
                hint="Campanhas e marcos institucionais."
                options={nationalContext.map((n) => ({ value: n.key, label: n.label }))}
                value={form.national_context}
                onChange={(v) => update("national_context", v)}
              />
            </>
          )}

          {tab === "publicacao" && (
            <>
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
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Agendar publicação">
                  <input
                    type="datetime-local"
                    value={form.publish_at}
                    onChange={(e) => update("publish_at", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Última verificação editorial">
                  <input
                    type="date"
                    value={form.last_verified_at}
                    onChange={(e) => update("last_verified_at", e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
            </>
          )}

          {error && <p className="text-sm text-[color:var(--red-inst)]">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Link
              to="/admin"
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
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl bg-card border border-border px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
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

function TimelineEditor({
  value,
  onChange,
}: {
  value: TimelineEntry[];
  onChange: (v: TimelineEntry[]) => void;
}) {
  function add() {
    onChange([...value, { date: "", title: "", text: "" }]);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function patch(i: number, p: Partial<TimelineEntry>) {
    onChange(value.map((v, idx) => (idx === i ? { ...v, ...p } : v)));
  }
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Cronologia editorial. Cada entrada exibe data, título opcional e descrição.
      </p>
      {value.map((entry, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="grid sm:grid-cols-[160px_1fr_auto] gap-3 items-start">
            <input
              value={entry.date}
              onChange={(e) => patch(i, { date: e.target.value })}
              placeholder="Ex: 2024 ou 18/05/2024"
              className={inputCls}
              maxLength={40}
            />
            <input
              value={entry.title ?? ""}
              onChange={(e) => patch(i, { title: e.target.value })}
              placeholder="Título (opcional)"
              className={inputCls}
              maxLength={200}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="inline-flex items-center justify-center rounded-full border border-border p-2 text-muted-foreground hover:text-[color:var(--red-inst)]"
              aria-label="Remover"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
          <textarea
            value={entry.text}
            onChange={(e) => patch(i, { text: e.target.value })}
            placeholder="O que aconteceu nesse momento?"
            className={`${inputCls} min-h-[80px]`}
            maxLength={800}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-4 py-2 text-sm hover:border-foreground"
      >
        <Plus className="size-4" /> Adicionar marco
      </button>
    </div>
  );
}

function FaqEditor({ value, onChange }: { value: FaqEntry[]; onChange: (v: FaqEntry[]) => void }) {
  function add() {
    onChange([...value, { q: "", a: "" }]);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function patch(i: number, p: Partial<FaqEntry>) {
    onChange(value.map((v, idx) => (idx === i ? { ...v, ...p } : v)));
  }
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Perguntas frequentes — alimentam o bloco FAQ e o schema <code>FAQPage</code> para Google e
        assistentes de IA.
      </p>
      {value.map((entry, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex gap-3 items-start">
            <input
              value={entry.q}
              onChange={(e) => patch(i, { q: e.target.value })}
              placeholder="Pergunta"
              className={inputCls}
              maxLength={300}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="inline-flex items-center justify-center rounded-full border border-border p-2 text-muted-foreground hover:text-[color:var(--red-inst)]"
              aria-label="Remover"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
          <textarea
            value={entry.a}
            onChange={(e) => patch(i, { a: e.target.value })}
            placeholder="Resposta clara, em linguagem acessível"
            className={`${inputCls} min-h-[90px]`}
            maxLength={4000}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-4 py-2 text-sm hover:border-foreground"
      >
        <Plus className="size-4" /> Adicionar pergunta
      </button>
    </div>
  );
}

function MultiSelect({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {hint && <span className="block mt-1 text-[11px] text-muted-foreground">{hint}</span>}
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                active
                  ? "border-[color:var(--orange)] bg-[color:var(--orange)]/10 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
