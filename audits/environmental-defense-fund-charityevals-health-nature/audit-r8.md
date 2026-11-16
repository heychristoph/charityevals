# Audit: environmental-defense-fund-charityevals-health-nature, round 8 (verification of the compliance-cost rule 2.21, text fixes of round 7)
Result: 1.221e-6 daly/$ = 0.001221 years of healthy life per 1,000 dollars (unchanged from round 7). Verdict: pass.
Verdict: pass
Model-sha: 5080adea9794411a7472c66e37b0cced1237d3781421f65a97a5753e2d595a56

Scope: scoped verification of the `summary` sentence on shares (over half from the soot standard, most of the rest from the lead-pipe rule). No formula changed.

Mechanical: `audit-model.ts` exit 0, 0 findings. normalization-audit, simulation-check not run (caller runs them).

Previous round: round 7 had no open findings.

No findings.

Checks:
- Net shares recomputed from the rows (1.3 = 1 + unmodelled_benefits_adj cancels in the shares; 2 uov per DALY): soot standard = (70,508.7 x 0.0225 - 340.6/1.3)/2 + 7,449.5 x 0.0225 = 662 + 168 = 830 DALYs; lead-pipe rule = (66,132.2 x 0.03564 - 1,719.8/1.3)/2 + 2,840.8 x 0.03564 = 517 + 101 = 618; fisheries 15; farm climate 6; total 1,469 (dalys_direct 268.9 + dalys_from_uov 1,194.4 + dalys_from_tco2e 5.6). Soot 56.5% ("over half"); lead-pipe 42% of the total, 97% of the rest ("most of the rest"). Before costs the lead-pipe rule would have been the larger, so "after the two rules' compliance costs" must stay attached to the claim, and it does.
- Headline 0.0012 matches 0.001221.

## Sources checked
None in scope (no regulator figure read by the changed text).

## Drivers
Unchanged: text-only fixes.

Verdict: pass
Model-sha: 5080adea9794411a7472c66e37b0cced1237d3781421f65a97a5753e2d595a56
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.
Re-stamped (15 Nov 2026): side-effect tags (2.16, mechanical; headline unchanged)
Re-stamped (15 Nov 2026): damage beyond deaths at EPA's 0.6 in the tco2e bridge copy, read through the side-effects weight (2.5, 2.16; mechanical); summary figure updated where it changed

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1a9667aa.
