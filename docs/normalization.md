# One scale, evaluators' models intact

Implemented October 2026 (the rules below are enforced by src/engine/invariants.ts). Every charity on the site ends up in **years of healthy
life per $1,000**. This note sets out how each model gets there by the same visible steps, while the
evaluator's own model still reproduces its spreadsheet.

Numbers below are engine output at today's defaults (`headline()` in src/engine/model.ts, loaded as
scripts/summaries.ts does), unless marked as an estimate. GiveDirectly (GiveWell, Kenya) = 4.36.

## 1. The principle

**The evaluator owns everything up to the outcome they report, in the unit they report it. We own
everything after it, and those steps are the same for every model that reports that kind of
outcome.**

Each model has up to four layers, in this order:

| Layer | Whose | What it holds | How it is checked |
|---|---|---|---|
| **E. Evaluator** | theirs | Rows that reproduce the source sheet, ending at the *native row*: the evaluator's own bottom line (SADs/$, units of value/$, WELLBYs/$, DALYs/$). | `expected` values reproduce in the evaluator view (`npm run check`). |
| **A. Accounting** | ours, shared | Choices that apply to every model: credit by share of resources (`donor_cost_share`), discount rate, value of a life. Written as model rows because they act inside the model, but every one reads a shared assumption and is pinned to the evaluator's choice in the evaluator view. | Pins in `evaluator.assumptions`; INV-5. |
| **B. Bridge** | ours, model-specific | Only where the evaluator stops before a standard outcome: papers (WAI), people reached (Good Food Fund), years of farmed life (ACE 2016). Our judgments, each with a range and a reason. | Own section, no `expected`; INV-7. |
| **C. Conversion** | ours, standard | The native outcome to years of healthy life. A fixed recipe per kind of outcome: the unit's `to_common` in assumptions/default.json, plus, for animals only, a fixed species step (section 2.4). | INV-2, INV-3. |

Where the line is drawn:

- **Inside layer E we change nothing silently.** Where our number differs from the evaluator's
  (a shared fact, a correction), the row carries our value and the evaluator's as `published`, and
  says why. The evaluator view uses `published`, so the sheet still reproduces.
- **One consistent way (owner, 2026-10-31).** Our view never keeps an evaluator's own conversion,
  exchange rate, weight or definition where the site has a shared version: an exchange rate between
  outcomes, the value of a death, a depression weight, a cash benchmark, a currency rate, a time
  discount rate, a species weight. The row reads the shared assumption or fact, `published` holds
  the evaluator's figure, the explainer says "changed for consistency" and why, and the evaluator view
  (pins and `published`) still reproduces every `expected`. Where the site has no shared version and
  two models use the concept with different values, a shared fact is created (section 2.7). Two
  things are not overwrites: an evaluator's measurement (what a program does, in its unit) and
  undoing the evaluator's own conversion of a figure it only published converted (FP's $164 per
  WELLBY-equivalent for GiveDirectly, divided back to doublings by FP's 1.898). Rows that read a
  cross-cause rate are still forbidden (INV-2b): `$uov_per_daly` only with the evaluator's implied rate
  pinned. Checked by INV-2c, so every slider moves every model it should.
- **A species weight is a conversion, not part of the evaluator's model.** AIM's SADs come with
  AIM's species weights built in; we take them out and put ours in, in the same rows for every
  animal model. The evaluator view keeps AIM's.

Why not normalise inside each model? Because "we reproduce GiveWell/ACE/HLI exactly" is the
site's credibility, and a reader must be able to find the exact cell where we stop agreeing.
Why not leave conversion to each model? Because then every model reaches the scale by its own
route, which is what we have now for animals (section 4).

## 2. Standard conversion per kind of outcome

Healthy years per $1,000 = native result per dollar × conversion × 1,000. `headlineNode` already
builds this from the unit's `to_common` and cancels `uov_per_daly`; the recipes below are what each
`to_common` must say.

### 2.1 Income and other GiveWell value: units of value (`uov`)

`healthy years = UoV / $uov_per_daly` (default 2).

GiveWell's own moral weights (116.25 UoV per under-5 death, 1/ln 2 per doubling of consumption,
2.3 UoV per DALY in iron and water sheets) stay in layer E, linked to `$life_value_multiplier`,
`$uov_per_ln_consumption`, `$uov_per_daly` and pinned in the evaluator view. Say plainly on /method
that a "healthy year" from a GiveWell model is GiveWell's value divided by 2, not a counted DALY.

### 2.2 Health: DALYs (`daly`)

`healthy years = DALYs`. (`to_common = $uov_per_daly`, which cancels.)

### 2.3 Life satisfaction: WELLBYs (`wellby`)

`healthy years = WELLBYs × $uov_per_wellby / $uov_per_daly` (1.15 / 2 = 0.575).

The rate is a calibration on GiveDirectly (HLI 4.34 and GiveWell 4.36 healthy years per $1,000 agree
by construction), so it moves with the income/health slider, like GiveWell's income models. Keep.

Mortality inside HLI models (AMF-HLI values deaths through its neutral point) is HLI's; our
`$life_value_multiplier` should still scale it in our view (decision 8).

### 2.4 Animal suffering: chicken-equivalent pain days (new unit `ced`)

The chicken is the reference animal. One **chicken-equivalent pain day** is one day of disabling
pain in a chicken.

```
days of disabling pain, species s  = animals × days × intensity (disabling-equivalent share)
chicken-equivalent days            = Σ_s  days_s × welfare range_s / welfare range_chicken
healthy years                      = chicken-equivalent days × $chicken_vs_person × $daly_per_sad
```

- `$chicken_vs_person`: the chicken's weight against a person, stored as the real number (0.332,
  Rethink Priorities' median for chickens). Old `animal_moral_weight` links are mapped to it.
- `$daly_per_sad`: healthy life lost per day of a person's disabling pain (0.0011, about 10 hours).
- `to_common` for `ced` = `$chicken_vs_person * $daly_per_sad * $uov_per_daly`.
  At defaults, 1 chicken-equivalent day per dollar = 0.365 healthy years per $1,000. One AIM SAD
  of a chicken (= 1/0.332 chicken days) = 1.1, as today.
- The units `sad` and `animals_spared` stop being ranked units. They stay as native units in layer E.

