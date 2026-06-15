import { createFileRoute } from "@tanstack/react-router";
import { BookMarked, ExternalLink, Gavel, Scale } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FaqBlock } from "@/components/public/ArticleBlocks";
import { PageHero } from "@/components/public/PageHero";
import heroLegislacao from "@/assets/hero-legislacao.jpg";

export const Route = createFileRoute("/legislacao")({
  head: () => ({
    meta: [
      { title: "Legislação — ECA, Constituição e direitos da criança" },
      {
        name: "description",
        content:
          "Estatuto da Criança e do Adolescente (Lei 8.069/90), artigos da Constituição Federal e principais leis de proteção contra a violência sexual.",
      },
      { property: "og:title", content: "Legislação de Proteção à Infância" },
      { property: "og:description", content: "ECA, CF/88 e leis brasileiras de combate à violência sexual infantil." },
      { property: "og:url", content: "https://minhainfanciaprotegida.com.br/legislacao" },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/legislacao" }],
  }),
  component: Page,
});

const articles = [
  {
    code: "CF/88",
    title: "Constituição Federal — Artigo 227",
    text:
      "É dever da família, da sociedade e do Estado assegurar à criança, ao adolescente e ao jovem, com absoluta prioridade, o direito à vida, à saúde, à alimentação, à educação, ao lazer, à profissionalização, à cultura, à dignidade, ao respeito, à liberdade e à convivência familiar e comunitária, além de colocá-los a salvo de toda forma de negligência, discriminação, exploração, violência, crueldade e opressão.",
    url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
  },
  {
    code: "ECA Art. 5º",
    title: "Estatuto da Criança e do Adolescente",
    text:
      "Nenhuma criança ou adolescente será objeto de qualquer forma de negligência, discriminação, exploração, violência, crueldade e opressão, punido na forma da lei qualquer atentado, por ação ou omissão, aos seus direitos fundamentais.",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
  },
  {
    code: "ECA Art. 13",
    title: "Comunicação obrigatória",
    text:
      "Os casos de suspeita ou confirmação de castigo físico, de tratamento cruel ou degradante e de maus-tratos contra criança ou adolescente serão obrigatoriamente comunicados ao Conselho Tutelar, sem prejuízo de outras providências legais.",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm#art13",
  },
  {
    code: "ECA Art. 240",
    title: "Pornografia infantil",
    text:
      "Produzir, reproduzir, dirigir, fotografar, filmar ou registrar, por qualquer meio, cena de sexo explícito ou pornográfica, envolvendo criança ou adolescente. Pena — reclusão, de 4 a 8 anos, e multa.",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm#art240",
  },
  {
    code: "ECA Art. 241-A",
    title: "Compartilhamento de material",
    text:
      "Oferecer, trocar, disponibilizar, transmitir, distribuir, publicar ou divulgar por qualquer meio, inclusive por sistema de informática ou telemático, fotografia, vídeo ou outro registro que contenha cena de sexo explícito ou pornográfica envolvendo criança ou adolescente. Pena — reclusão, de 3 a 6 anos, e multa.",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm#art241a",
  },
  {
    code: "CP Art. 217-A",
    title: "Código Penal — Estupro de vulnerável",
    text:
      "Ter conjunção carnal ou praticar outro ato libidinoso com menor de 14 anos. Pena — reclusão, de 8 a 15 anos.",
    url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm",
  },
  {
    code: "Lei 13.431/17",
    title: "Escuta protegida",
    text:
      "Estabelece o sistema de garantia de direitos da criança e do adolescente vítima ou testemunha de violência, criando a escuta especializada e o depoimento especial.",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13431.htm",
  },
  {
    code: "Lei 14.344/22",
    title: "Lei Henry Borel",
    text:
      "Cria mecanismos para a prevenção e o enfrentamento da violência doméstica e familiar contra a criança e o adolescente.",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14344.htm",
  },
];

function Page() {
  return (
    <div className="bg-background">
      {/* Custom Hero for Legislacao to match the new visual identity */}
      <section className="relative overflow-hidden bg-[color:var(--background)] pt-16 md:pt-24 lg:pt-32 pb-16 lg:pb-24 border-b border-border">
        {/* Subtle blur background */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 opacity-40 mix-blend-multiply pointer-events-none" aria-hidden>
          <div className="w-[500px] h-[500px] rounded-full bg-[color:var(--navy)]/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="max-w-xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy)]/10 bg-[color:var(--navy)]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[color:var(--navy-deep)] shadow-sm">
                <Scale className="size-3.5 text-[color:var(--orange)]" aria-hidden /> Legislação brasileira
              </span>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-8 font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-[color:var(--navy-deep)] text-balance">
                A lei protege. Conheça e exija que seja cumprida.
              </h1>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                O Brasil tem uma das legislações mais avançadas do mundo para a proteção da infância. Conheça os principais artigos.
              </p>
            </Reveal>
          </div>
          
          <Reveal delay={300} className="lg:justify-self-end w-full">
            <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full max-w-md lg:max-w-lg rounded-2xl overflow-hidden shadow-elegant border border-border/50">
              <img
                src={heroLegislacao}
                alt="Balança da justiça e Constituição Federal"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/30 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-card border-b border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Principais artigos"
            title="Direitos fundamentais e dispositivos legais"
            description="Trechos extraídos integralmente das publicações oficiais do Planalto. Clique no título para acessar a lei completa."
          />
          <div className="mt-16 space-y-6">
            {articles.map((a, i) => (
              <Reveal key={a.code} delay={i * 50}>
                <article className="group rounded-xl border border-border bg-background p-8 hover-lift hover:border-[color:var(--navy)]/20 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 bg-[color:var(--orange)] h-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--orange)]/10 text-[color:var(--navy-deep)] border border-[color:var(--orange)]/20 px-3 py-1.5 text-xs font-bold uppercase tracking-widest">
                      <Gavel className="size-3.5 text-[color:var(--orange)]" /> {a.code}
                    </span>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-2xl font-semibold text-[color:var(--navy-deep)] hover:text-[color:var(--red-inst)] transition-colors inline-flex items-center gap-2"
                    >
                      {a.title} <ExternalLink className="size-4 text-muted-foreground group-hover:text-[color:var(--red-inst)] transition-colors" />
                    </a>
                  </div>
                  <blockquote className="border-l-4 border-[color:var(--orange)]/40 pl-6 py-2 text-muted-foreground leading-relaxed italic text-lg">
                    "{a.text}"
                  </blockquote>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-16 rounded-2xl bg-[color:var(--navy)] text-white p-10 sm:p-12 flex flex-col sm:flex-row gap-8 items-start shadow-elegant relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
              </div>
              <div className="relative z-10 shrink-0">
                <span className="inline-flex size-14 items-center justify-center rounded-xl bg-white/10 border border-white/20">
                  <BookMarked className="size-7 text-[color:var(--orange)]" />
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-semibold">Convenção da ONU</h3>
                <p className="mt-4 text-white/80 leading-relaxed text-lg">
                  O Brasil é signatário da Convenção sobre os Direitos da Criança (ONU, 1989), o
                  tratado de direitos humanos mais ratificado do mundo. Ela estabelece que toda
                  criança tem direito à proteção contra todas as formas de violência, abuso e
                  exploração sexual (Artigos 19 e 34).
                </p>
                <a
                  href="https://www.unicef.org/brazil/convencao-sobre-os-direitos-da-crianca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-6 py-3 font-semibold hover:bg-[color:var(--orange)]/90 transition-colors shadow-sm"
                >
                  Acessar a Convenção (UNICEF) <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Legislação */}
      <section className="py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Dúvidas comuns"
            title="Perguntas Frequentes (Legislação)"
          />
          <div className="mt-12">
            <FaqBlock
              items={[
                {
                  q: "Qual a diferença entre o ECA e a Constituição Federal na proteção da infância?",
                  a: "A Constituição Federal (Art. 227) estabelece o princípio da 'Prioridade Absoluta', dizendo que é dever de todos proteger a criança. O ECA (Estatuto da Criança e do Adolescente) é a lei que regulamenta como essa proteção deve ser feita na prática, estabelecendo os mecanismos, direitos e punições.",
                },
                {
                  q: "O que mudou com a Lei Henry Borel?",
                  a: "A Lei 14.344/2022 (Lei Henry Borel) aumentou penas para quem se omite diante de violência e criou mecanismos semelhantes à Lei Maria da Penha (como medidas protetivas de urgência com afastamento do agressor) especificamente para crianças e adolescentes em situação de violência doméstica e familiar.",
                },
                {
                  q: "Como a lei brasileira lida com a violência no ambiente digital?",
                  a: "O ECA criminaliza a produção, posse e compartilhamento de material de abuso sexual infantil (Art. 240, 241, 241-A). Adicionalmente, leis recentes como o 'ECA Digital' e decisões judiciais baseadas no Marco Civil da Internet exigem que plataformas atuem para coibir e remover conteúdos ilícitos rapidamente.",
                },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
