import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Phone, ShieldAlert } from "lucide-react";
import { risks } from "@/content/risks";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import { SourceTag } from "@/components/site/SourceTag";
import digitalImg from "@/assets/digital-safety.jpg";

export const Route = createFileRoute("/riscos-online")({
  head: () => ({
    meta: [
      { title: "Riscos da internet para crianças e adolescentes — Infância Protegida" },
      {
        name: "description",
        content:
          "Adultização, grooming, sextorsão, CSAM com IA, cyberbullying e desafios virais. Guia atualizado com sinais de alerta, como agir e base legal (ECA Digital).",
      },
      { property: "og:title", content: "Riscos da internet — Infância Protegida" },
      {
        property: "og:description",
        content: "Guia completo sobre os principais riscos digitais para crianças e adolescentes.",
      },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/riscos-online" }],
  }),
  component: RiscosPage,
});

function RiscosPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[color:var(--navy-deep)] text-white py-20 sm:py-28">
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(11,20,45,0.92), rgba(11,20,45,0.65)), url(${digitalImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase">
              <ShieldAlert className="size-3.5 text-[color:var(--orange)]" aria-hidden />
              Internet segura · ECA Digital
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-4xl sm:text-6xl font-semibold leading-[1.05] text-balance">
              Os riscos da internet para crianças e adolescentes
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-5 text-lg text-white/85 max-w-3xl leading-relaxed">
              Adultização, aliciamento em jogos, sextorsão e deepfakes feitos por IA estão entre as
              ameaças mais graves do ambiente digital. Informação clara e ação rápida protegem.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/denuncia"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--red-inst)] px-6 py-3 font-semibold hover:opacity-95"
              >
                <Phone className="size-4" /> Denunciar agora
              </Link>
              <a
                href="https://new.safernet.org.br/helpline"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-white/10"
              >
                Canal SaferNet <ExternalLink className="size-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Guia atualizado"
            title="Conheça, identifique e aja"
            description="Cada risco abaixo traz sinais de alerta, o que fazer e a base legal vigente no Brasil."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {risks.map((r, i) => (
              <Reveal key={r.slug} delay={i * 60}>
                <article
                  id={r.slug}
                  className="h-full rounded-2xl border border-border bg-card p-6 sm:p-8 hover-lift relative overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-orange" aria-hidden />
                  <div className="flex items-start gap-4">
                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-[color:var(--orange-soft)] text-[color:var(--red-inst)]">
                      <r.icon className="size-6" aria-hidden />
                    </span>
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl font-semibold leading-tight">
                        {r.title}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.summary}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid sm:grid-cols-2 gap-5 text-sm">
                    <div>
                      <h3 className="font-semibold text-[color:var(--red-inst)] uppercase text-xs tracking-wider mb-2">
                        Sinais de alerta
                      </h3>
                      <ul className="space-y-1.5 list-disc list-inside text-foreground/85">
                        {r.signs.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[color:var(--navy)] uppercase text-xs tracking-wider mb-2">
                        Como agir
                      </h3>
                      <ul className="space-y-1.5 list-disc list-inside text-foreground/85">
                        {r.howToAct.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {r.example && (
                    <p className="mt-5 rounded-lg bg-[color:var(--orange-soft)] px-4 py-3 text-sm text-[color:var(--navy-deep)]">
                      <strong>Exemplo recente:</strong> {r.example}
                    </p>
                  )}

                  <div className="mt-5 pt-5 border-t border-border space-y-3">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Base legal:</span> {r.legalBase}
                    </p>
                    <SourceTag source={r.source.name} year={2025} url={r.source.url} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-16 rounded-2xl bg-[color:var(--navy-deep)] text-white p-8 sm:p-12 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold">
                  Suspeita de crime online?
                </h2>
                <p className="mt-2 text-white/80 max-w-xl">
                  Denuncie ao Disque 100, à Polícia Federal e ao canal Helpline da SaferNet. Sua denúncia pode ser
                  anônima.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:100"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-6 py-3 font-semibold"
                >
                  <Phone className="size-4" /> Ligar 100
                </a>
                <Link
                  to="/denuncia"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-white/10"
                >
                  Outros canais <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
