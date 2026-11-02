---
name: audit-cea
description: Independently audit a charityevals cost-effectiveness model (models/*.json): for charityevals' own models (build-cea) the template structure, source verification (fetch every key source and check the number), double counting, missing adjustments, unit errors and sensitivity; for every model the standard steps of docs/normalization.md (units, species step, shared figures, levers, evaluator view) and plausibility against its peers. Produces a findings list with severity and concrete fixes. Use when asked to audit, review, critique or check a CEA model, and as the audit step of build-cea (run in a fresh subagent).
---

# Audit a CEA

You are the independent reviewer. You didn't build the model and don't trust its explainers: check
them. You **don't edit the model**; you write findings its builder can act on.

Inputs: the model path; optionally the write-up path, the previous round's findings, a blind list
(sources and model ids you must not read; pass the ids to `--exclude`) and where to write findings
(default: print them).

The rules are docs/normalization.md (standard steps, shared versions in 2.7, money moved in 2.8, won
reforms in 2.9, INV-1 … INV-17 and SAME-CHANGE in section 3, the owner decisions), the import-cea
skill (evaluator models, ranking, write-ups) and build-cea's references/templates.md (charityevals
models). Results are years of healthy life per $1,000 throughout.

## 1. Mechanical pass

- `npx tsx scripts/audit-model.ts <path> [--exclude id,id]`: lint (charityevals models: template,
  sourcing, magic numbers, bounds), the result, joint low/high, the tornado, the reference class
  (hand-built models in the same unit) and same-family canonical rows. For an evaluator model, ignore
  the lint codes that only apply to charityevals models (owner, template, required-row, unit, output,
  sections, donor, species).
- `npx tsx scripts/check.ts <id>` (model in models/): `expected` values reproduce in the evaluator view.
- `npx tsx scripts/normalization-audit.ts` (model in models/): any violation for this model is a
  finding (high). A waiver is acceptable only for a checked false positive, with its reason in
  src/engine/normalization-waivers.json; a waiver covering a real problem is itself a high finding.
  The allowlist (src/engine/normalization-allowlist.json) stays `{}`. Know what each check sees and
  misses (`how` in the report): INV-2c (an evaluator's own conversion moving our headline), INV-2d (a
  constant beside a lever in a formula, `8 * $life_value_multiplier`), INV-4 (a literal copy of a shared
  number, with label synonyms and 0.2% tolerance), INV-13 (the same concept at another value in another
  model; place and year are the only reasons), INV-14 (a literal in five or more models with no fact
  behind it), INV-15 (more than ten times its peers without a reason in the summary), INV-16 (a side or
  value-of-information sheet ranked, or a bottom-line location that isn't the sheet's), INV-17 (deaths
  in a WELLBY model moving with the WELLBY rate).

Copy the high and medium findings into your list (don't re-derive them), then go beyond them.

## 2. Structure and standard steps

- **charityevals model**: open `.claude/skills/build-cea/templates/<family>.json` beside it. The
  chain is the template's (cost → reach → effect → adjustments → outcome → donor → species for
  animals); added rows feed canonical rows; the family fits what the charity does (a misfiled family
  is high).
- **Every model**:
  - output in uov, daly, wellby or ced; `output.native` set; rows after it in `kind: "ours"` sections;
  - animal models: every species through its own `ced_<s>` row with the standard formula, the split
    sourced, nothing else reading species weights;
  - one SADs figure per physical change (`@sad_factors`), with the evaluator's own in `published`
    and an explainer that says so;
  - one consistent way: every conversion (exchange rate between outcomes, value of a death, depression
    to health, cash benchmark, currency rate, time discount) reads the shared version in our view, the
    evaluator's figure in `published` with a "changed for consistency" explainer, and the evaluator
    view still reproduces every `expected`;
  - deaths read `@moral_weights.<age band>` (the band of the death's age, or an `@death_ages` mix) ×
    `$life_value_multiplier`; in a WELLBY model they don't move with `$daly_per_wellby`;
  - depression anchored on `@depression` (PHQ-9 points, `phq9_sd` per SD); therapy spillovers from
    `@wellby_factors`;
  - every future benefit, and the wait before it, reads `$discount_rate`, with no typed-in present value;
  - a won reform counts `$win_years_counted` years, the wait discounted, pledges kept from
    `@sad_factors.commitment_fulfilment_*`, diet change × `@sad_factors.production_response` (2.9);
  - a cost per outcome that is past spending over past wins (campaigns, policy, research, money moved)
    × `$marginal_vs_past_average`, and `estimate_basis` says what the model's dollar is
    (`past_average`, `marginal`, `unit_cost`; normalization.md 2.10, INV-18);
  - money moved through the shared rows of src/engine/moved-money.ts, destinations live (`#model-id`);
  - an idea-stage (Ambitious Impact) model shown only if the charity runs the programme and nothing
    better exists, flagged `theoretical`;
  - best guesses, not conservative cases; subjective inputs filed as `kind: "judgment"`;
  - credit by share of resources counts every contributor's spending and staff's forgone pay;
  - the evaluator view pins the evaluator's own rates;
  - for an import, the evaluator's rows unchanged except visible overwrites.

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
- Peers: where the result sits among models in the same unit and for the same intervention, and
  which row explains the gap with the nearest one. More than 10× the peers' median needs a reason in
  the model's `summary` (INV-15), sourced where it can be. The same physical change or the same shared number must count the same as in the peers.

## 6. Severity

- **high**: wrong or unsupported number on a top-5 driver; unit error; double counting or a missing
  adjustment that moves the result by more than 25%; wrong family; a broken rule (unsourced number,
  a shared number retyped, an exchange rate inside the model, a species weight outside `ced_*`);
  an evaluator's own conversion kept in our view where charityevals has a shared one (exchange
  rates between outcomes, DALY definitions, value of life, discounting, cash benchmarks, currency
  rates); a conservative or optimistic case used where the evaluator gives a best guess; a future
  benefit not discounted at `$discount_rate`; a death valued off its age band or not moving with
  `$life_value_multiplier`; a past average used without `$marginal_vs_past_average`, a marginal or unit-cost
  estimate that reads it (counted twice), or a wrong `estimate_basis`; a judgment
  filed as observed or estimate; a founders' or funding counterfactual subtracted in
  our view; an unfinished sheet imported; an idea-stage estimate shown for a charity that doesn't
  run the programme, or without the `theoretical` flag; any normalization-audit violation;
  anything `npm run check` rejects.
- **medium**: moves the result 10–25%; weak source for a top-10 driver; judgment without a reference
  class; range clearly too narrow or wide; a gap with peers left unexplained; a write-up with a stale
  or non-live result, or a result as a multiple of GiveDirectly.
- **low**: wording, missing context, cosmetic structure, sources that could be better.

## 7. Output

```
# Audit: <model id>, round <n>
Result: <x> <unit>/$ = <y> years of healthy life per $1,000 (joint <lo>–<hi>). Verdict: <pass | fix needed>.
Previous round: <each earlier high finding: resolved / not resolved>

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|

## Sources checked
| Row | URL | Status | Note |

## Drivers
<top 5 inputs, sourced or judgment, and what would most improve the model>
```

Categories: structure, normalization, source, double-counting, missing-adjustment, units,
plausibility, sensitivity, comparability, presentation. Every fix is concrete ("set X to Y, citing Z
p. 12", "read @sad_factors.sads_per_broiler_bcc, ACE's 0.64 in `published`"), never "consider
revisiting". "Pass" means no high findings remain.
