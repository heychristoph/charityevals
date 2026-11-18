# Audit: american-red-cross-charityevals-biomedical, round 4
Result: 3.621e-5 uov/$ = 0.0181 years of healthy life per 1,000 dollars (combined range 0.0027–0.121); cause median 0.1085 (×0.167). Verdict: pass.
Model-sha: 0df293db62500d920077869db21422ce157a87685053aaf39a9a7f3e2c7704cc
Rules: 0.3.2
Scope: scoped to the changes since round 3 (`git diff a0d083b9 b76ba3ed`): `bld_rbc_revenue_share` (0.6 → 0.55, range 0.5–0.7 → 0.45–0.7, explainer) and the write-up's headline 0.018, plus whether the summary's "about a third of the resources" and "about 3% of the raw outcome" still hold. Everything else is as in round 3 and not rechecked.
Mechanical: lint 0 high / 0 medium / 1 low (the spread, which the summary states). Invariants: none. check.ts: all valid. Simulation stable: 5% 0.22×, 50% 1×, 95% 4.07× the best guess. Nothing written to generated/.
Previous round: round-3 lows #1 and #3 (unsourced anchors) were left as stated judgments, which is acceptable: they are ranged judgment rows that name their anchors. No high or medium finding was open.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | sensitivity | `bld_rbc_revenue_share` | The best 0.55 is the national share by a stated judgment about relative prices (platelets a few times a red-cell unit, plasma well under one); no price list is cited. The explainer's "may hold more platelets" is a hedge, not a number, and the high end 0.7 is kept; the range covers it. | Row explainer; the `bld_donations` quote ("MORE THAN 4.6 million blood donations and 1.1 million platelet donations collected"), which gives 5.7 million donations, platelet donations 19%, verified in the model's quote. | Keep as a stated judgment. If a hospital price list or published cost split between red cells, platelets and plasma is found, set the share from it. | Not in the tornado's top 12; the change moved the result 0.0172 → 0.0181 (+5%) |

## Checks on the changed items
- **Summary, "the Red Cross's product is about a third of the resources behind each transfusion"**: `bld_attribution_share` evaluates to 0.3205. Holds.
- **Summary, "about 3% of the raw outcome"**: `total_adj` is 0.0278 (blood branch 0.0278; blood is 99.8% of the outcome). Holds.
- **Write-up**: the headline span 0.018 is live and matches 0.0181; the 15 November line's "0.008 to 0.018" matches. No comparison with other charities (no lint `comparison`).
- **Peers**: ×0.167 of the cause's median, above the tenth that would require an explanation; weight 0 in what a donation does.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `bld_rbc_revenue_share` | McDavid et al. 2025, Transfusion (NBCUS 2023), as cited | not refetched | the unit counts are unchanged from round 3; the price relation is a judgment |
| donations | annual report p. 11 (quote in `bld_donations`) | verified in the model's quote | 4.6 million blood plus 1.1 million platelet donations |

## Drivers
Unchanged: `$missing_data_discount`, `bld_death_risk_without`, `bld_rationed_value_share`, `bld_refill_years`, `bld_initial_unreplaced_share` (all judgments).

Verdict: pass

Re-stamped (16 Nov 2026): Pre-audit gate cleanup: judgments' explainers name their reference class (sourced); bystanders per arrest read from @cardiac_arrest.ohca_bystanders_per_arrest and ln 2 from @givewell_shared.ln_consumption_per_doubling (same best values); some judgment ranges widened where no evidence anchors them; no peer-model comparisons in explainers. Mechanical: headline unchanged, against 14a782cd.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 768b765f.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against 32b69cd7.
