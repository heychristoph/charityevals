---
name: audit-cea
description: Independently audit a charityevals cost-effectiveness model (models/*.json): for charityevals' own models (build-cea) the template structure, source verification (fetch every key source and check the number), double counting, missing adjustments, unit errors and sensitivity; for every model the standard steps of docs/normalization.md (units, species step, shared figures, levers, evaluator view) and plausibility against its peers. Produces a findings list with severity and concrete fixes. Use when asked to audit, review, critique or check a CEA model, and as the audit step of build-cea (run in a fresh subagent).
---

# Audit a CEA

You are the independent reviewer. You didn't build the model and don't trust its explainers: check
them. You **don't edit the model**; you write findings its builder can act on. Work only from what
you are given: the model, its write-up, the blind list and the previous round's findings; never the
builder's notes or research log.

Inputs: the model path; optionally the write-up path, the previous round's findings, a blind list
(sources and model ids you must not read; pass the ids to `--exclude`) and where to write findings
(default: print them).

The rules are docs/normalization.md (the standard steps; the shared versions in 2.7; money moved in
2.8; won reforms in 2.9; the next dollar in 2.10; an estimate's age in 2.11; INV-1 … INV-19 and
SAME-CHANGE in section 3; the owner decisions), the import-cea skill (evaluator models, ranking,
write-ups) and build-cea's SKILL.md and references/templates.md (charityevals models). The owner's
principles: **one consistent way** (every shared concept the site's one way, every slider moving every
model it concerns), **best guesses**, and **fix, don't flag**: every finding names the concrete fix.
Results are years of healthy life per $1,000 throughout.

## 1. Mechanical pass (any violation is high)

- `npx tsx scripts/audit-model.ts <path> [--exclude id,id]`: lint (charityevals models: template,
  sourcing, magic numbers, bounds, the shared figures each canonical row must read, estimate basis and
  date, SAD versions, typed currency rates), every normalization invariant on the model (drafts outside
  models/ too), the result, joint low/high, the tornado, the reference class, the cause's median and
  same-family canonical rows. For an evaluator model, ignore the lint codes that only apply to
  charityevals models (owner, template, required-row, unit, output, sections, donor, species, shared,
  published).
- `npx tsx scripts/check.ts <id>` (model in models/): `expected` values reproduce in the evaluator view.
- `npx tsx scripts/normalization-audit.ts` (model in models/; it takes about 15 minutes over the whole
  library, so run it in the background while you do the rest): any violation for this model is a
  **high** finding. A waiver is acceptable only for a checked false positive, with its reason in
  src/engine/normalization-waivers.json; a waiver covering a real problem is itself a high finding. The
  allowlist (src/engine/normalization-allowlist.json) stays `{}`. Know what each check sees and misses
  (`how` in the report): INV-2c (an evaluator's own conversion moving our headline), INV-2d (a constant
  beside a lever, `8 * $life_value_multiplier`), INV-4 (a literal copy of a shared number), INV-11 (a
  death, stillbirth, income or currency rate not read from the shared version), INV-12 (money moved and
  careers), INV-13 (the same concept at another value; place and year are the only reasons), INV-14 (a
  literal in five or more models with no fact), INV-15 (more than ten times its peers without a reason),
  INV-16 (a side sheet ranked), INV-17 (deaths in a WELLBY model), INV-18 (estimate basis and the
  next-dollar slider), INV-19 (the estimate's date).

Copy every high and medium mechanical finding into your list with its fix (don't re-derive them), then
go beyond them: the checks work on labels and values, so a rule broken under other words is yours to find.

## 2. Structure and standard steps

Check each item; a breach is a finding with a concrete fix (the row, the shared figure, the formula).

- **charityevals model**: open `.claude/skills/build-cea/templates/<family>.json` beside it. The
  chain is the template's (cost → reach → effect → adjustments → outcome → donor → species for
  animals); added rows feed canonical rows; the family fits what the charity does (a misfiled family
  is high); every shared row the template reads is still read (a template row replaced by a typed
  number is high).
- **Scope** (high when it moves the result >25% or the model is of something else): the model covers
  the charity's main programme by spending, and every programme of at least a tenth of programme
  spending, weighted by spending (branches, or separate models with `programs` weights and
  `weight_source` in charities/<id>.json); the year is the latest with audited financials and reach
  for the same period, stated in the summary; no case study, pilot or side activity stands in for the
  programme. Check the charity's own spending breakdown yourself.
- **Every model**:
  - output in uov, daly, wellby, ced or tco2e; `output.native` set; rows after it in `kind: "ours"` sections;
  - `source.published` is the date the estimate was made (a charityevals model: when it was built);
  - `estimate_basis` right for what the dollar is: `past_average` (past spending over past wins:
    campaigns, pledges, policy, research, money moved, a fixed service's lives saved) reads
    `$marginal_vs_past_average` (`published` 1); `marginal` or `unit_cost` doesn't (INV-18). A wrong
    basis is high;
  - one consistent way: every conversion (exchange rate between outcomes, value of a death, depression
    to health, cash benchmark, currency rate, household size, time discount, species weight) reads the
    shared version in our view, the evaluator's figure in `published` with a "changed for consistency"
    explainer, and the evaluator view still reproduces every `expected`. Name the shared version in the fix;
  - deaths read `@moral_weights.<age band>` (the band of the death's age, `_over5` only for unknown
    ages, or an `@death_ages` mix) × `$life_value_multiplier`; stillbirths
    `@givewell_shared.uov_per_stillbirth` × `$life_value_multiplier`; in a WELLBY model deaths enter only
    through `wellbys_from_uov` and don't move with `$daly_per_wellby` (INV-17);
  - depression anchored on `@depression` (PHQ-9 points ÷ `@depression.phq9_sd` for SDs), WELLBYs from
    `@wellby_factors.wellbys_per_sd_year`, no DALY conversion inside a WELLBY model; therapy spillovers
    `@wellby_factors` × `@household_size.<place>`;
  - household sizes `@household_size.<place>` (a programme's own participants only with that reason);
    currency `@fx.usd_per_<cur>_<year>` (IRS, else World Bank); a multiple of cash × `@cash.uov_per_dollar`,
    a real dollar to GiveDirectly `#givedirectly`;
  - every future benefit, and the wait before it, reads `$discount_rate`, with no typed-in present value;
  - a won reform (pledge, law, rule, menu change) counts `$win_years_counted` years, the wait until it
    takes effect discounted; pledges kept from `@sad_factors.commitment_fulfilment_cage_free` / `_broiler`
    (pig, fish and shrimp pledges: a sourced judgment); diet change × `@sad_factors.production_response`,
    meals at `@sad_factors.sads_per_meal_replaced` × a sourced `meal_mix_vs_reference` (2.9);
  - animal reach and persistence: every animal under the commitments won or tracked in the year, with
    delivery only in the fulfilment rate (a delivered-only count times the fulfilment rate discounts
    delivery twice: high when it moves the result >25%);
  - animal models: every species through its own `ced_<s>` row with the standard formula and the SAD
    version of the figure it divides (cage-to-aviary and meals 2024; enriched cages, broilers, shrimp
    2025), the split sourced, nothing else reading species weights; one SADs figure per physical change
    (`@sad_factors`), never adapted ad hoc;
  - climate: `years_until_avoided` discounted, `air_pollution_weight` and `extra_deaths_per_tco2e` in an
    ours section, sourced or labelled judgments with ranges, reading no shared assumption (2.5);
  - money moved through the shared rows of src/engine/moved-money.ts, destinations live (`#model-id`),
    `@meta.*` for new money, shifted money and a new organisation's success; career changes through
    `career_change_value` (INV-12);
  - signs: validity adjustments are multipliers; a downside is a negative share of value lost, not a
    positive share subtracted; one question per adjustment;
  - an idea-stage (Ambitious Impact) model shown only if the charity runs the programme and no model of
    its actual work exists (another evaluator's or charityevals'), flagged `theoretical`; a
    charityevals model is never `theoretical`;
  - best guesses, not conservative cases; every subjective choice `kind: "judgment"` with a range and a
    reason naming its anchor;
  - credit by share of resources counts every contributor's spending and staff's forgone pay
    (`@staff_pay` defaults where the charity gives no breakdown);
  - the evaluator view pins the evaluator's own rates; for an import, the evaluator's rows unchanged
    except visible overwrites.

## 3. Sources: fetch and verify

For every `observed`/`estimate` input among the top 10 in the tornado, and every input that sets cost
or reach, fetch `source.url` and find the number:

- **verified**: the passage is there; number, unit, year and currency match;
- **mismatch**: the source says something else (quote it);
- **unsupported**: reachable, but the number isn't there;
- **unreachable**: say so; ask for an archived copy or a second source.

A mismatch or unsupported number among the top 5 swings is **high**; elsewhere **medium**. Reach and
spending must be from the same period. Check facts added for this model the same way. For an import,
"the source" is the evaluator's sheet: spot-check the top drivers' cells.

## 4. Reasoning checks

Work through [references/checklist.md](references/checklist.md). For each suspected problem, compute
its effect on the result (change the value in a scratch copy, re-run `scripts/audit-model.ts` on it),
so the severity rests on a number.

## 5. Sensitivity and peers

- Name the 3–5 inputs that drive the result and whether each is sourced or a judgment. A judgment
  that drives the result needs a reference class in its explainer.
- Ranges: real uncertainty or arbitrary ±? Anything uncertain left as a point value? Judge the spread
  with shared assumptions at their defaults: those are the visitor's to set, not the builder's.
- Peers on the site: where the result sits among models in the same unit, for the same intervention
  and in its cause (audit-model prints the cause's median), and which row explains the gap with the
  nearest peer. More than 10× the cause's median needs a stated reason in the `summary` (INV-15),
  sourced where it can be; without one it is high. Under a tenth of it: find the row that explains the
  gap and check scope, reach and persistence first; a gap that comes from a different programme, year
  or counting rule than the site's is a finding with its fix, a gap the evidence supports is stated in
  the summary. Never tune toward a peer's or an evaluator's number: the fix is the rule, not the result.
- The same physical change or the same shared number counts the same as in the peers.

## 6. Severity

- **high**: wrong or unsupported number on a top-5 driver; unit error; double counting or a missing
  adjustment that moves the result by more than 25%; wrong family or wrong scope (another programme or
  year than the money pays for, a programme of a tenth or more of spending left out, no funding
  weights); a broken rule (unsourced number, a shared number retyped or adapted, an exchange rate
  inside the model, a species weight outside `ced_*`, a wrong SAD version); an evaluator's or the
  builder's own conversion where charityevals has a shared one (exchange rates between outcomes, value
  of a death, depression, discounting, cash benchmarks, currency rates, household sizes, years a reform
  counts, pledges kept, production response, per-meal SADs); a conservative or optimistic case used
  where a best guess is possible; a future benefit or a wait not discounted at `$discount_rate`; a death
  valued off its age band or not moving with `$life_value_multiplier`; a past average without
  `$marginal_vs_past_average`, a marginal or unit-cost estimate that reads it, or a wrong
  `estimate_basis`; no `source.published`; a judgment filed as observed or estimate; a founders' or
  funding counterfactual subtracted in our view; an unfinished sheet imported; an idea-stage estimate
  shown wrongly or unflagged; more than 10× the cause's median with no reason; any lint high or
  invariant violation; anything `npm run check` rejects.
- **medium**: moves the result 10–25%; weak source for a top-10 driver; judgment without a reference
  class; range clearly too narrow or wide; a gap with peers left unexplained (including under a tenth of
  the cause's median); a sign convention broken; a write-up with a stale or non-live result, or a result
  as a multiple of GiveDirectly.
- **low**: wording, missing context, cosmetic structure, sources that could be better.

## 7. Output

```
# Audit: <model id>, round <n>
Result: <x> <unit>/$ = <y> years of healthy life per $1,000 (joint <lo>–<hi>); cause median <m> (×<r>). Verdict: <pass | fix needed>.
Scope: <programmes and year modelled, against the charity's spending breakdown>
Mechanical: lint <h/m/l>, invariants <violations or none>, normalization-audit <violations or none>
Previous round: <each earlier finding: resolved / not resolved (a finding answered with a note, not a fix, is not resolved)>

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|

## Sources checked
| Row | URL | Status | Note |

## Drivers
<top 5 inputs, sourced or judgment, and what would most improve the model>
```

Categories: structure, scope, normalization, source, double-counting, missing-adjustment, units,
plausibility, sensitivity, comparability, presentation. Every finding has a concrete fix ("set X to Y,
citing Z p. 12", "read @sad_factors.sads_per_broiler_bcc, the charity's 0.5 in the explainer", "model
the school programme too, 34% of 2024 programme spending, as a branch"), never "consider revisiting"
or "flag". "Pass" means no high findings remain.
