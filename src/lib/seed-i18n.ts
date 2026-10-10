import type { ContentLocale, SettingsI18n, WorkI18n } from "./types";

/**
 * Portuguese, Spanish and Chinese versions of the seed content (base is English).
 * Sectors and the default location are mapped once; everything else is per work.
 */

type Tri<T> = Record<ContentLocale, T>;

export const DEFAULT_LOCATION: Tri<string> = {
  pt: "Novo Hamburgo, Brasil · Remoto",
  es: "Novo Hamburgo, Brasil · Remoto",
  zh: "巴西新汉堡 · 远程",
};

export const SECTORS: Record<string, Tri<string>> = {
  Banking: { pt: "Bancos", es: "Banca", zh: "银行" },
  Investments: { pt: "Investimentos", es: "Inversiones", zh: "投资" },
  Mobile: { pt: "Mobile", es: "Móvil", zh: "移动端" },
  Networking: { pt: "Networking", es: "Networking", zh: "人脉社交" },
  Events: { pt: "Eventos", es: "Eventos", zh: "活动" },
  Corporate: { pt: "Corporativo", es: "Corporativo", zh: "企业" },
  Healthcare: { pt: "Saúde", es: "Salud", zh: "医疗" },
  Pharma: { pt: "Farmacêutico", es: "Farmacéutico", zh: "制药" },
  Marketplace: { pt: "Marketplace", es: "Marketplace", zh: "电商平台" },
  SaaS: { pt: "SaaS", es: "SaaS", zh: "SaaS" },
  Fintech: { pt: "Fintech", es: "Fintech", zh: "金融科技" },
  Compliance: { pt: "Compliance", es: "Cumplimiento", zh: "合规" },
  Data: { pt: "Dados", es: "Datos", zh: "数据" },
  Retail: { pt: "Varejo", es: "Retail", zh: "零售" },
  Restaurants: { pt: "Restaurantes", es: "Restaurantes", zh: "餐饮" },
  Finance: { pt: "Finanças", es: "Finanzas", zh: "金融" },
  Fitness: { pt: "Fitness", es: "Fitness", zh: "健身" },
  Gaming: { pt: "Games", es: "Videojuegos", zh: "游戏" },
  Institutional: { pt: "Institucional", es: "Institucional", zh: "机构" },
  Social: { pt: "Social", es: "Social", zh: "社交" },
  "Non-profit": { pt: "Sem fins lucrativos", es: "Sin fines de lucro", zh: "非营利" },
  Community: { pt: "Comunidade", es: "Comunidad", zh: "社区" },
  Education: { pt: "Educação", es: "Educación", zh: "教育" },
  "Open source": { pt: "Open source", es: "Código abierto", zh: "开源" },
  AI: { pt: "IA", es: "IA", zh: "人工智能" },
};

const FE_DEV: Tri<WorkI18n> = {
  pt: { title: "Desenvolvedor Frontend" },
  es: { title: "Desarrollador Frontend" },
  zh: { title: "前端开发工程师" },
};
const FS_DEV: Tri<WorkI18n> = {
  pt: { title: "Desenvolvedor Fullstack" },
  es: { title: "Desarrollador Fullstack" },
  zh: { title: "全栈开发工程师" },
};
const APP_DEV: Tri<WorkI18n> = {
  pt: { title: "Desenvolvedor de Apps" },
  es: { title: "Desarrollador de Apps" },
  zh: { title: "应用开发工程师" },
};

function with_(base: Tri<WorkI18n>, extra: Tri<WorkI18n>): Tri<WorkI18n> {
  return { pt: { ...base.pt, ...extra.pt }, es: { ...base.es, ...extra.es }, zh: { ...base.zh, ...extra.zh } };
}

