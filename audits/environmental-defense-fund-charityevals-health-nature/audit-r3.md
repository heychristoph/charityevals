# Audit: environmental-defense-fund-charityevals-health-nature, round 3 (verification)
Result: 1.642e-6 daly/$ = 0.0016 years of healthy life per 1,000 dollars (combined range 0.000092–0.029); cause median 0.0019. Verdict: pass.
Model-sha: 4d85a8cec50c6cab8940ed9fbffd5bff7f3517669abf1e6b6d23c2c582d49743
Scope: scoped verification of commit 2e6db2d against round 2's five findings (audit-r2.md); unchanged rows not re-audited.
Mechanical: audit-model.ts 0 findings; check.ts (environmental-defense-fund-charityevals) all valid; summary and write-up figure (0.0016) match the live result.
Previous round: 1 (US heart-disease ages) resolved. 2 (lcri_attribution_share_shared) resolved apart from a low point below. 3 (FY2022 mix) resolved. 4 (lcri_wait, lcri_implementation_adj) resolved for lcri_wait; lcri_implementation_adj partly. 5 (label) resolved.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | lcri_implementation_adj | The new source URL (https://www.epa.gov/system/files/documents/2026-04/forcomment_lcri_access-tips_1.pdf) returns HTTP 404 (curl, 2026-11-14). The drafts exist: EPA's implementation tools page lists draft Access Tips and Service Line Inventory Tips for comment to 30 April 2026. They concern access to lines, not the ten-year deadline, so "works to the ten-year deadline" rests on the final rule (see lcri_wait), not on them. | curl -I on the PDF: 404. Web search result: https://www.epa.gov/dwreginfo/lead-and-copper-rule-implementation-tools. | Point the source at https://www.epa.gov/dwreginfo/lead-and-copper-rule-implementation-tools (access tips, April 2026) and say the deadline itself is the final rule's (89 FR 86418). | none |
| 2 | low | source | lcri_attribution_share_shared | The cited archive URL is the Collaborative's home page at a truncated timestamp (web/20250104/), which resolves to the snapshot of 4 January 2025. The home page supports "not an advocacy organization" and "its members may advocate ... as individual organizations". The steering-committee list is on the About page (web/20250104000958/https://www.lslr-collaborative.org/about-us.html), which is not the cited one. | Both pages fetched through the archive: About lists "Environmental Defense Fund*" (*Steering Committee) and the steering contacts (RESOLVE, AWWA, CEHN, Clean Water Action, EDF); home page has the "not an advocacy organization" sentence. | Cite the About page URL for the steering-committee claim. | none |

## Findings settled
- Round 2 #1: facts cvd_share_*_usa: shares are the counts over 900,760 and sum to 1. 413 → 0.000459, 242 → 0.000269, 33,629 → 0.037334, 198,065 → 0.219887, 668,411 → 0.742052. The counts match round 2's reading of the OWID chart (668,411 / 198,065 / 33,629; the OWID page is JavaScript-only, so the under-15 counts could not be re-read independently; 413 + 242 is consistent with round 2's "about 600"). `cvd_share_80plus_of_70plus_usa` is a judgment, 0.65 (0.55–0.75), with a reference class (UK 70%, US a little younger). `rich_value_70plus` and `rich_value_per_death` read the USA facts; the explainer no longer says "slightly low". Result 0.00147 to 0.001642 (+11.5%: +9% predicted for the ages, +1.5% for the FY2022 share, rest rounding), as round 2 expected.
- Round 2 #3: `health_nature_share_2022` is a judgment, 0.37 (0.32–0.40), with the observed 32.4% / 39.3% / 39.4% in its note; `average_spend_vs_year` reads it for FY2022 and the climate model reads 1 minus it, so the two models take exactly the period's cost (FY2022 shares sum to 1; FY2023 and FY2024 already did; FY2025 uses `core_climate_share` and its complement in each).
- Round 2 #4: `lcri_wait` cites the Federal Register final rule (89 FR 86418, 30 October 2024; API returns that citation and title). The rule text says: "The compliance date for the revisions to 40 CFR 141.2 and 141.31 is November 1, 2027", and "Water systems are required to complete replacements within 10 years of the LCRI compliance date." The 2037 date is gone. Verified.
- Round 2 #5: label now "Household sharing multiplier on an earnings gain".
- Round 2 #2: the claim is reworded to a steering-committee member of a forum that is not itself advocacy, with a reference class (one of three to five national lead groups) and the 20% (8–35%) unchanged; see low #2 above for the URL.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| lcri_wait | https://www.federalregister.gov/citation/89-FR-86418 | verified (via the Federal Register API and full text) | Quotes above. |
| lcri_attribution_share_shared | web.archive.org snapshot of lslr-collaborative.org, 4 January 2025 | verified (low #2) | Steering committee and non-advocacy sentences present on the About and home pages. |
| lcri_implementation_adj | EPA 2026 access-tips PDF | unreachable (404) | Low #1. |
| cvd_share_*_usa | https://ourworldindata.org/grapher/cardiovascular-disease-deaths-by-age | arithmetic verified; counts unchanged from round 2's reading | Chart is JavaScript-only. |

## Drivers
Unchanged from round 2: `win_years_counted`, `missing_data_discount`, `@climate.advocacy_share_of_policy_win`, `@next_dollar.environmental_defense_fund`, `discount_rate`; then `lcri_attribution_share_shared` (judgment with a reference class now).
