import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Compass,
  ExternalLink,
  Gavel,
  GraduationCap,
  HeartHandshake,
  Home,
  MapPin,
  Navigation,
  Phone,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ReferencesBlock } from "@/components/site/ReferencesBlock";
import { InstitutionalHero } from "@/components/site/InstitutionalHero";
import { helpLocations, ufList, type HelpType } from "@/content/helpLocations";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Rede de Proteção à Infância — Quem faz parte e como atuam" },
      {
        name: "description",
        content:
          "Família, escola, Conselho Tutelar, Assistência Social, Saúde, psicólogos, Ministério Público, Polícia, Judiciário e comunidade. Conheça a Rede de Proteção e localize serviços perto de você.",
      },
      { property: "og:title", content: "Rede de Proteção — Infância Protegida" },
      { property: "og:description", content: "Quem compõe a Rede de Proteção e onde encontrar ajuda." },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/mapa" }],
  }),
  component: Page,
});

type Actor = { icon: LucideIcon; title: string; text: string };

const network: Actor[] = [
  {
    icon: Home,
    title: "Família",
    text: "Primeiro espaço de proteção: garantir afeto, escuta e ambiente seguro, sem segredos prejudiciais.",
  },
  {
    icon: GraduationCap,
    title: "Escola",
    text: "Observa, acolhe e notifica. Professores e gestores têm dever legal de comunicar suspeitas ao Conselho Tutelar (ECA, art. 245).",
  },
  {
    icon: Shield,
    title: "Conselho Tutelar",
    text: "Órgão municipal que recebe a notificação, aplica medidas de proteção e articula a rede para acompanhar o caso.",
  },
  {
    icon: HeartHandshake,
    title: "Assistência Social",
    text: "CRAS e CREAS oferecem acompanhamento social, apoio à família e proteção de crianças e adolescentes em situação de risco.",
  },
  {
    icon: Stethoscope,
    title: "Saúde",
    text: "Postos de saúde, hospitais e UPAs prestam atendimento, fazem o registro clínico e a notificação compulsória de violência.",
  },
  {
    icon: Users,
    title: "Psicólogos e profissionais de saúde mental",
    text: "Acolhem a criança e a família, oferecem escuta especializada e reduzem os impactos psicológicos da violência.",
  },
  {
    icon: Building2,
    title: "Ministério Público",
    text: "Fiscaliza políticas públicas, atua na proteção dos direitos da criança e pode requisitar investigações.",
  },
  {
    icon: ShieldAlert,
    title: "Polícia",
    text: "Polícia Civil investiga; Polícia Militar atende emergências (190); Polícia Federal atua em crimes cibernéticos e exploração transnacional.",
  },
  {
    icon: Gavel,
    title: "Judiciário",
    text: "Varas da Infância e da Juventude aplicam medidas judiciais de proteção e responsabilizam agressores.",
  },
  {
    icon: Users,
    title: "Comunidade",
    text: "Vizinhos, igrejas, ONGs e lideranças locais ajudam a identificar, acolher e mobilizar apoio. Proteger é dever de todos.",
  },
];

const typeMeta: Record<HelpType, { label: string; icon: LucideIcon }> = {
  conselho_tutelar: { label: "Conselho Tutelar", icon: Shield },
  delegacia: { label: "Delegacia especializada", icon: Building2 },
  creas: { label: "CREAS", icon: Compass },
  cras: { label: "CRAS", icon: Compass },
  mp: { label: "Ministério Público", icon: Scale },
  disque: { label: "Disque Direitos Humanos", icon: Phone },
};

function Page() {
  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");
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
      <InstitutionalHero
        eyebrow="Rede de proteção"
        title="Proteger uma criança é trabalho de muitos"
        description="A Rede de Proteção é o conjunto de pessoas, serviços e instituições que atuam juntos para garantir os direitos previstos no Estatuto da Criança e do Adolescente. Conheça quem faz parte — e localize serviços perto de você."
      />

      {/* Atores da rede */}
      <section className="py-20 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Quem faz parte"
            title="As 10 frentes da Rede de Proteção"
            description="Cada ator tem um papel definido. Quando todos atuam de forma articulada, a proteção é efetiva."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {network.map((n, i) => (
              <Reveal key={n.title} delay={i * 40}>
                <article className="h-full rounded-2xl border border-border bg-card p-5">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[color:var(--surface-soft)] text-[color:var(--navy-deep)]">
                    <n.icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-[color:var(--navy-deep)]">
                    {n.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{n.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Localizador */}
      <section className="py-20 sm:py-24 bg-[color:var(--surface-soft)] border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Encontrar ajuda"
            title="Localizar serviços perto de você"
            description="Filtre por estado e cidade para encontrar Conselhos Tutelares, delegacias especializadas, CREAS, CRAS e MP."
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-[160px_220px_1fr] max-w-5xl">
            <div className="flex items-center rounded-full bg-card border border-border px-4 py-3">
              <select
                value={uf}
                onChange={(e) => { setUf(e.target.value); setCity(""); }}
                aria-label="Estado"
                className="w-full bg-transparent text-sm focus:outline-none"
              >
                <option value="">Todos os estados</option>
                {ufList.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center rounded-full bg-card border border-border px-4 py-3">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                aria-label="Cidade"
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
          <p className="mt-3 text-xs text-muted-foreground">
            {list.length} {list.length === 1 ? "serviço encontrado" : "serviços encontrados"}
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((l, i) => {
              const meta = typeMeta[l.type];
              const Icon = meta.icon;
              const mapsQuery = encodeURIComponent(
                `${l.name} ${l.address ?? ""} ${l.city} ${l.state}`.trim()
              );
              return (
                <Reveal key={l.name + l.city} delay={i * 40}>
                  <article className="h-full rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[color:var(--surface-soft)] text-[color:var(--navy-deep)]">
                        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {meta.label} · {l.state}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-base font-semibold leading-snug text-[color:var(--navy-deep)]">{l.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{l.city}</p>
                    {l.address && <p className="mt-2 text-sm text-foreground/80">{l.address}</p>}
                    <div className="mt-3 space-y-1 text-sm text-foreground/80">
                      {l.phone && (
                        <p>
                          <span className="font-semibold">Telefone:</span>{" "}
                          <a href={`tel:${l.phone.replace(/\D/g, "")}`} className="text-[color:var(--orange)] hover:underline">
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
                        className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--navy-deep)] text-[color:var(--navy-deep)] px-3.5 py-1.5 text-xs font-semibold hover:bg-[color:var(--navy-deep)] hover:text-white transition-colors"
                      >
                        <Navigation className="size-3.5" /> Como chegar
                      </a>
                      {l.officialUrl && (
                        <a
                          href={l.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--orange)] hover:underline"
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
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
              <MapPin className="mx-auto size-8 text-[color:var(--orange)]" strokeWidth={1.75} aria-hidden />
              <p className="mt-3">Nenhum serviço cadastrado para este filtro.</p>
              <p className="mt-2 text-sm">
                Em qualquer cidade do Brasil, ligue para o{" "}
                <a href="tel:100" className="font-semibold text-[color:var(--orange)]">Disque 100</a>{" "}
                ou busque o Conselho Tutelar pelo telefone <strong>156</strong> (capitais).
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-background">
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
