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
    /** When the page was read (YYYY-MM-DD). Required for inputs of charityevals' own models. */
    retrieved: z.string().optional(),
    /** Page, table or section in the document where the number appears. */
    page: z.string().optional(),
    /** The sentence or table cell the number is read from, verbatim (short). */
    quote: z.string().optional(),
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
  /** Shared assumptions: the jargon name economists use, shown once beside the plain label. */
  technical: z.string().optional(),
  /** Shared assumptions only: show the value times `factor`, in `format`, without changing what the
   * models read. Lets a multiplier on an evaluator's weights read in the site's own terms. */
  shown_as: z.object({ factor: z.number().positive(), format: Format.optional(), inverse: z.boolean().optional() }).strict().optional(),
  /** Shared assumptions only: a number taken from evidence rather than a judgment call. Listed with
   * its source and range on the assumptions page, but not offered as a slider. */
  fixed: z.boolean().optional(),
  /** Shared assumptions only: the slider's ends, when they differ from the plausible range the
   * uncertainty uses. `zero` adds a stop at 0 below a log scale, for a weight some readers set to
   * nothing at all. */
  slider: z.object({ low: z.number().positive().optional(), high: z.number().positive().optional(), zero: z.boolean().optional() }).strict().optional(),
  /** Shared assumptions only: how the reader sets it, when not a slider. `country`: a list of countries,
   * the value an ISO 3166 numeric code (facts/countries.json), 0 for none. */
  control: z.enum(["country"]).optional(),
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
   * must say why we differ. On a calculated row (one that reads a shared fact in our view, say), the
   * evaluator view uses this number instead of the formula, so the sheet still reproduces. */
  published: z.union([z.number(), Range]).optional(),
  /** Facts that stand for one physical change (a hen moved out of a cage): the change in a few words,
   * for the note on rows that use the fact in place of an evaluator's own number. */
  change: z.string().optional(),
  kind: Kind.optional(),
  source: Source.optional(),
  /** Markdown. Why this row exists, how the number was chosen, what would change it. */
  explainer: z.string().optional(),
  /** The value the original source reports for this row. `npm run check` fails when the model
   * doesn't reproduce it, which is how an import proves itself. */
  expected: z.number().optional(),
  /** A side effect: good or harm beyond the programme's main chain (spillovers to others, effects on
   * other outcomes, displacement, system effects). Every row that reads it reads it scaled by
   * `$side_effect_weight` in our view (src/engine/model.ts withSideEffectWeight): `added`, an amount or
   * share added to the result, times the weight; `factor`, a multiplier, its excess over 1 times the
   * weight. The evaluator view counts it in full. */
  side_effect: z.enum(["added", "factor"]).optional(),
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
    if (r.published !== undefined && !r.explainer)
      ctx.addIssue({ code: "custom", message: `row ${r.id}: a published value needs an explainer saying why ours differs` });
  });
export type Row = z.infer<typeof Row>;

/** In a model that `extends` another, a row may override only some fields of the parent's row. */
export const RowPatch = z.object({ ...rowShape, label: z.string().optional() }).strict();
export type RowPatch = z.infer<typeof RowPatch>;

export const Cause = z.enum(["global-health", "animal-welfare", "ai-safety", "climate"]);

/** Intervention families for charityevals' own models (the build-cea skill). Each prescribes a row
 * structure, so models of the same family can be compared row by row. */
export const TemplateFamily = z.enum(["direct-health", "cash-income", "wellbeing", "corporate-campaign", "diet-change", "policy-research-meta", "domestic-services", "humanitarian-relief", "medical-research", "companion-animals", "conservation", "rights-advocacy"]);

/** `kind`: whose rows these are. evaluator (the default): rows that reproduce the evaluator's sheet.
 * ours: charityevals' steps after the evaluator's bottom line (credit, bridges, the species step), the
 * same for every model of the kind (docs/normalization.md). */
export const Section = z.object({ id: z.string(), title: z.string(), explainer: z.string().optional(), kind: z.enum(["evaluator", "ours"]).optional() }).strict();

export const Resource = z
  .object({
    title: z.string(),
    url: z.string().url(),
    type: z.enum(["evaluation", "model", "data", "study", "charity", "other"]),
    note: z.string().optional(),
  })
  .strict();

/** Who made a model: an evaluator whose analysis we reproduce, or charityevals itself. */
export const Owner = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    short: z.string(),
    url: z.string().url(),
    kind: z.enum(["evaluator", "charityevals"]),
    about: z.string().optional(),
  })
  .strict();
export type Owner = z.infer<typeof Owner>;

