import { z } from "zod";

/**
 * Schemas compartilhados para os campos editoriais de `articles`.
 * Use no client (formulários admin) e no server (serverFns) para garantir
 * o mesmo contrato em ambos os lados.
 */

export const articleTypeSchema = z.enum(["news", "case", "risk", "guide"]);
export type ArticleType = z.infer<typeof articleTypeSchema>;

export const articleStatusSchema = z.enum(["draft", "review", "published", "archived"]);
export type ArticleStatus = z.infer<typeof articleStatusSchema>;

export const severityLevelSchema = z.enum(["baixo", "medio", "alto", "gravissimo"]);
export type SeverityLevel = z.infer<typeof severityLevelSchema>;

export const sourceConfidenceSchema = z.enum(["alta", "media", "baixa"]);
export type SourceConfidence = z.infer<typeof sourceConfidenceSchema>;

/** Linha do tempo (jsonb articles.timeline). */
export const timelineItemSchema = z.object({
  date: z.string().min(1).max(64),
  title: z.string().max(200).optional(),
  text: z.string().min(1).max(2000),
});
export type TimelineItem = z.infer<typeof timelineItemSchema>;

export const timelineSchema = z.array(timelineItemSchema).max(50);

/** FAQ (jsonb articles.faq). */
export const faqItemSchema = z.object({
  q: z.string().min(1).max(300),
  a: z.string().min(1).max(3000),
});
export type FaqItem = z.infer<typeof faqItemSchema>;

export const faqSchema = z.array(faqItemSchema).max(30);

/** Arrays text[] simples — strings curtas, sem duplicatas. */
export const shortTagListSchema = z
  .array(z.string().min(1).max(160))
  .max(30);

/** Bloco editorial agregado — útil em forms admin. */
export const articleEditorialSchema = z.object({
  reading_minutes: z.number().int().min(1).max(120).nullable().optional(),
  understand: z.string().max(8000).nullable().optional(),
  lessons: z.string().max(8000).nullable().optional(),
  timeline: timelineSchema.nullable().optional(),
  faq: faqSchema.nullable().optional(),
  related_laws: shortTagListSchema.nullable().optional(),
  related_signal_tags: shortTagListSchema.nullable().optional(),
  national_context: shortTagListSchema.nullable().optional(),
  action_steps: shortTagListSchema.nullable().optional(),
  warning_indicators: shortTagListSchema.nullable().optional(),
  severity_level: severityLevelSchema.nullable().optional(),
  impact_summary: z.string().max(2000).nullable().optional(),
  source_confidence: sourceConfidenceSchema.nullable().optional(),
  ai_summary: z.string().max(4000).nullable().optional(),
});
export type ArticleEditorial = z.infer<typeof articleEditorialSchema>;
