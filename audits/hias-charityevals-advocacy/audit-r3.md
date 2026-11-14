# Audit: hias-charityevals-advocacy, round 3 (scoped)
Result: 3.057e-4 daly/$ = 0.306 years of healthy life per 1,000 dollars (cause median 0.0810, x3.8). Scope: only the round-2 lows (R2-1 to R2-4) and the rows changed in 04a7b33.
Mechanical: audit-model 0 high / 0 medium / 2 low (spread, already in the summary; one new diagnostic, R3-1).

## Round-2 findings: status
| # | Status | Check |
|---|---|---|
| R2-1 | fixed | `pac_admitted` now 80, observed, with the IRAP 2025 annual report URL, p. 4 and quote; identical to `pacito_people` in the IRAP advocacy model (value, URL, page, quote). The IRAP 5 March 2026 URL for "more than a hundred" is in the explainer. |
| R2-2 | fixed | The cost fact's explainer now says staff $1.8M (about fifteen at $120,000) plus a judged $1.2M of campaign, coalition and litigation support, that the policy chief's role is global so only part of that pay counts, and that the range's low is staff alone. Arithmetic matches the $3M best guess. |
| R2-3 | fixed | Write-up names all three audit directories. |
| R2-4 | fixed | `wellbys_bridged` = `refugees_counted * ls_gain_per_person_year + released...`; `refugees_counted` = `pend_refugees + pac_admitted * pac_counterfactual_adj`. |

## Changed rows
- `pac_counterfactual_adj` 0.7 (0.4-0.9): same value, range and rationale as IRAP's `pacito_counterfactual_adj`; applied once, in `refugees_counted`.
- `total_adj` no longer includes `counterfactual_adj`: no double application (the cost/outcome chain reads `refugees_counted`; `counterfactual_adj` is only the weighted average, 0.985).
- Summary and write-up say "more than 80 ... let travel" and "less a share who might have travelled anyway"; consistent with the model (2%, 10,000, half the case's cost, 15%, 49%, 0.3).
- Credit: HIAS 15% (5-30%) and IRAP's 50% (30-80%) sum to 65% at best guesses, leaving 35% for co-counsel, Church World Service, Lutheran Community Services Northwest and the individuals; consistent with HIAS's own split (IRAP and co-counsel three-fifths, so IRAP's 50% plus about 10% co-counsel). Only the joint top of both ranges (80% + 30%) exceeds 1, not a best guess or a realistic pairing. No finding.

## New findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| R3-1 | low | `counterfactual_adj` | The lint asks that a row not applied itself say it is the outcome-weighted average of the branches. The explainer says "for reading only" but not that. | Reword the explainer to start "Outcome-weighted average of the branches (the pending win 1, the injunction's admissions pac_counterfactual_adj), for reading only; applied in refugees_counted." |
| R3-2 | low | `wellbys_bridged` | Admissions under the injunction get one year of `ls_gain_per_person_year`, the pending win its discounted years inside `pend_refugees`. Harmless while the gain is 0. | None needed unless the gain is set above 0; then give `pac_admitted` the `discounted_years` factor. |

No high or medium findings.

**PASS**

Model-sha: 25c1ae831e3d9018d0d2d2aa40e86aee2d2f85d5f744de890f5ef8aa9925c095
