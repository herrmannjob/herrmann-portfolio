import { CONTENT_LOCALES, type Content, type Media, type Work } from "./types";
import { RECOMMENDATIONS } from "./seed-recommendations";
import { DEFAULT_LOCATION, SECTORS as I18N_SECTORS, SETTINGS as I18N_SETTINGS, WORKS as I18N_WORKS } from "./seed-i18n";

/**
 * Initial content, built from Gabriel's CVs (PT/EN, 2026), his GitHub profile
 * and public pages of the companies he worked for.
 *
 * Remote images point at each company's own public site (og:image, logo,
 * product shots) researched on 2026-10-10. They are stored as `remote` media:
 * the admin can replace them, or press "Baixar para o servidor" to keep a
 * local copy (or run `npm run media:localize` to download all at once).
 *
 * Metrics are only those stated in the CVs — nothing invented.
 */

const NOW = "2026-10-10T00:00:00.000Z";
const DEFAULT_LOCATION_EN = "Novo Hamburgo, Brazil · Remote";

const media: Media[] = [];
function m(
  id: string,
  src: string,
  alt: string,
  credit = "",
  kind: Media["kind"] = "remote",
  size?: { width: number; height: number },
): string {
  media.push({ id, src, alt, credit, kind, createdAt: NOW, ...size });
  return id;
}
/** Phone screenshot from an app-store listing (portrait — shown uncropped) */
const shot = (id: string, src: string, alt: string, credit: string, width = 392, height = 696) =>
  m(id, src, alt, credit, "remote", { width, height });

/* ---------- Photo ---------- */
const photo = m("photo-gabriel", "/seed/gabriel.jpg", "Retrato de Herrmann (Gabriel Herrmann Grecchi)", "", "static");

/* ---------- Zup Innovation ---------- */
const zupLogo = m("zup-logo", "https://zup.com.br/wp-content/uploads/2026/03/ZUP_Logotipo.svg", "Zup Innovation logo", "https://zup.com.br/");
const zupCover = m("zup-cover", "https://zup.com.br/wp-content/uploads/2026/09/Thumb_PT.jpg", "Zup Innovation — key visual", "https://zup.com.br/");
const zupG1 = m("zup-g1", "https://zup.com.br/wp-content/uploads/2026/08/Prancheta-1@2x.webp", "Zup Innovation — platforms illustration", "https://zup.com.br/");
const zupG2 = m("zup-g2", "https://zup.com.br/wp-content/uploads/2026/03/Prancheta-13_1@2x.webp", "Zup Innovation — product illustration", "https://zup.com.br/");
const zupG3 = m("zup-g3", "https://zup.com.br/wp-content/uploads/2026/03/AdobeStock_1001535127-1.webp", "Zup Innovation — engineering", "https://zup.com.br/");

/* ---------- Deal ---------- */
const dealLogo = m("deal-logo", "https://deal.com.br/manus-storage/DEALTechnologies_2755b59d.svg", "Deal Technologies logo", "https://deal.com.br/");
const dealCover = m("deal-cover", "https://deal.com.br/manus-storage/deal-hero-fallback_a6949b60.jpg", "Deal — hero", "https://deal.com.br/");
const dealG1 = m("deal-g1", "https://deal.com.br/manus-storage/deal-hero-intelligence_d00a55fa.png", "Deal — digital engineering & AI", "https://deal.com.br/");
const dealG2 = m("deal-g2", "https://deal.com.br/manus-storage/deal-culture-human-led_f3f881c1.png", "Deal — culture", "https://deal.com.br/");

/* ---------- TaqTaq ---------- */
const taqLogo = m("taqtaq-logo", "https://taqtaq.com.br/wp-content/uploads/2024/02/Taq-Taq-Logo-PNG-512-150x150-1.png", "TaqTaq logo", "https://taqtaq.com.br/");
const taqCover = m("taqtaq-cover", "https://taqtaq.com.br/wp-content/uploads/2024/06/TaqTaq-imagem-preview-2.jpg", "TaqTaq — global contact manager app", "https://taqtaq.com.br/");
const taqG1 = m("taqtaq-g1", "https://taqtaq.com.br/wp-content/uploads/2024/02/0007.jpg", "TaqTaq — app screen", "https://taqtaq.com.br/");
const taqG2 = m("taqtaq-g2", "https://taqtaq.com.br/wp-content/uploads/2024/02/0015.jpg", "TaqTaq — app screen", "https://taqtaq.com.br/");
const taqG3 = m("taqtaq-g3", "https://taqtaq.com.br/wp-content/uploads/2024/02/0020.jpg", "TaqTaq — app screen", "https://taqtaq.com.br/");
const taqG4 = m("taqtaq-g4", "https://taqtaq.com.br/wp-content/uploads/2024/02/0011.jpg", "TaqTaq — app screen", "https://taqtaq.com.br/");

