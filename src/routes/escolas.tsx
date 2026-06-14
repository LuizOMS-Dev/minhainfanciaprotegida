import { createFileRoute } from "@tanstack/react-router";
import { BookMarked, ClipboardList, GraduationCap, ShieldCheck, UsersRound } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { ReferencesBlock } from "@/components/site/ReferencesBlock";
import { JsonLd, articleSchema, breadcrumb } from "@/components/site/JsonLd";
import { InstitutionalHero } from "@/components/site/InstitutionalHero";
import schoolImg from "@/assets/hero-escolas.jpg";

export const Route = createFileRoute("/escolas")({
  head: () => ({
    meta: [
      { title: "Guia para Escolas e Educadores — Infância Protegida" },
      {
        name: "description",
        content:
          "Como identificar sinais, acolher, escutar e encaminhar casos de violência sexual contra crianças e adolescentes — guia para profissionais da educação.",
      },
      { property: "og:title", content: "Guia para Escolas — Infância Protegida" },
      {
        property: "og:description",
        content: "Protocolo de suspeita, escuta protegida (Lei 13.431/2017) e encaminhamento correto.",
      },
      { property: "og:image", content: schoolImg },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/escolas" }],
  }),
  component: Page,
});

const steps = [
  {
    icon: ClipboardList,
    title: "1. Identificar",
    text: "Observe mudanças bruscas: queda no rendimento, isolamento, regressão, comportamento sexualizado para a idade, marcas físicas, medo de adultos específicos.",
  },
  {
    icon: UsersRound,
    title: "2. Acolher",
    text: "Garanta um ambiente seguro, acredite na criança, não a interrogue nem revitimize. Registre apenas o relato espontâneo, com data e hora.",
  },
  {
    icon: ShieldCheck,
    title: "3. Comunicar",
    text: "Comunique imediatamente a direção e o Conselho Tutelar. O ECA, art. 245, obriga a notificação por profissionais da educação — a omissão é infração administrativa.",
  },
  {
    icon: GraduationCap,
    title: "4. Acompanhar",
    text: "Mantenha a criança em rede protetiva: psicossocial, saúde e família ampliada quando possível. Articule com CREAS e Ministério Público.",
  },
];

function Page() {
  return (
    <>
      <JsonLd data={[
        breadcrumb([
          { name: "Início", url: "/" },
          { name: "Guia para Escolas", url: "/escolas" },
        ]),
        articleSchema({
          headline: "Guia para Escolas e Educadores",
          description: "Protocolo de identificação, acolhimento e encaminhamento em casos de suspeita.",
          datePublished: "2025-11-15",
          image: schoolImg,
          url: "/escolas",
        }),
      ]} />

      <InstitutionalHero
        eyebrow="Para escolas e educadores"
        title="A escola é a primeira porta de proteção"
        description="O papel da escola, como identificar sinais, acolher sem julgamento, encaminhar à rede e articular projetos de prevenção com famílias."
        image={schoolImg}
      />

      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <article className="h-full rounded-2xl border border-border bg-card p-6 hover-lift">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[color:var(--navy-deep)] text-[color:var(--orange)]">
                    <s.icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[color:var(--navy-deep)] text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--orange)]">
              <BookMarked className="size-3.5" /> Escuta protegida — Lei 13.431/2017
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold leading-tight">
              Escutar uma vez para não revitimizar
            </h2>
            <div className="mt-6 space-y-4 text-white/85 leading-relaxed">
              <p>
                A Lei nº 13.431/2017 estabelece a <strong>escuta especializada</strong> (acolhimento
                por profissional preparado, sem repetição do relato) e o <strong>depoimento especial</strong> (procedimento judicial em sala adequada, com profissional capacitado).
              </p>
              <p>
                Na escola, o papel é acolher e registrar o que foi dito espontaneamente — sem
                perguntas indutivas, sem confrontar o suposto agressor. A apuração é da Polícia e
                do Ministério Público.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 pt-16 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ReferencesBlock
            primary={{
              label: "Lei nº 13.431/2017 — Escuta Especializada e Depoimento Especial",
              url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13431.htm",
            }}
            secondary={[
              { label: "ECA — Lei 8.069/90, art. 245 (notificação obrigatória)", url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm" },
              { label: "MEC — Guia Escolar para identificação de sinais", url: "https://www.gov.br/mec/pt-br" },
              { label: "Childhood Brasil — Publicações para educadores", url: "https://www.childhood.org.br/publicacao" },
            ]}
            lastVerified="2025-11-15"
          />
        </div>
      </section>
    </>
  );
}
