import { createFileRoute } from "@tanstack/react-router";
import { BookMarked, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import heroImg from "@/assets/hero-biblioteca.jpg";

export const Route = createFileRoute("/fontes")({
  head: () => ({
    meta: [
      { title: "Fontes Utilizadas — Infância Protegida" },
      {
        name: "description",
        content:
          "Referências oficiais consultadas pelo projeto Infância Protegida: ECA, MDHC, FBSP, Unicef, SafeNet e legislação federal.",
      },
      { property: "og:title", content: "Fontes Utilizadas — Infância Protegida" },
      {
        property: "og:description",
        content: "Lista pública das fontes oficiais consultadas pelo projeto.",
      },
      { property: "og:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/fontes" }],
  }),
  component: Page,
});

const fontes = [
  {
    grupo: "Governo Federal",
    itens: [
      { nome: "Ministério dos Direitos Humanos e da Cidadania (MDHC)", url: "https://www.gov.br/mdh/pt-br" },
      { nome: "Disque 100 — Disque Direitos Humanos", url: "https://www.gov.br/mdh/pt-br/assuntos/noticias/disque-100" },
      { nome: "Plano Nacional de Enfrentamento à Violência Sexual contra Crianças e Adolescentes", url: "https://www.gov.br/mdh/pt-br" },
    ],
  },
  {
    grupo: "Legislação",
    itens: [
      { nome: "Lei nº 8.069/1990 — Estatuto da Criança e do Adolescente (ECA)", url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm" },
      { nome: "Lei nº 13.431/2017 — Escuta especializada e depoimento especial", url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13431.htm" },
      { nome: "Lei nº 15.211/2025 — ECA Digital (Lei Felca)", url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm" },
      { nome: "Lei nº 9.970/2000 — Dia Nacional de Combate ao Abuso e à Exploração Sexual", url: "https://www.planalto.gov.br/ccivil_03/leis/l9970.htm" },
    ],
  },
  {
    grupo: "Dados e pesquisa",
    itens: [
      { nome: "Anuário Brasileiro de Segurança Pública — FBSP", url: "https://forumseguranca.org.br/anuario-brasileiro-seguranca-publica/" },
      { nome: "Unicef Brasil — Proteção à infância", url: "https://www.unicef.org/brazil/protecao" },
      { nome: "SafeNet Brasil — Central Nacional de Denúncias", url: "https://new.safernet.org.br/" },
      { nome: "Childhood Brasil", url: "https://www.childhood.org.br/" },
    ],
  },
  {
    grupo: "Cobertura jornalística",
    itens: [
      { nome: "Agência Andi — Direitos da Infância", url: "https://www.andi.org.br/" },
      { nome: "Agência Brasil — EBC", url: "https://agenciabrasil.ebc.com.br/" },
    ],
  },
];

function Page() {
  return (
    <>
      <PageHero
        image={heroImg}
        eyebrow="Fontes utilizadas"
        title="Referências oficiais consultadas"
        description="Todo o conteúdo do projeto é embasado em fontes públicas, verificáveis e atualizadas. Esta página reúne os principais documentos consultados."
        icon={<BookMarked className="size-3.5" aria-hidden />}
      />
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10">
        {fontes.map((g, i) => (
          <Reveal key={g.grupo} delay={i * 80}>
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {g.grupo}
              </h2>
              <ul className="mt-4 space-y-2">
                {g.itens.map((it) => (
                  <li key={it.url}>
                    <a
                      href={it.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-[color:var(--orange)] transition-colors"
                    >
                      <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                      {it.nome}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </section>
    </>
  );
}
