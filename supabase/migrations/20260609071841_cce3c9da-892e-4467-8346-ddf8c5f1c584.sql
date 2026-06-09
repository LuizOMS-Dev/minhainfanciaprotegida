UPDATE public.articles SET timeline = '[
  {"date":"1990-07-13","kind":"event","title":"Promulgação do ECA","text":"Sancionada a Lei nº 8.069/1990, consagrando a doutrina da proteção integral."},
  {"date":"2014-06-26","kind":"milestone","title":"Lei Menino Bernardo","text":"Lei 13.010/2014 proíbe castigos físicos e tratamentos cruéis a crianças e adolescentes."},
  {"date":"2017-04-04","kind":"milestone","title":"Escuta especializada","text":"Lei 13.431/2017 cria sistema de garantia de direitos para vítimas e testemunhas."},
  {"date":"2022-05-24","kind":"milestone","title":"Lei Henry Borel","text":"Lei 14.344/2022 amplia medidas protetivas de urgência."},
  {"date":"2024-01-12","kind":"milestone","title":"Bullying como crime","text":"Lei 14.811/2024 tipifica bullying e cyberbullying e endurece penas."},
  {"date":"2025-07-13","kind":"milestone","title":"35 anos do ECA","text":"Marco com balanço de avanços e desafios em aberto."}
]'::jsonb WHERE slug = 'eca-35-anos-lei-8069';

UPDATE public.articles SET timeline = '[
  {"date":"1973-05-18","kind":"event","title":"Caso Araceli","text":"Menina de 8 anos é assassinada em Vitória (ES). Caso se torna símbolo nacional."},
  {"date":"2000-05-18","kind":"milestone","title":"Dia Nacional","text":"Instituído o Dia Nacional de Combate ao Abuso e à Exploração Sexual."},
  {"date":"2013-05-18","kind":"milestone","title":"Selo Maio Laranja","text":"Campanha ganha identidade visual e mobilização integrada."},
  {"date":"2024-05-18","kind":"milestone","title":"Mobilização nacional","text":"Edição com participação recorde de municípios e escolas."}
]'::jsonb WHERE slug = 'maio-laranja-18-de-maio-mobilizacao-nacional';

UPDATE public.articles SET timeline = '[
  {"date":"2018-01-01","kind":"event","title":"Boom dos jogos online","text":"Roblox, Fortnite e Discord tornam-se populares entre crianças."},
  {"date":"2020-03-01","kind":"milestone","title":"Pandemia amplia exposição","text":"Tempo de tela disparou e denúncias de aliciamento cresceram."},
  {"date":"2023-06-01","kind":"milestone","title":"SaferNet alerta","text":"Relatórios apontam aumento expressivo de grooming em jogos."},
  {"date":"2025-04-10","kind":"milestone","title":"Guia de prevenção","text":"Consolidação de orientações para famílias e escolas."}
]'::jsonb WHERE slug = 'grooming-jogos-online-aliciamento-criancas';

UPDATE public.articles SET timeline = '[
  {"date":"2005-01-01","kind":"event","title":"Criação da SaferNet","text":"Primeira ONG do hemisfério sul para direitos humanos na internet."},
  {"date":"2006-03-15","kind":"milestone","title":"Central de Denúncias","text":"Lançamento da central que processa denúncias de crimes cibernéticos."},
  {"date":"2023-01-01","kind":"milestone","title":"71 mil denúncias","text":"Período de 12 meses registra mais de 71 mil denúncias de CSAM."},
  {"date":"2025-02-08","kind":"milestone","title":"Balanço público","text":"Dados consolidados em relatório anual da SaferNet."}
]'::jsonb WHERE slug = 'safernet-brasil-denuncias-conteudo-csam';

