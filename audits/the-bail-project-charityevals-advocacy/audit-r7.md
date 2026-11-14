# Audit round 7: the-bail-project-charityevals-advocacy (scoped to one row and one fact)

Scope: row ue_family_tx now reads @incarceration.family_share_of_incarceration_value (15%, 0 to 40%) instead of a typed judgment 15% (0 to 30%). `audit-model.ts` runs clean: only the two standing LOW notes (far-below median, spread), both covered by the summary.

## Findings

1. [OK] ue_family_tx: the typed value, kind and source are gone; the row is a formula reading the shared fact; side_effect "added" is kept, so the side-effect weight slider still moves it. Best value unchanged at 15%; the high end widens from 30% to 40% (a wider range only).
2. [OK] Fact family_share_of_incarceration_value: kind judgment, 0 / 15% / 40%, source Wakefield and Wildeman (2013) with a note saying the scale link is our judgment; explainer is accurate and says it is read as a side effect. The same fact is read by the Prison Policy Initiative, Brennan Center and Innocence Project models, so the family share is one figure across them.
3. [OK] No double counting with ue_family: ue_family (weeks of detention, @the_bail_project.family_spillover_share) serves the Florida/Oklahoma branch (cb_weight); ue_family_tx serves the Texas and t25 branches (tx_weight, t25_weight). unmodelled_benefits_adj weights each by its own branch, so no branch carries both.
4. [LOW] The row explainer says pretrial months bring families "most of the harm a prison term does", while the shared fact is a share of a prison-year's value (15%). Reword if the row is touched again, e.g. "the shared family share of a prison-year's value".

Verdict: pass (no high findings).
Model-sha: 2d5ea9768d0ae2c6f089a3704d58a4135058da7bc592296567aa681b3dc87e2c
