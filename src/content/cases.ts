import ribbonImg from "@/assets/ribbon.jpg";
import silenceImg from "@/assets/silence.jpg";
import heroImg from "@/assets/hero-protection.jpg";
import joyImg from "@/assets/children-joy.jpg";
import digitalImg from "@/assets/digital-safety.jpg";
import journalismImg from "@/assets/journalism.jpg";

export interface CaseItem {
  slug: string;
  title: string;
  date: string; // ISO
  location: string;
  summary: string;
  impact: string;
  image: string;
  tag: "Histórico" | "Repercussão nacional" | "Legislação" | "Ambiente digital" | "Operação policial";
  source: { name: string; url: string };
}

export const cases: CaseItem[] = [
  {
    slug: "caso-felca-adultizacao-2025",
    title: "Caso Felca — vídeo \"Adultização\" e a criação do ECA Digital",
    date: "2025-08-06",
    location: "Brasil — repercussão nacional",
    summary:
      "O influenciador Felipe Bressanim Pereira (Felca) publicou em agosto de 2025 um vídeo-denúncia de mais de 50 minutos expondo a adultização e a exploração de crianças nas redes sociais. O conteúdo ultrapassou 40 milhões de visualizações em poucos dias e provocou reação imediata do Congresso.",
    impact:
      "Acelerou a tramitação do Projeto de Lei nº 2.628/2022, sancionado como Lei nº 15.211/2025 (\"ECA Digital\" ou \"Lei Felca\"), que obriga plataformas a remover conteúdos que sexualizem ou exponham crianças e adolescentes e responsabiliza redes sociais por monetização indevida.",
    image: digitalImg,
    tag: "Legislação",
    source: {
      name: "Agência Câmara dos Deputados",
      url: "https://www.camara.leg.br/noticias/1099083-camara-aprova-projeto-que-protege-criancas-e-adolescentes-em-ambientes-digitais",
    },
  },
  {
    slug: "caso-vitoria-mineblox-2025",
    title: "Caso \"Mineblox\" — aliciamento de adolescente em comunidade de jogo online",
    date: "2025-07-15",
    location: "Brasil",
    summary:
      "Adolescente brasileira identificada como \"Vitória\" foi aliciada por um homem adulto após meses de contato em comunidades ligadas a jogos online (Roblox / Mineblox) e Discord. O caso virou alerta nacional sobre grooming em plataformas voltadas ao público infantil.",
    impact:
      "Reforçou a discussão sobre verificação de idade, moderação ativa e responsabilidade das plataformas de jogos. Citado pela SaferNet Brasil em alertas de 2025 sobre aliciamento em ambientes gamer.",
    image: silenceImg,
    tag: "Ambiente digital",
    source: {
      name: "SaferNet Brasil — Indicadores",
      url: "https://new.safernet.org.br/helpline/indicadores",
    },
  },
  {
    slug: "caso-araceli-1973",
    title: "Caso Araceli — origem do Maio Laranja",
    date: "1973-05-18",
    location: "Vitória/ES",
    summary:
      "Araceli Crespo, de 8 anos, foi sequestrada, abusada e assassinada em Vitória (ES) no dia 18 de maio de 1973. O crime permanece, em parte, impune e tornou-se símbolo da luta contra a violência sexual infantil no Brasil.",
    impact:
      "Em homenagem a Araceli, a Lei nº 9.970/2000 instituiu o 18 de maio como Dia Nacional de Combate ao Abuso e à Exploração Sexual de Crianças e Adolescentes — origem da campanha Maio Laranja.",
    image: ribbonImg,
    tag: "Histórico",
    source: {
      name: "Planalto — Lei 9.970/2000",
      url: "https://www.planalto.gov.br/ccivil_03/leis/l9970.htm",
    },
  },
  {
    slug: "caso-henry-borel-2021",
    title: "Caso Henry Borel — violência intrafamiliar",
    date: "2021-03-08",
    location: "Rio de Janeiro/RJ",
    summary:
      "O menino Henry Borel Medeiros, 4 anos, morreu vítima de agressões no apartamento onde vivia. O caso evidenciou a violência intrafamiliar e a dificuldade de identificação de maus-tratos por profissionais de saúde e escola.",
    impact:
      "Resultou na Lei Henry Borel (Lei nº 14.344/2022), que cria mecanismos de prevenção e enfrentamento da violência doméstica e familiar contra crianças e adolescentes.",
    image: heroImg,
    tag: "Legislação",
    source: {
      name: "Planalto — Lei 14.344/2022",
      url: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14344.htm",
    },
  },
  {
    slug: "operacao-luz-na-infancia",
    title: "Operação Luz na Infância — combate ao CSAM",
    date: "2024-10-01",
    location: "Brasil — operação nacional",
    summary:
      "Operação coordenada pelo Ministério da Justiça e Segurança Pública contra o armazenamento e compartilhamento de material de abuso sexual infantil (CSAM) na internet. Já realizada em mais de 10 edições desde 2017.",
    impact:
      "Centenas de mandados cumpridos, prisões em todos os estados brasileiros e identificação de vítimas em parceria com a Interpol e o NCMEC.",
    image: journalismImg,
    tag: "Operação policial",
    source: {
      name: "Ministério da Justiça e Segurança Pública",
      url: "https://www.gov.br/mj/pt-br/assuntos/noticias",
    },
  },
  {
    slug: "caso-bernardo-boldrini-2014",
    title: "Caso Bernardo Boldrini",
    date: "2014-04-04",
    location: "Três Passos/RS",
    summary:
      "Bernardo, 11 anos, foi assassinado pela madrasta e pelo pai. O caso expôs falhas do Conselho Tutelar e do Judiciário, que receberam alertas anteriores sem agir a tempo.",
    impact:
      "Motivou debates sobre a Lei da Escuta Especializada (Lei nº 13.431/2017), que regulamenta a oitiva protegida de crianças vítimas ou testemunhas de violência.",
    image: joyImg,
    tag: "Repercussão nacional",
    source: {
      name: "Planalto — Lei 13.431/2017",
      url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13431.htm",
    },
  },
];
