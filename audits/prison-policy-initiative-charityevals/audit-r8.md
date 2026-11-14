# Audit: prison-policy-initiative-charityevals, round 8 (scoped verification)
Result: 6.312e-5 daly/$ = 0.0631 years of healthy life per 1,000 dollars (combined range 0.0058–0.691); cause median 0.0682 (×0.93). Verdict: pass.
Model-sha: 0c84a32cb43a89a8d611736968546b253993ebfc9ef98ba4d1f1db140d0df834
Scope: scoped to the change since round 7: ue_dec_family now reads @incarceration.family_share_of_incarceration_value, new side-effect row ue_dec_earnings reads @incarceration.earnings_share_of_incarceration_value, both added into the decarceration branch's factors; write-up wording. Nothing else re-audited.
Mechanical: lint 0/0/0 (audit-model: Findings (0)), invariants none, normalization-audit not re-run (no structural change), result 0.0600 to 0.0631 (+5.2%).
Previous round: round 7 had no findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Checks asked for
1. **ue_dec_family.** Same values as before (0, 0.15, 0.4), now a shared fact with the Wakefield and Wildeman (2013) source and a judgment tag; the row keeps `side_effect: "added"` and a formula-only definition. Brennan (jus_ue_family) and Innocence read the same fact, so the three prison models agree. No result change from this row.
2. **ue_dec_earnings.** Reads @incarceration.earnings_share_of_incarceration_value (0.10, 0 to 0.30, judgment, source Western 2002, ASR 67(4)). Tagged `side_effect: "added"`, formula only. It is a share of the branch like ue_dec_family and ue_dec_crime, so the three add in the same (1 + ...) factor.
3. **Formulas.** Both uses of the factor are updated: the deaths bridge (dec_death_value_per_year * dec_total_adj * (1 + family + earnings + crime)) and the wellbeing total (dec_wellbys * (1 + ...)). No other row reads ue_dec_family or ue_dec_crime without the new term (grep: only these two). The ger and released terms correctly stay outside the factor.
4. **Double counting.** Earnings after release are outside the life-satisfaction gap (measured during the year inside, so it does not hold post-release income) and outside the deaths term (years of life lost). The write-up's old "earnings after release aren't counted" sentence is removed and the new one says the 10% covers it. Family harm (partners' and children's income, contact) is a separate group from the released person's own earnings. No overlap found.
5. **Result move.** +10 percentage points on the branch factor applied to decarceration, which is roughly half the result, gives +5%, matching 0.0600 to 0.0631. Within the cause median band (×0.93). Simulation unchanged in kind.
6. **Write-up.** States three side effects (families +15%, earnings +10%, crime -10%), names the shared facts, and drops the stale sentence. Consistent with the model.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| @incarceration.family_share_of_incarceration_value | https://global.oup.com/academic/product/children-of-the-prison-boom-9780199989225 | reachable (HTTP 202) | book page; the share is stated as our judgment, source only supports direction |
| @incarceration.earnings_share_of_incarceration_value | https://doi.org/10.2307/3088944 | not fetchable (bot challenge) | known paper (Western 2002, ASR 67(4): 526-546, prison lowers wages and wage growth); the 10% is stated as our judgment; could not read the page here |

## Drivers
Unchanged from round 7. The new row adds a small judgment (0 to 30%) with a modest effect on the range.
