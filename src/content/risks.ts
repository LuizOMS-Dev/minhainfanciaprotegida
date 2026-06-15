import {
  AlertTriangle,
  Camera,
  Gamepad2,
  MessageSquareWarning,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface RiskItem {
  slug: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  signs: string[];
  howToAct: string[];
  legalBase: string;
  example?: string;
  source: { name: string; url: string };
}

export const risks: RiskItem[] = [
  {
    slug: "adultizacao",
    title: "Adultização e exposição infantil",
    icon: Sparkles,
    summary:
      "Crianças expostas em redes sociais com poses, roupas, falas ou contextos próprios de adultos, muitas vezes monetizadas por familiares ou influenciadores.",
    signs: [
      "Perfis de crianças com grande número de seguidores adultos",
      "Comentários sexualizados em fotos ou vídeos",
      "Conteúdos com vestuário, maquiagem ou poses inadequadas para a idade",
    ],
    howToAct: [
      "Denuncie o conteúdo na própria plataforma e ao Disque 100",
      "Acione o Conselho Tutelar quando houver responsável direto",
      "Use o canal da SaferNet para conteúdos online",
    ],
    legalBase:
      'Lei nº 15.211/2025 (ECA Digital / "Lei Felca") + ECA, art. 240 e 241 (produção e divulgação de material sexualizado).',
    example: 'Caso Felca (2025) — vídeo "Adultização" provocou a sanção do ECA Digital.',
    source: {
      name: "Agência Câmara",
      url: "https://www.camara.leg.br/noticias/1099083-camara-aprova-projeto-que-protege-criancas-e-adolescentes-em-ambientes-digitais",
    },
  },
  {
    slug: "grooming",
    title: "Grooming — aliciamento em jogos e redes",
    icon: Gamepad2,
    summary:
      "Adultos que se aproximam de crianças por meio de jogos online, chats e redes sociais, fingindo amizade para obter imagens, dados ou encontros.",
    signs: [
      "Mudança brusca de comportamento após uso de jogos ou redes",
      "Conversas escondidas com pessoas desconhecidas",
      "Presentes virtuais (skins, robux, V-Bucks) recebidos de estranhos",
    ],
    howToAct: [
      "Converse sem julgar; mantenha o vínculo de confiança",
      "Preserve prints e conversas como prova",
      "Denuncie à SaferNet (canal Helpline) e à Polícia Civil",
    ],
    legalBase: "ECA, art. 241-D — aliciar criança para fim libidinoso. Pena de 1 a 3 anos.",
    example:
      "Casos noticiados em 2025 envolvendo aliciamento de adolescentes por meio de comunidades de jogo.",
    source: {
      name: "SaferNet Brasil",
      url: "https://new.safernet.org.br/",
    },
  },
  {
    slug: "sextorsao",
    title: "Sextorsão",
    icon: MessageSquareWarning,
    summary:
      "Criminosos obtêm imagens íntimas (reais ou manipuladas) e exigem dinheiro, novas imagens ou favores sob ameaça de divulgação.",
    signs: [
      "Adolescente ansioso, evitando o celular",
      "Pedidos de dinheiro ou compras inesperadas",
      'Comentários sobre "alguém que está ameaçando"',
    ],
    howToAct: [
      "Não pague e não envie novas imagens",
      "Guarde provas e procure a Polícia Civil ou Polícia Federal",
      "Use o canal da SaferNet para remoção de conteúdo",
    ],
    legalBase:
      "Código Penal, art. 158 (extorsão) e ECA, art. 241-A (compartilhamento de imagens de abuso infantil).",
    source: {
      name: "Polícia Federal",
      url: "https://www.gov.br/pf/pt-br",
    },
  },
  {
    slug: "csam-deepfake",
    title: "CSAM e deepfakes com IA",
    icon: Camera,
    summary:
      "Material de abuso sexual infantil (CSAM) e imagens falsas geradas por IA que sexualizam crianças reais, mesmo sem contato físico.",
    signs: [
      "Imagens de crianças manipuladas circulando em grupos",
      'Bots ou contas oferecendo "pacotes" de conteúdo',
      "Comunidades fechadas em apps de mensagens",
    ],
    howToAct: [
      "Nunca compartilhe — encaminhar também é crime",
      "Denuncie à SaferNet e à Polícia Federal",
      "Acione a plataforma para remoção imediata",
    ],
    legalBase:
      "ECA, arts. 240 e 241-A a 241-E — produção, posse e divulgação de material de abuso, inclusive simulado/manipulado.",
    source: {
      name: "Ministério da Justiça",
      url: "https://www.gov.br/mj/pt-br",
    },
  },
  {
    slug: "cyberbullying",
    title: "Cyberbullying",
    icon: Users,
    summary:
      "Humilhações, ameaças e perseguições por meio de redes sociais, grupos de mensagens e jogos, com efeitos graves sobre a saúde mental.",
    signs: [
      "Queda no desempenho escolar",
      "Isolamento e recusa em usar o celular",
      "Sinais de ansiedade, insônia ou autolesão",
    ],
    howToAct: [
      "Acolha sem culpar a vítima",
      "Comunique a escola e a plataforma",
      "Em ameaças graves, registre boletim de ocorrência",
    ],
    legalBase:
      "Lei nº 14.811/2024 — torna o bullying e o cyberbullying crimes específicos quando praticados de forma sistemática.",
    source: {
      name: "Planalto — Lei 14.811/2024",
      url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14811.htm",
    },
  },
  {
    slug: "desafios-virais",
    title: "Desafios virais perigosos",
    icon: AlertTriangle,
    summary:
      "Trends que estimulam crianças e adolescentes a praticar atos de risco físico ou psicológico, frequentemente recompensados com curtidas e visualizações.",
    signs: [
      "Marcas inexplicáveis no corpo",
      "Procura por objetos ou substâncias incomuns",
      "Comportamento de imitação de challenges vistos online",
    ],
    howToAct: [
      "Mantenha o diálogo aberto sobre o que é visto nas redes",
      "Ative controles parentais e tempo de tela",
      "Acione SaferNet para remoção de conteúdo",
    ],
    legalBase: "ECA, art. 5º — proteção integral; ECA Digital (Lei 15.211/2025).",
    source: {
      name: "SaferNet Brasil",
      url: "https://new.safernet.org.br/",
    },
  },
  {
    slug: "vazamento-dados",
    title: "Exposição de dados e localização",
    icon: ShieldAlert,
    summary:
      "Compartilhamento de fotos com uniforme escolar, endereço, rotina e geolocalização ativa, facilitando identificação e abordagem por agressores.",
    signs: [
      "Perfis abertos com nome completo e escola",
      "Stories com localização em tempo real",
      "Compartilhamento frequente de rotina",
    ],
    howToAct: [
      "Reveja as configurações de privacidade junto da criança",
      "Desative geolocalização em apps de foto e jogos",
      "Oriente sobre o que nunca deve ser publicado",
    ],
    legalBase: "LGPD (Lei 13.709/2018), art. 14 — tratamento de dados de crianças e adolescentes.",
    source: {
      name: "ANPD",
      url: "https://www.gov.br/anpd/pt-br",
    },
  },
];
