---
name: build-cea
description: Build charityevals' own cost-effectiveness analysis (CEA) for a charity from public evidence (annual reports, audited financials, program data, studies, evaluator reviews), as a model JSON from a fixed template per intervention family that ends in years of healthy life per $1,000 by the site's standard steps. Runs an independent audit (audit-cea skill, separate subagent) and fixes until no high-severity findings remain. Use when asked to model, evaluate, build a CEA for, or estimate the cost-effectiveness of a charity that has no evaluator CEA to import (to import a published CEA, use import-cea).
---

# Build a CEA

Job: `models/<cause>/<charity>-charityevals.json`, owned by `charityevals`, built from a template so
any two models of a family read side by side, and comparable with every evaluator model on the site.

1. **One consistent way.** Every conversion, value of a death, discount, cash benchmark, currency rate,
   household size, species weight, SADs figure, years a won reform counts, pledges kept and sign
   convention is the site's shared one (docs/normalization.md: the units, the species step, the shared
   versions in 2.7, money moved 2.8, won reforms 2.9, the next dollar 2.10, an estimate's age 2.11, the
   invariants in section 3). Every slider moves every model it concerns. Two models of a family differ
   only where the charities differ.
2. **Best guesses**, not conservative cases: caution goes into the range.
3. **Every number accounted for**: a sourced fact (URL, retrieval date, quote or page), a shared
   assumption or fact, or a labelled judgment (`kind: "judgment"`) with a reason, an anchor and a range.
   Formulas hold no constants beyond `ALLOWED_LITERALS` (src/engine/lint.ts), never one beside a lever.
4. **Faithful to the evidence**: thin evidence gets a wide range and a plain sentence.
5. **Fix, don't flag.** An inconsistency you find (in your model, a template, a shared fact) is fixed:
   read the shared figure, add the missing fact, correct the row.

The templates read every shared figure their family needs and pass every invariant and the lint as they
stand (src/engine/templates.test.ts): keep those rows and you stay consistent. The lint and the
invariants enforce the mechanical rules; `npx tsx scripts/audit-model.ts <path>` runs them all.

## 0. Scope and setup

- Inputs: the charity's name or website; optionally an output path, a **blind list** (sources you must
  not read: docs/eval-skills.md) and a date to use as today.
- **Blind runs and shared facts.** Shared facts and sliders always win, even where a fact's source is
  an evaluator's sheet: reading `@facts` and `$assumptions` is the site's one way, not peeking. Don't
  open their source links, and don't use any evaluator figure for this charity you happen to see.
