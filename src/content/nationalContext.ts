/**
 * Eixos temáticos nacionais usados para conectar matérias e casos
 * a campanhas, marcos legais e movimentos institucionais.
 * Selecionáveis no editor via `national_context`.
 */

export interface NationalContextItem {
  key: string;
  label: string;
  blurb: string;
  href: string;
}

export const nationalContext: NationalContextItem[] = [
  {
    key: "maio-laranja",
    label: "Maio Laranja",
    blurb:
      "Campanha nacional de combate ao abuso e exploração sexual de crianças e adolescentes, mobilizada em torno do 18 de maio.",
    href: "/maio-laranja",
  },
  {
    key: "eca",
    label: "Estatuto da Criança e do Adolescente",
    blurb:
      "Lei 8.069/1990 — marco legal que assegura proteção integral e prioridade absoluta a crianças e adolescentes no Brasil.",
    href: "/legislacao",
  },
  {
    key: "direitos-crianca",
    label: "Direitos da Criança",
    blurb:
      "Garantias constitucionais e internacionais que protegem a integridade, a dignidade e o desenvolvimento pleno de crianças e adolescentes.",
    href: "/sobre",
  },
  {
    key: "seguranca-digital",
    label: "Segurança Digital",
    blurb:
      "Conjunto de práticas e políticas que protegem crianças de riscos online: grooming, sextorsão, deepfakes e exposição.",
    href: "/riscos-online",
  },
  {
    key: "educacao-preventiva",
    label: "Educação Preventiva",
    blurb:
      "Estratégia central para reduzir a violência sexual: capacita famílias, escolas e profissionais a identificar sinais e agir cedo.",
    href: "/escolas",
  },
  {
    key: "rede-protecao",
    label: "Rede de Proteção",
    blurb:
      "Articulação entre Conselho Tutelar, CREAS, Disque 100, Ministério Público e Polícia para encaminhar denúncias e casos.",
    href: "/mapa",
  },
];

export const contextByKey: Record<string, NationalContextItem> = Object.fromEntries(
  nationalContext.map((c) => [c.key, c]),
);

export function getContextByKeys(keys?: string[] | null): NationalContextItem[] {
  if (!keys?.length) return [];
  return keys.map((k) => contextByKey[k]).filter(Boolean) as NationalContextItem[];
}
