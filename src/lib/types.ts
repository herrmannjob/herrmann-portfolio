import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Media                                                              */
/* ------------------------------------------------------------------ */

export const MediaKind = z.enum(["upload", "remote", "static"]);
export type MediaKind = z.infer<typeof MediaKind>;

export const MediaSchema = z.object({
  id: z.string().min(1),
  /** /media/uploads/x.webp (upload) · https://… (remote) · /seed/x.jpg (static) */
  src: z.string().min(1),
  kind: MediaKind,
  alt: z.string().default(""),
  /** Where a researched image came from (page URL) — shown in the admin only */
  credit: z.string().default(""),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  bytes: z.number().int().nonnegative().optional(),
  mime: z.string().optional(),
  createdAt: z.string(),
});
export type Media = z.infer<typeof MediaSchema>;

/* ------------------------------------------------------------------ */
/* Work — an opportunity (role), a client engagement or a project     */
/* ------------------------------------------------------------------ */

export const WorkKind = z.enum(["role", "client", "project"]);
export type WorkKind = z.infer<typeof WorkKind>;

export const WORK_KIND_LABEL: Record<WorkKind, string> = {
  role: "Role",
  client: "Client",
  project: "Project",
};

export const WORK_KIND_LABEL_PT: Record<WorkKind, string> = {
  role: "Experiência",
  client: "Cliente (consultoria)",
  project: "Projeto",
};

const yearMonth = z
  .string()
  .regex(/^\d{4}(-\d{2})?$/, "Use AAAA ou AAAA-MM");

export const MetricSchema = z.object({
  value: z.string().min(1).max(16),
  label: z.string().min(1).max(80),
});

export const LinkSchema = z.object({
  label: z.string().min(1).max(40),
  url: z.string().url(),
});

/* ------------------------------------------------------------------ */
/* Translations — base content is English; pt/es override text fields */
/* ------------------------------------------------------------------ */

export const CONTENT_LOCALES = ["pt", "es", "zh"] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];
const LangSchema = z.enum(["en", "pt", "es", "zh"]);

export const WorkI18nSchema = z
  .object({
    title: z.string().max(120),
    via: z.string().max(80),
    products: z.array(z.string().max(60)),
    summary: z.string().max(400),
    description: z.string().max(6000),
    location: z.string().max(80),
    sectors: z.array(z.string().max(40)),
    highlights: z.array(z.string().max(400)),
    metrics: z.array(MetricSchema).max(6),
  })
  .partial();
export type WorkI18n = z.infer<typeof WorkI18nSchema>;

export const WorkSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug: letras minúsculas, números e hífens"),
  kind: WorkKind,
  company: z.string().min(1).max(80),
  /** Role held (for roles/clients) or tagline (for projects) */
  title: z.string().max(120).default(""),
  /** Optional: who the work was delivered for / through (e.g. "via Sciensa") */
  via: z.string().max(80).default(""),
  /** Products or platforms worked on */
  products: z.array(z.string().max(60)).default([]),
  summary: z.string().max(400).default(""),
  description: z.string().max(6000).default(""),
  start: yearMonth.or(z.literal("")).default(""),
  /** empty = present */
  end: yearMonth.or(z.literal("")).default(""),
  location: z.string().max(80).default(""),
  sectors: z.array(z.string().max(40)).default([]),
  highlights: z.array(z.string().max(400)).default([]),
  metrics: z.array(MetricSchema).max(6).default([]),
  tech: z.array(z.string().max(40)).default([]),
  links: z.array(LinkSchema).max(8).default([]),
  logoId: z.string().default(""),
  coverId: z.string().default(""),
  gallery: z.array(z.string()).default([]),
  accent: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#A8D965"),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
  updatedAt: z.string().default(""),
  /** Optional pt/es overrides; absent → kept as-is on save */
  /** Optional video: YouTube / Vimeo link or a direct .mp4/.webm file */
  video: z.string().url().or(z.literal("")).default(""),
  /** Optional pt/es/zh overrides; absent → kept as-is on save */
  i18n: z
    .object({ pt: WorkI18nSchema.optional(), es: WorkI18nSchema.optional(), zh: WorkI18nSchema.optional() })
    .optional(),
});
export type Work = z.infer<typeof WorkSchema>;

/* ------------------------------------------------------------------ */
/* Settings                                                           */
/* ------------------------------------------------------------------ */