- Read assumptions/default.json, the facts/*.json labels, src/engine/templates.ts and
  [references/templates.md](references/templates.md) (its **Conventions** first). Skim a model of the
  same family, else an evaluator model of the intervention, unless the blind list forbids it.
- The charity already has a charityevals model: update it.
- **What to model.** The charity's work in the latest year with audited financials and reach for the
  same period, by spending: its main programme first, then every programme of at least a tenth of
  programme spending (smaller ones under "What isn't modelled"): branches of one model when they share
  a family (Convention 4), else one model per family (`<charity>-charityevals-<program>`), weighted by
  spending in `charities/<id>.json` `programs` with `weight_source` (import-cea section 6). Grants to
  sister organisations count as the activities they fund. Never a case study or pilot in place of the
  programme, never another year than the one the money pays for. A programme with no spending split
  and no outcome data: Convention 12 (state the partial coverage, never guess its outcome).
- An Ambitious Impact idea-stage model of this charity marked `theoretical` is shown only while no model
  of its actual work exists: once yours is in models/, remove it and record it in
  inventory/ambitious-impact-models.json (scripts/aim-theoretical.py). Yours is never `theoretical`.

## 1. Pick the template family

| Family | Use for | Unit (native → output) | Usual `estimate_basis` |
|---|---|---|---|
| `direct-health` | deaths and illness averted: nets, SMC, vitamin A, vaccines, deworming, malnutrition, maternal care | uov | unit_cost |
| `cash-income` | cash transfers, graduation, agriculture or livelihood programmes measured in consumption | uov | unit_cost |
| `wellbeing` | psychotherapy, mental-health care, life satisfaction or depression scores | wellby | unit_cost |
| `corporate-campaign` | cage-free, broiler, fish or shrimp stunning and other company or producer reforms, accountability on pledges | SADs → ced | past_average |
| `diet-change` | institutional meal replacement, pledges, cooking classes, plant-based outreach | SADs → ced | unit_cost (past_average for won menu changes) |
| `policy-research-meta` | legislation, research, fundraising/meta, capacity building, career changes | uov, wellby or SADs → ced; climate skeleton, tco2e | past_average |

Never force a programme into a family whose causal chain doesn't fit.

## 2. Research

Work through [references/research.md](references/research.md), keeping a research log in your scratch
directory (not the repo): every URL, date, number, verbatim quote and page.

## 3. Write the model

Copy `templates/<family>.json` to the output path and fill it in.

- `id` `<charity>-charityevals`, `kind: "charity"`, `charity`, `owner: "charityevals"`, `template`,
  `cause`, `estimate_basis`, `summary` (2–4 plain sentences: what the charity does, where, the year,
  the result in years of healthy life per $1,000, the biggest uncertainty, any partial coverage),
  `source` (`publisher: "charityevals"`, `title`, `url: https://charityevals.org/<id>`, `published` =
  the build date, `retrieved`) and `resources`. No `evaluator` block.
- **Keep every canonical row id, `output` and the section kinds.** Replace every `TEMPLATE:` explainer
  and example value; each one says which shared figure the row reads and when to change it. A branch
  that doesn't apply stays at 0 with an explainer saying why. Added rows feed canonical rows.
- **Inputs**: `observed` and `estimate` need `source.url`, `source.retrieved` and `source.quote` or
  `source.page`, the source's interval as the range. `judgment` needs a range and an explainer with
  the reason and the anchor (another model's value, a published estimate).
- **Shared numbers** come from `@facts` and `$assumptions`, never retyped (INV-4, INV-14, INV-13):
  - a death `@moral_weights.<age band>` (an `@death_ages` mix for deaths of many ages) ×
    `$life_value_multiplier`; a stillbirth `@givewell_shared.uov_per_stillbirth` × the same;
  - income: ln(consumption) × `$uov_per_ln_consumption`; GiveWell's house constants `@givewell_shared.*`
    and its shared supplementary figures `@givewell_common.*` (templates.md, direct-health);
  - household size `@household_size.<place>` (add the place's latest DHS figure if missing); PPP
    `@<country>.ppp_factor_2017`; currency `@fx.usd_per_<cur>_<year>` (`scripts/link-fx.py`); prices
    of another year `@cpi.<iso3>_<year>` (`scripts/link-cpi.py`);
  - a multiple of cash × `@cash.uov_per_dollar`; money to GiveDirectly `#givedirectly` (live);
  - depression: SD-years × `@wellby_factors.wellbys_per_sd_year`, points ÷ `@depression.phq9_sd`;
    therapy spillovers `@wellby_factors.household_spillover_ratio_psychotherapy`;
  - animals: `@sad_factors.*` (one figure per physical change), pledges kept
    `@sad_factors.commitment_fulfilment_cage_free` / `_broiler`, `@sad_factors.production_response`,
    `@sad_factors.sads_per_meal_replaced`, `@sad_factors.meal_sads_share_<s>`; species weights only in
    the `ced_*` rows;
  - staff pay `@staff_pay.share_<kind>` / `gap_<kind>` (the charity's own share where its financials
    give one); meta `@meta.*` and the moved-money rows.
  Missing shared data goes into the right facts file with a source and range. A new assumption only for
  a cross-model value judgment no fact can settle; never relabel existing ones.
- **The standard steps** are in the template; keep them intact:
  - every future benefit, and every wait before it, reads `$discount_rate`; never a typed present value;
  - a won reform counts `$win_years_counted` years, the wait until it takes effect discounted; coalition
    credit is the charity's share of all groups' resources (Convention 2);
  - `estimate_basis` (INV-18, Convention 11): `past_average` keeps the template's
    `marginal_vs_past_average` row; `marginal` and `unit_cost` have none; change the basis only for a
    reason you write down;
  - money moved goes through the shared rows of src/engine/moved-money.ts word for word
    (`python3 scripts/moved-money.py <model> <destination set> net`), destinations live (`#model-id`);
    career changes through `career_change_value` (INV-12);
  - deaths in a `wellbeing` model enter WELLBYs only through `wellbys_from_uov` (INV-17);
  - no exchange rate between outcomes inside the model (INV-2): the output unit's conversion does that;
  - animal families: SADs → `sads_<s>` → `ced_<s>` with the SAD version of the figure it divides
    (cage-to-aviary and meals 2024; enriched cages, broilers and shrimp 2025), a pair per species and
    version, the split a sourced fact or ranged judgment;
  - climate: the climate skeleton's `years_until_avoided` and `conversion` rows (normalization.md 2.5).
- **Signs**: validity and delivery adjustments are multipliers; a downside is a negative share in
  `unmodelled_benefits_adj`; one question per adjustment; an RCT's effect is already net of its control
  group. Say what isn't adjusted for.
- **Animals**: reach is every animal under the commitments won or pressed in the year, with delivery
  only in the shared fulfilment rate; persistence is `$win_years_counted`; stocks become yearly flows
  by templates.md's recipes (accountability, running wins).
- **Summary**: more than ten times its cause's median on the site: say why (INV-15). Far below: check
  scope, reach and persistence first (audit-model prints the median).
- **Write-up** `writeups/<id>.md` for the charity's main model, following import-cea section 7, plus
  "How this model was checked" (audit rounds and what changed).
- **Charity record** `charities/<id>.json` if missing, with `programs` and weights for several
  modelled programmes.

As you go: `npx tsx scripts/audit-model.ts <path>` (lint, invariants, result, tornado, reference class,
cause median; exit 1 on a high finding), then `npx tsx scripts/check.ts <id>` once in models/.

## 4. Audit loop (independent)

When the mechanical audit has no high findings, have a **separate subagent with fresh context** audit
the model:

```
Agent(subagent_type: "general-purpose", description: "Audit CEA <id> round <n>",
      prompt: "Use the audit-cea skill (.claude/skills/audit-cea/SKILL.md) to audit <path>.
               Write the findings to <audit dir>/audit-r<n>.md. <blind list, if any, and
               --exclude <ids> for audit-model.ts and normalization-audit.ts>. Don't edit the model.")
```

Give the auditor only the model path, the write-up path, the blind list and the previous findings
file, not your notes. Then:

1. Fix every **high** and **medium** finding with the fix it names (or a better one that settles the
   same problem, said in the next round's input); fix lows unless the fix would be wrong, and say why.
   "Noted" or "flagged" isn't a fix.
2. Re-run `scripts/audit-model.ts`, then a **new** auditor (round n+1) with the previous findings.
3. Stop when an audit of the current version has no high findings, or after **3 rounds**. Highs left:
   don't publish; keep the model out of `models/` and report what is unresolved.

## 5. Verify and report

`npx tsx scripts/check.ts <id>`, `npm run check`, `npx vitest run`, `npx tsc --noEmit`,
`npx tsx scripts/normalization-audit.ts [--exclude <ids>]` (no violation for the model; waivers only
for checked false positives, with reasons; the allowlist stays `{}`; in a sandbox it skips models that
don't load and says so), and the pages (`npm run dev`: `/<charity>`, `/<id>`).

Report: the result (native unit, years of healthy life per $1,000, joint low–high), the year and
programmes modelled (with weights) and any left out, the top 3 swings, the share of judgment, audit
rounds with counts, every fact or assumption added.

To change the templates: edit `scripts/gen-templates.py`, run it, keep src/engine/templates.ts in step,
and run `npx vitest run src/engine/templates.test.ts src/engine/lint.test.ts`.
