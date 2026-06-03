import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Save } from "lucide-react";
import {
  getAdminLocation,
  upsertAdminLocation,
  type LocationType,
} from "@/lib/locations.functions";

export const Route = createFileRoute("/_authenticated/admin/mapa/$id")({
  component: LocationEditor,
});

const typeOptions: { value: LocationType; label: string }[] = [
  { value: "conselho_tutelar", label: "Conselho Tutelar" },
  { value: "creas", label: "CREAS" },
  { value: "cras", label: "CRAS" },
  { value: "delegacia", label: "Delegacia" },
  { value: "disque", label: "Disque 100" },
  { value: "mp", label: "Ministério Público" },
];

const empty = {
  name: "",
  type: "conselho_tutelar" as LocationType,
  state: "",
  city: "",
  address: "",
  phone: "",
  hours: "",
  official_url: "",
  lat: "",
  lng: "",
};

function LocationEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = id === "new";
  const getFn = useServerFn(getAdminLocation);
  const upsertFn = useServerFn(upsertAdminLocation);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["admin-location", id],
    queryFn: () => getFn({ data: { id } }),
    enabled: !isNew,
  });

  useEffect(() => {
    const l = q.data?.location;
    if (l) {
      setForm({
        name: l.name,
        type: l.type,
        state: l.state,
        city: l.city,
        address: l.address ?? "",
        phone: l.phone ?? "",
        hours: l.hours ?? "",
        official_url: l.official_url ?? "",
        lat: l.lat?.toString() ?? "",
        lng: l.lng?.toString() ?? "",
      });
    }
  }, [q.data]);

  const save = useMutation({
    mutationFn: (p: Record<string, unknown>) => upsertFn({ data: p as never }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-locations"] });
      navigate({ to: "/admin/mapa" });
    },
    onError: (e: Error) => setError(e.message),
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    save.mutate({
      ...(isNew ? {} : { id }),
      name: form.name,
      type: form.type,
      state: form.state.toUpperCase(),
      city: form.city,
      address: form.address || null,
      phone: form.phone || null,
      hours: form.hours || null,
      official_url: form.official_url || null,
      lat: form.lat ? Number(form.lat) : null,
      lng: form.lng ? Number(form.lng) : null,
    });
  }

  return (
    <section>
      <Link to="/admin/mapa" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Voltar
      </Link>
      <h2 className="mt-4 font-display text-2xl font-semibold">
        {isNew ? "Novo local de ajuda" : "Editar local"}
      </h2>

      <form onSubmit={submit} className="mt-6 space-y-5 max-w-3xl">
        <Field label="Nome *">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={200} className={inputCls} />
        </Field>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Tipo *">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as LocationType })} className={inputCls}>
              {typeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="UF *" hint="2 letras">
            <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} required maxLength={2} minLength={2} className={inputCls} />
          </Field>
          <Field label="Cidade *">
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required maxLength={120} className={inputCls} />
          </Field>
        </div>
        <Field label="Endereço">
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} maxLength={300} className={inputCls} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Telefone">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={40} className={inputCls} />
          </Field>
          <Field label="Horário de atendimento">
            <input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} maxLength={160} className={inputCls} />
          </Field>
        </div>
        <Field label="Site oficial">
          <input type="url" value={form.official_url} onChange={(e) => setForm({ ...form, official_url: e.target.value })} placeholder="https://..." className={inputCls} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Latitude">
            <input value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className={inputCls} placeholder="-23.55" />
          </Field>
          <Field label="Longitude">
            <input value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} className={inputCls} placeholder="-46.63" />
          </Field>
        </div>

        {error && <p className="text-sm text-[color:var(--red-inst)]">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Link to="/admin/mapa" className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold">
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

const inputCls = "w-full rounded-xl bg-card border border-border px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="block mt-1 text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}
