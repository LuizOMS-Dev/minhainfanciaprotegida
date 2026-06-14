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
  /** Corpo em HTML para a página de detalhe. */
  body?: string;
  /** Referências secundárias. */
  sources?: { label: string; url: string }[];
}

export const news: NewsItem[] = [
  {
    slug: "eca-digital-lei-felca-sancionada",
    title: "Sancionada a Lei nº 15.211/2025 — \"ECA Digital\" inspirado no caso Felca",
    date: "2025-09-17",
    excerpt:
      "A nova lei obriga plataformas digitais a adotar medidas para proteger crianças e adolescentes de conteúdos que envolvam adultização e exploração.",
    image: digitalImg,
    category: "Legislação",
    source: {
      name: "Agência Senado",
      url: "https://www12.senado.leg.br/noticias/materias/2025/09/17/sancionada-lei-que-protege-criancas-e-adolescentes-em-ambientes-digitais",
    },
    body: `
      <p>Foi sancionada em <strong>17 de setembro de 2025</strong> a Lei nº 15.211/2025, conhecida como <em>ECA Digital</em> ou <em>Lei Felca</em>. A norma estabelece um conjunto de obrigações para plataformas digitais com o objetivo de proteger crianças e adolescentes em ambientes online.</p>
      <h2>Principais pontos</h2>
      <ul>
        <li><strong>Verificação de idade</strong>: plataformas devem adotar mecanismos efetivos para impedir o cadastro de menores de 13 anos sem consentimento parental.</li>
        <li><strong>Remoção de conteúdo</strong>: imagens e vídeos que sexualizem ou exponham crianças devem ser removidos em até 24 horas após denúncia fundamentada.</li>
        <li><strong>Vedação de monetização</strong>: é proibido monetizar conteúdo que use crianças com objetivo de atrair audiência adulta.</li>
        <li><strong>Responsabilidade civil</strong>: plataformas respondem solidariamente em caso de omissão.</li>
      </ul>
      <h2>Contexto</h2>
      <p>O projeto, parado desde 2022, foi pautado em regime de urgência após a repercussão do vídeo "Adultização" publicado pelo influenciador Felca em agosto de 2025.</p>
    `,
    sources: [
      { label: "Texto integral — Planalto", url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm" },
      { label: "Cobertura da Câmara dos Deputados", url: "https://www.camara.leg.br/noticias/1099083-camara-aprova-projeto-que-protege-criancas-e-adolescentes-em-ambientes-digitais" },
    ],
  },
  {
    slug: "disque100-balanco-2024",
    title: "Disque 100 supera 75 mil denúncias de violações contra crianças em 2023",
    date: "2024-05-17",
    excerpt:
      "Balanço do MDHC mostra que violência psicológica, negligência e violência sexual estão entre as principais violações reportadas ao Disque 100.",
    image: journalismImg,
    category: "Pesquisa",
    source: {
      name: "MDHC",
      url: "https://www.gov.br/mdh/pt-br/assuntos/noticias/2024/maio/disque-100-recebeu-mais-de-75-mil-denuncias-de-violacoes-contra-criancas-e-adolescentes-em-2023",
    },
    body: `
      <p>O Ministério dos Direitos Humanos e da Cidadania (MDHC) divulgou em maio de 2024 o balanço anual do Disque 100. Em 2023, o canal recebeu <strong>mais de 75 mil denúncias</strong> envolvendo crianças e adolescentes.</p>
      <h2>Principais violações reportadas</h2>
      <ul>
        <li>Violência psicológica</li>
        <li>Negligência</li>
        <li>Violência física</li>
        <li>Violência sexual (cerca de 11% do total)</li>
      </ul>
      <p>A maioria das vítimas é do sexo feminino e os agressores são, em mais de 80% dos casos, familiares ou pessoas do convívio. O dado reforça a necessidade de fortalecimento da rede de proteção em âmbito doméstico.</p>
    `,
  },
  {
    slug: "safernet-grooming-jogos-2025",
    title: "SaferNet alerta para aumento de aliciamento em jogos online",
    date: "2025-08-02",
    excerpt:
      "Indicadores da SaferNet mostram crescimento de denúncias envolvendo grooming em plataformas de jogos e chats voltados ao público infantojuvenil.",
    image: silenceImg,
    category: "Internet",
    source: { name: "SaferNet Brasil", url: "https://new.safernet.org.br/helpline/indicadores" },
    body: `
      <p>A SaferNet Brasil registrou em 2025 um aumento expressivo nas denúncias de <strong>grooming</strong> (aliciamento online de menores) em plataformas de jogos como Roblox, Mineblox, Fortnite e Discord.</p>
      <h2>O que é grooming</h2>
      <p>É a estratégia adotada por adultos para conquistar a confiança de uma criança ou adolescente com finalidade sexual. Em ambientes de jogo, costuma envolver presentes virtuais, elogios excessivos e migração da conversa para canais privados.</p>
      <h2>Como proteger</h2>
      <ul>
        <li>Configure controles parentais nas plataformas.</li>
        <li>Mantenha conversas abertas com a criança sobre quem ela conhece online.</li>
        <li>Denuncie casos suspeitos no <a href="https://new.safernet.org.br/denuncie">canal da SaferNet</a> ou no Disque 100.</li>
      </ul>
    `,
  },
  {
    slug: "maio-laranja-mobilizacao-nacional",
    title: "Maio Laranja mobiliza escolas, igrejas e poderes públicos",
    date: "2025-05-18",
    excerpt:
      "Ações simultâneas em todo o país marcam o 18 de Maio — Dia Nacional de Combate ao Abuso e à Exploração Sexual de Crianças e Adolescentes.",
    image: ribbonImg,
    category: "Campanha",
    source: { name: "Governo Federal", url: "https://www.gov.br/mdh/pt-br/assuntos/noticias" },
    body: `
      <p>O <strong>Maio Laranja</strong> é a campanha nacional de mobilização contra a violência sexual de crianças e adolescentes, marcada pelo <strong>18 de maio</strong>, data instituída pela Lei nº 9.970/2000 em referência ao caso Araceli (1973).</p>
      <h2>Como participar</h2>
      <ul>
        <li>Use o laço laranja em locais visíveis.</li>
        <li>Promova rodas de conversa em escolas e comunidades.</li>
        <li>Divulgue os canais de denúncia: Disque 100, Conselho Tutelar e Delegacia da Criança.</li>
        <li>Ilumine prédios públicos e privados de laranja na data.</li>
      </ul>
    `,
  },
  {
    slug: "unicef-violencia-infancia-global",
    title: "UNICEF: 1 em cada 5 meninas sofre violência sexual antes dos 18 anos",
    date: "2024-10-10",
    excerpt:
      "Relatório global do Fundo das Nações Unidas para a Infância reforça que a violência sexual atinge proporções alarmantes e exige resposta intersetorial.",
    image: familyImg,
    category: "Pesquisa",
    source: { name: "UNICEF", url: "https://www.unicef.org/brazil/protecao-de-criancas-e-adolescentes" },
    body: `
      <p>Em outubro de 2024, o UNICEF publicou o estudo <em>"When Numbers Demand Action: Confronting the global scale of sexual violence against children"</em>. O relatório indica que <strong>cerca de 370 milhões de mulheres e meninas</strong> sofreram estupro ou violência sexual antes dos 18 anos — o equivalente a 1 em cada 5.</p>
      <p>Para meninos, a estimativa é de 1 em cada 11 — totalizando entre 240 e 310 milhões.</p>
      <h2>Resposta necessária</h2>
      <ul>
        <li>Fortalecimento da rede de proteção (saúde, educação, assistência social).</li>
        <li>Educação para o consentimento desde a primeira infância.</li>
        <li>Investimento em serviços especializados de escuta.</li>
      </ul>
    `,
  },
  {
    slug: "escuta-especializada-lei-13431",
    title: "Lei da Escuta Especializada amplia proteção a vítimas e testemunhas",
    date: "2024-04-04",
    excerpt:
      "A Lei nº 13.431/2017 estabelece o sistema de garantia de direitos da criança vítima ou testemunha de violência, evitando a revitimização.",
    image: heroImg,
    category: "Direitos",
    source: { name: "Planalto", url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13431.htm" },
    body: `
      <p>A <strong>Lei nº 13.431/2017</strong> normatizou no Brasil dois instrumentos fundamentais para proteger crianças vítimas ou testemunhas de violência:</p>
      <h2>Escuta especializada</h2>
      <p>Procedimento realizado por órgão da rede de proteção, focado no acolhimento e na avaliação do caso. <strong>Não</strong> tem finalidade de prova judicial.</p>
      <h2>Depoimento especial</h2>
      <p>Procedimento conduzido perante autoridade policial ou judiciária, em sala apropriada, por profissional capacitado, com técnicas que evitam a revitimização da criança.</p>
      <p>A norma surge no contexto pós-caso Bernardo Boldrini e dialoga com a Convenção da ONU sobre os Direitos da Criança.</p>
    `,
  },
];
