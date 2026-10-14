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
      title: "Desenvolvedor Fullstack · Especialista Frontend",
      products: ["Super app bancário", "Tesouraria PJ", "Corretora de investimentos"],
      summary:
        "Especialista frontend em um super app bancário usado por milhões de pessoas — tesouraria PJ e corretora de investimentos, onde cada tela movimenta dinheiro de verdade e segurança, performance e confiabilidade não são negociáveis.",
      description:
        "A Zup é a empresa de tecnologia do grupo Itaú Unibanco — fundada em 2011, adquirida pelo Itaú em 2019 e hoje atendendo mais de 60 grandes clientes com engenharia acelerada por IA.\n\nEntrei em um squad dentro de um dos maiores super apps bancários do Brasil, construindo a plataforma de tesouraria PJ e a experiência da corretora de investimentos. O frontend era Angular enterprise sobre um design system proprietário, combinado com Angular Material, Tailwind CSS e BEM, mantendo cada tela consistente em todo o produto.\n\nMantive os contratos de API com o backend em Kotlin bem definidos, e cada mudança passava por code review, testes automatizados e verificações de segurança. Produto, UX e engenharia decidiam juntos os trade-offs difíceis — e eu levava a visão do frontend para essas decisões.",
      highlights: [
        "Super app bancário usado por milhões de clientes",
        "Plataformas de tesouraria PJ e corretora de investimentos",
        "Angular enterprise sobre design system proprietário, com Angular Material, Tailwind CSS e BEM",
        "Performance, acessibilidade e UX em fluxos de missão crítica que movimentam dinheiro",
        "Contratos de API bem definidos com backend em Kotlin",
        "Cultura de qualidade: code review, testes automatizados, segurança e manutenibilidade",
      ],
    },
    es: {
      title: "Desarrollador Fullstack · Especialista Frontend",
      products: ["Super app bancaria", "Tesorería empresarial", "Bróker de inversiones"],
      summary:
        "Especialista frontend en una super app bancaria usada por millones de personas — tesorería empresarial y bróker de inversiones, donde cada pantalla mueve dinero real y la seguridad, el rendimiento y la fiabilidad no se negocian.",
      description:
        "Zup es la empresa de tecnología del grupo Itaú Unibanco — fundada en 2011, adquirida por Itaú en 2019 y que hoy atiende a más de 60 grandes clientes con ingeniería acelerada por IA.\n\nMe sumé a un squad dentro de una de las mayores super apps bancarias de Brasil, construyendo la plataforma de tesorería empresarial y la experiencia del bróker de inversiones. El frontend era Angular empresarial sobre un design system propietario, junto a Angular Material, Tailwind CSS y BEM, manteniendo cada pantalla coherente en todo el producto.\n\nMantuve bien definidos los contratos de API con el backend en Kotlin, y cada cambio pasaba por code review, pruebas automatizadas y controles de seguridad. Producto, UX e ingeniería decidían juntos los trade-offs difíciles — y yo aportaba la visión del frontend a esas decisiones.",
      highlights: [
        "Super app bancaria usada por millones de clientes",
        "Plataformas de tesorería empresarial y bróker de inversiones",
        "Angular empresarial sobre un design system propietario, con Angular Material, Tailwind CSS y BEM",
        "Rendimiento, accesibilidad y UX en flujos críticos que mueven dinero",
        "Contratos de API bien definidos con un backend en Kotlin",
        "Cultura de calidad: code review, pruebas automatizadas, seguridad y mantenibilidad",
      ],
    },
    zh: {
      title: "全栈开发工程师 · 前端专家",
      products: ["银行超级应用", "企业资金管理", "投资经纪平台"],
      summary: "在一款数百万人使用的银行超级应用中担任前端专家——负责企业资金管理与投资经纪平台。每个界面都在处理真金白银，安全、性能与可靠性没有任何妥协余地。",
      description:
        "Zup 是伊塔乌联合银行（Itaú Unibanco）集团旗下的科技公司——成立于 2011 年，2019 年被 Itaú 收购，如今以 AI 加速的工程能力服务 60 多家大型客户。\n\n我加入了巴西最大银行超级应用之一的一个敏捷小组，负责构建企业资金管理平台和投资经纪体验。前端采用基于专有设计系统的企业级 Angular，结合 Angular Material、Tailwind CSS 和 BEM，确保整个产品的界面保持一致。\n\n我与 Kotlin 后端保持清晰明确的 API 契约，每一次变更都经过代码评审、自动化测试和安全检查。产品、UX 与工程团队共同做出艰难的权衡决策——我在其中代表前端视角。",
      highlights: [
        "数百万客户使用的银行超级应用",
        "企业资金管理与投资经纪平台",
        "基于专有设计系统的企业级 Angular，结合 Angular Material、Tailwind CSS 与 BEM",
        "涉及资金流转的关键流程中的性能、无障碍与用户体验",
        "与 Kotlin 后端之间定义清晰的 API 契约",
        "质量文化：代码评审、自动化测试、安全与可维护性",
      ],
    },
  },
  deal: {
    pt: {
      title: "Desenvolvedor Fullstack · Especialista Frontend",
      products: ["Plataformas de internet banking", "Micro Frontends"],
      summary:
        "Internet banking para duas instituições financeiras em arquitetura de Micro Frontends — fui a referência frontend que definiu os padrões de código e arquitetura sobre os quais os dois produtos foram construídos.",
      description:
        "A Deal Technologies constrói tecnologia para negócios altamente regulados desde 2004 — B3, bancos e empresas de pagamento entre eles.\n\nTrabalhei nas plataformas web bancárias de dois clientes do setor financeiro. As duas rodavam em Micro Frontends: cada domínio bancário vive em sua própria aplicação, faz deploy no seu próprio ritmo e não quebra os outros. Como referência técnica de frontend, defini os padrões de código e arquitetura e construí interfaces reutilizáveis e acessíveis com Angular e Angular Material.\n\nNo backend, integrei com serviços Python via ORM e elevei continuamente o nível de performance, segurança e cobertura de testes.",
      highlights: [
        "Plataformas de internet banking para dois clientes do setor financeiro",
        "Arquitetura de Micro Frontends: domínios isolados e deploys independentes",
        "Referência técnica de frontend — padrões de código e arquitetura",
        "Componentes reutilizáveis e acessíveis em Angular e Angular Material",
        "Integração com backend Python via ORM",
      ],
    },
    es: {
      title: "Desarrollador Fullstack · Especialista Frontend",
      products: ["Plataformas de banca web", "Micro Frontends"],
      summary:
        "Banca web para dos instituciones financieras sobre una arquitectura de Micro Frontends — fui el referente frontend que definió los estándares de código y arquitectura sobre los que se construyeron ambos productos.",
      description:
        "Deal Technologies construye tecnología para negocios altamente regulados desde 2004 — entre ellos B3, bancos y empresas de pagos.\n\nTrabajé en las plataformas de banca web de dos clientes del sector financiero. Ambas funcionaban con Micro Frontends: cada dominio bancario vive en su propia aplicación, se despliega a su propio ritmo y no rompe a los demás. Como referente técnico de frontend, definí los estándares de código y arquitectura y construí interfaces reutilizables y accesibles con Angular y Angular Material.\n\nEn el backend, integré servicios en Python mediante un ORM y elevé de forma continua el nivel de rendimiento, seguridad y cobertura de pruebas.",
      highlights: [
        "Plataformas de banca web para dos clientes del sector financiero",
        "Arquitectura de Micro Frontends: dominios aislados y despliegues independientes",
        "Referente técnico de frontend — estándares de código y arquitectura",
        "Componentes reutilizables y accesibles en Angular y Angular Material",
        "Integración con backend en Python mediante ORM",
      ],
    },
    zh: {
      title: "全栈开发工程师 · 前端专家",
      products: ["网上银行平台", "微前端"],
      summary: "基于微前端架构，为两家金融机构打造网上银行——我担任前端技术标杆，制定了两款产品共同遵循的代码与架构规范。",
      description:
        "Deal Technologies 自 2004 年起为高度受监管的行业打造技术，客户包括巴西证券交易所 B3、银行和支付公司。\n\n我参与了两家金融行业客户的网上银行平台建设。两者都运行在微前端之上：每个银行业务领域都是独立的应用，按自己的节奏部署，互不影响。作为前端技术标杆，我制定了代码与架构规范，并使用 Angular 和 Angular Material 构建可复用、无障碍的界面。\n\n在后端方面，我通过 ORM 与 Python 服务集成，并持续提升性能、安全性和测试覆盖率。",
      highlights: ["为两家金融行业客户打造网上银行平台", "微前端架构：领域隔离、独立部署", "前端技术标杆——代码与架构规范", "基于 Angular 与 Angular Material 的可复用、无障碍组件", "通过 ORM 与 Python 后端集成"],
    },
  },
  taqtaq: {
    pt: {
      products: ["App TaqTaq (iOS · Android)", "B2C · B2B · Eventos"],
      summary:
        "Tech Lead do novo app multiplataforma da TaqTaq — cartões de visita digitais compartilhados por QR, NFC e proximidade — do conceito à App Store e ao Google Play, dentro do prazo e do orçamento.",
      description:
        "O TaqTaq transforma o cartão de visita de papel em um contato vivo: cartões digitais ilimitados, compartilhamento por QR code, NFC ou proximidade, notificações de alteração, integração com CRM e dez idiomas — para pessoas (B2C), empresas (B2B) e eventos.\n\nLiderei a construção da nova versão multiplataforma do conceito à produção. Fui responsável pela arquitetura, pelo plano técnico e pelas prioridades, e escrevi boa parte do código Flutter.\n\nDuas coisas mudaram a forma como o time entregava: a adoção de práticas ágeis — que aumentou em mais de 20% a taxa de conclusão de projetos — e a mentoria dos desenvolvedores juniores, que elevou a qualidade do código e a maturidade técnica do time.",
      highlights: [
        "Liderei um novo app multiplataforma do conceito à produção",
        "Responsável pela arquitetura, planejamento técnico e priorização",
        "Desenvolvimento hands-on em Flutter (Dart) para iOS e Android",
        "Práticas ágeis que elevaram a conclusão de projetos em mais de 20%",
        "Mentoria de desenvolvedores juniores, elevando qualidade e maturidade",
      ],
      metrics: [{ value: "+20%", label: "taxa de conclusão de projetos após adoção de práticas ágeis" }],
    },
    es: {
      products: ["App TaqTaq (iOS · Android)", "B2C · B2B · Eventos"],
      summary:
        "Tech Lead de la nueva app multiplataforma de TaqTaq — tarjetas de presentación digitales compartidas por QR, NFC y proximidad — del concepto a App Store y Google Play, en plazo y presupuesto.",
      description:
        "TaqTaq convierte la tarjeta de presentación de papel en un contacto vivo: tarjetas digitales ilimitadas, envío por código QR, NFC o proximidad, avisos de cambios, integración con CRM y diez idiomas — para personas (B2C), empresas (B2B) y eventos.\n\nLideré la construcción de la nueva versión multiplataforma del concepto a producción. Fui responsable de la arquitectura, el plan técnico y las prioridades, y escribí buena parte del código en Flutter.\n\nDos cosas cambiaron la forma en que el equipo entregaba: adoptar prácticas ágiles — que aumentó en más de un 20% la tasa de proyectos concluidos — y la mentoría a los desarrolladores junior, que elevó la calidad del código y la madurez técnica del equipo.",
      highlights: [
        "Lideré una nueva app multiplataforma del concepto a producción",
        "Responsable de la arquitectura, la planificación técnica y la priorización",
        "Desarrollo práctico en Flutter (Dart) para iOS y Android",
        "Prácticas ágiles que elevaron más de un 20% los proyectos concluidos",
        "Mentoría a desarrolladores junior, elevando calidad y madurez",
      ],
      metrics: [{ value: "+20%", label: "tasa de finalización de proyectos tras adoptar prácticas ágiles" }],
    },
    zh: {
      title: "技术负责人",
      products: ["TaqTaq 应用（iOS · Android）", "B2C · B2B · 活动"],
      summary: "担任 TaqTaq 全新跨平台应用的技术负责人——通过二维码、NFC 和近距离分享的数字名片——从概念到登陆 App Store 与 Google Play，按时且不超预算。",
      description:
        "TaqTaq 让纸质名片变成鲜活的联系人：无限数量的数字名片，可通过二维码、NFC 或近距离分享，支持变更通知、CRM 集成和十种语言——面向个人（B2C）、企业（B2B）和活动场景。\n\n我主导了新版跨平台应用从概念到上线的全过程，负责架构、技术规划与优先级，并亲自编写了大量 Flutter 代码。\n\n有两件事改变了团队的交付方式：引入敏捷实践——使项目完成率提升 20% 以上；以及指导初级开发者——提高了代码质量和团队的技术成熟度。",
      highlights: ["主导新的跨平台应用从概念到上线", "负责架构、技术规划与优先级排序", "亲自使用 Flutter（Dart）开发 iOS 与 Android 应用", "敏捷实践使项目完成率提升 20% 以上", "指导初级开发者，提升代码质量与成熟度"],
      metrics: [{ value: "+20%", label: "采用敏捷实践后的项目完成率" }],
    },
  },
  ciandt: with_(FS_DEV, {
    pt: {
      products: ["Aplicações de crédito imobiliário", "Projetos cloud"],
      summary:
        "Projetos internacionais para grandes clientes financeiros e corporativos — aplicações de crédito imobiliário em Angular, C#/.NET e Python, e liderança técnica em projetos cloud que aumentaram o engajamento em 30% e reduziram o tempo de carregamento em 20%.",
      description:
        "A CI&T é uma empresa global de engenharia digital — listada na NYSE, com mais de 8.000 pessoas em mais de 25 países, atendendo algumas das maiores empresas do mundo.\n\nAtuei em projetos internacionais para grandes clientes dos setores financeiro e corporativo, incluindo aplicações de crédito imobiliário construídas com Angular, C#/.NET e Python — fluxos longos e regulados, em que uma etapa confusa custa um contrato.\n\nImplantei pipelines de CI/CD e práticas de testes, conduzi code reviews e documentei as convenções do time. Nos projetos cloud assumi a liderança técnica, e o resultado apareceu nos números: 30% mais engajamento de usuários e 20% menos tempo de carregamento.",
      highlights: [
        "Projetos internacionais para grandes empresas financeiras e corporativas",
        "Aplicações de crédito imobiliário (Angular, C#/.NET, Python)",
        "Pipelines de CI/CD, práticas de testes e qualidade",
        "Liderança técnica em projetos cloud",
        "Code reviews e boas práticas para todo o time",
      ],
      metrics: [
        { value: "+30%", label: "engajamento de usuários" },
        { value: "−20%", label: "tempo de carregamento" },
      ],
    },
    es: {
      products: ["Aplicaciones de crédito hipotecario", "Proyectos cloud"],
      summary:
        "Proyectos internacionales para grandes clientes financieros y corporativos — aplicaciones de crédito hipotecario en Angular, C#/.NET y Python, y liderazgo técnico en proyectos cloud que aumentaron la interacción un 30% y redujeron el tiempo de carga un 20%.",
      description:
        "CI&T es una empresa global de ingeniería digital — cotiza en la NYSE y reúne a más de 8.000 personas en más de 25 países, al servicio de algunas de las mayores empresas del mundo.\n\nTrabajé en proyectos internacionales para grandes clientes de los sectores financiero y corporativo, incluidas aplicaciones de crédito hipotecario construidas con Angular, C#/.NET y Python — flujos largos y regulados, donde un paso confuso cuesta un contrato.\n\nImplanté pipelines de CI/CD y prácticas de pruebas, realicé code reviews y documenté las convenciones del equipo. En los proyectos cloud asumí el liderazgo técnico, y el resultado se vio en los números: 30% más interacción de usuarios y 20% menos tiempo de carga.",
      highlights: [
        "Proyectos internacionales para grandes empresas financieras y corporativas",
        "Aplicaciones de crédito hipotecario (Angular, C#/.NET, Python)",
        "Pipelines de CI/CD, prácticas de pruebas y calidad",
        "Liderazgo técnico en proyectos cloud",
        "Code reviews y buenas prácticas para todo el equipo",
      ],
      metrics: [
        { value: "+30%", label: "interacción de usuarios" },
        { value: "−20%", label: "tiempo de carga" },
      ],
    },
    zh: {
      products: ["房地产信贷应用", "云项目"],
      summary: "为大型金融与企业客户开展国际项目——使用 Angular、C#/.NET 和 Python 构建房地产信贷应用，并在云项目中担任技术负责人，使用户参与度提升 30%、加载时间缩短 20%。",
      description:
        "CI&T 是一家全球数字工程公司——在纽约证券交易所上市，拥有 8,000 多名员工，业务遍及 25 个以上国家，服务全球众多大型企业。\n\n我参与了面向金融与企业领域大型客户的国际项目，包括使用 Angular、C#/.NET 和 Python 构建的房地产信贷应用——流程长且受监管，任何一步让用户困惑都可能失去一份合同。\n\n我搭建了 CI/CD 流水线和测试实践，主持代码评审并整理团队规范。在云项目中我担任技术负责人，成果体现在数字上：用户参与度提升 30%，加载时间缩短 20%。",
      highlights: ["为大型金融与企业客户开展国际项目", "房地产信贷应用（Angular、C#/.NET、Python）", "CI/CD 流水线、测试与质量实践", "云项目技术负责人", "代码评审与团队最佳实践"],
      metrics: [
        { value: "+30%", label: "用户参与度" },
        { value: "−20%", label: "加载时间" },
      ],
    },
  }),
  "pharmalink-ecs": {
    pt: {
      title: "Desenvolvedor Fullstack · Líder Frontend",
      via: "na ECS Inovação, para a InterPlayers",
      products: ["Pharmalink Online", "Ciclo Financeiro", "AngularJS → Angular 14"],
      summary:
        "Responsável técnico pelo Pharmalink Online, o hub que conecta a indústria farmacêutica brasileira a distribuidores e farmácias. Liderei sua migração completa de AngularJS 1.8 para Angular 14 e reduzi o tempo de carregamento em até 50%.",
      description:
        "O Pharmalink, da InterPlayers, é onde a indústria farmacêutica vende para o mercado: um hub que conecta fabricantes, mais de 650 centros de distribuição e mais de 73 mil farmácias em todos os estados — 18 milhões de pedidos e R$ 21 bilhões transacionados só em 2023. A ECS Inovação, parceira da InterPlayers, conduzia a engenharia, e eu era o responsável técnico pela evolução do Pharmalink Online.\n\nO ponto central foi liderar a migração completa do frontend de AngularJS 1.8.2 para Angular 14 — numa plataforma em produção que não podia parar de vender. Isso significou nova arquitetura, base de código modernizada e grande redução de dívida técnica, orientando desenvolvedores menos experientes para que a migração fosse entregue mais rápido.\n\nTambém atuei diretamente no Ciclo Financeiro — o motor de cálculo por trás de regras comerciais críticas —, no backend e nas integrações, e introduzi estratégias de cache que reduziram o tempo de carregamento em até 50%.",
      highlights: [
        "Responsável técnico pelo Pharmalink Online, o hub comercial da indústria farmacêutica",
        "Liderei a migração completa de AngularJS 1.8.2 → Angular 14 com a plataforma em produção",
        "Contribuição direta no motor de cálculo do Ciclo Financeiro",
        "Backend, APIs RESTful e integrações de sistemas",
        "Estratégias de cache que reduziram o tempo de carregamento em até 50%",
        "Referência técnica e mentor de desenvolvedores menos experientes",
      ],
      metrics: [{ value: "−50%", label: "tempo de carregamento com estratégias de cache" }],
    },
    es: {
      title: "Desarrollador Fullstack · Líder Frontend",
      via: "en ECS Inovação, para InterPlayers",
      products: ["Pharmalink Online", "Ciclo Financiero", "AngularJS → Angular 14"],
      summary:
        "Responsable técnico de Pharmalink Online, el hub que conecta la industria farmacéutica brasileña con distribuidores y farmacias. Lideré su migración completa de AngularJS 1.8 a Angular 14 y reduje el tiempo de carga hasta un 50%.",
      description:
        "Pharmalink, de InterPlayers, es donde la industria farmacéutica vende al mercado: un hub que conecta fabricantes, más de 650 centros de distribución y más de 73.000 farmacias en todos los estados de Brasil — 18 millones de pedidos y R$ 21 mil millones transaccionados solo en 2023. ECS Inovação, socia de InterPlayers, llevaba la ingeniería, y yo era el responsable técnico de la evolución de Pharmalink Online.\n\nLa pieza central fue liderar la migración completa del frontend de AngularJS 1.8.2 a Angular 14 — en una plataforma en producción que no podía dejar de vender. Eso significó nueva arquitectura, código modernizado y una gran reducción de deuda técnica, guiando a desarrolladores menos experimentados para que la migración se entregara más rápido.\n\nTambién trabajé directamente en el Ciclo Financiero — el motor de cálculo detrás de reglas comerciales críticas —, en el backend y en las integraciones, e introduje estrategias de caché que redujeron el tiempo de carga hasta un 50%.",
      highlights: [
        "Responsable técnico de Pharmalink Online, el hub comercial de la industria farmacéutica",
        "Lideré la migración completa de AngularJS 1.8.2 → Angular 14 con la plataforma en producción",
        "Contribución directa al motor de cálculo del Ciclo Financiero",
        "Backend, APIs RESTful e integraciones de sistemas",
        "Estrategias de caché que redujeron el tiempo de carga hasta un 50%",
        "Referente técnico y mentor de desarrolladores menos experimentados",
      ],
      metrics: [{ value: "−50%", label: "tiempo de carga con estrategias de caché" }],
    },
    zh: {
      title: "全栈开发工程师 · 前端负责人",
      via: "任职于 ECS Inovação，服务 InterPlayers",
      products: ["Pharmalink Online", "财务周期引擎", "AngularJS → Angular 14"],
      summary: "Pharmalink Online 的技术负责人——这一枢纽连接着巴西制药行业与分销商和药店。我主导了它从 AngularJS 1.8 到 Angular 14 的完整迁移，并将加载时间最多缩短 50%。",
      description:
        "InterPlayers 旗下的 Pharmalink 是巴西制药行业面向市场销售的核心平台：它连接制药厂商、650 多个配送中心和遍布全国各州的 73,000 多家药店——仅 2023 年就处理了 1,800 万笔订单、交易额达 210 亿雷亚尔。InterPlayers 的合作伙伴 ECS Inovação 负责工程研发，而我是 Pharmalink Online 技术演进的负责人。\n\n核心工作是主导前端从 AngularJS 1.8.2 到 Angular 14 的完整迁移——而且是在一个不能停止交易的线上平台上完成的。这意味着全新的架构、现代化的代码库和大幅削减的技术债，同时我指导经验较少的开发者，加快了迁移交付。\n\n我还直接参与了财务周期——支撑关键商业规则的计算引擎——以及后端与系统集成工作，并引入缓存策略，使加载时间最多缩短 50%。",
      highlights: [
        "Pharmalink Online（制药行业商业枢纽）技术负责人",
        "在平台持续运行的情况下主导 AngularJS 1.8.2 → Angular 14 完整迁移",
        "直接参与财务周期计算引擎开发",
        "后端、RESTful API 与系统集成",
        "缓存策略使加载时间最多缩短 50%",
        "前端技术标杆，指导经验较少的开发者",
      ],
      metrics: [{ value: "−50%", label: "借助缓存策略缩短的加载时间" }],
    },
  },
  "herrmann-it-consultoria": {
    pt: {
      title: "Fundador · Engenheiro de Software · Especialista Frontend",
      products: ["Consultoria", "Engenharia frontend", "Fullstack", "Liderança técnica"],
      summary:
        "Minha própria consultoria, desde 2013. Por ela entreguei para PicPay, Grupo Madero, Lojas Lebes, Pacto, upLexis, Pernambucanas, Milvus e outros — como Engenheiro Frontend, Engenheiro Fullstack ou Tech Lead, conforme o projeto precisa.",
      description:
        "A Herrmann IT Consultoria é como trabalho diretamente com clientes, no Brasil e no exterior. Todo projeto começa com a mesma pergunta — do que este produto precisa da engenharia agora? — e eu entro como Engenheiro Frontend, Engenheiro Fullstack ou Tech Lead de acordo com a resposta.\n\nO trabalho é, em sua maioria, em projetos estratégicos de médio e grande porte: sistemas enterprise, fluxos de missão crítica e produtos de consumo com alto tráfego. As constantes são qualidade de código, performance, escalabilidade, segurança e uma arquitetura frontend que o próprio time do cliente consiga continuar evoluindo depois que eu saio.\n\nClientes selecionados: PicPay (via Sciensa), os apps do Grupo Madero e da Lojas Lebes, Pacto Soluções (Engenharia do Corpo e Usina do Corpo), upLexis (upMiner e upLink), Pernambucanas (via Cliqx), Milvus, Maxxidata, Facepass, UDS (Broadcast OTC) e Inform / Ekantika — todos estão no arquivo abaixo.",
      highlights: [
        "Consultor (PJ) em projetos estratégicos de médio e grande porte",
        "Engenheiro Frontend, Engenheiro Fullstack ou Tech Lead conforme a necessidade de cada cliente",
        "Apps de consumo publicados na App Store e no Google Play",
        "Produtos enterprise, de missão crítica e alto tráfego",
        "Clientes em bancos, fintech, varejo, restaurantes, fitness, compliance e SaaS",
      ],
    },
    es: {
      title: "Fundador · Ingeniero de Software · Especialista Frontend",
      products: ["Consultoría", "Ingeniería frontend", "Fullstack", "Liderazgo técnico"],
      summary:
        "Mi propia consultora, desde 2013. A través de ella he entregado para PicPay, Grupo Madero, Lojas Lebes, Pacto, upLexis, Pernambucanas, Milvus y más — como Ingeniero Frontend, Ingeniero Fullstack o Tech Lead, según lo que pida el proyecto.",
      description:
        "Herrmann IT Consultoria es la forma en que trabajo directamente con clientes, en Brasil y en el exterior. Cada proyecto empieza con la misma pregunta — ¿qué necesita este producto de la ingeniería ahora? — y entro como Ingeniero Frontend, Ingeniero Fullstack o Tech Lead según la respuesta.\n\nEl trabajo es, en su mayoría, en proyectos estratégicos medianos y grandes: sistemas empresariales, flujos de misión crítica y productos de consumo con mucho tráfico. Las constantes son calidad de código, rendimiento, escalabilidad, seguridad y una arquitectura frontend que el propio equipo del cliente pueda seguir evolucionando cuando me voy.\n\nClientes seleccionados: PicPay (vía Sciensa), las apps de Grupo Madero y Lojas Lebes, Pacto Soluções (Engenharia do Corpo y Usina do Corpo), upLexis (upMiner y upLink), Pernambucanas (vía Cliqx), Milvus, Maxxidata, Facepass, UDS (Broadcast OTC) e Inform / Ekantika — todos están en el archivo más abajo.",
      highlights: [
        "Consultor independiente en proyectos estratégicos medianos y grandes",
        "Ingeniero Frontend, Ingeniero Fullstack o Tech Lead según lo que necesite cada cliente",
        "Apps de consumo publicadas en App Store y Google Play",
        "Productos empresariales, de misión crítica y alto tráfico",
        "Clientes en banca, fintech, retail, restaurantes, fitness, cumplimiento y SaaS",
      ],
    },
    zh: {
      title: "创始人 · 软件工程师 · 前端专家",
      products: ["咨询", "前端工程", "全栈", "技术领导"],
      summary: "我自 2013 年创办的咨询公司。通过它，我为 PicPay、Grupo Madero、Lojas Lebes、Pacto、upLexis、Pernambucanas、Milvus 等客户交付项目——根据项目需要担任前端工程师、全栈工程师或技术负责人。",
      description:
        "Herrmann IT Consultoria 是我直接服务巴西及海外客户的方式。每个项目都从同一个问题开始——这个产品此刻最需要工程上的什么？——然后我以前端工程师、全栈工程师或技术负责人的身份投入其中。\n\n工作主要集中在中大型战略项目：企业级系统、关键业务流程和高流量的消费级产品。始终不变的是代码质量、性能、可扩展性、安全性，以及一套在我离开后客户团队仍能持续演进的前端架构。\n\n部分客户：PicPay（经由 Sciensa）、Grupo Madero 与 Lojas Lebes 的应用、Pacto Soluções（Engenharia do Corpo 和 Usina do Corpo）、upLexis（upMiner 与 upLink）、Pernambucanas（经由 Cliqx）、Milvus、Maxxidata、Facepass、UDS（Broadcast OTC）以及 Inform / Ekantika——详见下方履历。",
      highlights: [
        "以独立顾问身份参与中大型战略项目",
        "根据客户需要担任前端工程师、全栈工程师或技术负责人",
        "已在 App Store 与 Google Play 上线的消费级应用",
        "企业级、关键业务与高流量产品",
        "客户覆盖银行、金融科技、零售、餐饮、健身、合规与 SaaS",
      ],
    },
  },

  /* ---------------- Clients ---------------- */
  "pacto-solucoes": {
    pt: {
      title: "Engenheiro Frontend",
      products: ["App Engenharia do Corpo (EC PRO)", "App Usina do Corpo", "Hotsites das academias", "Hotsite de vendas da Pacto", "ZW"],
      summary:
        "Frontend da plataforma fitness da Pacto — os apps de alunos de duas das maiores redes de academias do Sul do Brasil, Engenharia do Corpo e Usina do Corpo, seus hotsites, o hotsite de vendas da Pacto e o sistema de gestão ZW.",
      description:
        "A Pacto Soluções desenvolve a plataforma de gestão por trás de academias e negócios fitness em todo o Brasil — vendas, contratos, treinos e os apps que os alunos levam no bolso.\n\nTrabalhei nos apps personalizados que a Pacto entrega às redes: o app da Engenharia do Corpo (EC PRO) e o app da Usina do Corpo. Neles, os alunos seguem os treinos prescritos pelos professores, com cargas e repetições, acompanham suas avaliações físicas, agendam aulas, fazem check-in e gerenciam seus contratos. O EC PRO tem nota 4,8 na App Store, dada por mais de mil alunos.\n\nTambém construí os hotsites das redes — planos, unidades e matrícula online — e o hotsite de vendas da própria Pacto, e contribuí com o frontend do ZW, o sistema de gestão web da Pacto.",
      highlights: [
        "Apps de alunos da Engenharia do Corpo (EC PRO) e da Usina do Corpo",
        "Treinos com cargas e repetições, avaliações, agendamento de aulas, check-in e contratos",
        "Hotsites das redes de academias: planos, unidades e matrícula online",
        "Hotsite de vendas da Pacto",
        "Frontend do ZW, o sistema de gestão web da Pacto",
      ],
    },
    es: {
      title: "Ingeniero Frontend",
      products: ["App Engenharia do Corpo (EC PRO)", "App Usina do Corpo", "Hotsites de los gimnasios", "Hotsite de ventas de Pacto", "ZW"],
      summary:
        "Frontend de la plataforma fitness de Pacto — las apps para socios de dos de las mayores cadenas de gimnasios del sur de Brasil, Engenharia do Corpo y Usina do Corpo, sus hotsites, el hotsite de ventas de Pacto y el sistema de gestión ZW.",
      description:
        "Pacto Soluções desarrolla la plataforma de gestión detrás de gimnasios y negocios fitness en todo Brasil — ventas, contratos, entrenamientos y las apps que los socios llevan en el bolsillo.\n\nTrabajé en las apps personalizadas que Pacto entrega a las cadenas: la app de Engenharia do Corpo (EC PRO) y la app de Usina do Corpo. En ellas, los socios siguen los entrenamientos que prescriben sus instructores, con cargas y repeticiones, consultan sus evaluaciones físicas, reservan clases, hacen check-in y gestionan sus contratos. EC PRO tiene una nota de 4,8 en App Store, otorgada por más de mil socios.\n\nTambién construí los hotsites de las cadenas — planes, sedes e inscripción online — y el hotsite de ventas de la propia Pacto, y contribuí al frontend de ZW, el sistema de gestión web de Pacto.",
      highlights: [
        "Apps para socios de Engenharia do Corpo (EC PRO) y Usina do Corpo",
        "Entrenamientos con cargas y repeticiones, evaluaciones, reserva de clases, check-in y contratos",
        "Hotsites de las cadenas de gimnasios: planes, sedes e inscripción online",
        "Hotsite de ventas de Pacto",
        "Frontend de ZW, el sistema de gestión web de Pacto",
      ],
    },
    zh: {
      title: "前端工程师",
      products: ["Engenharia do Corpo 应用（EC PRO）", "Usina do Corpo 应用", "健身房官网落地页", "Pacto 销售落地页", "ZW"],
      summary: "负责 Pacto 健身平台的前端——巴西南部两大连锁健身房 Engenharia do Corpo 和 Usina do Corpo 的会员应用、它们的官网落地页、Pacto 自己的销售落地页以及 ZW 管理系统。",
      description:
        "Pacto Soluções 为巴西各地的健身房和健身企业打造管理平台——涵盖销售、合同、训练计划，以及会员随身携带的应用。\n\n我参与了 Pacto 为连锁品牌定制的会员应用：Engenharia do Corpo 应用（EC PRO）和 Usina do Corpo 应用。会员可以按照教练制定的训练计划（包括重量和次数）进行训练，查看体测结果，预约课程、签到并管理合同。EC PRO 在 App Store 上获得了一千多名会员的 4.8 分评价。\n\n我还为这些连锁品牌搭建了官网落地页（会员方案、门店和在线报名），以及 Pacto 自己的销售落地页，并参与了 Pacto 的 Web 管理系统 ZW 的前端开发。",
      highlights: ["Engenharia do Corpo（EC PRO）与 Usina do Corpo 会员应用", "含重量与次数的训练计划、体测、课程预约、签到与合同", "连锁健身房官网落地页：会员方案、门店与在线报名", "Pacto 销售落地页", "Pacto 的 Web 管理系统 ZW 的前端"],
    },
  },
  "lojas-lebes": with_(APP_DEV, {
    pt: {
      products: ["App Lojas Lebes (iOS · Android)", "Crediário digital"],
      summary:
        "Trabalhei na criação do app da Lojas Lebes — o crediário, as parcelas e o empréstimo pessoal da tradicional varejista gaúcha de 70 anos, no bolso do cliente.",
      description:
        "A Lojas Lebes é uma tradicional rede de lojas de departamento do Rio Grande do Sul, que completa 70 anos — e seus clientes há muito tempo compram no crédito da própria loja, o crediário.\n\nTrabalhei na criação do app Lebes, que leva esse crédito do balcão para o celular: abrir o crediário, consultar o limite e cada parcela, gerar o boleto ou pagar pelo app e solicitar empréstimo pessoal. Em volta disso: compra online com retirada na loja, descontos exclusivos do app e localizador de lojas.",
      highlights: [
        "Participei da construção do app Lebes",
        "Crediário digital: abertura de conta, limite e pagamento de parcelas",
        "Empréstimo pessoal solicitado direto pelo celular",
        "Compra online com retirada na loja e descontos exclusivos do app",
        "Publicado na App Store e no Google Play",
      ],
    },
    es: {
      products: ["App Lojas Lebes (iOS · Android)", "Crédito digital"],
      summary:
        "Trabajé en la creación de la app de Lojas Lebes — el crédito de la tienda, las cuotas y los préstamos personales de la tradicional cadena gaúcha de 70 años, en el bolsillo del cliente.",
      description:
        "Lojas Lebes es una tradicional cadena de grandes almacenes de Rio Grande do Sul que cumple 70 años — y sus clientes llevan mucho tiempo comprando con el crédito de la propia tienda, el crediário.\n\nTrabajé en la creación de la app Lebes, que lleva ese crédito del mostrador al móvil: abrir la cuenta de crédito, consultar el límite y cada cuota, generar el boleto o pagar en la app y solicitar un préstamo personal. Alrededor de eso: compra online con retiro en tienda, descuentos exclusivos de la app y localizador de tiendas.",
      highlights: [
        "Participé en la construcción de la app Lebes",
        "Crédito digital: apertura de cuenta, límite y pago de cuotas",
        "Préstamos personales solicitados directamente desde el móvil",
        "Compra online con retiro en tienda y descuentos exclusivos de la app",
        "Publicada en App Store y Google Play",
      ],
    },
    zh: {
      products: ["Lojas Lebes 应用（iOS · Android）", "数字分期信用"],
      summary: "参与打造 Lojas Lebes 应用——把这家拥有 70 年历史的南里奥格兰德州传统零售商的分期信用、还款与个人贷款装进顾客的口袋。",
      description:
        "Lojas Lebes 是南里奥格兰德州一家传统百货连锁企业，今年迎来 70 周年——长期以来，顾客习惯使用门店自有的分期信用（crediário）购物。\n\n我参与了 Lebes 应用的开发，把这份信用从柜台搬到手机上：开通分期账户、查看额度与每一期账单、生成付款单或直接在应用内还款，以及申请个人贷款。此外还有线上下单门店自提、应用专属折扣和门店查询。",
      highlights: ["参与构建 Lebes 应用", "数字分期信用：开户、额度查询与分期还款", "直接在手机上申请个人贷款", "线上下单门店自提与应用专属折扣", "已在 App Store 和 Google Play 上架"],
    },
  }),
  "grupo-madero": with_(APP_DEV, {
    pt: {
      products: ["App Grupo Madero (iOS · Android)"],
      summary:
        "Trabalhei na criação do app do Grupo Madero — um app para Madero, Jeronimo, Legno e Dundee Chicken & Burgers, com nota 4,8 na App Store dada por mais de 23 mil clientes.",
      description:
        "O Grupo Madero é um dos grupos de restaurantes mais conhecidos do Brasil. Seu app, lançado em 2022 como marketplace próprio do grupo, reúne as quatro marcas — Madero, Jeronimo, Legno e Dundee Chicken & Burgers — em uma única experiência.\n\nTrabalhei na sua criação: navegar por todos os cardápios, pedir e pagar pelo app (cartão, PIX ou vale-refeição), acompanhar o pedido e retirar no balcão, acumular cashback e encontrar o restaurante mais próximo. Hoje ele tem nota 4,8 na App Store, dada por mais de 23 mil pessoas.",
      highlights: [
        "Participei da construção do app do Grupo Madero",
        "Um app para quatro marcas: Madero, Jeronimo, Legno e Dundee",
        "Peça e pague pelo app e retire no balcão",
        "Cashback e mapa de restaurantes",
        "Nota 4,8★ por mais de 23 mil usuários na App Store",
      ],
    },
    es: {
      products: ["App Grupo Madero (iOS · Android)"],
      summary:
        "Trabajé en la creación de la app de Grupo Madero — una app para Madero, Jeronimo, Legno y Dundee Chicken & Burgers, con nota 4,8 en App Store otorgada por más de 23.000 clientes.",
      description:
        "Grupo Madero es uno de los grupos de restaurantes más conocidos de Brasil. Su app, lanzada en 2022 como marketplace propio del grupo, reúne sus cuatro marcas — Madero, Jeronimo, Legno y Dundee Chicken & Burgers — en una sola experiencia.\n\nTrabajé en su creación: recorrer todos los menús, pedir y pagar en la app (tarjeta, PIX o vale de comida), seguir el pedido y retirarlo en el mostrador, acumular cashback y encontrar el restaurante más cercano. Hoy tiene una nota de 4,8 en App Store, otorgada por más de 23.000 personas.",
      highlights: [
        "Participé en la construcción de la app de Grupo Madero",
        "Una app para cuatro marcas: Madero, Jeronimo, Legno y Dundee",
        "Pide y paga en la app y retira en el mostrador",
        "Cashback y mapa de restaurantes",
        "Nota 4,8★ de más de 23.000 usuarios en App Store",
      ],
    },
    zh: {
      products: ["Grupo Madero 应用（iOS · Android）"],
      summary: "参与打造 Grupo Madero 应用——一个应用涵盖 Madero、Jeronimo、Legno 和 Dundee Chicken & Burgers，在 App Store 上获得 23,000 多名用户的 4.8 分评价。",
      description:
        "Grupo Madero 是巴西最知名的餐饮集团之一。其应用于 2022 年作为集团自有的线上平台推出，将旗下四大品牌——Madero、Jeronimo、Legno 和 Dundee Chicken & Burgers——整合进同一个体验中。\n\n我参与了它的开发：浏览所有菜单、在应用内下单并支付（银行卡、PIX 或餐券）、跟踪订单并到柜台取餐、累积返现，以及查找最近的餐厅。如今它在 App Store 上获得了 23,000 多人的 4.8 分评价。",
      highlights: ["参与构建 Grupo Madero 应用", "一个应用覆盖四个品牌：Madero、Jeronimo、Legno 和 Dundee", "应用内下单支付、柜台取餐", "返现积分与餐厅地图", "App Store 评分 4.8★，超过 23,000 名用户评价"],
    },
  }),
  picpay: with_(FE_DEV, {
    pt: {
      via: "via Sciensa",
      summary: "Frontend no PicPay, um dos maiores bancos digitais do Brasil — Pix, cartão, investimentos, cofrinhos e empréstimos em um só app.",
      description:
        "O PicPay começou como carteira de pagamentos e virou um banco digital completo: conta, Pix, cartão de crédito, investimentos, cofrinhos e empréstimos em um só app, para pessoa física e jurídica.\n\nPela Sciensa, atuei no frontend do PicPay com Angular, React e Redux — um produto financeiro de alta escala, em que performance e correção são sentidas por uma base enorme de usuários ao mesmo tempo.",
      highlights: ["Frontend em um produto financeiro de alta escala", "Angular, React e Redux", "Entregue pela Sciensa"],
    },
    es: {
      via: "vía Sciensa",
      summary: "Frontend en PicPay, uno de los mayores bancos digitales de Brasil — Pix, tarjetas, inversiones, ahorros y préstamos en una sola app.",
      description:
        "PicPay empezó como billetera de pagos y se convirtió en un banco digital completo: cuenta, Pix, tarjeta de crédito, inversiones, ahorros y préstamos en una sola app, para personas y empresas.\n\nA través de Sciensa, trabajé en el frontend de PicPay con Angular, React y Redux — un producto financiero de gran escala, donde el rendimiento y la exactitud los percibe a la vez una enorme base de usuarios.",
      highlights: ["Frontend en un producto financiero de gran escala", "Angular, React y Redux", "Entregado a través de Sciensa"],
    },
    zh: {
      via: "经由 Sciensa",
      summary: "参与 PicPay 的前端开发——巴西最大的数字银行之一，在一个应用中提供 Pix、信用卡、投资、储蓄和贷款。",
      description:
        "PicPay 从支付钱包起步，发展成为一家功能完整的数字银行：账户、Pix、信用卡、投资、储蓄和贷款集于一个应用，同时服务个人与企业用户。\n\n我经由 Sciensa 参与了 PicPay 的前端开发，使用 Angular、React 和 Redux——这是一款大规模金融产品，性能与准确性会同时影响庞大的用户群。",
      highlights: ["大规模金融产品的前端开发", "Angular、React 与 Redux", "经由 Sciensa 交付"],
    },
  }),
  uplexis: {
    pt: {
      summary:
        "Tech Lead no upMiner e no upLink — plataformas de compliance que fazem background check de pessoas e empresas e desenham, em grafo, as ligações ocultas entre elas.",
      description:
        "A upLexis desenvolve software de compliance e risco usado em due diligence, background check e prevenção a fraudes.\n\nO upMiner reúne informações públicas sobre pessoas e empresas em um único dossiê com nota de risco (upScore). O upLink desenha as relações entre pessoas e empresas como um grafo interativo — sócios, parceiros, conflitos de interesse —, expandindo o quadro societário de uma empresa com um único comando.\n\nComo Tech Lead, defini a arquitetura frontend em Vue.js, orientei o time e mantive essas telas cheias de dados rápidas e legíveis.",
      highlights: [
        "Liderança técnica do upMiner e do upLink",
        "Definição de arquitetura para interfaces Vue.js com muitos dados",
        "Grafos de relacionamento, dossiês e nota de risco (upScore)",
        "Orientação do time e padrões de código",
      ],
    },
    es: {
      summary:
        "Tech Lead de upMiner y upLink — plataformas de cumplimiento que verifican antecedentes de personas y empresas y dibujan, como un grafo, los vínculos ocultos entre ellas.",
      description:
        "upLexis desarrolla software de cumplimiento y riesgo usado en due diligence, verificación de antecedentes y prevención de fraude.\n\nupMiner reúne información pública sobre personas y empresas en un único dossier con una puntuación de riesgo (upScore). upLink dibuja las relaciones entre personas y empresas como un grafo interactivo — socios, aliados, conflictos de interés —, expandiendo la estructura societaria de una empresa con un solo comando.\n\nComo Tech Lead, definí la arquitectura frontend en Vue.js, guié al equipo y mantuve rápidas y legibles esas pantallas cargadas de datos.",
      highlights: [
        "Liderazgo técnico de upMiner y upLink",
        "Definición de arquitectura para interfaces Vue.js con muchos datos",
        "Grafos de relaciones, dossiers y puntuación de riesgo (upScore)",
        "Guía del equipo y estándares de código",
      ],
    },
    zh: {
      title: "技术负责人",
      summary: "担任 upMiner 与 upLink 的技术负责人——这两款合规平台可对个人和企业进行背景调查，并以关系图的形式揭示它们之间隐藏的关联。",
      description:
        "upLexis 开发用于尽职调查、背景调查和反欺诈的合规与风控软件。\n\nupMiner 将个人和企业的公开信息汇总为一份带有风险评分（upScore）的档案。upLink 以交互式关系图呈现个人与企业之间的联系——股东、合作方、利益冲突——只需一个命令即可展开一家公司的股权结构。\n\n作为技术负责人，我设计了基于 Vue.js 的前端架构，指导团队，并让这些数据密集的界面保持快速、清晰。",
      highlights: ["upMiner 与 upLink 技术负责人", "为数据密集型 Vue.js 界面设计架构", "关系图、档案与风险评分（upScore）", "团队指导与代码规范"],
    },
  },
  milvus: with_(FE_DEV, {
    pt: {
      products: ["Portal do Cliente", "Portal do Gestor", "Widget de Chat", "Cliente Windows"],
      summary:
        "O lado que o cliente vê da Milvus, plataforma de help desk: o Portal do Cliente, o Portal do Gestor, o widget de chat e o cliente Windows usado para abrir chamados.",
      description:
        "A Milvus é uma plataforma de help desk e gestão de serviços que centraliza o atendimento — da TI ao RH — em um só lugar omnichannel.\n\nConstruí as superfícies que clientes e gestores realmente tocam: o Portal do Cliente, onde os usuários abrem e acompanham chamados, o Portal do Gestor, o widget de chat incorporável e o cliente Windows. Tudo com AngularJS e Angular, Tailwind CSS e Bootstrap 5.",
      highlights: ["Portal do Cliente e Portal do Gestor", "Widget de chat incorporável", "Cliente Windows para abertura de chamados", "AngularJS, Angular, Tailwind CSS e Bootstrap 5"],
    },
    es: {
      products: ["Portal del Cliente", "Portal del Gestor", "Widget de Chat", "Cliente Windows"],
      summary:
        "La cara visible de Milvus, plataforma de help desk: el Portal del Cliente, el Portal del Gestor, el widget de chat y el cliente de Windows con el que se abren tickets.",
      description:
        "Milvus es una plataforma de help desk y gestión de servicios que centraliza la atención — de TI a RR. HH. — en un solo lugar omnicanal.\n\nConstruí las superficies que clientes y gestores realmente usan: el Portal del Cliente, donde los usuarios abren y siguen sus tickets, el Portal del Gestor, el widget de chat integrable y el cliente de Windows. Todo con AngularJS y Angular, Tailwind CSS y Bootstrap 5.",
      highlights: ["Portal del Cliente y Portal del Gestor", "Widget de chat integrable", "Cliente de Windows para abrir tickets", "AngularJS, Angular, Tailwind CSS y Bootstrap 5"],
    },
    zh: {
      products: ["客户门户", "管理者门户", "聊天组件", "Windows 客户端"],
      summary: "负责服务台平台 Milvus 面向用户的部分：客户门户、管理者门户、聊天组件，以及用于提交工单的 Windows 客户端。",
      description:
        "Milvus 是一个服务台与服务管理平台，将从 IT 到人力资源的各类服务集中到一个全渠道平台中。\n\n我构建了客户和管理者真正接触的界面：用户提交并跟踪工单的客户门户、管理者门户、可嵌入的聊天组件以及 Windows 客户端。技术栈包括 AngularJS 与 Angular、Tailwind CSS 和 Bootstrap 5。",
      highlights: ["客户门户与管理者门户", "可嵌入的聊天组件", "用于提交工单的 Windows 客户端", "AngularJS、Angular、Tailwind CSS 与 Bootstrap 5"],
    },
  }),
  "uds-broadcast": with_(FS_DEV, {
    pt: {
      summary: "Fullstack no Broadcast OTC e no Broadcast Broker — negociação eletrônica de câmbio, derivativos, renda fixa e fundos, com Vue.js e Node.js.",
      description:
        "O Broadcast, da Agência Estado, é uma das plataformas de referência em informação e negociação do mercado financeiro brasileiro. O Broadcast OTC leva a negociação de balcão — câmbio, derivativos, renda fixa, fundos e commodities — e suas rotinas operacionais para uma única tela, integrada ao middle e back office do cliente.\n\nPela UDS, atuei como fullstack no Broadcast OTC e no Broadcast Broker com Vue.js, Tailwind CSS e Node.js: interfaces de negociação densas e em tempo real, em que cada milissegundo e cada casa decimal importam.",
      highlights: ["Broadcast OTC e Broadcast Broker", "Interfaces de negociação em tempo real", "Vue.js, Tailwind CSS e Node.js"],
    },
    es: {
      summary: "Fullstack en Broadcast OTC y Broadcast Broker — negociación electrónica de divisas, derivados, renta fija y fondos, con Vue.js y Node.js.",
      description:
        "Broadcast, de Agência Estado, es una de las plataformas de referencia en información y negociación del mercado financiero brasileño. Broadcast OTC lleva la negociación extrabursátil — divisas, derivados, renta fija, fondos y commodities — y sus rutinas operativas a una sola pantalla, integrada con el middle y back office del cliente.\n\nA través de UDS, trabajé como fullstack en Broadcast OTC y Broadcast Broker con Vue.js, Tailwind CSS y Node.js: interfaces de negociación densas y en tiempo real, donde cada milisegundo y cada decimal importan.",
      highlights: ["Broadcast OTC y Broadcast Broker", "Interfaces de negociación en tiempo real", "Vue.js, Tailwind CSS y Node.js"],
    },
    zh: {
      summary: "全栈参与 Broadcast OTC 与 Broadcast Broker——涵盖外汇、衍生品、固定收益和基金的电子交易平台，基于 Vue.js 与 Node.js。",
      description:
        "Agência Estado 旗下的 Broadcast 是巴西金融市场具有代表性的信息与交易平台之一。Broadcast OTC 将场外交易——外汇、衍生品、固定收益、基金和大宗商品——及其运营流程整合到同一个界面中，并与客户的中后台系统集成。\n\n我经由 UDS 以全栈身份参与 Broadcast OTC 与 Broadcast Broker 的开发，使用 Vue.js、Tailwind CSS 和 Node.js：这些是信息密集的实时交易界面，每一毫秒、每一位小数都至关重要。",
      highlights: ["Broadcast OTC 与 Broadcast Broker", "实时交易界面", "Vue.js、Tailwind CSS 与 Node.js"],
    },
  }),
  facepass: with_(FE_DEV, {
    pt: {
      products: ["Portal do Produtor", "Ingressos", "Componentes"],
      summary: "Frontend da Facepass, a plataforma de reconhecimento facial para eventos: o Portal do Produtor, a venda de ingressos e uma biblioteca de componentes em Vue e Nuxt.",
      description:
        "A Facepass troca ingressos e filas pelo seu rosto: entrada, compras e pagamentos dentro de eventos são autorizados por reconhecimento facial, e a mesma plataforma de identidade atende condomínios e videomonitoramento.\n\nConstruí o frontend para os produtores de eventos — o Portal do Produtor e a venda de ingressos — e a biblioteca de componentes compartilhada por trás deles, com Vue.js, Nuxt e Pinia.",
      highlights: ["Portal do Produtor para organizadores de eventos", "Fluxos de venda de ingressos", "Biblioteca de componentes compartilhada", "Vue.js, Nuxt e Pinia"],
    },
    es: {
      products: ["Portal del Productor", "Entradas", "Componentes"],
      summary: "Frontend de Facepass, la plataforma de reconocimiento facial para eventos: el Portal del Productor, la venta de entradas y una biblioteca de componentes en Vue y Nuxt.",
      description:
        "Facepass cambia entradas y filas por tu rostro: el acceso, las compras y los pagos dentro de los eventos se autorizan con reconocimiento facial, y la misma plataforma de identidad sirve a condominios y videovigilancia.\n\nConstruí el frontend para los productores de eventos — el Portal del Productor y la venta de entradas — y la biblioteca de componentes compartida detrás de ellos, con Vue.js, Nuxt y Pinia.",
      highlights: ["Portal del Productor para organizadores de eventos", "Flujos de venta de entradas", "Biblioteca de componentes compartida", "Vue.js, Nuxt y Pinia"],
    },
    zh: {
      products: ["主办方门户", "票务", "组件库"],
      summary: "为活动人脸识别平台 Facepass 开发前端：主办方门户、票务系统，以及基于 Vue 与 Nuxt 的共享组件库。",
      description:
        "Facepass 用人脸取代门票和排队：活动中的入场、购物和支付都通过人脸识别授权，同一套身份平台还服务于住宅小区和视频监控。\n\n我为活动主办方构建了前端——主办方门户和票务系统——以及支撑它们的共享组件库，使用 Vue.js、Nuxt 和 Pinia。",
      highlights: ["面向活动主办方的门户", "票务流程", "共享组件库", "Vue.js、Nuxt 与 Pinia"],
    },
  }),
  pernambucanas: with_(FS_DEV, {
    pt: { via: "via Cliqx", summary: "Soluções corporativas em C#, .NET e Angular para a Pernambucanas, uma das mais antigas e maiores redes de varejo do Brasil." },
    es: { via: "vía Cliqx", summary: "Soluciones corporativas en C#, .NET y Angular para Pernambucanas, una de las cadenas minoristas más antiguas y grandes de Brasil." },
    zh: { via: "经由 Cliqx", summary: "使用 C#、.NET 和 Angular 为巴西历史最悠久、规模最大的零售连锁之一 Pernambucanas 开发企业级解决方案。" },
  }),
  maxxidata: with_(FS_DEV, {
    pt: { summary: "Synapse e Masterdata para a Maxxi, consultoria de dados e IA — Micro Frontends em Angular com serviços NestJS e Node.js." },
    es: { summary: "Synapse y Masterdata para Maxxi, consultora de datos e IA — Micro Frontends en Angular con servicios NestJS y Node.js." },
    zh: { summary: "为数据与 AI 咨询公司 Maxxi 开发 Synapse 与 Masterdata——基于 Angular 的微前端，配合 NestJS 与 Node.js 服务。" },
  }),
  "inform-ekantika": with_(FE_DEV, {
    pt: { summary: "Portal Manager e Tempo — arquitetura frontend moderna em React, com Tailwind CSS e gerenciamento de estado com Zustand." },
    es: { summary: "Portal Manager y Tempo — arquitectura frontend moderna en React, con Tailwind CSS y gestión de estado con Zustand." },
    zh: { summary: "Portal Manager 与 Tempo——基于 React 的现代前端架构，结合 Tailwind CSS 与 Zustand 状态管理。" },
  }),
  scale: with_(FS_DEV, {
    pt: { summary: "Desenvolvimento fullstack e integração de sistemas em Bulba, Flamingo e CVF." },
    es: { summary: "Desarrollo fullstack e integración de sistemas en Bulba, Flamingo y CVF." },
    zh: { summary: "参与 Bulba、Flamingo 与 CVF 的全栈开发与系统集成。" },
  }),
  pevepas: with_(FE_DEV, {
    pt: { summary: "Frontend para uma comunidade de role-play de GTA." },
    es: { summary: "Frontend para una comunidad de rol de GTA." },
    zh: { summary: "为一个 GTA 角色扮演游戏社区开发前端。" },
  }),
  "relevo-lab": with_(FE_DEV, {
    pt: { summary: "Plataforma web para a Associação Comercial de São Paulo (ACSP)." },
    es: { products: ["Asociación Comercial de São Paulo"], summary: "Plataforma web para la Asociación Comercial de São Paulo (ACSP)." },
    zh: { products: ["圣保罗商业协会"], summary: "为圣保罗商业协会（ACSP）开发 Web 平台。" },
  }),
  softwrap: with_(FE_DEV, {
    pt: { summary: "DM Health, aplicação web de saúde construída com ASP.NET." },
    es: { summary: "DM Health, aplicación web de salud construida con ASP.NET." },
    zh: { summary: "DM Health——基于 ASP.NET 构建的医疗健康 Web 应用。" },
  }),
  "triade-social": with_(FE_DEV, {
    pt: { summary: "Frontend do +Chat, um produto de chat." },
    es: { summary: "Frontend de +Chat, un producto de chat." },
    zh: { summary: "聊天产品 +Chat 的前端开发。" },
  }),
  "dollar-donation-club": with_(FE_DEV, {
    pt: { products: ["Site institucional"], summary: "Site do Dollar Donation Club — US$ 1 por mês, somado ao de milhares de membros, para instituições de caridade verificadas." },
    es: { products: ["Sitio web institucional"], summary: "Sitio de Dollar Donation Club — US$ 1 al mes, sumado al de miles de miembros, para organizaciones benéficas verificadas." },
    zh: { products: ["机构官网"], summary: "Dollar Donation Club 官网——每月 1 美元，与成千上万会员一起汇聚，捐给经过审核的慈善机构。" },
  }),

  /* ---------------- Projects ---------------- */
  "projeto-dev": {
    pt: {
      title: "Projeto social · Fundador",
      summary: "Um projeto social que criei em 2020 para ajudar pessoas a entrar na tecnologia — orientação, mentoria e um caminho até o primeiro emprego.",
      description:
        "O Projeto Dev apoia quem quer entrar em TI — orientação de carreira, mentoria, revisão de código e um caminho realista até a primeira vaga. Fundei o projeto em 2020 e o mantenho ativo em paralelo ao trabalho com clientes.",
    },
    es: {
      title: "Proyecto social · Fundador",
      summary: "Un proyecto social que creé en 2020 para ayudar a personas a entrar en tecnología — orientación, mentoría y un camino hacia el primer empleo.",
      description:
        "Projeto Dev apoya a quienes quieren entrar en TI — orientación profesional, mentoría, revisión de código y un camino realista hacia el primer empleo. Lo fundé en 2020 y lo mantengo activo junto al trabajo con clientes.",
    },
    zh: {
      title: "公益项目 · 创始人",
      summary: "我在 2020 年创立的公益项目，帮助人们进入科技行业——提供方向指导、导师辅导以及通往第一份工作的路径。",
      description: "Projeto Dev 帮助想进入 IT 行业的人——提供职业指导、导师辅导、代码评审，以及通往第一份工作的现实路径。我在 2020 年创立了它，并在客户工作之余持续运营。",
    },
  },
  "multichat-overlay": {
    pt: {
      title: "Open source · Um chat para todas as lives",
      summary:
        "Um overlay para OBS que junta os chats da Twitch, YouTube, Kick e TikTok em um único feed personalizável — adaptadores em Node.js, WebSocket e filtros de moderação.",
      description:
        "Eu faço lives na Twitch, e transmitir em várias plataformas significa quatro chats em quatro janelas. O multichat-overlay junta tudo: adaptadores plug-and-play para Twitch, YouTube (com detecção automática da live), Kick e TikTok enviam as mensagens por WebSocket para um único overlay, adicionado ao OBS como browser source.\n\nRoda localmente, sem banco de dados, é personalizável por variáveis CSS e já vem com lista de palavras bloqueadas, limite de tamanho das mensagens, renderização segura de emotes, tags por plataforma e endpoint de health check.",
    },
    es: {
      title: "Código abierto · Un chat para todos los streams",
      summary:
        "Un overlay para OBS que une los chats de Twitch, YouTube, Kick y TikTok en un único feed personalizable — adaptadores en Node.js, WebSocket y filtros de moderación.",
      description:
        "Hago streams en Twitch, y transmitir en varias plataformas significa cuatro chats en cuatro ventanas. multichat-overlay los une: adaptadores plug-and-play para Twitch, YouTube (con detección automática del directo), Kick y TikTok envían los mensajes por WebSocket a un único overlay que se añade a OBS como browser source.\n\nFunciona en local, sin base de datos, se personaliza con variables CSS e incluye lista de palabras bloqueadas, límite de longitud de mensajes, renderizado seguro de emotes, etiquetas por plataforma y un endpoint de health check.",
    },
    zh: {
      title: "开源 · 一个聊天窗口汇聚所有直播",
      summary: "一个 OBS 叠加层，将 Twitch、YouTube、Kick 和 TikTok 的聊天汇聚成一个可自定义的信息流——基于 Node.js 适配器、WebSocket 与内容过滤。",
      description:
        "我在 Twitch 上直播，而多平台同步直播意味着要同时盯着四个窗口里的四个聊天室。multichat-overlay 把它们合而为一：即插即用的 Twitch、YouTube（自动检测直播）、Kick 和 TikTok 适配器通过 WebSocket 将消息推送到同一个叠加层，以浏览器源的形式添加到 OBS 中。\n\n它在本地运行，无需数据库，可通过 CSS 变量定制主题，并内置敏感词屏蔽、消息长度限制、安全的表情渲染、平台标签和健康检查接口。",
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
      summary: "Uma demo web em que você desenha qualquer dígito em uma caixa e um modelo de machine learning faz a previsão.",
    },
    es: {
      title: "Código abierto · Dibuja un dígito, mira la predicción",
      summary: "Una demo web en la que dibujas cualquier dígito en un recuadro y un modelo de machine learning lo predice.",
    },
    zh: {
      title: "开源 · 手写数字，查看识别结果",
      summary: "一个网页演示：在方框中写下任意数字，机器学习模型会给出识别结果。",
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
