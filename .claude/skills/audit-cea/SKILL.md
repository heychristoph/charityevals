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

The rules are docs/normalization.md (standard steps, INV-1…INV-10, SAME-CHANGE), the import-cea
skill (evaluator models, ranking, write-ups) and build-cea's references/templates.md (charityevals
models). Results are years of healthy life per $1,000 throughout.

## 1. Mechanical pass

- `npx tsx scripts/audit-model.ts <path> [--exclude id,id]`: lint (charityevals models: template,
  sourcing, magic numbers, bounds), the result, joint low/high, the tornado, the reference class
  (hand-built models in the same unit) and same-family canonical rows. For an evaluator model, ignore
  the lint codes that only apply to charityevals models (owner, template, required-row, unit, output,
  sections, donor, species).
- `npx tsx scripts/check.ts <id>` (model in models/): `expected` values reproduce in the evaluator view.
- `npx tsx scripts/normalization-audit.ts` (model in models/): any violation for this model.

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
  - deaths read `$life_value_multiplier`; benefits over several years read `$discount_rate`, with no
    typed-in present value;
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
  which row explains the gap with the nearest one. More than 10× outside the peers needs a sourced
  reason. The same physical change or the same shared number must count the same as in the peers.

## 6. Severity

- **high**: wrong or unsupported number on a top-5 driver; unit error; double counting or a missing
  adjustment that moves the result by more than 25%; wrong family; a broken rule (unsourced number,
  a shared number retyped, an exchange rate inside the model, a species weight outside `ced_*`);
  any normalization-audit violation; anything `npm run check` rejects.
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
