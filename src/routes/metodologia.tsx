import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck, ShieldCheck, RefreshCw, BookOpen, FileSearch, Scale } from "lucide-react";
import heroImg from "@/assets/listening.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/metodologia")({
  head: () => ({
    meta: [
      { title: "Metodologia — Infância Protegida" },
      {
        name: "description",
        content:
          "Como o Infância Protegida apura, verifica e atualiza seu conteúdo: fontes oficiais, checagem editorial e responsabilidade informativa.",
      },
      { property: "og:title", content: "Metodologia — Infância Protegida" },
      {
        property: "og:description",
        content: "Critérios editoriais e processo de verificação do portal Infância Protegida.",
      },
      { property: "og:url", content: "/metodologia" },
      { property: "og:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/metodologia" }],
  }),
  component: Page,
});

const steps = [
  {
    icon: BookOpen,
    title: "Fontes oficiais primeiro",
    text: "Toda informação parte de documentos públicos, leis federais, dados de órgãos como MDHC, IBGE, UNICEF, FBSP e relatórios de organizações reconhecidas (Childhood Brasil, SaferNet).",
  },
  {
    icon: FileSearch,
    title: "Checagem cruzada",
    text: "Casos, números e datas são verificados em pelo menos duas fontes independentes antes da publicação. Quando há divergência, citamos as duas e o leitor decide.",
  },
  {
    icon: Scale,
    title: "Respeito às vítimas",
    text: "Não publicamos identidades de vítimas de violência sexual. Casos históricos só aparecem quando já tornados públicos por decisão judicial, familiares ou imprensa institucional.",
  },
  {
    icon: ClipboardCheck,
    title: "Linguagem responsável",
    text: "Seguimos os guias de cobertura jornalística da ANDI, do MDHC e da SaferNet — evitamos sensacionalismo, detalhes desnecessários e termos que naturalizem a violência.",
  },
  {
    icon: RefreshCw,
    title: "Atualização periódica",
    text: "Leis, telefones e canais oficiais são revisados continuamente. Cada conteúdo possui campo de fonte e data; encontrou algo desatualizado? Entre em contato.",
  },
  {
    icon: ShieldCheck,
    title: "Transparência editorial",
    text: "Não recebemos pagamento de empresas para destacar conteúdo. Não trocamos vínculos por publicidade. Indicamos sempre os links das fontes consultadas.",
  },
];

function Page() {
  return (
    <>
      <PageHero
        image={heroImg}
        eyebrow="Metodologia"
        title="Como produzimos cada informação publicada aqui."
        description="Combate ao abuso infantil exige rigor. Veja os critérios editoriais que orientam o Infância Protegida."
        icon={<ClipboardCheck className="size-3.5" aria-hidden />}
        variant="navy"
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Processo editorial"
            title="Seis pilares que sustentam cada publicação."
          />

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <article className="h-full rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-orange text-[color:var(--navy-deep)] shrink-0">
                      <s.icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold mb-2">{s.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
