import { CONTENT_LOCALES, type App, type Content, type Media, type Work } from "./types";
import { RECOMMENDATIONS } from "./seed-recommendations";
import { JOURNEY, JOURNEY_I18N } from "./seed-journey";
import { DEFAULT_LOCATION, SECTORS as I18N_SECTORS, SETTINGS as I18N_SETTINGS, WORKS as I18N_WORKS } from "./seed-i18n";
import MANIFEST from "./media-manifest.json";

/**
 * Initial content, built from Gabriel's CVs (PT/EN, 2026), his GitHub profile
 * and the public pages, app-store listings and YouTube channels of the
 * companies he worked for (researched 2026-10-14).
 *
 * Images live in public/work/<slug>/ as optimized WebP — fetched by
 * `npm run media:fetch` from scripts/media/sources.json (each keeps its source
 * as `credit`), plus two generated key visuals (`npm run media:covers`).
 * Nothing is hotlinked, so a client redesigning their site cannot break this one.
 *
 * Metrics are only those stated in the CVs; company facts (founding year,
 * scale, ratings…) come from the companies' own public pages — nothing invented.
 */

const NOW = "2026-10-14T00:00:00.000Z";
const DEFAULT_LOCATION_EN = "Novo Hamburgo, Brazil · Remote";

type ManifestEntry = { src: string; width: number; height: number; credit: string };
const MEDIA_FILES = MANIFEST as Record<string, ManifestEntry>;

const media: Media[] = [];
/** Registers a local image from media-manifest.json; "" if it was never fetched. */
function L(id: string, alt: string): string {
  const f = MEDIA_FILES[id];
  if (!f) return "";
  media.push({ id, src: f.src, alt, credit: f.credit, kind: "static", width: f.width, height: f.height, createdAt: NOW });
  return id;
}
const ids = (...list: string[]) => list.filter(Boolean);
/** Numbered app-store screenshots: shots("lebes", 4, "Lojas Lebes app") → lebes-s1…s4 */
const shots = (prefix: string, n: number, alt: string) =>
  ids(...Array.from({ length: n }, (_, i) => L(`${prefix}-s${i + 1}`, `${alt} — screen ${i + 1}`)));

/* ---------- Photo ---------- */
media.push({ id: "photo-gabriel", src: "/seed/gabriel.jpg", alt: "Portrait of Herrmann (Gabriel Herrmann Grecchi)", credit: "", kind: "static", createdAt: NOW });
const photo = "photo-gabriel";

/* ---------- Roles ---------- */
const zupLogo = L("zup-logo", "Zup Innovation logo");
const zupCover = L("zup-cover", "Zup Innovation — “Your tech ally, from now to the future”");

const dealLogo = L("deal-logo", "Deal Technologies logo");
const dealCover = L("deal-cover", "Deal — layered platform illustration");
const dealGallery = ids(L("deal-g1", "Deal — digital engineering and AI"), L("deal-g2", "deal.com.br home page"));

const TAQ_STORE = "https://apps.apple.com/br/app/taqtaq/id6478974936";
const TAQ_PLAY = "https://play.google.com/store/apps/details?id=app.taqtaq.me";
const taqIcon = L("taqtaq-icon", "TaqTaq app icon");
const taqCover = L("taqtaq-cover", "TaqTaq — manage and grow your network in one place");
const taqPhones = L("taqtaq-phones", "TaqTaq — card editor and notification settings");
const taqShots = shots("taqtaq", 6, "TaqTaq app");

const citLogo = L("ciandt-logo", "CI&T logo");
const citCover = L("ciandt-cover", "CI&T — client stories key visual");
const citGallery = ids(L("ciandt-g1", "CI&T — brand pattern"));

const phLogo = L("pharmalink-logo", "Pharmalink logo");
const phCover = L("pharmalink-cover", "Pharmalink — one hub connecting industry, distributors and pharmacies (illustration)");
const phGallery = ids(L("pharmalink-g2", "Pharmalink — product mix in a pharmacy order"), L("pharmalink-icon", "Pharmalink app icon"), L("ecs-logo", "ECS Inovação logo"));

const hitCover = L("herrmann-it-cover", "Herrmann IT Consultoria — client logos");

/* ---------- Apps & clients ---------- */
const EC_STORE = "https://apps.apple.com/br/app/ec-pro/id1663011737";
const EC_PLAY = "https://play.google.com/store/apps/details?id=com.pacto.engenhariadocorpo";
const pactoLogo = L("pacto-logo", "Pacto Soluções logo");
const pactoCover = L("pacto-cover", "Sistema Pacto — technology for fitness businesses");
const ecIcon = L("ecpro-icon", "EC PRO (Engenharia do Corpo) app icon");
const ecShots = shots("ecpro", 4, "Engenharia do Corpo app (EC PRO)");
const pactoGallery = ids(
  ...ecShots,
  L("pacto-g1", "Sistema Pacto — member profile in the management system"),
  L("ec-logo", "Engenharia do Corpo logo"),
  L("usina-logo", "Usina do Corpo logo"),
);

const LEBES_STORE = "https://apps.apple.com/br/app/lojas-lebes/id1464057615";
const LEBES_PLAY = "https://play.google.com/store/apps/details?id=br.com.lebes.app";
const lebesLogo = L("lebes-logo", "Lebes logo");
const lebesIcon = L("lebes-icon", "Lojas Lebes app icon");
const lebesShots = shots("lebes", 6, "Lojas Lebes app");

const MADERO_STORE = "https://apps.apple.com/br/app/grupo-madero-app/id1579688707";
const MADERO_PLAY = "https://play.google.com/store/apps/details?id=br.com.alphacode.madero";
const maderoLogo = L("madero-logo", "Madero logo");
const maderoIcon = L("madero-icon", "Grupo Madero app icon");
const maderoShots = shots("madero", 5, "Grupo Madero app");

