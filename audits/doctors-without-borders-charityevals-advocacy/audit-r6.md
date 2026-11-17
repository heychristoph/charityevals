# Audit: doctors-without-borders-charityevals-advocacy, round 6 (verification round: only the change of commit 10728797)
Result: 1.281e-4 uov/$ = 0.0640 years of healthy life per 1,000 dollars, unchanged from round 5. Verdict: pass.
Model-sha: d6a34007b7e67a4cb72cd4ac9e9cd6095bb3b17b9a9316251877e094966eb33b
Verdict: pass
Scope: verification round. Checked only that the commit's one change (the `acc_innovation_harm` explainer) fixes the round-5 low finding and that the result is unchanged. Nothing else was rechecked; all other rows were verified in earlier rounds and the diff touches no other model row.
Mechanical: `audit-model.ts` runs clean (0 findings), result 1.281e-4 uov/$ (0.0640), same as round 5. The diff changes only explainer text; no value, range or weight moved.

Previous round: finding 1 (unsourced "a small part of the makers' sales") resolved by the second fix offered in round 5: the explainer now reads "by our reading a small part of the makers' sales (they don't publish the split)", so the claim is marked as our judgment and the missing figure is stated. The row stays a ranged judgment (0.9 to 1, best 0.98); the Ultra 2017 and XDR 2021 launch claims are unchanged.

## Findings (0)

## Sources checked
None new; the change adds no sourced figure.

## Drivers
Unchanged from round 5.

Re-stamped (16 Nov 2026): Pre-audit gate cleanup: judgments' explainers name their reference class (sourced); bystanders per arrest read from @cardiac_arrest.ohca_bystanders_per_arrest and ln 2 from @givewell_shared.ln_consumption_per_doubling (same best values); some judgment ranges widened where no evidence anchors them; no peer-model comparisons in explainers. Mechanical: headline unchanged, against 74f2c29c.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 768b765f.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against cc9a04dd.
