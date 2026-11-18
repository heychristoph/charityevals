# Verification round (scoped)

Result: -12.32 ced/$ = -0.001355 years of healthy life per $1,000 (combined range -0.0338 to -5.4e-5), the sign flipped by the compliance-cost chain (was +4.09e-5). Verdict: **pass** (0 high, 0 medium, 2 low).
Model-sha: a188299ab6b4249ddedd51b16873c080816bcb7a3a56d1b860756c625f4c91e2
Rules: 0.2.0

Scope: only the rule change applied mechanically (docs/normalization.md 2.21 and 2.22): the compliance-cost chain (ca_pop_share, def_egg_states_vs_ca, def_cost_egg_share, def_compliance_uov, compliance_uov_per_donor_dollar, ced_from_uov, ced_per_donor_dollar), def_opposition_risk_cut replacing def_p_override_with, the shared facts in facts/farm_animal_laws.json, and the summary and write-up farm sentences. audit-model.ts: 0 findings; check.ts: all models valid.

## Checks

- **Chain formula.** def_compliance_uov is identical to THL other-programmes' row except for the extra `def_state_factor`, which belongs here (the state fights multiply the animals' branch too). It takes years (def_discounted_years, wait discounted), chance (def_p_override_without * def_opposition_risk_cut), revert share, state factor, counterfactual (1), credit, missing-data step, and not def_evidence_adj. Units: dollars (2020) × CPI 2024/2020 (143.857/118.691) × `$uov_per_ln_consumption` / (payer multiple 1.2 × CE spending per person 32,723). Payer valuation as in 2.21. The egg part is scaled by def_pop_share / ca_pop_share (1.983); pork's stays California's.
- **Bridge.** `ced_from_uov = compliance_uov_per_donor_dollar / ($chicken_vs_person * $daly_per_sad * $uov_per_daly)`, with the per-donor-dollar row `def_compliance_uov / cost_total * donor_cost_share * marginal_vs_past_average`: exactly THL's form and the INV-2b bridge. ced_per_donor_dollar adds ced_from_uov. Both are in the species section.
- **Hand arithmetic (live values).** Cost scaling: 300e6 × (0.25 × 1.9828 + 0.75) × 1.21204 = 4.5294e8. Value per dollar: 1.44270 / (1.2 × 32,723) = 3.6740e-5. Chain: 0.3 × 0.3 × 0.17 × 4.2806 × 1.02 × 1 × 0.18121 × 0.5 = 6.0568e-3 (times the above) gives def_compliance_uov = -100.72, as the engine. Per donor dollar: -100.72 / 10,818,864 × 1 × 0.3 = -2.7929e-6 uov/$. Bridge: / (0.0001 × 0.0011 × 2) = -12.695 ced/$. Plus ced_chicken 0.37458 and ced_pig 0.00390 = -12.3167 ced/$. × 0.0001 × 0.0011 × 1000 = -0.0013548 years per $1,000, as `headlines.ts` prints. The animals' side alone is +4.09e-5, so the cost is about 33 times the gain at the defaults.
- **Facts.** Values match the THL models' literals as read in the ASPCA's own earlier values: population share 0.23 (0.23-0.27), sows 700,000 (400,000-900,000), revert share 0.3 (0.1-0.6), egg share 0.25 (0.05-0.5), coalition spend $8.5m (3.5-20.5m), risk cut 0.17 (0.03-0.4). The three models read them (ASPCA, THL other programmes, THL OWA grants). Explainers agree with the rows that read them.
- **Sources fetched.** NPPC testimony (Holly Cook, July 2025): "approximately 700,000 sows would be needed to meet historical demand levels in California" is there (page number not checked: the text was extracted from the PDF without page breaks). CDFA notice: "Egg producers in California face higher costs by $72 million" and "increase consumer expenditures in California of $1,195 million" are both there. Census figures (39,431,263 / 340,110,988 = 0.1159) and the ERS 23% quote were not refetched; the arithmetic checks. The National Hog Farmer 400,000 is read from search summaries by the fact's own note (the site refuses automated fetches): acknowledged, not verified here.
- **Summary and write-up.** Summary: about -0.001, "$300 million a year net of retailers' margin", $8m of $422m, about $1.5m of lobbying and outreach (def_spend 1.54m): all match. Write-up line 3 uses the live headline figure span; its farm sentences, the "how" paragraph and the drivers paragraph match the model. No comparison with other charities, medians or peers anywhere in either. The negative headline is allowed by 2.22.

## Findings

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up, last paragraph (audit history) | It says round 2 passed the farm model "whose two override chances are now drawn together". def_p_override_with is gone; the opposition's share of the risk is one shared fact. | writeups/aspca-charityevals.md line 34. | Replace with "whose override chances are now one chance and the opposition's share of the risk", and add a sentence that a verification round after round 3 moved the defence onto the compliance-cost chain (2.21) and shared facts, so the headline went below zero. | None |
| 2 | low | source | `ca_prop12_cost_egg_share` (shared fact) | The notice's same sentence set also says shell egg farm revenue rises by $7 million, so the producers' net cost is nearer $65 million than $72 million; the 0.25 is a judgment with range 0.05-0.5 and the difference (about 0.22) is well inside it. | CDFA notice, same paragraph: "Shell egg farm revenue rises by $7 million in 2022". | Add the $7 million to the fact's explainer in the next pass that opens the file (not a change in value). | About -0.2% on the headline per 0.01 of share: negligible |

## Drivers (checked this round)

The compliance cost (net figure $150m-$1.195bn, judgment on the egg share, payer multiple), the opposition's share of the risk, the revert share and the coalition spend now set the result and its sign; all are shared facts or sliders and all are either sourced or ranged judgments with their reasons.
Re-stamped (15 Nov 2026): this round's low findings fixed in explainers, write-ups and the egg-share fact's wording; no value changed.

Re-stamped (16 Nov 2026): pre-audit cleanup: shared facts read (US layers, preemption chance, market leakage, evaluator side effects), reference classes named, ranges widened where evidence is thin; headline unchanged. Mechanical: headline unchanged, against 9d3d36e4.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 1b0eb29e.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7224423b.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against 7c76c006.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: typed results in the model's text made placeholders or recomputed at the 30% mobiliser share, and wrong prose placeholders corrected; no row changes. Mechanical: headline -0.001355 → -0.0004065 (+70%), 20 rows changed, against bc9e3979.
