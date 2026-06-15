import { createFileRoute } from "@tanstack/react-router";
import { BookMarked, ClipboardList, GraduationCap, ShieldCheck, UsersRound } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FaqBlock } from "@/components/public/ArticleBlocks";
import { ReferencesBlock } from "@/components/public/ReferencesBlock";
import { JsonLd, articleSchema, breadcrumb } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/public/PageHero";
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
    <div className="bg-background">
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

      {/* HEADER SECTION - Custom in place of PageHero to match the new visual identity */}
      <section className="relative overflow-hidden bg-[color:var(--background)] pt-16 md:pt-24 lg:pt-32 pb-16 lg:pb-24 border-b border-border">
        {/* Subtle blur background */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 opacity-40 mix-blend-multiply pointer-events-none" aria-hidden>
          <div className="w-[500px] h-[500px] rounded-full bg-[color:var(--navy)]/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="max-w-xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy)]/10 bg-[color:var(--navy)]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[color:var(--navy-deep)] shadow-sm">
                <GraduationCap className="size-3.5 text-[color:var(--orange)]" /> Para escolas e educadores
              </span>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-8 font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-[color:var(--navy-deep)] text-balance">
                A escola é a primeira porta de proteção
              </h1>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Professores, gestores e profissionais da educação têm papel central — e obrigação legal — na identificação e notificação de casos de violência contra a criança.
              </p>
            </Reveal>
          </div>
          
          <Reveal delay={300} className="lg:justify-self-end w-full">
            <div className="relative aspect-[4/3] w-full max-w-lg rounded-2xl overflow-hidden shadow-elegant border border-border/50">
              <img
                src={schoolImg}
                alt="Educador em sala de aula acolhendo aluno"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/20 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* STEPS DE PROTEÇÃO */}
      <section className="py-20 sm:py-28 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Protocolo de Ação"
            title="Como agir em caso de suspeita"
            description="Um passo a passo seguro para proteger a criança e cumprir a legislação educacional sem causar danos adicionais ou revitimização."
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <article className="h-full rounded-xl border border-border bg-background p-8 hover-lift hover:border-[color:var(--navy)]/20 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 bg-[color:var(--orange)] h-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="inline-flex size-12 items-center justify-center rounded-lg bg-[color:var(--navy)]/5 border border-[color:var(--navy)]/10 text-[color:var(--navy-deep)] mb-6 group-hover:bg-[color:var(--navy)] group-hover:text-white transition-colors">
                    <s.icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="font-display text-xl font-semibold text-[color:var(--navy-deep)]">{s.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LEGISLAÇÃO E ESCUTA PROTEGIDA */}
      <section className="py-24 bg-[color:var(--navy)] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] rounded-full bg-white blur-3xl" />
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--orange)] mb-6">
              <BookMarked className="size-4" /> Escuta protegida — Lei 13.431/2017
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">
              Escutar uma vez para não revitimizar
            </h2>
            <div className="mt-8 space-y-6 text-lg text-white/80 leading-relaxed max-w-3xl mx-auto text-left sm:text-center">
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

      {/* FAQ Escolas */}
      <section className="py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Dúvidas comuns"
            title="Perguntas Frequentes (Educadores)"
          />
          <div className="mt-12">
            <FaqBlock
              items={[
                {
                  q: "Sou obrigado a denunciar se tiver uma suspeita, mas não certeza?",
                  a: "Sim. O ECA (Art. 245) estabelece como infração administrativa a omissão do profissional de educação ou saúde que não comunica à autoridade competente (Conselho Tutelar) os casos de suspeita ou confirmação de maus-tratos. Você não precisa ter provas, apenas uma suspeita fundamentada.",
                },
                {
                  q: "Devo conversar com os pais do aluno antes de denunciar?",
                  a: "Depende de quem é o suspeito. Se a suspeita recai sobre familiares ou pessoas do convívio da casa, avisar a família pode colocar a criança em risco imediato de ocultação de provas ou violência mais grave. Nesses casos, acione diretamente o Conselho Tutelar de forma sigilosa.",
                },
                {
                  q: "A escola precisa investigar ou reunir provas do crime?",
                  a: "Não. A escola acolhe a criança, realiza a escuta sem julgamentos ou interrogatório, registra a suspeita e encaminha. A investigação criminal é atribuição exclusiva da Polícia, e a verificação social é do Conselho Tutelar. O papel do educador é garantir o primeiro socorro institucional.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
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
    </div>
  );
}
