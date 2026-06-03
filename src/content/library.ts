export interface LibraryItem {
  title: string;
  description: string;
  sourceOrg: string;
  year: number;
  category: "Cartilha" | "Guia" | "Pesquisa" | "Estudo" | "Material educativo";
  audience: "Famílias" | "Educadores" | "Profissionais" | "Adolescentes" | "Geral";
  url: string;
}

/**
 * Biblioteca curada de materiais publicados por órgãos oficiais e
 * organizações reconhecidas. Última verificação: 2025-11-15.
 * Para adicionar: acrescentar objeto ao array.
 */
export const library: LibraryItem[] = [
  {
    title: "Guia Escolar — Identificação de sinais de abuso e exploração sexual",
    description:
      "Material do Ministério da Educação para apoiar educadores na identificação e no encaminhamento de casos suspeitos.",
    sourceOrg: "Ministério da Educação / Ministério da Saúde",
    year: 2019,
    category: "Guia",
    audience: "Educadores",
    url: "https://www.gov.br/mdh/pt-br/centrais-de-conteudo/crianca-e-adolescente",
  },
  {
    title: "Disque 100 — Balanço Anual",
    description:
      "Relatório com dados consolidados de denúncias recebidas pelo Disque Direitos Humanos.",
    sourceOrg: "Ministério dos Direitos Humanos e da Cidadania",
    year: 2024,
    category: "Pesquisa",
    audience: "Geral",
    url: "https://www.gov.br/mdh/pt-br/assuntos/noticias/2024/maio/disque-100-recebeu-mais-de-75-mil-denuncias-de-violacoes-contra-criancas-e-adolescentes-em-2023",
  },
  {
    title: "Indicadores SaferNet Brasil",
    description:
      "Dados públicos sobre denúncias de crimes cibernéticos contra crianças, adolescentes e mulheres.",
    sourceOrg: "SaferNet Brasil",
    year: 2025,
    category: "Pesquisa",
    audience: "Geral",
    url: "https://indicadores.safernet.org.br/",
  },
  {
    title: "Childhood Brasil — Publicações sobre exploração sexual",
    description:
      "Coletânea de cartilhas, pesquisas e materiais educativos sobre prevenção da violência sexual.",
    sourceOrg: "Childhood Brasil",
    year: 2024,
    category: "Cartilha",
    audience: "Famílias",
    url: "https://www.childhood.org.br/publicacao",
  },
  {
    title: "Convenção sobre os Direitos da Criança",
    description:
      "Texto integral da convenção da ONU ratificada pelo Brasil em 1990, base do ECA.",
    sourceOrg: "UNICEF",
    year: 1989,
    category: "Estudo",
    audience: "Geral",
    url: "https://www.unicef.org/brazil/convencao-sobre-os-direitos-da-crianca",
  },
  {
    title: "ECA — Estatuto da Criança e do Adolescente (Lei 8.069/90)",
    description: "Texto integral atualizado do Estatuto da Criança e do Adolescente.",
    sourceOrg: "Presidência da República",
    year: 1990,
    category: "Estudo",
    audience: "Geral",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
  },
  {
    title: "Lei nº 13.431/2017 — Escuta especializada e depoimento especial",
    description:
      "Estabelece o sistema de garantia de direitos de crianças vítimas ou testemunhas de violência.",
    sourceOrg: "Presidência da República",
    year: 2017,
    category: "Estudo",
    audience: "Profissionais",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13431.htm",
  },
  {
    title: "Lei nº 15.211/2025 — ECA Digital",
    description:
      "Lei sancionada em setembro de 2025 que protege crianças e adolescentes em ambientes digitais.",
    sourceOrg: "Presidência da República",
    year: 2025,
    category: "Estudo",
    audience: "Geral",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm",
  },
  {
    title: "Guia de Configuração de Privacidade para Famílias",
    description:
      "Orientações da SaferNet para configurar privacidade em Roblox, Discord, TikTok, Instagram e WhatsApp.",
    sourceOrg: "SaferNet Brasil",
    year: 2024,
    category: "Guia",
    audience: "Famílias",
    url: "https://new.safernet.org.br/biblioteca",
  },
  {
    title: "Atlas da Violência",
    description:
      "Estudo do IPEA e do Fórum Brasileiro de Segurança Pública sobre dados de violência no Brasil.",
    sourceOrg: "IPEA / FBSP",
    year: 2024,
    category: "Pesquisa",
    audience: "Profissionais",
    url: "https://www.ipea.gov.br/atlasviolencia/",
  },
];