/* ---------- CI&T ---------- */
const citLogo = m("ciandt-logo", "https://ciandt.com/themes/custom/ciandt_theme/logo.svg", "CI&T logo", "https://ciandt.com/br/pt-br");
const citCover = m("ciandt-cover", "https://dmwnh9nwzeoaa.cloudfront.net/2025-05/CI%26T-Client%20Stories-WebPage-v1_0.png?d=1440x810", "CI&T — client stories", "https://ciandt.com/br/pt-br");
const citG1 = m("ciandt-g1", "https://dmwnh9nwzeoaa.cloudfront.net/2026-06/Colorful-geometric-shapes-in-white-background.png?d=1889x678", "CI&T — brand pattern", "https://ciandt.com/br/pt-br");
const citG2 = m("ciandt-g2", "https://dmwnh9nwzeoaa.cloudfront.net/2024-08/ciandt-logo-thumbnail.png", "CI&T — brand", "https://ciandt.com/br/pt-br");

/* ---------- ECS Inovação · Pharmalink (InterPlayers) ---------- */
const phLogo = m("pharmalink-logo", "https://www.interplayers.com.br/wp-content/uploads/2024/11/logo-pharmalink-endossada.svg", "Pharmalink by InterPlayers logo", "https://www.interplayers.com.br/pharmalink/");
const phCover = m("pharmalink-cover", "https://www.interplayers.com.br/wp-content/uploads/2024/11/pharmalink-image-hero.webp", "Pharmalink — hero", "https://www.interplayers.com.br/pharmalink/");
const phG1 = m("pharmalink-g1", "https://www.interplayers.com.br/wp-content/uploads/2024/11/App-Pharmalink.webp", "Pharmalink — app", "https://www.interplayers.com.br/pharmalink/");
const phG2 = m("pharmalink-g2", "https://www.interplayers.com.br/wp-content/webp-express/webp-images/uploads/2021/10/marketplace-pharmalink.png.webp", "Pharmalink — marketplace", "https://www.interplayers.com.br/pharmalink/");
const phG3 = m("pharmalink-g3", "https://www.interplayers.com.br/wp-content/webp-express/webp-images/uploads/2021/10/composicao-de-mix-de-produtos-pharmalink-v1.png.webp", "Pharmalink — product mix", "https://www.interplayers.com.br/pharmalink/");
m("interplayers-logo", "https://www.interplayers.com.br/wp-content/uploads/2024/04/logotipo-interplayers.svg", "InterPlayers logo", "https://www.interplayers.com.br/");

/* ---------- Herrmann IT clients ---------- */
const picpayLogo = m("picpay-logo", "/icons/picpay.svg", "PicPay logo", "https://simpleicons.org/", "static");
const picpayCover = m("picpay-cover", "https://picpay.com/pt-br/media_14bf25d41db01c1da3dbe2338a04b0ce342d97823.webp?width=1200&format=pjpg&optimize=medium", "PicPay — key visual", "https://picpay.com/");

const upCover = m("uplexis-cover", "https://images.prismic.io/uplsite/ZrIYA0aF0TcGIt3o_Dossielateral.png?auto=format,compress", "upMiner — dossier", "https://uplexis.com.br/");
const upG1 = m("uplexis-g1", "https://images.prismic.io/uplsite/ZrZroEaF0TcGI1Xn_uplink-4.png?auto=format,compress", "upLink — product", "https://uplexis.com.br/");
const upG2 = m("uplexis-g2", "https://images.prismic.io/uplsite/ZrZqJ0aF0TcGI1XI_Dossie-upscore.png?auto=format,compress", "upMiner — upScore dossier", "https://uplexis.com.br/");

const pernLogo = m("pernambucanas-logo", "https://casaspernambucanas.vtexassets.com/assets/vtex.file-manager-graphql/images/74483314-d4a4-49c7-a14f-c64487de1fdf___273e000a927402e7bd6cd3e44e5d6118.png", "Pernambucanas logo", "https://www.pernambucanas.com.br/");
const pernCover = m("pernambucanas-cover", "https://casaspernambucanas.vtexassets.com/assets/vtex.file-manager-graphql/images/556be16c-ba5d-4b78-8e13-271c68ecdc2b___0001736a6ebf70954da6ca7615b49fc6.jpg", "Pernambucanas — key visual", "https://www.pernambucanas.com.br/");

