export interface LibraryItem {
  slug: string;
  title: string;
  description: string;
  sourceOrg: string;
  year: number;
  category: "Cartilha" | "Guia" | "Pesquisa" | "Estudo" | "Material educativo";
  audience: "Famílias" | "Educadores" | "Profissionais" | "Adolescentes" | "Geral";
  url: string;
  /** Corpo de detalhe (HTML) com resumo ampliado. */
  body?: string;
}

/**
 * Biblioteca curada de materiais publicados por órgãos oficiais e
 * organizações reconhecidas. Última verificação: 2025-11-15.
 */
export const library: LibraryItem[] = [
  {
    slug: "guia-escolar-mec",
    title: "Guia Escolar — Identificação de sinais de abuso e exploração sexual",
    description:
      "Material do Ministério da Educação para apoiar educadores na identificação e encaminhamento de casos suspeitos.",
    sourceOrg: "Ministério da Educação / Ministério da Saúde",
    year: 2019,
    category: "Guia",
    audience: "Educadores",
    url: "https://www.gov.br/mdh/pt-br/centrais-de-conteudo/crianca-e-adolescente",
    body: `
      <p>O <strong>Guia Escolar</strong> é uma publicação interministerial voltada a profissionais da educação. Apresenta um protocolo prático para identificar sinais físicos, comportamentais e emocionais de abuso e exploração sexual em alunos.</p>
      <h2>O que o material aborda</h2>
      <ul>
        <li>Definições e formas de violência sexual contra crianças.</li>
        <li>Sinais de alerta por faixa etária.</li>
        <li>Como acolher o relato sem revitimizar.</li>
        <li>Fluxo de notificação ao Conselho Tutelar.</li>
      </ul>
    `,
  },
  {
    slug: "disque100-balanco-anual",
    title: "Disque 100 — Balanço Anual",
    description: "Relatório com dados consolidados de denúncias recebidas pelo Disque Direitos Humanos.",
    sourceOrg: "Ministério dos Direitos Humanos e da Cidadania",
    year: 2024,
    category: "Pesquisa",
    audience: "Geral",
    url: "https://www.gov.br/mdh/pt-br/assuntos/noticias/2024/maio/disque-100-recebeu-mais-de-75-mil-denuncias-de-violacoes-contra-criancas-e-adolescentes-em-2023",
    body: `<p>Relatório consolidado das denúncias do canal Disque 100 referentes ao ano-base 2023, com mais de 75 mil registros envolvendo crianças e adolescentes. Inclui análise por tipo de violação, perfil das vítimas e regiões com mais ocorrências.</p>`,
  },
  {
    slug: "indicadores-safernet",
    title: "Indicadores SaferNet Brasil",
    description: "Dados públicos sobre denúncias de crimes cibernéticos contra crianças e adolescentes.",
    sourceOrg: "SaferNet Brasil",
    year: 2025,
    category: "Pesquisa",
    audience: "Geral",
    url: "https://indicadores.safernet.org.br/",
    body: `<p>Painel público com a série histórica de denúncias recebidas pela Central Nacional de Denúncias da SaferNet, incluindo CSAM, aliciamento, sexting não consensual e cyberbullying.</p>`,
  },
  {
    slug: "childhood-publicacoes",
    title: "Childhood Brasil — Publicações sobre exploração sexual",
    description: "Coletânea de cartilhas, pesquisas e materiais educativos sobre prevenção da violência sexual.",
    sourceOrg: "Childhood Brasil",
    year: 2024,
    category: "Cartilha",
    audience: "Famílias",
    url: "https://www.childhood.org.br/publicacao",
    body: `<p>Biblioteca de publicações da Childhood Brasil, fundação dedicada à proteção da infância. Reúne pesquisas sobre turismo sexual, exploração no ambiente digital e materiais educativos para famílias.</p>`,
  },
  {
    slug: "convencao-direitos-crianca",
    title: "Convenção sobre os Direitos da Criança",
    description: "Texto integral da convenção da ONU ratificada pelo Brasil em 1990, base do ECA.",
    sourceOrg: "UNICEF",
    year: 1989,
    category: "Estudo",
    audience: "Geral",
    url: "https://www.unicef.org/brazil/convencao-sobre-os-direitos-da-crianca",
    body: `<p>Tratado internacional adotado pela ONU em 20 de novembro de 1989 e ratificado pelo Brasil em 24 de setembro de 1990. Estabelece 54 artigos sobre direitos civis, políticos, sociais, culturais e econômicos das crianças. Base normativa do ECA brasileiro.</p>`,
  },
  {
    slug: "eca-lei-8069",
    title: "ECA — Estatuto da Criança e do Adolescente (Lei 8.069/90)",
    description: "Texto integral atualizado do Estatuto da Criança e do Adolescente.",
    sourceOrg: "Presidência da República",
    year: 1990,
    category: "Estudo",
    audience: "Geral",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
    body: `<p>O Estatuto da Criança e do Adolescente (ECA), Lei nº 8.069 de 13 de julho de 1990, é o marco legal brasileiro para a proteção integral da criança. Inclui princípios fundamentais, medidas de proteção, política de atendimento e regras processuais.</p>`,
  },
  {
    slug: "lei-13431-escuta",
    title: "Lei nº 13.431/2017 — Escuta especializada e depoimento especial",
    description: "Estabelece o sistema de garantia de direitos de crianças vítimas ou testemunhas de violência.",
    sourceOrg: "Presidência da República",
    year: 2017,
    category: "Estudo",
    audience: "Profissionais",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13431.htm",
    body: `<p>Lei que organiza o sistema de garantia de direitos da criança e do adolescente vítima ou testemunha de violência. Cria os procedimentos de escuta especializada (rede de proteção) e depoimento especial (autoridade judiciária/policial).</p>`,
  },
  {
    slug: "lei-15211-eca-digital",
    title: "Lei nº 15.211/2025 — ECA Digital",
    description: "Lei sancionada em setembro de 2025 que protege crianças e adolescentes em ambientes digitais.",
    sourceOrg: "Presidência da República",
    year: 2025,
    category: "Estudo",
    audience: "Geral",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm",
    body: `<p>A Lei nº 15.211/2025, popularmente conhecida como ECA Digital ou Lei Felca, estabelece deveres específicos para plataformas digitais quanto à proteção de crianças e adolescentes. Inclui obrigações de verificação de idade, remoção de conteúdo e vedação de monetização indevida.</p>`,
  },
  {
    slug: "safernet-guia-familias",
    title: "Guia de Configuração de Privacidade para Famílias",
    description: "Orientações da SaferNet para configurar privacidade em Roblox, Discord, TikTok, Instagram e WhatsApp.",
    sourceOrg: "SaferNet Brasil",
    year: 2024,
    category: "Guia",
    audience: "Famílias",
    url: "https://new.safernet.org.br/biblioteca",
    body: `<p>Guia prático passo a passo para configurar privacidade e controle parental nas principais plataformas usadas por crianças e adolescentes brasileiros.</p>`,
  },
  {
    slug: "atlas-violencia",
    title: "Atlas da Violência",
    description: "Estudo do IPEA e do FBSP sobre dados de violência no Brasil.",
    sourceOrg: "IPEA / FBSP",
    year: 2024,
    category: "Pesquisa",
    audience: "Profissionais",
    url: "https://www.ipea.gov.br/atlasviolencia/",
    body: `<p>Publicação anual do Instituto de Pesquisa Econômica Aplicada (IPEA) em parceria com o Fórum Brasileiro de Segurança Pública (FBSP). Reúne indicadores de violência letal e sexual no Brasil, com recortes regionais e demográficos.</p>`,
  },
];
