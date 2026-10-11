import type { Locale } from "./i18n/config";

/**
 * Builds a spoken/written summary of the portfolio from its (already
 * localized) content. Pure and deterministic: the same scenes drive the
 * text summary, the read-aloud and the video presentation.
 */

export type SummaryLength = "short" | "medium" | "full";
/** "video" is the tighter cut used by the pre-rendered Remotion presentation. */
export type ScriptCut = SummaryLength | "video";

export type StudioWork = {
  slug: string;
  company: string;
  title: string;
  period: string;
  summary: string;
  highlights: string[];
  metrics: Array<{ value: string; label: string }>;
  accent: string;
  logo?: string;
  cover?: string;
  images?: string[];
};

export type StudioData = {
  locale: Locale;
  displayName: string;
  fullName: string;
  headline: string;
  roles: string[];
  intro: string;
  bio: string[];
  location: string;
  email: string;
  availability: string;
  photoSrc?: string;
  stats: Array<{ value: string; label: string }>;
  skills: Array<{ group: string; items: string[] }>;
  featured: StudioWork[];
  others: string[];
  recommendations: Array<{ name: string; text: string }>;
};

export type Scene =
  | { kind: "intro"; title: string; kicker: string; sub: string; narration: string }
  | { kind: "text"; title: string; kicker: string; body: string; narration: string }
  | { kind: "work"; index: number; work: StudioWork; kicker: string; narration: string }
  | { kind: "stats"; title: string; kicker: string; stats: StudioData["stats"]; narration: string }
  | { kind: "stack"; title: string; kicker: string; skills: StudioData["skills"]; narration: string }
  | { kind: "quote"; title: string; kicker: string; quote: string; author: string; narration: string }
  | { kind: "outro"; title: string; kicker: string; body: string; narration: string };

type Phrases = {
  hello: (d: StudioData) => string;
  whatIDo: string;
  selected: string;
  workLine: (w: StudioWork) => string;
  metricLine: (m: { value: string; label: string }) => string;
  others: (names: string[]) => string;
  numbers: string;
  numbersLine: (s: StudioData["stats"]) => string;
  stack: string;
  stackLine: (s: StudioData["skills"]) => string;
  quotes: string;
  quoteLine: (q: { name: string; text: string }) => string;
  contact: string;
  contactLine: (d: StudioData) => string;
  thanks: string;
  sep: string;
};

const join = (items: string[], and: string, sep = ", ") =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(sep)} ${and} ${items[items.length - 1]}`;

const P: Record<Locale, Phrases> = {
  en: {
    hello: (d) => `Hi, I'm ${d.displayName} — full name ${d.fullName}. ${d.headline}, based in ${d.location}.`,
    whatIDo: "What I do",
    selected: "Selected work",
    workLine: (w) => `${w.company}${w.title ? `, as ${w.title}` : ""}${w.period ? ` (${w.period})` : ""}. ${w.summary}`,
    metricLine: (m) => `Result: ${m.value} — ${m.label}.`,
    others: (n) => `I've also delivered for ${join(n, "and")}.`,
    numbers: "In numbers",
    numbersLine: (s) => s.map((x) => `${x.value}: ${x.label}`).join(". ") + ".",
    stack: "Stack",
    stackLine: (s) => s.map((g) => `${g.group}: ${g.items.slice(0, 5).join(", ")}`).join(". ") + ".",
    quotes: "What colleagues say",
    quoteLine: (q) => `“${q.text}” — ${q.name}.`,
    contact: "Let's talk",
    contactLine: (d) => `${d.availability}${d.email ? ` Write to me at ${d.email}.` : ""}`,
    thanks: "Thanks for watching.",
    sep: " ",
  },
  pt: {
    hello: (d) => `Olá, eu sou o ${d.displayName} — nome completo ${d.fullName}. ${d.headline}, em ${d.location}.`,
    whatIDo: "O que eu faço",
    selected: "Trabalhos em destaque",
    workLine: (w) => `${w.company}${w.title ? `, como ${w.title}` : ""}${w.period ? ` (${w.period})` : ""}. ${w.summary}`,
    metricLine: (m) => `Resultado: ${m.value} — ${m.label}.`,
    others: (n) => `Também entreguei projetos para ${join(n, "e")}.`,
    numbers: "Em números",
    numbersLine: (s) => s.map((x) => `${x.value}: ${x.label}`).join(". ") + ".",
    stack: "Stack",
    stackLine: (s) => s.map((g) => `${g.group}: ${g.items.slice(0, 5).join(", ")}`).join(". ") + ".",
    quotes: "O que dizem os colegas",
    quoteLine: (q) => `“${q.text}” — ${q.name}.`,
    contact: "Vamos conversar",
    contactLine: (d) => `${d.availability}${d.email ? ` Escreva para ${d.email}.` : ""}`,
    thanks: "Obrigado por assistir.",
    sep: " ",
  },
  es: {
    hello: (d) => `Hola, soy ${d.displayName} — nombre completo ${d.fullName}. ${d.headline}, desde ${d.location}.`,
    whatIDo: "Lo que hago",
    selected: "Trabajos destacados",
    workLine: (w) => `${w.company}${w.title ? `, como ${w.title}` : ""}${w.period ? ` (${w.period})` : ""}. ${w.summary}`,
    metricLine: (m) => `Resultado: ${m.value} — ${m.label}.`,
    others: (n) => `También he entregado proyectos para ${join(n, "y")}.`,
    numbers: "En números",
    numbersLine: (s) => s.map((x) => `${x.value}: ${x.label}`).join(". ") + ".",
    stack: "Stack",
    stackLine: (s) => s.map((g) => `${g.group}: ${g.items.slice(0, 5).join(", ")}`).join(". ") + ".",
    quotes: "Lo que dicen mis colegas",
    quoteLine: (q) => `“${q.text}” — ${q.name}.`,
    contact: "Hablemos",
    contactLine: (d) => `${d.availability}${d.email ? ` Escríbeme a ${d.email}.` : ""}`,
    thanks: "Gracias por ver.",
    sep: " ",
  },
  zh: {
    hello: (d) => `你好，我是 ${d.displayName}，全名 ${d.fullName}。${d.headline}，常驻${d.location}。`,
    whatIDo: "我做什么",
    selected: "精选作品",
    workLine: (w) => `${w.company}${w.title ? `，担任${w.title}` : ""}${w.period ? `（${w.period}）` : ""}。${w.summary}`,
    metricLine: (m) => `成果：${m.value}——${m.label}。`,
    others: (n) => `我还为 ${n.join("、")} 交付过项目。`,
    numbers: "数字一览",
    numbersLine: (s) => s.map((x) => `${x.value}：${x.label}`).join("；") + "。",
    stack: "技术栈",
    stackLine: (s) => s.map((g) => `${g.group}：${g.items.slice(0, 5).join("、")}`).join("；") + "。",
    quotes: "同事们怎么说",
    quoteLine: (q) => `“${q.text}”——${q.name}`,
    contact: "联系我",
    contactLine: (d) => `${d.availability}${d.email ? `邮箱：${d.email}。` : ""}`,
    thanks: "感谢观看。",
    sep: "",
  },
};

