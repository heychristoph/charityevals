# Audit: salvation-army-charityevals-international, round 2 (verification of the overhead explainer and the shared-fact move)
Result: 2.455e-4 daly/$ = 0.2455 years of healthy life per 1,000 dollars (combined range 0.0379-1.589); cause median 0.1001 (x2.45). Verdict: pass.
Model-sha: f13b97fc8c4411593e1d361dbbb7997aa77b0c2b414388fc7d4db09e6c45f0f2
Rules: 0.3.9
Scope: verification of the changes in 646c0f7e only; not a full re-audit. Changed: the overhead_ratio explainer. Also confirmed: the shared fact `@salvation_army.goods_handed_out_share` moved 0.9 to 0.85 (commit 3a3e1602, verified in the US model's audit-r3) and moves this model's result 0.2447 to 0.2455 through the overhead ratio.
Mechanical: `npx tsx scripts/audit-model.ts models/global-health/salvation-army-charityevals-international.json` lint 0 high / 0 medium / 1 low (spread, 1874x, unchanged from round 1), invariants none; `npx tsx scripts/check.ts salvation-army-charityevals-international` all models valid, 0.25; `npx tsx scripts/simulation-check.ts salvation-army-charityevals-international` stable (5% 0.343, 50% 1, 95% 2.87 x best guess). normalization-audit not run (verification round).
Previous round: audit-r1 findings 1 and 2 were lows with no fix asked; unchanged. The US audit-r3's finding 3 (the stale overhead_ratio explainer) is resolved.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No findings | overhead_ratio explainer now reads "with the thrift stores' running costs, day-care fees and the donated goods out of both totals, exactly as in the US model", which matches its formula `(total_expenses - thrift_store_costs - netted_fees - goods_handed_out) / (program_expenses - thrift_store_costs - netted_fees - goods_handed_out)` and the US model. Wording only; the formula and values are unchanged by this commit. The shared-fact move (0.85) enters only via goods_handed_out in this ratio (as audit-r3 of the US model found: 1.3254 to 1.3208), which raises the result by 0.35% to 0.2455, as the live model shows. | none | none (text) |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| @salvation_army.goods_handed_out_share | facts/salvation_army.json | read | 0.85, verified in the US model's audit-r3 (0.9 less the stores' goods, about $28M of $665.9M). |

## Drivers
Unchanged from round 1; the overhead explainer is not a driver.

Verdict: pass

Re-stamped (16 Nov 2026): Pre-audit gate cleanup: typed figures now read shared facts at the same best values (@sub_saharan_africa.*, @newborn_care.*, @education.learning_gain_sd_median_rct_lmic, @education.years_primary_programme_to_work, @relief_development.*); where a copy's range differed it takes the fact's (livelihood years 1-4, years to work 6-15); explainers no longer compare with other charities' models; headline unchanged. Mechanical: headline unchanged, against 0b12c4f1.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 52be53be.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against d150f0b2.

Re-stamped (17 Nov 2026): wording: wrong prose placeholders restored to the typed text or pointed at the evaluator view, and typed results in the summary made placeholders or recomputed at the 30% mobiliser share (no value moves). Mechanical: headline unchanged, against bc9e3979.
