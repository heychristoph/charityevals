# Audit: shelterbox-charityevals, round 3
Result: 2.125e-4 daly/$ = 0.2125 years of healthy life per 1,000 dollars (combined range 0.0473–0.955). Verdict: pass.
Model-sha: 93d5edcc3e3a09caba86cf0aa73af2abf970c1668d32f6b9c460a39a219f969e
Scope: verification round. It checks only the changes made after round 2 against round 2's findings; scope and sources are unchanged from round 2.
Mechanical: audit-model no findings (the two warns, the 3,000x spread and the judgment share, were there in round 2), invariants none, check.ts all models valid, simulation stable (5% 0.501, 50% 1, 95% 1.9 x best guess). normalization-audit and summaries not re-run (no change to rows these touch). No other file changed.

Previous round:
1. Duplicate `ln_gain_mid` row: settled. There is exactly one row per id (checked over every row). The remaining `ln_gain_mid` has the durable term, with the same form as `ln_gain_low`; the explainer says "As for the poorest settings, at the Bangladesh stand-in's consumption."
2. Afghanistan in the poorest group: settled. `w_low_income` is 0.50 (0.38-0.62). The explainer's grants match note 5 (PDF page 28): Chad 561+84, Somalia 577, Burkina Faso 327, Malawi 3 = 1,552; Syria 873, Yemen 869, Gaza 257 = 1,999; Afghanistan 421; Ukraine 7; sum 3,979 of 7,183 (55%). Cameroon 812 + Ethiopia 413 = 1,225 and Asia and Caribbean 1,979 (Myanmar 449, Philippines 340+836, Jamaica 51, Pakistan 185, Bangladesh 118). `beneficiaries` in the model and the OURS entry in scripts/beneficiary-countries.ts are identical and sum to 1.0. The poorest group is 0.6922 (SYR .1523, YEM .1516, TCD .1125, SOM .1006, AFG .0734, BFA .057, PSE .0448) and the rest 0.3078. Both are consistent with the grants within each group (Ukraine and Malawi left out) and with the result's own split: ln gain 0.2385 for the poorest, 0.1061 for the rest, 50/50 weights, so 69.2% / 30.8%. The note, summary-facing text and the write-up's "Consumption" bullet list Afghanistan with the poorest settings. The headline moved 0.2046 to 0.2125 (+3.9%), as predicted.
3. Explainers: settled. `crisis_mortality_rate` and `share_under5` say "about two thirds of the grants" (4.783m of 7.183m = 66.6% for conflict and displacement including Cameroon and Ethiopia). `cost_per_person` says "about 140 dollars ... roughly 700 dollars a family of five" (computed 138.35). `staff_cost_share` says "about 39%" (computed 0.3936). The summary says "about two thirds of its grants going to conflict and displacement". The write-up says "weighted by our judgment of where the people were (the grants, adjusted for ShelterBox's own deliveries)", and `w_low_income`'s explainer states that the people are less weighted to the poorest group than the grants.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | The summary calls the result "about 0.2 years of healthy life per 1,000 dollars", which is right (0.2125). Nothing to change; recorded only because it was checked. | Result 0.2125. | none | none |

No new mechanical finding. Round 2's three findings are settled; no high or medium finding remains.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| w_low_income (grant split) | ShelterBox Annual Report 2025, note 5 (PDF page 28, local text copy) | verified | Sums above; total 7,183 |
| cost_per_person, staff_cost_share | computed in audit-model | verified | 138.35, 0.3936 |
