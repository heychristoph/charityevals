# Audit: brennan-center-for-justice-charityevals, round 12 (scoped: jus_ue_families, jus_ue_earnings and the two shared facts)

Result: 0.07019 years of healthy life per $1,000 (7.019e-5 DALYs per dollar), up 0.1% from round 11 (0.0701159) (combined range 0.006484-0.7599); cause median 0.06519 (x1.08). Verdict: pass.
Model-sha: ef3caa00c3c70c86947809764971a91b01cd811b34fe389baf641853a563e2cc
Rules: 0.2.0
Scope: scoped verification round, not a re-audit; only the two rows changed on this branch and the two facts they read.
Mechanical: audit-model findings (0).
Previous round: no open findings from round 11.

## Changed rows, checked
- jus_ue_families now has `formula: @incarceration.family_share_of_incarceration_value` (15%, 0-40%) and no typed value/kind; it keeps `side_effect: "added"`, so the side-effect slider still moves it. Explainer names the shared share and its source (Wakefield and Wildeman 2013) and gives the right numbers (15%, 0-40%).
- jus_ue_earnings now has `formula: @incarceration.earnings_share_of_incarceration_value` (10%, 0-30%, the same values as the old typed judgment) and keeps `side_effect: "added"`. Explainer names Western 2002 and the right numbers.
- Both feed jus_ue_adj (jus_ue_families + jus_ue_earnings + jus_ue_crime + jus_ue_rollback) as before; no other row changed in the model apart from the reformatting of `beneficiaries` (same values, 0.52 USA / 0.48 CHN).

## Facts, checked
- family_share_of_incarceration_value: kind judgment, percent, 0 / 0.15 / 0.40, source Wakefield and Wildeman (2013) with a note saying the share itself is our judgment (no study puts it on the same scale). Fits a judgment with a reference class.
- earnings_share_of_incarceration_value: kind judgment, percent, 0 / 0.10 / 0.30, source Western (2002), ASR 67(4), note says the share is our judgment. Value equals the old model value.
- Both are read the same way by the Prison Policy Initiative and Innocence Project models (grep: three models read each), so the three US prison models now share one figure for each.

## Checks of the rest
- Effect on result: only the families share moved (10% to 15%), raising the headline by 0.1% (0.0701159 to 0.07019); no finding hinges on it.
- Write-up writeups/brennan-center-for-justice-charityevals.md names families and earnings only as "shares of each branch's value" with no numbers; nothing to change.
- Round 11's checks (side-effect tags on the reform branch, explainers) are untouched by this diff.

## Sources checked
Both sources are cited as books/papers backing the direction of the effect; the shares are labelled judgments, so no number is claimed from them. Not re-fetched in this round.

## Drivers
Not re-assessed (the two rows are not among the top-12 tornado inputs).

Verdict: pass

Re-stamped: explainer of dem_counterfactual_adj names the existing row (dem_field_cut, not a removed dem_decisive_share); text only.
Re-stamped (15 Nov 2026): wording only (no effective-altruism mentions; listing-risk trims); no number changed
Re-stamped (15 Nov 2026): side-effect tags (2.16, mechanical; headline unchanged)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against b10cf49b.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 5 rows changed, against cc9a04dd.
