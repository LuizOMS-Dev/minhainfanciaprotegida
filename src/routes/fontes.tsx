import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, BookMarked, Landmark, Globe2, Phone, Building2, Heart, ShieldAlert } from "lucide-react";
import heroImg from "@/assets/journalism.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/fontes")({
  head: () => ({
    meta: [
      { title: "Fontes Utilizadas — Infância Protegida" },
      {
        name: "description",
        content:
          "Referências oficiais e instituições consultadas pelo Infância Protegida: UNICEF, Childhood Brasil, SaferNet, MDHC, ECA, Disque 100 e mais.",
      },
      { property: "og:title", content: "Fontes Utilizadas — Infância Protegida" },
      {
        property: "og:description",
        content: "Lista pública das fontes e instituições que sustentam o conteúdo do portal.",
      },
      { property: "og:url", content: "/fontes" },
      { property: "og:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/fontes" }],
  }),
  component: Page,
});

const sources = [
  {
    icon: Globe2,
    name: "UNICEF Brasil",
    role: "Fundo das Nações Unidas para a Infância",
    text: "Relatórios globais e nacionais sobre direitos da criança, violência infantil e indicadores sociais.",
    url: "https://www.unicef.org/brazil/",
  },
  {
    icon: Heart,
    name: "Childhood Brasil",
    role: "Instituto WCF/Brasil",
    text: "Pesquisas, guias e programas de prevenção ao abuso e exploração sexual de crianças e adolescentes.",
    url: "https://www.childhood.org.br/",
  },
  {
    icon: ShieldAlert,
    name: "SaferNet Brasil",
    role: "Organização da sociedade civil",
    text: "Helpline, canal de denúncia online e estudos sobre crimes digitais contra crianças.",
    url: "https://new.safernet.org.br/",
  },
  {
    icon: Building2,
    name: "Ministério dos Direitos Humanos e da Cidadania (MDHC)",
    role: "Governo Federal",
    text: "Dados do Disque 100, campanhas oficiais e o Plano Nacional de Enfrentamento à Violência Sexual.",
    url: "https://www.gov.br/mdh/pt-br",
  },
  {
    icon: Landmark,
    name: "Governo Federal — gov.br",
    role: "Portal oficial",
    text: "Legislação, notas técnicas, programas e estatísticas públicas sobre infância e adolescência.",
    url: "https://www.gov.br/",
  },
  {
    icon: BookMarked,
    name: "Estatuto da Criança e do Adolescente (ECA)",
    role: "Lei nº 8.069/1990",
    text: "Marco legal brasileiro sobre direitos, proteção integral e responsabilidade compartilhada.",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
  },
  {
    icon: Phone,
    name: "Disque Direitos Humanos — Disque 100",
    role: "Canal oficial 24h, gratuito e anônimo",
    text: "Serviço nacional de recebimento, encaminhamento e monitoramento de denúncias de violações de direitos humanos.",
    url: "https://www.gov.br/mdh/pt-br/disque-100",
  },
];

function Page() {
  return (
    <>
      <PageHero
        image={heroImg}
        eyebrow="Fontes utilizadas"
        title="As instituições que sustentam cada informação deste portal."
        description="Listamos publicamente as principais referências consultadas. Use os links para conferir diretamente nas fontes originais."
        icon={<BookMarked className="size-3.5" aria-hidden />}
        variant="navy"
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Referências oficiais"
            title="Transparência sobre quem informa o Infância Protegida."
            description="Sempre que possível, citamos a fonte ao lado de cada dado. Esta página reúne as referências mais frequentes."
          />

          <ul className="mt-14 grid md:grid-cols-2 gap-6 list-none p-0">
            {sources.map((s, i) => (
              <Reveal key={s.name} delay={i * 60}>
                <li className="h-full rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-orange text-[color:var(--navy-deep)] shrink-0">
                      <s.icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold leading-tight">{s.name}</h3>
                      <p className="text-xs uppercase tracking-wider text-[color:var(--orange)] mt-1 font-semibold">
                        {s.role}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-3">{s.text}</p>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[color:var(--orange)] hover:underline"
                        aria-label={`Acessar site oficial de ${s.name} (abre em nova aba)`}
                      >
                        Acessar site oficial <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <p className="mt-12 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
              Encontrou uma fonte desatualizada ou quer sugerir uma nova referência? Entre em contato pelos
              canais oficiais — atualizamos continuamente.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
