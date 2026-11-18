# Audit: oxygen-access-project-charityevals, round 2
Result: 0.006910 uov/$ = 3.45 years of healthy life per 1,000 dollars (combined range 0.70–17.1; the model's own ranges, shared figures at their best, −0.024–27.4); cause median 0.110 (×31). Verdict: pass.
Model-sha: 8668e0093aba5496f00b79493674816508715afdddc9e585cfab97fd29048ef7
Rules: 0.3.11
Scope: Unchanged from round 1 (oxygen care in 23 Gombe State facilities, 14 February to 31 December 2025, the whole £85,293 of the independently examined accounts). Round 2 is a scoped verification only.
Preflight: pass (no blocking lines).
Previous round:
- 1 (high, scripts/aim-theoretical.py `KEEP` to `REMOVE`): owner-reserved, out of this model's scope. The owner told the builder not to touch the file and removes `oxygen-access-project-aim` himself after merging. Not an open finding against the model.
- 2 (medium, crude ORs): resolved. `child_cfr_hypoxaemic` 0.19 (0.16–0.24), `neonatal_cfr_hypoxaemic` 0.26 (0.22–0.31), `child_mortality_reduction` 0.72 (0.40–0.90). Table 3's crude column was re-read from the source: children 9.2 (7.7–11.0), newborns 6.2 (5.2–7.3), ALRI 6.0 (4.0–8.9). I re-solved the two-group split: children about 19% against 2.5%, newborns about 26% against 5.4%, hypoxaemic ALRI deaths about 0.667 of the total, so 0.48 / 0.665 = 0.72. Explainers and quotes now cite the crude column.
- 3 (medium, `counterfactual_adj`): resolved. Re-asked as what others would have brought in 2025 beyond the studies' baseline, 0.85 (0.6–0.95); the "2 of 57" anchor is gone.
- 4 (medium, `implementation_adj`): resolved. Relative to the studies' 81.6% (694/851, Table 3): 0.7 / 0.82, 0.85 (0.5–1.0); the equipment reason now sits here.
- 5 (medium, `external_validity_adj`): resolved. 0.9 (0.6–1.0) on the diagnosis mix only (pneumonia 37% of hypoxaemic children).
- 6 (medium, survivors' remaining life): resolved. The new shared fact `severe_childhood_illness_remaining_life_ratio` is read by the new row `survivor_remaining_life_ratio` and multiplied into `value_per_death`, as normalization.md 2.14 prescribes. Source checked below.
- 7 (medium, `neonatal_share`): resolved. 0.5 (0.25–0.6) from Graham Table 3 (1,363 of 2,667).
- Lows 8–15: all applied (checked: neonatal range −0.24 to 0.35 with `interval: 0.95` and the 0.90 (0.65–1.24) citation; `baseline_mortality_rate` unit "deaths / admission"; `staff_cost_share` includes `oap_founder_visa_gbp`; `other_unmodelled_share` best +3%).

No new high or medium was introduced by the changes. The round-1 estimate (3.46) matches the model (3.455). The write-up carries the live result without comparing with other charities, medians or peers.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `@survival.severe_childhood_illness_remaining_life_ratio` | The quote supports "3%–20%" post-discharge mortality for respiratory infections. The claim in the explainer that most of these deaths come within months, after which survivors' risk is near their age group's, is not in the quote, and the 0.92 is a judgment-sized derivation from the review's range. | Nemetchek 2018, Results (PMC6318528) | Add a sentence saying the 0.92 is about one minus a typical 8% post-discharge death share, or drop the "near their age group's" claim; keep the 0.8–0.97 range. | none |
| 2 | low | normalization | docs/normalization.md 2.14 and templates.md | The "Survivors' remaining life" list names the existing conditions but not severe childhood illness (the new fact). | docs/normalization.md line 1231; templates.md line 151 | Add "severe childhood illness 0.92 (0.8–0.97; Nemetchek et al. 2018), read by the oxygen model" to 2.14, and say in the rule whether other severe-illness child models should read it. Owner or rules maintainer, not the model. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `@survival.severe_childhood_illness_remaining_life_ratio` | https://pmc.ncbi.nlm.nih.gov/articles/PMC6318528/ | verified | "those with malnutrition and respiratory infections had the highest (typically 3%–20%)" is there, with "significant heterogeneity between study populations and follow-up periods". |
| `child_cfr_hypoxaemic` | https://pmc.ncbi.nlm.nih.gov/articles/PMC6890969/ | verified | Table 3 row "Total children": 10.2%, 4.2%, crude 9.2 (7.7–11.0), adjusted 7.3 (6.0–9.0). The 19% and 2.5% follow. |
| `neonatal_cfr_hypoxaemic` | same | verified | Table 3 "Neonates <28 days": 22.2%, 9.9%, crude 6.2 (5.2–7.3). The 26% and 5.4% follow. |
| `child_mortality_reduction` (share of deaths) | same | verified | ALRI row: 28.0% hypoxaemic, 7.2% case fatality, crude 6.0 (4.0–8.9); the share is about 0.667. |
| `neonatal_share` | same | verified | 1,363 of 2,667 hypoxaemic patients (51.1%). |

## Drivers
Unchanged in kind: `$missing_data_discount` (shared slider), `internal_validity_adj` (judgment, anchored on the trial's all-child result), `neonatal_mortality_reduction` (sourced, interval stated), `daly_per_child_death` (shared) and `child_mortality_reduction` (sourced). The best remaining improvement is the charity's own data on how many recorded children got oxygen and how many died, by age, and Gombe's oximetry and oxygen coverage before April 2025. The gap to the cause's median (×31) comes from reach (each recorded child is a hypoxaemic admission at a 19–26% risk of death), as in round 1: supported, not a finding.
