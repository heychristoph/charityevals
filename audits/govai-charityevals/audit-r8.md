# Audit: govai-charityevals, round 8 (verification of the compliance-cost rule 2.21)
Result: 0.001576 daly/$ = 1.576 years of healthy life per $1,000 (combined range 0.0416–59.73); cause median 5.255 (×0.30). Verdict: pass.
Model-sha: c27103fa94ea0de9a2b94ddfa6c2bd12b9ee415e212eb1cb1a500b8bfd24f658
Scope: scoped verification of the changed rows (one sentence appended to the explainer of `pol_wins`); headline unchanged.
Mechanical: `audit-model.ts` exit 0, no high or medium finding; invariants none (the peer lines are being removed elsewhere and ignored).
Previous round: not applicable (verification of one changed row).

Verdict: pass

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | The summary compares the model with other charities ("close to the Center for AI Safety's and far above METR's, MIRI's and Redwood Research's"), which the owner rule forbids. Not a changed row. | Summary text. | Delete that sentence; keep the reason (a fifth of the catastrophe research is threat modelling of AI-enabled attacks) as a plain statement of what drives the result. | none |

The appended sentence is accurate: the Code of Practice is a voluntary, Commission-published instrument; the Commission's AI Act impact assessment (2021) predates general-purpose models, and a search found no regulator estimate of the Code's cost to signatories (commentary only says it "merits significant investment"; the industry association calls it a disproportionate burden without a figure). Nothing in the model is changed, so sign, dollar year, timing and double counting are untouched (the row has no cost term). No fact from facts/compliance_costs.json is read.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| pol_wins | https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai | verified | Code published 10 July 2025; no cost estimate on the page or in the search results. |

## Drivers
Unchanged: ai_catastrophe_chance (judgment), the misuse cut per million (estimate), win_years_counted, missing_data_discount, @next_dollar.govai. The Code branch is a tenth of the result and carries no compliance cost, so the omission moves it by nothing at the defaults.
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)
