import journalismImg from "@/assets/journalism.jpg";
import digitalImg from "@/assets/digital-safety.jpg";
import familyImg from "@/assets/family-dialogue.jpg";
import ribbonImg from "@/assets/ribbon.jpg";
import heroImg from "@/assets/hero-protection.jpg";
import silenceImg from "@/assets/silence.jpg";

export interface NewsItem {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  image: string;
  category: "Legislação" | "Campanha" | "Pesquisa" | "Internet" | "Direitos";
  source: { name: string; url: string };
}

/**
 * Área de notícias e conscientização.
 * Para adicionar um novo conteúdo: basta acrescentar um objeto a este array.
 * Mantenha sempre a fonte oficial e a data correta.
 */
export const news: NewsItem[] = [
  {
    slug: "eca-digital-lei-felca-sancionada",
    title: "Sancionada a Lei nº 15.211/2025 — \"ECA Digital\" inspirado no caso Felca",
    date: "2025-09-17",
    excerpt:
      "A nova lei obriga plataformas digitais a adotar medidas para proteger crianças e adolescentes de conteúdos que envolvam adultização, sexualização e exploração, com regras de remoção e responsabilização.",
    image: digitalImg,
    category: "Legislação",
    source: {
      name: "Agência Senado",
      url: "https://www12.senado.leg.br/noticias/materias/2025/09/17/sancionada-lei-que-protege-criancas-e-adolescentes-em-ambientes-digitais",
    },
  },
  {
    slug: "disque100-balanco-2024",
    title: "Disque 100 supera 75 mil denúncias de violações contra crianças em 2023",
    date: "2024-05-17",
    excerpt:
      "Balanço do Ministério dos Direitos Humanos e da Cidadania mostra que violência psicológica, negligência e violência sexual estão entre as principais violações reportadas ao Disque 100.",
    image: journalismImg,
    category: "Pesquisa",
    source: {
      name: "MDHC",
      url: "https://www.gov.br/mdh/pt-br/assuntos/noticias/2024/maio/disque-100-recebeu-mais-de-75-mil-denuncias-de-violacoes-contra-criancas-e-adolescentes-em-2023",
    },
  },
  {
    slug: "safernet-grooming-jogos-2025",
    title: "SaferNet alerta para aumento de aliciamento em jogos online",
    date: "2025-08-02",
    excerpt:
      "Indicadores da SaferNet Brasil mostram crescimento de denúncias envolvendo grooming em plataformas de jogos e chats voltados ao público infantojuvenil, com casos como o \"Mineblox\".",
    image: silenceImg,
    category: "Internet",
    source: {
      name: "SaferNet Brasil",
      url: "https://new.safernet.org.br/helpline/indicadores",
    },
  },
  {
    slug: "maio-laranja-mobilizacao-nacional",
    title: "Maio Laranja mobiliza escolas, igrejas e poderes públicos",
    date: "2025-05-18",
    excerpt:
      "Ações simultâneas em todo o país marcam o 18 de Maio — Dia Nacional de Combate ao Abuso e à Exploração Sexual de Crianças e Adolescentes, instituído pela Lei 9.970/2000.",
    image: ribbonImg,
    category: "Campanha",
    source: {
      name: "Governo Federal",
      url: "https://www.gov.br/mdh/pt-br/assuntos/noticias",
    },
  },
  {
    slug: "unicef-violencia-infancia-global",
    title: "UNICEF: 1 em cada 5 meninas sofre violência sexual antes dos 18 anos",
    date: "2024-10-10",
    excerpt:
      "Relatório global do Fundo das Nações Unidas para a Infância reforça que a violência sexual atinge proporções alarmantes e exige resposta intersetorial.",
    image: familyImg,
    category: "Pesquisa",
    source: {
      name: "UNICEF",
      url: "https://www.unicef.org/brazil/protecao-de-criancas-e-adolescentes",
    },
  },
  {
    slug: "escuta-especializada-lei-13431",
    title: "Lei da Escuta Especializada completa anos e amplia proteção",
    date: "2024-04-04",
    excerpt:
      "A Lei nº 13.431/2017 estabelece o sistema de garantia de direitos da criança e do adolescente vítima ou testemunha de violência, evitando a revitimização durante depoimentos.",
    image: heroImg,
    category: "Direitos",
    source: {
      name: "Planalto",
      url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13431.htm",
    },
  },
];
