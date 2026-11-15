# Audit: doctors-without-borders-charityevals, round 3
Result: 0.001678 uov/$ = 0.839 years of healthy life per 1,000 dollars (combined range 0.315–2.232); the cause median was not re-read in this scoped round. Verdict: pass.
Verdict: pass
Model-sha: 8fdd425815f43f406db63c1eece115ac91abfd5b835ae8b9091af9293b12bc39
Scope: verification round only: the text fixes of commit 10728797 to round 2's findings (0 high, 1 medium, 5 low): five explainers, one label, one write-up bullet. Programmes, year, sources and the rest of the model were not re-audited.
Mechanical: audit-model: 0 findings, result 0.8390 (unchanged); no formula or value changed in the commit (diff is explainer, label and write-up text only); other scripts not re-run (nothing they test changed).
Previous round:
- 1 (medium, no reference class for supported_care_share and partner_resource_share): resolved by a defensible alternative. Round 2's own fix allowed "if none is found, say so in the explainer and keep the ranges". Both explainers now say plainly that MSF publishes no split / no cost split of MSF-supported facilities was found, that there is therefore no reference class, and give the judgment (50%, 25–80%; 30%, 15–50%) with its reasoning for the ends. This is the skill's thin-evidence treatment (wide judgment range, a plain sentence); the ranges are real (tornado 0.913–0.750 and 0.913–0.740), not arbitrary ±. I did not search for a source myself; the claim "none found" is the builder's.
- 2 (write-up bullet): resolved. New bullet: "the share of care in facilities MSF supports (25-80%: 0.91 to 0.75) and others' share of the resources there (15-50%: 0.91 to 0.74)". Tornado: supported_care_share 0.25–0.80 → 0.9130–0.7502; partner_resource_share 0.15–0.50 → 0.9130–0.7403. Numbers and ranges match. No peer comparison.
- 3 (unsourced DRC 6%): resolved, the phrase is deleted; the Bennett et al. figures remain as verified in round 2.
- 4 (unsourced Yemen 2–7% and 10%): resolved, both deleted; the explainer now says the 4–10% range is our judgment, wider than the three sites' (matches the row: 0.04 / 0.064 / 0.10; quote unchanged).
- 5 (mh_suicide_rate label): resolved, label now "of the general population (WHO African region)"; explainer unchanged and already says age-standardised.
- 6 (share_under5 explainer): resolved; "suicides averted are all adults, so they enter only the denominator" is correct against the formula (mh_suicides_averted is in deaths_averted, not in the numerator).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| sam_in_treated_cfr | https://ennonline.net/fex/54/mortalitysamniger | verified in round 2 | quote and 6.4% unchanged; only the unsourced sentence was removed |
| malaria_counterfactual_adj | https://doi.org/10.1016/S2214-109X(17)30076-1 | verified in round 2 | unchanged except the DRC phrase removed |
| mh_suicide_rate | https://www.who.int/news/item/17-06-2021-one-in-100-deaths-is-by-suicide | verified in round 2 | label only |

## Drivers
Unchanged from round 2: missing_data_discount, daly_per_child_death, malaria_attributable_fraction, sam_in_risk_untreated, internal_validity_adj (all judgments). The attribution pair remains judgment-only; a count of MoH-supported projects from the Activity Report would still improve it.
