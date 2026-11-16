# Audit: terrapraxis-charityevals, round 7 (scoped verification of rule 2.23 and the 15 Nov fix-ups)
Result: 0.01493 years of healthy life per $1,000 (was 0.0219 after the non-death change); cause median 0.001421 (x10.5). Verdict: pass (no high or medium except the explained far-above; two lows).
Model-sha: 12134ffd7f2f23377f62e00d71b0f34452db39b22169cbff068baa79221427da
Scope: commit 7e73f6cd on this model and its write-up: (1) the tripling pathway read at the middle of the years counted (pathway_first_year, pathway_last_year, pathway_middle_year, pathway_counted_share and the four rows that multiply by it), (2) rate_position clamped to 3%-7%, (3) unmodelled_benefits_adj tagged side_effect: added, and the bridge's `1 + $side_effect_weight × ratio`. Rule 2.23 (public money) has no branch here. Row values dumped from the live model (temporary script, deleted).
Mechanical: audit-model: 0 high, 1 medium (far-above, below), 3 low (the reading-only summary rows, already labelled). check.ts: all models valid. Receipt above.

## Checks
- Pathway year: period 2022-2024 middle 2023 + wait 15 + half of 5 years = 2040.5; share (2040.5 - 2020) / 30 = 0.683, inside the min/max clamp. The same wait and years as `wait_discount`, `years_pv` and `discounted_years`, so tonnes and money read one year. Summary "about 2040" is right.
- Applied once to each of rep_downstream, nuc_downstream, rep_siting_savings_uov and extra_power_cost_uov (the siting saving and extras use the same chance, wait and adjustments as the tonnes). The result moved by the share: 0.0219 x 0.683 = 0.0150, the model gives 0.01493 (the remainder is the 5% other work and the money's share of the bridge). No double application: money_uov_per_year and tco2e_from_uov take the scaled money, outcome_total takes the scaled tonnes.
- The min() in rep_gw_repowered (27.4 GW against a 1,740 GW site cap) is on 2050 capacity and does not bind at the defaults; scaling after it takes the same fraction of the capped build, which is the right order (the cap is a 2050 ceiling, the share the reading year). nuc_gw_not_coal = built less repowered stays consistent, as both are scaled by the same share.
- INV-2b: no conversion row reads the share or a shared assumption. coal_share_of_displaced_tonnes, methane_share, extra_deaths_per_tco2e and the smoke factors are local judgments; air_pollution_weight reads none of the capacity rows. The invariants in audit-model pass.
- rate_position: `min(1, max(0, (rate - 3%) / (7% - 3%)))`, the explainer says the study gives no costs outside 3-7%. Right; no change at the 4% default.
- unmodelled_benefits_adj: sits in `(1 + unmodelled_benefits_adj)` on the net value, the "added" form; slider 0 removes it, 100% keeps it.
- Bridge: tco2e_from_uov's inner expression is identical to the unit's `to_common` in assumptions/default.json (`1 + $side_effect_weight × @climate.nondeath_damages_vs_deaths`, once, on the heat part); the 0.6 fact is in facts/climate.json.
- Summary and write-up: headline 0.015 matches 0.0149; tonnes about three tenths and money about seven tenths hold (money 54k of 78k tco2e-equivalents, 69%); no comparison with other charities.

## Findings
| # | Severity | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|
| 1 | low | write-up "How the model works" | The method section does not mention the new step: it says the pledge is tripled by 2050 and "of which we judge 35% gets built", then lists the steps, but the result is now the pathway read at about 2040 (68% of that build), a cut of about a third. The summary says it; the write-up's description of the number does not. | writeups/terrapraxis-charityevals.md lines 21-30 | Add to the first sentence: "read at about 2040, the middle of the years counted". | none |
| 2 | low | pathway_counted_share explainer | "the smoke weights read the full build, since they read no shared value": no smoke weight reads the capacity rows at all (coal_share_of_displaced_tonnes and the smoke factors are fixed judgments), so the clause describes a dependency that doesn't exist. | rows coal_share_of_displaced_tonnes, fuel_smoke_factor, air_pollution_weight | Say "the conversion rows read none of the capacity rows". | none |
| 3 | medium (explained) | result | 10.5x the cause's median. The money is 69% of the value and largely construction saved on coal-site reactors (DOE 15-35%) paid for by China and India's payers under the 1/consumption rule, as in round 6; the pathway reading cut it by about a third without changing that. Not a finding against the model. | tornado; rows above | none | none |

## Sources checked
| Row | Source | Status | Note |
|---|---|---|---|
| pathway_first_year 2020, pathway_last_year 2050 | DOE, 1 Dec 2023, COP28 declaration (fetched) | verified | page has "advance a global aspirational goal of tripling nuclear energy capacity from 2020 by 2050", as quoted |
| pcge_discount_rate_low / high (3%, 7%) | IEA/NEA PCGE 2020, as in round 6 | verified earlier | unchanged |
Re-stamped (15 Nov 2026): round 7's low fixed: pathway_counted_share explainer reworded (text only)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2492e3fc.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.
