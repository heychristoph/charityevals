# Audit: centre-for-long-term-resilience-charityevals, round 3 (verification)
Result: 0.005666 daly/$ = 5.67 years of healthy life per 1,000 dollars (combined range 0.34–95.6); cause median 5.26 (×1.08). Verdict: pass.
Model-sha: 3bed0a8f400017b201b4213e240caa54db6c6bfcf0d469de88a1fc981f0ec0d0
Scope: scoped verification of the change since round 2 (git diff 9172ae4..HEAD): bio_attribution_share 0.8 to 0.85, the figures that follow from it, and the charity record's spending. No other part re-audited. audit-model: 0 findings; check.ts: all models valid.

| Item | Check |
|---|---|
| Anchor | The Johns Hopkins Center for Health Security model's attribution_share_shared is 0.85 (0.6 to 1), as the new explainer says; the Council on Strategic Risks' bio row is 0.8 (0.6 to 1), as the explainer and the write-up table say. Range 0.6 to 1 unchanged. |
| Headline | 5.666 (was 5.383); the ratio 1.0526 matches the shift in the weighted attribution share (0.7973 to 0.8388 by hand and from the model). Summary "about 6", write-up 5.7: consistent. |
| Range | Combined 0.34–95.6: summary "0.3 to 95", write-up "about 0.3 to about 95" (95.6 would round to 96; fine as "about"). |
| Branch shares after adjustments | w_ai 18,683, w_bio 92,176, w_rm 15,362 times evidence, counterfactual and attribution: bio 92,176 × 0.85 × 0.75 × 0.85 = 49,948; AI 18,683 × 0.6375 × 0.6 × 0.8 = 5,717; risk management 15,362 × 0.4 × 0.7 × 0.75 = 3,226. Total 58,891: bio 84.8%, AI 9.7%, rm 5.5%. Summary and write-up "about 85%, a tenth, the rest" and write-up "about 5%" all hold. |
| Pandemic-cut swing | Tornado 3.19 to 30.5 for the bio extinction cut at its ends: write-up "about 3 to 30" correct. |
| Spending | 19 × £75,000 × 1.25 × 1.3175 = $2,346,797 = staff_pay = program_expenses; the charity record's spending.programme and the line dollars both 2,346,797 (the $94 gap noted in round 2 is closed). No stale 5.4, 5.38, 90 or 2,346,891 remains in the model, write-up or record. |
| Write-up "How this model was checked" | Accurate: round 1 passed with the listed fixes, a verification round passed, the 0.85 change and its Johns Hopkins basis, a second verification round (this one). |

Previous round: round 2 had no findings; nothing to resolve.

Findings: none.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against e8ecb2b3.