export const SettingsI18nSchema = z
  .object({
    headline: z.string().max(120),
    roles: z.array(z.string().max(60)).max(6),
    intro: z.string().max(400),
    bio: z.array(z.string().max(1200)).max(6),
    location: z.string().max(80),
    availabilityText: z.string().max(140),
    companyTagline: z.string().max(200),
    stats: z.array(MetricSchema).max(6),
    /** Same order as settings.skills */
    skillGroups: z.array(z.string().max(40)).max(10),
    education: z
      .array(z.object({ period: z.string().max(30), title: z.string().max(120), school: z.string().max(120) }))
      .max(12),
    languages: z.array(z.object({ name: z.string().max(30), level: z.string().max(30) })).max(6),
    seo: z.object({ title: z.string().max(90), description: z.string().max(200) }),
  })
  .partial();
export type SettingsI18n = z.infer<typeof SettingsI18nSchema>;

export const RecommendationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(80),
  /** Their headline/role at the time, as shown on LinkedIn */
  headline: z.string().max(200).default(""),
  /** How they worked together, as LinkedIn states it (localized in the UI) */
  relation: z.enum(["same-team", "different-teams", "managed-directly", "other"]).default("other"),
  /** YYYY-MM-DD the recommendation was written */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal("")).default(""),
  text: z.string().min(1).max(3000),
  /** Language the recommendation was written in */
  lang: LangSchema.default("pt"),
  url: z.string().url().or(z.literal("")).default(""),
  /** Labelled translations of `text` (the original is always one click away) */
  translations: z
    .object({ en: z.string().max(3000), pt: z.string().max(3000), es: z.string().max(3000), zh: z.string().max(3000) })
    .partial()
    .default({}),
});
export type Recommendation = z.infer<typeof RecommendationSchema>;

export const SettingsSchema = z.object({
  name: z.string().min(1).max(80),
  /** How the site presents him first (hero, nav, titles); `name` stays available as the full name */
  displayName: z.string().min(1).max(40).default("Herrmann"),
  headline: z.string().max(120),
  roles: z.array(z.string().max(60)).max(6),
  intro: z.string().max(400),
  bio: z.array(z.string().max(1200)).max(6),
  location: z.string().max(80),
  timezone: z.string().max(40),
  email: z.string().email().or(z.literal("")),
  phone: z.string().max(30).default(""),
  availability: z.object({
    open: z.boolean(),
    text: z.string().max(140),
  }),
  links: z.object({
    linkedin: z.string().url().or(z.literal("")),
    github: z.string().url().or(z.literal("")),
    twitch: z.string().url().or(z.literal("")),
    website: z.string().url().or(z.literal("")),
  }),
  company: z.object({
    name: z.string().max(80),
    tagline: z.string().max(200),
  }),
  photoId: z.string().default(""),
  stats: z.array(MetricSchema).max(6),
  skills: z
    .array(z.object({ group: z.string().max(40), items: z.array(z.string().max(40)) }))
    .max(10),
  education: z
    .array(z.object({ period: z.string().max(30), title: z.string().max(120), school: z.string().max(120) }))
    .max(12),
  certifications: z
    .array(
      z.object({
        date: z.string().max(20),
        title: z.string().max(120),
        issuer: z.string().max(80),
        url: z.string().url().or(z.literal("")),
      }),
    )
    .max(12),
  languages: z.array(z.object({ name: z.string().max(30), level: z.string().max(30) })).max(6),
  seo: z.object({
    title: z.string().max(90),
    description: z.string().max(200),
  }),
  /** Optional pt/es overrides; absent → kept as-is on save */
  /** LinkedIn recommendations, shown verbatim in their original language */
  recommendations: z.array(RecommendationSchema).max(20).default([]),
  /** Optional pt/es/zh overrides; absent → kept as-is on save */
  i18n: z
    .object({ pt: SettingsI18nSchema.optional(), es: SettingsI18nSchema.optional(), zh: SettingsI18nSchema.optional() })
    .optional(),
});
export type Settings = z.infer<typeof SettingsSchema>;

/* ------------------------------------------------------------------ */
/* Whole document                                                     */
/* ------------------------------------------------------------------ */

export const ContentSchema = z.object({
  version: z.literal(1),
  settings: SettingsSchema,
  works: z.array(WorkSchema),
  media: z.array(MediaSchema),
});
export type Content = z.infer<typeof ContentSchema>;
