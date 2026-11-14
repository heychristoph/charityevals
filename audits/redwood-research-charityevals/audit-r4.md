# Audit round 4 (verification of commit 3da5cab): Redwood Research (charityevals)

Scope: only the changes of 3da5cab (round 3 lows L1, L2 and the figures that follow).

## High
None.

## Medium
None.

## Low
None.

## Checks of each change

- L1 (next dollar use 0.85, figure 0.40, 0.15 to 0.84): research credit per dollar 1.2 x 0.65 = 0.78; programme average 0.9647 x 0.6651 = 0.6416; ratio 1.216, "about 1.2 times" is right. Use 1.2 x 0.7 = 0.84, rounded to 0.85 (0.5 to 0.9 x 1.2 = 0.6 to 1.08, capped at 1.0, written 0.61, matching 0.5 x 1.2 x 1.0 within rounding). Figure 0.5 x 0.85 x 0.95 = 0.404, written 40%; low 0.3 x 0.61 x 0.8 = 0.146, written 0.15 (explainer 15%); high 0.8 x 1.0 x 1.05 = 0.84. The fact's source note and explainer agree with each other; the audit tornado shows @next_dollar.redwood_research at 0.15 to 0.84 moving the result 0.0205 to 0.115.
- L2: attribution_share_shared explainer "about 0.67" matches 0.6651 in audit-model.
- Summary and write-up figures against audit-model.ts / simulation-check.ts: bottom line 0.05477 (0.05); 90% range 0.0669 x 0.05477 = 0.0037 and 9.52 x 0.05477 = 0.52, so "0.004 to 0.5" is right (summary and write-up); misuse share x13.2 (x13) and tornado 0.7223 (0.72); slider tornado 0.006938 to 0.3652 (0.007 to 0.37); cut per dollar 0.01431 to 0.4594 (0.014 to 0.46). The write-up's "33% to 40%" and "40% of the past average" match the fact; no stale 38% or 1.15 remains in the model or write-up.
- check.ts: all models valid. normalization-audit.ts: no Redwood line, no violations; `git checkout -- generated` run, working tree clean apart from this file.

Verdict: pass
Model-sha: 0a4635da2f60d0f21bde796a8d636ef0d4068ac6c81adc0c48af68b30045c6cb
