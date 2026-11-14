# Audit: brennan-center-for-justice-charityevals, round 4 (verification of the round-3 fixes)
Result: 0.064 years of healthy life per 1,000 dollars (round 3: 0.078; the predicted -18% from tar_amicus_briefs 60 to 75); the global-health median is 0.069 (this model ×0.93). lint 0 findings; check.ts: all models valid. Scope: only the round-3 changes.
Model-sha: 85cf0a3fc855ca8364e54d1b3761f8343b597728d6d8ae19a046fcefa2bd1dfd

| # | Round-3 finding | Status | Check |
|---|---|---|---|
| 1 | tar_amicus_briefs a judgment below the docket count | resolved | Now an estimate 75 (45-120), source Supreme Court docket 24-1287 (about 37 merits-stage briefs for the challengers, 8-24 October 2025), lower courts named as additional and not yet counted; explainer states the count. tar_amici_share_of_litigation = 6 / 75 × 0.15 = 1.2%: summary and write-up say 1.2% and 75 briefs. |
| 2 | tar_amici_resource_share without an anchor | resolved | Explainer anchors on Supreme Court Rule 33.1(g). Checked against the rule's text (law.cornell.edu/rules/supct/rule_33): amicus merits briefs 8,000 words (the 9,000 limit applies to the United States' amici), a party's merits brief 13,000: stated correctly. The parties' record, motions and arguments at four levels are named, and the range 5-35% is reasoned. |
| 3 | tar_abroad_multiple: why 1.6 lies between 1.3 and 2.0 | resolved | Explainer gives it: 1.3 like-for-like from the same two reports, 2.0 against the model's own US gain; the US change in those reports (0.18 points) includes the Section 122 scenario against the model's 0.12. |
| 4 | Summary spread, Sources, reading rows, figures, beneficiaries | resolved | Summary: "several hundredfold" (the check shows a wider plausible range, about 5,000,000×, but that includes judgment rows without published ranges; the summary's claim is about the model's own ranges, as before). Write-up Sources list the Budget Lab March 9 and January 19, 2026 reports. people_affected_per_year and ln_gain_per_person_year explainers say Americans only, with the trading partners' gain counted in tar_abroad_multiple. Summary 0.06 and write-up headline 0.06 match 0.064; write-up says six of about 75 briefs (about 37 at the Supreme Court). Beneficiaries USA 0.45, CHN 0.55 in the model and in scripts/beneficiary-countries.ts, note identical; 55% abroad matches 1.6/2.6 of the tariff branch (0.915 × 0.615 = 0.563, after rounding with the small shifts from the other branches). |

## New issues in the changed rows
- low (tar_amici_resource_share explainer): "roughly four times the parties' words" is a ceiling (37 × 8,000 words against the parties' briefs at their limits); real amicus briefs are shorter than the limit, so the ratio is overstated, which the 35% high end absorbs. No effect on the best guess (15%); optional rewording to "up to about four times".
- low (summary): "several hundredfold" understates the plausible range the check reports (5,000,000×); it describes the model's own ranges only and is the same basis as round 3's count of about 350×. No change needed.

No high or medium problem in a changed row.

Verdict: pass
