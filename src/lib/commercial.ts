import type { Locale } from "./i18n/config";
import type { StudioData } from "./summary";

/**
 * The video presentation is a commercial: a narrator tells Herrmann's story
 * and makes the case for hiring him. Copy is written per language (not
 * machine-generated from the CV) — every claim maps to a fact in the content.
 */

export type BeatId = "hook" | "origin" | "scale" | "apps" | "range" | "people" | "value" | "reveal" | "cta";

type Copy = {
  /** What the narrator says, one entry per beat */
  voice: Record<BeatId, string>;
  /** Big on-screen lines */
  hook: string;
  appsTitle: string;
  rangeTitle: string;
  peopleTitle: string;
  roles: [string, string];
  rolesSub: [string, string];
  cta: string;
  today: string;
  /** Labels for the two headline numbers (1M+, −50%) */
  proof: [string, string];
};

const COPY: Record<Locale, Copy> = {
  en: {
    voice: {
      hook: "Behind every product people trust, there's someone who refuses to settle for good enough.",
      origin: "In 2014, in Novo Hamburgo, in the south of Brazil, a developer shipped his first code to production. He never stopped shipping.",
      scale: "A banking super app used by millions. A pharma marketplace rebuilt from the ground up — with load times cut in half.",
      apps: "Apps people open every day — for retail chains, restaurants and gyms.",
      range: "Angular at enterprise scale. Micro frontends. Python, .NET, Node and Flutter. And since 2020, artificial intelligence: LLMs, RAG and agents.",
      people: "Colleagues describe him as committed, creative — and always ready to teach.",
      value: "A tech lead when the project needs direction. A builder when it needs results.",
      reveal: "This is Herrmann. Gabriel Herrmann Grecchi. Lead AI Engineer.",
      cta: "Your next product deserves the same care. Let's build it together.",
    },
    hook: "Good enough is never enough.",
    appsTitle: "Apps people use every day",
    rangeTitle: "Full stack. Full range.",
    peopleTitle: "In their words",
    roles: ["Tech Lead", "Builder"],
    rolesSub: ["when it needs direction", "when it needs results"],
    cta: "Let's build it together.",
    today: "Today",
    proof: ["users on a banking super app", "load time on a pharma marketplace"],
  },
  pt: {
    voice: {
      hook: "Por trás de todo produto em que as pessoas confiam, existe alguém que não aceita o bom o suficiente.",
      origin: "Em 2014, em Novo Hamburgo, no sul do Brasil, um desenvolvedor colocou seu primeiro código em produção. E nunca mais parou.",
      scale: "Um super app bancário usado por milhões. Um marketplace farmacêutico reconstruído do zero — com o tempo de carregamento cortado pela metade.",
      apps: "Apps que as pessoas abrem todos os dias — de redes de varejo, restaurantes e academias.",
      range: "Angular em escala enterprise. Micro frontends. Python, .NET, Node e Flutter. E, desde 2020, inteligência artificial: LLMs, RAG e agentes.",
      people: "Os colegas o descrevem como comprometido, criativo — e sempre disposto a ensinar.",
      value: "Tech Lead quando o projeto precisa de direção. Mão na massa quando precisa de resultado.",
      reveal: "Este é o Herrmann. Gabriel Herrmann Grecchi. Lead AI Engineer.",
      cta: "Seu próximo produto merece o mesmo cuidado. Vamos construir juntos.",
    },
    hook: "Bom o suficiente nunca basta.",
    appsTitle: "Apps do dia a dia",
    rangeTitle: "Stack completa. Visão completa.",
    peopleTitle: "Nas palavras deles",
    roles: ["Tech Lead", "Mão na massa"],
    rolesSub: ["quando precisa de direção", "quando precisa de resultado"],
    cta: "Vamos construir juntos.",
    today: "Hoje",
    proof: ["usuários em um super app bancário", "no tempo de carregamento de um marketplace farmacêutico"],
  },
  es: {
    voice: {
      hook: "Detrás de cada producto en el que la gente confía, hay alguien que no se conforma con lo suficientemente bueno.",
      origin: "En 2014, en Novo Hamburgo, en el sur de Brasil, un desarrollador llevó su primer código a producción. Y nunca dejó de hacerlo.",
      scale: "Una super app bancaria usada por millones. Un marketplace farmacéutico reconstruido desde cero — con el tiempo de carga reducido a la mitad.",
      apps: "Apps que la gente abre todos los días — para cadenas de retail, restaurantes y gimnasios.",
      range: "Angular a escala empresarial. Micro frontends. Python, .NET, Node y Flutter. Y desde 2020, inteligencia artificial: LLMs, RAG y agentes.",
      people: "Sus colegas lo describen como comprometido, creativo — y siempre dispuesto a enseñar.",
      value: "Tech Lead cuando el proyecto necesita dirección. Manos a la obra cuando necesita resultados.",
      reveal: "Este es Herrmann. Gabriel Herrmann Grecchi. Lead AI Engineer.",
      cta: "Tu próximo producto merece el mismo cuidado. Construyámoslo juntos.",
    },
    hook: "Suficiente nunca es suficiente.",
    appsTitle: "Apps de todos los días",
    rangeTitle: "Stack completo. Visión completa.",
    peopleTitle: "En sus palabras",
    roles: ["Tech Lead", "Manos a la obra"],
    rolesSub: ["cuando necesita dirección", "cuando necesita resultados"],
    cta: "Construyámoslo juntos.",
    today: "Hoy",
    proof: ["usuarios en una super app bancaria", "en el tiempo de carga de un marketplace farmacéutico"],
  },
  zh: {
    voice: {
      hook: "每一个值得信赖的产品背后，都有一个不满足于“还不错”的人。",
      origin: "2014年，在巴西南部的新汉堡，一位开发者把他的第一行代码送上了生产环境。从那以后，他再也没有停下。",
      scale: "一款数百万人使用的银行超级应用。一个从零重建的医药交易平台——加载时间缩短了一半。",
      apps: "人们每天都在打开的应用——零售连锁、餐厅和健身房。",
      range: "企业级 Angular。微前端。Python、.NET、Node 和 Flutter。自2020年起，还有人工智能：大语言模型、RAG 和智能体。",
      people: "同事们说他投入、有创造力，而且总是乐于分享。",
      value: "项目需要方向时，他是技术负责人；需要结果时，他亲自动手。",
      reveal: "他就是 Herrmann。Gabriel Herrmann Grecchi。首席 AI 工程师。",
      cta: "你的下一个产品，值得同样的用心。让我们一起打造。",
    },
    hook: "“还不错”远远不够。",
    appsTitle: "每天都在用的应用",
    rangeTitle: "全栈，全面。",
    peopleTitle: "他们这样说",
    roles: ["技术负责人", "亲自动手"],
    rolesSub: ["需要方向时", "需要结果时"],
    cta: "让我们一起打造。",
    today: "至今",
    proof: ["银行超级应用的用户", "医药交易平台的加载时间"],
  },
};

