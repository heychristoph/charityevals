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
2. **Best guesses**: a cautious figure beside another model's best guess ranks them unfairly; caution
   goes into the range.
3. **Every number accounted for**: a sourced fact (URL, retrieval date, quote or page), a shared
   figure, or a labelled judgment (`kind: "judgment"`) with a reason, an anchor and a range.
   Formulas hold no constants beyond `ALLOWED_LITERALS` (src/engine/lint.ts), never one beside a lever.
4. **Faithful to the evidence**: thin evidence gets a wide range and a plain sentence.
5. **Fix, don't flag.** An inconsistency you find (model, template, shared fact) is fixed.

The templates read every shared figure their family needs and pass every check as they stand
(src/engine/templates.test.ts): keep those rows and you stay consistent. The lint and the invariants
enforce the mechanical rules (audit-model runs them, step 3).

## 0. Scope and setup

- Inputs: the charity's name or website; optionally an output path, a **blind list** (sources you must
  not read, for test runs: docs/eval-skills.md) and a date to use as today. Shared facts and sliders are
  the site's one answer, so reading them in a blind run isn't peeking; don't open their source links or
  use an evaluator's figure for this charity you happen to see.
- Read assumptions/default.json, the facts/*.json labels, src/engine/templates.ts and
  [references/templates.md](references/templates.md) (its **Conventions** first). Skim a model of the
  family or intervention unless the blind list forbids it.
- A charityevals model of the charity exists already: update it.
- **What to model: every programme** (owner, 2026-11-03), in the latest year with audited financials
  and reach for the same period, main programme first: branches of one model when they share a family
  (Convention 4), else one model per family (`<charity>-charityevals-<program>`), each matching its
  line in `charities/<id>.json` (`spending`, `lines`: normalization.md 2.17). Grants to sister
  organisations count as the activities they fund. Never a case study, pilot or other year in place
  of the programme: a donor funds the whole programme as it runs now. Thin or no outcome data: its
  family's chain from the research on that kind of work, wide ranges, × `$missing_data_discount`
  (Convention 12), never another model's result. Nothing is left out.
- An Ambitious Impact idea-stage model of this charity (`theoretical`) goes once yours is in models/:
  add its id and reason to `REMOVE` in scripts/aim-theoretical.py and run it. Yours is never `theoretical`.

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
- `beneficiaries` (INV-20): add to OURS in scripts/beneficiary-countries.ts and run it.
- **Keep every canonical row id, `output` and the section kinds**. Replace every `TEMPLATE:` explainer and example value; each says which shared figure
  the row reads and when to change it. A branch that doesn't apply stays at 0 with an explainer saying
  why. Added rows feed canonical rows.
- **Inputs** (the lint checks the fields): `observed` and `estimate` cite `source.url`, `retrieved` and
  `quote` or `page`; a `judgment` has a range and an explainer with its reason and anchor.
- **Shared numbers** come from `@facts` and `$assumptions`, never retyped, or sliders and fact updates
  miss the copy (INV-4, INV-13, INV-14: no typed copy, one value per concept):
  - deaths `@moral_weights.<age band>` (an `@death_ages` mix for many ages), stillbirths
    `@givewell_shared.uov_per_stillbirth`, both × `$life_value_multiplier`;
  - income ln(consumption) × `$uov_per_ln_consumption`; GiveWell's house constants `@givewell_shared.*`
    and supplementary figures `@givewell_common.*`;
  - household size, consumption, PPP, currency (`@fx`) and prices (`@cpi`, Convention 8) from facts;
  - cash multiples × `@cash.uov_per_dollar`; depression through `@wellby_factors` and `@depression`;
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
  - `estimate_basis` (INV-18, Convention 11): a `past_average` keeps or adds the
    `marginal_vs_past_average` row (corporate-campaign.json), formula `@next_dollar.<charity id, - as _>`
    (write it by normalization.md 2.10 if missing); change the basis only for a reason you write down;
  - money moved goes through the shared rows of src/engine/moved-money.ts word for word
    (`python3 scripts/moved-money.py <model> <set> net`), destinations live;
    career changes through `career_change_value` (INV-12);
  - deaths outside a uov model enter only through its bridge from uov (`wellbys_from_uov`, INV-17);
  - every branch's `missing_data_adj`: `$missing_data_discount` unless measured (Convention 12);
  - no exchange rate between outcomes inside the model (INV-2): the output unit's conversion does
    that once; another unit's outcome enters only through the template's bridge rows (2.6);
  - animal families, the species step: SADs → `sads_<s>` → `ced_<s>` with the SAD version of the
    figure it divides (templates.md), the species split a sourced fact or ranged judgment;
  - climate: the climate skeleton's `years_until_avoided` and `conversion` rows (normalization.md 2.5).
- **Every way the work does good or harm is a row**: side effects are estimated rows tagged
  `side_effect` (normalization.md 2.16), never a list.
- **Ranges and the simulation** (normalization.md 2.18): each range's `interval` and `shape` as the
  source states; a chance that one event happens at all is `single_event` (`{ with }`, `{ one_of }`),
  never a yearly rate or a share of many; one series' figures from one source `drawn_with` its first;
  no range on a year (unit "Year"); a reported figure, not a remainder of large ones.
- **Adjustments**: Convention 5 (one question each, signs); an RCT's effect is already net of its
  control group; say what isn't adjusted for. **Animals**: Convention 3 (reach is every animal under
  the commitments won or pressed, delivery only in the shared fulfilment rate, stocks as yearly flows).
- **Summary**: say why when the result is over ten times its cause's median (INV-15). Far below: check
  scope, reach and persistence first.
- **Write-up** `writeups/<id>.md` for the charity's main model, following import-cea section 7, plus
  "How this model was checked" (audit rounds and what changed).
- **Charity record** `charities/<id>.json` if missing, with `spending` and `lines`.

As you go: `npx tsx scripts/audit-model.ts <path>` (exit
1 on a high finding), then `npx tsx scripts/check.ts <id>` once in models/.

## 4. Audit loop (independent)

With no mechanical highs, a **fresh subagent** audits the model, given only the model, write-up, blind
list and previous findings (not your notes):

```
Agent(subagent_type: "general-purpose", description: "Audit CEA <id> round <n>",
      prompt: "Use the audit-cea skill (.claude/skills/audit-cea/SKILL.md) to audit <path>.
               Write the findings to audits/<id>/audit-r<n>.md. <blind list, if any, and
               --exclude <ids> for audit-model.ts and normalization-audit.ts>. Don't edit the model.")
```

1. Fix every **high** and **medium** finding with the fix it names (or a better one that settles the
   same problem, said in the next round's input); fix lows unless the fix would be wrong, and say why.
2. Re-run `scripts/audit-model.ts`, then a **new** auditor (round n+1) with the previous findings.
3. Stop at an audit with no high findings, or after **3 rounds**. **Verification round**: any change after
   the last round gets a fresh auditor given the model, write-up, last
   findings and the changes, checking only those. Publish only on a passing latest audit of the model as
   it is (its `Model-sha`; a test checks); else fix and verify once more, or keep it out of `models/`.

## 5. Verify and report

`npx tsx scripts/check.ts <id>`, `npx tsx scripts/summaries.ts` (the simulations), `npx tsx
scripts/simulation-check.ts <id>` (exit 0: stable, single events drawn), `npm run check`, `npx vitest run`, `npx tsc --noEmit`,
`npx tsx scripts/normalization-audit.ts [--exclude <ids>]` (no violation for the model; waivers only
for checked false positives, with reasons; the allowlist stays `{}`; in a sandbox it skips models that
don't load and says so), and the pages (`npm run dev`: `/<charity>`, `/<id>`; not in an unattended run; many at once:
import-cea references/batch.md).

Report: the result (native unit; years per $1,000 with its range), year and programmes (weights; which
are thin), top 3 swings, audit rounds with counts, facts or assumptions added.

To change the templates: edit and run `scripts/gen-templates.py`, keep src/engine/templates.ts in step,
run `npx vitest run src/engine/templates.test.ts src/engine/lint.test.ts`.