const milLogo = m("milvus-logo", "https://framerusercontent.com/images/goPQVcJWdyOuZKpauoU8I9oJjs.png", "Milvus logo", "https://milvus.com.br/");
const milCover = m("milvus-cover", "https://framerusercontent.com/images/NmIEaLLSJaVYzqnb3leCCrLloFo.webp", "Milvus — help desk platform", "https://milvus.com.br/");
const milG1 = m("milvus-g1", "https://framerusercontent.com/assets/Yhcz8Sh0LFEwSn3uUmjkibpPl0.webp", "Milvus — product overview", "https://milvus.com.br/");

const pactoCover = m("pacto-cover", "https://sistemapacto.com.br/og-image.webp", "Sistema Pacto — fitness management", "https://sistemapacto.com.br/");
const pactoG1 = m("pacto-g1", "https://sistemapacto.com.br/assets/dashboard-pacto-perfil-cliente-v2-1000-Cm7i8AWd.webp", "Sistema Pacto — client dashboard", "https://sistemapacto.com.br/");
const EC_STORE = "https://apps.apple.com/br/app/ec-pro/id1663011737";
const ecLogo = m("ecpro-logo", "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/36/1e/db/361edb1e-d0e7-85e3-8d71-0b79ba99022c/AppIcon.apppersonalizado-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg", "Engenharia do Corpo app (EC PRO) icon", EC_STORE, "remote", { width: 512, height: 512 });
const ecG1 = shot("ecpro-g1", "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/e5/b6/e0/e5b6e09f-f8b9-1725-ba2b-3f984cdfb55d/638d2a87-7325-4062-b9a8-1fc1d890bc9a_Iphone_5.5_-_1242x2208_-_01.png/392x696bb.png", "Engenharia do Corpo app — home screen", EC_STORE);
const ecG2 = shot("ecpro-g2", "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/1a/51/2c/1a512c63-a287-8bc0-daf1-7cfa4654b85c/c3a84c5a-07cc-4097-aae2-1f13ec942070_Iphone_5.5_-_1242x2208_-_02.png/392x696bb.png", "Engenharia do Corpo app — workout", EC_STORE);
const ecG3 = shot("ecpro-g3", "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/f4/dc/f2/f4dcf211-0f2d-912d-1e99-93dc2adb63ea/0b7dc2be-48d7-435d-8618-59e91bee506f_Iphone_5.5_-_1242x2208_-_03.png/392x696bb.png", "Engenharia do Corpo app — features", EC_STORE);
const ecG4 = shot("ecpro-g4", "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/7c/c3/b1/7cc3b17e-cb38-3165-b339-70d9cec042f2/9381faef-98ad-463c-a32f-ad772b8c1201_Iphone_5.5_-_1242x2208_-_04.png/392x696bb.png", "Engenharia do Corpo app — features", EC_STORE);
const usinaLogo = m("usina-logo", "https://usinadocorpoacademia.com.br/wp-content/uploads/2025/07/cropped-Design-sem-nome-5-1-270x270.png", "Usina do Corpo logo", "https://usinadocorpoacademia.com.br/", "remote", { width: 270, height: 270 });

/* ---------- Lojas Lebes ---------- */
const LEBES_STORE = "https://apps.apple.com/br/app/lojas-lebes/id1464057615";
const lebesLogo = m("lebes-logo", "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ff/12/26/ff122682-c2bc-460d-029e-0134497635cb/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg", "Lojas Lebes app icon", LEBES_STORE, "remote", { width: 512, height: 512 });
const lebesG1 = shot("lebes-g1", "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/dd/d3/f4/ddd3f459-315e-db58-b4db-8b987696337b/f8cad153-a7cb-4f72-9dd0-4d11106e4d40_Screenshot_2024-09-02_at_01.06.32_1.png/320x480bb.jpg", "Lojas Lebes app — screen", LEBES_STORE, 320, 480);
const lebesG2 = shot("lebes-g2", "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/9a/e5/d2/9ae5d2f6-b869-b7b8-6f7b-5b1c405cc1e3/6142ee32-258a-433d-a796-4f10f517814f_Simulator_Screenshot_-_iPhone_11_-_2024-09-13_at_18.03.03_1.png/320x480bb.jpg", "Lojas Lebes app — screen", LEBES_STORE, 320, 480);
const lebesG3 = shot("lebes-g3", "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/92/89/c3/9289c37a-de99-ff43-74cd-6d17f6b9982b/2e9b5cdc-9fa8-4fd9-9ad8-597f0c582cea_3.png/320x480bb.jpg", "Lojas Lebes app — screen", LEBES_STORE, 320, 480);
const lebesG4 = shot("lebes-g4", "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/9b/2d/3d/9b2d3d26-5eb9-98d3-1758-07b0669da84d/5eda04f4-632d-4607-bd5c-a1b29f1d5e51_4.png/320x480bb.jpg", "Lojas Lebes app — screen", LEBES_STORE, 320, 480);

