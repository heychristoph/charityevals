# conservation (tco2e, uov, WELLBYs, DALYs, ced → daly; unit_cost, past_average for campaigns)

Land and water protection, restoration, species and habitat work, ocean and fisheries campaigns. A
species saved or a hectare protected isn't on the site's scale; what it does for people and animals
is. Each branch the evidence supports is counted in its own unit and bridged into healthy years
(normalization.md 2.6); a branch without evidence stays at 0 with the reason.

## The chain

```
hectares_protected (new in the year) × protection_years (pv of years_protected, after years_until_avoided)
climate        × tco2e_per_hectare_year                         → tco2e_bridged → dalys_from_tco2e
health         health_people × dalys_per_person_year × years    → dalys_direct
livelihoods    livelihood_people × ln_gain_per_person_year × years × $uov_per_ln_consumption
catastrophe    catastrophe_deaths × annual_risk_reduction × years × catastrophe_value_per_death
                                                                → uov_bridged → dalys_from_uov
wellbeing      nature_people × ls_gain_per_person_year × years  → wellbys_bridged → dalys_from_wellby
wild animals   wild_animal_years × wild_pain_days_per_animal_year × years × @welfare_ranges.<s>_vs_chicken
                                                                → ced_bridged → dalys_from_ced
(sum) × total_adj × (1 + unmodelled_benefits_adj) ÷ cost_total
```

The climate branch uses the climate skeleton's rows (`years_until_avoided`, `air_pollution_weight`,
`extra_deaths_per_tco2e`, 2.5): land carbon carries no smoke, so `fuel_share` is 0, and the tonnes'
bridge applies the shared deaths per tonne, heat-death delay and value of a death.

## Shared figures it reads

- The `tco2e` conversion's rates through the bridge (`$deaths_per_tco2e`, `$climate_heat_share`,
  `$climate_heat_death_delay`, `@death_ages.heat_share_*`, `@climate.nondeath_damages_vs_deaths`).
- `@moral_weights.*` by age band × `$life_value_multiplier` for catastrophe deaths: valued like every
  death, with no premium for their number or for future generations (the site has no such slider;
  adding one is a site-wide value judgment, not a model's).
- `$uov_per_ln_consumption`, `@wellby_factors.wellbys_per_sd_year`, `@gbd_disability_weights.*`,
  `@welfare_ranges.*` (only in `ced_<s>`), `$discount_rate` on every year.

## Evidence to look for

- **Hectares**: newly protected or restored in the year (acquisitions, easements, designations won,
  restoration completed), not the estate under management; the protected-area database (WDPA) and
  downgrading records (PADDD) for how long protection lasts.
- **Counterfactual loss**: matched comparisons of protected and similar unprotected land (avoided
  deforestation studies); this is `counterfactual_adj`, and leakage (clearing moved elsewhere) is a
  negative share in `unmodelled_benefits_adj`.
- **Carbon**: remote-sensing or verified-carbon estimates for comparable sites; ocean and fisheries
  work usually has none (0).
- **Health**: water-quality, fire-smoke and malaria studies linked to land cover; spillover-risk work
  (deforestation and zoonotic emergence; Dobson et al., *Science* 2020, for an order of magnitude).
- **Livelihoods**: impact evaluations of protected areas and fisheries reserves on local incomes (can
  be negative where access is lost).
- **Wellbeing**: green and blue space and life-satisfaction studies, net of where visitors would go.
- **Wild animals**: only where the charity claims welfare effects; more animals alive is not by itself
  a gain, and the sign is often unknown (a range across 0).

## Pitfalls

- **One question per adjustment**: a hectare that would have been lost anyway is in
  `counterfactual_adj`, not also in a lower carbon figure.
- **Catastrophic risk** is usually the least grounded branch: a tiny absolute risk reduction with a
  wide range, its anchor named, and said in the summary when it dominates.
- **Campaigns** (a marine reserve won, a logging rule changed) are past averages:
  `estimate_basis: past_average`, add `marginal_vs_past_average` in the donor section, and count the
  win's years with `$win_years_counted` in `years_protected` (normalization.md 2.9).
- Never a charity's or an evaluator's own value of a hectare or a species.