/** A charity: the organisation itself. Any number of models, by different owners, can point to it. */
export const Charity = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    cause: Cause,
    website: z.string().url().optional(),
    /** Where to give: the charity's own donation page, or an evaluator's form for it. */
    donate: z.string().url().optional(),
    /** Set when `donate` goes through an evaluator's form rather than the charity's own page. */
    donate_via: z.string().optional(),
    summary: z.string().optional(),
    resources: z.array(Resource).default([]),
    /** What the charity spends on its programmes, from its accounts: the total its lines are part of. */
    spending: z
      .object({
        /** Programme expenses (no fundraising or management), in USD, for the year named. */
        programme: z.number().positive(),
        year: z.number().int(),
        /** URL and page of the accounts. */
        source: z.string(),
      })
      .strict()
      .optional(),
    /** The charity's programmes, from its accounts' finest published split (src/engine/ranking.ts):
     * each line's money and the models of it. Each evaluator's newest model of each line counts on the
     * rankings, the lines combined by their money; a line no model matches is a programme not yet
     * modelled, shown in the coverage. Without lines, all of an evaluator's models are one programme. */
    lines: z
      .array(
        z
          .object({
            id: z.string(),
            label: z.string(),
            /** Regular expression over model ids, tried in order: a model belongs to the first line it
             * matches. None: no model of this line yet. */
            models: z.string().optional(),
            /** The line's money in USD: the charity's spending on it, or, where the donate route is an
             * evaluator's restricted fund, that fund's grants. Used only when every modelled line has one;
             * otherwise the evaluator's figure is the lines' median. 0: no donated money reaches it. */
            dollars: z.number().nonnegative().optional(),
            /** URL and a one-line note on how the money was reached. */
            source: z.string().optional(),
          })
          .strict(),
      )
      .optional(),
    /** Money per location for a model with location variants (src/engine/ranking.ts): its figure is the
     * funding-weighted mean of these entries instead of the median location. An entry can cover several
     * locations when the split between them isn't published (they count as their median). List every
     * location of the family; unfunded ones at weight 0. */
    locations: z
      .array(
        z
          .object({
            /** The family's own model (the one the variants extend), e.g. "against-malaria-foundation". */
            family: z.string(),
            label: z.string(),
            /** Regular expression over the family's model ids (the family's own model is a location too). */
            models: z.string(),
            /** Dollars granted there in the window the source note names. */
            weight: z.number().nonnegative(),
            /** URL and a one-line note. */
            weight_source: z.string(),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();
export type Charity = z.infer<typeof Charity>;

export const Model = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    /** charity: a ranked organisation. variant: same charity, different setting (e.g. country).
     * template: reusable structure that others extend, not ranked by itself. */
    kind: z.enum(["charity", "variant", "template"]),
    cause: Cause,
    /** What the bottom line's dollar is (docs/normalization.md 2.10, INV-18): `past_average`, an
     * organisation's (or a field's) past spending over everything it achieved, which reads the slider
     * `$marginal_vs_past_average`; `marginal`, the evaluator's estimate of the next grant or of planned
     * work; `unit_cost`, a price per item delivered that more money buys again. Neither of the last two
     * reads the slider. Required on every charity model; variants inherit it. */
    estimate_basis: z.enum(["past_average", "marginal", "unit_cost"]).optional(),
    extends: z.string().optional(),
    /** Where the people (or animals) a dollar helps are, for the reader's distance weight
     * ($distance_discount, src/engine/model.ts distanceNode): each country's share by ISO 3166 alpha-3
     * code, summing to 1, with a "world" share for a part spread by world population; "world" alone for
     * a benefit spread so (climate, research with global reach); "destinations" for a charity whose good is the money it moves, where each
     * destination read live (`#id`) brings its own. Variants inherit it. Filled by
     * scripts/beneficiary-countries.ts. */
    beneficiaries: z.union([z.record(z.string().regex(/^([A-Z]{3}|world)$/), z.number().positive().max(1)), z.enum(["world", "destinations"])]).optional(),
    /** How `beneficiaries` was set: the data it was read from, or why it is a judgment. */
    beneficiaries_note: z.string().optional(),
    /** For an imported (evaluator's) model: the share of its result whose outcome isn't measured for this
     * charity (reach or effect a judgment, or the effect from research on other delivery), which our view
     * counts at $missing_data_discount: the result is (1 − thin_share) + thin_share × the slider
     * (docs/normalization.md 2.12, src/engine/model.ts missingDataNode). `note` says why. Required on
     * every imported model with a result in common units (INV-21); variants inherit it. charityevals'
     * own models never carry it: their branches' `missing_data_adj` rows apply the slider. Filled by
     * scripts/missing-data.ts. */
    missing_data: z.object({ thin_share: z.number().min(0).max(1), note: z.string().min(1) }).strict().optional(),
    /** For charityevals' own models: the build-cea template family the model follows. */
    template: TemplateFamily.optional(),
    /** The charity this model is about (inherited by variants). */
    charity: z.string().optional(),
    /** Who made the model: an id in owners.json (inherited by variants). */
    owner: z.string().optional(),
    /** Legacy: models before charities/ and owners.json named their organisation here. Accepted (and
     * ignored) so the history pages can still read those commits. */
    org: z.unknown().optional(),
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
    /** Everything a reader might want to check: the evaluator's review, its spreadsheets, the
     * charity's reports, and the studies and data the analysis cites. */
    resources: z.array(Resource).default([]),
    sections: z.array(Section).default([]),
    rows: z.array(RowPatch),
    /** The bottom line: a row whose value is benefit per dollar, in `unit`. */
    output: z
      .object({
        row: z.string(),
        unit: z.string(),
        label: z.string(),
        /** The evaluator's own bottom line, in its own unit (e.g. SADs per dollar), before our steps. */
        native: z.object({ row: z.string(), unit: z.string() }).strict().optional(),
        /** Animal models: the species their result passes through, each by its own `ced_<species>` row. */
        species: z.array(z.string()).optional(),
      })
      .strict()
      .optional(),
    /** A purely theoretical estimate: written about an idea before the charity existed (Ambitious
     * Impact's idea reports), not from the charity's own results. Shown only while the charity runs the
     * modelled programme and no model of its actual work exists (owner decision 2026-10-31); the site
     * flags it wherever the model or its dot appears. */
    theoretical: z
      .object({
        /** Why it is theoretical, in one sentence. */
        reason: z.string(),
        /** Evidence the charity runs the modelled programme today (what it runs, where). */
        runs: z.string(),
        /** The page that evidence is from. */
        url: z.string().url(),
        /** When it was checked (YYYY-MM-DD). */
        checked: z.string(),
      })
      .strict()
      .optional(),
    /** Imported by a generic converter (scripts/convert-sheet.py, convert-guesstimate.py) and traced
     * from the evaluator's sheet. scripts/link-parameters.py ties its moral weights, discount rate and
     * DALY value to the shared assumptions, and shared data to facts. */
    bulk: z.boolean().optional(),
    /** Set by scripts/summaries.ts on a bulk model's browser stand-in whose full rows make it a
     * value-of-information sheet: the stand-in folds those rows away, so the browser can't tell. */
    value_of_information: z.boolean().optional(),
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
    /** Formula over $assumptions and @facts (and, by bare id, fixed rows of the model it converts,
     * docs/normalization.md 2.5): how many common units one of this unit is worth. Every unit a
     * charity model reports in needs one (`npm run check` fails otherwise); a model in a unit
     * without one would get a page in its own unit but drop off the rankings. */
    to_common: z.string().optional(),
    explainer: z.string().optional(),
  })
  .strict();

/** Shared facts: data several models use, such as a country's child mortality rate, kept in one
 * place so every model uses the same number. Referenced in formulas as @<file id>.<row id>. */
export const Facts = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9_]*$/),
    label: z.string(),
    /** Where a whole file's data comes from (facts/countries.json). */
    source: Source.optional(),
    rows: z.array(Row),
    /** facts/countries.json only: world regions (UN M49 codes) and every country in one, with its population. */
    regions: z.array(z.object({ m49: z.number().int(), name: z.string() }).strict()).optional(),
    countries: z
      .array(
        z
          .object({
            iso3: z.string().regex(/^[A-Z]{3}$/),
            m49: z.number().int().positive(),
            name: z.string(),
            region: z.number().int(),
            population: z.number().int().nonnegative(),
            population_source: z.literal("wpp").optional(),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();
export type Facts = z.infer<typeof Facts>;

export const AssumptionGroup = z.object({ id: z.string(), title: z.string(), explainer: z.string().optional() }).strict();

export const Assumptions = z
  .object({
    groups: z.array(AssumptionGroup),
    rows: z.array(Row),
    /** Ready-made sets of values (the values panel's picker): each sets these sliders, the rest stay at
     * the defaults. A reader who moves a slider from a set is on Custom. */
    presets: z.array(z.object({ id: z.string(), label: z.string(), about: z.string(), values: z.record(z.string(), z.number()) }).strict()).optional(),
    units: z.record(z.string(), Unit),
    common: z.object({
      unit: z.string(),
      benchmark: z.string(),
      benchmark_label: z.string().optional(),
      /** The date an estimate's age is counted to (`$estimate_age_discount`, src/engine/model.ts estimateAge):
       * fixed in the data, bumped when the site's data is refreshed, never the build's clock. */
      estimate_age_as_of: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      /** With `$ignore_old_estimates` on, a model older than this many years leaves the rankings. */
      old_estimate_years: z.number().positive().optional(),
    }).strict(),
  })
  .strict();
export type Assumptions = z.infer<typeof Assumptions>;
