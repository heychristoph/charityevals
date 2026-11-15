# Audit: doctors-without-borders-charityevals-advocacy, round 6 (verification round: only the change of commit 10728797)
Result: 1.281e-4 uov/$ = 0.0640 years of healthy life per 1,000 dollars, unchanged from round 5. Verdict: pass.
Model-sha: 6b32cfc4a45a888ba7f86c72b4dde05ce0498f05c665b20cee99818b2f2ace43
Verdict: pass
Scope: verification round. Checked only that the commit's one change (the `acc_innovation_harm` explainer) fixes the round-5 low finding and that the result is unchanged. Nothing else was rechecked; all other rows were verified in earlier rounds and the diff touches no other model row.
Mechanical: `audit-model.ts` runs clean (0 findings), result 1.281e-4 uov/$ (0.0640), same as round 5. The diff changes only explainer text; no value, range or weight moved.

Previous round: finding 1 (unsourced "a small part of the makers' sales") resolved by the second fix offered in round 5: the explainer now reads "by our reading a small part of the makers' sales (they don't publish the split)", so the claim is marked as our judgment and the missing figure is stated. The row stays a ranged judgment (0.9 to 1, best 0.98); the Ultra 2017 and XDR 2021 launch claims are unchanged.

## Findings (0)

## Sources checked
None new; the change adds no sourced figure.

## Drivers
Unchanged from round 5.