export const BEATS: BeatId[] = ["hook", "origin", "scale", "apps", "range", "people", "value", "reveal", "cta"];

/** Everything the Remotion "Commercial" composition draws, already localized. */
export type CommercialData = {
  locale: Locale;
  copy: Omit<Copy, "voice">;
  lines: Array<{ id: BeatId; text: string }>;
  displayName: string;
  fullName: string;
  role: string;
  location: string;
  email: string;
  availability: string;
  photoSrc?: string;
  /** Headline numbers for the "scale" beat */
  proof: Array<{ value: string; label: string; logo?: string; cover?: string }>;
  /** App screenshots + icons for the "apps" beat */
  apps: Array<{ name: string; icon?: string; shots: string[] }>;
  /** Covers and screens for the hook's wall of work */
  wall: string[];
  tech: string[];
  quotes: Array<{ text: string; name: string }>;
  logos: string[];
};

type CommercialWork = {
  slug: string;
  company: string;
  logo?: string;
  cover?: string;
  images: string[];
  apps: Array<{ name: string; icon?: string; shots: string[] }>;
};

export function buildCommercial(d: StudioData, works: CommercialWork[]): CommercialData {
  const { voice, ...copy } = COPY[d.locale];
  const bySlug = new Map(works.map((w) => [w.slug, w]));
  // Store apps in production, Madero first (best known), then the rest in work order
  const storeApps = works.flatMap((w) => w.apps).sort((a, b) => Number(b.name === "Grupo Madero") - Number(a.name === "Grupo Madero"));
  const quotes = d.recommendations
    .filter((r) => r.text.length <= (d.locale === "zh" ? 60 : 150))
    .slice(0, 4);

  return {
    locale: d.locale,
    copy,
    lines: BEATS.map((id) => ({ id, text: voice[id] })),
    displayName: d.displayName,
    fullName: d.fullName,
    role: d.roles[0] ?? d.headline,
    location: d.location,
    email: d.email,
    availability: d.availability,
    photoSrc: d.photoSrc,
    proof: [
      { value: "1M+", label: copy.proof[0], logo: bySlug.get("zup-innovation")?.logo, cover: bySlug.get("zup-innovation")?.cover },
      { value: "−50%", label: copy.proof[1], logo: bySlug.get("pharmalink-ecs")?.logo, cover: bySlug.get("pharmalink-ecs")?.cover },
    ],
    apps: storeApps.slice(0, 3).map((a) => ({ name: a.name, icon: a.icon, shots: a.shots.slice(0, 3) })),
    // Product screens only — galleries are curated in the seed (no stock photos of people)
    wall: [...works.flatMap((w) => w.apps.flatMap((a) => a.shots.slice(0, 2))), ...works.flatMap((w) => w.images)]
      .filter((s) => !/logo|icon/.test(s))
      .filter((s, i, all) => all.indexOf(s) === i)
      .slice(0, 21),
    tech: d.skills.flatMap((g) => g.items).slice(0, 28),
    quotes,
    logos: works.map((w) => w.logo).filter((x): x is string => Boolean(x)),
  };
}
