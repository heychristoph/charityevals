---
name: import-cea
description: Import a published cost-effectiveness analysis (GiveWell, ACE, HLI, Rethink Priorities, Founders Pledge, a charity's own sheet) into a charityevals model JSON that reproduces the source's numbers in the evaluator view and reaches years of healthy life per $1,000 in our view by the standard steps. Use when asked to import, add, model or re-create a CEA from a Google Sheet, xlsx or write-up. For a charity with no evaluator CEA, use build-cea; to review a model, use audit-cea.
---

# Import a CEA

Job: **reproduce the evaluator's model faithfully, then normalise it.** Their rows, numbers and
rates stay theirs (layer E, checked in the evaluator view); our standard steps come after their
bottom line (layers A–C, our view). Disagreements never go silently into their numbers.

Read first: **docs/normalization.md** (the principle, the conversion per outcome kind, INV-1…INV-10,
SAME-CHANGE, the owner decisions of 2026-10-30). It is the rulebook; this skill only says how to
apply it. The checks are src/engine/invariants.ts; the schema is src/engine/schema.ts.

Worked examples to copy:
- models/animal-welfare/the-humane-league.json: species step, shared per-change SAD figures as
  "changed for consistency" overwrites with ACE's number in `published`.
- models/animal-welfare/dansk-vegetarisk-forening.json: several species from one SADs figure.
- models/global-health/against-malaria-foundation.json: `output.native`, `ours` section, PV rebuilt
  on `$discount_rate` with GiveWell's rate pinned, credit by share of resources.
- models/global-health/strongminds.json, against-malaria-foundation-hli.json, models/grants/hli/:
  our discounting and value-of-life levers on an evaluator that has neither, pinned to HLI's values.

## 1. Find the source

- The evaluator's write-up and its sheet. Record publisher, title, URL, sheet URL, `published`
  (the ranking uses it), today as `retrieved`, and `license` (GiveWell: CC BY-NC-SA 3.0 US; ACE:
  unclear, say so).
- The write-up's CEA section explains why each number is what it is: that is explainer material.

## 2. Get the rows

- **By hand** (hand-built model): `python3 -I scripts/sheet-dump.py "<sheet url>" --cols A:F > dump.jsonl`
  in a scratch folder. Read the main tab fully; follow cross-tab references only until you can tell
  a leaf (copy the value, cite the cell) from a step worth modelling.
- **In bulk**: `python3 scripts/convert-sheet.py sheet.xlsx --spec spec.json --out models/grants/<owner>`
  (Guesstimate: `scripts/convert-guesstimate.py`). Bulk models live in `models/grants/`, carry
  `bulk: true`, and still follow every rule below.
  - GiveWell grant sheets: `scripts/import-givewell-grants.py` (runs `scripts/link-parameters.py`),
    then `python3 scripts/link-resource-shares.py`. Both only touch GiveWell models: for another
    evaluator, extend their patterns or link by hand.
  - Then `npx tsx scripts/summaries.ts` (the browser stand-ins; `npm run check` fails when stale),
    `npx tsx scripts/bulk-writeups.ts` (a generated write-up for charities with no other), and record
    the import in `inventory/`.

## 3. Reproduce the evaluator (layer E)

- Every model has a `charity` (charities/) and an `owner` (owners.json). A charity another evaluator
  already models gets a new model id `<charity>-<owner>`, never a second charity record.
- One row per meaningful sheet row, same order, in sections matching the sheet's headings (no
  `kind`: evaluator is the default).
- Inputs: `kind` (`observed`, `estimate`, `judgment`) and `source.cell` always, plus title/url where
  the sheet names one. Ranges only from the source (GiveWell Inputs tab, ACE bounds, RP intervals);
  a range you add says "range is ours".
- Formulas in src/engine/expr.ts syntax; a missing function goes into `FUNCTIONS` with a test.
- `expected` = the sheet's cached value on every formula row, including the evaluator's bottom line.
  Set `output.native` to that row and its unit (INV-6).
- Shared data from facts (`@kenya.ppp_factor_2017`, `@givewell*`, `@moral_weights`, `@sad_factors`,
  `@wellby_factors`): reuse before adding; new shared data goes into the facts file. A literal equal
  to a fact is an INV-4 violation.
- Where our view uses another number inside layer E (a shared fact, a correction): the row holds ours,
  `published` holds the evaluator's, and the explainer says "changed for consistency", their number
  and why. The evaluator view uses `published`, so the sheet still reproduces.
- A program that doesn't fit: leave it out and say so, rather than force it.

## 4. Shared levers (layer A), pinned in the evaluator view

`evaluator: { name, assumptions }` pins every assumption layer E reads to the evaluator's own value
(INV-5, INV-8): `resource_shares: 0`, their `discount_rate`, `life_value_multiplier: 1`, their
`uov_per_ln_consumption` / `uov_per_daly` where the sheet uses its own, and for AIM SADs models
`chicken_vs_person: 0.463966` (`@aim_sads.chicken`) with `rp_species_weights: 0`.

- **Deaths** read `$life_value_multiplier` (GiveWell: `@moral_weights.* * $life_value_multiplier`;
  HLI: scale the wellbeing of the years saved, as in AMF-HLI).
