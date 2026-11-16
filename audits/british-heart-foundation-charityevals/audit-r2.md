# Audit: british-heart-foundation-charityevals, round 2 (verification of the compliance-cost rule 2.21)
Result: 1.016e-5 daly/$ = 0.01016 years of healthy life per 1,000 dollars (combined range 6.3e-4 to 0.165); cause median 0.0686 (x0.148). Verdict: pass.
Model-sha: a074dc07a01b849c97fe35affc82eaf9afaf2b8fcfe9f1629bdc6111e8c11a86
Scope: scoped verification of the changed rows (adv_compliance_uov, dalys_from_compliance, outcome_total), the fact uk_smokefree_generation_cost_per_year_gbp and compliance_cost_payer_multiple. Same rows and formula as the Cancer Research UK model (verified in its round 6).
Mechanical: audit-model exit 0, lint low only (2 unused context inputs), invariants none. normalization-audit not run (scoped).
Result before 0.01034, after 0.01016 (-1.7%).
Previous round: round 1's three low findings unchanged and out of scope.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | facts/compliance_costs.json uk_smokefree_generation_cost_per_year_gbp (source.quote) | The quote is the net benefit (18,584.7), not the cost used. The cost is on the same page: "Best Estimate 5.9 121.0 1,913.5". | IA summary sheet | Quote the Total Cost (PV) line. | none |
| 2 | low | presentation | summary, writeups/british-heart-foundation-charityevals.md | The new row isn't mentioned, and the summary compares with the site's median ("far below the site's global-health median"), against the owner rule (being removed by another agent). | summary | Drop the median comparison; optionally a clause on the Act's costs. | none |

## Checks (all fine)
- Fact: 1,913.5 x 1.035^7 / 18.392 = 132.37 million 2019 pounds a year; PV is the UK's (IA para. 149); components 2,923 million undiscounted x 0.6546 = 1,913 (see Cancer Research UK r6). Per cohort-year reasonable (if anything slightly understated; the high end of 250 million covers it).
- Formula identical to CRUK's: negative, 2019 pounds to 2024 dollars (1.2755, 1.227), / (1.2 x UK consumption per person 32,412), x $uov_per_ln_consumption, x the branch's own p_success, discounted years, counterfactual, attribution (0.4 x 0.125 = 0.05, half of CRUK's), missing data; evidence adjustment left out; BHF's health benefits gross of these costs; no double counting. About -85 DALYs on an outcome of about 4,900 matches -1.7%.
- dalys_from_compliance / $uov_per_daly accepted by lint and invariants (exit 0).
- Payer multiple 1.2 (0.8-2): harmonic mean of 0.75 at 1.0 and 0.25 at 2.5 is 1.18; reasoned, ranged, judgment.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| uk_smokefree_generation_cost_per_year_gbp | https://assets.publishing.service.gov.uk/media/65f9bd0a9316f5001164c351/tobacco-vapes-bill-impact-assessment.pdf | verified (number, unit, price year, UK scope); quote mismatch | local copy, summary page |

## Drivers
Unchanged (research branch judgments, missing-data step); the new row is under 2% of the result.

Verdict: pass
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1807d315.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.
