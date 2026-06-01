import { createFileRoute, Link } from "@tanstack/react-router";
import { Ear, Heart, Phone, Shield, ShieldCheck, Sparkles } from "lucide-react";
import supportImg from "@/assets/support.jpg";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/como-ajudar")({
  head: () => ({
    meta: [
      { title: "Como Ajudar — Escutar, acolher, proteger e denunciar" },
      {
        name: "description",
        content:
          "Cinco passos para acolher uma criança ou adolescente em situação de violência sexual, segundo orientações do MDHC e Childhood Brasil.",
      },
      { property: "og:title", content: "Como Ajudar — Acolhimento e proteção" },
      { property: "og:description", content: "Escute, acolha, não julgue, proteja, denuncie." },
      { property: "og:url", content: "/como-ajudar" },
    ],
    links: [{ rel: "canonical", href: "/como-ajudar" }],
  }),
  component: Page,
});

const steps = [
  { n: "01", icon: Ear, title: "Escute", text: "Pare tudo o que estiver fazendo. Olhe nos olhos. Deixe a criança falar no tempo dela, sem interromper e sem fazer perguntas indutivas." },
  { n: "02", icon: Heart, title: "Acolha", text: "Diga que você acredita, que ela não tem culpa e que fez certo em contar. O acolhimento é o primeiro ato de proteção." },
  { n: "03", icon: Sparkles, title: "Não julgue", text: "Evite expressões de horror, raiva ou descrença diante da criança. Não confronte o suposto agressor por conta própria." },
  { n: "04", icon: Shield, title: "Proteja", text: "Garanta que a criança esteja em ambiente seguro, afastada do agressor. Procure o Conselho Tutelar e, se necessário, atendimento médico." },
  { n: "05", icon: ShieldCheck, title: "Denuncie", text: "Acione o Disque 100, a Polícia (190) e o Conselho Tutelar. A denúncia pode ser anônima e a investigação é dever do Estado." },
];

function Page() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[color:var(--navy-deep)] text-white py-20 sm:py-28">
        <div className="absolute inset-0 -z-10 opacity-40" style={{ backgroundImage: `url(${supportImg})`, backgroundSize: "cover", backgroundPosition: "center" }} aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[color:var(--navy-deep)] via-[color:var(--navy-deep)]/85 to-transparent" aria-hidden />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
              Acolher é proteger
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl font-semibold leading-tight text-balance">
              Cinco passos que podem mudar uma vida
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-6 text-lg text-white/85 max-w-2xl">
              Quando uma criança rompe o silêncio, a forma como respondemos define se ela continuará
              a falar. Siga estes passos baseados em orientações oficiais.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Passo a passo" title="O que fazer diante de uma suspeita ou revelação" />
          <ol className="mt-14 space-y-6">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80} as="li">
                <article className="group relative rounded-3xl border border-border bg-card p-8 sm:p-10 hover-lift grid sm:grid-cols-[auto_1fr_auto] gap-6 items-start">
                  <span className="font-display text-6xl sm:text-7xl font-semibold text-[color:var(--orange)]/30 leading-none">{s.n}</span>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold flex items-center gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-gradient-orange text-[color:var(--navy-deep)]">
                        <s.icon className="size-5" aria-hidden />
                      </span>
                      {s.title}
                    </h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">{s.text}</p>
                  </div>
                  <div className="h-1.5 w-16 rounded-full bg-gradient-orange self-center hidden sm:block" aria-hidden />
                </article>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={200}>
            <div className="mt-12 rounded-2xl border border-[color:var(--orange)]/40 bg-[color:var(--orange-soft)] p-6 sm:p-8">
              <h3 className="font-display text-xl font-semibold">O que evitar</h3>
              <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-foreground/85">
                {[
                  "Não confronte o suposto agressor diretamente.",
                  "Não pressione a criança por detalhes ou repetições.",
                  "Não prometa segredo — explique que precisará buscar ajuda.",
                  "Não banhe a criança após a suspeita — preserve evidências.",
                  "Não compartilhe o caso em redes sociais.",
                ].map((t) => (
                  <li key={t} className="flex gap-2"><span className="text-[color:var(--red-inst)] font-bold">×</span>{t}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 bg-[color:var(--navy-deep)] text-white text-center">
        <div className="mx-auto max-w-3xl px-4">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">Pronto para agir?</h2>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href="tel:100" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-7 py-3 font-bold">
                <Phone className="size-5" /> Ligar 100
              </a>
              <Link to="/denuncia" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 font-semibold hover:bg-white/10">
                Ver todos os canais
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
