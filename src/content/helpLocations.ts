export type HelpType =
  | "conselho_tutelar"
  | "delegacia"
  | "creas"
  | "cras"
  | "mp"
  | "disque";

export interface HelpLocation {
  name: string;
  type: HelpType;
  state: string; // UF
  city: string;
  address?: string;
  phone?: string;
  hours?: string;
  officialUrl?: string;
}

/**
 * Lista inicial verificada de serviços públicos de proteção.
 * Fontes: portais oficiais das Secretarias de Segurança Pública estaduais,
 * Conselhos Tutelares municipais e Ministério dos Direitos Humanos.
 * Última verificação: 2025-11-15. Para adicionar novas cidades, basta acrescentar
 * objetos a este array.
 */
export const helpLocations: HelpLocation[] = [
  // Disque nacional (sempre presente)
  {
    name: "Disque 100 — Disque Direitos Humanos",
    type: "disque",
    state: "BR",
    city: "Nacional",
    phone: "100",
    hours: "24 horas, gratuito e anônimo",
    officialUrl: "https://www.gov.br/mdh/pt-br/disque100",
  },
  // SP
  {
    name: "DECRADI — Delegacia de Crimes Raciais e Delitos de Intolerância",
    type: "delegacia",
    state: "SP",
    city: "São Paulo",
    address: "Rua Brigadeiro Tobias, 527 — Centro",
    phone: "(11) 3311-3555",
    hours: "Seg–Sex, 8h–18h",
    officialUrl: "https://www.policiacivil.sp.gov.br/",
  },
  {
    name: "DPCA — Delegacia de Proteção à Criança e ao Adolescente (SP)",
    type: "delegacia",
    state: "SP",
    city: "São Paulo",
    address: "Av. Zaki Narchi, 152 — Vila Guilherme",
    phone: "(11) 2221-7030",
    hours: "Seg–Sex, 9h–18h",
    officialUrl: "https://www.policiacivil.sp.gov.br/",
  },
  {
    name: "Conselho Tutelar — Sé (SP capital)",
    type: "conselho_tutelar",
    state: "SP",
    city: "São Paulo",
    phone: "156",
    officialUrl: "https://www.prefeitura.sp.gov.br/cidade/secretarias/direitos_humanos/crianca_e_adolescente/conselhos_tutelares/",
  },
  // RJ
  {
    name: "DPCA — Delegacia de Proteção à Criança e ao Adolescente (RJ)",
    type: "delegacia",
    state: "RJ",
    city: "Rio de Janeiro",
    address: "Rua do Lavradio, 155 — Centro",
    phone: "(21) 2332-2745",
    hours: "24 horas",
    officialUrl: "https://www.policiacivilrj.net.br/",
  },
  {
    name: "Conselho Tutelar do Rio de Janeiro",
    type: "conselho_tutelar",
    state: "RJ",
    city: "Rio de Janeiro",
    phone: "1746",
    officialUrl: "https://www.rio.gov.br/web/smasdh/exibeconteudo?id=2806061",
  },
  // MG
  {
    name: "DEPCA — Delegacia Especializada de Proteção à Criança e ao Adolescente (BH)",
    type: "delegacia",
    state: "MG",
    city: "Belo Horizonte",
    address: "Av. Nossa Senhora do Carmo, 472 — Sion",
    phone: "(31) 3330-8950",
    hours: "24 horas",
    officialUrl: "https://www.policiacivil.mg.gov.br/",
  },
  {
    name: "Conselho Tutelar de Belo Horizonte",
    type: "conselho_tutelar",
    state: "MG",
    city: "Belo Horizonte",
    phone: "156",
    officialUrl: "https://prefeitura.pbh.gov.br/smasac/sudc/conselho-tutelar",
  },
  // DF
  {
    name: "DPCA — Delegacia de Proteção à Criança e ao Adolescente (DF)",
    type: "delegacia",
    state: "DF",
    city: "Brasília",
    address: "SAIN Lote A — Asa Norte",
    phone: "(61) 3207-6172",
    hours: "24 horas",
    officialUrl: "https://www.pcdf.df.gov.br/",
  },
  // RS
  {
    name: "DECA — Delegacia da Criança e do Adolescente (Porto Alegre)",
    type: "delegacia",
    state: "RS",
    city: "Porto Alegre",
    address: "Av. Cristóvão Colombo, 1675",
    phone: "(51) 3288-9692",
    officialUrl: "https://www.pc.rs.gov.br/",
  },
  // BA
  {
    name: "DERCCA — Delegacia de Repressão a Crimes Contra a Criança e o Adolescente (BA)",
    type: "delegacia",
    state: "BA",
    city: "Salvador",
    phone: "(71) 3117-6711",
    officialUrl: "https://www.pc.ba.gov.br/",
  },
  // PR
  {
    name: "NUCRIA — Núcleo de Proteção à Criança e ao Adolescente (Curitiba)",
    type: "delegacia",
    state: "PR",
    city: "Curitiba",
    phone: "(41) 3270-1170",
    officialUrl: "https://www.policiacivil.pr.gov.br/",
  },
  // PE
  {
    name: "DPCA — Delegacia de Polícia da Criança e do Adolescente (Recife)",
    type: "delegacia",
    state: "PE",
    city: "Recife",
    phone: "(81) 3184-3450",
    officialUrl: "https://www.policiacivil.pe.gov.br/",
  },
  // CE
  {
    name: "DCA — Delegacia da Criança e do Adolescente Vítima (Fortaleza)",
    type: "delegacia",
    state: "CE",
    city: "Fortaleza",
    phone: "(85) 3101-0327",
    officialUrl: "https://www.policiacivil.ce.gov.br/",
  },
];

export const ufList = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA",
  "PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
] as const;
