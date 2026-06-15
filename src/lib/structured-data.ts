// Centralized JSON-LD helpers for Knowledge Graph entity consolidation.
// All institutional pages must reference ORG_ID so that Google, Bing and
// LLM crawlers (GPTBot, ClaudeBot, Gemini, Perplexity, Copilot) recognize
// "Infância Protegida" as a single, coherent entity.

export const SITE_URL = "https://minhainfanciaprotegida.com.br";
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const MAIO_LARANJA_ID = `${SITE_URL}/#maio-laranja`;
export const GLOSSARY_ID = `${SITE_URL}/#glossario`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "NGO"],
  "@id": ORG_ID,
  name: "Infância Protegida",
  alternateName: ["Portal Infância Protegida", "Minha Infância Protegida"],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/android-chrome-512x512.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/android-chrome-512x512.png`,
  slogan: "Informação confiável salva vidas",
  description:
    "Portal brasileiro de conscientização, prevenção, educação e combate ao abuso e à exploração sexual de crianças e adolescentes.",
  foundingDate: "2025",
  areaServed: { "@type": "Country", name: "Brasil" },
  knowsLanguage: "pt-BR",
  knowsAbout: [
    "Proteção infantil",
    "Maio Laranja",
    "Abuso sexual infantil",
    "Exploração sexual infantil",
    "Direitos da criança e do adolescente",
    "Educação preventiva",
    "Estatuto da Criança e do Adolescente (ECA)",
    "Disque 100",
    "Grooming",
    "Segurança digital infantil",
  ],
  keywords:
    "proteção infantil, Maio Laranja, Disque 100, ECA, abuso infantil, exploração sexual infantil, direitos da criança, educação preventiva, segurança digital infantil",
  sameAs: [
    "https://www.gov.br/mdh/pt-br/disque100",
    "https://www.unicef.org/brazil/",
    "https://www.childhood.org.br/",
    "https://new.safernet.org.br/",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "Denúncia de violações de direitos humanos",
      telephone: "+55-100",
      availableLanguage: ["Portuguese"],
      areaServed: "BR",
      description:
        "Disque 100 — canal federal de denúncia de violações de direitos humanos, gratuito, anônimo, 24 horas.",
    },
  ],
  subjectOf: { "@id": MAIO_LARANJA_ID },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: "Infância Protegida",
  alternateName: "Portal Infância Protegida",
  inLanguage: "pt-BR",
  publisher: { "@id": ORG_ID },
  about: { "@id": ORG_ID },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/biblioteca?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const maioLaranjaEventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "@id": MAIO_LARANJA_ID,
  name: "Maio Laranja",
  alternateName: "Campanha Maio Laranja",
  description:
    "Campanha nacional brasileira de conscientização e combate ao abuso e à exploração sexual de crianças e adolescentes, realizada anualmente em maio, com marco em 18 de maio — Dia Nacional de Combate ao Abuso e à Exploração Sexual de Crianças e Adolescentes (Lei nº 9.970/2000).",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
  startDate: "2026-05-01",
  endDate: "2026-05-31",
  eventSchedule: {
    "@type": "Schedule",
    repeatFrequency: "P1Y",
    byMonth: 5,
    startDate: "2026-05-01",
    endDate: "2026-05-31",
  },
  location: { "@type": "Country", name: "Brasil" },
  organizer: { "@id": ORG_ID },
  about: { "@id": ORG_ID },
  inLanguage: "pt-BR",
  url: `${SITE_URL}/maio-laranja`,
  sameAs: [
    "https://www.gov.br/mdh/pt-br/assuntos/noticias/2024/maio/campanha-faca-bonito-marca-os-25-anos-do-18-de-maio",
  ],
};

const term = (id: string, name: string, description: string, sameAs?: string[]) => ({
  "@type": "DefinedTerm",
  "@id": `${SITE_URL}/#term-${id}`,
  name,
  description,
  inDefinedTermSet: { "@id": GLOSSARY_ID },
  ...(sameAs ? { sameAs } : {}),
});

