# Audit: cool-earth-charityevals, round 4 (verification of the round-3 fix)
Result: 1.099e-4 daly/$ = 0.110 years of healthy life per 1,000 dollars (unchanged). Verdict: pass (no findings).
Model-sha: d40d6d99c5d9198272634e014f02536867cec58b5b808f56aeb27d358a4f6422
Rules: 0.2.1
Mechanical: `scripts/audit-model.ts` reports 0 findings.

## Findings (0)

None. Round 3's low finding (unsourced "Peru's national 1.6%") is resolved.

## Checks of the change
1. The diff b68a397~1..b68a397 touches only the `liv_mortality_ratio` explainer text. The value 0.12 and the range 0.04-0.25 are unchanged, so the result is the same as in round 3 (1.099e-4 daly/$).
2. The explainer now says the partners' about 3% under-five mortality is "our judgment": Peru's Amazonian Indigenous peoples well above Peru's national rate, Papua New Guinea's rural villages near Kenya's. No numeric claim is left unsourced. The anchor (GiveDirectly model, 0.25 at Kenya's about 5%) and the low end (`@givewell_common.child_mortality_effects`, +4%) are as checked in round 3.
3. The text is consistent with the row's kind ("judgment") and with the 0.25 x 3/5 derivation from round 2.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): damage beyond deaths at EPA's 0.6 in the tco2e bridge copy, read through the side-effects weight (2.5, 2.16; mechanical); summary figure updated where it changed

Re-stamped (16 Nov 2026): Local market spillover reads the new shared fact cash.local_market_spillover_share (same value and range). Mechanical: headline unchanged, against 1a9667aa.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 8904b83b.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7224423b.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.
