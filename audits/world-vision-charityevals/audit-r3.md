# Audit: world-vision-charityevals, round 3

Result: 2.644e-4 daly/$ = 0.264 years of healthy life per 1,000 dollars; global-health median 0.338 (x0.78). Verdict: pass (0 high)
Model-sha: faa653674cad2ca26b6bd2b24dfadae95b7452d838ef410458b3fc2d05c83d01

Scope: unchanged. Only the changes after round 2 were checked.
Mechanical: audit-model.ts 0 findings; check.ts all models valid.
Previous round: no open high or medium findings.

Findings: none above low.
- `wash_cost_per_person` $150 (75-250): the anchor arithmetic holds. About 30% of the partnership's 2.8M people is about 0.85M; the water branch's spending over $150 gives about 0.83M people, consistent with the explainer. The range keeps the partnership-share reach inside it.
- Death-age rows (`share_under5`, `share_5_14_of_over5`, `share_15_49_of_over15`): explainers now say the diarrhoea split is a stand-in. Wording only; no value changed.
- Write-up: water $150 matches the model; the goods item and the round-2 paragraph are accurate. The domestic fallback 0.006 matches the domestic result (0.00554).
- Effect on result: the water change moved the headline from 0.269 to 0.264.
