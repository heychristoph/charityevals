---
name: import-cea
description: Import a published cost-effectiveness analysis (GiveWell, ACE, Rethink Priorities, Founders Pledge, a charity's own sheet) into a charityevals model JSON that reproduces the source's numbers. Use when asked to import, add, model or re-create a CEA from a Google Sheet, xlsx or write-up.
---

# Import a CEA

Goal: a `models/<cause>/<id>.json` that **reproduces the source exactly**, with every input
sourced and explained, so a reader can change any number and see what moves. Faithful first.
Disagreements with the source go in explainers or a later variant, never silently into the numbers.

## 1. Find the source

- The evaluator's write-up page (GiveWell report, ACE charity review) and the linked Google Sheet.
- Note publisher, title, URL, sheet URL, publication date, today's date as `retrieved`, license.
  GiveWell is CC BY-NC-SA 3.0 US. ACE's terms are unclear, so say so in `license`.
- Read the write-up's CEA section. It explains *why* each number is what it is: that's your
  explainer material.

## 2. Dump the sheet

Run it in a scratch folder (it downloads the sheet; openpyxl needed):

```bash
python3 -I scripts/sheet-dump.py "<sheet url>" --cols A:F > dump.jsonl
```

Each line is one row with every cell's formula (`f`) and cached value (`v`). Read the main CEA tab
fully; follow cross-tab references (`Baseline!B22`) only far enough to decide whether that input
is a leaf (copy its value, cite the cell) or worth modelling.

## 2b. Or convert it in bulk

For a quick, faithful import, run the generic converter:

```bash
python3 scripts/convert-sheet.py sheet.xlsx --spec spec.json --out models/grants/<owner>
```

It traces the bottom-line cell (`spec.cell`, or found by its label) through every cell it depends on.
Constants become inputs, formulas become formulas with `expected`, and lookups with fixed keys
(INDEX, MATCH, FILTER) resolve to their cell. Anything else stays a fixed number with the original
formula in its explainer. `bottom` says how to read the cell: `xcash`, `uov`, `uov_per:<n>` or
`wellby_per:<n>`. Guesstimate models go through `scripts/convert-guesstimate.py`.

Then link it like a hand-built model: `scripts/link-parameters.py` turns moral weights into
`v * $life_value_multiplier`, links ln-consumption values, DALY values and the discount rate to their
assumptions (the sheet's values go into `evaluator.assumptions`, so the evaluator view still matches),
and moves statistics several sheets share into `facts/givewell*.json`. Extend its patterns when a new
evaluator labels these differently: nothing user-adjustable should stay a bare constant.

Bulk models live in `models/grants/` and are marked `bulk: true`. After adding any:

- run `npx tsx scripts/summaries.ts`: the browser gets them partially evaluated, with only the rows that depend on assumptions kept live;
- run `npx tsx scripts/bulk-writeups.ts`: a generated write-up for charities with no other model;
- record them in `inventory/`.

GiveWell's grant sheets are imported this way by `scripts/import-givewell-grants.py`. A hand-built
model (the steps below) always outranks a bulk one as a charity's main model.

## 3. Write the model

Every model has a `charity` (an id in `charities/`) and an `owner` (an id in `owners.json`). If the
charity already exists, for example because another evaluator models it, point the new model at
it with a new model id such as `<charity>-<owner>`; never make a second charity record. Create the
charity record (name, cause, website, donate link) only if it's missing. Add an owner to
`owners.json` if the evaluator is new.


Read `src/engine/schema.ts` and one existing model first (`models/global-health/givedirectly.json`
is the reference). Then:

- **One row per meaningful sheet row**, same order, grouped into `sections` that match the
  source's headings. Section explainers say what that block of the model is doing.
- **Inputs** (`value`): a constant in the sheet, or a cross-tab leaf. Each gets `kind`:
  - `observed`: from data (charity reports, surveys, financials, studies)
  - `estimate`: someone's calculation elsewhere (another tab, another evaluator)
  - `judgment`: a subjective adjustment or guess
  and a `source` with `cell` (always) plus `title`/`url` when the sheet names one.
- **Ranges**: use the source's own low/high where it gives them (GiveWell `Inputs` tab, ACE's
  Upper/Lower bound columns, RP's 90% intervals). Never invent ranges silently. If you add one,
  say "range is ours" in the explainer.
- **Formulas**: translate the sheet formula into our language (`src/engine/expr.ts`): row ids,
  `$assumption` refs, `+ - * / ^`, `ln exp min max sum avg pv_annuity_due`. Inline trivial
  constants (`=57/1000` → value 0.057). If you need a function we lack, add it to `FUNCTIONS`
  with a test.
- **Moral weights and cross-cause rates** belong in `assumptions/default.json`, referenced as
  `$name`, so users can change them once for every model. Reuse existing ones before adding.
  Set `evaluator: { name, assumptions }` on the model with the values the evaluator used, plus
  `count_salary_sacrifice: 0` and `full_credit: 0` (or 1 if the evaluator gives full credit),
  so the evaluator view reproduces their model exactly.
- **Shared facts** (country data such as PPP factors, mortality rates, population) live in
  `facts/<place>.json` and are referenced as `@kenya.ppp_factor_2017`. Check for an existing fact
  before adding a row with a country-level number; add new ones to the facts file, not the model.
- **Credit for shared outcomes:** where the evaluator credits the charity with a share of an
  outcome, keep the full outcome and the share as separate rows and combine them with
  `if($full_credit, 1, share)`, so visitors can switch to full credit.
- **Salary sacrifice:** add a "Your dollar's share" section like the existing models: staff pay as
  a share of cost, pay gap versus comparable for-profit jobs (both judgment, with reasoning), the
  forgone salary, the cash share of full cost using `if($count_salary_sacrifice, …, 0)`, and a
  per-donor-dollar output row. Use the charity's financials for staff costs where they exist.
- **Where we disagree** with an input, keep our value in `value`, the evaluator's in `published`,
  and say why in the explainer.
- **`expected`**: on every formula row, put the sheet's cached value. This is the proof of the
  import.
- **Explainers** (Markdown, 1–3 short paragraphs): what the number means, where it comes from,
  why it is that size, and what would change it. Write them for a smart donor, not an economist.
  Point out when an input is the big lever or the weak link.
- **`output`**: the per-dollar bottom line row and its unit (a key of `assumptions.units`). Add
  a unit with a `to_common` formula if the cause is new.
- Same charity, different setting (country, program)? Make a `variant` that `extends` the parent
  and overrides only the rows that differ, with `expected` on the rows the sheet reports.

- **Write-up:** `writeups/<id>.md`, a one-page evaluation shown on the charity's page. Sections:
  Summary (bottom line in both views and the range), What the charity does, How the impact
  happens, How the model works, What drives the result (the top swings from
  `npm run check -- <id>`), Where we differ from the evaluator, Biggest uncertainties, What isn't
  modelled, Sources. Plain language, every number checkable against the model. `npm run check`
  fails without it.

Prefer leaving a program **unmodelled** (say so in the summary and bottom-line section) over
forcing it into a structure that doesn't fit.

## 4. Verify

```bash
npm run check -- <id>
```

It must print `✓ all models valid`, reproduce every `expected` to 1e-6, and show a sensible
tornado. When a value doesn't match, the translation is wrong. Fix it; don't change `expected`.
Then `npm test` and `npm run dev` to look at the model page.

## 5. Report

Tell the user: the bottom line in native units and × the benchmark, how many source values were
reproduced, the 3 biggest swings, the flags, and every place you used judgment that wasn't the
source's (added ranges, merged rows, skipped tabs).
