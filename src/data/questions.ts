import { Question, MountainCamp } from '../types';

export const MOUNTAIN_CAMPS: MountainCamp[] = [
  {
    level: 0,
    name: "Acampamento Base da Qualidade",
    altitude: 0,
    xPercent: 10,
    yPercent: 88,
    zone: 'base',
    description: "Início da expedição. Preparando pranchetas, checklists e ferramentas para a jornada de melhoria contínua."
  },
  {
    level: 1,
    name: "Posto Seiri - Triagem & Descarte",
    altitude: 330,
    xPercent: 18,
    yPercent: 80,
    zone: 'base',
    description: "Primeiro desafio de 5S. Identificação e descarte de ferramentas quebradas e sem uso."
  },
  {
    level: 2,
    name: "Platô Seiton - Identificação & Armazenamento",
    altitude: 660,
    xPercent: 28,
    yPercent: 72,
    zone: 'base',
    description: "Segundo desafio de 5S. Definição de local identificado para cada ferramenta após manutenção."
  },
  {
    level: 3,
    name: "Refúgio Shitsuke - Autodisciplina Diária",
    altitude: 1000,
    xPercent: 38,
    yPercent: 64,
    zone: 'base',
    description: "Conclusão do 5S. Procedimentos seguidos diariamente sem necessidade de cobrança constante."
  },
  {
    level: 4,
    name: "Garganta dos Limites de Controle",
    altitude: 1330,
    xPercent: 48,
    yPercent: 56,
    zone: 'rock',
    description: "Início de Carta de Controle. Avaliação de processo fora de controle (96°C contra 70-90°C)."
  },
  {
    level: 5,
    name: "Paredão da Estabilidade do Processo",
    altitude: 1660,
    xPercent: 42,
    yPercent: 47,
    zone: 'rock',
    description: "Segundo desafio de Carta de Controle. Identificar desvios e monitorar a estabilidade do processo."
  },
  {
    level: 6,
    name: "Mirante das Tendências & CEP",
    altitude: 2000,
    xPercent: 56,
    yPercent: 39,
    zone: 'rock',
    description: "Conclusão de Carta de Controle. Tendência contínua de aumento de vibração e investigação preventiva."
  },
  {
    level: 7,
    name: "Aresta de Ishikawa - Mapeamento de Causas",
    altitude: 2330,
    xPercent: 65,
    yPercent: 30,
    zone: 'ice',
    description: "Primeiro desafio de Ishikawa. Identificar e organizar possíveis causas de um problema."
  },
  {
    level: 8,
    name: "Fenda da Mão de Obra & Capacitação",
    altitude: 2660,
    xPercent: 58,
    yPercent: 20,
    zone: 'ice',
    description: "Segundo desafio de Ishikawa. Alocação de falta de treinamento de operadores na categoria Mão de Obra."
  },
  {
    level: 9,
    name: "Cume da Qualidade & Causa Raiz",
    altitude: 3000,
    xPercent: 50,
    yPercent: 7,
    zone: 'summit',
    description: "O topo absoluto da montanha da qualidade (3000m)! Análise ampla dos 6M para encontrar a causa raiz."
  }
];