- **Future benefits** read `$discount_rate`. A frozen present value (a cached `=PV(…)`) is rebuilt
  from the sheet's inputs (`pv`, `pv_annuity_due`) with the sheet's value as `expected`. Decay rates
  and "opportunities get worse" rates are the sheet's own inputs, not the discount rate. An evaluator
  that doesn't discount (HLI) gets our discounting step in an `ours` section, pinned to 0.
- **Credit by share of resources** (`$resource_shares`). On: every contributor's money and staff's
  forgone pay share the outcome.
  - Leverage, funging and crowding-in/out steps become `if($resource_shares, <none>, <theirs>)`.
  - Where the sheet divides by the grantee's spending, divide by all contributors' spending when on
    (`if($resource_shares, total_spending_by_all_contributors, …)`).
  - The evaluator's own credit share (ACE's "contribution by other organisations") stays and applies
    in both modes.
  - Staff pay: an `ours` section with `staff_cost_share` (the program's own data, else the sector
    defaults in `SECTORS`, scripts/link-resource-shares.py), `salary_gap`, `salary_sacrifice`,
    `donor_cost_share = … if($resource_shares, salary_sacrifice, 0)`, and the per-donor-dollar row.
  - For GiveWell models, scripts/link-resource-shares.py does all of this.

## 5. Our steps to the scale (layers B and C)

- `output.unit` is `uov`, `daly`, `wellby` or `ced` (INV-1). No exchange rate between outcomes inside
  the model, except one the evaluator used, pinned (INV-2).
- Every row between `output.native` and `output.row` sits in a section with `kind: "ours"` and has
  no `expected` (INV-7).
- **Animals: the species step** (INV-3, normalization.md 2.4). Split SADs by species (`sads_<s>`,
  shares from facts such as `@sad_factors.meal_sads_share_<s>`), convert each with
  `ced_<s> = sads_<s> / @aim_sads.<s> * if($rp_species_weights, @welfare_ranges.<s>_vs_chicken, @aim_sads.<s> / @aim_sads.chicken)`
  copied exactly, sum them into the output, and list the species in `output.species`. Counts that
  aren't SADs use `ced_<s> = pain_days_<s> * @welfare_ranges.<s>_vs_chicken`. Only `ced_*` rows read
  `@welfare_ranges` or `@aim_sads`.
- **One SADs figure per physical change** (SAME-CHANGE): a row giving SADs for a change in
  facts/sad_factors.json (one with a `change` note) reads the fact, with the evaluator's figure in
  `published`, as in step 3.
- Outcomes not on the scale (papers, people reached, policy wins) need a bridge: our judgments, with
  ranges and reasons, in an `ours` section. Without one the model is shown but not ranked.

## 6. Ranking and the charity record

- Rules in src/engine/ranking.ts: per evaluator and program, the newest model by `source.published`
  counts, hand-built or bulk alike (hand-built first on the same date). Side sheets never count
  (skeleton, value-of-information, breakeven, optionality, threshold, sensitivity copies). One dot
  per evaluator; the charity's row shows its primary evaluator's figure.
- A charity whose evaluator models several programs gets `programs` in charities/<id>.json (model-id
  pattern, `weight` = funding share, `weight_source` = URL and a one-line note). A model with location
  variants gets `locations` (every location, unfunded ones at 0, each with `weight_source`). Cite the
  grant or budget pages; never guess a weight.

## 7. Write-up

`writeups/<id>.md` for a charity's main model (`npm run check` fails without one). Copy the shape of
writeups/the-humane-league.md and writeups/givedirectly.md:

- `###` headings, in this order, skipping any with nothing to say: Summary, What the charity does,
  How the impact happens, How the model works, What drives the result, Where we differ from
  <evaluator>, Biggest uncertainties, What isn't modelled, Sources.
- The summary opens with one plain sentence on what the charity does, then the result as a live
  figure: `**<span data-figure="headline" data-model="<id>">130</span> years of healthy life per $1,000**`.
- Results are always years of healthy life per $1,000, never multiples of GiveDirectly or another
  benchmark. A number that moves with the sliders is a live figure; a fixed number says whose it is
  ("ACE's own figure, 94"). No numbers copied from an old run of the model.
- "Where we differ": one bullet per changed-for-consistency row and per step of ours (species
  weights, discounting, value of life, staff pay, credit by share of resources), with the
  evaluator's number.
- Plain language. Glossary terms (SADs, WELLBYs, DALYs, units of value, funging, leverage,
  counterfactual, moral weight, welfare range) get info tips from src/lib/glossary.ts: don't define
  them inline.

## 8. Verify

- `npx tsx scripts/check.ts <id>`: every `expected` reproduces (1e-6), both views' results and the
  tornado. A mismatch means the translation is wrong: fix it, never `expected`.
  (`npm run check -- <id>` passes the id to the summaries check, not to check.ts.)
- `npx tsx scripts/normalization-audit.ts`: no violation for the model. Fix it. A flag you have
  checked by hand and found false (a coincidence of values, a word used otherwise) gets a waiver with
  its reason in src/engine/normalization-waivers.json; the allowlist stays empty. Remove stale waivers.
- `npm run check`, `npx vitest run`, `npx tsc --noEmit`; look at the page with `npm run dev`.

## 9. Report

The evaluator's result (native unit) and ours in years of healthy life per $1,000, in both views;
how many `expected` values reproduce; the three biggest swings; every changed-for-consistency row
(their number, ours); every judgment that isn't the source's (ranges added, rows merged, tabs
skipped); funding weights added and their sources.
