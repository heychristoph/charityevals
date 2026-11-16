# Audit: cancer-research-uk-charityevals, round 6 (verification of the compliance-cost rule 2.21)
Result: 1.531e-6 daly/$ = 0.001531 years of healthy life per 1,000 dollars (combined range 7.6e-5 to 0.0308); cause median 0.0686 (x0.022). Verdict: pass.
Model-sha: 6a552b43a3a97026004982634dc62cd38964e476f8bd54c223d271565b57afc9
Scope: scoped verification of the changed rows (adv_compliance_uov, dalys_from_compliance, outcome_total) and the fact uk_smokefree_generation_cost_per_year_gbp read by them, plus compliance_cost_payer_multiple.
Mechanical: audit-model exit 0, lint low only (3 unused context inputs, far-below, ignored per brief), invariants none. normalization-audit not run (scoped).
Result before 0.001649, after 0.001531 (-7.2%).
Previous round: round 5's two low findings unchanged and out of scope.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | facts/compliance_costs.json uk_smokefree_generation_cost_per_year_gbp (source.quote) | The quote is the net benefit (18,584.7), not the cost the row takes. The cost is on the same page (PDF p. 16): "Best Estimate 5.9 121.0 1,913.5" (Total Cost, PV). | IA summary sheet, Price Base Year 2019, PV Base Year 2020 | Quote the Total Cost (Present Value) line "Best Estimate 5.9 121.0 1,913.5" (and the 20,498.2 benefits beside it). | none |
| 2 | low | presentation | summary, writeups/cancer-research-uk-charityevals.md | Neither mentions the new row (the Act's compliance cost takes about 7% off the result, 0.00165 to 0.00153 per 1,000 dollars). The summary also compares the model with the site's median ("far below the site's global-health median"), against the owner rule; another agent is removing that. | summary text | Drop the median comparison; optionally one clause in the policy bullet, e.g. "Costs: shops' and wholesalers' lost profits, 132 million pounds a year." | none |
| 3 | low | sensitivity | adv_compliance_uov (cost per cohort-year) | The yearly equivalent (cost over 2027-2056 / 30) is set against one cohort a year over the first $win_years_counted years. Total costs in the window ramp up as cohorts accumulate and each cohort's lifetime loss of profit runs beyond 2056, so the per-cohort cost is if anything understated (at most about 2x; the fact's high end of 250 million is 1.9x). Reasonable as a best guess; the range covers it. | at 250 million a year the result would be about 0.0014 (-14% on before) | None needed; optionally say in the fact's explainer that it is a per-cohort-year equivalent. | up to -7 points at the high end |

## Checks (all fine)
- Fact arithmetic: 1,913.5 x 1.035^7 = 2,434.5; 30-year annuity at 3.5% = 18.392; 2,434.5 / 18.392 = 132.37 million 2019 pounds a year (104 if not carried to 2027; carrying is right since costs run 2027-2056). The PV is the UK's (IA para. 149: summary sheets give the UK; uplift 1.1913), the same geography as the benefits' uplift. Components: retailers 2,291 + wholesalers 506 + familiarisation 9 + ID checks 117 + signage 0.2 = 2,923 million (2027 prices, undiscounted); x 0.6546 (PV benefits 20,498 over undiscounted about 31,300) = 1,913, so the PV is consistent. Lost duty (a transfer) and manufacturers' profits (587 England / 696 UK, excluded by the IA) are left out; the high end adds the manufacturers.
- Formula: sign negative; pounds to dollars at @fx.usd_per_gbp_2019 (1.2755), 2019 to 2024 with @cpi.usa_2024 / @cpi.usa_2019 (1.227) = 207.2 million; / (1.2 x 32,412 UK consumption per person, 2024 current US$) = 5,327 ln-units a year, x $uov_per_ln_consumption. The fact's dollar year (2019) matches the conversion.
- Branch adjustments are the branch's own and the right set: adv_p_success, adv_discounted_years (the same years and wait as advocacy_dalys), counterfactual, attribution, missing data; evidence adjustment correctly left out; no side-effect weight on it. Benefits (advocacy_dalys) are health only, gross of these costs, and nothing already nets the retailers' loss: no double counting. About -171 DALYs in an outcome of about 2,215 matches the -7.2% change.
- dalys_from_compliance = adv_compliance_uov / $uov_per_daly, outside the unmodelled share, is accepted by the lint and invariants (audit-model exit 0) and moves with the healthy-year slider like the deaths' bridge.
- Payer multiple: 0.75 on consumers at 1.0 and 0.25 on owners at 2.5 gives a harmonic mean 1/(0.75 + 0.1) = 1.18, shown as 1.2; range 0.8 to 2 reasoned, below the corporate-tax multiple (2.5, 1.5-4) because bill-payers carry most. Judgment with named anchors. For small shop owners 2.5 is generous but the range covers it.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| uk_smokefree_generation_cost_per_year_gbp (1,913.5 PV, 2019 prices, base year 2020, 30 years from 1 January 2027) | https://assets.publishing.service.gov.uk/media/65f9bd0a9316f5001164c351/tobacco-vapes-bill-impact-assessment.pdf | verified (number, unit, price year); quote mismatch (finding 1) | Local copy read: summary page "Total Cost (Present Value) ... 1,913.5"; para. 149 UK figures. |
| @fx.usd_per_gbp_2019, @cpi, @united_kingdom.consumption_per_person_2024 | shared facts | read, not re-fetched | outside the changed rows |

## Drivers
Unchanged: missing_data_discount, discount_rate, share_burden_averted_per_research_year, years_brought_forward, next-dollar share (judgment or estimate). The new row is about 7% of the result; its drivers are the cost fact (sourced, range 80-250 million pounds) and the payer multiple (judgment, ranged).

Verdict: pass
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.

Re-stamped (16 Nov 2026): Preflight cleanup: judgments' explainers name their reference class (or say plainly there is none); labels and unit labels say what the rows are; no value changed. Mechanical: headline unchanged, against 1807d315.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 480880ba.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.
