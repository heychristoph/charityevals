# Audit: care-charityevals, round 3

Result: 3.308e-4 daly/$ = 0.331 years of healthy life per $1,000 (combined range 0.076–1.43); global-health median 0.0994 (×3.33). Verdict: pass (0 high).
Model-sha: 9a34a736e3b66d75dbe13c9c14da14f1ae7a317af9a035f21ac4874df4647a0c

Scope: unchanged (all three programme lines of the year to 30 June 2025). This round checks only the changes between 56ff9aa and 51b65f7 (model and write-up).

Mechanical: audit-model lint 0 findings, no invariant violation; normalization-audit no violation for this model (INV-2b, 2d, 9b, 10, 14, 15, 17, 18 all 0 failing; generated/ restored with `git checkout -- generated`); check.ts valid; simulation-check stable (5% 0.511, 50% 1.00, 95% 2.0 × best guess).

Previous round: audit-r2 low 1 (reading-only averages) resolved: `relief_deaths_share_unadj` = people_reached × deaths_averted_per_person × value_per_death / `relief_uov_unadjusted`, the same terms as the unadjusted bridge, so deaths and goods shares sum to 1; `evidence_adj` weights relief as share × `relief_evidence_adj` + (1 − share) × 1 (goods take no evidence step), `attribution_share_shared` as share × `relief_attribution_share` + (1 − share) × `relief_goods_attribution_share`, matching `relief_uov`'s own factors. No cycle (`relief_uov_unadjusted` does not read the new row; the averages are not read by the result). Reading only: no effect on the result. audit-r2 low 2 resolved: the source PDF read whole; printed page 20 (note 7, Endowments) says "Endowment net assets, end of year $ 33,252" (2024: 31,454); the split 22,397 permanent + 10,855 time-restricted sums to it; `endowment_net_assets` 33,252k is right. audit-r2 low 3 (also r1 low 5) resolved as the family allows: `share_under5` is now a ranged judgment 0.5 (0.4–0.6) and the over-five splits are labelled stand-ins (see finding 1).

Changes checked:
1. `ln_gain_per_person` = `years_exposed * ln(1 + value_delivered_per_person / (baseline_consumption * years_exposed))`: the site's rule for a transfer consumed over t ≤ 1 year, same form as `world-central-kitchen-charityevals` (lines 759, 947 etc.). `years_exposed` is 0.25 (0.1–0.5), ≤ 1 over its whole range, so the closed form holds. The value is delivered once (`relief_cost_per_person` × goods share), consumed over the exposure window, and not also multiplied by a yearly flow: no double counting; the deaths use the same `years_exposed` for a different quantity (deaths in the window), as before. CPI/PPP: baseline and value are both from the same stand-in survey scale as before (unchanged by this round; the WCK extra factors convert its own 2017-PPP inputs). Moves the result down about 4% (0.344 → 0.331), as the write-up says.
2. Averages: see "Previous round".
3. `share_under5`: judgment kind with `value` low/best/high and no `source`; consistent with INV-14 (no literal for a shared fact; the shared diarrhoeal split is no longer read for the under-five share, it remains in the two over-five splits, which the explainers name as stand-ins). Effect of 0.55 → 0.5 under 1% of the result (deaths are about 12% of it).
4. Write-up: headline 0.33 matches the live 0.3308; "fell about 4%" matches (−3.8%); relief paragraph states the months-of-use valuation and the 50% under five; round list adds the after-round-2 entry. The write-up's "relief is about three-fifths" still holds for the new split (relief about 61%).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | `share_under5` explainer | It says "the family guidance gives 40-60% under five", but no such range is in build-cea's references/templates.md; the humanitarian-relief template has this row as an estimate 0.30 / 0.45 / 0.60. The model's 0.4–0.6 around 0.5 is a reasonable judgment, but the stated source is not findable. | `.claude/skills/build-cea/templates/humanitarian-relief.json` share_under5; grep of templates.md. | Drop the attribution to guidance and keep the reasoning (crisis under-five death rates about twice the crude rate; diarrhoeal split 55% inside the range), or cite the template's 30-60%. | Under 1%. |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `endowment_net_assets` | care.org/…/2025-CARE-Financial-Statements.pdf note 7 (printed p. 20) | verified | "Endowment net assets, end of year $ 33,252"; 22,397 + 10,855 = 33,252 |

## Drivers
Unchanged: missing-data discount (judgment 0.1–1), `$uov_per_daly`, `livelihood_consumption_gain`, `affected_consumption_share`, `food_consumption_gain`. `years_exposed` (0.25, 0.1–0.5) moves the result 0.294–0.368 and is now a driver through the goods too; it is a ranged judgment with an anchor. At 0.331 the result is 3.3× the cause median (0.0994), below Doctors Without Borders relief (0.70) and Direct Relief (0.38), so no outlier statement is needed.

Findings by severity: high 0, medium 0, low 1.
