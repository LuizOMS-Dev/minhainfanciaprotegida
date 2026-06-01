import { createFileRoute } from "@tanstack/react-router";
import { Building2, Compass, ExternalLink, MapPin, Search, Shield } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa de Ajuda — Encontre Conselho Tutelar e delegacias" },
      {
        name: "description",
        content:
          "Encontre Conselhos Tutelares, Delegacias Especializadas (DPCA) e Centros de Apoio à criança e ao adolescente no Brasil.",
      },
      { property: "og:title", content: "Mapa de Ajuda" },
      { property: "og:description", content: "Localize Conselhos Tutelares e delegacias especializadas." },
      { property: "og:url", content: "/mapa" },
    ],
    links: [{ rel: "canonical", href: "/mapa" }],
  }),
  component: Page,
});

const services = [
  {
    icon: Shield,
    name: "Conselho Tutelar",
    desc: "Órgão municipal responsável pela proteção dos direitos da criança e do adolescente. Existem mais de 6 mil em todo o Brasil.",
    query: "conselho tutelar",
    url: "https://www.gov.br/mdh/pt-br/navegue-por-temas/crianca-e-adolescente/conselhos-tutelares",
  },
  {
    icon: Building2,
    name: "Delegacia da Criança (DPCA)",
    desc: "Delegacias especializadas em crimes contra crianças e adolescentes, disponíveis nas capitais e principais cidades.",
    query: "delegacia de proteção criança adolescente DPCA",
    url: "https://www.gov.br/pf/pt-br",
  },
  {
    icon: Compass,
    name: "CREAS",
    desc: "Centro de Referência Especializado de Assistência Social — atendimento a famílias e pessoas em situação de risco e violência.",
    query: "CREAS Centro de Referência Especializado de Assistência Social",
    url: "https://www.gov.br/mds/pt-br/acoes-e-programas/protecao-social-especial",
  },
  {
    icon: Building2,
    name: "Centro de Apoio (CAOPCAE / MP)",
    desc: "Centros de Apoio Operacional da Infância e Juventude dos Ministérios Públicos estaduais.",
    query: "Centro Apoio Operacional Infância Juventude Ministério Público",
    url: "https://www.cnmp.mp.br/portal/",
  },
];

function Page() {
  const [q, setQ] = useState("");

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[color:var(--navy-deep)] text-white py-20 sm:py-28">
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute top-0 right-0 size-[24rem] rounded-full bg-[color:var(--orange)] blur-3xl" />
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
              <MapPin className="size-3.5 text-[color:var(--orange)]" /> Mapa de ajuda
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl font-semibold leading-tight text-balance">
              Encontre quem pode ajudar perto de você
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-6 text-lg text-white/85 max-w-2xl">
              Pesquise serviços de proteção próximos da sua cidade. Os links abaixo direcionam para
              ferramentas oficiais e busca segura.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <label htmlFor="cidade" className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Sua cidade ou estado
            </label>
            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
                <input
                  id="cidade"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ex: Belo Horizonte, MG"
                  className="w-full rounded-full bg-card border border-border pl-11 pr-4 py-3 focus:outline-none focus:border-[color:var(--orange)]"
                />
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.name} delay={i * 70}>
                <article className="h-full rounded-2xl border border-border bg-card p-6 hover-lift">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-orange text-[color:var(--navy-deep)]">
                    <s.icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(s.query + " " + q)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-4 py-2 text-sm font-semibold"
                    >
                      <MapPin className="size-4" /> Ver no mapa
                    </a>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--red-inst)] hover:underline"
                    >
                      Portal oficial <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="mt-10 text-xs text-muted-foreground">
              Para localizações precisas, futura integração com geolocalização será disponibilizada.
              Em emergência, ligue <a className="underline" href="tel:190">190</a> ou{" "}
              <a className="underline" href="tel:100">100</a>.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
