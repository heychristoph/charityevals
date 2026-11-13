# Audit: team-rubicon-charityevals, round 2
Result: 1.256e-6 daly/$ = 1.256e-3 years of healthy life per $1,000 (combined range 2.72e-4 – 5.80e-3); cause median 0.3585 (×0.0035). Verdict: pass.
Model-sha: 68c60e074bd1804cd0d3aff56e66cf53a8c5873e9eeb1669fde0c2a891924e4d
Scope: unchanged from round 1 (all three programmes, audited 2024 accounts; charity file matched then and is not changed).
Mechanical: lint 0 high / 0 medium / 2 low (unused `audited_program_expenses`, far-below with the summary's reason), invariants none, normalization-audit none for this model (generated/ restored), simulation stable (5% 0.51x, 95% 1.92x), check.ts all valid.
Previous round:
1. resolved: `resp_price_ratio` 1.4 (0.9-2.0), the product of two parts stated in the explainer. Both parts are still unsourced judgments, labelled so; with no published rate found this is the best guess, not a conservative case. Tornado now 9.4e-4 to 1.63e-3, matching the round-1 scratch run.
2. resolved: both explainers say about $173,000 (checks: (3,765,066 - 1,000,000) / 16 = 172,817). `ltr_value_per_home` re-anchored on $/sq ft (see new finding 1).
3. resolved: `ltr_value_per_home` excludes volunteers' labour in label and explainer (see new finding 1 on whether the number does).
4. resolved: `implementation_adj` appears only in `resp_total_adj`; ltr, sbp and vol formulas checked.
5. resolved: `media_resource_share` 0.3 (0.1-0.6) on valuation only, and the explainer says so; it is read only in `attribution_share_shared`.
6. resolved: `inkind_supplies` observed row; `inkind_ops = inkind_total - inkind_media - inkind_supplies`; `program_spend` explainer says donated goods stay in the 990 figure.
7. resolved: low end 0.45; training-hours uncertainty stated; service projects for organisations a + item in `unmodelled_benefits_adj`.
8. resolved as worded, but see new finding 2 for the replacement item.
9. open by design (placeholder to be filled after the audits pass), plus the stale sentence in finding 3.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | `ltr_value_per_home` | Labelled "without the volunteers' labour", but the anchor ($100-150 a square foot in materials and trades, 1,000-1,500 sq ft) is a full contractor price, which includes the labour. Only the volunteers' share of the labour should come out, and no source is cited for the per-square-foot cost. | Explainer text. $100-150 x 1,000-1,300 sq ft = $100,000-195,000, so 130,000 is the whole job. | Either take the labour share out of the anchor (labour is roughly 40% of rebuild cost, so a best guess near $80,000, range $45,000-130,000; cite a construction-cost source such as RSMeans or a Texas rebuild cost per square foot), or say the number is the full price and take the rebuild hours (a ranged `ltr_vol_hours`) out of `vol_hours` in `households_reached` and `resp_value`. | about -5 to -8% |
| 2 | low | double-counting | `unmodelled_benefits_adj` | The new + item "fire departments, scout camps and local volunteers trained as sawyers who then work locally" is again a stock built by the year's cost, which round-1 finding 8 asked to drop (the earlier cohort's work is the steady-state counterpart). It's only in a +10% ranged judgment, so the effect is small. | Row explainer. | Remove the item, or keep it only as the growth in people trained, with a figure. | small (inside the +10%) |
| 3 | low | presentation | write-up | "What isn't modelled" still lists "volunteers trained in 2024 who serve in later years", which the model no longer lists as + (and the service projects for organisations are missing from it). "How this model was checked" is still AUDIT_PLACEHOLDER. | writeups/team-rubicon-charityevals.md lines 40, 46. | Update the list to match the row (add service projects for organisations; drop or reword the trained-volunteers item per finding 2) and fill the audit section after the final round. | none |

## Sources checked
Only changed rows re-verified.
| Row | URL | Status | Note |
|---|---|---|---|
| inkind_supplies | FS-TeamRubicon-123124-Final-Signed.pdf | not re-fetched | The PDF is encrypted and no extractor is installed here. Round 1 verified note 10's $1,059,206 supplies line (Response); the row's page ("p. 16") is not checked. Consistent with p. 5: Response audited 20,144,952 less the 990's 19,286,372 is 858,580, the donated transport. |
| program_spend explainer | Form 990 / audited statements | verified (round 1 figures) | 74,351,135 - 35,664,829 = 38,686,306 against the 990's 38,818,406. |
| ltr cost per home | audited p. 5, 990 Sched. I | verified (round 1 figures) | 172,817. |
| resp_price_ratio, ltr_value_per_home, media_resource_share | none | judgments | Labelled judgments with their parts and anchors; no published source (fine for a best guess, see finding 1 for the $/sq ft source). |

## Drivers
1. `$missing_data_discount` (shared slider, every branch thin).
2. `$uov_per_daly` (shared).
3. `resp_counterfactual_adj` (judgment, 0.55).
4. `resp_price_ratio` (judgment, 1.4, parts stated, unsourced).
5. `$uov_per_ln_consumption` (shared); then `resp_inkind_value`, `client_hours_share`.
Most useful addition: a published contractor hourly rate for debris removal and muck-out, then the number of households or work orders.

Verdict: pass. Findings: 0 high, 0 medium, 3 low.
Model-sha: 68c60e074bd1804cd0d3aff56e66cf53a8c5873e9eeb1669fde0c2a891924e4d