/** First sentence only — keeps the short cut short. */
function firstSentence(s: string): string {
  const m = s.match(/^.+?[.!?。！？](\s|$)/);
  return (m ? m[0] : s).trim();
}

export function buildScenes(d: StudioData, length: ScriptCut): Scene[] {
  const p = P[d.locale];
  const scenes: Scene[] = [];
  const nWorks = length === "short" ? 2 : length === "medium" ? 4 : d.featured.length;
  const nQuotes = length === "short" ? 0 : length === "medium" || length === "video" ? 1 : 3;
  const brief = length === "short" || length === "video";

  scenes.push({ kind: "intro", title: d.displayName, kicker: d.headline, sub: d.fullName, narration: p.hello(d) });

  if (length !== "short") {
    const body = length === "full" ? d.bio.join("\n\n") : d.intro;
    scenes.push({ kind: "text", title: p.whatIDo, kicker: d.roles.join(" · "), body, narration: body });
  }

  d.featured.slice(0, nWorks).forEach((w, i) => {
    const work = brief ? { ...w, summary: firstSentence(w.summary) } : w;
    // In the video, role, period and metrics are on screen — the voice only names the work.
    let narration = length === "video" ? `${work.company}${d.locale === "zh" ? "。" : ". "}${work.summary}` : p.workLine(work);
    if (length !== "short" && length !== "video" && w.metrics[0]) narration += p.sep + p.metricLine(w.metrics[0]);
    if (length === "full" && w.highlights.length) narration += p.sep + w.highlights.slice(0, 3).join(d.locale === "zh" ? "；" : ". ") + (d.locale === "zh" ? "。" : ".");
    scenes.push({ kind: "work", index: i, work, kicker: p.selected, narration });
  });

  if (length === "full" && d.others.length) {
    const body = p.others(d.others);
    scenes.push({ kind: "text", title: p.selected, kicker: "+", body, narration: body });
  }

  if (length !== "short" && d.stats.length) {
    scenes.push({ kind: "stats", title: p.numbers, kicker: d.displayName, stats: d.stats, narration: p.numbersLine(d.stats) });
  }
  if (length === "full" && d.skills.length) {
    scenes.push({ kind: "stack", title: p.stack, kicker: "package.json", skills: d.skills, narration: p.stackLine(d.skills) });
  }
  d.recommendations.slice(0, nQuotes).forEach((r) => {
    scenes.push({ kind: "quote", title: p.quotes, kicker: "LinkedIn", quote: r.text, author: r.name, narration: p.quoteLine(r) });
  });

  const contact = p.contactLine(d);
  scenes.push({ kind: "outro", title: p.contact, kicker: d.email, body: contact, narration: `${contact}${p.sep}${p.thanks}` });
  return scenes;
}

/** Splits narration into sentence-sized chunks (speech, captions, timing). */
export function splitSentences(text: string): string[] {
  return (text.match(/[^.!?。！？\n]+[.!?。！？]*["”»]?/g) ?? [text]).map((s) => s.trim()).filter(Boolean);
}

/**
 * Fingerprint of what is said, used to match pre-rendered audio/video
 * (scripts/studio) to the live content — if the admin edits a text, the site
 * falls back to live synthesis instead of playing an outdated recording.
 */
export function narrationHash(scenes: Scene[]): string {
  const input = scenes.map((s) => s.narration).join("␞");
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

/** Plain-text version (for reading, copying, downloading and printing). */
export function scenesToText(d: StudioData, scenes: Scene[]): string {
  const head = `${d.displayName} — ${d.fullName}\n${d.headline}`;
  return [head, ...scenes.slice(1).map((s) => s.narration)].join("\n\n");
}

/** Rough reading time in seconds (≈ 2.6 words/s, or ≈ 4.5 CJK chars/s). */
export function estimateSeconds(text: string, locale: Locale): number {
  if (locale === "zh") return text.replace(/\s/g, "").length / 4.5;
  return text.split(/\s+/).filter(Boolean).length / 2.6;
}