UPDATE public.articles SET timeline = '[
  {"date":"2018-12-01","kind":"event","title":"Lei das Bets","text":"Lei 13.756/2018 regulamenta apostas de quota fixa no Brasil."},
  {"date":"2023-12-29","kind":"milestone","title":"Regulamentação","text":"Lei 14.790/2023 detalha o mercado e estabelece proteções."},
  {"date":"2024-09-01","kind":"milestone","title":"CPI das Bets","text":"Senado instala CPI para investigar impactos, inclusive sobre adolescentes."},
  {"date":"2024-11-26","kind":"event","title":"Alerta para jovens","text":"CPI aponta risco grave para adolescentes e propõe restrições."}
]'::jsonb WHERE slug = 'bets-impacto-adolescentes-cpi-senado';

UPDATE public.articles SET timeline = '[
  {"date":"2023-01-01","kind":"event","title":"Operações coordenadas","text":"PF intensifica ações contra pornografia infantil online."},
  {"date":"2024-05-01","kind":"milestone","title":"Cooperação internacional","text":"Parcerias com Interpol e NCMEC ampliam alcance das investigações."},
  {"date":"2024-08-22","kind":"event","title":"Operação Caçador","text":"PF deflagra operação com prisões e apreensões em múltiplos estados."}
]'::jsonb WHERE slug = 'operacao-cacador-pf-exploracao-sexual-infantil-online';

UPDATE public.articles SET timeline = '[
  {"date":"2014-04-04","kind":"event","title":"Desaparecimento","text":"Bernardo Boldrini, 11 anos, desaparece em Três Passos (RS)."},
  {"date":"2014-04-14","kind":"event","title":"Corpo encontrado","text":"Polícia localiza o corpo em Frederico Westphalen (RS)."},
  {"date":"2014-06-26","kind":"milestone","title":"Lei Menino Bernardo","text":"Sancionada a Lei 13.010/2014 contra castigos físicos."},
  {"date":"2018-05-23","kind":"milestone","title":"Condenação","text":"Madrasta e pai são condenados pelo homicídio."}
]'::jsonb WHERE slug = 'caso-bernardo-boldrini-lei-menino-bernardo';

UPDATE public.articles SET timeline = '[
  {"date":"1973-05-18","kind":"event","title":"Crime contra Araceli","text":"Araceli Crespo, 8 anos, é assassinada em Vitória (ES)."},
  {"date":"1980-08-01","kind":"milestone","title":"Réus absolvidos","text":"Absolvição gera indignação nacional."},
  {"date":"2000-05-18","kind":"milestone","title":"Dia Nacional","text":"Lei 9.970/2000 institui o 18 de maio como data nacional."},
  {"date":"2013-05-18","kind":"milestone","title":"Maio Laranja","text":"Consolidação da campanha em todo o país."}
]'::jsonb WHERE slug = 'caso-araceli-crespo-origem-18-maio';

UPDATE public.articles SET timeline = '[
  {"date":"1997-05-01","kind":"event","title":"Criação do Disque 100","text":"Canal nacional de denúncias de violações de direitos humanos."},
  {"date":"2003-09-01","kind":"milestone","title":"Reestruturação","text":"SDH/PR amplia foco em crianças e adolescentes."},
  {"date":"2014-01-01","kind":"milestone","title":"Integração ao SGD","text":"Atendimento articulado com Conselhos Tutelares e órgãos do SGD."},
  {"date":"2024-05-17","kind":"event","title":"100 mil denúncias/ano","text":"Balanço aponta mais de 100 mil denúncias anuais."}
]'::jsonb WHERE slug = 'disque-100-balanco-violacoes-criancas-adolescentes';

UPDATE public.articles SET timeline = '[
  {"date":"2011-04-07","kind":"event","title":"Massacre de Realengo","text":"Ataque na escola Tasso da Silveira (RJ) deixa 12 crianças mortas."},
  {"date":"2011-05-01","kind":"milestone","title":"Mobilização nacional","text":"Estados discutem segurança e saúde mental nas escolas."},
  {"date":"2019-01-01","kind":"milestone","title":"Protocolos atualizados","text":"MEC e estados publicam protocolos integrados de prevenção."},
  {"date":"2024-04-07","kind":"milestone","title":"13 anos do caso","text":"Retomada do debate sobre prevenção da violência escolar."}
]'::jsonb WHERE slug = 'massacre-realengo-protocolos-seguranca-escolar';