const picpayLogo = L("picpay-logo", "PicPay logo");
const picpayShots = shots("picpay", 3, "PicPay app");

const upLogo = L("uplexis-logo", "upLexis logo");
const upCover = L("uplexis-cover", "upLink — relationship graph between people and companies");
const upGallery = ids(
  L("uplexis-g1", "upLink — graph with a CPF lookup panel"),
  L("uplexis-g2", "upMiner — dossier with the upScore risk rating"),
  L("uplexis-g3", "upMiner — dossier detail"),
);

const pernLogo = L("pernambucanas-logo", "Pernambucanas logo");

const milLogo = L("milvus-logo", "Milvus logo");
const milCover = L("milvus-g1", "Milvus — help desk on desktop, tablet and phone");
const milGallery = ids(L("milvus-cover", "Milvus — tickets overview on desktop and mobile"), L("milvus-g2", "Milvus — ticket counters dashboard"), L("milvus-g3", "Milvus — chatbot on WhatsApp"));

const maxxiLogo = L("maxxi-logo", "Maxxi (Maxxidata) logo");

const udsLogo = L("uds-logo", "UDS logo");
const bcCover = L("broadcast-cover", "Broadcast OTC — order book, FX chart and orders panel");
const bcGallery = ids(L("broadcast-g1", "Broadcast OTC — trading and operations on one screen"));

const informLogo = L("inform-logo", "INFORM logo");

const fpLogo = L("facepass-logo", "Facepass logo");
const fpCover = L("facepass-cover", "Facepass Eventos — analytics dashboard");
const fpGallery = ids(L("facepass-icon", "Facepass app icon"));

const acspLogo = L("acsp-logo", "Associação Comercial de São Paulo logo");

const ddcLogo = L("ddc-logo", "Dollar Donation Club logo");
const ddcCover = L("ddc-cover", "Dollar Donation Club — the world’s first collective super-philanthropist");

/* ---------- Open source (GitHub social cards) ---------- */
const ghSignals = L("gh-angular-signals", "angular-signals on GitHub");
const ghQoda = L("gh-qoda", "QODA-Web-Deploy on GitHub");
const ghMultichat = L("gh-multichat", "multichat-overlay on GitHub");

const app = (name: string, iconId: string, shots: string[], links: App["links"]): App => ({ name, iconId, shots, links });

/* ------------------------------------------------------------------ */

let order = 0;
function w(partial: Partial<Work> & Pick<Work, "slug" | "kind" | "company">): Work {
  return withTranslations({
    id: partial.slug,
    title: "",
    via: "",
    products: [],
    summary: "",
    description: "",
    start: "",
    end: "",
    location: DEFAULT_LOCATION_EN,
    sectors: [],
    highlights: [],
    metrics: [],
    tech: [],
    links: [],
    video: "",
    apps: [],
    logoId: "",
    coverId: "",
    gallery: [],
    accent: "#A8D965",
    featured: false,
    published: true,
    order: order++,
    updatedAt: NOW,
    ...partial,
  });
}

/** Attach pt/es/zh overrides: shared sector/location maps + per-work text from seed-i18n. */
function withTranslations(work: Work): Work {
  const own = I18N_WORKS[work.slug];
  const i18n: NonNullable<Work["i18n"]> = {};
  for (const l of CONTENT_LOCALES) {
    i18n[l] = {
      ...(work.location === DEFAULT_LOCATION_EN && { location: DEFAULT_LOCATION[l] }),
      ...(work.sectors.length > 0 && { sectors: work.sectors.map((s) => I18N_SECTORS[s]?.[l] ?? s) }),
      ...own?.[l],
    };
  }
  return { ...work, i18n };
}