export const WORKS: Record<string, Tri<WorkI18n>> = {
  "zup-innovation": {
    pt: {
      title: "Engenheiro Frontend Sênior · Fullstack",
      products: ["Super app bancário", "Tesouraria PJ", "Corretora de investimentos"],
      summary:
        "Especialista frontend em um super app bancário de grande escala usado por milhões — plataformas de tesouraria corporativa (PJ) e corretora de investimentos, com requisitos rígidos de segurança, performance e confiabilidade.",
      description:
        "Arquitetura Angular enterprise para um dos maiores super apps bancários do Brasil. Construí e mantive plataformas de tesouraria corporativa (PJ) e soluções de corretora de investimentos, trabalhando com um design system proprietário junto de Angular Material, Tailwind CSS e BEM.\n\nOs contratos de API eram negociados e mantidos explícitos com um backend em Kotlin, e cada mudança passava por uma forte cultura de qualidade de código, testes, segurança e manutenibilidade — em colaboração próxima com produto, UX e engenharia nas decisões técnicas estratégicas.",
      highlights: [
        "Super app bancário de grande escala usado por milhões de usuários",
        "Plataformas de tesouraria corporativa (PJ) e corretora de investimentos",
        "Arquitetura Angular enterprise e design system proprietário",
        "Performance, acessibilidade e UX em fluxos de missão crítica",
        "Contratos de API bem definidos com backend em Kotlin",
      ],
    },
    es: {
      title: "Ingeniero Frontend Senior · Fullstack",
      products: ["Super app bancaria", "Tesorería empresarial", "Bróker de inversiones"],
      summary:
        "Especialista frontend en una super app bancaria a gran escala usada por millones — plataformas de tesorería corporativa y bróker de inversiones, con requisitos estrictos de seguridad, rendimiento y fiabilidad.",
      description:
        "Arquitectura Angular empresarial para una de las mayores super apps bancarias de Brasil. Construí y mantuve plataformas de tesorería corporativa y soluciones de bróker de inversiones, trabajando con un design system propietario junto a Angular Material, Tailwind CSS y BEM.\n\nLos contratos de API se negociaban y mantenían explícitos con un backend en Kotlin, y cada cambio pasaba por una sólida cultura de calidad de código, pruebas, seguridad y mantenibilidad — en estrecha colaboración con producto, UX e ingeniería en las decisiones técnicas estratégicas.",
      highlights: [
        "Super app bancaria a gran escala usada por millones de usuarios",
        "Plataformas de tesorería corporativa y bróker de inversiones",
        "Arquitectura Angular empresarial y design system propietario",
        "Rendimiento, accesibilidad y UX en flujos de misión crítica",
        "Contratos de API bien definidos con un backend en Kotlin",
      ],
    },
    zh: {
      title: "高级前端工程师 · 全栈",
      products: ["银行超级应用", "企业资金管理", "投资经纪平台"],
      summary:
        "在一款拥有数百万用户的大型银行超级应用中担任前端专家——负责企业资金管理和投资经纪平台，对安全性、性能和可靠性有严格要求。",
      description:
        "为巴西最大的银行超级应用之一打造企业级 Angular 架构。我构建并维护了企业资金管理平台和投资经纪解决方案，在专有设计系统基础上结合 Angular Material、Tailwind CSS 和 BEM 进行开发。\n\n与 Kotlin 后端协商并维护清晰明确的 API 契约；每一次变更都遵循严格的代码质量、测试、安全和可维护性文化——并与产品、UX 和工程团队紧密合作，共同做出关键技术决策。",
      highlights: [
        "数百万用户使用的大型银行超级应用",
        "企业资金管理与投资经纪平台",
        "企业级 Angular 架构与专有设计系统",
        "关键业务流程中的性能、无障碍与用户体验",
        "与 Kotlin 后端之间定义清晰的 API 契约",
      ],
    },
  },
  deal: {
    pt: {
      title: "Desenvolvedor Fullstack · Especialista Frontend",
      products: ["Plataformas de internet banking"],
      summary:
        "Plataformas de internet banking para dois clientes do setor financeiro em arquitetura de Micro Frontends — referência técnica em padrões e arquitetura frontend.",
      description:
        "Dois clientes bancários, uma arquitetura: Micro Frontends que isolam domínios e permitem que cada parte do produto evolua de forma independente. Atuei como referência técnica de frontend, definindo padrões de código e arquitetura, construindo interfaces reutilizáveis e acessíveis com Angular e Angular Material e integrando com um backend Python via ORM.\n\nTrabalho contínuo em performance, segurança, cobertura de testes e qualidade técnica.",
      highlights: [
        "Plataformas de internet banking para dois clientes do setor financeiro",
        "Arquitetura de Micro Frontends para isolamento de domínios e evolução independente",
        "Referência técnica de frontend — padrões de código e arquitetura",
        "Integração com backend Python via ORM",
      ],
    },
    es: {
      title: "Desarrollador Fullstack · Especialista Frontend",
      products: ["Plataformas de banca web"],
      summary:
        "Plataformas de banca web para dos clientes del sector financiero sobre una arquitectura de Micro Frontends — referente técnico en estándares y arquitectura frontend.",
      description:
        "Dos clientes bancarios, una arquitectura: Micro Frontends que aíslan dominios y permiten que cada parte del producto evolucione de forma independiente. Actué como referente técnico de frontend, definiendo estándares de código y arquitectura, construyendo interfaces reutilizables y accesibles con Angular y Angular Material e integrando con un backend en Python mediante un ORM.\n\nTrabajo continuo en rendimiento, seguridad, cobertura de pruebas y calidad técnica.",
      highlights: [
        "Plataformas de banca web para dos clientes del sector financiero",
        "Arquitectura de Micro Frontends para aislar dominios y evolucionar de forma independiente",
        "Referente técnico de frontend — estándares de código y arquitectura",
        "Integración con backend en Python mediante ORM",
      ],
    },
    zh: {
      title: "全栈开发工程师 · 前端专家",
      products: ["网上银行平台"],
      summary: "基于微前端架构，为两家金融行业客户打造网上银行平台——担任前端规范与架构的技术负责人。",
      description:
        "两个银行客户，一套架构：微前端将业务领域隔离开来，让产品的每个部分都能独立演进。我担任前端技术负责人，制定代码与架构规范，使用 Angular 和 Angular Material 构建可复用、无障碍的界面，并通过 ORM 与 Python 后端集成。\n\n持续推进性能、安全、测试覆盖率和技术质量的提升。",
      highlights: [
        "为两家金融行业客户打造网上银行平台",
        "微前端架构，实现领域隔离与独立演进",
        "前端技术负责人——代码与架构规范",
        "通过 ORM 与 Python 后端集成",
      ],
    },
  },
  taqtaq: {
    pt: {
      products: ["App TaqTaq (B2C · B2B · Eventos)"],
      summary:
        "Liderança técnica de um novo app multiplataforma para B2C, B2B e eventos — do conceito à produção, dentro do prazo e do orçamento.",
      description:
        "O TaqTaq é um app global de gestão de contatos e networking. Liderei a construção da nova versão multiplataforma do conceito à produção: arquitetura, planejamento técnico e priorização, além de desenvolvimento mobile hands-on em Flutter.\n\nA introdução de práticas ágeis aumentou em mais de 20% a taxa de conclusão de projetos do time, e a mentoria de desenvolvedores juniores elevou a qualidade do código e a maturidade técnica.",
      highlights: [
        "Liderei um novo app multiplataforma do conceito à produção",
        "Responsável pela arquitetura, planejamento técnico e priorização",
        "Apps mobile responsivos em Flutter (Dart)",
        "Mentoria de desenvolvedores juniores",
      ],
      metrics: [{ value: "+20%", label: "taxa de conclusão de projetos após adoção de práticas ágeis" }],
    },
    es: {
      products: ["App TaqTaq (B2C · B2B · Eventos)"],
      summary:
        "Liderazgo técnico de una nueva app multiplataforma para B2C, B2B y eventos — del concepto a producción, en plazo y presupuesto.",
      description:
        "TaqTaq es una app global de gestión de contactos y networking. Lideré la construcción de la nueva versión multiplataforma del concepto a producción: arquitectura, planificación técnica y priorización, además de desarrollo móvil práctico en Flutter.\n\nLa introducción de prácticas ágiles aumentó en más de un 20% la tasa de finalización de proyectos del equipo, y la mentoría a desarrolladores junior elevó la calidad del código y la madurez técnica.",
      highlights: [
        "Lideré una nueva app multiplataforma del concepto a producción",
        "Responsable de la arquitectura, la planificación técnica y la priorización",
        "Apps móviles responsivas en Flutter (Dart)",
        "Mentoría a desarrolladores junior",
      ],
      metrics: [{ value: "+20%", label: "tasa de finalización de proyectos tras adoptar prácticas ágiles" }],
    },
    zh: {
      title: "技术负责人",
      products: ["TaqTaq 应用（B2C · B2B · 活动）"],
      summary: "主导一款面向 B2C、B2B 和活动场景的全新跨平台应用的技术工作——从概念到上线，按时且不超预算。",
      description:
        "TaqTaq 是一款全球化的联系人管理与社交人脉应用。我主导了新版跨平台应用从概念到上线的全过程：架构设计、技术规划与优先级排序，并亲自使用 Flutter 进行移动端开发。\n\n引入敏捷实践后，团队的项目完成率提升了 20% 以上；对初级开发者的指导也提高了代码质量和技术成熟度。",
      highlights: ["主导新的跨平台应用从概念到上线", "负责架构、技术规划与优先级排序", "使用 Flutter（Dart）开发响应式移动应用", "指导初级开发者"],
      metrics: [{ value: "+20%", label: "采用敏捷实践后的项目完成率" }],
    },
  },
  ciandt: with_(FS_DEV, {
    pt: {
      products: ["Aplicações de crédito imobiliário"],
      summary:
        "Projetos internacionais para grandes empresas financeiras e corporativas — aplicações de crédito imobiliário com Angular, C#/.NET e Python, e liderança técnica em projetos cloud.",
      description:
        "Projetos internacionais para grandes empresas dos setores financeiro e corporativo, incluindo aplicações de crédito imobiliário construídas com Angular, C#/.NET e Python.\n\nImplementei pipelines de CI/CD, práticas de testes e qualidade, conduzi code reviews e defini boas práticas — além de liderar tecnicamente projetos em cloud.",
      highlights: [
        "Projetos internacionais para grandes empresas financeiras e corporativas",
        "Aplicações de crédito imobiliário (Angular, C#/.NET, Python)",
        "Pipelines de CI/CD, práticas de testes e qualidade",
        "Liderança técnica em projetos cloud",
      ],
      metrics: [
        { value: "+30%", label: "engajamento de usuários" },
        { value: "−20%", label: "tempo de carregamento" },
      ],
    },
    es: {
      products: ["Aplicaciones de crédito hipotecario"],
      summary:
        "Proyectos internacionales para grandes empresas financieras y corporativas — aplicaciones de crédito hipotecario con Angular, C#/.NET y Python, y liderazgo técnico en proyectos cloud.",
      description:
        "Proyectos internacionales para grandes empresas de los sectores financiero y corporativo, incluidas aplicaciones de crédito hipotecario construidas con Angular, C#/.NET y Python.\n\nImplementé pipelines de CI/CD, prácticas de pruebas y calidad, realicé code reviews y definí buenas prácticas — además de liderar técnicamente proyectos en la nube.",
      highlights: [
        "Proyectos internacionales para grandes empresas financieras y corporativas",
        "Aplicaciones de crédito hipotecario (Angular, C#/.NET, Python)",
        "Pipelines de CI/CD, prácticas de pruebas y calidad",
        "Liderazgo técnico en proyectos cloud",
      ],
      metrics: [
        { value: "+30%", label: "interacción de usuarios" },
        { value: "−20%", label: "tiempo de carga" },
      ],
    },
    zh: {
      products: ["房地产信贷应用"],
      summary: "为大型金融与企业客户开展国际项目——使用 Angular、C#/.NET 和 Python 构建房地产信贷应用，并在云项目中担任技术负责人。",
      description:
        "为金融和企业领域的大型公司开展国际项目，包括使用 Angular、C#/.NET 和 Python 构建的房地产信贷应用。\n\n我搭建了 CI/CD 流水线，推行测试与质量实践，主持代码评审并制定最佳实践——同时在云项目中担任技术负责人。",
      highlights: ["为大型金融与企业客户开展国际项目", "房地产信贷应用（Angular、C#/.NET、Python）", "CI/CD 流水线、测试与质量实践", "云项目技术负责人"],
      metrics: [
        { value: "+30%", label: "用户参与度" },
        { value: "−20%", label: "加载时间" },
      ],
    },
  }),
  "pharmalink-ecs": {
    pt: {
      title: "Desenvolvedor Fullstack · Líder Frontend",
      via: "para InterPlayers",
      products: ["Pharmalink Online", "Ciclo Financeiro"],
      summary:
        "Responsável técnico pelo Pharmalink Online — hub e marketplace farmacêutico usado por muitos players do setor. Liderei a migração completa de AngularJS 1.8 → Angular 14.",
      description:
        "Projetos estratégicos de saúde e farmacêutico em parceria com a InterPlayers, parceira e cliente da ECS. Fui o responsável técnico pela evolução do Pharmalink Online, um hub e marketplace farmacêutico.\n\nO ponto central foi liderar a migração completa do frontend de AngularJS 1.8.2 para Angular 14 — atualização de tecnologia e arquitetura, modernização da base de código e grande redução de dívida técnica — enquanto orientava desenvolvedores menos experientes para encurtar o tempo de entrega.\n\nTambém contribuí diretamente com o motor de cálculo financeiro (Ciclo Financeiro), atuei no backend e em integrações e introduzi estratégias de cache que reduziram o tempo de carregamento em até 50%.",
      highlights: [
        "Responsável técnico pelo Pharmalink Online, hub e marketplace farmacêutico",
        "Liderei a migração completa de AngularJS 1.8.2 → Angular 14",
        "Contribuição direta no motor de cálculo do Ciclo Financeiro",
        "Integrações de backend e APIs RESTful",
        "Referência técnica e mentor de frontend",
      ],
      metrics: [{ value: "−50%", label: "tempo de carregamento com estratégias de cache" }],
    },
    es: {
      title: "Desarrollador Fullstack · Líder Frontend",
      via: "para InterPlayers",
      products: ["Pharmalink Online", "Ciclo Financiero"],
      summary:
        "Responsable técnico de Pharmalink Online — hub y marketplace farmacéutico usado por muchos actores del sector. Lideré la migración completa de AngularJS 1.8 → Angular 14.",
      description:
        "Proyectos estratégicos de salud y farmacéutica en alianza con InterPlayers, socia y cliente de ECS. Fui el responsable técnico de la evolución de Pharmalink Online, un hub y marketplace farmacéutico.\n\nLa pieza central fue liderar la migración completa del frontend de AngularJS 1.8.2 a Angular 14 — actualización de tecnología y arquitectura, modernización del código y una gran reducción de deuda técnica — mientras guiaba a desarrolladores menos experimentados para acortar los tiempos de entrega.\n\nTambién contribuí directamente al motor de cálculo financiero (Ciclo Financiero), trabajé en el backend y en integraciones e introduje estrategias de caché que redujeron el tiempo de carga hasta un 50%.",
      highlights: [
        "Responsable técnico de Pharmalink Online, hub y marketplace farmacéutico",
        "Lideré la migración completa de AngularJS 1.8.2 → Angular 14",
        "Contribución directa al motor de cálculo del Ciclo Financiero",
        "Integraciones de backend y APIs RESTful",
        "Referente técnico y mentor de frontend",
      ],
      metrics: [{ value: "−50%", label: "tiempo de carga con estrategias de caché" }],
    },
    zh: {
      title: "全栈开发工程师 · 前端负责人",
      via: "服务于 InterPlayers",
      products: ["Pharmalink Online", "财务周期引擎"],
      summary: "Pharmalink Online 的技术负责人——这是一个被众多行业参与者使用的医药枢纽与交易平台。主导了从 AngularJS 1.8 到 Angular 14 的完整迁移。",
      description:
        "与 ECS 的合作伙伴兼客户 InterPlayers 共同开展医疗与制药领域的战略项目。我负责医药枢纽与交易平台 Pharmalink Online 的技术演进。\n\n核心工作是主导前端从 AngularJS 1.8.2 到 Angular 14 的完整迁移——升级技术与架构、现代化代码库并大幅削减技术债——同时指导经验较少的开发者，缩短交付周期。\n\n我还直接参与了财务计算引擎（财务周期）的开发，负责后端与系统集成，并引入缓存策略，使加载时间最多缩短 50%。",
      highlights: [
        "Pharmalink Online（医药枢纽与交易平台）技术负责人",
        "主导 AngularJS 1.8.2 → Angular 14 的完整迁移",
        "直接参与财务周期计算引擎开发",
        "后端集成与 RESTful API",
        "前端技术带头人与导师",
      ],
      metrics: [{ value: "−50%", label: "借助缓存策略缩短的加载时间" }],
    },
  },
  "herrmann-it-consultoria": {
    pt: {
      title: "Fundador · Engenheiro de Software · Especialista Frontend",
      summary:
        "Minha própria consultoria de tecnologia. Engenharia frontend, desenvolvimento fullstack e arquitetura de aplicações para clientes nacionais e internacionais em bancos, saúde e SaaS.",
      description:
        "A Herrmann IT Consultoria é como trabalho diretamente com clientes. Conforme o projeto, atuo como Engenheiro Frontend, Engenheiro Fullstack ou Tech Lead, alocado em projetos estratégicos de médio e grande porte — sempre com forte foco em qualidade de código, performance, escalabilidade, segurança e arquitetura frontend.\n\nEntre os clientes e produtos estão PicPay (via Sciensa), upMiner e upLink (upLexis), Pernambucanas (via Cliqx), Lojas Lebes, Grupo Madero, Pacto Soluções (apps Engenharia do Corpo e Usina do Corpo), Milvus, Maxxidata, Facepass, UDS Broadcast e outros — veja o arquivo abaixo.",
      highlights: [
        "Consultor (PJ) em projetos estratégicos de médio e grande porte",
        "Engenheiro Frontend, Engenheiro Fullstack ou Tech Lead conforme a necessidade de cada cliente",
        "Produtos enterprise, de missão crítica e alto tráfego",
        "Estratégias de cache que reduziram o tempo de carregamento em até 50%",
      ],
    },
    es: {
      title: "Fundador · Ingeniero de Software · Especialista Frontend",
      summary:
        "Mi propia consultora tecnológica. Ingeniería frontend, desarrollo fullstack y arquitectura de aplicaciones para clientes nacionales e internacionales en banca, salud y SaaS.",
      description:
        "Herrmann IT Consultoria es la forma en que trabajo directamente con clientes. Según el proyecto, actúo como Ingeniero Frontend, Ingeniero Fullstack o Tech Lead, asignado a proyectos estratégicos medianos y grandes — siempre con un fuerte foco en calidad de código, rendimiento, escalabilidad, seguridad y arquitectura frontend.\n\nEntre los clientes y productos están PicPay (vía Sciensa), upMiner y upLink (upLexis), Pernambucanas (vía Cliqx), Lojas Lebes, Grupo Madero, Pacto Soluções (apps de Engenharia do Corpo y Usina do Corpo), Milvus, Maxxidata, Facepass, UDS Broadcast y más — ver el archivo más abajo.",
      highlights: [
        "Consultor independiente en proyectos estratégicos medianos y grandes",
        "Ingeniero Frontend, Ingeniero Fullstack o Tech Lead según lo que necesite cada cliente",
        "Productos empresariales, de misión crítica y alto tráfico",
        "Estrategias de caché que redujeron los tiempos de carga hasta un 50%",
      ],
    },
    zh: {
      title: "创始人 · 软件工程师 · 前端专家",
      summary: "我自己的技术咨询公司。为银行、医疗和 SaaS 领域的国内外客户提供前端工程、全栈开发与应用架构服务。",
      description:
        "Herrmann IT Consultoria 是我直接与客户合作的方式。根据项目需要，我担任前端工程师、全栈工程师或技术负责人，参与中大型战略项目——始终高度关注代码质量、性能、可扩展性、安全性和前端架构。\n\n客户与产品包括 PicPay（经由 Sciensa）、upMiner 和 upLink（upLexis）、Pernambucanas（经由 Cliqx）、Lojas Lebes、Grupo Madero、Pacto Soluções（Engenharia do Corpo 和 Usina do Corpo 应用）、Milvus、Maxxidata、Facepass、UDS Broadcast 等——详见下方履历。",
      highlights: [
        "以独立顾问身份参与中大型战略项目",
        "根据客户需要担任前端工程师、全栈工程师或技术负责人",
        "企业级、关键业务与高流量产品",
        "缓存策略使加载时间最多缩短 50%",
      ],
    },
  },

  /* ---------------- Clients ---------------- */
  picpay: with_(FE_DEV, {
    pt: { summary: "Frontend em um produto financeiro de alta escala." },
    es: { via: "vía Sciensa", summary: "Frontend en un producto financiero de gran escala." },
    zh: { via: "经由 Sciensa", summary: "为一款大规模金融产品开发前端。" },
  }),
  uplexis: {
    pt: { summary: "Liderança técnica, definição de arquitetura e orientação do time em plataformas de compliance e due diligence." },
    es: { summary: "Liderazgo técnico, definición de arquitectura y guía del equipo en plataformas de cumplimiento y due diligence." },
    zh: { title: "技术负责人", summary: "在合规与尽职调查平台上担任技术负责人，负责架构设计并指导团队。" },
  },
  pernambucanas: with_(FS_DEV, {
    pt: { summary: "Soluções corporativas para uma das maiores varejistas do Brasil." },
    es: { via: "vía Cliqx", summary: "Soluciones corporativas para uno de los mayores minoristas de Brasil." },
    zh: { via: "经由 Cliqx", summary: "为巴西最大的零售商之一开发企业级解决方案。" },
  }),
  milvus: with_(FE_DEV, {
    pt: {
      products: ["Portal do Cliente", "Portal do Gestor", "Widget de Chat", "Cliente Windows"],
      summary: "Portais e widget de chat para uma plataforma de help desk e gestão de serviços.",
    },
    es: {
      products: ["Portal del Cliente", "Portal del Gestor", "Widget de Chat", "Cliente Windows"],
      summary: "Portales y widget de chat para una plataforma de help desk y gestión de servicios.",
    },
    zh: {
      products: ["客户门户", "管理者门户", "聊天组件", "Windows 客户端"],
      summary: "为一个服务台与服务管理平台开发门户网站和聊天组件。",
    },
  }),
  maxxidata: with_(FS_DEV, {
    pt: { summary: "Micro Frontends em Angular com serviços NestJS e Node.js." },
    es: { summary: "Micro Frontends en Angular con servicios NestJS y Node.js." },
    zh: { summary: "基于 Angular 的微前端，配合 NestJS 和 Node.js 服务。" },
  }),
  "uds-broadcast": with_(FS_DEV, {
    pt: { summary: "Plataformas financeiras para mercado de balcão (OTC) e corretagem." },
    es: { summary: "Plataformas financieras para mercado extrabursátil (OTC) y corretaje." },
    zh: { summary: "面向场外交易（OTC）与经纪业务的金融平台。" },
  }),
  "inform-ekantika": with_(FE_DEV, {
    pt: { summary: "Arquitetura frontend moderna e gerenciamento de estado." },
    es: { summary: "Arquitectura frontend moderna y gestión de estado." },
    zh: { summary: "现代前端架构与状态管理。" },
  }),
  scale: with_(FS_DEV, {
    pt: { summary: "Desenvolvimento fullstack e integração de sistemas." },
    es: { summary: "Desarrollo fullstack e integración de sistemas." },
    zh: { summary: "全栈开发与系统集成。" },
  }),
  facepass: with_(FE_DEV, {
    pt: { products: ["Portal do Produtor", "Ingressos", "Componentes"], summary: "Portal de ingressos e biblioteca de componentes." },
    es: { products: ["Portal del Productor", "Entradas", "Componentes"], summary: "Portal de venta de entradas y biblioteca de componentes." },
    zh: { products: ["主办方门户", "票务", "组件库"], summary: "票务门户与组件库。" },
  }),
  "pacto-solucoes": {
    pt: {
      title: "Engenheiro Frontend",
      products: ["App Engenharia do Corpo (EC PRO)", "App Usina do Corpo", "Hotsites das academias", "Hotsite de vendas da Pacto", "ZW"],
      summary:
        "Frontend do ecossistema de gestão fitness da Pacto — incluindo os apps de alunos de duas das maiores redes de academias do Sul do Brasil, Engenharia do Corpo e Usina do Corpo, e seus hotsites.",
      description:
        "A Pacto Soluções desenvolve a plataforma de gestão usada por academias e negócios fitness em todo o Brasil. Trabalhei nos principais apps de alunos entregues às redes — o app da Engenharia do Corpo (EC PRO) e o app da Usina do Corpo —, onde os alunos acompanham seus treinos com cargas e repetições, agendam aulas, fazem check-in e gerenciam seus contratos.\n\nTambém construí os hotsites das redes — planos, unidades e matrícula online —, além do hotsite de vendas da própria Pacto, e contribuí com o frontend do ZW, o sistema de gestão da Pacto.",
      highlights: [
        "Apps de alunos da Engenharia do Corpo (EC PRO) e da Usina do Corpo — treinos, agendamento de aulas, check-in e contratos",
        "Hotsites das redes de academias: planos, unidades e matrícula online",
        "Hotsite de vendas da Pacto",
        "Frontend do ZW, o sistema de gestão da Pacto",
      ],
    },
    es: {
      title: "Ingeniero Frontend",
      products: ["App Engenharia do Corpo (EC PRO)", "App Usina do Corpo", "Hotsites de los gimnasios", "Hotsite de ventas de Pacto", "ZW"],
      summary:
        "Frontend del ecosistema de gestión fitness de Pacto — incluidas las apps para socios de dos de las mayores cadenas de gimnasios del sur de Brasil, Engenharia do Corpo y Usina do Corpo, y sus hotsites.",
      description:
        "Pacto Soluções desarrolla la plataforma de gestión que usan gimnasios y negocios fitness en todo Brasil. Trabajé en las principales apps para socios entregadas a las cadenas — la app de Engenharia do Corpo (EC PRO) y la app de Usina do Corpo —, donde los socios siguen sus entrenamientos con cargas y repeticiones, reservan clases, hacen check-in y gestionan sus contratos.\n\nTambién construí los hotsites de las cadenas — planes, sedes e inscripción online —, además del hotsite de ventas de la propia Pacto, y contribuí al frontend de ZW, el sistema de gestión de Pacto.",
      highlights: [
        "Apps para socios de Engenharia do Corpo (EC PRO) y Usina do Corpo — entrenamientos, reserva de clases, check-in y contratos",
        "Hotsites de las cadenas de gimnasios: planes, sedes e inscripción online",
        "Hotsite de ventas de Pacto",
        "Frontend de ZW, el sistema de gestión de Pacto",
      ],
    },
    zh: {
      title: "前端工程师",
      products: ["Engenharia do Corpo 应用（EC PRO）", "Usina do Corpo 应用", "健身房官网落地页", "Pacto 销售落地页", "ZW"],
      summary:
        "负责 Pacto 健身管理生态的前端——包括巴西南部两大连锁健身房 Engenharia do Corpo 和 Usina do Corpo 的会员应用及其官网落地页。",
      description:
        "Pacto Soluções 打造了巴西各地健身房和健身企业使用的管理平台。我参与了交付给连锁品牌的主要会员应用——Engenharia do Corpo 应用（EC PRO）和 Usina do Corpo 应用——会员可以在其中查看训练计划（重量和次数）、预约课程、签到并管理合同。\n\n我还为这些连锁品牌搭建了官网落地页（会员方案、门店和在线报名），以及 Pacto 自己的销售落地页，并参与了 Pacto 管理系统 ZW 的前端开发。",
      highlights: [
        "Engenharia do Corpo（EC PRO）与 Usina do Corpo 会员应用——训练、课程预约、签到与合同",
        "连锁健身房官网落地页：会员方案、门店与在线报名",
        "Pacto 销售落地页",
        "Pacto 管理系统 ZW 的前端",
      ],
    },
  },
  "lojas-lebes": with_(APP_DEV, {
    pt: {
      products: ["App Lojas Lebes (iOS · Android)"],
      summary:
        "Trabalhei na criação do app da Lojas Lebes — crediário, parcelas e empréstimo pessoal na palma da mão, para uma tradicional rede varejista do Rio Grande do Sul.",
      description:
        "A Lojas Lebes é uma tradicional rede de lojas de departamento do Rio Grande do Sul. Trabalhei na criação do app Lebes, que coloca o crédito da loja nas mãos dos clientes: pagar as parcelas do crediário, consultar limites e saldo, abrir o crediário e solicitar empréstimo pessoal — tudo em um fluxo claro e simples.",
      highlights: [
        "Participei da construção do novo app Lebes",
        "Crediário no app: pagamento de parcelas, limites e saldo",
        "Empréstimo pessoal solicitado direto pelo celular",
        "Publicado na App Store e no Google Play",
      ],
    },
    es: {
      products: ["App Lojas Lebes (iOS · Android)"],
      summary:
        "Trabajé en la creación de la app de Lojas Lebes — crédito de la tienda, cuotas y préstamos personales en el bolsillo, para una tradicional cadena minorista de Rio Grande do Sul.",
      description:
        "Lojas Lebes es una tradicional cadena de grandes almacenes de Rio Grande do Sul. Trabajé en la creación de la app Lebes, que pone el crédito de la tienda en manos de sus clientes: pagar las cuotas, consultar límites y saldo, abrir una cuenta de crédito y solicitar un préstamo personal — todo en un flujo claro y sencillo.",
      highlights: [
        "Participé en la construcción de la nueva app Lebes",
        "Crédito en la app: pago de cuotas, límites y saldo",
        "Préstamos personales solicitados directamente desde el móvil",
        "Publicada en App Store y Google Play",
      ],
    },
    zh: {
      products: ["Lojas Lebes 应用（iOS · Android）"],
      summary: "参与打造 Lojas Lebes 应用——为南里奥格兰德州的一家传统零售连锁企业，把门店分期信用、还款和个人贷款装进顾客的口袋。",
      description:
        "Lojas Lebes 是南里奥格兰德州一家传统的百货连锁企业。我参与了 Lebes 应用的开发，让顾客可以直接掌握门店信用：支付分期账单、查询额度与余额、开通分期账户以及申请个人贷款——整个流程清晰而简单。",
      highlights: ["参与构建全新的 Lebes 应用", "应用内分期信用：还款、额度与余额查询", "直接在手机上申请个人贷款", "已在 App Store 和 Google Play 上架"],
    },
  }),
  "grupo-madero": with_(APP_DEV, {
    pt: {
      products: ["App Grupo Madero (iOS · Android)"],
      summary:
        "Trabalhei na criação do app do Grupo Madero — uma única plataforma de pedidos para as marcas do grupo: Madero, Jeronimo, Legno e Dundee Chicken & Burgers.",
      description:
        "O Grupo Madero é um dos grupos de restaurantes mais conhecidos do Brasil. Trabalhei na criação do seu app: uma plataforma única que reúne as quatro marcas do grupo — Madero, Jeronimo, Legno e Dundee Chicken & Burgers — para fazer pedidos nos restaurantes com preços e vantagens exclusivas do app.",
      highlights: [
        "Participei da construção do app do Grupo Madero",
        "Um app para quatro marcas: Madero, Jeronimo, Legno e Dundee",
        "Pedidos nos restaurantes com vantagens exclusivas do app",
        "Publicado na App Store e no Google Play",
      ],
    },
    es: {
      products: ["App Grupo Madero (iOS · Android)"],
      summary:
        "Trabajé en la creación de la app de Grupo Madero — una única plataforma de pedidos para las marcas del grupo: Madero, Jeronimo, Legno y Dundee Chicken & Burgers.",
      description:
        "Grupo Madero es uno de los grupos de restaurantes más conocidos de Brasil. Trabajé en la creación de su app: una plataforma única que reúne las cuatro marcas del grupo — Madero, Jeronimo, Legno y Dundee Chicken & Burgers — para hacer pedidos en los restaurantes con precios y ventajas exclusivas de la app.",
      highlights: [
        "Participé en la construcción de la app de Grupo Madero",
        "Una app para cuatro marcas: Madero, Jeronimo, Legno y Dundee",
        "Pedidos en los restaurantes con ventajas exclusivas de la app",
        "Publicada en App Store y Google Play",
      ],
    },
    zh: {
      products: ["Grupo Madero 应用（iOS · Android）"],
      summary: "参与打造 Grupo Madero 应用——一个统一的点餐平台，涵盖集团旗下品牌：Madero、Jeronimo、Legno 和 Dundee Chicken & Burgers。",
      description:
        "Grupo Madero 是巴西最知名的餐饮集团之一。我参与了其应用的开发：一个汇集集团四大品牌——Madero、Jeronimo、Legno 和 Dundee Chicken & Burgers——的统一平台，用户可以在应用中向各家餐厅下单，并享受应用专属价格与优惠。",
      highlights: ["参与构建 Grupo Madero 应用", "一个应用覆盖四个品牌：Madero、Jeronimo、Legno 和 Dundee", "向餐厅下单并享受应用专属优惠", "已在 App Store 和 Google Play 上架"],
    },
  }),
  pevepas: with_(FE_DEV, {
    pt: { summary: "Frontend para uma comunidade de jogos de role-play." },
    es: { summary: "Frontend para una comunidad de videojuegos de rol." },
    zh: { summary: "为一个角色扮演游戏社区开发前端。" },
  }),
  "relevo-lab": with_(FE_DEV, {
    pt: { summary: "Plataforma web para a Associação Comercial de São Paulo." },
    es: { summary: "Plataforma web para la Asociación Comercial de São Paulo." },
    zh: { products: ["圣保罗商业协会"], summary: "为圣保罗商业协会开发 Web 平台。" },
  }),
  softwrap: with_(FE_DEV, {
    pt: { summary: "Aplicação web de saúde." },
    es: { summary: "Aplicación web de salud." },
    zh: { summary: "医疗健康 Web 应用。" },
  }),
  "triade-social": with_(FE_DEV, {
    pt: { summary: "Frontend de um produto de chat." },
    es: { summary: "Frontend de un producto de chat." },
    zh: { summary: "一款聊天产品的前端。" },
  }),
  "dollar-donation-club": with_(FE_DEV, {
    pt: { products: ["Site institucional"], summary: "Site institucional." },
    es: { products: ["Sitio web institucional"], summary: "Sitio web institucional." },
    zh: { products: ["机构官网"], summary: "机构官网。" },
  }),

  /* ---------------- Projects ---------------- */
  "projeto-dev": {
    pt: {
      title: "Projeto social · Fundador",
      summary: "Um projeto social que criei em 2020 para apoiar pessoas que estão entrando na área de tecnologia.",
      description:
        "O Projeto Dev apoia quem quer entrar em TI — orientação, mentoria e um caminho até a primeira vaga. Fundei o projeto em 2020 e o mantenho ativo em paralelo ao trabalho com clientes.",
    },
    es: {
      title: "Proyecto social · Fundador",
      summary: "Un proyecto social que creé en 2020 para apoyar a personas que están entrando en el sector tecnológico.",
      description:
        "Projeto Dev apoya a quienes quieren entrar en TI — orientación, mentoría y un camino hacia el primer empleo. Lo fundé en 2020 y lo mantengo activo junto al trabajo con clientes.",
    },
    zh: {
      title: "公益项目 · 创始人",
      summary: "我在 2020 年创立的公益项目，帮助想进入科技行业的人。",
      description: "Projeto Dev 帮助想进入 IT 行业的人——提供指导、辅导以及找到第一份工作的路径。我在 2020 年创立了它，并在客户工作之余持续运营。",
    },
  },
  "angular-signals": {
    pt: {
      title: "Open source · Exemplos ao vivo de Angular Signals",
      summary:
        "Treze exemplos ao vivo explicando Angular Signals em português — criação e atualização de signals, effects, valores computados e conversão de Observables.",
    },
    es: {
      title: "Código abierto · Ejemplos en vivo de Angular Signals",
      summary:
        "Trece ejemplos en vivo que explican Angular Signals en portugués — crear y actualizar signals, effects, valores computados y convertir Observables.",
    },
    zh: {
      title: "开源 · Angular Signals 在线示例",
      summary: "十三个用葡萄牙语讲解 Angular Signals 的在线示例——创建和更新 signal、effect、计算值以及 Observable 转换。",
    },
  },
  "qoda-web": {
    pt: {
      title: "Open source · Desenhe um dígito, veja a previsão",
      summary: "Uma demo web em que você desenha qualquer número em uma caixa e vê o resultado.",
    },
    es: {
      title: "Código abierto · Dibuja un dígito, mira la predicción",
      summary: "Una demo web en la que dibujas cualquier número en un recuadro y ves el resultado.",
    },
    zh: {
      title: "开源 · 手写数字，查看识别结果",
      summary: "一个网页演示：在方框中写下任意数字，即可看到识别结果。",
    },
  },
};

