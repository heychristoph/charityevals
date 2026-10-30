---
name: build-cea
description: Build charityevals' own cost-effectiveness analysis (CEA) for a charity from public evidence (annual reports, audited financials, program data, studies, evaluator reviews), as a model JSON from a fixed template per intervention family that ends in years of healthy life per $1,000 by the site's standard steps. Runs an independent audit (audit-cea skill, separate subagent) and fixes until no high-severity findings remain. Use when asked to model, evaluate, build a CEA for, or estimate the cost-effectiveness of a charity that has no evaluator CEA to import (to import a published CEA, use import-cea).
---

# Build a CEA

Job: `models/<cause>/<charity>-charityevals.json`, owned by `charityevals`, built from a template so
any two models of a family read side by side, and comparable with every evaluator model on the site.

1. **Comparable**: the family's template, its canonical row ids, the shared `$assumptions` and
   `@facts`, and the standard steps of **docs/normalization.md** (read it: the units, the species step,
   one SADs figure per change, the shared levers). Two models of a family differ only where the
   charities differ.
2. **Every number accounted for**: a sourced fact (URL, retrieval date, quote or page), a shared
   assumption or fact, or a labelled judgment with a reason and a low/high range. Formulas hold no
   constants beyond unit conversions (`ALLOWED_LITERALS`, src/engine/lint.ts).
3. **Faithful to the evidence**: thin evidence gets a wide range and a plain sentence, not optimism.

`npm run check` enforces the mechanical half for charityevals models (src/engine/lint.ts) and
`npx tsx scripts/normalization-audit.ts` the standard steps; the audit does the rest.

## 0. Scope and setup

- Inputs: the charity's name or website; optionally an output path, a **blind list** (sources you
  must not read: docs/eval-skills.md) and a date to use as today.