const works: Work[] = [
  w({
    slug: "zup-innovation",
    kind: "role",
    company: "Zup Innovation",
    title: "Fullstack Developer · Frontend Specialist",
    products: ["Banking super app", "Corporate treasury (PJ)", "Investment broker"],
    summary:
      "Frontend specialist on a banking super app used by millions of people — corporate treasury and an investment broker, where every screen moves real money and security, performance and reliability are not negotiable.",
    description:
      "Zup is the technology company of the Itaú Unibanco group — founded in 2011, acquired by Itaú in 2019 and today serving more than 60 enterprise clients with AI-accelerated engineering.\n\nI joined a squad inside one of Brazil's largest banking super apps, building the corporate treasury (PJ) platform and the investment-broker experience. The frontend was enterprise Angular on a proprietary design system, combined with Angular Material, Tailwind CSS and BEM, keeping every screen consistent across the product.\n\nI kept the API contracts with the Kotlin backend well defined, and every change went through code review, automated tests and security checks. Product, UX and engineering decided the hard trade-offs together — I brought the frontend point of view to those decisions.",
    start: "2025-05",
    end: "2025-11",
    sectors: ["Banking", "Investments"],
    highlights: [
      "Banking super app used by millions of customers",
      "Corporate treasury (PJ) and investment-broker platforms",
      "Enterprise Angular on a proprietary design system with Angular Material, Tailwind CSS and BEM",
      "Performance, accessibility and UX on money-moving, mission-critical flows",
      "Well-defined API contracts with a Kotlin backend",
      "Quality culture: code review, automated tests, security and maintainability",
    ],
    tech: ["Angular", "TypeScript", "Angular Material", "Tailwind CSS", "BEM", "Design System", "Kotlin", "REST APIs"],
    logoId: zupLogo,
    coverId: zupCover,
    video: "https://www.youtube.com/watch?v=NF8Puh1GUVM",
    accent: "#E0245E",
    featured: true,
    links: [
      { label: "zup.com.br", url: "https://zup.com.br/" },
      { label: "About Zup", url: "https://zup.com.br/sobre/" },
    ],
  }),
  w({
    slug: "deal",
    kind: "role",
    company: "Deal",
    title: "Fullstack Developer · Frontend Specialist",
    products: ["Internet banking platforms", "Micro Frontends"],
    summary:
      "Internet banking for two financial institutions on a Micro Frontend architecture — I was the frontend reference that set the code and architecture standards both products were built on.",
    description:
      "Deal Technologies has been building technology for highly regulated businesses since 2004 — B3, banks and payment companies among them.\n\nI worked on the web banking platforms of two financial-sector clients. Both ran on Micro Frontends: each banking domain lives in its own application, deploys on its own schedule and can't break the others. As the frontend technical reference I defined the code and architecture standards, and built reusable, accessible interfaces with Angular and Angular Material.\n\nOn the backend side I integrated with Python services through an ORM, and kept raising the bar on performance, security and test coverage.",
    start: "2024-08",
    end: "2024-12",
    sectors: ["Banking"],
    highlights: [
      "Internet banking platforms for two financial-sector clients",
      "Micro Frontend architecture: isolated domains, independent deploys",
      "Frontend technical reference — code and architecture standards",
      "Reusable, accessible components in Angular and Angular Material",
      "Python backend integration through an ORM",
    ],
    tech: ["Angular", "TypeScript", "Angular Material", "Micro Frontends", "Python", "ORM", "REST APIs"],
    logoId: dealLogo,
    coverId: dealCover,
    gallery: dealGallery,
    video: "https://www.youtube.com/watch?v=zsLVE7T1nyI",
    accent: "#5B6CFF",
    featured: true,
    links: [{ label: "deal.com.br", url: "https://deal.com.br/" }],
  }),
  w({
    slug: "taqtaq",
    kind: "role",
    company: "TaqTaq",
    title: "Tech Lead",
    products: ["TaqTaq app (iOS · Android)", "B2C · B2B · Events"],
    summary:
      "Tech Lead of TaqTaq's new cross-platform app — digital business cards shared by QR, NFC and proximity — from concept to the App Store and Google Play, on time and on budget.",
    description:
      "TaqTaq turns the paper business card into a living contact: unlimited digital cards, sharing by QR code, NFC or proximity, change notifications, CRM integration and ten languages — for people (B2C), companies (B2B) and events.\n\nI led the build of the new multi-platform version from concept to production. I owned the architecture, the technical plan and the priorities, and wrote a good part of the Flutter code myself.\n\nTwo things changed how the team delivered: adopting agile practices — which raised the project completion rate by more than 20% — and mentoring the junior developers, which lifted code quality and the team's technical maturity.",
    start: "2024-07",
    end: "2024-10",
    sectors: ["Mobile", "Networking", "Events"],
    highlights: [
      "Led a new multi-platform app from concept to production",
      "Owned architecture, technical planning and prioritization",
      "Hands-on Flutter (Dart) development for iOS and Android",
      "Agile practices that raised project completion by 20%+",
      "Mentored junior developers, raising code quality and maturity",
    ],
    metrics: [{ value: "+20%", label: "project completion rate after agile adoption" }],
    tech: ["Flutter", "Dart", "HTML", "CSS", "Agile"],
    logoId: taqIcon,
    coverId: taqCover,
    gallery: ids(taqPhones, ...taqShots),
    apps: [app("TaqTaq", taqIcon, taqShots, [{ label: "App Store", url: TAQ_STORE }, { label: "Google Play", url: TAQ_PLAY }])],
    video: "https://www.youtube.com/watch?v=J0KapbOnipA",
    accent: "#16A08A",
    featured: true,
    links: [
      { label: "taqtaq.com.br", url: "https://taqtaq.com.br/" },
      { label: "App Store", url: TAQ_STORE },
      { label: "Google Play", url: TAQ_PLAY },
    ],
  }),
  w({
    slug: "ciandt",
    kind: "role",
    company: "CI&T",
    title: "Fullstack Developer",
    products: ["Real-estate credit applications", "Cloud projects"],
    summary:
      "International projects for large financial and corporate clients — real-estate credit applications in Angular, C#/.NET and Python, and technical leadership on cloud projects that raised engagement by 30% and cut load time by 20%.",
    description:
      "CI&T is a global digital-engineering company — listed on the NYSE, with 8,000+ people in 25+ countries serving some of the world's largest enterprises.\n\nI worked on international engagements for large financial and corporate clients, including real-estate credit applications built with Angular, C#/.NET and Python — long, regulated flows where a single confusing step costs a contract.\n\nI set up CI/CD pipelines and testing practices, ran code reviews and wrote down the team's conventions. On cloud projects I took the technical lead, and the result showed in the numbers: 30% more user engagement and 20% less load time.",
    start: "2023-12",
    end: "2024-08",
    sectors: ["Banking", "Corporate"],
    highlights: [
      "International projects for large financial and corporate companies",
      "Real-estate credit applications (Angular, C#/.NET, Python)",
      "CI/CD pipelines, testing and quality practices",
      "Technical leadership on cloud projects",
      "Code reviews and team-wide best practices",
    ],
    metrics: [
      { value: "+30%", label: "user engagement" },
      { value: "−20%", label: "load time" },
    ],
    tech: ["Angular", "TypeScript", ".NET", "C#", "Python", "CI/CD", "Cloud"],
    logoId: citLogo,
    coverId: citCover,
    gallery: citGallery,
    video: "https://www.youtube.com/watch?v=YYmrGoN8zec",
    accent: "#FA5A50",
    featured: true,
    links: [{ label: "ciandt.com", url: "https://ciandt.com/" }],
  }),
  w({
    slug: "pharmalink-ecs",
    kind: "role",
    company: "Pharmalink",
    title: "Fullstack Developer · Frontend Lead",
    via: "at ECS Inovação, for InterPlayers",
    products: ["Pharmalink Online", "Financial Cycle", "AngularJS → Angular 14"],
    summary:
      "Technical owner of Pharmalink Online, the hub that connects Brazil's pharmaceutical industry to distributors and pharmacies. I led its full migration from AngularJS 1.8 to Angular 14 and cut load times by up to 50%.",
    description:
      "Pharmalink, by InterPlayers, is where Brazil's pharma industry sells to the market: a hub that connects manufacturers, 650+ distribution centers and 73,000+ pharmacies in every state — 18 million orders and R$21 billion transacted in 2023 alone. ECS Inovação, a partner of InterPlayers, ran its engineering, and I was technically responsible for the evolution of Pharmalink Online.\n\nThe centerpiece was leading the complete frontend migration from AngularJS 1.8.2 to Angular 14 — on a live platform that could not stop selling. That meant a new architecture, a modernized codebase and a large cut in technical debt, while guiding less senior developers so the migration shipped faster.\n\nI also worked directly on the Financial Cycle — the calculation engine behind critical commercial rules — on the backend and integrations, and introduced caching strategies that reduced load time by up to 50%.",
    start: "2020-06",
    end: "2023-10",
    sectors: ["Healthcare", "Pharma", "Marketplace"],
    highlights: [
      "Technical owner of Pharmalink Online, the pharma industry's commercial hub",
      "Led the full AngularJS 1.8.2 → Angular 14 migration on a live platform",
      "Direct contribution to the Financial Cycle calculation engine",
      "Backend work, RESTful APIs and system integrations",
      "Caching strategies that cut load time by up to 50%",
      "Frontend reference and mentor for less senior developers",
    ],
    metrics: [
      { value: "−50%", label: "load time with caching strategies" },
    ],
    tech: ["Angular 14", "AngularJS", "TypeScript", "C#", ".NET", "Tailwind CSS", "Python", "SQL Server", "REST APIs"],
    logoId: phLogo,
    coverId: phCover,
    gallery: phGallery,
    video: "https://www.youtube.com/watch?v=SavIVARsdX4",
    accent: "#2F80ED",
    featured: true,
    links: [
      { label: "Pharmalink", url: "https://www.interplayers.com.br/pharmalink/" },
      { label: "ecs.com.br", url: "https://ecs.com.br/pt-br/" },
    ],
  }),
  w({
    slug: "herrmann-it-consultoria",
    kind: "role",
    company: "Herrmann IT Consultoria",
    title: "Founder · Software Engineer · Frontend Specialist",
    products: ["Consulting", "Frontend engineering", "Fullstack", "Tech leadership"],
    summary:
      "My own consultancy, since 2013. Through it I have shipped for PicPay, Grupo Madero, Lojas Lebes, Pacto, upLexis, Pernambucanas, Milvus and more — as Frontend Engineer, Fullstack Engineer or Tech Lead, whatever the project needs.",
    description:
      "Herrmann IT Consultoria is how I work with clients directly, in Brazil and abroad. Each engagement starts with the same question — what does this product need from engineering right now? — and I step in as Frontend Engineer, Fullstack Engineer or Tech Lead accordingly.\n\nThe work is mostly medium and large strategic projects: enterprise systems, mission-critical flows and high-traffic consumer products. The constants are code quality, performance, scalability, security and a frontend architecture the client's own team can keep evolving after I leave.\n\nSelected clients: PicPay (via Sciensa), the Grupo Madero and Lojas Lebes apps, Pacto Soluções (Engenharia do Corpo and Usina do Corpo), upLexis (upMiner and upLink), Pernambucanas (via Cliqx), Milvus, Maxxidata, Facepass, UDS (Broadcast OTC) and Inform / Ekantika — every one of them is in the archive below.",
    start: "2013-12",
    end: "",
    sectors: ["Banking", "Healthcare", "SaaS"],
    highlights: [
      "Consultant (PJ) on medium and large strategic projects",
      "Frontend Engineer, Fullstack Engineer or Tech Lead as each client needs",
      "Consumer apps live on the App Store and Google Play",
      "Enterprise, mission-critical and high-traffic products",
      "Clients in banking, fintech, retail, restaurants, fitness, compliance and SaaS",
    ],
    tech: ["Angular", "React", "Vue.js", "Nuxt", "Node.js", "NestJS", "Python", "C#", ".NET", "Flutter", "Tailwind CSS"],
    coverId: hitCover,
    accent: "#A8D965",
    featured: true,
  }),

  /* ---------------- Clients through Herrmann IT ---------------- */
  w({
    slug: "pacto-solucoes",
    kind: "client",
    company: "Pacto Soluções",
    title: "Frontend Engineer",
    products: ["Engenharia do Corpo app (EC PRO)", "Usina do Corpo app", "Gym hotsites", "Pacto sales hotsite", "ZW"],
    summary:
      "Frontend for Pacto's fitness platform — the member apps of two of southern Brazil's biggest gym chains, Engenharia do Corpo and Usina do Corpo, their hotsites, Pacto's own sales hotsite and the ZW management system.",
    description:
      "Pacto Soluções builds the management platform behind gyms and fitness businesses all over Brazil — sales, contracts, workouts and the apps members carry in their pockets.\n\nI worked on the branded member apps Pacto delivers to the chains: the Engenharia do Corpo app (EC PRO) and the Usina do Corpo app. Members follow the workouts their instructors prescribe, with loads and repetitions, track their physical assessments, book classes, check in and manage their contracts. EC PRO is rated 4.8 on the App Store by more than a thousand members.\n\nI also built the chains' hotsites — plans, units and online sign-up — and Pacto's own sales hotsite, and contributed to the frontend of ZW, Pacto's web management system.",
    sectors: ["SaaS", "Fitness", "Mobile"],
    highlights: [
      "Member apps for Engenharia do Corpo (EC PRO) and Usina do Corpo",
      "Workouts with loads and reps, assessments, class booking, check-in and contracts",
      "Hotsites for the gym chains: plans, units and online sign-up",
      "Pacto's sales hotsite",
      "Frontend for ZW, Pacto's web management system",
    ],
    tech: ["Angular", "TypeScript", "Java", "Mobile"],
    logoId: pactoLogo,
    coverId: pactoCover,
    gallery: pactoGallery,
    apps: [app("Engenharia do Corpo", ecIcon, ecShots, [{ label: "App Store", url: EC_STORE }, { label: "Google Play", url: EC_PLAY }])],
    video: "https://www.youtube.com/watch?v=nJads9Yug_A",
    accent: "#E6007E",
    featured: true,
    links: [
      { label: "sistemapacto.com.br", url: "https://sistemapacto.com.br/" },
      { label: "EC PRO · App Store", url: EC_STORE },
      { label: "EC PRO · Google Play", url: EC_PLAY },
      { label: "engenhariadocorpo.com.br", url: "https://engenhariadocorpo.com.br/" },
      { label: "usinadocorpoacademia.com.br", url: "https://usinadocorpoacademia.com.br/" },
    ],
  }),
  w({
    slug: "lojas-lebes",
    kind: "client",
    company: "Lojas Lebes",
    title: "App Developer",
    products: ["Lojas Lebes app (iOS · Android)", "Digital crediário"],
    summary:
      "Worked on creating the Lojas Lebes app — the 70-year-old southern Brazilian retailer's store credit (crediário), installments and personal loans, in the customer's pocket.",
    description:
      "Lojas Lebes is a traditional department-store chain from Rio Grande do Sul, celebrating 70 years — and its customers have long bought on the store's own credit, the crediário.\n\nI worked on creating the Lebes app, which moves that credit from the counter to the phone: open a crediário account, see the limit and every installment, generate the payment slip or pay in the app, and request a personal loan. Around it: buy online and pick up in store, app-only discounts and the store locator.",
    sectors: ["Retail", "Fintech", "Mobile"],
    highlights: [
      "Worked on building the Lebes app",
      "Digital crediário: open an account, check the limit, pay installments",
      "Personal loans requested straight from the phone",
      "Buy online, pick up in store, and app-only discounts",
      "Live on the App Store and Google Play",
    ],
    tech: ["Mobile", "iOS", "Android", "REST APIs"],
    logoId: lebesLogo,
    gallery: lebesShots,
    apps: [app("Lojas Lebes", lebesIcon, lebesShots, [{ label: "App Store", url: LEBES_STORE }, { label: "Google Play", url: LEBES_PLAY }])],
    video: "https://www.youtube.com/watch?v=zvJ-uksGaEY",
    accent: "#3BB54A",
    links: [
      { label: "App Store", url: LEBES_STORE },
      { label: "Google Play", url: LEBES_PLAY },
      { label: "lebes.com.br", url: "https://www.lebes.com.br/aplicativo-lebes" },
    ],
  }),
  w({
    slug: "grupo-madero",
    kind: "client",
    company: "Grupo Madero",
    title: "App Developer",
    products: ["Grupo Madero app (iOS · Android)"],
    summary:
      "Worked on creating the Grupo Madero app — one app for Madero, Jeronimo, Legno and Dundee Chicken & Burgers, rated 4.8 on the App Store by more than 23,000 diners.",
    description:
      "Grupo Madero is one of Brazil's best-known restaurant groups. Its app, launched in 2022 as the group's own marketplace, brings its four brands — Madero, Jeronimo, Legno and Dundee Chicken & Burgers — into a single experience.\n\nI worked on creating it: browse every menu, order and pay in the app (card, PIX or meal voucher), track the order and pick it up at the counter, earn cashback and find the nearest restaurant. Today it is rated 4.8 on the App Store by more than 23,000 people.",
    sectors: ["Restaurants", "Mobile"],
    highlights: [
      "Worked on building the Grupo Madero app",
      "One app for four brands: Madero, Jeronimo, Legno and Dundee",
      "Order and pay in the app, then pick up at the counter",
      "Cashback loyalty and the restaurant map",
      "Rated 4.8★ by 23,000+ users on the App Store",
    ],
    tech: ["Mobile", "iOS", "Android", "REST APIs"],
    logoId: maderoLogo,
    gallery: maderoShots,
    apps: [app("Grupo Madero", maderoIcon, maderoShots, [{ label: "App Store", url: MADERO_STORE }, { label: "Google Play", url: MADERO_PLAY }])],
    accent: "#B8862E",
    links: [
      { label: "App Store", url: MADERO_STORE },
      { label: "Google Play", url: MADERO_PLAY },
    ],
  }),
  w({
    slug: "picpay",
    kind: "client",
    company: "PicPay",
    via: "via Sciensa",
    title: "Frontend Developer",
    products: ["PicPay"],
    summary: "Frontend on PicPay, one of Brazil's largest digital banks — Pix, cards, investments, savings and loans in one app.",
    description:
      "PicPay started as a payment wallet and became a full digital bank: account, Pix, credit card, investments, savings and loans in one app, for personal and business accounts.\n\nThrough Sciensa, I worked on PicPay's frontend with Angular, React and Redux — a high-scale financial product where performance and correctness are felt by a very large user base at once.",
    sectors: ["Fintech"],
    highlights: ["Frontend on a high-scale financial product", "Angular, React and Redux", "Delivered through Sciensa"],
    tech: ["Angular", "React", "Redux", "TypeScript"],
    logoId: picpayLogo,
    gallery: picpayShots,
    video: "https://www.youtube.com/watch?v=MRlPHUm0OYw",
    accent: "#11C76F",
    links: [{ label: "picpay.com", url: "https://picpay.com/" }],
  }),
  w({
    slug: "uplexis",
    kind: "client",
    company: "upLexis",
    title: "Tech Lead",
    products: ["upMiner", "upLink"],
    summary:
      "Tech Lead on upMiner and upLink — compliance platforms that run background checks on people and companies and draw the hidden links between them as a graph.",
    description:
      "upLexis builds compliance and risk software used for due diligence, background checks and fraud prevention.\n\nupMiner gathers public information about people and companies into a single dossier with a risk score (upScore). upLink draws the relationships between people and companies as an interactive graph — shareholders, partners, conflicts of interest — expanding a company's ownership structure with one command.\n\nAs Tech Lead I defined the frontend architecture in Vue.js, guided the team and kept these data-heavy screens fast and readable.",
    sectors: ["Compliance", "Data"],
    highlights: [
      "Technical leadership on upMiner and upLink",
      "Architecture definition for data-heavy Vue.js interfaces",
      "Relationship graphs, dossiers and risk scoring (upScore)",
      "Team guidance and code standards",
    ],
    tech: ["Vue.js", "JavaScript", "Data visualization"],
    logoId: upLogo,
    coverId: upCover,
    gallery: upGallery,
    video: "https://www.youtube.com/watch?v=Mwpgo7S3r4w",
    accent: "#F0811F",
    links: [
      { label: "uplexis.com.br", url: "https://uplexis.com.br/" },
      { label: "upLink", url: "https://uplexis.com.br/produtos/uplink/" },
    ],
  }),
  w({
    slug: "milvus",
    kind: "client",
    company: "Milvus",
    title: "Frontend Developer",
    products: ["Client Portal", "Manager Portal", "Chat Widget", "Windows Client"],
    summary:
      "The customer-facing side of Milvus, a help desk platform: the Client Portal, the Manager Portal, the chat widget and the Windows client people use to open tickets.",
    description:
      "Milvus is a help desk and service-management platform that centralizes support — from IT to HR — in one omnichannel place.\n\nI built the surfaces customers and managers actually touch: the Client Portal where end users open and follow tickets, the Manager Portal, the embeddable chat widget and the Windows client. Built with AngularJS and Angular, Tailwind CSS and Bootstrap 5.",
    sectors: ["SaaS"],
    highlights: [
      "Client Portal and Manager Portal",
      "Embeddable chat widget",
      "Windows client for opening tickets",
      "AngularJS, Angular, Tailwind CSS and Bootstrap 5",
    ],
    tech: ["AngularJS", "Angular", "Tailwind CSS", "Bootstrap 5"],
    logoId: milLogo,
    coverId: milCover,
    gallery: milGallery,
    video: "https://www.youtube.com/watch?v=elnaJWnzGDo",
    accent: "#2C6CF6",
    links: [{ label: "milvus.com.br", url: "https://milvus.com.br/" }],
  }),
  w({
    slug: "uds-broadcast",
    kind: "client",
    company: "UDS",
    title: "Fullstack Developer",
    products: ["Broadcast OTC", "Broadcast Broker"],
    summary: "Fullstack on Broadcast OTC and Broadcast Broker — electronic trading for FX, derivatives, fixed income and funds, built with Vue.js and Node.js.",
    description:
      "Broadcast, from Agência Estado, is one of the reference information and trading platforms of the Brazilian financial market. Broadcast OTC brings over-the-counter trading — FX, derivatives, fixed income, funds and commodities — and its operational routines onto a single screen, integrated with the client's middle and back office.\n\nThrough UDS, I worked fullstack on Broadcast OTC and Broadcast Broker with Vue.js, Tailwind CSS and Node.js: dense, real-time trading interfaces where every millisecond and every decimal place matter.",
    sectors: ["Finance"],
    highlights: ["Broadcast OTC and Broadcast Broker", "Real-time trading interfaces", "Vue.js, Tailwind CSS and Node.js"],
    tech: ["Vue.js", "Tailwind CSS", "Node.js"],
    logoId: udsLogo,
    coverId: bcCover,
    gallery: bcGallery,
    video: "https://www.youtube.com/watch?v=isDrUAtDvdE",
    accent: "#008CFF",
    links: [
      { label: "Broadcast OTC", url: "https://www.broadcast.com.br/broadcast-otc/" },
      { label: "uds.com.br", url: "https://uds.com.br/" },
    ],
  }),
  w({
    slug: "facepass",
    kind: "client",
    company: "Facepass",
    title: "Frontend Developer",
    products: ["Producer Portal", "Tickets", "Components"],
    summary: "Frontend for Facepass, the facial-recognition platform for events: the Producer Portal, ticketing and a shared component library in Vue and Nuxt.",
    description:
      "Facepass replaces tickets and queues with your face: entry, purchases and payments inside events are authorized by facial recognition, and the same identity platform powers condominiums and video monitoring.\n\nI built the frontend for event producers — the Producer Portal and ticketing — and the shared component library behind them, with Vue.js, Nuxt and Pinia.",
    sectors: ["Events"],
    highlights: ["Producer Portal for event organizers", "Ticketing flows", "Shared component library", "Vue.js, Nuxt and Pinia"],
    tech: ["Vue.js", "Nuxt", "Pinia"],
    logoId: fpLogo,
    coverId: fpCover,
    gallery: fpGallery,
    video: "https://www.youtube.com/watch?v=3ZvmbgPBnUQ",
    accent: "#F7691A",
    links: [{ label: "facepassbrasil.com.br", url: "https://facepassbrasil.com.br/" }],
  }),
  w({
    slug: "pernambucanas",
    kind: "client",
    company: "Pernambucanas",
    via: "via Cliqx",
    title: "Fullstack Developer",
    summary: "Corporate solutions in C#, .NET and Angular for Pernambucanas, one of Brazil's oldest and largest retail chains.",
    sectors: ["Retail"],
    tech: ["C#", ".NET", "Angular"],
    logoId: pernLogo,
    accent: "#1D3C85",
    links: [{ label: "pernambucanas.com.br", url: "https://www.pernambucanas.com.br/" }],
  }),
  w({
    slug: "maxxidata",
    kind: "client",
    company: "Maxxidata",
    title: "Fullstack Developer",
    products: ["Synapse", "Masterdata"],
    summary: "Synapse and Masterdata for Maxxi, a data and AI consultancy — Angular Micro Frontends backed by NestJS and Node.js services.",
    sectors: ["Data"],
    tech: ["Angular", "Micro Frontends", "NestJS", "Node.js", "React"],
    logoId: maxxiLogo,
    accent: "#FE7920",
    links: [{ label: "maxxi.io", url: "https://www.maxxi.io/" }],
  }),
  w({
    slug: "inform-ekantika",
    kind: "client",
    company: "Inform / Ekantika",
    title: "Frontend Developer",
    products: ["Portal Manager", "Tempo"],
    summary: "Portal Manager and Tempo — a modern React frontend architecture with Tailwind CSS and Zustand state management.",
    sectors: ["SaaS"],
    tech: ["React", "Tailwind CSS", "Zustand"],
    logoId: informLogo,
    accent: "#58AE8D",
  }),
  w({
    slug: "scale",
    kind: "client",
    company: "Scale",
    title: "Fullstack Developer",
    products: ["Bulba", "Flamingo", "CVF"],
    summary: "Fullstack development and systems integration on Bulba, Flamingo and CVF.",
    sectors: ["SaaS"],
    tech: ["Vue.js", "Node.js", "Python"],
    accent: "#58AE8D",
  }),
  w({
    slug: "pevepas",
    kind: "client",
    company: "Pevepas",
    title: "Frontend Developer",
    products: ["GTA RP Pevepas"],
    summary: "Frontend for a GTA role-play gaming community.",
    sectors: ["Gaming"],
    tech: ["Vue.js", "Nuxt", "Pinia", "Tailwind CSS"],
    accent: "#58AE8D",
  }),
  w({
    slug: "relevo-lab",
    kind: "client",
    company: "Relevo Lab",
    title: "Frontend Developer",
    products: ["Associação Comercial de São Paulo"],
    summary: "Web platform for the São Paulo Commercial Association (ACSP).",
    sectors: ["Institutional"],
    tech: ["Vue.js", "Node.js"],
    logoId: acspLogo,
    accent: "#58AE8D",
    links: [{ label: "acsp.com.br", url: "https://www.acsp.com.br/" }],
  }),
  w({
    slug: "softwrap",
    kind: "client",
    company: "SoftWrap",
    title: "Frontend Developer",
    products: ["DM Health"],
    summary: "DM Health, a healthcare web application built with ASP.NET.",
    sectors: ["Healthcare"],
    tech: ["ASP.NET"],
    accent: "#58AE8D",
  }),
  w({
    slug: "triade-social",
    kind: "client",
    company: "Tríade Social",
    title: "Frontend Developer",
    products: ["+Chat"],
    summary: "Frontend for +Chat, a chat product.",
    sectors: ["Social"],
    tech: ["Angular", "Vue.js", "Python"],
    accent: "#58AE8D",
  }),
  w({
    slug: "dollar-donation-club",
    kind: "client",
    company: "Dollar Donation Club",
    title: "Frontend Developer",
    products: ["Institutional website"],
    summary: "Website for Dollar Donation Club — $1 a month, pooled with thousands of members, to vetted charities.",
    sectors: ["Non-profit"],
    tech: ["Vue.js"],
    logoId: ddcLogo,
    coverId: ddcCover,
    video: "https://www.youtube.com/watch?v=MDAgi4DYIuc",
    accent: "#F5A3C7",
    links: [{ label: "dollardonationclub.com", url: "https://dollardonationclub.com/" }],
  }),

  /* ---------------- Projects ---------------- */
  w({
    slug: "projeto-dev",
    kind: "project",
    company: "Projeto Dev",
    title: "Social project · Founder",
    summary: "A social project I created in 2020 to help people break into tech — orientation, mentoring and a path to the first job.",
    description:
      "Projeto Dev supports people who want to break into IT — career orientation, mentoring, code reviews and a realistic path to the first role. I founded it in 2020 and keep it running alongside client work.",
    start: "2020",
    end: "",
    location: "",
    sectors: ["Community", "Education"],
    tech: ["Mentoring"],
    accent: "#EACE43",
  }),
  w({
    slug: "multichat-overlay",
    kind: "project",
    company: "multichat-overlay",
    title: "Open source · One chat for every stream",
    summary:
      "An OBS overlay that merges Twitch, YouTube, Kick and TikTok chat into one themeable feed — Node.js adapters, a WebSocket pipe and moderation filters.",
    description:
      "I stream on Twitch, and multistreaming means four chats in four windows. multichat-overlay merges them: plug-and-play adapters for Twitch, YouTube (with live auto-detection), Kick and TikTok push messages through a WebSocket to a single overlay you add to OBS as a browser source.\n\nIt runs locally with no database, themes through CSS variables, and ships with a bad-words blocklist, message-length limits, emote-safe rendering, platform tags and a health endpoint.",
    start: "2026",
    location: "",
    sectors: ["Open source"],
    tech: ["JavaScript", "Node.js", "WebSocket", "OBS"],
    coverId: ghMultichat,
    accent: "#9146FF",
    links: [{ label: "GitHub", url: "https://github.com/herrmannjob/multichat-overlay" }],
  }),
  w({
    slug: "angular-signals",
    kind: "project",
    company: "angular-signals",
    title: "Open source · Live examples of Angular Signals",
    summary:
      "Thirteen live examples explaining Angular Signals in Portuguese — creating and updating signals, effects, computed values and converting Observables.",
    location: "",
    sectors: ["Open source", "Education"],
    tech: ["Angular", "TypeScript", "Signals", "RxJS"],
    coverId: ghSignals,
    accent: "#DD0031",
    links: [
      { label: "GitHub", url: "https://github.com/herrmannjob/angular-signals" },
      { label: "Live demo", url: "https://angular-signal-examples.netlify.app/" },
    ],
  }),
  w({
    slug: "qoda-web",
    kind: "project",
    company: "QODA-Web-Deploy",
    title: "Open source · Draw a digit, see the prediction",
    summary: "A web demo where you draw any digit in a box and a machine-learning model predicts it.",
    location: "",
    sectors: ["Open source", "AI"],
    tech: ["JavaScript", "Machine Learning"],
    coverId: ghQoda,
    accent: "#58AE8D",
    links: [{ label: "GitHub", url: "https://github.com/herrmannjob/QODA-Web-Deploy" }],
  }),
];