export const SETTINGS: Tri<SettingsI18n> = {
  pt: {
    headline: "Lead AI Engineer · Especialista Fullstack e Frontend",
    roles: ["Lead AI Engineer", "Especialista Frontend", "Engenheiro Fullstack", "Tech Lead"],
    intro:
      "Construo plataformas de missão crítica para bancos, saúde e tecnologia — arquitetura frontend enterprise, backends escaláveis e, desde 2020, produtos com IA e LLMs.",
    bio: [
      "Pode me chamar de Herrmann — no papel, Gabriel Herrmann Grecchi. Desenvolvedor fullstack desde 2014, mobile desde 2017, Web3 e IA desde 2020. A maior parte do meu trabalho foi em plataformas de missão crítica em bancos e finanças, saúde e farmacêutico, e SaaS — produtos com milhões de usuários, segurança rigorosa e nenhuma margem para indisponibilidade — além de apps de consumo para varejo, restaurantes e academias.",
      "Minha especialidade é engenharia frontend em escala enterprise: arquitetura Angular, Micro Frontends, design systems, performance e acessibilidade. Sou igualmente confortável no backend com Python, C#/.NET, Node.js e integrações em Kotlin, e lidero times como Tech Lead quando o projeto pede.",
      "Hoje meu foco é engenharia de IA — LLMs, RAG, padrões agênticos, evals e fine-tuning — pela minha própria consultoria, a Herrmann IT Consultoria. Em 2020 fundei o Projeto Dev, um projeto social que ajuda pessoas a conseguirem o primeiro emprego em tecnologia.",
    ],
    location: "Novo Hamburgo, RS — Brasil",
    availabilityText: "Aberto a oportunidades como Lead AI Engineer e Tech Lead — remoto, Brasil e exterior.",
    companyTagline: "Engenharia frontend, desenvolvimento fullstack e arquitetura de aplicações.",
    stats: [
      { value: "12+", label: "anos entregando software (desde 2014)" },
      { value: "1M+", label: "usuários no super app bancário em que trabalhei" },
      { value: "−50%", label: "no tempo de carregamento com cache (Pharmalink)" },
      { value: "20+", label: "empresas e produtos entregues" },
    ],
    skillGroups: ["IA & LLM", "Frontend", "Backend", "Mobile", "Dados & Infra"],
    education: [
      { period: "2023", title: "Pós-graduação — Biotecnologia", school: "Faculdade Metropolitana do Estado de São Paulo" },
      { period: "2022", title: "Pós-graduação — Segurança da Informação", school: "CENES" },
      { period: "2019 – 2023", title: "Bacharelado em Sistemas de Informação", school: "FADERGS" },
      { period: "2019 – 2022", title: "Tecnólogo — Sistemas para Internet", school: "Faculdade das Américas (FAM)" },
      { period: "2020 – 2021", title: "MBA — Desenvolvimento Mobile", school: "PROMINAS" },
      { period: "2017 – 2019", title: "Tecnólogo — Gestão da Tecnologia da Informação", school: "UNICESUMAR" },
    ],
    languages: [
      { name: "Português", level: "Nativo" },
      { name: "Inglês", level: "Avançado" },
      { name: "Espanhol", level: "Técnico" },
    ],
    seo: {
      title: "Herrmann — Lead AI Engineer · Especialista Fullstack e Frontend",
      description:
        "Portfólio de Herrmann (Gabriel Herrmann Grecchi): plataformas de missão crítica para bancos, saúde e tecnologia, arquitetura frontend enterprise e engenharia de IA.",
    },
  },
  es: {
    headline: "Lead AI Engineer · Especialista Fullstack y Frontend",
    roles: ["Lead AI Engineer", "Especialista Frontend", "Ingeniero Fullstack", "Tech Lead"],
    intro:
      "Construyo plataformas de misión crítica para banca, salud y tecnología — arquitectura frontend empresarial, backends escalables y, desde 2020, productos con IA y LLMs.",
    bio: [
      "Puedes llamarme Herrmann — en los papeles, Gabriel Herrmann Grecchi. Desarrollador fullstack desde 2014, móvil desde 2017, Web3 e IA desde 2020. La mayor parte de mi trabajo ha sido en plataformas de misión crítica en banca y finanzas, salud y farmacéutica, y SaaS — productos con millones de usuarios, seguridad estricta y ningún margen para caídas — además de apps de consumo para retail, restaurantes y gimnasios.",
      "Mi especialidad es la ingeniería frontend a escala empresarial: arquitectura Angular, Micro Frontends, design systems, rendimiento y accesibilidad. Me desenvuelvo igual de bien en el backend con Python, C#/.NET, Node.js e integraciones en Kotlin, y lidero equipos como Tech Lead cuando el proyecto lo requiere.",
      "Hoy me enfoco en ingeniería de IA — LLMs, RAG, patrones agénticos, evals y fine-tuning — a través de mi propia consultora, Herrmann IT Consultoria. En 2020 fundé Projeto Dev, un proyecto social que ayuda a personas a conseguir su primer empleo en tecnología.",
    ],
    location: "Novo Hamburgo, RS — Brasil",
    availabilityText: "Abierto a oportunidades como Lead AI Engineer y Tech Lead — remoto, Brasil e internacional.",
    companyTagline: "Ingeniería frontend, desarrollo fullstack y arquitectura de aplicaciones.",
    stats: [
      { value: "12+", label: "años entregando software (desde 2014)" },
      { value: "1M+", label: "usuarios en la super app bancaria en la que trabajé" },
      { value: "−50%", label: "en tiempo de carga gracias al caché (Pharmalink)" },
      { value: "20+", label: "empresas y productos entregados" },
    ],
    skillGroups: ["IA & LLM", "Frontend", "Backend", "Móvil", "Datos & Infra"],
    education: [
      { period: "2023", title: "Posgrado — Biotecnología", school: "Faculdade Metropolitana do Estado de São Paulo" },
      { period: "2022", title: "Posgrado — Seguridad de la Información", school: "CENES" },
      { period: "2019 – 2023", title: "Licenciatura en Sistemas de Información", school: "FADERGS" },
      { period: "2019 – 2022", title: "Tecnólogo — Sistemas para Internet", school: "Faculdade das Américas (FAM)" },
      { period: "2020 – 2021", title: "MBA — Desarrollo Móvil", school: "PROMINAS" },
      { period: "2017 – 2019", title: "Tecnólogo — Gestión de TI", school: "UNICESUMAR" },
    ],
    languages: [
      { name: "Portugués", level: "Nativo" },
      { name: "Inglés", level: "Avanzado" },
      { name: "Español", level: "Técnico" },
    ],
    seo: {
      title: "Herrmann — Lead AI Engineer · Especialista Fullstack y Frontend",
      description:
        "Portafolio de Herrmann (Gabriel Herrmann Grecchi): plataformas de misión crítica para banca, salud y tecnología, arquitectura frontend empresarial e ingeniería de IA.",
    },
  },
  zh: {
    headline: "首席 AI 工程师 · 全栈与前端专家",
    roles: ["首席 AI 工程师", "前端专家", "全栈工程师", "技术负责人"],
    intro: "我为银行、医疗和科技行业打造关键业务平台——企业级前端架构、可扩展的后端，以及自 2020 年起的 AI 与大语言模型产品。",
    bio: [
      "叫我 Herrmann 就好——正式全名是 Gabriel Herrmann Grecchi。我从 2014 年开始做全栈开发，2017 年开始做移动端，2020 年起涉足 Web3 与 AI。我的大部分工作集中在银行与金融、医疗与制药以及 SaaS 领域的关键业务平台——拥有数百万用户、安全要求严格、不允许宕机的产品——此外还有面向零售、餐饮和健身行业的消费级应用。",
      "我的专长是企业级规模的前端工程：Angular 架构、微前端、设计系统、性能与无障碍。我在后端同样得心应手，熟悉 Python、C#/.NET、Node.js 以及 Kotlin 集成；项目需要时，我也会以技术负责人的身份带领团队。",
      "如今我专注于 AI 工程——大语言模型、RAG、智能体模式、评测与微调——通过我自己的咨询公司 Herrmann IT Consultoria 开展工作。2020 年，我创立了 Projeto Dev，一个帮助人们获得第一份科技工作的公益项目。",
    ],
    location: "巴西南里奥格兰德州新汉堡",
    availabilityText: "正在寻找首席 AI 工程师和技术负责人机会——远程，巴西及海外均可。",
    companyTagline: "前端工程、全栈开发与应用架构。",
    stats: [
      { value: "12+", label: "年软件交付经验（始于 2014 年）" },
      { value: "1M+", label: "我参与的银行超级应用的用户数" },
      { value: "−50%", label: "通过缓存缩短的加载时间（Pharmalink）" },
      { value: "20+", label: "家已交付的公司与产品" },
    ],
    skillGroups: ["AI 与大语言模型", "前端", "后端", "移动端", "数据与基础设施"],
    education: [
      { period: "2023", title: "研究生课程 — 生物技术", school: "Faculdade Metropolitana do Estado de São Paulo" },
      { period: "2022", title: "研究生课程 — 信息安全", school: "CENES" },
      { period: "2019 – 2023", title: "信息系统学士", school: "FADERGS" },
      { period: "2019 – 2022", title: "专科 — 互联网系统", school: "Faculdade das Américas (FAM)" },
      { period: "2020 – 2021", title: "MBA — 移动开发", school: "PROMINAS" },
      { period: "2017 – 2019", title: "专科 — IT 管理", school: "UNICESUMAR" },
    ],
    languages: [
      { name: "葡萄牙语", level: "母语" },
      { name: "英语", level: "高级" },
      { name: "西班牙语", level: "技术交流" },
    ],
    seo: {
      title: "Herrmann — 首席 AI 工程师 · 全栈与前端专家",
      description: "Herrmann（Gabriel Herrmann Grecchi）的作品集：银行、医疗与科技行业的关键业务平台、企业级前端架构和 AI 工程。",
    },
  },
};
