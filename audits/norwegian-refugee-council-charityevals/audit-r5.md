# Audit: norwegian-refugee-council-charityevals, round 5 (verification)
Result: 1.994e-4 daly/$ = 0.1994 years of healthy life per 1,000 dollars (combined range 0.0496-0.8015). Verdict: pass.
Scope: only the changes since round 4: (a) share_5_14_of_over5 reads @death_ages.crisis_share_5_14_of_over5; (b) ln_gain_per_person and csh_ln_gain_per_person take the humanitarian-relief template's form; (c) the summary's combined range text 0.05-0.81 -> 0.05-0.80.
Mechanical: audit-model 0 findings (warn: uncertainty is judgment-driven; info: inputs without ranges); check.ts "all models valid"; generated/ untouched.

Findings: none.

Checks passed:
- (a) The row's formula is the bare fact read; facts/death_ages.json crisis_share_5_14_of_over5 is a judgment 0.2 (0.1-0.4), the same value and range the row held before. The explainer names the fact and the figures.
- (b) ln_gain_per_person = years_exposed * ln(1 + value_delivered_per_person * cpi_2017_vs_2025 * ppp_factor / (baseline_consumption * years_exposed)): the template's t x ln(1 + v / (b t)) (templates/humanitarian-relief.json; family guide "Goods used up over t years"), with NRC's existing price-year factor. csh_ln_gain_per_person = years_exposed * (ukr_share * ln(1 + transfer * cpi_2024 / (ukr_consumption * t)) + (1 - ukr_share) * ln(1 + transfer * cpi_2017 * ppp / (baseline_consumption * t))): the same form per group; because the two shares sum to 1, t factors out correctly. Both explainers state the form.
- Headline: 0.2039 -> 0.1994 (-2.2%). The direction is expected: t x ln(1 + v/(b t)) is below ln(1 + v/b) for t < 1 (NRC's years_exposed 0.5 and 0.25-0.3 on its branches), and the other sources of change are the unchanged share. Consistent with "about 0.199".
- (c) Summary range text now 0.05-0.80, matching the combined range 0.0496-0.8015; no other stale figure found.

Verdict: pass
Model-sha: af567de24df16deac7458e6c2cac5aa4e58b7f577d3a78be41d38c015e25ccd8
