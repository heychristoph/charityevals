# Audit: brennan-center-for-justice-charityevals, round 11 (scoped: round 10's four findings)

Result: 0.0701159 years of healthy life per $1,000 (7.012e-5 DALYs per dollar), unchanged from round 10 (0.0701159; the side-effect tags change nothing at the default weight 1); cause median 0.0682 (×1.03). Verdict: pass.
Model-sha: 4a651b9e1ed4c1e875d2aaf2be6c63f586da8589b7216e3d421dafc3548a304d
Scope: scoped verification round, not a re-audit; only the four round-10 findings (side-effect tags on the reform branch, the dem_direct_share explainer, the dem_direct_in_democracy anchor, the tariff-briefs overlap disclosure).
Mechanical: audit-model findings (0), invariants none; simulation-check stable (5% 0.269, 50% 1, 95% 4.15 × best guess). Headlines: Brennan 0.0701159, Common Cause Education Fund 0.0225563 (unchanged).
Previous round: finding 1 (medium) and findings 2-4 (low) each resolved (see below).

## Round-10 findings, checked

| R10 # | Status | Check |
|---|---|---|
| 1 (medium) | resolved | ref_ue_democratic_goods (`@democracy.electoral_reform_democratic_goods`, +0.2) and ref_ue_backlash (`@democracy.electoral_reform_backlash`, -0.1) now carry `side_effect: "added"`, like dem_ue_backlash. src/engine/model.ts (lines 183, 216, withSideEffectWeight) collects every row with `side_effect` and weights it as $side_effect_weight × row; the check that a side effect is not computed from another passes (no engine error; audit-model clean). Run with the slider moved: at weight 1 ref_unmodelled_benefits_adj = +0.1 and the headline 0.0701159; at weight 0 ref_unmodelled_benefits_adj = 0 and the headline 0.0678496 (-3.2%, which also removes the dem branch's backlash). The reform branch now moves with the slider. |
| 2 (low) | resolved | dem_direct_share's explainer reads "about a third", matching 34.1%. |
| 3 (low) | resolved | dem_direct_in_democracy's explainer now names its anchor: the Protect Democracy model's direct work (election-official training, litigation, accountability) and Common Cause Education Fund's 35% for its whole programme, with the reason Brennan's democracy programme sits lower (mostly voting-rights and money-in-politics policy). Range 10% to 40% unchanged. |
| 4 (low) | resolved | dem_attribution_share's explainer states that the tariff briefs' dollars sit in Liberty and National Security too, that the tariff branch is valued by brief share, and that the overlap (under 0.5%) is left. |

## Checks of the rest
- Nothing else changed: the headline equals round 10's to seven digits, so no value, formula or fact moved; the diff against round 10 is the two `side_effect` tags and three explainer texts.
- Common Cause Education Fund's result is unchanged (0.0225563).

## Sources checked
No source rows changed in this round.

## Drivers
Not re-assessed (unchanged since round 10).

Verdict: pass
