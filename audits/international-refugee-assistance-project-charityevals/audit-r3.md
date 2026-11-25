# Audit: international-refugee-assistance-project-charityevals, round 3 (scoped to the round-2 changes)
Result: 7.404e-5 daly/$ = 0.0740 years of healthy life per 1,000 dollars (combined range 0.0096-0.572); round 2 was 0.0707 (+4.7%).
Model-sha: 10ece96ca2d3761756786ba5e180f3e37631db494f3377f1b5ffb0ef18a9e88a
Rules: 0.3.13
Mechanical: `scripts/audit-model.ts` lint 0 findings.

| Round-2 finding | Status | Check |
|---|---|---|
| A (medium) `counterfactual_adj` undiscounted | settled | Formula is now `cf_never_share + (1 - cf_never_share) * min(1, pv_annuity_due(1, $discount_rate, years_sooner) / pv_annuity_due(1, $discount_rate, @irap.years_gain_lasts))`: numerator and denominator at the same shared rate and the same annuity-due convention as `years_gain_lasts` in the value row, so the slider moves it; ratio is dimensionless, capped at 1. Row value 0.449 (was about 0.433 undiscounted); the +4.7% result move is consistent. Explainer now says "discounted value ... over discounted value", correct, no more "overstatement". |
| C (low) label | settled | New label names both parts (moves that never would have, plus years brought forward); long but accurate. |
| D (low) `ue_legal_information` | settled | Divides by `people_reached * share_reaching_safety * cf_never_share`, matching `info_extra_moves` (moves that otherwise would not happen); explainer says so. Convention 5: one question, no double count with the speed-up credit. |
| B (medium) beneficiaries | settled | HND 0.16 + GTM 0.14 + SLV 0.10 = 0.40 = `wh_client_share`; the other six sum to 0.60 (the old weights scaled by 0.75, rounded to 0.15/0.15/0.12/0.07/0.07/0.04); total 1.00. Model and `scripts/beneficiary-countries.ts` match exactly and the note cites the 40%. Default result is unaffected (only `$home_country` changes). |

New issues: none. Only the two files in scope and the script changed; `generated/` untouched.

Verdict: pass

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against bebc953e.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.
