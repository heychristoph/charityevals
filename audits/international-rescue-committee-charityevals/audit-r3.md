# Audit: international-rescue-committee-charityevals, round 3 (scoped verification)
Result: 3.764e-4 daly/$ = 0.38 years of healthy life per 1,000 dollars (combined range 0.11–1.29); cause median 0.102 (×3.7). Verdict: pass (no high or medium findings; one low).
Model-sha: bd5f7ff617183d3af18a066ff9b9717a7f98ef6f0ee66b15f935affeb733df8c
Scope: only the changes since round 2 (`git diff 290ee78 eab604a` on the model and write-up): `cash_evidence_adj` explainer, new `pro_discount_factor`, `people_reached` explainer, `fp_cost_per_cyp` and its resource, summary and write-up. Nothing else re-audited.
Mechanical: audit-model lint 0 findings, no invariant findings; check.ts "all models valid"; simulation-check stable (5% / 50% / 95% = 0.533 / 1 / 1.97 × best guess); `generated/` and the tree otherwise unchanged.

Previous round: 1 resolved (`cash_evidence_adj` no longer mentions diversion; it now says the count may include people registered twice, with diversion in `se_diversion_share` and fees in the delivery cost; `implementation_adj` already covers closures and stock-outs). 2 resolved (`pro_discount_factor` = (1 + $discount_rate)^-(pro_effect_years × 0.5) = 0.981 at the best guess, multiplied into `pro_wellbys_per_person`, 0.0650; the shared rate, the mid-point of a linearly fading effect, matches the template's recipe; protection falls from about 0.68k to 0.67k healthy years). 3 resolved (`people_reached` explainer: about 12 million, branch sum about 18 million; row is 1.218e7, sum 12.2 + 2.5 + 1.5 + 0.7 + 0.6 + 0.8 = 18.3). 4 resolved (`fp_cost_per_cyp` $45 ($15-100), anchored on the IRC's cost-efficiency analysis; see Sources).

Numbers against the output: the headline 0.3764 rounds to 0.38 in the summary and the write-up's history line (0.39 → 0.38); the range 0.1101-1.286 is "0.11-1.3" in the summary. Branch shares of the 330.6k healthy years: nutrition 146.2k (44%, "two fifths"), other health care 59.5k (18%) and cash 54.7k (17%) ("a sixth" each), contraception 21.5k (6.5%), vaccination 19.9k (6.0%), education 16.7k, livelihoods 10.7k, water 4.1k, protection 0.67k, direct 4.6k. The $30 → $45 change moves contraception from 32.3k to 21.5k, and the result by -3%, as the 0.39 → 0.38 step says.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary, write-up "Contraception" | Contraception (6.5%) and vaccination (6.0%) are described as "about a twentieth each" (5%); both are nearer a sixteenth. | fp_dalys 21.5k and vax_dalys 19.9k of 330.6k. | Say "about a fifteenth each" (summary) and "about a fifteenth" (write-up), or "under a tenth". | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `fp_cost_per_cyp` | https://www.rescue.org/report/cost-efficiency-analysis-distributing-family-planning-materials | not fetched | Builder's figures ($47 average over four programmes; SheCares Uganda $14; WISH2ACTION South Sudan $43-100) are not checked by me in this scoped round; the $45 best guess sits inside the quoted range and inside the row's $15-100 range, and the branch carries the missing-data slider. Source is listed in `resources` with type charity. |
| `pro_discount_factor` | `$discount_rate` (shared assumption) | verified | Formula resolves; value 0.9806 consistent with a 4% rate over half a year. |

## Drivers
Unchanged from round 2: `missing_data_discount`, nutrition (44%: `nut_cfr_untreated`, `nut_evidence_adj`, `nut_attribution_share`), other health care, cash, shared `daly_per_child_death` and `uov_per_daly`. Contraception's cost is now sourced; its 5% share of health spending remains a judgment, ranged. Peers unchanged: 0.38 is level with Direct Relief (0.378), above Save the Children (0.207), below MSF relief (0.70), ×3.7 the cause median, well under 10×.
