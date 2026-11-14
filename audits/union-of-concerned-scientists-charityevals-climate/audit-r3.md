# Audit r3: Union of Concerned Scientists (climate, transport and western states)

Scoped to the r2 findings (M1, L2-L6) and anything the fixes introduced; diff 05913b0..cdbf856.

## Checked
- Mechanical audit: headline 0.001463 years of healthy life per $1,000 = 0.005638 tCO2e/$ ($177, shown as $180/t); matches summary (0.0056, $180, 0.0015) and the write-up (0.0015, $180). check.ts: all models valid. Audit findings: 0.
- M1 settled: the cap-and-invest counterfactual fact now asks only whether the covered emissions would have fallen anyway (other state rules, 2045 target); whether the extension would have passed is left to the shared advocacy share, and the explainer says so. Value 0.65 (0.35-0.88); no double count with the advocacy share.
- L2 settled: delivered share cites CARB's 29 May 2026 adoption (in force 1 Sep 2026, reserve guardrails, July 2028 review, pending suit), 0.65 (0.35-0.85); the write-up's range reads 5% to 65%.
- L3 settled: page p. 6 in the facts and in capinv_first_year / capinv_last_year; the smoke explainer divides by 963 Mt (953 + 10) and the 1.1 per 100,000 t figure is unchanged.
- L4 settled: accii_, veh_, pwr_ each have <w>_win_year (observed, sourced), <w>_years_until_avoided = first_year - win_year (4, 3, 4 years) and <w>_discounted_years = years_pv * (1+r)^-wait; the three downstream rows use them; the shared wait's explainer says it is for the act only. EDF's model carries the same shared-wait explainer and was verified separately.
- L5 settled: name and source.title say western states; the next-dollar fact label and explainer match and point to the food fact.
- L6 settled: summary says about half of the healthy years (three-fifths of the tonnes) from the act, consistent with r2's scratch test (53% of years, 62% of tonnes); write-up says 'About half' and the intro of results matches. Food paragraph and table edits are in the food model's scope.

## Findings
None new. No high or medium issues; no low issues introduced.

**Verdict: PASS**

Model-sha: b123586ef255179416f1052717ab0bee17d29bfeb77ea35210243ff20e76681e
