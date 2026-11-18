# Audit: longview-philanthropy-charityevals, round 5 (scoped verification)
Result: 0.002558 uov/$ = 1.279 years of healthy life per 1,000 dollars (combined range 0.072-22.57; the model's own ranges alone 1.00-1.66), from 0.002537 (1.269) before the change: +0.8%.
Scope: the change to the value_destinations row (`moved_dollar_value`'s input), the new fact `longview_2025_mats_share_of_ai`, the changed `longview_2025_metr_share_of_ai` explainer and the write-up's paragraph. No source or scope re-audit.
Mechanical: `scripts/preflight.ts`: passes, 2 low (simulation `@meta.prior_vs_cash`, generated/distributions.json out of date: run `npx tsx scripts/summaries.ts` when stamping). `scripts/audit-model.ts`: no lint, no invariant violation.

## Checks
- Formula: AI term = mats_share x #charityevals:mats + metr_share x #charityevals:metr + (1 - mats_share - metr_share) x #cause:ai; shares 0.2071 + 0.0341 = 0.241 < 1, weights sum to 1. Nuclear and biosecurity terms and the normalisation by the three area shares are unchanged. Correct.
- Consistency with other money movers: ploughshares-fund reads each grantee live with `#charityevals:<grantee>` and the same explainer pattern (docs/normalization.md 2.8). Same here.
- Other 2025 itemised grantees: models/ has no model for RAND, Horizon Institute, Foundation for Secure AI, Neuromatch, CSIS, Panoplia, University of Chicago or Princeton (only mats, metr, epoch-ai, far-ai, redwood-research, center-for-ai-safety, securebio exist among AI/bio models, none of them itemised in the fact notes). Nothing left at the cause average that has a model.
- No double counting: `prior_dollar_value` reads #cause:ai only (the ordinary-charity counterfactual for shifted money, as before; it correctly does not read MATS/METR). `careers` rows are off (`careers_changed` 0; the careers value row reads `moved_dollar_value`, unused). MATS and METR enter once, through `moved_dollar_value`.
- MATS share: 1,050,000 / 5,069,388 = 0.2071 (arithmetic right; the fact note, the explainer "21%" and the write-up agree with the 0.2071 value). The ProPublica page (fetched) lists Schedule I for FY2025 (filed 18 Sep 2026) and FY2024 but does not reproduce the recipients or amounts, so the $1.05M could not be checked there: not a finding. The itemised-grant list in the shared share_ai note names MATS $1.05M, matching.
- Texts vs formula: model explainer ("MATS (21%) and METR (3.4%) ... others and the money no list itemises take their area's charities"), both fact explainers and the write-up (value paragraph and the "value of a dollar" uncertainty bullet, now "RAND and the Horizon Institute, its largest US grantees after MATS") describe the formula. The write-up's headline is the `{{result}}` placeholder, so nothing stale.
- Rules: no comparison with other charities, medians or peers in the changed texts; no mention of effective altruism in the model or the changed text.

## Findings
| # | Severity | Category | Row | Finding | Fix |
|---|---|---|---|---|---|
| 1 | low | presentation | write-up line 65 | Pre-existing, not part of this change: a source title reads "EA Forum". | Optional: leave (it is a source title), or cite the post by its title and URL only. |
| 2 | low | presentation | brief | The change's brief quoted the headline as moving from about 2.43e-3 to 2.377e-3; it moves from 2.537e-3 to 2.558e-3. | Fixed: the result line above gives the live figures; generated/ regenerated before stamping. |

No high or medium finding.

Model-sha: 95c4e79764edaedcf3114f52b2c90b90064ea2d9733292bc89be4b6b696b5fbe
Rules: 0.1.1
Verdict: pass

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change of its own; the headline moves with the models it reads live, whose shares were re-judged). Mechanical: headline 1.437 → 1.471 (+2.4%), 12 rows changed, against 593b1bba.

Re-stamped (17 Nov 2026), rule credit-switch-co-funders: Credit rule 2.24, step 6: the co-funder switch counts co-funders only; the donors whose money a mover moves are mobilised (under mobiliser_share), so their new money leaves donor_cost_share. Only results with the switch on move. Mechanical: headline unchanged, against the tree before the rule.
