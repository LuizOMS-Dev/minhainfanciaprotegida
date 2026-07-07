import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Phone, ShieldAlert } from "lucide-react";
import { risks } from "@/content/risks";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FaqBlock } from "@/components/public/ArticleBlocks";
import { Reveal } from "@/components/shared/Reveal";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { SourceTag } from "@/components/shared/SourceTag";
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
    <div className="bg-background">
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden bg-[color:var(--background)] pt-16 md:pt-24 lg:pt-32 pb-16 lg:pb-24 border-b border-border">
        {/* Subtle blur background */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 opacity-40 mix-blend-multiply pointer-events-none" aria-hidden>
          <div className="w-[500px] h-[500px] rounded-full bg-[color:var(--red-inst)]/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="max-w-xl">
            <PageBreadcrumb
              items={[
                { label: "Início", to: "/" },
                { label: "Riscos online" },
              ]}
              className="mb-6"
            />
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy)]/10 bg-[color:var(--navy)]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[color:var(--navy-deep)] shadow-sm">
                <ShieldAlert className="size-3.5 text-[color:var(--red-inst)]" aria-hidden /> Internet segura
              </span>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-8 font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-[color:var(--navy-deep)] text-balance">
                Os riscos da internet para crianças e adolescentes
              </h1>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Adultização, aliciamento em jogos, sextorsão e deepfakes feitos por IA estão entre as ameaças mais
                graves do ambiente digital. A informação e ação rápida salvam vidas.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="tel:100"
                  className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--red-inst)] text-white px-6 py-3 font-semibold shadow-sm hover:bg-[color:var(--red-inst)]/90 transition-colors"
                >
                  <Phone className="size-4" /> Disque 100
                </a>
                <a
                  href="https://new.safernet.org.br/helpline"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--navy)]/20 px-6 py-3 font-semibold text-[color:var(--navy-deep)] hover:bg-[color:var(--navy)]/5 transition-colors"
                >
                  Canal SaferNet <ExternalLink className="size-4" />
                </a>
              </div>
            </Reveal>
          </div>
          
          <Reveal delay={300} className="lg:justify-self-end w-full">
            <div className="relative aspect-[4/3] w-full max-w-lg rounded-2xl overflow-hidden shadow-elegant border border-border/50">
              <img
                src={digitalImg}
                alt="Adolescente utilizando smartphone no escuro"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/40 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Guia atualizado"
            title="Conheça, identifique e aja"
            description="Cada risco abaixo traz sinais de alerta, o que fazer e a base legal vigente no Brasil."
          />

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {risks.map((r, i) => (
              <Reveal key={r.slug} delay={i * 60}>
                <article
                  id={r.slug}
                  className="h-full rounded-xl border border-border bg-background p-8 hover-lift hover:border-[color:var(--navy)]/20 shadow-sm relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[color:var(--red-inst)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start gap-4 mb-8">
                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-[color:var(--red-inst)]/10 border border-[color:var(--red-inst)]/20 text-[color:var(--red-inst)]">
                      <r.icon className="size-6" aria-hidden />
                    </span>
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-[color:var(--navy-deep)]">
                        {r.title}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.summary}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8 text-sm pt-6 border-t border-border/50">
                    <div>
                      <h3 className="font-semibold text-[color:var(--red-inst)] uppercase text-xs tracking-widest mb-4">
                        Sinais de alerta
                      </h3>
                      <ul className="space-y-2.5 text-muted-foreground">
                        {r.signs.map((s) => (
                          <li key={s} className="flex gap-2.5">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color:var(--red-inst)]/70" aria-hidden />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[color:var(--navy)] uppercase text-xs tracking-widest mb-4">
                        Como agir
                      </h3>
                      <ul className="space-y-2.5 text-muted-foreground">
                        {r.howToAct.map((s) => (
                          <li key={s} className="flex gap-2.5">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color:var(--navy)]/70" aria-hidden />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {r.example && (
                    <div className="mt-8 rounded-lg bg-[color:var(--navy)]/5 border border-[color:var(--navy)]/10 p-5">
                      <p className="text-sm text-[color:var(--navy-deep)] leading-relaxed">
                        <strong className="font-semibold">Exemplo:</strong> {r.example}
                      </p>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-y-3 justify-between items-center text-xs text-muted-foreground">
                    <p>
                      <span className="font-semibold uppercase tracking-widest text-foreground mr-1">Base legal:</span> {r.legalBase}
                    </p>
                    <SourceTag source={r.source.name} year={2025} url={r.source.url} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-20 rounded-2xl bg-[color:var(--navy)] text-white p-10 sm:p-14 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative overflow-hidden shadow-elegant">
              <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              </div>
              <div className="relative z-10">
                <h2 className="font-display text-3xl sm:text-4xl font-medium leading-tight">
                  Suspeita de crime online?
                </h2>
                <p className="mt-4 text-white/80 max-w-xl leading-relaxed text-lg">
                  Denuncie ao Disque 100, à Polícia Federal e ao canal Helpline da SaferNet. Sua denúncia pode ser anônima.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 relative z-10">
                <a
                  href="tel:100"
                  className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--red-inst)] text-white px-8 py-3.5 font-bold shadow-sm hover:bg-[color:var(--red-inst)]/90 transition-colors"
                >
                  <Phone className="size-5" /> Ligar 100
                </a>
                <Link
                  to="/denuncia"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-8 py-3.5 font-semibold hover:bg-white/10 transition-colors"
                >
                  Outros canais <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Riscos Online */}
      <section className="py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Dúvidas comuns"
            title="Perguntas Frequentes (Segurança Digital)"
          />
          <div className="mt-12">
            <FaqBlock
              items={[
                {
                  q: "Meu filho recebeu foto íntima de um colega. Se ele repassar só para os amigos, é crime?",
                  a: "Sim. O ECA (Art. 241-A) considera crime o compartilhamento, distribuição ou publicação de imagens ou vídeos íntimos de menores de 18 anos, mesmo que quem esteja repassando também seja adolescente (neste caso, responde por ato infracional). A orientação é não repassar, apagar o material e avisar um adulto responsável.",
                },
                {
                  q: "Como denunciar um perfil que está assediando meu filho em um jogo?",
                  a: "Não denuncie apenas dentro do jogo. Primeiro, tire prints de todas as conversas, do perfil do assediador e anote o ID/nome de usuário. Depois de preservar essas provas, bloqueie o contato no jogo e faça uma denúncia no portal da SaferNet ou um Boletim de Ocorrência na Polícia Civil.",
                },
                {
                  q: "O que fazer se imagens íntimas do meu filho vazarem na internet?",
                  a: "Aja rápido e acolha a vítima sem julgamentos. Não apague nada antes de salvar as provas (prints com URLs ou links visíveis). Registre um B.O. imediatamente. Com o B.O. em mãos, utilize os canais das próprias plataformas (Instagram, WhatsApp, etc.) para solicitar a remoção do conteúdo baseando-se em violação de regras e crime de pedofilia.",
                },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