/* ---------- Grupo Madero ---------- */
const MADERO_STORE = "https://apps.apple.com/br/app/grupo-madero-app/id1579688707";
const maderoLogo = m("madero-logo", "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/69/1d/6e/691d6e3e-9086-0eff-e6ba-4e998dd5ca21/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.jpg", "Grupo Madero app icon", MADERO_STORE, "remote", { width: 512, height: 512 });
const maderoG1 = shot("madero-g1", "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource116/v4/29/d9/79/29d9794f-70e3-0ead-e685-09534cea5a50/71c9cf92-8db9-4363-a2f8-e500fc374e8a_1_-_App_Madero_-_iPhone_5.5__U00281242_x_2208_px_U0029.png/392x696bb.png", "Grupo Madero app — screen", MADERO_STORE);
const maderoG2 = shot("madero-g2", "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/51/b1/02/51b102df-3e94-1c3d-7fae-a3b80948e2c2/3da1d214-de3d-499d-83a8-911e118bdcb2_2_-_App_Madero_-_iPhone_5.5__U00281242_x_2208_px_U0029.png/392x696bb.png", "Grupo Madero app — screen", MADERO_STORE);
const maderoG3 = shot("madero-g3", "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource116/v4/a7/fa/d1/a7fad1e9-82d6-b8a0-82b8-67a875291ae3/657a0dbb-550b-48d7-a0f5-c0ef66ba9acc_3_-_App_Madero_-_iPhone_5.5__U00281242_x_2208_px_U0029.png/392x696bb.png", "Grupo Madero app — screen", MADERO_STORE);
const maderoG4 = shot("madero-g4", "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/1f/98/d9/1f98d9f8-907c-6242-e02e-5a230f430272/2fc1fc96-3e51-40df-91cd-2d3ebdd11050_4_-_App_Madero_-_iPhone_5.5__U00281242_x_2208_px_U0029.png/392x696bb.png", "Grupo Madero app — screen", MADERO_STORE);

/* ---------- GitHub projects (social cards rendered by GitHub) ---------- */
const ghSignals = m("gh-angular-signals", "https://opengraph.githubassets.com/1/herrmannjob/angular-signals", "angular-signals on GitHub", "https://github.com/herrmannjob/angular-signals");
const ghQoda = m("gh-qoda", "https://opengraph.githubassets.com/1/herrmannjob/QODA-Web-Deploy", "QODA-Web-Deploy on GitHub", "https://github.com/herrmannjob/QODA-Web-Deploy");

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

