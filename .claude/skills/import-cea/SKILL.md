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

**One consistent way** (owner, 2026-10-31): wherever charityevals has its own version of a
conversion (an exchange rate between outcomes, a DALY definition, value of life, discounting,
species or sentience weights, a cash benchmark, currency rates in facts/fx.json), our view uses ours,
as a visible "changed for consistency" row; never keep the evaluator's own conversion in our view.
Every slider must move every model it concerns. Where an evaluator gives a best guess and other cases
(conservative, optimistic), our view takes the best guess like everywhere else; the other cases
become the range.

## 1. Find the source

- Don't import unfinished work: a sheet or tab marked "in progress", "draft" or "WIP" that the
  evaluator hasn't published. Record it in `inventory/` as "not imported: unfinished".
- An estimate made before the charity existed (an idea or incubation report) is shown only if the
  charity actually runs the modelled programme today (cite where it says so) and no model based on
  the charity's actual data exists. Mark it `theoretical`, so the site flags it as purely
  theoretical; otherwise record it in `inventory/` as "not shown" with the reason.
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
`chicken_vs_person: 0.463966` (`@aim_sads.chicken_2024`) with `rp_species_weights: 0`.

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

- `output.unit` is `uov`, `daly`, `wellby`, `ced` or `tco2e` (INV-1). **One consistent way** (INV-2c,
  normalization.md 1 and 2.7): every conversion the evaluator made in its own way (an exchange rate
  between outcomes, the value of a death, depression to DALYs, a cash benchmark behind a multiple of
  cash, a pound/euro rate, a typed-in discount rate) reads the shared version in our view
  (`$uov_per_ln_consumption`, `@moral_weights`, `@depression.dalys_per_phq9_point_year`,
  `@cash.uov_per_dollar`, `@fx`, `$discount_rate`), with the evaluator's figure in `published` and a
  "changed for consistency" explainer. A concept two models use with different values and no shared
  version gets a new shared fact. `$uov_per_daly` in a row only with the evaluator's implied rate pinned.
- Text figures stated as a floor ("more than 10x") are taken at the floor and labelled "at least".
- Counterfactuals that subtract what the founders or the money would have done elsewhere are not
  used in our view: the ranking itself is that comparison. Funging and leverage steps follow the
  credit-by-share-of-resources lever as in section 4.
- **Life-equivalents** (GiveWell's 2017/2019 sheets, Founders Pledge's child-life equivalents): GiveDirectly's
  cost per life-equivalent reads `@moral_weights.uov_per_death_under5 * $life_value_multiplier / @cash.uov_per_dollar`
  (the sheet's 11,663 in `published`), so steps stated as multiples of cash keep their multiple; a cost per life-equivalent the sheet labels
  as a multiple of cash ("$2,000, ~5x cash") becomes GiveDirectly's cost / that multiple (dollar figure in
  `published`); only a figure with no cash meaning counts as an under-five death; per-outcome rows (deaths, income, YLDs) read the shared versions directly.
- **Years of benefit** a sheet sums at face value are discounted: `pv_annuity_due(1, years_discount_rate, years)` with
  `years_discount_rate = $discount_rate` (`published` = the evaluator's rate, 0 if none); an "opportunities get worse"
  rate stays and `$discount_rate` goes on top (INV-9b). Pin in `evaluator.assumptions` only what some row reads (INV-5b).
- Every row between `output.native` and `output.row` sits in a section with `kind: "ours"` and has
  no `expected` (INV-7).
- **Animals: the species step** (INV-3, normalization.md 2.4). Split SADs by species (`sads_<s>`,
  shares from facts such as `@sad_factors.meal_sads_share_<s>`), convert each with
  `ced_<s> = sads_<s> / @aim_sads.<s>_<v> * if($rp_species_weights, @welfare_ranges.<s>_vs_chicken, @aim_sads.<s>_<v> / @aim_sads.chicken_2024)`
  copied exactly, sum them into the output, and list the species in `output.species`. `<v>` is the
  SAD version (2024 or 2025) whose weights are built into the figure the row divides *in our view*
  (a shared `@sad_factors` fact says its basis in its note; ACE's 2025 sheets use 2025 SADs, its
  2024 sheets and the 2024 meal sheet 2024 SADs). Figures of two versions for one species: a second
  pair `sads_<s>_<v>` / `ced_<s>_<v>` (The Humane League). Counts that
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
