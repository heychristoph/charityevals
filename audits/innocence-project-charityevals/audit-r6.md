# Audit round 6: innocence-project-charityevals (verification of the round-5 fixes and the kind change)

Scope: the three changes since round 5: top-level `kind` "template" -> "charity" (the model now ranks), the label of comp_years_until_paid, and the pol_int_pop_share explainer. No row values or formulas changed. Result 0.0006 years of healthy life per $1,000 (unchanged), far below the global-health median (0.0667), as the summary says.

Mechanical pass as a ranked charity model: `audit-model.ts` shows two standing LOW notes only (far-below, spread), both covered by the summary; `check.ts innocence-project-charityevals` prints "all models valid"; `npx vitest run src/engine/ranking.test.ts` passes (15 of 15).

## Findings

1. [OK] kind: the field now reads "charity", as for a charity model of the site (the template copy was the error). Nothing else in the file read it as a template; the peers table in audit-model lists the model beside the other charity models and runs clean.
2. [OK] comp_years_until_paid (round-5 finding 4): the label is now "Years until compensation is paid", matching the explainer, which covers both clocks (exoneration for own clients, passage for the laws' newly eligible exonerees). Value unchanged.
3. [OK] pol_int_pop_share (round-5 finding 3): the unsupported clause about the Innocence Project's campaign is gone; the explainer now states only the NPR claim (ten states since Illinois in 2021) and the population share as our reading (25%, 15% to 40%). The source is cited for what it says.
4. [LOW] far-below and spread notes remain by design; the summary gives the reasons. No action.

Previous round: both lows resolved.

Verdict: pass (no high, no medium; the two standing low notes only)
Model-sha: 57577f61558b1cd78b058374661c21dc4f8a2f8d1b18a80748451217b97e927d
Rules: 0.3.13

Re-stamped (15 Nov 2026): one consumption scale for US public money (normalization.md 2.14); 0.000601 → 0.000489.
Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): side-effect tags (2.16, mechanical; headline unchanged)
Re-stamped (15 Nov 2026): side-effect tags (2.16, mechanical; headline unchanged)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against b10cf49b.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 2 rows changed, against cc9a04dd.