- Read assumptions/default.json, the facts/*.json labels, src/engine/templates.ts and
  [references/templates.md](references/templates.md), especially its **Conventions**. Skim a
  charityevals model of the same family (`grep -l '"template": "<family>"' -r models`), else an
  evaluator model of the same intervention, unless the blind list forbids it.
- The charity already has a charityevals model: update it instead.

## 1. Pick the template family

| Family | Use for | Unit (native → output) |
|---|---|---|
| `direct-health` | deaths and illness averted: nets, SMC, vitamin A, vaccines, deworming, malnutrition treatment, maternal care | uov |
| `cash-income` | cash transfers, graduation, agriculture or livelihood programs whose outcome is consumption | uov |
| `wellbeing` | psychotherapy, mental-health care, programs measured in life satisfaction or depression scores | wellby |
| `corporate-campaign` | cage-free, broiler (BCC/ECC), fish or shrimp stunning and other company or producer welfare reforms, accountability on existing pledges | SADs → ced |
| `diet-change` | institutional meal replacement, pledges, cooking classes, plant-based outreach | SADs → ced |
| `policy-research-meta` | legislation, research, fundraising/meta, capacity building whose value flows through other actors | the downstream unit: uov, wellby or SADs → ced |

Several programs: model the one with the most spending (or the one the charity is known for), with
`program_spend` limited to it, and list the rest under "What isn't modelled". A large second program
in another family gets its own model `<charity>-charityevals-<program>` (a `variant` can't change
family) and the charity a `programs` entry with funding weights (import-cea section 6). Never force
a program into a family whose causal chain doesn't fit.

## 2. Research

Work through [references/research.md](references/research.md). Keep a research log in your scratch
directory (not the repo): every URL, date, number taken, verbatim quote and page. In outline: money
(audited financials, latest complete year), reach (same year, independently verified where possible),
effect (systematic reviews, then RCTs, then charity-specific evidence), baselines (country facts),
existing reviews unless blind (cite an evaluator's figure as `kind: "estimate"`).

## 3. Write the model

Copy `templates/<family>.json` to the output path and fill it in.

- `id` `<charity>-charityevals`, `kind: "charity"`, `charity`, `owner: "charityevals"`, `template`,
  `cause`, `summary` (2–4 plain sentences: what the charity does, where, the result in years of
  healthy life per $1,000, the biggest uncertainty), `source` (`publisher: "charityevals"`, `title`,
  `url: https://charityevals.org/<id>`, `published`, `retrieved`) and `resources` (`type`: evaluation,
  model, data, study, charity or other). No `evaluator` block.
- **Keep every canonical row id, `output` (with `native`, and `species` for animals) and the section
  kinds.** Replace every `TEMPLATE:` explainer and example value. A branch that doesn't apply stays,
  at 0, with an explainer saying why. Added rows (per age group, per supply chain) feed canonical rows.
- **Inputs**: `observed` and `estimate` need `source.url`, `source.retrieved` (YYYY-MM-DD) and
  `source.quote` or `source.page`, with the source's interval as the range. `judgment` needs a
  low/best/high range and an explainer giving the reason and the anchor (a reference class: another
  model's value, a published estimate).
- **Shared numbers** come from `@facts` and `$assumptions`, never retyped (INV-4): GiveWell's moral
  weights `@moral_weights.*` times `$life_value_multiplier`, SADs per change `@sad_factors.*`, WELLBY
  conversions `@wellby_factors.*`, country data `@<country>.*`. Missing shared data goes into the
  right facts file with a source and range (a new SADs figure with a `change` note). A new assumption
  in assumptions/default.json only for a cross-model value judgment no fact can settle (`fixed: true`
  when evidence sets it and it shouldn't be a slider); never relabel existing ones.
- **The standard steps** are in the template; keep them intact:
  - future benefits read `$discount_rate` (`pv_annuity_due`, the wellbeing discount factor); never
    type in a present value worked out elsewhere;
  - no exchange rate between outcomes inside the model (`$uov_per_daly`, `$uov_per_wellby`,
    `$daly_per_sad`, `$chicken_vs_person`): the output unit's conversion does that (INV-2);
  - animal families: SADs → `sads_<species>` → `ced_<species>` (the formula exactly as in the
    template) → `ced_per_donor_dollar`, species weights only there (INV-3); add a species pair per
    species, with its share as a sourced fact or a ranged judgment;
  - `donor_cost_share` uses `$resource_shares`; attribution is the charity's share of all
    contributors' spending (references/templates.md, convention 2).
- **Adjustments**: one question each; an RCT's effect is already net of its control group.
  Say what isn't adjusted for.
- **Money**: USD of the year spent; other currencies through an input row `fx_<cur>_per_usd`.
- **Write-up** `writeups/<id>.md` when this is the charity's main model, following import-cea
  section 7 (live figures, plain summary first, results in years of healthy life per $1,000), plus a
  short "How this model was checked" section (audit rounds and what changed).
- **Charity record** `charities/<id>.json` if missing (name, cause, website, donate link).

As you go: `npx tsx scripts/audit-model.ts <path>` (lint, result, tornado, reference class; exit 1 on
a high finding), then `npx tsx scripts/check.ts <id>` once the file is in models/.

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

1. Fix every **high** finding; fix **medium** ones or answer them in the explainer. Don't argue a
   high finding away without a source that settles it.
2. Re-run `scripts/audit-model.ts`, then a **new** auditor (round n+1) with the previous findings.
3. Stop when an audit of the current version has no high findings, or after **3 rounds**. Highs left
   after round 3: don't publish; keep the model out of `models/` and report what is unresolved.

Record the rounds (counts by severity, what changed) in the write-up or the eval log.

## 5. Verify and report

`npx tsx scripts/check.ts <id>`, `npm run check`, `npx vitest run`, `npx tsc --noEmit`,
`npx tsx scripts/normalization-audit.ts` (no violation for the model; waivers only as in import-cea
section 8), and the pages (`npm run dev`: `/<charity>`, `/<id>`). In an evaluation sandbox without
bulk models, run only `npx tsx scripts/check.ts <id>` and skip the page.

Report: the result (native unit, years of healthy life per $1,000, joint low–high), the top 3
swings, the share of judgment, audit rounds with counts, every fact or assumption added, and what
isn't modelled.

To change the templates themselves: edit `scripts/gen-templates.py`, run
`python3 .claude/skills/build-cea/scripts/gen-templates.py`, keep src/engine/templates.ts in step, and
run `npx vitest run src/engine/lint.test.ts` (it loads every template, empty and filled in).
