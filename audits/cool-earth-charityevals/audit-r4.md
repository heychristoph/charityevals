# Audit: cool-earth-charityevals, round 4 (verification of the round-3 fix)
Result: 1.099e-4 daly/$ = 0.110 years of healthy life per 1,000 dollars (unchanged). Verdict: pass (no findings).
Model-sha: 8e7476a7a18b46f0986b285647e2c1090e8c7150f68bab225253d6601c2b322c
Mechanical: `scripts/audit-model.ts` reports 0 findings.

## Findings (0)

None. Round 3's low finding (unsourced "Peru's national 1.6%") is resolved.

## Checks of the change
1. The diff b68a397~1..b68a397 touches only the `liv_mortality_ratio` explainer text. The value 0.12 and the range 0.04-0.25 are unchanged, so the result is the same as in round 3 (1.099e-4 daly/$).
2. The explainer now says the partners' about 3% under-five mortality is "our judgment": Peru's Amazonian Indigenous peoples well above Peru's national rate, Papua New Guinea's rural villages near Kenya's. No numeric claim is left unsourced. The anchor (GiveDirectly model, 0.25 at Kenya's about 5%) and the low end (`@givewell_common.child_mortality_effects`, +4%) are as checked in round 3.
3. The text is consistent with the row's kind ("judgment") and with the 0.25 x 3/5 derivation from round 2.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
