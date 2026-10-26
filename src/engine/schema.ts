import { z } from "zod";

/** Where a number comes from. `observed`: read from data (filings, studies, the charity).
 * `estimate`: someone's calculation outside this model (e.g. another evaluator's sheet).
 * `judgment`: a guess, with reasoning in the explainer. */
export const Kind = z.enum(["observed", "estimate", "judgment"]);
export type Kind = z.infer<typeof Kind>;

export const Format = z.enum(["number", "integer", "percent", "usd", "multiple", "small", "toggle"]);

export const Source = z
  .object({
    title: z.string().optional(),
    url: z.string().url().optional(),
    /** Cell or range in the original spreadsheet, e.g. "New CEA!B23". */
    cell: z.string().optional(),
    note: z.string().optional(),
  })
  .strict();

export const Range = z
  .object({ low: z.number().optional(), best: z.number(), high: z.number().optional() })
  .strict()
  .refine((r) => (r.low ?? r.best) <= r.best && r.best <= (r.high ?? r.best), {
    message: "needs low <= best <= high",
  });
export type Range = z.infer<typeof Range>;

const rowShape = {
  id: z.string().regex(/^[a-z][a-z0-9_]*$/, "row ids are snake_case"),
  label: z.string(),
  section: z.string().optional(),
  unit: z.string().optional(),
  format: Format.optional(),
  /** Input rows: a point value or a low/best/high range. */
  value: z.union([z.number(), Range]).optional(),
  /** Calculated rows: a formula over other rows, $assumptions and @facts. */
  formula: z.string().optional(),
  /** A published uncertainty range for a calculated row (e.g. GiveWell's 25th–75th percentile of
   * "years of effective coverage"). Sensitivity varies the row across it; the central value stays
   * the formula's. */
  range: z.object({ low: z.number(), high: z.number(), note: z.string().optional() }).strict().optional(),
  /** The source evaluator's value, when ours differs. The evaluator view uses it; the explainer
   * must say why we differ. */
  published: z.union([z.number(), Range]).optional(),
  kind: Kind.optional(),
  source: Source.optional(),
  /** Markdown. Why this row exists, how the number was chosen, what would change it. */
  explainer: z.string().optional(),
  /** The value the original source reports for this row. `npm run check` fails when the model
   * doesn't reproduce it, which is how an import proves itself. */
  expected: z.number().optional(),
};

export const Row = z
  .object(rowShape)
  .strict()
  .superRefine((r, ctx) => {
    if ((r.value === undefined) === (r.formula === undefined))
      ctx.addIssue({ code: "custom", message: `row ${r.id}: give exactly one of value or formula` });
    if (r.value !== undefined && !r.kind)
      ctx.addIssue({ code: "custom", message: `row ${r.id}: input rows need a kind` });
    if (r.value !== undefined && !r.source && !r.explainer)
      ctx.addIssue({ code: "custom", message: `row ${r.id}: input rows need a source or an explainer` });
    if (r.range !== undefined && r.formula === undefined)
      ctx.addIssue({ code: "custom", message: `row ${r.id}: range is for calculated rows; give inputs a low/best/high value` });
    if (r.published !== undefined && (r.value === undefined || !r.explainer))
      ctx.addIssue({ code: "custom", message: `row ${r.id}: a published value needs our own value and an explainer saying why they differ` });
  });
export type Row = z.infer<typeof Row>;

/** In a model that `extends` another, a row may override only some fields of the parent's row. */
export const RowPatch = z.object({ ...rowShape, label: z.string().optional() }).strict();
export type RowPatch = z.infer<typeof RowPatch>;

export const Cause = z.enum(["global-health", "animal-welfare", "ai-safety"]);

export const Section = z.object({ id: z.string(), title: z.string(), explainer: z.string().optional() }).strict();

export const Model = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    /** charity: a ranked organisation. variant: same charity, different setting (e.g. country).
     * template: reusable structure that others extend, not ranked by itself. */
    kind: z.enum(["charity", "variant", "template"]),
    cause: Cause,
    extends: z.string().optional(),
    org: z
      .object({
        name: z.string(),
        website: z.string().url().optional(),
        /** Where to give: the charity's own donation page, or an evaluator's fund for it. */
        donate: z.string().url().optional(),
        /** Set when `donate` goes through an evaluator's form rather than the charity's own page. */
        donate_via: z.string().optional(),
      })
      .strict()
      .optional(),
    summary: z.string().optional(),
    source: z
      .object({
        publisher: z.string(),
        title: z.string(),
        url: z.string().url(),
        sheet: z.string().url().optional(),
        published: z.string().optional(),
        retrieved: z.string(),
        license: z.string().optional(),
      })
      .strict()
      .optional(),
    sections: z.array(Section).default([]),
    rows: z.array(RowPatch),
    /** The bottom line: a row whose value is benefit per dollar, in `unit`. */
    output: z.object({ row: z.string(), unit: z.string(), label: z.string() }).strict().optional(),
    /** How to reproduce the evaluator's own model: the assumption values it used. In the
     * evaluator view these replace the visitor's (exchange rates between causes stay theirs). */
    evaluator: z
      .object({ name: z.string(), assumptions: z.record(z.string(), z.number()) })
      .strict()
      .optional(),
  })
  .strict();
export type ModelFile = z.infer<typeof Model>;

export const Unit = z
  .object({
    label: z.string(),
    short: z.string(),
    /** Formula over $assumptions: how many common units one of this unit is worth. */
    to_common: z.string(),
    explainer: z.string().optional(),
  })
  .strict();

/** Shared facts: data several models use, such as a country's child mortality rate, kept in one
 * place so every model uses the same number. Referenced in formulas as @<file id>.<row id>. */
export const Facts = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9_]*$/),
    label: z.string(),
    rows: z.array(Row),
  })
  .strict();
export type Facts = z.infer<typeof Facts>;

export const AssumptionGroup = z.object({ id: z.string(), title: z.string(), explainer: z.string().optional() }).strict();

export const Assumptions = z
  .object({
    groups: z.array(AssumptionGroup),
    rows: z.array(Row),
    units: z.record(z.string(), Unit),
    common: z.object({ unit: z.string(), benchmark: z.string(), benchmark_label: z.string() }).strict(),
  })
  .strict();
export type Assumptions = z.infer<typeof Assumptions>;
