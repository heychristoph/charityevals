---
name: build-cea
description: Build charityevals' own cost-effectiveness analysis (CEA) for a charity from public evidence (annual reports, audited financials, program data, studies, evaluator reviews), as a model JSON from a fixed template per intervention family that ends in years of healthy life per $1,000 by the site's standard steps. Runs an independent audit (audit-cea skill, separate subagent) and fixes until no high-severity findings remain. Use when asked to model, evaluate, build a CEA for, or estimate the cost-effectiveness of a charity that has no evaluator CEA to import (to import a published CEA, use import-cea).
---

# Build a CEA

This skill produces charityevals' own model of one charity, `models/<cause>/<charity>-charityevals.json`:
from what the charity spent in a year and what that did to **years of healthy life per $1,000
donated**, the site's one scale. The loop: build from a template, have an independent auditor (audit-cea, in a
fresh subagent) check it, fix what it finds, repeat until no high-severity finding remains. Terms
(uov, SAD, canonical row, INV-n, Convention n): [glossary](references/templates.md#glossary).

1. **One consistent way.** Every conversion, value of a death, discount, cash benchmark, currency rate,
   household size, species weight, SADs figure, years a won reform counts, pledges kept and sign
   convention is the site's shared one (docs/normalization.md sections 2 and 3). Every slider moves
   every model it concerns; two models of a family differ only where the charities differ.
2. **Best guesses**, not conservative cases: a cautious figure in one model beside a best guess in
   another would rank them unfairly, so caution goes into the range.
3. **Every number accounted for**: a sourced fact (URL, retrieval date, quote or page), a shared
   figure, or a labelled judgment (`kind: "judgment"`) with a reason, an anchor and a range.
   Formulas hold no constants beyond `ALLOWED_LITERALS` (src/engine/lint.ts), never one beside a lever
   (a slider): a typed constant hides a choice the checks and the reader can't see.
4. **Faithful to the evidence**: thin evidence gets a wide range and a plain sentence.
5. **Fix, don't flag.** An inconsistency you find (model, template, shared fact) is fixed, since a
   flagged one still reaches the site.

The templates read every shared figure their family needs and pass every check as they stand
(src/engine/templates.test.ts): keep those rows and you stay consistent. The lint and the invariants
enforce the mechanical rules (audit-model runs them, step 3).

## 0. Scope and setup

- Inputs: the charity's name or website; optionally an output path, a **blind list** (sources you must
  not read, for test runs: docs/eval-skills.md) and a date
  to use as today.
- **Blind runs and shared facts.** Shared facts and sliders always win, even from an evaluator's sheet:
  they are the site's one answer for every model, so reading them isn't peeking. Don't open their
  source links or use any evaluator figure for this charity you happen to see.