export function buildSeed(): Content {
  return structuredClone({
    version: 1 as const,
    settings: {
      name: "Gabriel Herrmann Grecchi",
      displayName: "Herrmann",
      headline: "Lead AI Engineer · Fullstack & Frontend Specialist",
      roles: ["Lead AI Engineer", "Frontend Specialist", "Fullstack Engineer", "Tech Lead"],
      intro:
        "I build mission-critical platforms for banking, healthcare and tech — enterprise frontend architecture, scalable backends and, since 2020, AI and LLM-powered products.",
      bio: [
        "I go by Herrmann — Gabriel Herrmann Grecchi on paper. Fullstack developer since 2014, mobile since 2017, Web3 and AI since 2020. Most of my work has been on mission-critical platforms in banking and finance, healthcare and pharma, and SaaS — products with millions of users, strict security and no room for downtime — plus consumer apps for retail, restaurants and gyms.",
        "My specialty is frontend engineering at enterprise scale: Angular architecture, Micro Frontends, design systems, performance and accessibility. I am just as comfortable on the backend with Python, C#/.NET, Node.js and Kotlin integrations, and I lead teams as a Tech Lead when the project needs it.",
        "Today I focus on AI engineering — LLMs, RAG, agentic patterns, evals and fine-tuning — through my own consultancy, Herrmann IT Consultoria. In 2020 I founded Projeto Dev, a social project that helps people get their first job in tech.",
      ],
      location: "Novo Hamburgo, RS — Brazil",
      timezone: "America/Sao_Paulo",
      email: "herrmannjob@gmail.com",
      phone: "",
      availability: { open: true, text: "Open to Lead AI Engineer and Tech Lead opportunities — remote, Brazil & international." },
      links: {
        linkedin: "https://www.linkedin.com/in/souherrmann",
        github: "https://github.com/herrmannjob",
        twitch: "https://twitch.tv/souherrmann",
        website: "",
      },
      company: {
        name: "Herrmann IT Consultoria",
        tagline: "Frontend engineering, fullstack development and application architecture.",
      },
      photoId: photo,
      stats: [
        { value: "12+", label: "years shipping software (since 2014)" },
        { value: "1M+", label: "users on the banking super app I worked on" },
        { value: "−50%", label: "load time via caching (Pharmalink)" },
        { value: "20+", label: "companies and products delivered" },
      ],
      skills: [
        { group: "AI & LLM", items: ["LLMs", "RAG", "Agentic patterns", "Evals", "Fine-tuning", "Prompt engineering", "Claude Code", "Cursor"] },
        { group: "Frontend", items: ["Angular", "React", "Vue.js", "Next.js", "Nuxt", "Svelte", "Micro Frontends", "Design Systems", "Tailwind CSS"] },
        { group: "Backend", items: ["Python", "FastAPI", "Django", "C# / .NET", "Node.js", "NestJS", "Java / Spring", "Go"] },
        { group: "Mobile", items: ["Flutter", "Dart", "Kotlin", "React Native", "Ionic"] },
        { group: "Data & Infra", items: ["PostgreSQL", "SQL Server", "MongoDB", "Redis", "Docker", "Kubernetes", "RabbitMQ", "Kafka", "AWS", "Azure DevOps", "GCP"] },
      ],
      education: [
        { period: "2023", title: "Postgraduate — Biotechnology", school: "Faculdade Metropolitana do Estado de São Paulo" },
        { period: "2022", title: "Postgraduate — Information Security", school: "CENES" },
        { period: "2019 – 2023", title: "B.Sc. Information Systems", school: "FADERGS" },
        { period: "2019 – 2022", title: "Technologist — Internet Systems", school: "Faculdade das Américas (FAM)" },
        { period: "2020 – 2021", title: "MBA — Mobile Development", school: "PROMINAS" },
        { period: "2017 – 2019", title: "Technologist — IT Management", school: "UNICESUMAR" },
      ],
      certifications: [
        { date: "2020-07", title: "Cloud Computing & Serverless", issuer: "Digital Innovation One", url: "" },
        { date: "2020-06", title: "Scrum Foundations (SFPC)", issuer: "Certiprof", url: "" },
        { date: "2019-12", title: "What is Data Science", issuer: "IBM", url: "https://www.coursera.org/account/accomplishments/certificate/Y85BZJ2RDA3V" },
      ],
      languages: [
        { name: "Portuguese", level: "Native" },
        { name: "English", level: "Advanced" },
        { name: "Spanish", level: "Technical" },
      ],
      seo: {
        title: "Herrmann — Lead AI Engineer · Fullstack & Frontend Specialist",
        description:
          "Portfolio of Herrmann (Gabriel Herrmann Grecchi): mission-critical platforms for banking, healthcare and tech, enterprise frontend architecture and AI engineering.",
      },
      journey: JOURNEY,
      recommendations: RECOMMENDATIONS,
      i18n: {
        pt: { ...I18N_SETTINGS.pt, journey: JOURNEY_I18N.pt },
        es: { ...I18N_SETTINGS.es, journey: JOURNEY_I18N.es },
        zh: { ...I18N_SETTINGS.zh, journey: JOURNEY_I18N.zh },
      },
    },
    works,
    media,
  });
}
