/**
 * Catálogo de leis e artigos referenciados pelo conteúdo editorial.
 * Cada chave (`slug`) é selecionável no editor via `related_laws`.
 * Resumos são curtos, em linguagem acessível, e nunca substituem o texto oficial.
 */

export interface LawItem {
  slug: string;
  label: string;
  shortLabel: string;
  summary: string;
  url: string;
  category: "ECA" | "Penal" | "Civil" | "Digital" | "Específica";
}

export const laws: LawItem[] = [
  {
    slug: "eca-art-5",
    label: "ECA — Art. 5º (Proteção integral)",
    shortLabel: "ECA Art. 5º",
    summary:
      "Nenhuma criança ou adolescente será objeto de qualquer forma de negligência, discriminação, exploração, violência, crueldade e opressão. Toda violação é punida na forma da lei.",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
    category: "ECA",
  },
  {
    slug: "eca-art-17",
    label: "ECA — Art. 17 (Direito ao respeito e dignidade)",
    shortLabel: "ECA Art. 17",
    summary:
      "Garante a preservação da imagem, identidade, autonomia, valores e dos espaços e objetos pessoais da criança e do adolescente.",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
    category: "ECA",
  },
  {
    slug: "eca-art-18",
    label: "ECA — Art. 18 (Dever coletivo)",
    shortLabel: "ECA Art. 18",
    summary:
      "É dever de todos velar pela dignidade da criança e do adolescente, pondo-os a salvo de qualquer tratamento desumano, violento, aterrorizante, vexatório ou constrangedor.",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
    category: "ECA",
  },
  {
    slug: "eca-art-227",
    label: "Constituição Federal — Art. 227 (Prioridade absoluta)",
    shortLabel: "CF Art. 227",
    summary:
      "É dever da família, da sociedade e do Estado assegurar, com absoluta prioridade, os direitos da criança e do adolescente e colocá-los a salvo de toda forma de negligência, violência, crueldade e opressão.",
    url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
    category: "ECA",
  },
  {
    slug: "eca-art-240",
    label: "ECA — Art. 240 (Produção de material de abuso)",
    shortLabel: "ECA Art. 240",
    summary:
      "Produzir, reproduzir, dirigir, fotografar, filmar ou registrar cena de sexo explícito ou pornográfica envolvendo criança ou adolescente. Pena: 4 a 8 anos de reclusão e multa.",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
    category: "ECA",
  },
  {
    slug: "eca-art-241a",
    label: "ECA — Art. 241-A (Divulgação online)",
    shortLabel: "ECA Art. 241-A",
    summary:
      "Oferecer, trocar, disponibilizar, transmitir, distribuir, publicar ou divulgar por qualquer meio, inclusive sistema de informática, material de abuso sexual infantil. Pena: 3 a 6 anos.",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
    category: "ECA",
  },
  {
    slug: "eca-art-241d",
    label: "ECA — Art. 241-D (Aliciamento / grooming)",
    shortLabel: "ECA Art. 241-D",
    summary:
      "Aliciar, assediar, instigar ou constranger, por qualquer meio de comunicação, criança com o fim de com ela praticar ato libidinoso. Pena: 1 a 3 anos.",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
    category: "ECA",
  },
  {
    slug: "cp-art-217a",
    label: "Código Penal — Art. 217-A (Estupro de vulnerável)",
    shortLabel: "CP Art. 217-A",
    summary:
      "Ter conjunção carnal ou praticar outro ato libidinoso com menor de 14 anos. Pena: 8 a 15 anos de reclusão. Independe de consentimento.",
    url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm",
    category: "Penal",
  },
  {
    slug: "cp-art-218b",
    label: "Código Penal — Art. 218-B (Exploração sexual)",
    shortLabel: "CP Art. 218-B",
    summary:
      "Submeter, induzir ou atrair à prostituição ou outra forma de exploração sexual alguém menor de 18 anos. Pena: 4 a 10 anos de reclusão.",
    url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm",
    category: "Penal",
  },
  {
    slug: "lei-13431",
    label: "Lei 13.431/2017 — Escuta especializada",
    shortLabel: "Lei 13.431",
    summary:
      "Estabelece sistema de garantia de direitos da criança e do adolescente vítima ou testemunha de violência, com escuta especializada e depoimento especial para evitar revitimização.",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13431.htm",
    category: "Específica",
  },
  {
    slug: "lei-14811",
    label: "Lei 14.811/2024 — Bullying e cyberbullying",
    shortLabel: "Lei 14.811",
    summary:
      "Torna o bullying e o cyberbullying crimes específicos quando praticados de forma sistemática, e institui política nacional de prevenção da violência nas escolas.",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14811.htm",
    category: "Específica",
  },
  {
    slug: "lei-15211",
    label: "Lei 15.211/2025 — ECA Digital",
    shortLabel: "ECA Digital",
    summary:
      "Estabelece obrigações para plataformas digitais na proteção de crianças e adolescentes, inclusive contra adultização, exposição e exploração comercial.",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm",
    category: "Digital",
  },
  {
    slug: "marco-civil",
    label: "Marco Civil da Internet (Lei 12.965/2014)",
    shortLabel: "Marco Civil",
    summary:
      "Estabelece princípios, garantias e deveres para o uso da internet no Brasil, incluindo proteção de dados de crianças e dever de provedores.",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm",
    category: "Digital",
  },
  {
    slug: "lgpd-art-14",
    label: "LGPD — Art. 14 (Dados de crianças)",
    shortLabel: "LGPD Art. 14",
    summary:
      "O tratamento de dados pessoais de crianças e adolescentes deverá ser realizado em seu melhor interesse, com consentimento específico do responsável.",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    category: "Digital",
  },
];

export const lawsBySlug: Record<string, LawItem> = Object.fromEntries(laws.map((l) => [l.slug, l]));

export function getLawsBySlugs(slugs?: string[] | null): LawItem[] {
  if (!slugs?.length) return [];
  return slugs.map((s) => lawsBySlug[s]).filter(Boolean) as LawItem[];
}
