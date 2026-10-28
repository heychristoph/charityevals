---
name: audit-cea
description: Independently audit a charityevals cost-effectiveness model (models/*.json, usually one built with build-cea) - template structure, source verification (fetch every key source and check the number), double counting, missing adjustments, unit errors, implausible values against the other models in the repo, sensitivity (tornado, joint low/high) and comparability. Produces a findings list with severity and concrete fixes. Use when asked to audit, review, critique or check a CEA model, and as the audit step of build-cea (run in a fresh subagent).
---

# Audit a CEA

You are the independent reviewer. You did not build this model, and you should not trust its
explainers: check them. You **don't edit the model**; you write findings the builder can act on.

Inputs: the model path; optionally the write-up path, the previous round's findings file, a blind
list (sources and model ids you must not read; pass the ids to `--exclude`), and where to write
the findings (default: print them).

## 1. Mechanical pass

```bash
npx tsx scripts/audit-model.ts <path> [--exclude id,id]
```

It prints lint findings (template structure, sourcing, magic numbers, plausible bounds), the
bottom line in × GiveDirectly, joint low/high, the tornado, the reference class (other models in
the same unit) and, for other charityevals models of the same family, canonical rows side by side.
Copy its high and medium findings into your list (don't re-derive them), then go beyond it.

## 2. Structure against the template

Open `.claude/skills/build-cea/templates/<family>.json` and the model side by side. Check the
causal chain is the template's (cost → reach → effect → adjustments → outcome → donor), that added
rows feed canonical rows rather than bypassing them, and that the family is the right one for
what the charity actually does (a misfiled family is high severity).

## 3. Sources: fetch and verify

For every `observed`/`estimate` input among the top 10 in the tornado, plus every input that sets
cost or reach, fetch `source.url` and find the number:

- **verified**: the quote/page is there and the number, unit, year and currency match;
- **mismatch**: the source says something else (give what it says, with a quote);
- **unsupported**: the source is reachable but doesn't contain the number;
- **unreachable**: say so; ask for an archived copy or a second source.

A mismatch or unsupported number among the top 5 swings is **high**; elsewhere **medium**. Also check
the year: reach and spending must be from the same period. Check `@facts` the model uses the same
way if they were added for this model.

## 4. Reasoning checks

Go through [references/checklist.md](references/checklist.md): double counting, missing
adjustments, unit errors, implausible values against reference classes, and the honesty of the
ranges. For each suspected problem, compute its effect on the bottom line (change the value in a
scratch copy and re-run `scripts/audit-model.ts` on the copy) so the severity is grounded.

## 5. Sensitivity and comparability

- Name the 3–5 inputs that drive the result and say whether each is a sourced number or a
  judgment. A judgment that drives the result needs a reference class in its explainer.
- Check the joint low/high: are the ranges real uncertainty, or arbitrary ±? Is anything with
  real uncertainty a point value? Judge the spread by the line "with shared assumptions at their
  defaults": the shared moral weights and exchange rates are the visitor's to set, not the builder's.
- Compare with the reference class: where the model sits among peers, and which canonical row
  explains the gap with the nearest peer. More than 10× outside the peers needs a sourced reason.
- Check shared numbers are shared: moral weights, SAD factors, WELLBY conversions, discount
  rate, PPP and mortality are `@facts`/`$assumptions`, not retyped.

## 6. Severity

- **high**: wrong or unsupported number on a top-5 driver; unit error; double counting or a
  missing adjustment that moves the result by more than 25%; wrong template family; a rule broken
  (unsourced number, inline moral weight); anything `npm run check` rejects.
- **medium**: moves the result by 10–25%; weak source for a top-10 driver; judgment without a
  reference class; range clearly too narrow or too wide; inconsistency with peers left unexplained.
- **low**: wording, missing context, cosmetic structure, sources that could be better.

## 7. Output

Write (or print) a Markdown file:

```
# Audit: <model id>, round <n>
Bottom line: <x> <unit>/$ = <y>× GiveDirectly (joint <lo>–<hi>×). Verdict: <pass | fix needed>.
Previous round: <for each earlier high finding: resolved / not resolved>

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|

## Sources checked
| Row | URL | Status | Note |

## Drivers
<top 5 inputs, sourced or judgment, and what would most improve the model>
```

Categories: structure, source, double-counting, missing-adjustment, units, plausibility,
sensitivity, comparability, presentation. Every finding has a concrete fix ("set X to Y, citing
Z p. 12", "remove row X from the outcome sum"), not "consider revisiting".
"Pass" means no high findings remain.
