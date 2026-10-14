import type { Milestone } from "./types";

/**
 * Career timeline (oldest first), from Gabriel's CVs. Every entry is a fact
 * stated there; the wording is the only thing written for the site.
 */
type Entry = { year: string; en: [string, string]; pt: [string, string]; es: [string, string]; zh: [string, string] };

const ENTRIES: Entry[] = [
  {
    year: "2013",
    en: ["Herrmann IT is born", "I open my own consultancy — the company I still work through today, for clients in Brazil and abroad."],
    pt: ["Nasce a Herrmann IT", "Abro minha própria consultoria — a mesma empresa pela qual atendo, até hoje, clientes no Brasil e no exterior."],
    es: ["Nace Herrmann IT", "Abro mi propia consultora — la misma empresa con la que atiendo, hasta hoy, a clientes en Brasil y en el exterior."],
    zh: ["Herrmann IT 成立", "我创办了自己的技术咨询公司——至今仍通过它服务巴西及海外客户。"],
  },
  {
    year: "2014",
    en: ["Fullstack, end to end", "Frontend and backend in the same hands: interfaces, APIs, integrations and databases."],
    pt: ["Fullstack, de ponta a ponta", "Frontend e backend nas mesmas mãos: interfaces, APIs, integrações e bancos de dados."],
    es: ["Fullstack, de punta a punta", "Frontend y backend en las mismas manos: interfaces, APIs, integraciones y bases de datos."],
    zh: ["全栈，端到端", "前端与后端一手包办：界面、API、系统集成与数据库。"],
  },
  {
    year: "2017",
    en: ["Into mobile", "Native-feeling apps for iOS and Android — the path that later led to the Lebes, Grupo Madero and gym-chain apps."],
    pt: ["Chegada ao mobile", "Apps para iOS e Android — o caminho que depois levou aos apps da Lebes, do Grupo Madero e das redes de academias."],
    es: ["Llegada al móvil", "Apps para iOS y Android — el camino que luego llevó a las apps de Lebes, Grupo Madero y las cadenas de gimnasios."],
    zh: ["进军移动端", "开始开发 iOS 与 Android 应用——这条路后来通向 Lebes、Grupo Madero 以及连锁健身房的应用。"],
  },
  {
    year: "2020",
    en: ["Pharma at scale, AI and Projeto Dev", "I join ECS Inovação to own Pharmalink Online, start working with AI and Web3, and found Projeto Dev to help people land their first job in tech."],
    pt: ["Pharma em escala, IA e Projeto Dev", "Entro na ECS Inovação como responsável técnico pelo Pharmalink Online, começo a trabalhar com IA e Web3 e fundo o Projeto Dev para ajudar pessoas a conseguir o primeiro emprego em tecnologia."],
    es: ["Pharma a escala, IA y Projeto Dev", "Me uno a ECS Inovação como responsable técnico de Pharmalink Online, empiezo a trabajar con IA y Web3 y fundo Projeto Dev para ayudar a personas a conseguir su primer empleo en tecnología."],
    zh: ["规模化医药、AI 与 Projeto Dev", "加入 ECS Inovação，担任 Pharmalink Online 技术负责人；开始从事 AI 与 Web3；并创立 Projeto Dev，帮助更多人找到第一份技术工作。"],
  },
  {
    year: "2023",
    en: ["A legacy platform, rebuilt", "I lead Pharmalink's full migration from AngularJS 1.8 to Angular 14, cut load times by up to 50% — then join CI&T for international banking projects."],
    pt: ["Uma plataforma legada, reconstruída", "Lidero a migração completa do Pharmalink de AngularJS 1.8 para Angular 14, reduzo em até 50% o tempo de carregamento — e entro na CI&T para projetos bancários internacionais."],
    es: ["Una plataforma heredada, reconstruida", "Lidero la migración completa de Pharmalink de AngularJS 1.8 a Angular 14, reduzco hasta un 50% el tiempo de carga — y me uno a CI&T para proyectos bancarios internacionales."],
    zh: ["重建遗留平台", "主导 Pharmalink 从 AngularJS 1.8 到 Angular 14 的完整迁移，加载时间最多缩短 50%——随后加入 CI&T，参与国际银行项目。"],
  },
  {
    year: "2024",
    en: ["Leading teams", "Tech Lead of TaqTaq's new cross-platform app (+20% project completion) and frontend reference for two banks on micro frontends at Deal."],
    pt: ["Liderando times", "Tech Lead do novo app multiplataforma da TaqTaq (+20% na conclusão de projetos) e referência frontend de dois bancos em micro frontends na Deal."],
    es: ["Liderando equipos", "Tech Lead de la nueva app multiplataforma de TaqTaq (+20% en proyectos concluidos) y referente frontend de dos bancos con micro frontends en Deal."],
    zh: ["带领团队", "担任 TaqTaq 全新跨平台应用的技术负责人（项目完成率 +20%），并在 Deal 作为两家银行微前端项目的前端技术标杆。"],
  },
  {
    year: "2025",
    en: ["A super app for millions", "At Zup Innovation, enterprise Angular for a banking super app used by millions — corporate treasury and an investment broker."],
    pt: ["Um super app para milhões", "Na Zup Innovation, Angular enterprise para um super app bancário usado por milhões — tesouraria PJ e corretora de investimentos."],
    es: ["Una super app para millones", "En Zup Innovation, Angular enterprise para una super app bancaria usada por millones — tesorería corporativa y corredora de inversiones."],
    zh: ["服务数百万用户的超级应用", "在 Zup Innovation，为数百万用户使用的银行超级应用构建企业级 Angular——企业资金管理与投资经纪平台。"],
  },
  {
    year: "Now",
    en: ["AI engineering", "LLMs, RAG, agents and evals on top of twelve years of production software — available for Lead AI Engineer and Tech Lead roles."],
    pt: ["Engenharia de IA", "LLMs, RAG, agentes e evals sobre doze anos de software em produção — disponível para posições de Lead AI Engineer e Tech Lead."],
    es: ["Ingeniería de IA", "LLMs, RAG, agentes y evals sobre doce años de software en producción — disponible para roles de Lead AI Engineer y Tech Lead."],
    zh: ["AI 工程", "在十二年生产级软件经验之上，专注 LLM、RAG、智能体与评测——正在寻找 Lead AI Engineer 与技术负责人职位。"],
  },
];

const NOW: Record<"pt" | "es" | "zh", string> = { pt: "Hoje", es: "Hoy", zh: "现在" };

const build = (l: "en" | "pt" | "es" | "zh"): Milestone[] =>
  ENTRIES.map((e) => ({ year: e.year === "Now" && l !== "en" ? NOW[l] : e.year, title: e[l][0], text: e[l][1] }));

export const JOURNEY = build("en");
export const JOURNEY_I18N = { pt: build("pt"), es: build("es"), zh: build("zh") };
