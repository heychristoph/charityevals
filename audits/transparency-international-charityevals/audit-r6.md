# Audit round 6 (scoped verification): Transparency International

Verdict: pass
Result: 0.0770 years of healthy life per $1,000 at the defaults (was 0.0336), mobiliser share 100%.

## Scope
Credit rule 2.24, step 5: `pol_movement_share` re-judged (0.15 -> 0.35, range 0.15 to 0.6), legal-submission branch newly classed win with `enf_attribution_share_shared` (0.2 -> 0.35, range 0.15 to 0.6) and `enf_attribution_share` = shared * mobiliser_share; class of `alac_attribution_share` (delivery).

## Checked
- `pol_movement_share`: governments' reformers and officials (50 to 60% of the old denominator) are out; the remaining split (movement 15 against others 25 to 35) gives 15/(15+30) = 33%, so 35% is consistent. Others named (Global Witness, Open Ownership, ONE, FACT, OCCRP) are co-advocates and stay in. `pol_counterfactual_adj` is 1 (years counted do the work), so governments are not cut twice.
- `enf_attribution_share_shared`: denominator is the civil-society side (11 chapters, four external partners; the quote is in the model's sources). Prosecutors, courts and governments are out. `enf_counterfactual_adj` (prosecutors acting on their own, 50%) is a different cut (cause, not credit), so no double cut. Anchor `pol_tis_share` (40%, a little lower for the partners) gives 35%.
- Classes: legal submissions are a law-, court- or prosecution-carried result, so win is right; `enf_attribution_share` reads `mobiliser_share`. `alac_attribution_share` stays delivery: the centres' advice is the chapters' and Secretariat's own service; its denominator holds co-deliverers and funders only, and reads no `mobiliser_share`. Correct.
- Text rules: no peer comparison, no effective altruism; explainers short.
- `scripts/check.ts`: all models valid. `scripts/headlines.ts`: 0.0770.

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | enf_attribution_share_shared | The explainer names the row id `pol_tis_share` in prose; readers see labels, not ids. | Write "the Secretariat's share of the movement's resources (about 40% by budgets)". |
| 2 | low | pol_movement_share | The anchor (15 against 25 to 35 parts) carries over the old judged split, not new data; it is stated as a judgment on the named coalitions, which is acceptable. | None required. |

Verdict: pass
Model-sha: 35261d5e07d7e6ceaad33af5a2139d3cb56d93a19838cc74952027561571de05
Rules: 0.3.13

Re-stamped (17 Nov 2026): the round's low findings fixed in wording (and, for the rainforest model, rows no longer read removed and the branch weights kept free of the mobiliser's share); no value changed at a 100% mobiliser share.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
