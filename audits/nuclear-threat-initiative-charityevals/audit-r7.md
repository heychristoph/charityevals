# Audit: nuclear-threat-initiative-charityevals, round 7 (verification)

Result: 0.02105 daly/$ = 21.05 years of healthy life per $1,000 (combined range 1.081 – 410.0); cause median 0.4401 over the four catastrophic-risk models (×47.84). Verdict: **pass**.
Model-sha: 76cffa39b35741373c4f512b8d4dcbeda247edb59753b034fae3f05d5f238199

Scope: verification round, only the change since round 6: pandemic deaths valued by age. A COVID-scale pandemic (the smaller size, `bio_covid_scale_share` of the pandemic deaths averted, field-building pointed at bio included) takes COVID's age mix (`@death_ages.covid_scale_*` through `covid_value_per_death`); catastrophes that kill a share of the world and extinction take the world's age split. New rows: `bio_covid_scale_share`, `covid_scale_deaths_averted`, `covid_value_per_death`; `uov_bridged` changed. Result 21.23 to 21.05.

Mechanical: audit-model: no high or medium finding; the same four low "estimate with no range" items on the smaller-size inputs and two unused-input lows (`pol_cost_share`, `fb_cost_share`), as before. normalization-audit: no violation for this model in any invariant (INV-15 included, 0 violations); generated/ restored with `git checkout -- generated`. simulation-check: stable (5% 0.123, 50% 1, 95% 8.97 x best guess; the one single event misses 0% of draws).

Previous round: round 6 had no findings.

Checks:
- Template: the model's `bio_covid_scale_share`, `covid_value_per_death`, `uov_bridged` and `bio_deaths_per_million` formulas equal the template's. `covid_scale_deaths_averted` differs by design: the model adds `fb_deaths_averted * bio_covid_scale_share`, because its `fb_deaths_per_million` is pointed at `bio_deaths_per_million`, so the field-building branch has the same size mix. Correct (it is 0 for NTI in 2025, `fb_people` 0, but the reference chain is right).
- No double counting: `uov_bridged = ((deaths_averted - covid_scale_deaths_averted) * value_per_death + covid_scale_deaths_averted * covid_value_per_death) * (1 + nondeath_losses_vs_deaths)`. The covid part is subtracted from the world-mix part and added at its own value, so each death is valued once; `deaths_averted` itself is unchanged and still the sum of the branches.
- Share: `bio_covid_scale_share = cut_catastrophe * bio_smaller_per_year * bio_smaller_deaths / bio_deaths_per_million`, the cut-weighted smaller-size term of `bio_deaths_per_million` (extinction cut x extinction deaths + catastrophe cut x (catastrophe + smaller terms)) over the whole. The numerator is exactly the smaller term of the denominator, so the share lies in [0,1]. Only bio gets the COVID mix; nuclear and AI smaller sizes keep the world's age split, as the rule says.
- Shared facts read: `covid_value_per_death` reads `@death_ages.covid_scale_share_under5`, `_5_14_of_over5`, `_15_49_of_over15` (facts/death_ages.json: 0.02, 0.01, 0.15; judgments with ranges and anchors, WHO excess-mortality age profile) and the shared `@moral_weights.uov_per_death_*` bands times `$life_value_multiplier`; no typed age figure in the model. The facts are judgments with an anchor, correctly not observed.
- Effect: the result moved 21.23 to 21.05 (-0.8%), as expected: the COVID-scale term is a small part of the pandemic deaths and COVID's mix is older than the world's, so the value per death falls slightly. Direction and size are plausible.

Findings: none.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| (none) | | | No source input changed; the new facts are judgments anchored in the cited WHO / Msemburi et al. profile and were not re-fetched in this scoped round. |

## Drivers
Unchanged from round 6: the nuclear and bio extinction and catastrophe cuts per million (Rethink's placeholders, estimate), the years a cut counts and the discount rate (judgment). The new COVID age mix is a minor input (moves the result under 1%).

Verdict: pass. Findings: 0 high, 0 medium, 0 low.
Model-sha: 76cffa39b35741373c4f512b8d4dcbeda247edb59753b034fae3f05d5f238199
