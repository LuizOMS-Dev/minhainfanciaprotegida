import { createFileRoute } from "@tanstack/react-router";
import { Building2, Compass, ExternalLink, MapPin, Navigation, Phone, Search, Shield, Heart, GraduationCap, Activity, Users, Siren, Globe } from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ReferencesBlock } from "@/components/public/ReferencesBlock";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
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
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/mapa" }],
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
    <div className="bg-background">
      {/* HEADER SECTION - Custom in place of PageHero */}
      <section className="relative overflow-hidden bg-[color:var(--background)] pt-16 md:pt-24 lg:pt-32 pb-16 lg:pb-24 border-b border-border">
        {/* Subtle blur background */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 opacity-40 mix-blend-multiply pointer-events-none" aria-hidden>
          <div className="w-[500px] h-[500px] rounded-full bg-[color:var(--navy)]/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="max-w-xl">
            <PageBreadcrumb
              items={[
                { label: "Início", to: "/" },
                { label: "Mapa de ajuda" },
              ]}
              className="mb-6"
            />
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy)]/10 bg-[color:var(--navy)]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[color:var(--navy-deep)] shadow-sm">
                <MapPin className="size-3.5 text-[color:var(--orange)]" /> Mapa de ajuda
              </span>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-8 font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-[color:var(--navy-deep)] text-balance">
                Encontre quem pode ajudar perto de você
              </h1>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Selecione o estado ou pesquise por cidade para localizar Conselhos Tutelares, delegacias especializadas e centros de apoio em sua região.
              </p>
            </Reveal>
          </div>
          
          <Reveal delay={300} className="lg:justify-self-end w-full">
            <div className="relative aspect-[4/3] w-full max-w-lg rounded-2xl overflow-hidden shadow-elegant border border-border/50">
              <img
                src={heroMapa}
                alt="Mapa do Brasil"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/20 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-12 bg-card border-b border-border sticky top-[70px] md:top-[80px] z-30 shadow-sm backdrop-blur-md bg-card/90">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid gap-4 md:grid-cols-[160px_220px_1fr]">
          <div className="relative">
            <label htmlFor="uf" className="sr-only">Estado</label>
            <select
              id="uf"
              value={uf}
              onChange={(e) => { setUf(e.target.value); setCity(""); }}
              className="w-full appearance-none rounded-lg bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--orange)] focus:border-transparent transition-shadow cursor-pointer"
            >
              <option value="">Todos os estados</option>
              {ufList.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <Compass className="size-4" aria-hidden />
            </div>
          </div>
          
          <div className="relative">
            <label htmlFor="city" className="sr-only">Cidade</label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none rounded-lg bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--orange)] focus:border-transparent transition-shadow cursor-pointer disabled:opacity-50"
              disabled={!uf && cities.length === 0}
            >
              <option value="">Todas as cidades</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <MapPin className="size-4" aria-hidden />
            </div>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-[color:var(--orange)] transition-colors" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome, endereço ou serviço..."
              className="w-full rounded-lg bg-background border border-border pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--orange)] focus:border-transparent transition-shadow"
            />
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {list.length} {list.length === 1 ? "serviço encontrado" : "serviços encontrados"}
          </p>
        </div>
      </section>

      {/* BLOCO EDUCATIVO DA REDE */}
      <section className="py-24 bg-[color:var(--navy)] text-white relative overflow-hidden border-b border-border/10">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] rounded-full bg-white blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--orange)] mb-6">
                <Users className="size-4" /> Trabalho em conjunto
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-white">
                Como funciona a Rede de Proteção?
              </h2>
              <p className="mt-6 text-lg text-white/80 leading-relaxed">
                A proteção da infância não é dever apenas da polícia ou do governo. É uma rede articulada onde cada pessoa e instituição tem um papel vital definido por lei.
              </p>
            </Reveal>
          </div>
          
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Heart,
                title: "Família",
                desc: "Primeiro núcleo de proteção. Tem o dever de assegurar um ambiente seguro, observar mudanças de comportamento, acolher sem julgamentos e pedir ajuda.",
              },
              {
                icon: GraduationCap,
                title: "Escola",
                desc: "Ambiente fundamental. Educadores notam sinais (marcas físicas, isolamento) e têm a responsabilidade de acionar o Conselho Tutelar de forma protocolar.",
              },
              {
                icon: Shield,
                title: "Conselho Tutelar",
                desc: "Recebe denúncias de ameaça ou violação de direitos, requisita serviços públicos e aplica medidas de proteção. É a porta de entrada da rede.",
              },
              {
                icon: Activity,
                title: "Saúde",
                desc: "Hospitais, UBS e CAPs. Além do atendimento, profissionais de saúde têm o dever de notificação compulsória em casos suspeitos de violência.",
              },
              {
                icon: Users,
                title: "Assistência Social",
                desc: "CRAS e CREAS acompanham famílias em situação de vulnerabilidade, oferecendo suporte psicológico e social para romper o ciclo de violência.",
              },
              {
                icon: Siren,
                title: "Segurança Pública",
                desc: "Delegacias e Polícia Militar. Atuam na repressão, investigação de crimes, prisões em flagrante e garantia de medidas protetivas emergenciais.",
              },
              {
                icon: Building2,
                title: "Ministério Público",
                desc: "Fiscal da lei. Pode instaurar inquéritos, propor ações penais contra agressores e exigir do Estado o cumprimento de políticas públicas.",
              },
              {
                icon: Globe,
                title: "Comunidade",
                desc: "Vizinhos, líderes e sociedade. O dever legal de denunciar (Disque 100) e não se omitir diante de violações é responsabilidade de todo cidadão.",
              },
            ].map((actor, i) => (
              <Reveal key={actor.title} delay={i * 40}>
                <article className="h-full rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-white/20 transition-all shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-[color:var(--orange)] text-[color:var(--navy-deep)] shadow-sm">
                      <actor.icon className="size-6" aria-hidden />
                    </span>
                    <h3 className="font-display text-xl font-semibold text-white">
                      {actor.title}
                    </h3>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {actor.desc}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-background border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {list.map((l, i) => {
              const meta = typeMeta[l.type];
              const Icon = meta.icon;
              const mapsQuery = encodeURIComponent(
                `${l.name} ${l.address ?? ""} ${l.city} ${l.state}`.trim()
              );
              return (
                <Reveal key={l.name + l.city} delay={i * 40}>
                  <article className="h-full rounded-xl border border-border bg-card p-8 hover-lift hover:border-[color:var(--navy)]/20 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 bg-[color:var(--orange)] h-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <span className="inline-flex size-12 items-center justify-center rounded-lg bg-[color:var(--navy)]/5 border border-[color:var(--navy)]/10 text-[color:var(--navy-deep)] group-hover:bg-[color:var(--navy)] group-hover:text-white transition-colors">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right border border-border rounded-full px-3 py-1 bg-background">
                        {meta.label} · {l.state}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold leading-snug text-[color:var(--navy-deep)]">{l.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{l.city}</p>
                    {l.address && <p className="mt-4 text-sm text-foreground/85 leading-relaxed">{l.address}</p>}
                    <div className="mt-4 space-y-2 text-sm text-foreground/85 bg-background p-4 rounded-lg border border-border/50">
                      {l.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="size-4 text-muted-foreground" />
                          <span className="font-semibold text-[color:var(--navy-deep)]">Telefone:</span>{" "}
                          <a href={`tel:${l.phone.replace(/\D/g, "")}`} className="text-[color:var(--red-inst)] hover:underline font-medium">
                            {l.phone}
                          </a>
                        </p>
                      )}
                      {l.hours && (
                        <p className="flex items-center gap-2">
                          <Activity className="size-4 text-muted-foreground" />
                          <span className="font-semibold text-[color:var(--navy-deep)]">Horário:</span> {l.hours}
                        </p>
                      )}
                    </div>
                    <div className="mt-6 pt-5 border-t border-border flex flex-wrap gap-3">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--navy)] text-white px-5 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-[color:var(--navy-deep)] transition shadow-sm"
                        aria-label={`Abrir rota para ${l.name} no Google Maps`}
                      >
                        <Navigation className="size-3.5" /> Google Maps
                      </a>
                      {l.officialUrl && (
                        <a
                          href={l.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--navy)]/20 px-5 py-2.5 text-xs font-semibold tracking-widest uppercase text-[color:var(--navy-deep)] hover:bg-[color:var(--navy)]/5 transition-colors"
                        >
                          Site oficial <ExternalLink className="size-3.5" />
                        </a>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {list.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
              <Search className="size-12 text-muted-foreground/30 mx-auto mb-4" aria-hidden />
              <p className="font-display text-xl font-medium text-[color:var(--navy-deep)]">
                Nenhum serviço encontrado.
              </p>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                Tente ajustar sua busca ou limpar os filtros.
                Em qualquer cidade do Brasil, você pode ligar para o{" "}
                <a href="tel:100" className="font-semibold text-[color:var(--red-inst)] hover:underline">Disque 100</a>{" "}
                ou procurar o Conselho Tutelar pelo telefone <strong>156</strong> (capitais).
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-card">
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
    </div>
  );
}