export const QUESTIONS: Question[] = [
  // ==========================================
  // BLOCO 1: QUESTÕES SOBRE 5S
  // ==========================================
  {
    id: 1,
    title: "Questão 1: Setor de Manutenção e Ferramentas Quebradas",
    concept: "5S: Senso de Utilização (Seiri)",
    levelName: "Posto Seiri - Triagem & Descarte (330m)",
    altitude: 330,
    difficulty: "Iniciante",
    text: "Em um setor de manutenção, diversas ferramentas quebradas e sem uso estão ocupando espaço nas bancadas. Qual senso do 5S deve ser aplicado primeiro?",
    options: [
      "Seiton (Organização)",
      "Seiri (Utilização)",
      "Seisou (Limpeza)"
    ],
    answer: 1,
    formula: "Regra Seiri: Separar o Útil do Inútil e Descarte",
    formulaHint: "O primeiro passo do 5S consiste em descartar o que está quebrado ou sem utilidade para desocupar as bancadas.",
    explanation: "Gabarito: B. O senso de Seiri (Utilização) tem como objetivo principal triar e descartar aquilo que não tem mais utilidade ou está quebrado, liberando espaço nas bancadas antes de organizar ou limpar."
  },
  {
    id: 2,
    title: "Questão 2: Local Identificado para Armazenamento",
    concept: "5S: Senso de Organização (Seiton)",
    levelName: "Platô Seiton - Identificação & Armazenamento (660m)",
    altitude: 660,
    difficulty: "Iniciante",
    text: "Após a manutenção de uma máquina, cada ferramenta recebeu um local identificado para armazenamento. Qual senso está sendo praticado?",
    options: [
      "Seiton (Organização)",
      "Seiketsu (Padronização)",
      "Shitsuke (Disciplina)"
    ],
    answer: 0,
    formula: "Regra Seiton: Um Lugar para Cada Coisa",
    formulaHint: "Definir locais identificados e de fácil localização para cada item é a essência deste senso.",
    explanation: "Gabarito: A. O Seiton (Organização) busca ordenar os recursos estabelecendo locais identificados e demarcados para cada item ('um lugar para cada coisa e cada coisa em seu lugar')."
  },
  {
    id: 3,
    title: "Questão 3: Procedimentos Diários sem Cobrança Constante",
    concept: "5S: Senso de Disciplina (Shitsuke)",
    levelName: "Refúgio Shitsuke - Autodisciplina Diária (1000m)",
    altitude: 1000,
    difficulty: "Intermediário",
    text: "Em uma fábrica, os colaboradores seguem diariamente os procedimentos de organização e limpeza sem necessidade de cobrança constante. Qual senso está sendo demonstrado?",
    options: [
      "Shitsuke (Disciplina)",
      "Seiri (Utilização)",
      "Seisou (Limpeza)"
    ],
    answer: 0,
    formula: "Regra Shitsuke: Hábito e Autodisciplina",
    formulaHint: "Quando os padrões são seguidos por iniciativa própria sem necessidade de supervisores cobrarem.",
    explanation: "Gabarito: A. O Shitsuke (Disciplina/Autodisciplina) é alcançado quando a organização e a limpeza tornam-se um hábito voluntário e natural praticado diariamente por todos os colaboradores."
  },

  // ==========================================
  // BLOCO 2: QUESTÕES SOBRE CARTA DE CONTROLE
  // ==========================================
  {
    id: 4,
    title: "Questão 4: Temperatura da Bomba Acima da Faixa",
    concept: "Carta de Controle: Processo Fora de Controle",
    levelName: "Garganta dos Limites de Controle (1330m)",
    altitude: 1330,
    difficulty: "Intermediário",
    text: "Uma bomba opera normalmente entre 70°C e 90°C. Durante uma inspeção foi registrada temperatura de 96°C. O que isso indica?",
    options: [
      "Processo sob controle",
      "Processo fora de controle",
      "Resultado esperado"
    ],
    answer: 1,
    formula: "Critério de Controle: Medição > Limite Superior de Controle (LSC)",
    formulaHint: "A temperatura registrada (96°C) ultrapassou o limite operacional máximo normal de 90°C.",
    explanation: "Gabarito: B. Como o valor registrado (96°C) ultrapassou o limite superior da operação normal (90°C), isso indica que o processo está fora de controle e sofreu a ação de uma causa especial."
  },
  {
    id: 5,
    title: "Questão 5: Principal Objetivo da Carta de Controle",
    concept: "Carta de Controle: Monitorar Estabilidade e Identificar Desvios",
    levelName: "Paredão da Estabilidade do Processo (1660m)",
    altitude: 1660,
    difficulty: "Intermediário",
    text: "Qual é o principal objetivo da Carta de Controle?",
    options: [
      "Identificar desvios e monitorar a estabilidade do processo",
      "Organizar documentos da manutenção",
      "Reduzir o estoque de peças"
    ],
    answer: 0,
    formula: "CEP: Controle Estatístico de Processo",
    formulaHint: "A Carta de Controle acompanha a variação temporal para detectar anomalias no processo.",
    explanation: "Gabarito: A. A Carta de Controle (criada por Shewhart) é uma ferramenta gráfica do CEP cujo objetivo essencial é monitorar a estabilidade estatística do processo e identificar desvios ao longo do tempo."
  },
  {
    id: 6,
    title: "Questão 6: Aumento Contínuo de Vibração",
    concept: "Carta de Controle: Tendência e Ação Preventiva",
    levelName: "Mirante das Tendências & CEP (2000m)",
    altitude: 2000,
    difficulty: "Avançado",
    text: "Uma sequência de medições apresenta aumento contínuo de vibração, mesmo sem ultrapassar os limites de controle. O que a equipe deve fazer?",
    options: [
      "Ignorar a tendência",
      "Investigar a causa e continuar monitorando",
      "Trocar imediatamente o equipamento"
    ],
    answer: 1,
    formula: "Padrão Não Aleatório: Tendência de Subida Contínua",
    formulaHint: "Uma tendência de subida contínua não deve ser ignorada, pois aponta desgaste ou alteração progressiva.",
    explanation: "Gabarito: B. Uma sequência contínua de aumento constitui um padrão de tendência não aleatório no gráfico de controle. A equipe deve investigar a causa raiz antes que ocorra a falha, continuando o monitoramento."
  },

  // ==========================================
  // BLOCO 3: QUESTÕES SOBRE DIAGRAMA DE ISHIKAWA
  // ==========================================
  {
    id: 7,
    title: "Questão 7: Principal Objetivo do Diagrama de Ishikawa",
    concept: "Diagrama de Ishikawa: Identificar e Organizar Causas",
    levelName: "Aresta de Ishikawa - Mapeamento de Causas (2330m)",
    altitude: 2330,
    difficulty: "Intermediário",
    text: "Qual é o principal objetivo do Diagrama de Ishikawa?",
    options: [
      "Identificar e organizar possíveis causas de um problema",
      "Controlar estatisticamente um processo",
      "Priorizar os problemas mais frequentes"
    ],
    answer: 0,
    formula: "Diagrama de Causa e Efeito (Kaoru Ishikawa)",
    formulaHint: "A estrutura de espinha de peixe ramifica as hipóteses que geram o efeito investigado.",
    explanation: "Gabarito: A. O Diagrama de Ishikawa (também chamado de espinha de peixe ou causa e efeito) tem como objetivo principal levantar, categorizar e organizar visualmente todas as possíveis causas de um determinado problema."
  },
  {
    id: 8,
    title: "Questão 8: Falta de Treinamento dos Operadores",
    concept: "Diagrama de Ishikawa: Categoria Mão de Obra",
    levelName: "Fenda da Mão de Obra & Capacitação (2660m)",
    altitude: 2660,
    difficulty: "Avançado",
    text: "No Diagrama de Ishikawa, qual categoria está relacionada à falta de treinamento dos operadores?",
    options: [
      "Máquina",
      "Método",
      "Mão de Obra"
    ],
    answer: 2,
    formula: "Categorias dos 6M: Mão de Obra (Fator Humano)",
    formulaHint: "Treinamento, capacitação técnica e habilidades dos operadores envolvem as pessoas do processo.",
    explanation: "Gabarito: C. No método dos 6M do Ishikawa, a categoria 'Mão de Obra' contempla os fatores humanos, incluindo capacitação, treinamento, atenção e habilidades da equipe de operação."
  },
  {
    id: 9,
    title: "Questão 9: Atrasos na Produção e Análise dos Fatores",
    concept: "Diagrama de Ishikawa: Busca pela Causa Raiz",
    levelName: "Cume da Qualidade & Causa Raiz (3000m)",
    altitude: 3000,
    difficulty: "Estratégico",
    text: "Uma empresa identificou atrasos frequentes na produção. Ao utilizar o Diagrama de Ishikawa, a equipe analisa fatores relacionados a Máquina, Método, Material, Mão de Obra, Medição e Meio Ambiente. Essa abordagem busca:",
    options: [
      "Encontrar a causa raiz do problema",
      "Calcular a produtividade da equipe",
      "Elaborar um cronograma de manutenção"
    ],
    answer: 0,
    formula: "Abordagem Sistemática dos 6M para Causa Raiz",
    formulaHint: "A análise exaustiva das categorias de causa visa descobrir a fonte geradora do problema para eliminá-la.",
    explanation: "Gabarito: A. A análise detalhada dos fatores pelo Diagrama de Ishikawa busca investigar o processo de forma holística para encontrar a verdadeira causa raiz do problema, viabilizando soluções definitivas."
  }
];
