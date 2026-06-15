import ribbonImg from "@/assets/ribbon.jpg";
import silenceImg from "@/assets/silence.jpg";
import heroImg from "@/assets/hero-protection.jpg";
import joyImg from "@/assets/children-joy.jpg";
import digitalImg from "@/assets/digital-safety.jpg";
import journalismImg from "@/assets/journalism.jpg";

export interface TimelineEntry {
  date: string; // ISO or human-friendly
  text: string;
}

export interface CaseItem {
  slug: string;
  title: string;
  date: string; // ISO — data de referência (ocorrência ou marco)
  location: string;
  summary: string;
  impact: string;
  image: string;
  tag: "Histórico" | "Repercussão nacional" | "Legislação" | "Ambiente digital" | "Operação policial";
  source: { name: string; url: string };
  /** Corpo em HTML (parágrafos, headings, listas) renderizado com SafeHtml. */
  body?: string;
  /** Linha do tempo cronológica do caso. */
  timeline?: TimelineEntry[];
  /** Referências secundárias além de `source`. */
  sources?: { label: string; url: string }[];
}

export const cases: CaseItem[] = [
  {
    slug: "caso-felca-adultizacao-2025",
    title: "Caso Felca — vídeo \"Adultização\" e a criação do ECA Digital",
    date: "2025-08-06",
    location: "Brasil — repercussão nacional",
    summary:
      "O influenciador Felipe Bressanim Pereira (Felca) publicou em agosto de 2025 um vídeo-denúncia de mais de 50 minutos expondo a adultização e a exploração de crianças nas redes sociais.",
    impact:
      "Acelerou a tramitação do Projeto de Lei nº 2.628/2022, sancionado como Lei nº 15.211/2025 (\"ECA Digital\" ou \"Lei Felca\").",
    image: digitalImg,
    tag: "Legislação",
    source: {
      name: "Agência Câmara dos Deputados",
      url: "https://www.camara.leg.br/noticias/1099083-camara-aprova-projeto-que-protege-criancas-e-adolescentes-em-ambientes-digitais",
    },
    body: `
      <h2>O vídeo que parou o Brasil</h2>
      <p>Em 6 de agosto de 2025, o influenciador Felipe Bressanim Pereira, conhecido como <strong>Felca</strong>, publicou no YouTube um vídeo-denúncia de mais de 50 minutos intitulado <em>"Adultização"</em>. O conteúdo expôs uma rede de perfis e práticas que sexualizam crianças e adolescentes em redes sociais — incluindo monetização indevida, comentários predatórios e o uso de filhos pequenos como instrumento de tráfego para canais adultos.</p>
      <p>Em poucos dias, o vídeo ultrapassou <strong>40 milhões de visualizações</strong>, provocou a derrubada de canais investigados e gerou reação imediata do Congresso Nacional, do Ministério Público e de plataformas digitais.</p>
      <h2>Reação institucional</h2>
      <p>O Projeto de Lei nº 2.628/2022, que dormia há quase três anos, foi pautado em regime de urgência. A Câmara aprovou o texto em 20 de agosto de 2025, o Senado em 27 de agosto e o presidente sancionou em 17 de setembro como a <strong>Lei nº 15.211/2025</strong>, batizada popularmente de "ECA Digital" ou "Lei Felca".</p>
      <h2>O que mudou com a Lei</h2>
      <ul>
        <li>Plataformas digitais devem adotar mecanismos de verificação de idade e moderação ativa de conteúdo que sexualize crianças.</li>
        <li>Remoção em até 24 horas após denúncia fundamentada.</li>
        <li>Responsabilização civil de plataformas por monetização indevida.</li>
        <li>Proibição de publicidade direcionada a crianças com base em perfilamento.</li>
      </ul>
    `,
    timeline: [
      { date: "2022-10-18", text: "Senador Alessandro Vieira apresenta o PL 2.628/2022." },
      { date: "2025-08-06", text: "Felca publica o vídeo \"Adultização\" no YouTube." },
      { date: "2025-08-12", text: "Vídeo atinge 40 milhões de visualizações; MPF abre apuração." },
      { date: "2025-08-20", text: "Câmara dos Deputados aprova o PL em regime de urgência." },
      { date: "2025-08-27", text: "Senado aprova o texto sem alterações." },
      { date: "2025-09-17", text: "Sancionada a Lei nº 15.211/2025 — \"ECA Digital\"." },
    ],
    sources: [
      { label: "Agência Senado — sanção da lei", url: "https://www12.senado.leg.br/noticias/materias/2025/09/17/sancionada-lei-que-protege-criancas-e-adolescentes-em-ambientes-digitais" },
      { label: "Texto integral da Lei 15.211/2025", url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm" },
      { label: "Canal do Felca no YouTube", url: "https://www.youtube.com/@Felca" },
    ],
  },
  {
    slug: "caso-vitoria-jogos-online-2025",
    title: "Caso Vitória — aliciamento de adolescente em comunidade de jogo online",
    date: "2025-07-15",
    location: "Brasil",
    summary:
      "Adolescente identificada como Vitória foi aliciada por um adulto em comunidades ligadas a jogos online e Discord. O caso virou alerta nacional sobre grooming.",
    impact:
      "Reforçou a discussão sobre verificação de idade, moderação ativa e responsabilidade das plataformas de jogos.",
    image: silenceImg,
    tag: "Ambiente digital",
    source: { name: "SaferNet Brasil — Indicadores", url: "https://new.safernet.org.br/helpline/indicadores" },
    body: `
      <h2>O esquema do aliciamento</h2>
      <p>O caso envolveu uma adolescente brasileira, identificada apenas como Vitória, aliciada por um homem adulto após meses de contato em servidores ligados a jogos online com salas de bate-papo e em canais do Discord. O agressor utilizou a estratégia clássica do <strong>grooming</strong>: ganho de confiança, presentes virtuais (skins, V-Bucks), isolamento emocional e migração da conversa para canais privados.</p>
      <h2>Por que o caso virou paradigma</h2>
      <p>Diferente de incidentes pontuais, este caso expôs uma rotina: comunidades inteiras criadas com a finalidade explícita de capturar crianças e adolescentes em torno de jogos. A SaferNet Brasil registrou, em 2024-2025, aumento de <strong>87% nas denúncias</strong> de aliciamento em plataformas de jogos.</p>
      <h2>Recomendações para famílias</h2>
      <ul>
        <li>Use os controles parentais nativos da plataforma (Roblox Account Restrictions, Discord Family Center).</li>
        <li>Mantenha conversas abertas: pergunte com quem a criança está jogando.</li>
        <li>Desconfie de "amigos virtuais" que pedem para mudar para outro app ou trocar fotos.</li>
        <li>Em caso de suspeita, denuncie no <a href="https://new.safernet.org.br/denuncie">SaferNet</a> e ao Disque 100.</li>
      </ul>
    `,
    timeline: [
      { date: "2024-12", text: "Primeiros contatos do agressor com a adolescente em servidor de jogo." },
      { date: "2025-03", text: "Migração da conversa para Discord privado." },
      { date: "2025-07-15", text: "Caso é publicizado; SaferNet emite alerta nacional." },
      { date: "2025-08", text: "Operação policial identifica o agressor; rede de aliciamento desmontada." },
    ],
    sources: [
      { label: "SaferNet — Indicadores de denúncia", url: "https://new.safernet.org.br/helpline/indicadores" },
      { label: "Guia de privacidade no Roblox", url: "https://en.help.roblox.com/hc/en-us/articles/360027820752" },
    ],
  },
  {
    slug: "caso-araceli-1973",
    title: "Caso Araceli — origem do Maio Laranja",
    date: "1973-05-18",
    location: "Vitória/ES",
    summary:
      "Araceli Crespo, 8 anos, foi sequestrada, abusada e assassinada em Vitória (ES) em 18 de maio de 1973. O crime tornou-se símbolo da luta contra a violência sexual infantil no Brasil.",
    impact:
      "Em homenagem a Araceli, a Lei nº 9.970/2000 instituiu o 18 de maio como Dia Nacional de Combate ao Abuso e à Exploração Sexual de Crianças e Adolescentes.",
    image: ribbonImg,
    tag: "Histórico",
    source: { name: "Planalto — Lei 9.970/2000", url: "https://www.planalto.gov.br/ccivil_03/leis/l9970.htm" },
    body: `
      <h2>O crime</h2>
      <p>Em 18 de maio de 1973, Araceli Cabrera Sánchez Crespo, de apenas <strong>8 anos</strong>, foi sequestrada na saída do colégio em Vitória (ES). Seu corpo foi encontrado seis dias depois, desfigurado por ácido, em um terreno baldio. A perícia constatou abuso sexual.</p>
      <h2>A impunidade</h2>
      <p>Apesar de cinco pessoas terem sido apontadas como envolvidas — todas oriundas de famílias influentes da capital capixaba — o processo foi sucessivamente arquivado, reaberto e prescrito. <strong>Ninguém foi punido criminalmente.</strong> O caso virou sinônimo, no Brasil, de impunidade em crimes contra crianças.</p>
      <h2>Legado</h2>
      <p>Em 2000, a Lei nº 9.970 instituiu o <strong>18 de maio</strong> como Dia Nacional de Combate ao Abuso e à Exploração Sexual de Crianças e Adolescentes. A data deu origem à campanha nacional <em>Maio Laranja</em>, hoje mobilizada por escolas, igrejas, poderes públicos e organizações da sociedade civil em todo o país.</p>
    `,
    timeline: [
      { date: "1973-05-18", text: "Araceli é sequestrada na saída do colégio em Vitória/ES." },
      { date: "1973-05-24", text: "Corpo da menina é encontrado em terreno baldio." },
      { date: "1980", text: "Processo é arquivado pela primeira vez." },
      { date: "1991", text: "Acusação contra os suspeitos prescreve definitivamente." },
      { date: "2000-05-17", text: "Sancionada a Lei nº 9.970/2000 instituindo o 18 de maio." },
    ],
    sources: [
      { label: "Lei 9.970/2000 — Planalto", url: "https://www.planalto.gov.br/ccivil_03/leis/l9970.htm" },
      { label: "Childhood Brasil — Maio Laranja", url: "https://www.childhood.org.br/maio-laranja" },
    ],
  },
  {
    slug: "caso-henry-borel-2021",
    title: "Caso Henry Borel — violência intrafamiliar",
    date: "2021-03-08",
    location: "Rio de Janeiro/RJ",
    summary:
      "O menino Henry Borel Medeiros, 4 anos, morreu vítima de agressões no apartamento onde vivia. O caso evidenciou a violência intrafamiliar e a dificuldade de identificação de maus-tratos.",
    impact:
      "Resultou na Lei Henry Borel (Lei nº 14.344/2022), que cria mecanismos de prevenção e enfrentamento da violência doméstica contra crianças.",
    image: heroImg,
    tag: "Legislação",
    source: { name: "Planalto — Lei 14.344/2022", url: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14344.htm" },
    body: `
      <h2>A tragédia</h2>
      <p>Na madrugada de 8 de março de 2021, Henry Borel Medeiros, 4 anos, foi levado ao hospital já sem vida. A versão inicial dos responsáveis — a mãe e o padrasto, então vereador no Rio — foi de queda da cama. A perícia revelou múltiplas lesões compatíveis com agressões prolongadas.</p>
      <h2>Falhas em rede</h2>
      <p>Investigações mostraram que professores, médicos e familiares haviam percebido sinais de maus-tratos meses antes, mas a notificação ao Conselho Tutelar não ocorreu — ou se perdeu. O caso virou paradigma sobre <strong>omissão da rede de proteção</strong> e sobre a necessidade de protocolos claros de notificação.</p>
      <h2>A Lei Henry Borel</h2>
      <p>Em 24 de maio de 2022 foi sancionada a Lei nº 14.344, que cria mecanismos de prevenção e enfrentamento da violência doméstica e familiar contra a criança e o adolescente, criando inclusive <strong>medidas protetivas de urgência</strong> análogas à Lei Maria da Penha.</p>
    `,
    timeline: [
      { date: "2021-03-08", text: "Henry Borel morre no Rio de Janeiro vítima de agressões." },
      { date: "2021-04-08", text: "Mãe e padrasto são presos preventivamente." },
      { date: "2022-05-24", text: "Sancionada a Lei nº 14.344/2022 (Lei Henry Borel)." },
      { date: "2024-04-08", text: "Condenação criminal dos réus em primeira instância." },
    ],
    sources: [
      { label: "Lei 14.344/2022 — Planalto", url: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14344.htm" },
    ],
  },
  {
    slug: "operacao-luz-na-infancia",
    title: "Operação Luz na Infância — combate ao CSAM",
    date: "2024-10-01",
    location: "Brasil — operação nacional",
    summary:
      "Operação coordenada pelo Ministério da Justiça contra o armazenamento e compartilhamento de material de abuso sexual infantil (CSAM) na internet, com mais de 10 edições desde 2017.",
    impact:
      "Centenas de mandados cumpridos, prisões em todos os estados brasileiros e identificação de vítimas em parceria com Interpol e NCMEC.",
    image: journalismImg,
    tag: "Operação policial",
    source: { name: "Ministério da Justiça e Segurança Pública", url: "https://www.gov.br/mj/pt-br/assuntos/noticias" },
    body: `
      <h2>O que é a operação</h2>
      <p>A <strong>Operação Luz na Infância</strong> é a maior ação coordenada do país contra o crime de armazenamento e compartilhamento de material de abuso sexual infantil (CSAM, na sigla em inglês). Conduzida pelo Ministério da Justiça e Segurança Pública em parceria com polícias civis estaduais, Polícia Federal, Interpol e o NCMEC (EUA), já está em sua 11ª edição.</p>
      <h2>Resultados acumulados (2017–2024)</h2>
      <ul>
        <li>Mais de <strong>2.300 mandados</strong> cumpridos em todos os estados.</li>
        <li>Mais de <strong>900 suspeitos</strong> presos em flagrante por posse e/ou compartilhamento de CSAM.</li>
        <li>Mais de <strong>180 vítimas</strong> identificadas e encaminhadas para acolhimento.</li>
      </ul>
      <h2>Como denunciar</h2>
      <p>Qualquer cidadão pode denunciar conteúdos suspeitos de forma anônima na <a href="https://new.safernet.org.br/denuncie">SaferNet</a> ou via Disque 100. Denúncias internacionais podem ser feitas diretamente ao <a href="https://report.cybertip.org/">CyberTipline (NCMEC)</a>.</p>
    `,
    timeline: [
      { date: "2017-10", text: "1ª edição da Operação Luz na Infância." },
      { date: "2020-11", text: "5ª edição: maior número de presos em flagrante até então." },
      { date: "2024-10-01", text: "11ª edição da operação, cobrindo todos os estados." },
    ],
    sources: [
      { label: "MJSP — Notícias oficiais", url: "https://www.gov.br/mj/pt-br/assuntos/noticias" },
      { label: "SaferNet — Como denunciar", url: "https://new.safernet.org.br/denuncie" },
    ],
  },
  {
    slug: "caso-bernardo-boldrini-2014",
    title: "Caso Bernardo Boldrini",
    date: "2014-04-04",
    location: "Três Passos/RS",
    summary:
      "Bernardo, 11 anos, foi assassinado pela madrasta e pelo pai. O caso expôs falhas do Conselho Tutelar e do Judiciário, que receberam alertas anteriores sem agir a tempo.",
    impact:
      "Motivou debates sobre a Lei da Escuta Especializada (Lei nº 13.431/2017), que regulamenta a oitiva protegida de crianças vítimas ou testemunhas.",
    image: joyImg,
    tag: "Repercussão nacional",
    source: { name: "Planalto — Lei 13.431/2017", url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13431.htm" },
    body: `
      <h2>O caso</h2>
      <p>Bernardo Uglione Boldrini, 11 anos, desapareceu de Três Passos (RS) em 4 de abril de 2014. Após 10 dias de buscas, seu corpo foi encontrado enterrado em Frederico Westphalen. As investigações apontaram o pai, a madrasta e dois cúmplices como responsáveis pelo assassinato — premeditado e executado com administração de medicamento letal.</p>
      <h2>Sinais ignorados</h2>
      <p>Bernardo havia procurado o Conselho Tutelar, escrito cartas e relatado em sala de aula que tinha medo da madrasta. Vários alertas formais foram protocolados, mas nenhum resultou em medida protetiva concreta a tempo. O caso virou referência sobre a necessidade de <strong>escuta qualificada</strong> da criança.</p>
      <h2>Reflexos legais</h2>
      <p>Em 2017 foi sancionada a Lei nº 13.431, que estabelece o sistema de garantia de direitos da criança e do adolescente vítima ou testemunha de violência. A norma criou os conceitos de <em>escuta especializada</em> e <em>depoimento especial</em>, evitando a revitimização.</p>
    `,
    timeline: [
      { date: "2014-04-04", text: "Bernardo desaparece em Três Passos/RS." },
      { date: "2014-04-14", text: "Corpo é encontrado; pai e madrasta são presos." },
      { date: "2017-04-04", text: "Sancionada a Lei nº 13.431/2017 da Escuta Especializada." },
      { date: "2018-06", text: "Pai e madrasta são condenados em juízo." },
    ],
    sources: [
      { label: "Lei 13.431/2017 — Planalto", url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13431.htm" },
    ],
  },
];
