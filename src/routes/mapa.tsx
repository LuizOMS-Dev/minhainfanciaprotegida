import { createFileRoute } from "@tanstack/react-router";
import { Building2, Compass, ExternalLink, MapPin, Navigation, Phone, Search, Shield } from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ReferencesBlock } from "@/components/site/ReferencesBlock";
import { PageHero } from "@/components/site/PageHero";
import { helpLocations, ufList, type HelpType } from "@/content/helpLocations";
import heroMapa from "@/assets/hero-mapa.jpg";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa de Ajuda — Conselhos Tutelares e Delegacias por cidade" },
      {
        name: "description",
        content:
          "Encontre Conselhos Tutelares, delegacias especializadas, CREAS, CRAS e Ministério Público por estado e cidade no Brasil.",
      },
      { property: "og:title", content: "Mapa de Ajuda — Infância Protegida" },
      { property: "og:description", content: "Localize serviços de proteção próximos da sua cidade." },
    ],
    links: [{ rel: "canonical", href: "/mapa" }],
  }),
  component: Page,
});

const typeMeta: Record<HelpType, { label: string; icon: typeof Shield }> = {
  conselho_tutelar: { label: "Conselho Tutelar", icon: Shield },
  delegacia: { label: "Delegacia especializada", icon: Building2 },
  creas: { label: "CREAS", icon: Compass },
  cras: { label: "CRAS", icon: Compass },
  mp: { label: "Ministério Público", icon: Building2 },
  disque: { label: "Disque Direitos Humanos", icon: Phone },
};

function Page() {
  const [uf, setUf] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [q, setQ] = useState("");

  const cities = useMemo(() => {
    const set = new Set<string>();
    helpLocations.forEach((l) => {
      if (!uf || l.state === uf) set.add(l.city);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [uf]);

  const list = useMemo(() => {
    return helpLocations.filter((l) => {
      if (uf && l.state !== uf && l.state !== "BR") return false;
      if (city && l.city !== city && l.state !== "BR") return false;
      if (!q.trim()) return true;
      const s = `${l.name} ${l.city} ${l.address ?? ""}`.toLowerCase();
      return s.includes(q.trim().toLowerCase());
    });
  }, [uf, city, q]);

  return (
    <>
      <PageHero
        image={heroMapa}
        eyebrow="Mapa de ajuda"
        icon={<MapPin className="size-3.5 text-[color:var(--orange)]" />}
        title="Encontre quem pode ajudar perto de você"
        description="Selecione o estado ou pesquise por cidade para localizar Conselhos Tutelares, delegacias especializadas e centros de apoio."
        tall
      />

      <section className="py-12 bg-background border-b border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid gap-3 sm:grid-cols-[140px_200px_1fr]">
          <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-3">
            <label htmlFor="uf" className="sr-only">Estado</label>
            <select
              id="uf"
              value={uf}
              onChange={(e) => { setUf(e.target.value); setCity(""); }}
              className="w-full bg-transparent text-sm focus:outline-none"
            >
              <option value="">Todos os estados</option>
              {ufList.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-3">
            <label htmlFor="city" className="sr-only">Cidade</label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none"
            >
              <option value="">Todas as cidades</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar nome, endereço ou serviço"
              className="w-full rounded-full bg-card border border-border pl-11 pr-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
            />
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-3 text-xs text-muted-foreground">
          {list.length} {list.length === 1 ? "serviço encontrado" : "serviços encontrados"}
        </div>
      </section>


      <section className="py-16 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {list.map((l, i) => {
              const meta = typeMeta[l.type];
              const Icon = meta.icon;
              const mapsQuery = encodeURIComponent(
                `${l.name} ${l.address ?? ""} ${l.city} ${l.state}`.trim()
              );
              return (
                <Reveal key={l.name + l.city} delay={i * 40}>
                  <article className="h-full rounded-2xl border border-border bg-card p-6 hover-lift">
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-orange text-[color:var(--navy-deep)]">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {meta.label} · {l.state}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold leading-snug">{l.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{l.city}</p>
                    {l.address && <p className="mt-2 text-sm text-foreground/80">{l.address}</p>}
                    <div className="mt-3 space-y-1 text-sm text-foreground/80">
                      {l.phone && (
                        <p>
                          <span className="font-semibold">Telefone:</span>{" "}
                          <a href={`tel:${l.phone.replace(/\D/g, "")}`} className="text-[color:var(--red-inst)] hover:underline">
                            {l.phone}
                          </a>
                        </p>
                      )}
                      {l.hours && <p><span className="font-semibold">Horário:</span> {l.hours}</p>}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-3.5 py-1.5 text-xs font-semibold"
                        aria-label={`Abrir rota para ${l.name} no Google Maps`}
                      >
                        <Navigation className="size-3.5" /> Google Maps
                      </a>
                      {l.officialUrl && (
                        <a
                          href={l.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--red-inst)] hover:underline"
                        >
                          Site oficial <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {list.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
              <p>Nenhum serviço cadastrado para este estado ainda.</p>
              <p className="mt-2 text-sm">
                Em qualquer cidade do Brasil, você pode ligar para o{" "}
                <a href="tel:100" className="font-semibold text-[color:var(--red-inst)]">Disque 100</a>{" "}
                ou procurar o Conselho Tutelar pelo telefone <strong>156</strong> (capitais).
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="pb-24 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ReferencesBlock
            primary={{
              label: "MDHC — Conselhos Tutelares no Brasil",
              url: "https://www.gov.br/mdh/pt-br/navegue-por-temas/crianca-e-adolescente/conselhos-tutelares",
            }}
            secondary={[
              { label: "Portais das Polícias Civis estaduais", url: "https://www.gov.br/pf/pt-br" },
              { label: "CNMP — Ministério Público", url: "https://www.cnmp.mp.br/portal/" },
              { label: "MDS — Proteção Social Especial (CREAS)", url: "https://www.gov.br/mds/pt-br/acoes-e-programas/protecao-social-especial" },
            ]}
            lastVerified="2025-11-15"
          />
        </div>
      </section>
    </>
  );
}
