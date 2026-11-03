---
name: build-cea
description: Build charityevals' own cost-effectiveness analysis (CEA) for a charity from public evidence (annual reports, audited financials, program data, studies, evaluator reviews), as a model JSON from a fixed template per intervention family that ends in years of healthy life per $1,000 by the site's standard steps. Runs an independent audit (audit-cea skill, separate subagent) and fixes until no high-severity findings remain. Use when asked to model, evaluate, build a CEA for, or estimate the cost-effectiveness of a charity that has no evaluator CEA to import (to import a published CEA, use import-cea).
---

# Build a CEA

Job: `models/<cause>/<charity>-charityevals.json`, owned by `charityevals`, built from a template so
any two models of a family read side by side, and comparable with every evaluator model on the site.

1. **One consistent way.** Every conversion, value of a death (by age band), discount, cash benchmark,
   currency rate, household size, species weight, SADs figure per physical change, years a won reform
   counts, pledges kept and sign convention is the site's shared one (docs/normalization.md, read it:
   the units, the species step, the shared versions in 2.7, money moved in 2.8, won reforms in 2.9, the
   next dollar in 2.10, an estimate's age in 2.11, the invariants in section 3, the owner decisions).
   Every slider must move every model it concerns. Two models of a family differ only where the
   charities differ.
2. **Best guesses**, not conservative cases: the central value is the most likely one; caution goes
   into the range.
3. **Every number accounted for**: a sourced fact (URL, retrieval date, quote or page), a shared
   assumption or fact, or a labelled judgment (`kind: "judgment"`) with a reason, an anchor and a
   low/high range. A subjective choice is a judgment whoever made it. Formulas hold no constants
   beyond unit conversions (`ALLOWED_LITERALS`, src/engine/lint.ts), and never a constant beside a
   lever (INV-2d).
4. **Faithful to the evidence**: thin evidence gets a wide range and a plain sentence, not optimism.
5. **Fix, don't flag.** An inconsistency you find (in your model, a template, a shared fact) is fixed,
   not noted: read the shared figure, add the missing fact, correct the row.

The templates already read every shared figure their family needs, and pass every invariant and the
lint as they stand (src/engine/templates.test.ts): keep those rows and you stay consistent.
`npx tsx scripts/audit-model.ts <path>` runs the lint, every invariant on your model and the
comparison with its cause; the audit does the rest.

## 0. Scope and setup

- Inputs: the charity's name or website; optionally an output path, a **blind list** (sources you
  must not read: docs/eval-skills.md) and a date to use as today.
