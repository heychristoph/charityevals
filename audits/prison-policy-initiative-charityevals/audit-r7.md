# Audit: prison-policy-initiative-charityevals, round 7 (scoped verification)
Result: 6.002e-5 daly/$ = 0.0600 years of healthy life per 1,000 dollars (combined range 0.0056–0.642); cause median 0.0713 (×0.84). Verdict: pass.
Model-sha: 0b8c38a7b61cbe52267215d10434c1e24719ef7225744efed98871294ed1eaff
Scope: scoped to round 6's three lows (dec_evidence_adj explainer, @incarceration.remaining_life_in_prison, write-up round count). Nothing else re-audited; the result is unchanged at 0.0600194.
Mechanical: lint 0/0/0 (audit-model: Findings (0)), invariants none, normalization-audit none for this model, simulation-check stable (5% 0.286, 50% 1, 95% 4.21 times the best guess).
Previous round: round 6 low 1 resolved, low 2 resolved, low 3 resolved (details below).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Checks asked for
1. **Low 1 (resolved).** dec_evidence_adj's explainer now reads: the wellbeing gap rests on small surveys against unmatched others, and the deaths "rest on one observational cohort of New York parolees (Patterson 2013), where longer sentences went to people at higher risk anyway (the fact's low end allows for it)". It names the deaths cohort and its confounding; the value stays 0.75 (0.5 to 1) as a judgment, unchanged.
2. **Low 2 (resolved).** facts/incarceration.json remaining_life_in_prison is now `kind: judgment`, titled "charityevals' judgment, anchored on Patterson (2013)'s example: about 10 years of life lost for a man of 30 serving 5 years", with a note saying the figure (40 years, 33 to 47) is our judgment, not the paper's. The BJS claim is gone. I fetched https://pmc.ncbi.nlm.nih.gov/articles/PMC3673515/: the discussion says the findings translate to "a loss of approximately 10 years in the expected life expectancy at age 30 years" for 5 years in prison (and a 78% increase in the odds of death). The anchor is verified; the 2 years per year served matches the sibling fact.
3. **Low 3 (resolved).** The write-up now says "Six independent audit rounds were run" and describes rounds 1 to 6, ending with the deaths channel (0.029 to 0.060). Round 7 is a scoped re-check of wording and sources and does not change that account.
4. **Result unchanged.** audit-model gives 6.002e-5 daly/$ = 0.06002 years of healthy life per $1,000, matching 0.0600194. (`scripts/headlines.ts` printed no line for this model in my filter, so the figure comes from audit-model.)

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| @incarceration.remaining_life_in_prison | https://pmc.ncbi.nlm.nih.gov/articles/PMC3673515/ | verified (as the anchor) | discussion: about 10 years lost at age 30 for 5 years served; the 40 years is stated as our judgment |

## Drivers
Unchanged from round 6: win_years_counted, missing_data_discount, dec_attribution_share (all judgments), PPI's next-dollar figure (estimate), dec_people (judgment), then Patterson's years of life lost per prison-year (0.5 to 3). The most useful improvement remains a measured estimate of PPI's contribution to the people kept out, and a mortality estimate for short jail stays.
