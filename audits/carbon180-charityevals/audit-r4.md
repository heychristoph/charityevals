# Audit: carbon180-charityevals, round 4 (scoped verification of the round-3 fixes)
Result: 0.0009677 tco2e/$ = 0.00012 years of healthy life per 1,000 dollars (unchanged from round 3: 0.000968 tco2e/$, 0.000119 years/$1k). Verdict: pass.
Model-sha: ac532b383bf79db0f81c1a5e860d0bb59bc69840a5c472a0d53979a2ee476c4a
Scope: only the explainer edits of commit 5464261a (git diff of the model). Nothing else re-audited.
Mechanical: check.ts gives 9.677e-4 tco2e/$ and 0.00012 years/$1k, all models valid. audit-model.ts: 0 high, 1 medium (far-below, ×0.065, supported as in rounds 2 and 3), no other finding. The diff touches only five `explainer` strings; no value, range or formula changed.
Previous round (round 3's four findings):
1. `tech_policy_share` peer comparison: **resolved**. The clause naming Clean Air Task Force's nuclear 5% is gone; the Third Way 25× anchor and the list of other drivers stand.
2. `forest_tco2_per_ha_year` unverified Cook-Patton numbers: **resolved**. The explainer no longer states a figure from the paper; it says the paper maps natural regrowth, plantings are not in the map, and 3 t CO₂ (1 to 6) is a judgment from it.
3. `forest_acres_per_year` assisted regeneration: **resolved**. The explainer says the count includes assisted natural regeneration and that regrowth-anyway land is in the counterfactual row and slower regrowth in the evidence row (matches `forest_counterfactual_adj` 0.7 and `forest_evidence_adj` 0.5).
4. `land_attribution_share_shared` and `tech_attribution_share_shared`: **resolved**. The land team now reads $1.2M (a sixth of $7.1M is $1.19M); the tech explainer says Carbon180's $4.3M counts in both it and the plants' share.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|

## Sources checked
None new; the round-3 fixes removed an unverified citation figure rather than adding one.