- Read assumptions/default.json, the facts/*.json labels, src/engine/templates.ts and
  [references/templates.md](references/templates.md), especially its **Conventions**. Skim a
  model of the same family (`grep -l '"template": "<family>"' -r models`), else an evaluator model of
  the same intervention, unless the blind list forbids it.
- The charity already has a charityevals model: update it instead.
- **What to model.** The charity's work in the latest year with audited financials and reach for the
  same period, by spending: its main programme first. If it runs several programmes, cover every one
  that is at least a tenth of programme spending (smaller ones go under "What isn't modelled"): branches
  of one model when they share a family (Convention 4), else one model per family
  (`<charity>-charityevals-<program>`, a `variant` can't change family), weighted by spending share in
  `charities/<id>.json` `programs` with `weight_source` (import-cea section 6). Never one case study or
  pilot in place of the programme, and never a programme or year other than the one the money pays
  for. Say the year in the summary and in `program_spend`'s label.
- An Ambitious Impact idea-stage model of this charity marked `theoretical` is shown only while no model
  of the charity's actual work exists: once yours is in models/, remove it and record it in
  inventory/ambitious-impact-models.json as "not shown: charityevals model of its actual work"
  (scripts/aim-theoretical.py). Your model is never `theoretical`.

## 1. Pick the template family

| Family | Use for | Unit (native → output) | Usual `estimate_basis` |
|---|---|---|---|
| `direct-health` | deaths and illness averted: nets, SMC, vitamin A, vaccines, deworming, malnutrition treatment, maternal care | uov | unit_cost |
| `cash-income` | cash transfers, graduation, agriculture or livelihood programs whose outcome is consumption | uov | unit_cost |
| `wellbeing` | psychotherapy, mental-health care, programs measured in life satisfaction or depression scores | wellby | unit_cost |
| `corporate-campaign` | cage-free, broiler (BCC/ECC), fish or shrimp stunning and other company or producer welfare reforms, accountability on existing pledges | SADs → ced | past_average |
| `diet-change` | institutional meal replacement, pledges, cooking classes, plant-based outreach | SADs → ced | unit_cost (past_average for won menu pledges) |
| `policy-research-meta` | legislation, research, fundraising/meta, capacity building, career changes: value through other actors | uov, wellby or SADs → ced; climate: `policy-research-meta-climate.json`, tco2e | past_average |

Never force a program into a family whose causal chain doesn't fit.

## 2. Research

Work through [references/research.md](references/research.md). Keep a research log in your scratch
directory (not the repo): every URL, date, number taken, verbatim quote and page. In outline: money
(audited financials, latest complete year), reach (same year, independently verified where possible),
effect (systematic reviews, then RCTs, then charity-specific evidence), baselines (country facts),
existing reviews unless blind (cite an evaluator's figure as `kind: "estimate"`).

## 3. Write the model

Copy `templates/<family>.json` to the output path and fill it in.

- `id` `<charity>-charityevals`, `kind: "charity"`, `charity`, `owner: "charityevals"`, `template`,
  `cause`, `estimate_basis`, `summary` (2–4 plain sentences: what the charity does, where, in which
  year, the result in years of healthy life per $1,000, the biggest uncertainty), `source`
  (`publisher: "charityevals"`, `title`, `url: https://charityevals.org/<id>`, `published` = the date
  you built it (the estimate-age slider counts from it; update it when you rebuild), `retrieved`) and
  `resources` (`type`: evaluation, model, data, study, charity or other). No `evaluator` block.
- **Keep every canonical row id, `output` (with `native`, and `species` for animals) and the section
  kinds.** Replace every `TEMPLATE:` explainer and example value. A branch that doesn't apply stays,
  at 0, with an explainer saying why. Added rows (per age group, per supply chain) feed canonical rows.
- **Inputs**: `observed` and `estimate` need `source.url`, `source.retrieved` (YYYY-MM-DD) and
  `source.quote` or `source.page`, with the source's interval as the range. `judgment` needs a
  low/best/high range and an explainer giving the reason and the anchor (a reference class: another
  model's value, a published estimate).
- **Shared numbers** come from `@facts` and `$assumptions`, never retyped (INV-4, INV-14) nor written
  beside a lever (INV-2d); a concept another model states is INV-13 (only a place or year differs):
  - a death: `@moral_weights.<age band>` (under five, 5–14, 15–49, 50–74; `_over5` only for unknown
    ages; an `@death_ages` mix for deaths of many ages) × `$life_value_multiplier`; a stillbirth
    `@givewell_shared.uov_per_stillbirth` × `$life_value_multiplier`;
  - income: ln(consumption) × `$uov_per_ln_consumption`; GiveWell's house constants (years long-term
    gains last, years until they start, resource sharing …) `@givewell_shared.*`;
  - household size `@household_size.<place>` (facts/household_size.json; add the place's latest DHS
    figure if missing); PPP `@<country>.ppp_factor_2017`;
  - currency `@fx.usd_per_<cur>_<year>` (IRS yearly average, else World Bank; `scripts/link-fx.py`),
    never a typed rate;
  - a result a source states as a multiple of cash × `@cash.uov_per_dollar`; money that goes or would
    have gone to GiveDirectly `#givedirectly` (live), never `@cash`;
  - depression: SD-years × `@wellby_factors.wellbys_per_sd_year`, PHQ-9 points ÷ `@depression.phq9_sd`
    for SDs; therapy spillovers `@wellby_factors.household_spillover_ratio_psychotherapy` × the place's
    household; the WELLBY slider (`$daly_per_wellby`, calibrated on depression) does the rest;
  - animals: SADs per change `@sad_factors.*` (one figure per physical change), pledges kept
    `@sad_factors.commitment_fulfilment_cage_free` / `_broiler`, diet change
    `@sad_factors.production_response` and `@sad_factors.sads_per_meal_replaced`, species split
    `@sad_factors.meal_sads_share_<s>`; species weights only in the `ced_*` rows;
  - staff pay: `@staff_pay.share_<kind>` / `gap_<kind>`, the charity's own breakdown for the share
    where its financials give one;
  - meta: `@meta.*` and the moved-money rows (below).
  Missing shared data goes into the right facts file with a source and range (a new SADs figure with a
  `change` note and its SAD version). A new assumption only for a cross-model value judgment no fact
  can settle; never relabel existing ones.
- **The standard steps** are in the template; keep them intact:
  - every future benefit, and the wait before it, reads `$discount_rate` (`pv_annuity_due`, the
    wellbeing discount factor, `(1 + $discount_rate) ^ -wait`); never type in a present value;
  - a won reform (pledge, law, regulation, menu or procurement change) counts `$win_years_counted`
    years (`years_of_impact`), the wait until it takes effect discounted (`years_until_effect`,
    `wait_discount`; normalization.md 2.9); coalition credit is the charity's share of all groups'
    resources (`attribution_share_shared`, Convention 2);
  - `estimate_basis` (INV-18): `past_average` (the charity's past spending over what it won: campaigns,
    pledges, policy, research, money moved, a fixed service's lives saved) keeps the template's
    `marginal_vs_past_average = $marginal_vs_past_average` row (`published` 1) in the per-donor-dollar
    row; `marginal` (a forecast of planned work) and `unit_cost` (a price per item delivered that more
    money buys again) have no such row. Change the template's basis only for a reason you write down;
  - money moved or raised goes through the shared rows of src/engine/moved-money.ts, word for word
    (the policy-research-meta template has the global-health set; for another destination
    `python3 scripts/moved-money.py <model> <global-health|livelihoods|tlycs> net`), destinations read
    live with `#model-id`; a not-yet-proven organisation's chance of success `@meta.success_chance_new_org`
    with the shared success step; career changes through the template's `career_change_value` (INV-12);
  - deaths in a `wellbeing` model are valued in units of value (`uov_valued_outside_wellbys`) and enter
    WELLBYs only through `wellbys_from_uov = uov_valued_outside_wellbys / ($daly_per_wellby * $uov_per_daly)`
    (INV-17);
  - no exchange rate between outcomes inside the model (`$uov_per_daly`, `$daly_per_wellby`,
    `$daly_per_sad`, `$chicken_vs_person`, the climate rates): the output unit's conversion does that (INV-2);
  - animal families: SADs → `sads_<species>` → `ced_<species>` (the template's formula, with the SAD
    version of the shared figure it divides: cage-to-aviary and meals 2024; enriched cages, broilers and
    shrimp 2025; a figure of each version gets its own pair `sads_<s>_<v>` / `ced_<s>_<v>`) →
    `ced_per_donor_dollar`, species weights only there (INV-3); add a species pair per species, with its
    share as a sourced fact or a ranged judgment;
  - climate (tco2e): `years_until_avoided` (the wait, discounted), `air_pollution_weight` (fuel share ×
    the fuel's smoke relative to the average, sourced) and `extra_deaths_per_tco2e` in the template's
    `conversion` section, reading no shared assumption (normalization.md 2.5);
  - `donor_cost_share` uses `$resource_shares`; with money moved, donors' new money joins staff's
    forgone pay (the policy template's formula).
- **Signs and multipliers**: validity and delivery adjustments are multipliers (≤ 1 for a discount);
  a downside (funging inside the organisation, bottlenecks, monitoring errors, harms) is a negative
  share of value lost added in `unmodelled_benefits_adj`, never a positive share subtracted; one
  question per adjustment. An RCT's effect is already net of its control group. Say what isn't
  adjusted for.
- **Animals, in particular** (the families the last blind test undercounted, docs/eval-skills.md):
  - reach is every animal under the commitments won or held to account in the year (tracker or company
    volumes), not only those already delivered: delivery is the shared fulfilment rate in
    `implementation_adj`, so a delivered-only count discounts it twice;
  - persistence is `$win_years_counted` from when the reform takes effect, never a figure of your own;
  - SADs per change and per meal are the shared figures; a replaced meal outside Latin America is
    `@sad_factors.sads_per_meal_replaced × meal_mix_vs_reference`, the ratio from a published estimate
    covering both this country and the reference (ACE's 2025 meal estimates: US 1.5, 0.75–3), else 1
    (0.5–2). Never rebuild a per-meal figure from a meat mix of your own.
- **Summary**: if the result is more than ten times the median of its cause on the site, the `summary`
  says why ("more than ten times its peers because …", INV-15). Far below the median: check scope,
  reach and persistence first (audit-model prints the median).
- **Write-up** `writeups/<id>.md` when this is the charity's main model, following import-cea
  section 7 (live figures, plain summary first, results in years of healthy life per $1,000), plus a
  short "How this model was checked" section (audit rounds and what changed).
- **Charity record** `charities/<id>.json` if missing (name, cause, website, donate link), with
  `programs` and funding weights when the charity has several modelled programmes.

As you go: `npx tsx scripts/audit-model.ts <path>` (lint, invariants, result, tornado, reference class
and cause median; exit 1 on a high finding), then `npx tsx scripts/check.ts <id>` once the file is in
models/.

## 4. Audit loop (independent)

When the mechanical audit has no high findings, have a **separate subagent with fresh context** audit
the model:

```
Agent(subagent_type: "general-purpose", description: "Audit CEA <id> round <n>",
      prompt: "Use the audit-cea skill (.claude/skills/audit-cea/SKILL.md) to audit <path>.
               Write the findings to <audit dir>/audit-r<n>.md. <blind list, if any, and
               --exclude <ids> for audit-model.ts>. Don't edit the model.")
```

Give the auditor only the model path, the write-up path, the blind list and the previous findings
file: not your notes. Keep the research log apart from the audit folder. Then:

1. Fix every **high** and **medium** finding with the fix it names (or a better one that settles the
   same problem, said in the next round's input); fix lows unless the fix would be wrong, and say why.
   Don't argue a finding away without a source that settles it; "noted" or "flagged" isn't a fix.
2. Re-run `scripts/audit-model.ts`, then a **new** auditor (round n+1) with the previous findings.
3. Stop when an audit of the current version has no high findings, or after **3 rounds**. Highs left
   after round 3: don't publish; keep the model out of `models/` and report what is unresolved.

Record the rounds (counts by severity, what changed) in the write-up or the eval log.

## 5. Verify and report

`npx tsx scripts/check.ts <id>`, `npm run check`, `npx vitest run`, `npx tsc --noEmit`,
`npx tsx scripts/normalization-audit.ts` (INV-1 … INV-19 and SAME-CHANGE: no violation for the model;
waivers only for checked false positives, with reasons, as in import-cea section 8; the allowlist stays
`{}`), and the pages (`npm run dev`: `/<charity>`, `/<id>`). In an evaluation sandbox without bulk
models, run only `npx tsx scripts/check.ts <id>` and `scripts/audit-model.ts`, and skip the page.

Report: the result (native unit, years of healthy life per $1,000, joint low–high), the year and
programmes modelled (with funding weights), the top 3 swings, the share of judgment, audit rounds with
counts, every fact or assumption added, and what isn't modelled.

To change the templates themselves: edit `scripts/gen-templates.py`, run
`python3 .claude/skills/build-cea/scripts/gen-templates.py`, keep src/engine/templates.ts (required
rows, bounds, basis, the shared figures each row must read) in step, and run
`npx vitest run src/engine/templates.test.ts src/engine/lint.test.ts` (every skeleton, filled in, must
pass every invariant and the lint).