export const definedTermsSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": GLOSSARY_ID,
  name: "Glossário Infância Protegida",
  inLanguage: "pt-BR",
  publisher: { "@id": ORG_ID },
  hasDefinedTerm: [
    term(
      "protecao-infantil",
      "Proteção infantil",
      "Conjunto de ações, políticas públicas e práticas sociais voltadas a garantir a integridade física, psicológica e social de crianças e adolescentes.",
      ["https://pt.wikipedia.org/wiki/Direitos_da_crian%C3%A7a"],
    ),
    term(
      "maio-laranja",
      "Maio Laranja",
      "Campanha nacional brasileira de combate ao abuso e à exploração sexual de crianças e adolescentes, com marco em 18 de maio.",
    ),
    term(
      "abuso-sexual-infantil",
      "Abuso sexual infantil",
      "Toda situação em que crianças ou adolescentes são utilizados para satisfação sexual de pessoas em estágio de desenvolvimento psicossexual mais adiantado.",
      ["https://www.unicef.org/brazil/protecao-de-criancas-e-adolescentes"],
    ),
    term(
      "exploracao-sexual-infantil",
      "Exploração sexual infantil",
      "Uso de crianças ou adolescentes em atividades sexuais mediante troca por dinheiro, bens, favores, drogas ou qualquer outra forma de pagamento.",
    ),
    term(
      "direitos-da-crianca",
      "Direitos da criança e do adolescente",
      "Conjunto de direitos fundamentais reconhecidos pela Constituição Federal e pelo Estatuto da Criança e do Adolescente (ECA, Lei nº 8.069/1990).",
      ["https://www.planalto.gov.br/ccivil_03/leis/l8069.htm"],
    ),
    term(
      "educacao-preventiva",
      "Educação preventiva",
      "Conjunto de práticas educativas voltadas a fortalecer a capacidade de crianças, famílias e escolas de identificar, prevenir e enfrentar situações de violência.",
    ),
    term(
      "grooming",
      "Grooming (assédio online)",
      "Processo pelo qual um adulto estabelece vínculo de confiança com uma criança ou adolescente em ambiente digital com a intenção de praticar abuso sexual.",
    ),
    term(
      "disque-100",
      "Disque 100",
      "Canal federal brasileiro de denúncia de violações de direitos humanos, gratuito, anônimo e disponível 24 horas por dia.",
      ["https://www.gov.br/mdh/pt-br/disque100"],
    ),
    term(
      "eca",
      "Estatuto da Criança e do Adolescente (ECA)",
      "Lei nº 8.069 de 13 de julho de 1990, que dispõe sobre a proteção integral à criança e ao adolescente no Brasil.",
      ["https://www.planalto.gov.br/ccivil_03/leis/l8069.htm"],
    ),
  ],
};

const navItems: Array<{ name: string; path: string }> = [
  { name: "Início", path: "/" },
  { name: "Maio Laranja", path: "/maio-laranja" },
  { name: "Identificar Sinais", path: "/sinais" },
  { name: "Riscos Online", path: "/riscos-online" },
  { name: "Para Pais", path: "/pais" },
  { name: "Para Escolas", path: "/escolas" },
  { name: "Biblioteca", path: "/biblioteca" },
  { name: "Casos Reais", path: "/casos" },
  { name: "Notícias", path: "/noticias" },
  { name: "Como Ajudar", path: "/como-ajudar" },
  { name: "Denúncia", path: "/denuncia" },
  { name: "Legislação", path: "/legislacao" },
  { name: "Mapa de Ajuda", path: "/mapa" },
  { name: "FAQ", path: "/faq" },
];

export const siteNavigationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/#navigation`,
  name: "Navegação principal — Infância Protegida",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: navItems.length,
  itemListElement: navItems.map((item, i) => ({
    "@type": "SiteNavigationElement",
    position: i + 1,
    name: item.name,
    url: `${SITE_URL}${item.path}`,
  })),
};

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function institutionalPageSchema(opts: { path: string; name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}${opts.path}#webpage`,
    url: `${SITE_URL}${opts.path}`,
    name: opts.name,
    description: opts.description,
    inLanguage: "pt-BR",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    mainEntity: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    mentions: [
      { "@id": MAIO_LARANJA_ID },
      { "@id": `${SITE_URL}/#term-disque-100` },
      { "@id": `${SITE_URL}/#term-eca` },
      { "@id": `${SITE_URL}/#term-protecao-infantil` },
    ],
  };
}
