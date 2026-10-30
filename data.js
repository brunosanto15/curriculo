// ============================================================
//  SEUS DADOS — edite apenas este arquivo.
// ============================================================

window.CV = {
  nome: "Bruno Santopietro Pousa Machado",
  titulo: "Ciências Econômicas (UFRJ) · Estagiário de Alocação na InvestSmartXP",
  localizacao: "Rio de Janeiro, RJ",
  foto: "img/bruno.jpg", // vazio = mostra as iniciais

  // Topo da página
  chamada: "Economia na teoria. Alocação na prática.",
  resumo:
    "Estudante de Ciências Econômicas na UFRJ e estagiário de alocação na InvestSmartXP. Apoio a construção e o acompanhamento de carteiras alinhadas ao perfil de risco e aos objetivos de cada cliente.",
  status: "Hoje no time de alocação da InvestSmartXP",

  // Frases que aparecem "digitando" no card do topo
  frases: [
    "Alocação de ativos",
    "Gestão de carteiras",
    "Economia & inteligência artificial"
  ],

  // Links que contêm "[" são ocultados até você preencher
  links: {
    linkedin: "https://www.linkedin.com/in/bruno-santopietro-machado/",
    github: "https://github.com/brunosantopietro",
    email: "brunosanto1510@gmail.com",
    whatsapp: "5521999298376", // só números, com DDI 55 e DDD
    whatsappMensagem: "Olá, Bruno! Vim pelo seu portfólio e queria conversar."
  },

  // Card em estilo terminal no topo (chave → valor)
  ficha: [
    { k: "cargo", v: "Estagiário de Alocação" },
    { k: "casa", v: "InvestSmartXP" },
    { k: "curso", v: "Ciências Econômicas · UFRJ" },
    { k: "cr", v: "8,0" },
    { k: "certificações", v: "CPA · ANCORD" },
    { k: "idiomas", v: "PT · EN · ES" }
  ],

  // Texto da seção "Sobre" (as palavras acendem conforme a pessoa rola a página)
  sobre:
    "Estudante de Ciências Econômicas na UFRJ, atuando como Estagiário de Alocação na InvestSmartXP, com experiência em construção e acompanhamento de carteiras, análise de produtos financeiros e suporte à decisão de alocação de ativos. Certificado pela ANBIMA (CPA) e pela ANCORD. Vivência prévia em controle financeiro e gestão de projetos, com domínio de fluxo de caixa, DRE e análise de resultados.",

  // Ficha rápida exibida abaixo do texto "Sobre"
  fatos: [
    { k: "Atuação", v: "Estagiário de Alocação · InvestSmartXP" },
    { k: "Formação", v: "Ciências Econômicas · UFRJ · 6º período" },
    { k: "Certificações", v: "CPA (ANBIMA) · ANCORD" },
    { k: "Base", v: "Rio de Janeiro, RJ" }
  ],

  // "O que faço": cards que deslizam na horizontal. icone: alocacao, produtos, financas, projetos, ia
  capacidades: [
    { icone: "alocacao", titulo: "Alocação de ativos", texto: "Apoio à construção de carteiras alinhadas ao perfil de risco e aos objetivos de cada cliente.", onde: "InvestSmartXP" },
    { icone: "produtos", titulo: "Análise de produtos", texto: "Análise de produtos financeiros como suporte à tomada de decisão de alocação.", onde: "InvestSmartXP" },
    { icone: "financas", titulo: "Controle financeiro", texto: "Fluxo de caixa, DRE e acompanhamento de pagamentos e obrigações financeiras.", onde: "Arena Center" },
    { icone: "projetos", titulo: "Gestão de projetos", texto: "Supervisão da implantação do site e do canal de e-commerce, com acompanhamento de indicadores.", onde: "Arena Center" },
    { icone: "ia", titulo: "Economia e IA", texto: "Estudo de inteligência artificial aplicada à economia e aos mercados.", onde: "Pré-Mestrado em IA" }
  ],

  // "Diferenciais": frase curta em negrito + complemento
  diferenciais: [
    { titulo: "Certificado para o mercado.", texto: "CPA (ANBIMA) e ANCORD, de Assessor de Investimento" },
    { titulo: "Base acadêmica sólida.", texto: "CR acumulado de 8,0 em Ciências Econômicas na UFRJ" },
    { titulo: "Finanças na prática.", texto: "quase dois anos cuidando de fluxo de caixa, DRE e pagamentos na Arena Center" },
    { titulo: "Comunicação em três idiomas.", texto: "português nativo, inglês fluente e espanhol intermediário" }
  ],

  // Números de destaque (animam quando aparecem na tela)
  numeros: [
    { valor: 8.0, casas: 1, sufixo: "", rotulo: "CR acumulado na UFRJ", link: "#formacao", acao: "ver formação" },
    { valor: 2, sufixo: "+", rotulo: "anos de experiência profissional", link: "#experiencia", acao: "ver experiência" },
    { valor: 2, sufixo: "", rotulo: "certificações do mercado (CPA e ANCORD)", link: "#certificados", acao: "ver certificações" },
    { valor: 3, sufixo: "", rotulo: "idiomas", link: "#diferenciais", acao: "ver idiomas" }
  ],

  // Experiência — do mais recente para o mais antigo (cada uma vira uma aba)
  experiencias: [
    {
      cargo: "Estagiário de Alocação",
      empresa: "InvestSmartXP",
      periodo: "jul/2026 – atual",
      local: "Rio de Janeiro, RJ",
      descricao: "Apoio ao time de alocação na gestão das carteiras de investimentos de clientes.",
      destaques: [
        "Apoio à construção e ao acompanhamento de carteiras de investimentos de clientes.",
        "Análise de produtos financeiros e suporte à tomada de decisão de alocação de ativos.",
        "Alinhamento das carteiras ao perfil de risco e aos objetivos de cada cliente."
      ],
      tags: ["Alocação de ativos", "Gestão de carteiras", "Produtos financeiros", "Perfil de risco"]
    },
    {
      cargo: "Auxiliar Administrativo e Controle Financeiro",
      empresa: "Arena Center",
      periodo: "mar/2024 – dez/2025",
      local: "Rio de Janeiro, RJ · Meio período / híbrido",
      descricao: "Empresa do setor de decoração e utilidades.",
      destaques: [
        "Monitoramento e execução de todos os pagamentos e obrigações financeiras.",
        "Organização e execução do fluxo de caixa e do DRE, assegurando visibilidade sobre a saúde financeira e a performance do negócio.",
        "Gerenciamento de projetos operacionais, incluindo a supervisão da implantação do site e do canal de e-commerce.",
        "Monitoramento contínuo de indicadores para manter a eficiência operacional e a satisfação dos clientes."
      ],
      tags: ["Fluxo de caixa", "DRE", "Relatórios financeiros", "Gestão de projetos", "Indicadores (KPIs)", "E-commerce"]
    }
  ],

  formacao: [
    {
      curso: "Bacharelado em Ciências Econômicas",
      instituicao: "Universidade Federal do Rio de Janeiro (UFRJ)",
      periodo: "mar/2024 – dez/2027 (previsto)",
      descricao: "6º período · CR acumulado: 8,0"
    },
    {
      curso: "Texas Tech University High School Course",
      instituicao: "Texas Tech University",
      periodo: "fev/2020 – nov/2023",
      descricao: ""
    },
    {
      curso: "Ensino Fundamental e Médio",
      instituicao: "Colégio Santo Agostinho, Novo Leblon",
      periodo: "fev/2013 – nov/2023",
      descricao: ""
    }
  ],

  // Quem tem "imagem" aparece em destaque, com miniatura que amplia ao clicar; o resto fica em "ver mais".
  // Para adicionar um certificado: salve o JPG em img/certs/ e preencha "imagem".
  certificacoes: [
    { nome: "CPA — Certificação Profissional ANBIMA", emissor: "ANBIMA", ano: "", detalhe: "Distribuição de produtos de investimento", imagem: "img/certs/cpa.jpg" },
    { nome: "Certificação ANCORD — Assessor de Investimento (AAI)", emissor: "ANCORD", ano: "ago/2026", detalhe: "Exame de Qualificação Técnica para Assessor de Investimento", imagem: "img/certs/ancord.jpg" },
    { nome: "Pré-Mestrado Internacional em Inteligência Artificial", emissor: "Magno Maciel e Faculdade HUB", ano: "mar/2026", detalhe: "", imagem: "img/certs/pre-mestrado-ia.jpg" },
    { nome: "Institute for Academic and Professional Studies (IAPS)", emissor: "University of Pennsylvania", ano: "", detalhe: "Habilidades acadêmicas e comunicação profissional em inglês", imagem: "img/certs/upenn-iaps.jpg" },
    { nome: "Método Gestão Inteligente", emissor: "", ano: "", detalhe: "" }
  ],

  // Competências em formato de etiqueta (também rodam no letreiro)
  competencias: [
    "CPA ANBIMA", "ANCORD", "Alocação de ativos", "Gestão de carteiras", "Produtos financeiros", "Perfil de risco",
    "Fluxo de caixa", "DRE", "Relatórios financeiros", "Inteligência artificial",
    "Gestão de projetos", "Indicadores (KPIs)", "E-commerce"
  ],

  // Idiomas — a barra se preenche até "nivel" (0 a 100); "rotulo" é o texto exibido
  idiomas: [
    { idioma: "Português", rotulo: "Nativo", nivel: 100 },
    { idioma: "Inglês", rotulo: "Fluente", nivel: 90 },
    { idioma: "Espanhol", rotulo: "Intermediário", nivel: 55 }
  ],

  contato:
    "Para falar sobre mercado financeiro, alocação de ativos ou oportunidades, me chame no WhatsApp ou por e-mail."
};