- Read assumptions/default.json, the facts/*.json labels, src/engine/templates.ts and
  [references/templates.md](references/templates.md) (its **Conventions** first). Skim a model of the
  family or intervention unless the blind list forbids it.
- A charityevals model of the charity exists already: update it.
- **What to model: every programme** (owner, 2026-11-03), in the latest year with audited financials
  and reach for the same period, main programme first: branches of one model when they share a family
  (Convention 4), else one model per family (`<charity>-charityevals-<program>`), weighted by spending
  in `charities/<id>.json` `programs` with `weight_source` (import-cea section 6). Grants to sister
  organisations count as the activities they fund. Never a case study, pilot or other year in place
  of the programme: a donor funds the whole programme as it runs now. Thin or no outcome data: its
  family's chain from the research on that kind of work, wide ranges, × `$missing_data_discount`
  (Convention 12), never another model's result. Nothing is left out.
- An Ambitious Impact (AIM) idea-stage model of this charity marked `theoretical` (made before the
  charity ran the work) is shown only while no model of its actual work exists: once yours is in
  models/, remove it and record it in inventory/ambitious-impact-models.json
  (scripts/aim-theoretical.py). Yours is never `theoretical`.

## 1. Pick the template family

| Family | Use for | Unit (native → output) | Usual `estimate_basis` (what the dollar is) |
|---|---|---|---|
| `direct-health` | deaths and illness averted: nets, seasonal malaria chemoprevention (SMC), vitamin A, vaccines, deworming, malnutrition, maternal care | uov | unit_cost |
| `cash-income` | cash transfers, graduation, agriculture or livelihood programmes measured in consumption | uov | unit_cost |
| `wellbeing` | psychotherapy, mental-health care, life satisfaction or depression scores | wellby | unit_cost |
| `corporate-campaign` | cage-free, broiler, fish or shrimp stunning and other company or producer reforms, accountability on pledges | SADs → ced | past_average |
| `diet-change` | institutional meal replacement, pledges, cooking classes, plant-based outreach | SADs → ced | unit_cost (past_average for won menu changes) |
| `policy-research-meta` | legislation, research, fundraising/meta, capacity building, career changes | uov, wellby or SADs → ced; climate skeleton, tco2e | past_average |
| `domestic-services` | food banks, housing, youth, veterans, older people, gifts in rich countries | WELLBYs, uov, DALYs → daly | unit_cost |
| `humanitarian-relief` | disasters, conflict, refugees, emergency food (blood supply: direct-health) | uov, DALYs → daly | unit_cost |
| `medical-research` | research, guidelines and advocacy of disease charities | DALYs → daly | past_average |
| `companion-animals` | shelters, rehoming, neutering, vet care for dogs and cats | pain days → ced | unit_cost |
| `conservation` | land, water and species protection | tco2e, uov, WELLBYs, DALYs, ced → daly | unit_cost |
| `rights-advocacy` | litigation, laws changed, people released | WELLBYs, uov, DALYs → daly | past_average |

Hospitals and hospices in rich countries: `direct-health` with illness in DALYs, or `wellbeing`, at the
country's costs and rates. Each new family's chain, shared figures and pitfalls:
[references/families/](references/families/). Never force a programme into a family whose chain
doesn't fit.

## 2. Research

Work through [references/research.md](references/research.md), keeping its research log (every URL,
date, number, quote and page) in your scratch directory, not the repo.

## 3. Write the model

Copy `templates/<family>.json` to the output path and fill it in.

- `id` `<charity>-charityevals`, `kind: "charity"`, `charity`, `owner: "charityevals"`, `template`,
  `cause`, `estimate_basis`, `summary` (2–4 plain sentences: what the charity does, where, the year,
  the result in years of healthy life per $1,000, the biggest uncertainty, branches discounted for missing data),
  `source` (`publisher: "charityevals"`, `title`, `url: https://charityevals.org/<id>`, `published` =
  the build date, `retrieved`) and `resources`. No `evaluator` block.
- `beneficiaries` (INV-20): add to OURS in scripts/beneficiary-countries.ts, run it.
- **Keep every canonical row id, `output` and the section kinds**, so the model compares row by row
  with its family. Replace every `TEMPLATE:` explainer and example value; each says which shared figure
  the row reads and when to change it. A branch that doesn't apply stays at 0 with an explainer saying
  why. Added rows feed canonical rows.
- **Inputs** (the lint checks the fields): `observed` and `estimate` cite `source.url`, `retrieved` and
  `quote` or `page`, the source's interval as the range; a `judgment` has a range and an explainer with
  the reason and the anchor (another model's value, a published estimate).
- **Shared numbers** come from `@facts` and `$assumptions`, never retyped, or sliders and fact updates
  miss the copy (INV-4, INV-13, INV-14: no typed copy, one value per concept):
  - deaths `@moral_weights.<age band>` (an `@death_ages` mix for many ages), stillbirths
    `@givewell_shared.uov_per_stillbirth`, both × `$life_value_multiplier`;
  - income ln(consumption) × `$uov_per_ln_consumption`; GiveWell's house constants `@givewell_shared.*`
    and supplementary figures `@givewell_common.*`;
  - household size `@household_size.<place>`; rich countries' consumption `@united_states.*`; PPP
    `@<country>.ppp_factor_2017`; currency `@fx.usd_per_<cur>_<year>`, other years' prices
    `@cpi.<iso3>_<year>` (Convention 8);
  - cash multiples × `@cash.uov_per_dollar`; money to GiveDirectly `#givedirectly` (live);
  - depression: SD-years × `@wellby_factors.wellbys_per_sd_year`, points ÷ `@depression.phq9_sd`,
    therapy spillovers `@wellby_factors.household_spillover_ratio_psychotherapy`;
  - animals `@sad_factors.*`: one figure per physical change, pledges kept
    (`commitment_fulfilment_cage_free` / `_broiler`), `production_response`, `sads_per_meal_replaced`,
    `meal_sads_share_<s>`; species weights only in the `ced_*` rows;
  - staff pay `@staff_pay.share_<kind>` / `gap_<kind>` (the charity's own share where its financials
    give one); meta `@meta.*` and the moved-money rows.
  Missing shared data goes into the right facts file with a source and range. A new assumption only for
  a cross-model value judgment no fact can settle; never relabel existing ones.
- **The standard steps** are in the template; keep them intact:
  - every future benefit, and every wait before it, reads `$discount_rate`; never a typed present value;
  - a won reform counts `$win_years_counted` years, the wait until it takes effect discounted; coalition
    credit is the charity's share of all groups' resources (Convention 2);
  - `estimate_basis` (INV-18, Convention 11): a `past_average` keeps the template's
    `marginal_vs_past_average` row; change the basis only for a reason you write down;
  - money moved goes through the shared rows of src/engine/moved-money.ts word for word
    (`python3 scripts/moved-money.py <model> <destination set> net`), destinations live (`#model-id`);
    career changes through `career_change_value` (INV-12);
  - deaths outside a uov model enter only through its bridge from uov (`wellbys_from_uov`, INV-17);
  - every branch's `missing_data_adj`: `$missing_data_discount` unless measured (Convention 12);
  - no exchange rate between outcomes inside the model (INV-2): the output unit's conversion does
    that once; another unit's outcome enters only through the template's bridge rows (2.6);
  - animal families, the species step: SADs → `sads_<s>` → `ced_<s>` with the SAD version of the
    figure it divides (cage-to-aviary and meals 2024; enriched cages, broilers and shrimp 2025), a pair
    per species and version, the species split a sourced fact or ranged judgment;
  - climate: the climate skeleton's `years_until_avoided` and `conversion` rows (normalization.md 2.5).
- **Adjustments**: Convention 5 (one question each, signs); an RCT's effect is already net of its
  control group; say what isn't adjusted for. **Animals**: Convention 3 (reach is every animal under
  the commitments won or pressed, delivery only in the shared fulfilment rate, stocks as yearly flows).
- **Summary**: say why when the result is over ten times its cause's median (INV-15). Far below: check
  scope, reach and persistence first (audit-model prints the median).
- **Write-up** `writeups/<id>.md` for the charity's main model, following import-cea section 7, plus
  "How this model was checked" (audit rounds and what changed).
- **Charity record** `charities/<id>.json` if missing, with `programs` and weights for several
  modelled programmes.

As you go: `npx tsx scripts/audit-model.ts <path>` (every check, the result, tornado and peers; exit
1 on a high finding), then `npx tsx scripts/check.ts <id>` once in models/.

## 4. Audit loop (independent)

When the mechanical audit has no high findings, have a **separate subagent with fresh context** audit
the model, given only the model, write-up, blind list and previous findings (not your notes):

```
Agent(subagent_type: "general-purpose", description: "Audit CEA <id> round <n>",
      prompt: "Use the audit-cea skill (.claude/skills/audit-cea/SKILL.md) to audit <path>.
               Write the findings to <audit dir>/audit-r<n>.md. <blind list, if any, and
               --exclude <ids> for audit-model.ts and normalization-audit.ts>. Don't edit the model.")
```

1. Fix every **high** and **medium** finding with the fix it names (or a better one that settles the
   same problem, said in the next round's input); fix lows unless the fix would be wrong, and say why.
2. Re-run `scripts/audit-model.ts`, then a **new** auditor (round n+1) with the previous findings.
3. Stop at an audit with no high findings, or after **3 rounds**; changes after the last round get one
   short **verification round**. Highs left: keep it out of `models/`, report them.

## 5. Verify and report

`npx tsx scripts/check.ts <id>`, `npm run check`, `npx vitest run`, `npx tsc --noEmit`,
`npx tsx scripts/normalization-audit.ts [--exclude <ids>]` (no violation for the model; waivers only
for checked false positives, with reasons; the allowlist stays `{}`; in a sandbox it skips models that
don't load and says so), and the pages (`npm run dev`: `/<charity>`, `/<id>`).

Report: the result (native unit; years of healthy life per $1,000 with audit-model's `Combined range`
(glossary), the joint low–high only as the extreme case), the year and
programmes (with weights; which are discounted for missing data), the top 3 swings, the share of judgment, audit
rounds with counts, every fact or assumption added.

To change the templates: edit `scripts/gen-templates.py`, run it, keep src/engine/templates.ts in step,
and run `npx vitest run src/engine/templates.test.ts src/engine/lint.test.ts`.