**Shared species table** (new facts/welfare_ranges.json). Rethink Priorities' welfare range
estimates, medians and 90% intervals, already adjusted for probability of sentience (Fischer et al.
2023, <https://rethinkpriorities.org/publications/welfare-range-estimates>):

| Species | RP median (vs person) | 5th–95th | vs chicken (median ÷ 0.332) | Use for |
|---|---|---|---|---|
| Pig | 0.515 | 0.005–1.031 | 1.55 | pigs; proxy for cattle (decision 6) |
| Chicken | 0.332 | 0.002–0.869 | **1** | hens, broilers; proxy for turkeys, ducks |
| Octopus | 0.213 | 0.004–1.471 | 0.64 | |
| Carp | 0.089 | 0–0.568 | 0.27 | farmed fish (with salmon) |
| Bee | 0.071 | 0–0.461 | 0.21 | insects (upper) |
| Salmon | 0.056 | 0–0.513 | 0.17 | farmed fish (with carp) |
| Crayfish | 0.038 | 0–0.491 | 0.11 | |
| Shrimp | 0.031 | 0–1.149 | 0.093 | farmed shrimp |
| Crab | 0.023 | 0–0.414 | 0.069 | |
| Black soldier fly | 0.013 | 0–0.196 | 0.039 | insects (central) |
| Silkworm | 0.002 | 0–0.073 | 0.006 | insects (lower) |

Store the absolute RP figures; compute "vs chicken" as species ÷ chicken median, with the species'
5th/95th ÷ chicken median as its range, so the chicken's own uncertainty lives only in the slider.
Do not multiply by a probability of sentience again: RP's table already includes it.

**AIM SADs already include a species weight.** One SAD is a day of a *person's* disabling pain:
AIM multiplies each species' intensity-weighted pain days by AIM's welfare range for it. To put a
SAD on our scale, take AIM's weight out and ours in:

```
ced_s = sads_s / @aim_sads.s_v * if($rp_species_weights, @welfare_ranges.s_vs_chicken,
                                                         @aim_sads.s_v / @aim_sads.chicken_2024)
```

`v` is the SAD version (2024 or 2025) whose weights are built into the figure the row divides in
our view: AIM's weights changed between versions (a hen 46.4% of a person in 2024 SADs, 34.7% in
2025), and dividing a 2025 figure by a 2024 weight would leave part of AIM's weight in. ACE's 2024
sheets and its 2024 meal sheet use 2024 SADs; its 2025 sheets use 2025 SADs. Each `@sad_factors` fact
states its basis, and a range end from the other version is restated on it (×
weight of its version / weight of the other). A model with figures of both versions for one species
gets a second pair `sads_s_v` / `ced_s_v` (The Humane League: battery-cage hens on the shared 2024
figure, enriched-cage hens and broilers on ACE's 2025 ones). The evaluator branch divides every
version by the 2024 hen, the weight `$chicken_vs_person` is pinned to, so ACE's SADs count as SADs.

In the evaluator view `$rp_species_weights` = 0 and `$chicken_vs_person` is pinned to
`@aim_sads.chicken_2024`, so the evaluator headline equals SADs × 0.0011 × 1,000, exactly as today.

What AIM's weights are (facts/aim_sads.json). AIM publishes the table its SADs use, linked from its
SADs post: <https://docs.google.com/spreadsheets/d/1bgnTeETRkpnyKZZXDhO5OBl6L2a0OYN1ntnYHL6vz34/edit>
(probability of sentience in "Sentience estimates", welfare range given sentience in "Welfare range
estimates", one pair of tabs for 2024 SADs and one for 2025). ACE's 2024 and 2025 sheets use the 2024
SADs (its 28.94 SADs per caged hen is 62.38 intensity-weighted days × the 2024 hen weight):

- Chicken, 2024 SADs: 0.464 = 80.6% × 57.6% (ACE's CHKD sheet, 'SADs Estimate'!B8:B9; AIM's 2024 tabs
  agree to three figures).
- Pig: 0.633 = 91.4% × 69.2% (2024 tabs, row "Pigs"). 2025 SADs: 0.516.
- Fish: salmon 0.264 = 50.5% × 52.2%, fish in general 0.281 = 50.6% × 55.6% (2024 tabs). ACE's meal
  figures mix salmon and cleaner fish; the fact's best guess, 0.274, mixes the two by their SAD shares,
  with the two as its range.
- Shrimp, 2025 SADs: 0.199 = 43.3% × 46.0% (2025 tabs, which ACE's 2025 SWP review uses); 2024 SADs:
  0.30 × 0.62 = 0.186 (ACE's ALI sheet). Both shrimp models divide the shared 2025 figure in our view.
- Chicken, 2025 SADs: 0.347 = 87.6% × 39.7% (2025 tabs, row "Layer hens"), divided out of ACE's 2025
  figures (broilers under the BCC, enriched cages to aviaries).
- AIM's per-species hours of pain behind each SAD figure (sow, piglet, salmon) are not public; ACE's
  sheets paste the SAD totals. ACE's 2025 SADs sheet is private; that it uses AIM's 2025 weights is
  inferred.
- × 3.18 in some pig and shrimp SADs (Sinergia 'SADs per animal'!D6:E10, ALI 'SADs Estimate'!B16):
  AIM's stand-in for pain intensity growing exponentially between categories (ALI's B16 cell
  comment), applied where the figure was built without it. A pain term, not a species weight; it
  stays.
- AIM changed method in 2026 (v2; docs/eval-skills.md notes it moves SWP's SAD factor a lot). Each
  `@aim_sads.*` fact records the version, and each ACE model says which version its sheet used.

So, on shrimp, AIM puts a shrimp at 0.199 / 0.332 = 0.60 of a chicken and RP at 0.093: 6.4 times
less. Rebasing multiplies shrimp SADs by 0.093 × 0.332 / 0.199 = **0.156**.

**Counts that aren't SADs** (bridges): fill the first line of the recipe yourself, by species
(`ced_s = disabling_days_s * @welfare_ranges.s_vs_chicken`). "Animals spared" becomes animals
spared by species × days each would have lived × intensity, never a single all-species ratio.

**AIM's welfare points (2018–2023)** are a count that isn't SADs: one point of AIM's −100 to +100 welfare
score for one animal for one year, times AIM's probability that the animal is sentient (no other species
weight). The bridge (facts/aim_wp.json, ours): divide by the sheet's own sentience figure, times
`@aim_wp.pain_days_per_wp_year` (2.1 days of disabling pain per welfare-point-year, range 1.09–9.09), giving
`pain_days_<s>`, then the raw template. The 2.1 is AIM's own two metrics on one change: a hen moved from a battery
cage to an aviary gains 17.86 points a year (−57.14 to −39.29, CE's 2018 welfare-point sheet) and is spared 37.5
days of disabling pain a year (17.4 SADs over the 2024 hen weight). The high end is Vasco Grilo's reading (100
points for a year = one healthy year, 9.09 days at 0.0011). AIM's co-founder and funding counterfactuals (what the founders and the money would have achieved at other
charities) are left out of our view for every AIM model (decision of 2026-10-31, below); AIM's figure stays in the
evaluator view.

### 2.5 Climate: tonnes of CO₂-equivalent averted (`tco2e`)

Added October 2026 (issue #15); one unit since October 2026. A tonne of greenhouse gas kept out of
the air is worth the deaths that tonne would cause, each valued like any other adult's death on the
site, and discounted like any other future good. Every tonne avoids its heat deaths; a tonne that
comes from burning less fossil fuel near people also avoids air-pollution deaths, and how much depends
on the fuel and the place. So there is one unit, and each model says how much air pollution its
tonnes carry, in one row the conversion reads:

```
heat factor   = (1 + $discount_rate) ^ -$climate_heat_death_delay
healthy years = tonnes × $deaths_per_tco2e
                × ($climate_heat_share × heat factor + (1 − $climate_heat_share) × air_pollution_weight)
                × @moral_weights.uov_per_death_over5 × $life_value_multiplier / $uov_per_daly
```

- `air_pollution_weight` (a row of the model, fixed id): the air-pollution deaths each of the model's
  tonnes avoids, as a multiple of the fossil-fuel average behind Rethink's rate (1.46 per 10,000
  tonnes). It is the share of the tonnes that come from burning less fuel near people (`fuel_share`)
  times, where the fuel differs from the average, that fuel's smoke per tonne relative to it
  (`fuel_smoke_factor`, per-fuel evidence such as deaths per TWh, not the world average). It sits in the
  model's conversion section (kind `ours`), each input with a source or a labelled judgment and a
  low/high range, so the sensitivity and uncertainty tools vary it like any other input.
- The mechanism: `to_common` may name rows of the converted model by bare id (and shared facts by
  `@key`), and the engine evaluates the conversion with the model's computed rows (`toCommon`, `headline`, `bottomLine`, uncertainty).
  `buildLibrary` records these as the model's `conversionRows`; a `tco2e` model without
  `air_pollution_weight` is a build error, and `rowsFeeding` follows them, so the row's inputs count as
  on the path. The shared rates stay shared: INV-2b still forbids any row from reading a cross-cause
  rate, and also checks that a conversion row sits in an `ours` section and that neither it nor
  anything feeding it reads a shared assumption. The model supplies only how much of the shared
  air-pollution rate applies to its tonnes; the rate itself is never in a row.
- Shares at October 2026 (healthy years per $1,000, before → after the change, which replaced the
  two units `tco2e`, all smoke at the world average, and `tco2e_no_smoke`, none):

  | Model | Tonnes | `air_pollution_weight` (range) | Source | Before → after |
  |---|---|---|---|---|
  | Clean Air Task Force (FP) | 13% from US coal retired for gas (FP's own split) × 0.13 (0.09–0.24) of the average per net tonne | 0.017 | Toll from Coal 2010 over EIA's 1,847 TWh (7.1 deaths/TWh) and Markandya & Wilkinson 2007 (gas ≈ a ninth of coal per TWh) | 0.12 → 0.19 |
  | Future Cleantech Architects (GG) | all EU gas power displaced (0.8–1) × 0.039 (0.01–0.08) | 0.039 | Markandya & Wilkinson 2007: gas 2.8 deaths/TWh, at FP's 0.49 t/MWh | 1.11 → 2.6 |
  | Evergreen 2022 / 2021 (GG) | US power, IRA health modelling per tonne: 0.013 (0.005–0.027) | 0.013 | Energy Innovation 2022, Resources for the Future 2022 | 0.031 → 0.045; 0.28 → 0.41 |
  | Opportunity Green (GG) | half of ship smoke per tonne cut (0.2–1, judgment) × ship smoke 0.94 (0.42–2.1) of the average | 0.47 | Zhang et al. 2021 (NOx about half of post-2020 ship deaths), Sofiev et al. 2018, IMO Fourth GHG Study | 7.3 → 3.5 (heat only was 0.2) |
  | Coalition for Rainforest Nations (FP) | no fuel; clearing-fire smoke 0.005 (0–0.03) | 0.005 | Reddington et al. 2015; IPCC 2006 Vol. 4 Tables 4.3, 4.4, 4.7 | 0.62 → 0.73 |
  | Carbon180 (GG) | capture at running plants, DAC: 0 (0–0.05, judgment) | 0 | | 0.23 → 0.23 |
  | Good Food Institute (GG) | livestock methane, N₂O, land: 0 (0–0.05, judgment) | 0 | | 0.051 → 0.051 |

- `$deaths_per_tco2e`: "Deaths caused by one more tonne of CO₂", the climate slider. Default 1.9 per
  10,000 tonnes, Rethink Priorities' median for heat deaths (0.43, from its own run of the GIVE
  model, counted to 2300 without discounting) plus fossil-fuel air-pollution deaths (1.46)
  (Clare & Vargas 2026, facts `climate.deaths_per_tco2e*`; Rethink's undiscounted figure stays the
  default and the source). Range 0.43 (heat only, Rethink's own scenario) to 5.1 (the tops of
  Rethink's two 95% intervals; about what Rethink's whole-damages "ethically weighted" social cost
  of carbon, CG$1,600/t, comes to in lives at 32 healthy years each).
- `$climate_heat_share` (fixed, 0.2279): Rethink's heat deaths over heat plus air-pollution deaths.
  It splits the slider into deaths that come late (heat) and deaths that come at once (air pollution:
  fuel not burned saves them the same year, so they aren't discounted).
- `$climate_heat_death_delay` (judgment, 60 years, range 30–100, under Timing): when the heat deaths
  come, as one discount-weighted delay. Bressler (2021) and Rennert et al. (2022), quoted by Rethink,
  find them "concentrated at the end of the century"; no source gives the year-by-year profile. At 4%
  a heat death 60 years away counts 0.095 of one today. This applies the site's rule that every
  model discounts future good at `$discount_rate`; at 0% the units give Rethink's undiscounted values.
- `@moral_weights.uov_per_death_over5` (73.1914): GiveWell's value of a death at five or older, the
  site's default for adult deaths, read by `to_common` from the fact itself (a unit's conversion may
  read shared facts, its one source; the `sad` unit likewise reads `@aim_sads.chicken_2024`, and no
  unit conversion holds a literal standing in for a shared figure). src/engine/normalization.test.ts
  fails if the slider's default and range or the heat share drift from the `@climate` facts.
- `$life_value_multiplier` makes climate move with the same weight on lives as GiveWell's and HLI's
  models (decision 8's lever, here applied in the conversion because no evaluator's climate model
  counts deaths).
- At the defaults: a tonne with `air_pollution_weight` 0 = 0.00015 healthy years (about 1.3 hours),
  so $1 a tonne = 0.15 healthy years per $1,000; each 0.1 of weight adds 0.0005 (0.53 per $1,000 at
  $1 a tonne), up to 0.0055 (about 2 days, 5.5 per $1,000) at weight 1. Undiscounted (0%) the ends
  are 0.0016 and 0.0070.
- Cross-checks, not read by models: the social cost of carbon, $185/t (Rennert et al. 2022), of which
  $90 is the same heat deaths valued at income-weighted, 2%-discounted prices (`@climate.social_cost_of_carbon_usd`);
  Giving What We Can's 2016 estimate, 258,200 tonnes per life (`@climate.tco2e_per_death_gwwc_2016`),
  about 50 times below our default because it leaves out air pollution.
- What it leaves out: damage that isn't death (crops, income, migration), tipping points and growth
  effects (Rethink's Model 2+ multiplies its whole-damages figure by 2.5 to 6). Air pollution per
  tonne differs by fuel and place; each model's `air_pollution_weight` carries that. Methane's ozone deaths aren't counted yet (a methane fact is open work). At the slider's high end
  (a stand-in for all damage) the 23% heat share undercounts what tonnes with a low `air_pollution_weight` carry.
- **The wait is discounted.** Most tonnes are avoided years after the grant (a policy that takes
  effect later, plants re-powered later, trees growing for decades). Every climate model has a row
  `years_until_avoided` in its `ours` section (from the evaluator's own dates, or a labelled judgment,
  with a range), and tonnes per dollar = `1 / cost per tonne × (1 + $discount_rate) ^ -years_until_avoided`;
  the unit's conversion then discounts the heat deaths from the year the tonne is avoided, so nothing
  is discounted twice. Shares at October 2026 (best, range): Carbon180 5 (3–8), Clean Air Task Force 12
  (8–16), Coalition for Rainforest Nations 7 (3–12), Evergreen 2022 4 (2–7) and 2021 6 (3–9), Future
  Cleantech Architects 5 (3–7), Good Food Institute 25 (15–35), Industrious Labs 8 (4–15), Opportunity
  Green 4 (2–8), Terrapraxis 10 (5–20), Woodland Trust 40 (30–55, uptake spread over the forest's life).
- **Evaluator view, one rule for every climate model:** `evaluator.assumptions` pins neither
  `$discount_rate` nor `$life_value_multiplier`. The evaluators state dollars per tonne and take no view
  on discounting or on what a tonne is worth, so their layer reads neither; the wait and the
  conversion are ours in both views, and the two views differ only in the evaluator's own rows and the
  accounting toggles. (Pinning `$discount_rate` to 0, as Woodland Trust did, also undiscounted the
  shared heat-death delay in the unit's conversion: no longer.)
- The evaluator's own figure (FP's and Giving Green's $ per tonne) is the native row; the model's
  output is tonnes per dollar (`1 / cost per tonne`, in an `ours` section, then our credit steps) in
  `tco2e`, with `air_pollution_weight` and its inputs in the same section; the write-up says what the
  weight rests on. `deaths_per_tco2e`, `climate_heat_share` and `climate_heat_death_delay` are
  cross-cause rates (INV-2b): no model row reads them. INV-10: climate models move in proportion to
  `$deaths_per_tco2e` and `$life_value_multiplier`; every other model is independent of the climate
  rates. INV-9 counts the levers the unit's conversion applies (`$life_value_multiplier`) as on the
  path.

### 2.6 Anything else

Research papers, people reached, courses, policy wins: these are not outcomes on the scale. They
must go through a bridge (layer B) into one of the units above, and the bridge's rows are ours,
in their own section, with ranges. A model with no bridge is shown but not ranked, as today.

### 2.7 Shared conversions: one consistent way (October 2026)

The shared versions every model's view reads (section 1, "One consistent way"):

| Concept | Shared version | Value (range) | Source |
|---|---|---|---|
| Healthy year vs doubled-income year | `$uov_per_daly` (in rows only with the evaluator's implied rate pinned) | 2 (1–4) | judgment, assumptions |
| Income | `$uov_per_ln_consumption` | 1/ln 2 | GiveWell |
| Life satisfaction | `$uov_per_wellby` (unit conversion only) | 1.15 | calibration on GiveDirectly |
| A death | `@moral_weights.uov_per_death_under5` / `_over5` × `$life_value_multiplier`; GiveWell's own age curve inside GiveWell sheets is the same scale | 116.25 / 73.19 UoV | GiveWell moral weights |
| Depression on the PHQ-9 | `@depression.dalys_per_phq9_point_year` (new) | 0.031 (0.0244–0.0435) | GBD 2019 weights for mild 0.145, moderate 0.396, severe 0.658 placed at the middle of the PHQ-9 bands (Kroenke et al. 2001; moderate covers 10–19), least-squares slope |
| "1× cash" | `@cash.uov_per_dollar` (new) | 0.00335 (0.00321–0.00872) | GiveWell's benchmark in 142 sheets; low FP's 2022 GiveDirectly, high GiveWell's 2024 GiveDirectly |
| Pounds, euros, kroner | `@fx.usd_per_<cur>_<year>` | IRS yearly averages | IRS (2021–25 live table, 2015–20 archived) |
| Time preference | `$discount_rate` | 4% (0–8%) | judgment |
| Species | `@welfare_ranges.*` (2.4) | | Rethink Priorities |
| A dollar a meta charity moves | `moved_dollar_value` / `moved_dollar_net_value` (2.8): destinations read live (`#model`), `@meta.*` | 0.0539 across causes, 0.0413 global health (units of value per $) | GiveWell 2024 funding, ACE's Recommended Charities, Giving What We Can 2020–22 |
| New money among money moved | `@meta.new_money_share` | 50% (35–80%) | Ambitious Impact, Effective Giving Incubation report |
| A new meta organisation's chance of success | `@meta.success_chance_new_org` | 55.7% (50–63.5%) | Ambitious Impact, Better Futures Guide CEA |

**Depression.** Evaluators that leave their own unit for health each turned depression into DALYs
their own way: Founders Pledge spreads GBD's severe weight over the whole PHQ-9 (0.658 / 27 = 0.0244 a
point, StrongMinds) or over the score of average severe depression (0.658 / 23.25 = 0.0283, Action for
Happiness); SoGive counts 23 points for a year as a full healthy year (1 / 23 = 0.0435, its "rather
experience nothing" score). Our view uses 0.031 a point for all three; a model measured in standard
deviations multiplies by its own sample's PHQ-9 spread (SoGive: 4.21). HLI (StrongMinds, Friendship
Bench, Shamiri, Pure Earth's cosmetics) measures in SD-years × 2 WELLBYs (`@wellby_factors`) and stays
in its own unit, WELLBYs, so it doesn't go through this conversion; its rows now read the shared
`@wellby_factors` figures. No GiveWell psychotherapy model is imported.

**Multiples of cash.** A result published only as a multiple of cash (FP's "10× GiveDirectly") is
multiplied by `@cash.uov_per_dollar`. Where a sheet made the multiple by dividing its units of value by
its own cash figure, that figure reads `@cash.uov_per_dollar` too (the sheet's in `published`), so the
benchmark cancels and our units of value are the sheet's. GiveWell's 2017 sheets state cash as a cost per
under-five life-equivalent (11,663, 12,298): no clean way to cancel, so they are waived, their multiple
converted with the shared benchmark.

Inventory of evaluator-internal conversions outside AIM's models (October 2026; AIM's are handled in
their own pass). "Before → after" is healthy years per $1,000 in our view at the defaults; the evaluator
view is unchanged unless stated.

| Evaluator, model | Conversion | Theirs | Shared version | Before → after |
|---|---|---|---|---|
| FP StrongMinds | depression, DALYs per PHQ-9 point-year | 0.658/27 = 0.0244 | `@depression` 0.031 | 2.38 → 3.02 |
| FP Action for Happiness | depression per point; £→$ | 0.658/23.25 = 0.0283; 1.2911 | 0.031; `@fx.usd_per_gbp_2020` 1.2837 | 0.286 → 0.315 |
| SoGive StrongMinds (March 2024) | depression: 23 PHQ-9 points = 1 DALY | 0.0435 a point | 0.031 a point (× SoGive's SD 4.21) | 0.816 → 0.582 |
| FP Development Media International | child death, 234 WELLBY-equivalents (63 DALY-eq.) | 234 | `@moral_weights.uov_per_death_under5 / $uov_per_daly` (58 DALY-eq.); pin `uov_per_daly` 1.9498 = 3.7/1.898 | 5.38 → 5.02 |
| FP Family Empowerment Media | maternal death, 41.1 DALY-eq. | 41.1 | `uov_per_death_over5 / $uov_per_daly` (36.6); same pin | 41.5 → 37.0 |
| FP Suvita | under-5 death, 241.3 WELLBY-eq. (127 UoV) | 241.3 | `uov_per_death_under5` (116.25 UoV) | 32.8 → 30.0 |
| FP New Incentives | "10× cash" via FP's $164/WELLBY-eq. and 3.7 per DALY | 0.00321 UoV/$ per 1× | `@cash.uov_per_dollar`; output now `uov` (pin `uov_per_daly` 1.9498 keeps its evaluator view) | 16.5 → 16.8 |
| FP Pure Earth | "10× cash" via $164 and 1.898 | 0.00321 | `@cash` 0.00335 | 16.1 → 16.8 |
| FP The Life You Can Save | value of recipients' cash, FP's GiveDirectly | 0.00321 | `@cash` | 32.2 → 33.6 |
| FP Innovation in Government (Zambia) | 7 DALYs per child life, 3 ln(income) per DALY, GiveDirectly $11,663 per life-eq. | 1.86 UoV per ln(income) | `$uov_per_ln_consumption` 1.44 (India's part, valued by FP in 2017 life-equivalents, goes through `@cash`) | 13.6 → 11.7 |
| FP GiveDirectly, Imagine Worldwide | FP's 1.898 per doubling | | undo of a figure FP publishes only in its units: waived | none |
| FP Imagine, GAIN, Iodine Global Network | own GiveDirectly figure | | cancels or off the path | none |
| GiveWell, 141 grant sheets | our multiply-back of the multiple of cash | 0.00335 literal | `@cash.uov_per_dollar` | none |
| GiveWell, 63 grant sheets | sheet's own cash figure behind the multiple (0.0033545, 0.003355, 0.00333, 0.00344, 0.0034, 33.5, 38.4, 334, 344, 3.4…) | as listed | `@cash` × scale; cancels | up to +15% (Fortify 2019 incubation 21.7 → 24.9); most ±0.1–2.7% |
| GiveWell Fortify Health iron consolidation | 1 DALY = 3 ln(consumption)-years | 4.33 UoV/DALY | `$uov_per_daly / $uov_per_ln_consumption`, pin 4.33 | 22.5 → 12.8 (evaluator view 24.4 → 11.3: it now converts at the sheet's own 4.33) |
| GiveWell Healthy Futures | neonatal death = 33.07 DALYs | 33.07 | GiveWell's own neonatal weight (84 UoV, already in the sheet) / `$uov_per_daly`, pin 2.54 | 4.92 → 5.40 |
| GiveWell Malengo | time discount 4% typed in; €→$ | 0.04; 0.8458 €/$ | `$discount_rate` (pin 0.04; 6.5% for later cohorts = ours + GiveWell's 2.5-point uncertainty premium); `1 / @fx.usd_per_eur_2021` | 8.96 → 7.42 |
| GiveWell, sheets with 2017 life-equivalents | GiveDirectly cost per life-eq. | 11,663; 12,298 | waived (above) | none |
| GiveWell age-specific moral weights (100.7, 127.3, 116…) | value of a death | | they are the shared curve (× `$life_value_multiplier`) | none |
| ACE The Humane League, Shrimp Welfare Project | £→$ | 1.2781 | `@fx.usd_per_gbp_2024` 1.277 | <0.1% |
| ACE Animal Welfare Observatory; Dansk Vegetarisk Forening | €→$; DKK→$ | 1.0822; 0.1452 | `@fx.usd_per_eur_2024` 1.0823; `@fx.usd_per_dkk_2023` 0.14514 | <0.1% |
| HLI StrongMinds, Friendship Bench, Shamiri, Pure Earth | SD-years → WELLBYs (2), household spillover, household size | literals equal to HLI's | `@wellby_factors` | none |
| HLI AMF | a death in WELLBYs (years × wellbeing above neutral) | | HLI's measurement in its own unit; scaled by `$life_value_multiplier` | none |
| SoGive RNLI, Breast Cancer Now, MND, Versus Arthritis, Compassion, deworming | life, QALYs, £ | | already shared (`@moral_weights`, `@fx`, `$uov_per_ln_consumption`); Versus Arthritis' 50 DALYs per life cancels | none |
| Climate, all (FP, Giving Green, SoGive) | wait until tonnes are avoided not discounted; Woodland pinned 0% | | `(1 + $discount_rate)^-years_until_avoided`; no pins (2.5) | Carbon180 0.227 → 0.187, CATF 0.190 → 0.119, CfRN 0.730 → 0.554, Evergreen 0.045 → 0.039 / 0.41 → 0.32, FCA 2.65 → 2.18, GFI 0.051 → 0.019, Industrious 1.18 → 0.86, Opportunity Green 3.52 → 3.01, Woodland 0.0039 → 0.0029 (evaluator view 0.110 → 0.0029) |

Left as the evaluator's, on purpose: evidence, not conversions, such as earnings per standard deviation
of learning (FP's 2019 0.1 against its 2023 0.191 × 0.175: one evaluator's two vintages, a candidate
for a later shared fact), disability weights for single diseases each used by one model (DMI's GBD
weights, No Means No's PTSD 0.133), fade and "opportunities get worse" rates, GiveWell's
costs averted per DALY, and HLI's death values.

### 2.8 Money moved, success and career changes: one method (October 2026)

Meta charities (evaluators, fundraisers, effective-giving and research organisations) produce no outcome
of their own: they move money, and sometimes people, to charities that do. Before this section the
site valued a moved dollar three ways: CEARCH (Ambitious Impact) as EA dollars × 8 × GiveWell's cash
benchmark (our judgment 2–15), The Life You Can Save (Founders Pledge) as 40% of the money (our
judgment) × 5 × Founders Pledge's GiveDirectly, Better Futures Guide (Ambitious Impact) with Ambitious
Impact's 35% new money at 3× its pre-2024 GiveDirectly and a 55.7% chance of success, CEARCH with our
own 60%. Counterfactual shares, destinations and success chances differed for no reason. Now every
meta model values money one way, in a section of its own (`moved_money`, kind `ours`) whose rows are
written word for word from src/engine/moved-money.ts (`python3 scripts/moved-money.py <model> <mix|global-health> [net]`)
and checked by INV-12.

**Reading another model live: `#model-id`.** A formula may read another model's result per dollar in
common units (units of value), in our view, under the reader's current values: `#against-malaria-foundation`.
The engine (src/engine/model.ts `modelResult`) computes the referenced model's `bottomLine(...).common`
with the reader's assumption values (never the referencing model's evaluator pins, and never the
reader's page edits), caches it per set of values, and stores it beside the rows as `"#id"`, so the
tree, uncertainty and derivations read the same number; `inputs["#id"]` overrides it like an input.
`buildLibrary` reports an unknown model, a model without a result in common units, and any cycle of
references (and a cycle yields NaN at run time, never a loop); a model rebuilt on its own (a bulk
model's page) passes `{ models: lib.models }`. Model ids contain hyphens, so a minus after a reference
needs a space (`#givedirectly - x`). The browser's stand-ins (scripts/summaries.ts) keep every row that
reads a model live, and the reference itself, so a page computes the same result under any values;
`npm run check` fails when they are stale.

*Sliders and ranges.* Every slider the referenced models read moves the meta model (`usedAssumptions`
adds them, so the sensitivity ranges swing them too; INV-10 expects no independence from them). The
referenced models' own inputs and facts are not varied inside the meta model's range: it uses each
destination's result at the reader's values, so the meta model's range covers its own inputs, the
shared meta facts and the shared assumptions, not the destinations' input uncertainty. Deliberate: a
destination's own range is shown on its own page, and adding ten models' input ranges into one joint
low/high would make every meta range meaningless.

**The method** (facts/meta.json):

```
value_global_health = Σ GiveWell 2024 funding share × #top-charity          (AMF 49.5%, Malaria Consortium SMC 28.7%,
                                                                             Helen Keller VAS 17.8%, New Incentives 4.0%)
value_animals       = avg(#ACE Recommended Charities, November 2025)          (equal weights, ten models)
value_longtermist   = @meta.value_longtermist = 0                             (said openly: no model puts it on the scale)
V = moved_dollar_value
    across causes:  (h × value_global_health + a × value_animals + l × 0) / (h + a + l)
                    h, a, l = Giving What We Can 2020–22: 60%, 10%, 10%; the ~20% unknown or several
                    causes is valued at the average of the known ones, so it drops out
    one cause:      value_global_health  (an organisation that only moves money to global health and poverty)
V_before = prior_dollar_value = @meta.prior_vs_cash × #givedirectly          (1×, from 0 to 3×)
net      = moved_dollar_net_value = new × V + (1 − new) × (V − V_before)     new = @meta.new_money_share = 50% (35–80%)
success  = @meta.success_chance_new_org = 55.7% (50–63.5%)                   for an organisation not yet proven
```

- *Destinations.* GiveWell's Top Charities weighted by what GiveWell directed to each in 2024
  ($150m, $87m, $54m, $12m of $303m, GiveWell's 2024 metrics post); Animal Charity Evaluators' ten
  Recommended Charities with equal weights (its Recommended Charity Fund spreads money over all of them
  and publishes no fixed split); longtermist causes at 0. At today's defaults: global health 0.0413
  units of value per dollar (20.7 healthy years per $1,000), animals 0.183 (91.5, mostly Sinergia
  Animal), the across-causes mix 0.0539 (26.9). GiveDirectly 0.00872.
- *Which mix.* An organisation whose donors give across causes (CEARCH: "EA donations") takes the
  Giving What We Can mix; one that only moves money within global health and poverty (The Life You Can
  Save's recommended list, Better Futures Guide's livelihoods charities) takes that destination alone.
  Better Futures Guide's charities don't exist yet; Ambitious Impact assumes they reach GiveWell's bar
  (3× GiveDirectly's new estimate), so GiveWell's Top Charities stand in.
- *Shifted money.* Money given anyway, now to a better charity, earns only the gain. Where it would
  have gone is GiveDirectly's live result (Ambitious Impact's assumption), times a shared multiple
  with a range from 0 (ordinary charities) to 3 (GiveWell's bar).
- *A result already counterfactual.* CEARCH's bottom line is in dollars of "equivalent donations to
  today's top-tier EA charities", already net of what the money would have done: it is multiplied by V,
  not by the net value.
- *An evaluator's own valuation inside its layer* (Better Futures Guide): the sheet's rows stay; our
  bottom line divides out the value per dollar moved its rows imply (`aim_value_per_dollar_moved`) and
  multiplies by ours (`moved_money_revaluation`, `published` 1 so the evaluator view keeps the sheet's).
  The sheet's new-money share and chance of success read the shared facts, the sheet's figures in
  `published`.

**Career changes** (the mirror of staff pay below market). Staff who take less than they could earn
elsewhere give the difference in kind; it is credited at $1 of the employer's cost per $1 forgone
(`salary_sacrifice`, 273 models, on with credit by share of resources). A programme that moves people
into high-impact jobs is the other side: per career changed,

```
career_change_value = career_forgone_pay × career_years × career_employer_value × career_counterfactual_share
```

forgone pay a year (what they could earn elsewhere less what they take), the years they stay, the
new employer's live result per dollar (`#employer-model`, or `moved_dollar_value` where the jobs are
spread over many employers), and the share of the changes the programme caused (its own survey or a
labelled judgment, with a range). No model on the site uses it today (High Impact Professionals'
model was removed); INV-12 requires it of any model with a row on its path about career changes.

**Before → after** (healthy years per $1,000 at the defaults; plausible range in brackets):

| Model | Our view | Evaluator view | What changed |
|---|---|---|---|
| CEARCH (Ambitious Impact, 2021) | 53.2 [0.42–313] → 99.4 [1.3–978] | 104 → 210 | 8× cash benchmark (2–15) → V across causes, live (0.0539); our 60% success (40–80%) → shared 55.7%. The evaluator view also uses V (Ambitious Impact gives no value for its EA dollars) and the sheet's 100% success and 0% discount. |
| The Life You Can Save (Founders Pledge) | 33.6 [1.0–1,040] → 185 [5.6–1,430] | 32.2 → 185 | 40% kept (20–70%) × 5× Founders Pledge's cash (2–10) → 50% new money, global-health destinations live, shifted money net of GiveDirectly (0.0370 per dollar moved, 5.5× the old 0.0067). Founders Pledge states only its gross 17×, so both views use the shared method. |
| Better Futures Guide (Ambitious Impact, 2025) | 27.9 [9.5–71] → 62.7 [7.6–308] | 27.9 → 27.9 | the sheet's 35% new money and 3× its old GiveDirectly (0.0165 per dollar moved) → 50% and GiveWell's Top Charities live (0.0370), × 2.25; success already 55.7%, now read from the shared fact. Evaluator view unchanged. |


## 3. Invariants

Each is a test over the built library (`buildLibrary`, as scripts/summaries.ts loads it). Put them
in src/engine/normalization.test.ts, plus a report mode (`tsx scripts/normalization-audit.ts`)
that prints every violation, so they can land before all models pass (with an allowlist that only
shrinks).

| # | Invariant | How to test |
|---|---|---|
| INV-1 | Every ranked model reports in a ranked unit: `uov`, `daly`, `wellby`, `ced` or `tco2e`. | For each model with an `output` that `rankingPlan` can pick: `output.unit ∈ RANKED`. |
| INV-2 | The headline is the native result times the unit's standard conversion, and nothing else converts. | (a) `headline(m) === compute(m)[output] × evaluate(headlineConversion(unit))` for every model, both views. (b) No row's `assumptionDeps` contains a cross-cause rate (`chicken_vs_person`, `daly_per_sad`, `uov_per_wellby`, `sads_per_animal_spared`, the climate rates), and `uov_per_daly` only under INV-5. The one sanctioned model input to a conversion is a row the unit's `to_common` names by fixed id (`tco2e`: `air_pollution_weight`, 2.5): in an `ours` section, with no shared assumption feeding it. (c) **One consistent way**: no evaluator's own conversion moves our headline. Every input row on the path whose label names a conversion (exchange rate between outcomes, value of a death, depression scale to health, cash benchmark, pound/euro rate, time discount rate) and every read of a fact holding an evaluator's conversion (`@founders_pledge.wellbys_per_daly`, `wellbys_per_doubling`, `gd_cost_per_wellby`) is moved ×1.25 in our view; the headline must not move. Rows reading the shared version are formulas and pass; a rate applied and undone cancels and passes. Checked false positives (measurements) are waived with reasons. |
| INV-3 | Every animal model passes through the species step, once per species, from the shared table. | For `unit = ced`: the model declares `output.species` (e.g. `["chicken","pig"]`). For each, a row `ced_<s>` exists, its formula equals the template for its source (`aim` or `raw`) after whitespace normalisation, it reads `@welfare_ranges.<s>_vs_chicken`, and it is upstream of the output. No other row reads `@welfare_ranges.*` or `@aim_sads.*`. Every path from a row whose unit is SAD or days of pain to the output passes through a `ced_*` row. |
| INV-4 | No literal stands in for a shared number. | Facts get a `match` field (row label/id pattern). For every input row matching a fact's pattern whose value equals the fact's low/best/high: it must be a formula reading the fact, with the evaluator's literal in `published`. Also: no formula contains a constant equal to a fact or assumption value (extends lint's magic-number rule to all models). |
| INV-5 | The evaluator view uses the evaluator's own rates. | For every model with an `evaluator`, every non-toggle assumption read inside layer E is either pinned in `evaluator.assumptions` or has a default equal to the evaluator's value (check: `expected` still reproduces when the assumption is moved ±50% in the charityevals view only). |
| INV-6 | The evaluator's bottom line reproduces. | Model declares `output.native` (the native row). That row, or its direct inputs, carry `expected`; `scripts/check.ts` already checks `expected` in the evaluator view. |
| INV-7 | Our rows are visibly ours. | Every row strictly between `output.native` and `output.row` is in a section of kind `accounting`, `bridge` or `conversion`, and has no `expected`. Every row upstream of `native` is in an evaluator section. |
| INV-8 | One view, one set of numbers. | `headline(m, av, {}, "evaluator")` converts with `viewAssumptions(m, av, "evaluator")`, not `av` (fails today: see 4.2). |
| INV-9 | Shared levers reach every model they apply to. | Models declare `mortality: true` / `multi_year: true` (lint suggests them from keywords: death, mortality, years of impact). Declared mortality → reads `$life_value_multiplier`; declared multi-year → reads `$discount_rate`. |
| INV-10 | Each slider moves exactly the models it should, in the expected shape. | Property test at defaults: every `ced` model's headline is linear in `$chicken_vs_person` and in `$daly_per_sad`, and independent of `$uov_per_daly`, `$uov_per_wellby`, `$uov_per_ln_consumption`; every non-animal model is independent of `$chicken_vs_person` and `$daly_per_sad`. |
| INV-11 | No evaluator-internal exchange rate survives in our view where a shared one exists. | (Ambitious Impact's models for now.) Every row on the path to the output whose label states an income-to-DALY rate, a value of a death averted (DALYs or years of life per death) or a pound/euro exchange rate reads the shared version (`$uov_per_ln_consumption`, `@moral_weights.*`, `@fx.*`), itself or through a row it is computed from. |
| INV-12 | Money moved and career changes are valued one way (2.8). | Every model (not variants) whose native unit or a row on its path names money moved, raised, influenced, affected or shifted, a leverage ratio, a gross multiplier or EA donations reaches its output through `moved_dollar_value` with one of the two shared formulas; every shared row it has (src/engine/moved-money.ts) has the shared formula word for word; every row on its path stating an organisation's chance of success reads `@meta.success_chance_new_org`. A row on the path about career changes needs `career_change_value` with the shared formula. A charity's own fundraising (Ansh) and GiveWell's value-of-information sheet (IDinsight) are waived with reasons. Tiny-model checks in src/engine/model-refs.test.ts. |

Engine changes these need: unit `ced`; assumptions `chicken_vs_person` (stored 0.332),
`daly_per_sad`, toggle `rp_species_weights`; `output.native` and `output.species` in the
schema; section `kind`; `published` allowed on formula rows (evaluator view uses the number), so a
row can read a shared fact in our view and keep ACE's literal in theirs; `headline` and
`bottomLine` convert with view assumptions.

## 4. Audit

### 4.1 Animal welfare (all 14 models)

"HY" = healthy years per $1,000 today. Rebase factor = what INV-3 does with RP weights, *if* AIM's
chicken weight is 0.332 and shrimp 0.199 (unconfirmed).

| Model | Native outcome, species | Path today | Breaks | Fix | Effect |
|---|---|---|---|---|---|
| Animal Welfare Observatory | SADs; broilers (ECC 0.64/bird), hens (enriched→cage-free 3.05) | SADs × 0.0011 × 1 | 3, 4 (0.64, 3.05 literals; facts exist), 7 | `ced_chicken` row; read `@sad_factors` | none (23.5) |
| Aquatic Life Institute | SADs; shrimp, **0.0973 SADs per shrimp stunned** (ACE "SADs Estimate!B16") | same | 3, 4 | `ced_shrimp`; shared SADs-per-shrimp-stunned fact | 529 → 83 (rebase); → 25 with SWP's 0.00452/shrimp; → 3.8 with both. Evaluator view stays 529 |
| Çiftlik Hayvanlarını Koruma | SADs; hens 17.486 | same | 3, 4 | `ced_chicken`; `@sad_factors` | none (59.4) |
| Dansk Vegetarisk Forening | SADs; meals, mixed species, 2.58 SADs/meal | same | 3 (no species split), 4 (above shared high of 1.72) | meals → species → `ced_*`; interim shared 0.902 | 19.8 → 6.9 (shared meal factor); species split unknown |
| Good Food Fund | animals spared (our bridge from people reached) | × 22.4 SADs/animal (DVF ratio) × 0.0011 | 1, 3, 7 | bridge to meals or animals by species → `ced_*` | 4.1 → 1.6 using 8.7 SADs/animal (0.902/0.104, Sinergia/SVB); species split further |
| Shrimp Welfare Project | SADs; shrimp (0.00452 stunned; 0.22, 0.33 farm) | SADs × 0.0011 | 3 | `ced_shrimp` | 64.3 → 10.0 (×0.156) |
| Sinergia Animal | SADs; hens 75%, pigs 25%, meals 0.1% | same | 3, 4 (17.49 literal) | `ced_chicken`, `ced_pig`, meals by species | hens none; pigs × 1.55 × 0.464 / 0.633 (AIM's pig weight, now sourced) |
| Sociedade Vegetariana Brasileira | SADs; meals 0.084 SADs/meal | same | 3, 4 | meals → species; interim shared 0.902 | 10.1 → 109 (shared meal factor) |
| The Humane League | SADs; hens (**7.93** cage→cage-free, 3.05 enriched), broilers 0.64 | same | 3, 4 | `ced_chicken`; `@sad_factors` | none from rebase; 80 → 176 if hens use 17.49 like Sinergia/ÇHKD (decision 3) |
| Wild Animal Initiative | papers (ACE) → our bridge → "pain days" for wild animals, mostly insects and small fish | treated as SADs, i.e. person-equivalent days, × 0.0011 | 3, 7; explainer says species is "part of this guess" | make the guess raw disabling days, split by species group (insects, fish, other), `ced_*` raw template | 0.36 → about 0.005–0.03 (estimate: × 0.332 × 0.04–0.27) |
| ACE 2016: Albert Schweitzer Fdn | years of farmed-animal life spared (all species) | × 28.9 (caged-hen SADs/year, `@ace.caged_hen_sads_per_year`) × 0.0011 | 3 (every species and system = caged hen), 7 | split years by species from ACE 2016 calculators, per-species SADs per year of life, `ced_*` | down; size needs the split (fish and broilers dominate counts). 312 today |
| ACE 2016: HSUS | same | same | 3, 7 | same | down (cage-free hens part unchanged). 323 today |
| ACE 2016: ProVeg | same | same | 3, 7 | same | 3.6 today |
| ACE 2016: Vegan Outreach | same | same | 3, 7 | same | 29 today |

Inconsistencies across models, before any species question:

- **Same intervention, different SADs.** Shrimp electrically stunned: ALI 0.0973, SWP 0.00452 (21×).
  Meal replaced: SVB 0.084, Sinergia 0.902, DVF 2.58 (31×). Hen out of a cage: THL 7.93, Sinergia
  and ÇHKD 17.49 (2.2×). All are ACE's numbers, so the evaluator view keeps them; our view should
  use one shared fact per transition (facts/sad_factors.json already has them; **no model reads it**).
- **"Animals spared" → SADs**: 22.4 (Good Food Fund, DVF ratio), 8.1 (ACE 2016: 0.28 years × 28.9),
  8.7 (Sinergia), 0.8 (SVB). One quantity, four rates.
- facts/sad_factors.json, wellby_factors.json and moral_weights.json are not read by any model.

### 4.2 Global health (GiveWell) and HLI

| Set | Models | Path today | Breaks | Fix |
|---|---|---|---|---|
| GiveWell (hand-built + grant sheets) | 5 + 150 in `uov`, 1 in `daly`; ~100 location variants inherit | UoV ÷ 2 | **INV-8**: 19 iron/water sheets link GiveWell's 2.3 UoV/DALY to `$uov_per_daly` and pin 2.3 in the evaluator view, but the evaluator headline converts at our 2, so their DALY branch reads 15% high there. **INV-9**: about 15 sheets that value deaths don't read `$life_value_multiplier` (keyword scan; backlog A5 cleared some by hand); literal discount rates remain (backlog A3: Fortify 4.175%, One Acre Fund 6.5%, R4D 6%). INV-4: GiveWell moral weights written as literals (116.25262 in 33 sheets) where `@moral_weights` exists; fine where it is the sheet's own number with `expected`. | INV-8 engine fix (no change in our view). Declare `mortality`/`multi_year` and fix what INV-9 flags. |
| HLI | 4 hand-built + 3 grants, `wellby` | WELLBYs × 0.575 | **INV-9**: none reads `$discount_rate`; AMF-HLI's deaths don't respond to `$life_value_multiplier`. INV-4: `@wellby_factors` unused (literals). | Add both levers in our view, pinned in HLI's (decision 8). Link the literals. |

Nothing in global health changes the path to healthy years; the gaps are levers that don't reach
some models, so sliders move some charities and not their neighbours.

## 5. Decisions for the owner

1. **Species weights in our view: Rethink Priorities' medians relative to the chicken, for every
   species, replacing AIM's.** Recommend yes. It is what "chicken is the reference animal" means,
   it is one sourced table instead of weights hidden in each evaluator's SADs, and the evaluator view
   keeps AIM's. Cost: shrimp models fall about 6×.
2. **Store the chicken weight as 0.332, not as a multiplier of 1.** Recommend yes; formulas then say
   what they mean. The slider and URL are unchanged except the stored number (map old URLs).
3. **One shared SADs figure per physical change in our view** (hen out of a cage, broiler under BCC,
   meal replaced, shrimp stunned), with ACE's own number kept as `published`. Recommend yes, but
   first ask ACE why ALI's per-shrimp figure is 21× SWP's and why THL uses 7.93; if they differ for
   a real reason (baseline system, enrichment counted), they become separate facts.
4. **Wild Animal Initiative's pain days are raw, not person-equivalent.** Recommend yes: the animals
   are mostly insects and small fish and the 0.5 days are our guess. Add a species-group mix
   (judgment, with range). Its result falls 10–80×; it is already last, so the ranking barely moves,
   but the method stops being an exception.
5. **ACE 2016 models: species split, or out of the ranking until then.** Recommend showing them but
   not ranking them until split. They rank high (ASF 312, HSUS 323) on the assumption that every year
   of any farmed animal's life is a caged hen's.
6. **Species missing from RP's table.** Recommend cattle = pig ratio (1.55), turkeys and ducks =
   chicken, "farmed fish" = mean of carp and salmon (0.22), wild insects = black soldier fly (0.039)
   with bee and silkworm as range. Each a labelled judgment.
7. **Species uncertainty.** RP's intervals are huge (shrimp 0–1.149). Recommend using them in the
   uncertainty analysis, with no extra sliders: one slider, the chicken.
8. **HLI models get our value-of-life and discount levers in our view.** Recommend yes, pinned to
   HLI's in the evaluator view; otherwise "Lives" and "Timing" move GiveWell's AMF and not HLI's.
9. **The evaluator view converts at the evaluator's pinned rates** (INV-8). Recommend yes.
10. **AIM SADs version (2024–25 v1 vs 2026 v2).** Recommend recording it per model now, keeping each
    sheet's version in both views, and treating a move to v2 as a later, separate decision.

### Decided 2026-10-30 (owner)

1. Yes: Rethink Priorities' species weights relative to the chicken, in our view.
2. Yes: the chicken slider stores the chicken's weight itself (0.332); what readers see is unchanged.
3. Yes, as visible overwrites: our view uses the shared figure; the row is tagged "changed for
   consistency" and its info tip names the evaluator's own number and why we changed it.
4. Yes: Wild Animal Initiative's pain days get species weights like every other animal model.
5. Split the ACE 2016 models by species now (from ACE's 2016 sheets); unranked until split.
6. Yes: stand-ins for species Rethink doesn't cover, as recommended.
7. Yes: Rethink's ranges feed the uncertainty; the chicken is the only slider.
8. Yes: HLI models read the value-of-life and discount sliders in our view.
9. Yes: the evaluator view (used by our reproduction checks) converts at each evaluator's own rates.
10. Dropped: with one shared figure per physical change (3), the AIM version matters only as the
    evaluator's own number shown on overwritten rows.

### Decided 2026-10-31 (owner): one consistent way

The site never keeps an evaluator's own conversion, exchange rate or weight in our view where it has its own
version: the row reads ours (a shared assumption or fact), `published` or a pin keeps the evaluator's, and the
evaluator view still reproduces every `expected`. Every slider moves every model.

1. **Purely theoretical models.** A model of an idea written before the charity existed (Ambitious Impact's idea
   reports) is shown only if the charity runs the modelled programme today (cited on the model, `theoretical`) and
   no model of its actual work exists (another evaluator's or ours). Otherwise it is removed and listed in
   inventory/ambitious-impact-models.json as "not shown: <reason>" (scripts/aim-theoretical.py). Kept ones are
   flagged "purely theoretical" on the model and charity pages, in the model lists and on the rankings (a hollow,
   dashed dot and a caveat).
2. **Several programmes:** a kept model of a charity that runs more than one is weighted by funding share
   (`programs` with `weight_source`).
3. **AIM's co-founder and funding counterfactuals** are left out of our view (no other evaluator subtracts what
   the founders and the money would have done elsewhere, and it double-counts the comparison the ranking makes);
   founders' forgone pay is our staff-pay step.
4. **AIM's DALY-equivalents are decomposed** (scripts/aim-shared-rates.py): income at
   `ln(2) * $uov_per_ln_consumption / $uov_per_daly` (AIM's 1/2.3 or 1/2.5 pinned), deaths at
   `@moral_weights.uov_per_death_under5|over5 * $life_value_multiplier / $uov_per_daly` (AIM's DALYs per death in
   `published`; stillbirths, with no shared value, stay AIM's), every benefit discount rate at `$discount_rate`.
5. **INV-11** checks it.
6. **Money moved: one method** (2.8). Every slider moves every model, meta charities included: a dollar moved is
   worth its destinations' live results (`#model`), one share of new money, one value for where shifted money
   would have gone, one chance of success for a new organisation; career changes are the mirror of staff pay.
   CEARCH, The Life You Can Save and Better Futures Guide follow it; INV-12 checks it.

## 6. Order of work

1. **Sources.** Get AIM's SADs sheet (species weights, intensity weights, v1 and v2) from AIM or ACE;
   confirm the chicken and shrimp weights; ask ACE about the ALI/SWP and THL figures. Write
   facts/welfare_ranges.json (table above) and facts/aim_sads.json.
2. **Engine.** Unit `ced`, renamed assumptions, `rp_species_weights`, `output.native`/`species`,
   section kinds, `published` on formula rows, view assumptions in `headline` (INV-8).
3. **Tests in report mode.** src/engine/normalization.test.ts and scripts/normalization-audit.ts with
   an allowlist of today's violations; CI fails only on new ones.
4. **Chicken-only ACE models** (AWO, ÇHKD, THL): add `ced_chicken`, link `@sad_factors`. No numeric
   change; proves the pipeline end to end.
5. **Shrimp** (SWP, ALI): biggest change. Publish with a short note on the method page.
6. **Mixed species** (Sinergia, DVF, SVB, Good Food Fund): meals and animals by species.
7. **Bridges** (WAI, ACE 2016): raw-days template; ACE 2016 out of the ranking until split.
8. **Global health and HLI**: INV-8/INV-9 fixes; finish backlog A3/A5.
9. **Explain it.** /method describes the four layers. Each model page shows a generated "how this
   reaches healthy years" block from layers A–C, and the assumption explainers for the chicken
   slider and pain-day rate stop saying AIM's weights are "assumed to build it in".
10. **Turn the allowlist off** once it is empty.
