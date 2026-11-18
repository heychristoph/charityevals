# Audit: no-means-no-worldwide-charityevals, round 3 (scoped verification of the round-2 fixes)
Result: 2.002e-4 uov/$ = 0.1001 years of healthy life per 1,000 dollars (combined range 0.015–0.665); cause median 0.0688 (×1.455). Verdict: pass.
Model-sha: d911fa118d93723d69c5f77acfaa9b9ac8da015eba8ab0662ef8f8d81bb982a6
Rules: 0.3.12
Scope: only the changes in commit 9ff8fd19 (new fact anxiety_mild, rows ptsd_mild_share / ptsd_severe_share / ptsd_disability_weight, assault_rate explainer and quote, others_cost_per_youth wage label, summary and write-up numbers). Nothing else re-audited.
Mechanical: audit-model lint 0 high / 0 medium / 1 low (spread, already answered in the summary); check.ts all valid; simulation-check stable (5% 0.122×, 50% 1×, 95% 6.56× the best guess).

Round 2 findings:
- Finding 1 (assault_rate anchors): answered adequately, residual low (finding 1 below). Other countries' surveys were not added, but the uplift is now worked (2.4% × 2.5 = 6.0%), the quote is the females column, and the range's low end is the interview figure itself.
- Finding 2 (PTSD weight): fixed. Rebuilt as three levels; arithmetic closes (below).
- Finding 3 (instructor wage): fixed as a judgment label in the explainer.
- Finding 4 (the low): see round 2 file; no change needed in this scope.

Arithmetic checked:
- Shares: 40.9/71.7 = 57.0% mild, 18.5/71.7 = 25.8%, 12.3/71.7 = 17.2%; severe of the non-mild 12.3/30.8 = 39.9%, matches 40%.
- ptsd_disability_weight = 0.57×0.030 + 0.43×(0.4×0.523 + 0.6×0.133) = 0.0171 + 0.43×0.289 = 0.141, matches "about 0.14".
- dalys_per_assault = (1.1×0.141 + 0.4×0.396) × harm_discount (0.95) = 0.298, matches "about 0.30" in the row, summary and write-up ("0.3").
- Headline 0.1001 matches "about 0.10" in the summary; write-up "went from 0.12 to 0.10" is consistent. The write-up's headline span (0.14) is a generated figure, refreshed by the build, not a stale hand-typed number.
- Uplift: 6.6/2.4 = 2.75 ("nearly three times"); 2.4 × 2.5 = 6.0. Zimbabwe quote verified in the text copy: Table 2, columns Females then Males, "Unwanted completed 13-17 2.4% 0.0"; the model now quotes the females figure only, and the page label says girls first column.
- anxiety_mild fact 0.030 (0.018–0.046) matches GBD 2019 as used in the explainer; the weights it sits beside (0.133, 0.523) unchanged.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `assault_rate` | The 2.5× uplift rests on one cross-country comparison (Nairobi 10-14 forced sex 6.6% vs Zimbabwe 13-17 forced or pressured 2.4%) that mixes survey mode with country, age and definition; the explainer notes the age difference but not the others. The range (2.5–12%) is honest about it and the direction is plausible, so this no longer needs other countries' surveys to stand; adding Nigeria 2014 / Uganda 2015 / Zimbabwe 2017 would still tighten the second-largest swing. | Explainer arithmetic; Table 2 of the UNICEF file. | Optional: add the VACS girls 13-17 past-12-month rates and weight by beneficiaries, or add a clause that the 2.5× is rough because country and definition differ. | ±0 at the best guess; range already spans it |
| 2 | low | source | `assault_rate` | The source's `page` label names the table's columns but not "Table 2" (round 2 asked for it). | Source block. | Add "Table 2". | none |

Counts: 0 high, 0 medium, 2 low. Round 2's two mediums are resolved (finding 1 downgraded to a residual low).

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 94da5a14.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against 32b69cd7.
