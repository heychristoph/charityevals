# climate (tco2e; policy-research-meta climate skeleton, conservation, past_average or unit_cost)

Every climate programme ends in tonnes of CO₂-equivalent averted (`tco2e`). The unit's one conversion
(normalization.md 2.5) turns a tonne into heat deaths (discounted over `$climate_heat_death_delay`)
plus the air-pollution deaths its fuel carries; the model supplies the tonnes and how smoky they are.
Advocacy, litigation and research use `templates/policy-research-meta-climate.json`; forest and land
protection the `conservation` template's climate branch; direct cuts (stoves, capture plants, methane
capture) the climate skeleton with `unit_cost`.

## The chain

```
win:  tonnes_per_year (once in effect) × p_success × pv($win_years_counted) × (1+$discount_rate)^-wait
      × counterfactual × attribution (its share among co-advocates × mobiliser_share) × implementation
      × evidence_adj × missing_data_adj
(sum of the period's wins) ÷ period years ÷ (cost × average_spend_vs_year) × @next_dollar.<charity>
conversion (ours): fuel_share × fuel_smoke_factor = air_pollution_weight; extra_deaths_per_tco2e; methane_share
```

- **Policy and litigation** are past averages over several years (one year's wins are noise;
  Convention 11). Each win is a branch (Convention 4: `<win>_counterfactual_adj`, `<win>_total_adj`, …).
- **Technology acceleration** (advanced reactors, fusion, new fuels): a won policy speeds a share of a
  published deployment pathway. Tonnes = pathway capacity × output per unit × displaced emissions ×
  share built × share due to the policy; a technology that may never work adds a `single_event`
  chance. The pathway is read at the middle of the years counted (period's middle year + wait + half
  of `$win_years_counted`), straight between its published points, capped at the last; the smoke
  weights read the full level.
- **Forest protection**: families/conservation.md (land carbon carries no fuel smoke; clearing fires
  only a little).
- **Direct emissions cuts** (`unit_cost`): units installed × tonnes per unit-year, measured where it can
  be, × years of use, discounted; no win years.

## Shared figures (facts/climate.json)

- `advocacy_share_of_policy_win` (30%, 10-60%): the part of a won policy due to all advocates
  together; `p_success` reads it for a win already in. A pending policy takes a chance of winning from
  a reference class instead, marked `single_event`.
- `years_until_avoided_regulation` (3, 1-6) for rules and tax credits;
  `years_until_avoided_technology` (15, 8-25) for technologies not yet deployed. A policy with its own
  compliance dates uses them.
- Particular wins' tonnes, counterfactual and delivered share are facts there, for every model that
  counts them; a new win's go there too, never inside one model.
- `us_power_smoke_factor` (US power plants), `us_coal_power_smoke_factor` (coal plants); other fuels
  and places from per-fuel evidence (deaths per TWh) in the model's `fuel_smoke_factor`, weighted by
  branch.
- Methane: the `methane_share` row (methane's part of the CO₂e tonnes, weighted by tonnes a
  year before waits); the conversion gives it methane's own warming (`methane_heat_*`) and ozone
  (`ozone_deaths_per_tco2e_methane`, discounted over `methane_lifetime_years`). Never in
  `extra_deaths_per_tco2e`.
- `nondeath_damages_vs_deaths` (0.6): damage beyond deaths, a side effect in the unit's conversion;
  never in a model.

## Public money (normalization.md 2.23)

Credits, grants, procurement, donors' payments and a won fund's levies are netted against their payers'
loss, per branch, into the uov bridge:

```
public_payer_uov_per_dollar = @public_funds.mcpf * $uov_per_ln_consumption / (payer multiple * payers' survey-scale consumption)
<b>_public_usd_per_year     = shared fact (credit per tonne × tonnes: q45_credit_usd_per_tco2[_dac]; ira_public_cost_usd_per_year)
<b>_public_cost_uov         = -<b>_public_usd_per_year * public_payer_uov_per_dollar * <b>'s years, wait, chance and adjustments
```

Paid per unit: every adjustment; a fixed sum: not the evidence step; a levy: its spending's steps.
Households' money: their gain less the payers' loss; a levy: no mcpf (the compliance row carries its
resource cost). Payers: US federal (CE survey), rich donors (UK on the survey scale), the developing
world (`lmy_na_consumption_per_person_2024` × the median survey ratio).

## Evidence to look for

- **Wins** in the period the charity's reports claim, checked against the official record.
- **Tonnes**: the regulator's impact assessment, independent modelling; GWP100 (IPCC AR6) for
  methane, as the sources state it.
- **Status since**: repeals, delays, court stays and weakening amendments set `implementation_adj`;
  a rule repealed keeps only the chance it is restored within the years counted.
- **Share of the work**: the coalition behind each win and its budgets, for
  `attribution_share_shared`; governments and firms that carry it out are under `mobiliser_share`
  (`"credit": "win"`), with the win's cost rows.
- **Fuel**: what the tonnes replace (coal, gas, oil, clean power), for `fuel_share` and the
  counterfactual.

## Pitfalls

- **Counted twice**: trade reshuffling (cleaner supply sent to the regulated market) is the
  counterfactual, not a lower tonnes figure; smoke already in a death count goes in
  `extra_deaths_per_tco2e` with `air_pollution_weight` 0.
- **`fuel_share`** feeds the conversion (no shared assumption, INV-2b): weight it by tonnes before
  waits and years counted, and say so.
- **Pathways are not forecasts**: a government's 2050 target is the yardstick, the share built a
  ranged judgment.
- **Projections run ahead**: ex-ante tonnes of credits and technology often exceed what gets
  built; say so in `evidence_adj`.
- An organisation's credit claims name the win, not its share.
