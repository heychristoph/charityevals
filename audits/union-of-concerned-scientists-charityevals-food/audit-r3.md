# Audit round 3: Union of Concerned Scientists, food and farms

Scoped to the round-2 findings (2 medium, 5 low). Nothing new added.

## Checked

- **M1 counterfactual_adj 0.9.** Settled. The explainer now rests on the refiled-case risk (Food & Water Watch quote that Pacific Legal Foundation could file a new case) and the exhaustion-of-remedies basis of the ruling; who else defended the rule is left to the credit share, so no double count.
- **M2 farmed_wetland_share 0.3 (0.15 to 0.5).** Settled. Anchored on the 1997 NRI national split (about a sixth of non-federal wetlands on cropland, pasture and CRP land, most on forest) and the region's mix (higher in the prairie-pothole parts, lower in the forested north). Still a judgment, labelled so; tornado 1.3e-4 to 4.2e-4.
- **L3 drainage build-up discounted.** Settled. Closed form checked numerically: sum_{t=0}^{4} (t+1) v^t = 13.5268 equals (1 - 6v^5 + 5v^6)/(1-v)^2 = 13.5268 at 4%; divided by pv_annuity_due(1, 4%, 5) = 4.630 gives 2.92, as the explainer says. The formula in the model matches the closed form and uses the shared discount rate.
- **L4 years_until_effect 2 (1 to 3).** Settled; the explainer ties it to appeals.
- **L5 drain_rate_per_year.** Settled. Frayer et al. (1983) source with note added; the implied 0.15% a year (0.3 x 0.5%) is placed against the pre-1985 national rate.
- **L6 unmodelled sentence.** Settled; the other work vs the wetlands' other goods are now separated correctly.
- **L7 write-up.** Settled. Headline 0.0003 matches summary and the run (2.534e-4); summary range 0.000005 to 0.014 matches the combined range (4.6e-6 to 0.0141); EDF 0.0020 matches its model (0.001967); an uncertainty bullet on the 1% share and the Food & Water Watch source were added.
- **audit-model outlier note.** The summary now says "far below its peers because ..." with the reasons, which is the argument the check asks for; the check itself still prints the MEDIUM because the number is 10x below the peers, as expected and argued.
- `npx tsx scripts/check.ts union-of-concerned-scientists-charityevals-food`: all models valid.

## Findings

None open. The audit-model outlier (medium) and spread (low) lines remain by design: the outlier is argued in the summary and write-up, and the spread is stated in the summary.

**Verdict: PASS. The round-2 fixes settle all seven findings; no new issues.**

Model-sha: 6d2c0c71fbf3bf00a43228f01761a96a9e0e0acd7f9501a7ffedeab589f3e959

Re-stamped (15 Nov 2026): one consumption scale for US public money (normalization.md 2.14); 0.000253 → 0.000453.
Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