UPDATE public.articles SET timeline = '[
  {"date":"2008-03-29","kind":"event","title":"Morte de Isabella","text":"Isabella Nardoni, 5 anos, é arremessada do 6º andar em São Paulo."},
  {"date":"2010-03-26","kind":"milestone","title":"Condenações","text":"Pai e madrasta são condenados pelo júri popular."},
  {"date":"2011-01-01","kind":"milestone","title":"Mudanças na rede","text":"Caso impulsiona protocolos de notificação e ações intersetoriais."},
  {"date":"2024-03-29","kind":"milestone","title":"16 anos","text":"Memória do caso segue marcando a pressão por proteção integral."}
]'::jsonb WHERE slug = 'caso-isabella-nardoni-impacto-rede-protecao';

UPDATE public.articles SET timeline = '[
  {"date":"2021-03-08","kind":"event","title":"Morte de Henry Borel","text":"Henry, 4 anos, morre no Rio após agressões."},
  {"date":"2021-04-08","kind":"milestone","title":"Prisões","text":"Mãe e padrasto são presos preventivamente."},
  {"date":"2022-05-24","kind":"milestone","title":"Lei Henry Borel","text":"Lei 14.344/2022 cria medidas protetivas de urgência específicas."},
  {"date":"2024-04-15","kind":"milestone","title":"Condenação","text":"Padrasto é condenado pelo Tribunal do Júri."}
]'::jsonb WHERE slug = 'caso-henry-borel-lei-14344-medidas-protetivas';

UPDATE public.articles SET timeline = '[
  {"date":"2017-04-04","kind":"event","title":"Sanção da Lei 13.431","text":"Cria sistema de garantia de direitos para vítimas e testemunhas."},
  {"date":"2018-04-04","kind":"milestone","title":"Vigência","text":"Lei entra em vigor; estados começam a estruturar serviços."},
  {"date":"2019-10-09","kind":"milestone","title":"Regulamentação","text":"Decreto 9.603/2018 detalha escuta especializada e depoimento especial."},
  {"date":"2024-02-08","kind":"milestone","title":"Implementação avança","text":"Capacitação ampliada em conselhos, judiciário e saúde."}
]'::jsonb WHERE slug = 'lei-13431-escuta-especializada-depoimento-especial';

UPDATE public.articles SET timeline = '[
  {"date":"2023-04-01","kind":"event","title":"Ataques em escolas","text":"Sucessão de ataques acelera resposta legislativa."},
  {"date":"2024-01-12","kind":"event","title":"Lei 14.811/2024","text":"Sancionada lei que tipifica bullying e cyberbullying como crimes."},
  {"date":"2024-01-16","kind":"milestone","title":"Publicação no DOU","text":"Lei amplamente divulgada por redes de educação."},
  {"date":"2024-07-01","kind":"milestone","title":"Primeiras aplicações","text":"Casos chegam ao Judiciário; escolas adaptam regimentos."}
]'::jsonb WHERE slug = 'lei-14811-bullying-cyberbullying-crime';

UPDATE public.articles SET timeline = '[
  {"date":"2000-05-18","kind":"event","title":"Origem do Dia Nacional","text":"Lei 9.970/2000 institui o 18 de maio como data nacional."},
  {"date":"2013-05-18","kind":"milestone","title":"Campanha Maio Laranja","text":"Consolidação com identidade visual única."},
  {"date":"2024-05-18","kind":"milestone","title":"Mobilização ampliada","text":"Edição reforça combate à violência sexual contra crianças."}
]'::jsonb WHERE slug = 'maio-laranja-reforca-combate-a-violencia-sexual-contra-criancas-e-adolescentes';