/** Attach pt/es overrides: shared sector/location maps + per-work text from seed-i18n. */
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
    title: "Senior Frontend Engineer · Fullstack",
    products: ["Banking super app", "PJ treasury", "Investment broker"],
    summary:
      "Frontend specialist on a large-scale banking super app used by millions — corporate treasury (PJ) and investment-broker platforms with strict security, performance and reliability requirements.",
    description:
      "Enterprise Angular architecture for one of the largest banking super apps in Brazil. I built and maintained corporate treasury (PJ) platforms and investment-broker solutions, working inside a proprietary design system alongside Angular Material, Tailwind CSS and BEM.\n\nAPI contracts were negotiated and kept explicit with a Kotlin backend, and every change went through a strong culture of code quality, testing, security and maintainability — in close collaboration with product, UX and engineering on strategic technical decisions.",
    start: "2025-05",
    end: "2025-11",
    sectors: ["Banking", "Investments"],
    highlights: [
      "Large-scale banking super app used by millions of users",
      "Corporate treasury (PJ) and investment-broker platforms",
      "Enterprise-grade Angular architecture and a proprietary design system",
      "Performance, accessibility and UX on mission-critical flows",
      "Well-defined API contracts with a Kotlin backend",
    ],
    tech: ["Angular", "Angular Material", "Tailwind CSS", "BEM", "Design System", "Kotlin", "REST APIs"],
    logoId: zupLogo,
    coverId: zupCover,
    gallery: [zupG1, zupG2, zupG3],
    accent: "#FF5A36",
    featured: true,
    links: [{ label: "zup.com.br", url: "https://zup.com.br/" }],
  }),
  w({
    slug: "deal",
    kind: "role",
    company: "Deal",
    title: "Fullstack Developer · Frontend Specialist",
    products: ["Web banking platforms"],
    summary:
      "Web banking platforms for two financial-sector clients on a Micro Frontend architecture — technical reference for frontend standards and architecture.",
    description:
      "Two banking clients, one architecture: Micro Frontends that isolate domains and let each part of the product evolve independently. I acted as the frontend technical reference, defining code and architecture standards, building reusable and accessible interfaces with Angular and Angular Material and integrating with a Python backend through an ORM.\n\nOngoing work on performance, security, test coverage and technical quality.",
    start: "2024-08",
    end: "2024-12",
    sectors: ["Banking"],
    highlights: [
      "Web banking platforms for two financial-sector clients",
      "Micro Frontend architecture for domain isolation and independent evolution",
      "Frontend technical reference — code and architecture standards",
      "Python backend integration via ORM",
    ],
    tech: ["Angular", "Angular Material", "Micro Frontends", "Python", "ORM", "REST APIs"],
    logoId: dealLogo,
    coverId: dealCover,
    gallery: [dealG1, dealG2],
    accent: "#3D7BFF",
    featured: true,
    links: [{ label: "deal.com.br", url: "https://deal.com.br/" }],
  }),
  w({
    slug: "taqtaq",
    kind: "role",
    company: "TaqTaq",
    title: "Tech Lead",
    products: ["TaqTaq app (B2C · B2B · Events)"],
    summary:
      "Technical leadership of a new cross-platform app for B2C, B2B and events — from concept to production, on time and on budget.",
    description:
      "TaqTaq is a global contact-management and networking app. I led the build of the new cross-platform version from concept to production: architecture, technical planning and prioritization, plus hands-on mobile development in Flutter.\n\nIntroducing agile practices raised the team's project completion rate by more than 20%, and mentoring junior developers lifted code quality and technical maturity.",
    start: "2024-07",
    end: "2024-10",
    sectors: ["Mobile", "Networking", "Events"],
    highlights: [
      "Led a new multi-platform app from concept to production",
      "Owned architecture, technical planning and prioritization",
      "Responsive mobile apps in Flutter (Dart)",
      "Mentored junior developers",
    ],
    metrics: [{ value: "+20%", label: "project completion rate after agile adoption" }],
    tech: ["Flutter", "Dart", "HTML", "CSS", "Agile"],
    logoId: taqLogo,
    coverId: taqCover,
    gallery: [taqG1, taqG2, taqG3, taqG4],
    accent: "#2BB673",
    featured: true,
    links: [
      { label: "taqtaq.com.br", url: "https://taqtaq.com.br/" },
      { label: "App Store", url: "https://apps.apple.com/gr/app/taqtaq/id6478974936" },
    ],
  }),
  w({
    slug: "ciandt",
    kind: "role",
    company: "CI&T",
    title: "Fullstack Developer",
    products: ["Real-estate credit applications"],
    summary:
      "International projects for large financial and corporate companies — real-estate credit applications with Angular, C#/.NET and Python, and technical leadership on cloud projects.",
    description:
      "International engagements for large companies in the financial and corporate sectors, including real-estate credit applications built with Angular, C#/.NET and Python.\n\nI implemented CI/CD pipelines, testing and quality practices, ran code reviews and defined best practices — and led cloud projects technically.",
    start: "2023-12",
    end: "2024-08",
    sectors: ["Banking", "Corporate"],
    highlights: [
      "International projects for large financial and corporate companies",
      "Real-estate credit applications (Angular, C#/.NET, Python)",
      "CI/CD pipelines, testing and quality practices",
      "Technical leadership on cloud projects",
    ],
    metrics: [
      { value: "+30%", label: "user engagement" },
      { value: "−20%", label: "load time" },
    ],
    tech: ["Angular", ".NET", "C#", "Python", "CI/CD", "Cloud"],
    logoId: citLogo,
    coverId: citCover,
    gallery: [citG1, citG2],
    accent: "#F25C54",
    featured: true,
    links: [{ label: "ciandt.com", url: "https://ciandt.com/" }],
  }),
  w({
    slug: "pharmalink-ecs",
    kind: "role",
    company: "ECS Inovação",
    title: "Fullstack Developer · Frontend Lead",
    via: "for InterPlayers",
    products: ["Pharmalink Online", "Financial Cycle"],
    summary:
      "Technical owner of Pharmalink Online — a pharmaceutical hub and marketplace used by many players in the sector. Led the full AngularJS 1.8 → Angular 14 migration.",
    description:
      "Strategic healthcare and pharmaceutical projects in partnership with InterPlayers, partner and client of ECS. I was technically responsible for the evolution of Pharmalink Online, a pharmaceutical hub and marketplace.\n\nThe centerpiece was leading the complete frontend migration from AngularJS 1.8.2 to Angular 14 — technology and architecture upgrade, codebase modernization and a large reduction in technical debt — while guiding less senior developers to shorten delivery time.\n\nI also contributed directly to the financial calculation engine (Financial Cycle), worked on the backend and integrations, and introduced caching strategies that cut load time by up to 50%.",
    start: "2020-06",
    end: "2023-10",
    sectors: ["Healthcare", "Pharma", "Marketplace"],
    highlights: [
      "Technical owner of Pharmalink Online, a pharma hub & marketplace",
      "Led the full AngularJS 1.8.2 → Angular 14 migration",
      "Direct contribution to the Financial Cycle calculation engine",
      "Backend integrations and RESTful APIs",
      "Frontend technical reference and mentor",
    ],
    metrics: [{ value: "−50%", label: "load time with caching strategies" }],
    tech: ["Angular 14", "AngularJS", "C#", ".NET", "Tailwind CSS", "Python", "SQL Server", "REST APIs"],
    logoId: phLogo,
    coverId: phCover,
    gallery: [phG1, phG2, phG3],
    accent: "#00A3E0",
    featured: true,
    links: [{ label: "Pharmalink", url: "https://www.interplayers.com.br/pharmalink/" }],
  }),
  w({
    slug: "herrmann-it-consultoria",
    kind: "role",
    company: "Herrmann IT Consultoria",
    title: "Founder · Software Engineer · Frontend Specialist",
    summary:
      "My own technology consultancy. Frontend engineering, fullstack development and application architecture for national and international clients in banking, healthcare and SaaS.",
    description:
      "Herrmann IT Consultoria is how I work with clients directly. Depending on the engagement I act as Frontend Engineer, Fullstack Engineer or Tech Lead, allocated to medium and large strategic projects — always with a strong focus on code quality, performance, scalability, security and frontend architecture.\n\nSelected clients and products include PicPay (via Sciensa), upMiner and upLink (upLexis), Pernambucanas (via Cliqx), Lojas Lebes, Grupo Madero, Pacto Soluções (Engenharia do Corpo and Usina do Corpo apps), Milvus, Maxxidata, Facepass, UDS Broadcast and more — see the archive below.",
    start: "2013-12",
    end: "",
    sectors: ["Banking", "Healthcare", "SaaS"],
    highlights: [
      "Consultant (PJ) on medium and large strategic projects",
      "Frontend Engineer, Fullstack Engineer or Tech Lead as each client needs",
      "Enterprise, mission-critical and high-traffic products",
      "Caching strategies that cut load times by up to 50%",
    ],
    tech: ["Angular", "React", "Vue.js", "Nuxt", "Node.js", "NestJS", "Python", "C#", ".NET", "Tailwind CSS"],
    accent: "#A8D965",
    featured: true,
  }),

  /* ---------------- Clients through Herrmann IT ---------------- */
  w({
    slug: "picpay",
    kind: "client",
    company: "PicPay",
    via: "via Sciensa",
    title: "Frontend Developer",
    products: ["PicPay"],
    summary: "Frontend on a high-scale financial product.",
    sectors: ["Fintech"],
    tech: ["Angular", "React", "Redux"],
    logoId: picpayLogo,
    coverId: picpayCover,
    accent: "#21C25E",
  }),
  w({
    slug: "uplexis",
    kind: "client",
    company: "upLexis",
    title: "Tech Lead",
    products: ["upMiner", "upLink"],
    summary: "Technical leadership, architecture definition and team guidance on compliance and due-diligence platforms.",
    sectors: ["Compliance", "Data"],
    tech: ["Vue.js"],
    coverId: upCover,
    gallery: [upG1, upG2],
    accent: "#F6864C",
    links: [{ label: "uplexis.com.br", url: "https://uplexis.com.br/" }],
  }),
  w({
    slug: "pernambucanas",
    kind: "client",
    company: "Pernambucanas",
    via: "via Cliqx",
    title: "Fullstack Developer",
    summary: "Corporate solutions for one of Brazil's largest retailers.",
    sectors: ["Retail"],
    tech: ["C#", ".NET", "Angular"],
    logoId: pernLogo,
    coverId: pernCover,
    accent: "#E3262E",
  }),
  w({
    slug: "milvus",
    kind: "client",
    company: "Milvus",
    title: "Frontend Developer",
    products: ["Client Portal", "Manager Portal", "Chat Widget", "Windows Client"],
    summary: "Portals and chat widget for a help-desk and service-management platform.",
    sectors: ["SaaS"],
    tech: ["AngularJS", "Angular", "Tailwind CSS", "Bootstrap 5"],
    logoId: milLogo,
    coverId: milCover,
    gallery: [milG1],
    accent: "#4C6FFF",
    links: [{ label: "milvus.com.br", url: "https://milvus.com.br/" }],
  }),
  w({
    slug: "maxxidata",
    kind: "client",
    company: "Maxxidata",
    title: "Fullstack Developer",
    products: ["Synapse", "Masterdata"],
    summary: "Angular Micro Frontends with NestJS and Node.js services.",
    sectors: ["Data"],
    tech: ["Angular", "Micro Frontends", "NestJS", "Node.js", "React"],
    accent: "#58AE8D",
  }),
  w({
    slug: "uds-broadcast",
    kind: "client",
    company: "UDS",
    title: "Fullstack Developer",
    products: ["Broadcast OTC", "Broadcast Broker"],
    summary: "Financial platforms for OTC and brokerage.",
    sectors: ["Finance"],
    tech: ["Vue.js", "Tailwind CSS", "Node.js"],
    accent: "#58AE8D",
  }),
  w({
    slug: "inform-ekantika",
    kind: "client",
    company: "Inform / Ekantika",
    title: "Frontend Developer",
    products: ["Portal Manager", "Tempo"],
    summary: "Modern frontend architecture and state management.",
    sectors: ["SaaS"],
    tech: ["React", "Tailwind CSS", "Zustand"],
    accent: "#58AE8D",
  }),
  w({
    slug: "scale",
    kind: "client",
    company: "Scale",
    title: "Fullstack Developer",
    products: ["Bulba", "Flamingo", "CVF"],
    summary: "Fullstack development and systems integration.",
    sectors: ["SaaS"],
    tech: ["Vue.js", "Node.js", "Python"],
    accent: "#58AE8D",
  }),
  w({
    slug: "facepass",
    kind: "client",
    company: "Facepass",
    title: "Frontend Developer",
    products: ["Producer Portal", "Tickets", "Components"],
    summary: "Ticketing portal and component library.",
    sectors: ["Events"],
    tech: ["Vue.js", "Nuxt", "Pinia"],
    accent: "#0A4B82",
  }),
  w({
    slug: "pacto-solucoes",
    kind: "client",
    company: "Pacto Soluções",
    title: "Frontend Engineer",
    products: ["Engenharia do Corpo app (EC PRO)", "Usina do Corpo app", "Gym hotsites", "Pacto sales hotsite", "ZW"],
    summary:
      "Frontend for Pacto's fitness-management ecosystem — including the member apps of two of the largest gym chains in southern Brazil, Engenharia do Corpo and Usina do Corpo, and their hotsites.",
    description:
      "Pacto Soluções builds the management platform used by gyms and fitness businesses across Brazil. I worked on the main member apps delivered to the chains — the Engenharia do Corpo app (EC PRO) and the Usina do Corpo app — where members follow their workouts with loads and repetitions, book classes, check in and manage their contracts.\n\nI also built the chains' hotsites — plans, units and online sign-up — as well as Pacto's own sales hotsite, and contributed to the frontend of ZW, Pacto's management system.",
    sectors: ["SaaS", "Fitness", "Mobile"],
    highlights: [
      "Member apps for Engenharia do Corpo (EC PRO) and Usina do Corpo — workouts, class booking, check-in and contracts",
      "Hotsites for the gym chains: plans, units and online sign-up",
      "Pacto's sales hotsite",
      "Frontend for ZW, Pacto's management system",
    ],
    tech: ["Angular", "TypeScript", "Java"],
    logoId: ecLogo,
    coverId: pactoCover,
    gallery: [ecG1, ecG2, ecG3, ecG4, pactoG1, usinaLogo],
    accent: "#BCFF00",
    featured: true,
    links: [
      { label: "sistemapacto.com.br", url: "https://sistemapacto.com.br/" },
      { label: "EC PRO · App Store", url: EC_STORE },
      { label: "EC PRO · Google Play", url: "https://play.google.com/store/apps/details?id=com.pacto.engenhariadocorpo" },
      { label: "engenhariadocorpo.com.br", url: "https://engenhariadocorpo.com.br/" },
      { label: "usinadocorpoacademia.com.br", url: "https://usinadocorpoacademia.com.br/" },
    ],
  }),
  w({
    slug: "lojas-lebes",
    kind: "client",
    company: "Lojas Lebes",
    title: "App Developer",
    products: ["Lojas Lebes app (iOS · Android)"],
    summary:
      "Worked on creating the Lojas Lebes app — store credit (crediário), installments and personal loans in the customer's pocket, for a traditional retail chain from Rio Grande do Sul.",
    description:
      "Lojas Lebes is a traditional department-store chain from Rio Grande do Sul. I worked on creating the Lebes app, which puts the store's credit in its customers' hands: paying crediário installments, checking limits and balances, opening a credit account and requesting a personal loan — all in a clear, simple flow.",
    sectors: ["Retail", "Fintech", "Mobile"],
    highlights: [
      "Worked on building the new Lebes app",
      "Crediário in the app: pay installments, track limits and balances",
      "Personal loans requested straight from the phone",
      "Published on the App Store and Google Play",
    ],
    logoId: lebesLogo,
    gallery: [lebesG1, lebesG2, lebesG3, lebesG4],
    accent: "#E30613",
    links: [
      { label: "App Store", url: LEBES_STORE },
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=br.com.lebes.app" },
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
      "Worked on creating the Grupo Madero app — one ordering platform for the group's restaurant brands: Madero, Jeronimo, Legno and Dundee Chicken & Burgers.",
    description:
      "Grupo Madero is one of Brazil's best-known restaurant groups. I worked on creating its app: a single platform that brings together the group's four brands — Madero, Jeronimo, Legno and Dundee Chicken & Burgers — for ordering from the restaurants with app-exclusive prices and perks.",
    sectors: ["Restaurants", "Mobile"],
    highlights: [
      "Worked on building the Grupo Madero app",
      "One app for four brands: Madero, Jeronimo, Legno and Dundee",
      "Ordering from the restaurants with app-exclusive advantages",
      "Published on the App Store and Google Play",
    ],
    logoId: maderoLogo,
    gallery: [maderoG1, maderoG2, maderoG3, maderoG4],
    accent: "#C8102E",
    links: [
      { label: "App Store", url: MADERO_STORE },
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=br.com.alphacode.madero" },
    ],
  }),
  w({
    slug: "pevepas",
    kind: "client",
    company: "Pevepas",
    title: "Frontend Developer",
    products: ["GTA RP Pevepas"],
    summary: "Frontend for a role-play gaming community.",
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
    summary: "Web platform for the São Paulo Commercial Association.",
    sectors: ["Institutional"],
    tech: ["Vue.js", "Node.js"],
    accent: "#58AE8D",
  }),
  w({
    slug: "softwrap",
    kind: "client",
    company: "SoftWrap",
    title: "Frontend Developer",
    products: ["DM Health"],
    summary: "Healthcare web application.",
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
    summary: "Chat product frontend.",
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
    summary: "Institutional website.",
    sectors: ["Non-profit"],
    tech: ["Vue.js"],
    accent: "#58AE8D",
  }),

  /* ---------------- Projects ---------------- */
  w({
    slug: "projeto-dev",
    kind: "project",
    company: "Projeto Dev",
    title: "Social project · Founder",
    summary: "A social project I created in 2020 to support people entering the tech industry.",
    description:
      "Projeto Dev supports people who want to break into IT — orientation, mentoring and a path into the first role. I founded it in 2020 and keep it running alongside client work.",
    start: "2020",
    end: "",
    location: "",
    sectors: ["Community", "Education"],
    tech: ["Mentoring"],
    accent: "#EACE43",
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
    summary: "A web demo where you draw any number in a box and see the result.",
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
        { date: "2020-07", title: "Cloud Computing & Serverless", issuer: "Digital Innovation One", url: "https://certificates.digitalinnovation.one/C8A36941" },
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
      recommendations: RECOMMENDATIONS,
      i18n: I18N_SETTINGS,
    },
    works,
    media,
  });
}
