# Audit: campaign-for-tobacco-free-kids-charityevals, round 6 (verification of the compliance-cost rule 2.21)
Result: 1.350e-4 daly/$ = 0.1350 years of healthy life per $1,000 (combined range 0.009623–1.893); cause median 0.0682 (×1.98). Verdict: pass.
Model-sha: 2565e9f5385abc6b74554963e213a96c5c63e24e11fa2bd731d63a4e87745128
Scope: scoped verification of the changed row (one sentence appended to `us_share_burden_averted`'s explainer); headline unchanged.
Mechanical: `audit-model.ts` exit 0, no lint finding; invariants none.
Previous round: not applicable (verification of one changed row).

Verdict: pass

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | us_share_burden_averted | The sentence says "wins in all three branches" but sits on the US shared figure, which only the US branch reads; the priority-country branch (72% of the result) and the Global Health Advocacy Incubator branch (food, injury, health-system wins) have no line. Their wins include plain packaging, graphic warnings and flavour rules, which in some countries had regulatory impact analyses with industry costs. Rule 2.21 asks for one line on each branch's explainer. | Diff touches only this row; `glob_share_burden_averted`, `ghai_share_burden_averted` unchanged. | Limit this sentence to the US wins ("a typical year's US wins are mostly taxes ... and local sales rules no regulator's analysis covers"), and add a line to `glob_share_burden_averted` (taxes mostly; where a country's own impact analysis costs a rule, none is used) and `ghai_share_burden_averted` (food labelling, speed limits: no analysis used). | none on the headline (no cost counted either way) |
| 2 | low | presentation | us_share_burden_averted | "sales rules no impact analysis covers" is absolute; the FDA's menthol rule had one but is a withdrawn setback, not a win, and Tobacco 21 is a statute. Fine as stated for the counted wins if "of the year's counted wins" is added. | | Add "of the year's wins". | none |
| 3 | low | presentation | summary | "above the median of the site's global-health models" compares with peers (owner rule). Not a changed row. | Summary text. | Delete the clause. | none |

Tax rises being transfers (excluded by 2.21) is consistent with the rule. No formula changed.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| (sentence) | none needed | | No regulator cost figure is used by the model. |

## Drivers
Unchanged: share of burden averted by a year's wins (judgment), CTFK's credit, shares of branches, health-lag discount, missing-data discount.
