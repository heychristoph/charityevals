# Credit that adds up: the plan (17 November 2026)

## The rule

Credit for any outcome adds up to roughly 100% across everyone who contributed to it. Each resource that goes into an outcome passes one test: **would this party have committed it without the organisation?**

| Answer | Class | Setting | Credit |
|---|---|---|---|
| Yes, independently | **co-funder** | "Give each funder credit for its share" (`$resource_shares`) | split by money (pro rata), as PCAF and FCDO do |
| No, only because of the organisation | **mobilised** | new slider `$mobiliser_share`, default **30%** | the organisation gets s of the good, the mobilised party 1 − s |
| Partly | both | both | the resource is split into its two parts |

The two controls are mutually exclusive and exhaustive by construction. One convention applies throughout: beneficiaries' own time is not a resource, as in every standard.

### Mobilised, everywhere and in the same way

| Pattern | What is mobilised |
|---|---|
| Money moved | New money, or redirected money (which earns only the gain, V − V0) |
| Research or advice | The spending it changed, such as a funder's grants |
| Career changes | Forgone pay × years |
| Incubation | The charities it started |
| Matching funds | The donations the match brought in |
| Every policy or campaign win | The government budgets, companies' compliance spending and similar resources that carry it out |

The rule applies equally to our builds and to evaluator imports. Imports keep their evaluator view by pinning the slider at 1.

### Two cuts, never the same one twice

1. "Would it have happened anyway" (deadweight) removes what the organisation didn't cause: `own_effect_share`, `new_money_share`, the policy counterfactuals.
2. The slider then splits what it did cause.

A credit share that already puts the adopter in its denominator is re-judged so that it counts co-advocates and co-deliverers only.

### Costs, chains, overlap

| Topic | Rule |
|---|---|
| Costs | s applies to benefit minus cost (compliance costs 2.21, public money 2.23), never to benefit alone. |
| Chains | Each layer splits only the share it received, so shares compound (ACE → THL → companies). That is what makes the total add up. |
| Overlap | Several mobilisers on the same dollar share s between them. This is modelled where data exists (Giving What We Can and Effektiv Spenden via GiveWell funds, The Life You Can Save's joint fund, Ambitious Impact's giving organisations). Elsewhere it is logged as a known over-count. |
| Floor | The slider runs from 5% to 100%, because 0 breaks about 18 models. |

### Where the controls overlap today, and the fixes

- GiveWell's "leverage": the government money a charity crowds in is mobilised. It moves from the toggle to the slider.
- About 40 coalition shares include the adopter. They are re-judged.
- Meta charities' donors sit in `META_DONOR_COST_SHARE_FORMULA`. They move out of the toggle and under the slider.

## Steps

The slider is wired at 100% first, which reproduces today exactly, and flipped to 30% last.

| # | Step | Scope | Runs with |
|---|---|---|---|
| 1 | Rule 2.24 in normalization.md. Engine: the assumption at 1.0, shared formulas in moved-money.ts, INV-12 updated, new INV-22 (reach, applied once, pinned in imports, no movement in delivery-only models, no NaN), lint and preflight, tests including an s = 1 snapshot. Builder text: templates.md, families, import-cea and audit-cea. | engine, docs, skills | – |
| 2 | Money moved, changed spending, careers, incubation | 31 models | 3, 4 |
| 3 | Win branches in our builds: add the share and fix cost rows | ~105 models, ~350 branches | 2, 4 (by family) |
| 4 | Imports: classify (`mobilised` field), add our row and the pin, keep both in the converters | ~55–70 of ~250 | 2, 3 (by evaluator) |
| 5 | Classify branches (win, research, delivery) and re-judge shares that count the adopter, each with a scoped verification | ~40 models re-judged | after 2–4, by family |
| 6 | Toggle clean-up (donors out of `META_DONOR_COST_SHARE_FORMULA`, the mobilised government out of the toggle denominators) and overlap rows | ~34 models | after 5 |
| 7 | Flip the default to 30% through rule-change.ts. Regenerate distributions, summaries, MCP data and prose numbers. Write the methods page "Credit" section and the setting texts. List moves over 2× for the owner. | assumptions, generated, pages | last |

Every commit keeps CI green: at s = 1 the headlines stay unchanged and receipts are re-stamped mechanically. The flip changes no model file.

Effort is about 9–10 agent-days, about 4–5 calendar days with steps 2–4 in parallel. Full review and per-step detail: `mobiliser-share-review-plan.md` (notes folder).
