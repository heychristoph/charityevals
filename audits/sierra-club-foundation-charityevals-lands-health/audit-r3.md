# Audit: sierra-club-foundation-charityevals-lands-health, round 3 (verification of the compliance-cost rule 2.21)
Result: 9.286e-7 daly/$ = 0.0009286 years of healthy life per 1,000 dollars (combined range 6.1e-5 to 0.0142); cause median 0.001995 (x0.47). Round 2: 0.001075, so -14%. Verdict: pass.
Verdict: pass
Model-sha: c8bf33f1141c6bada4faf8f9e9de7c526175176c2ea1d031731d64ba63973631
Rules: 0.3.13

Scope: scoped verification of the changed rows (`pm_compliance_uov`, `uov_bridged`, `summary`, and the figure in writeups/sierra-club-foundation-charityevals.md). Unchanged rows not re-audited.

Mechanical: `audit-model.ts` exit 0, 0 findings. normalization-audit, simulation-check not run (caller runs them).

Previous round: no open findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | facts/compliance_costs.json `us_pm_naaqs_2024_cost_per_year` | Table label "ES-8" should be Table ES-10 (p. ES-27); ES-8 is monetized benefits by area. | RIA text. | Correct the page field. | none |
| 2 | low | presentation | `uov_bridged` | `(pm_compliance_uov) / (1 + unmodelled_benefits_adj)` has redundant brackets. | formula. | Drop the brackets. | none |

Checks:
- Sign negative; enters `uov_bridged` divided by `(1 + unmodelled_benefits_adj)` (0.3), and `outcome_total` multiplies the DALYs from uov by that factor, so the cost counts once at face value (-95.4 uov; uov_bridged 370.8). Right. Before-and-after: 0.001075 to 0.0009286; `pm_uov x pm_credit` 444.2, cost 95.4 (21%), the same ratio as the soot branch in the other two models.
- Dollar year and consumption: $590M of 2017 dollars x `cpi.usa_2024 / usa_2017`, over 1.2 x $58,517 (2024 dollars), `$uov_per_ln_consumption`. Right.
- Branch's own adjustments: `p_success`, `pm_years`, `pm_counterfactual_adj`, `pm_attribution_share` (Sierra Club's 4% x the foundation's share), `pm_implementation_adj`, `missing_data_adj`; not `pm_evidence_adj`. Right. The benefit side `pm_uov x pm_credit` is gross of costs (EPA's deaths avoided).
- Timing: `pm_years` (9-year wait, 2032 analysis year) shared by benefit and cost.
- Summary: "about 0.0009 ... after the standard's compliance costs (EPA's own figure), nearly all from the soot standard" matches (the outdoors trips and illness rows are small: wellbys 0.7 DALYs). Write-up reads 0.0009. No peer comparison in the summary.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_pm_naaqs_2024_cost_per_year | EPA RIA, p. ES-27 | verified | "Costsb $200 $340 $590 $1,500", millions of 2017$, annualized at 7%, 2032 (finding 1: table label). |
| compliance_cost_payer_multiple | facts/public_funds.json | judgment | reasoned and ranged (1.2, 0.8-2). Accepted. |

## Drivers
Unchanged: the Sierra Club's share of the rule (4%), the next dollar, the delivered share. The compliance row removes about 21% of the soot benefit.

Verdict: pass
Model-sha: c8bf33f1141c6bada4faf8f9e9de7c526175176c2ea1d031731d64ba63973631
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.
Re-stamped (15 Nov 2026): side-effect tags (2.16, mechanical; headline unchanged)
Re-stamped (15 Nov 2026): damage beyond deaths at EPA's 0.6 in the tco2e bridge copy, read through the side-effects weight (2.5, 2.16; mechanical); summary figure updated where it changed

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1a9667aa.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7224423b.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against cc9a04dd.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: typed results in the model's text made placeholders or recomputed at the 30% mobiliser share, and wrong prose placeholders corrected; no row changes. Mechanical: headline 0.0008134 → 0.000246 (−70%), 13 rows changed, against 7c76c006.
