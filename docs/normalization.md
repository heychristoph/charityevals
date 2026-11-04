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
  pinned. Checked by INV-2c (an evaluator's conversion as an input), INV-2d (a constant beside a lever
  inside a formula), INV-13 (the same concept answered two ways across models) and INV-14 (a constant
  copied into five or more models with no shared fact), so every slider moves every model it should.
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

`healthy years = WELLBYs × $daly_per_wellby` (0.0652815 at the default; the unit's `to_common` is
`$daly_per_wellby * $uov_per_daly`, whose units of value cancel).

**Calibrated on depression (owner, 2026-10-31).** Most WELLBYs on the site are HLI's psychotherapy
results, and the same therapy is also modelled in DALYs (Founders Pledge, SoGive). Until October 2026
the rate was a calibration on GiveDirectly (1.15, fixed), and one standard deviation of depression for
a year was then worth 2 × 1.15 / 2 = 1.15 healthy years through HLI but 4.21 × 0.031 = 0.13 through the
GBD weights: 8.8 times apart. The owner anchored depression on the GBD disability weights, so the
WELLBY rate is now a slider ("1 point more life satisfaction for a year vs a year of healthy life", `$daly_per_wellby`, Exchange
rates, kind judgment) whose default makes the two routes agree:

```
one SD-year of depression, GBD route    = @depression.phq9_sd × @depression.dalys_per_phq9_point_year
                                        = 4.211710187 × 0.031 = 0.13056 healthy years
one SD-year of depression, WELLBY route = @wellby_factors.wellbys_per_sd_year × $daly_per_wellby = 2 × d
equal when d = 4.211710187 × 0.031 / 2 = 0.0652815 healthy years per WELLBY
```

**At any healthy-year rate (late October 2026).** The slider was first stated in units of value per WELLBY
(`$uov_per_wellby`, 0.130563), so the equivalence held only at `$uov_per_daly` = 2: moving "Healthy year vs
doubled-income year" moved the WELLBY models (∝ 1/`$uov_per_daly`) and not the DALY ones. It is now stated in
healthy years (`$daly_per_wellby`, "1 point more life satisfaction for a year vs a year of healthy life"), so
both routes agree at any value of a healthy year and WELLBY models, like DALY models, don't move with that
slider (INV-10). Old links are restated (÷ 2, src/lib/assumption-state.ts `LEGACY`). Nothing moves at the
defaults.

- `@depression.phq9_sd` (new, 4.21, range 3.5–5.5): the spread of PHQ-9 scores among people starting
  therapy, from METAPSY via SoGive; SoGive's StrongMinds model reads it too. One SD of depression is
  this many PHQ-9 points in every model.
- The default is a number (sliders have no formulas); src/engine/wellby-calibration.test.ts fails if it
  drifts from the facts, and checks that the unit converts in healthy years.
- Plausible range 0.05–0.275 healthy years (the GBD route with Founders Pledge's 0.0244 a point; HLI's own
  2021 moral-weights work, 0.55 doubled-income years at 2 a healthy year). Slider 0.025–1.5: it reaches
  HLI's own rate and the GiveDirectly calibration.
- **GiveDirectly, one figure.** The old calibration point is now the evaluator view: every HLI model
  pins `daly_per_wellby` at 0.575 (1.15 units of value at 2 a healthy year) in `evaluator.assumptions`, the rate at which HLI's GiveDirectly (7.55
  WELLBYs per $1,000) equals GiveWell's GiveDirectly in Kenya (`givedirectly`, 8.7 units of value per
  $1,000, 4.36 healthy years): HLI's results relative to cash, as HLI presents them. The site uses the one
  Kenya figure wherever it needs "GiveDirectly" as a calibration or benchmark (`common.benchmark`,
  `#givedirectly` in the meta models, this pin): HLI's cash estimate rests on Kenyan trials, so it is the
  like-for-like comparison. GiveWell's 2024 five-country aggregate (5.46, `givedirectly-cash-poverty-relief-2024`)
  is GiveWell's ranked figure for the charity, a different programme mix; calibrating on it would give
  0.72 (1.45 units of value). HLI's figures (WELLBYs, every `expected`) are unchanged.
- What it costs: at the default, HLI's GiveDirectly is 0.49 healthy years per $1,000 against GiveWell's
  4.36. HLI's and GiveWell's figures can't agree on both cash and depression; the owner chose depression.

**Deaths in WELLBY models.** A death is valued the site's way, `@moral_weights` for the age band ×
`$life_value_multiplier`, never through HLI's deprivationist WELLBYs (years × life satisfaction above a
neutral point; the neutral point stays in the evaluator view). The deaths' value, in units of value, sits in
the row `uov_valued_outside_wellbys` (an `ours` section; 0 in the evaluator view), and enters the WELLBYs
only through one fixed row, `wellbys_from_uov = uov_valued_outside_wellbys / ($daly_per_wellby * $uov_per_daly)`,
which the unit's conversion multiplies back: the deaths count exactly their shared value (÷ `$uov_per_daly`,
like GiveWell's deaths) at any WELLBY rate, and only the WELLBYs HLI measured move with the WELLBY slider.
It is the one row a model may read the WELLBY rate in (INV-2b's exception, checked by INV-17; INV-10
holds the deaths at 0 when it tests WELLBY models' shape). Until late October 2026 the deaths were put into
WELLBYs at a fixed anchor fact (`@wellby_factors.uov_per_wellby_anchor`, now removed), so under another WELLBY
rate the deaths in AMF-HLI and Taimaka-HLI moved with it. Deaths averted now are not discounted; grief averted
is part of what a death costs (as in GiveWell's weights) and is not added.

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
- Dogs and cats (November 2026, companion-animal models): Rethink Priorities publishes no figure, so
  `@welfare_ranges.dog_vs_chicken` and `cat_vs_chicken` are a ranged judgment anchored on Rethink's
  pig, the mammal it estimated (as cattle already are), labelled as ours.
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
V_heat        = Σ_band @death_ages.heat_share_<band> × @moral_weights.<band>           (59.7 UoV)
V_air         = Σ_band @death_ages.air_pollution_share_<band> × @moral_weights.<band>  (47.6 UoV)
healthy years = tonnes × [ $deaths_per_tco2e × $climate_heat_share × heat factor × (1 + @climate.nondeath_damages_vs_deaths) × V_heat
                         + ($deaths_per_tco2e × (1 − $climate_heat_share) × air_pollution_weight + extra_deaths_per_tco2e) × V_air ]
                × $life_value_multiplier / $uov_per_daly
```

**Deaths by age (late October 2026).** Each death is valued by the age it comes at, like every death on the
site (decision 2026-10-31 #4): GiveWell's moral weights by age (`@moral_weights`: under five 116.25, 5–14 134,
15–49 104, 50–74 42, and 42 above 74 for want of an older band) over the ages of the deaths (facts/death_ages.json,
GBD 2023 via Our World in Data: heat deaths 7% under five, 2% 5–14, 17% 15–49, 74% 50 and over; ambient
air-pollution deaths 3%, 0.2%, 5%, 92%). Today's heat-death ages stand in for the late-century deaths (our
judgment; older populations then would lower the value a little). Before: every death at GiveWell's all-ages
value for malaria deaths over five, 73.19. Heat deaths ×0.82, air-pollution deaths ×0.65. The same ages value the
deaths inside Ambitious Impact's GBD DALYs (Neev's kiln smoke, Concentric's tobacco, ARMoR's resistant
infections): our view splits each DALY into its illness part (`@death_ages.*_yld_share`, a judgment) and the
deaths behind the rest (`@death_ages.*_deaths_per_daly`, GBD 2023 / GRAM 2021), valued by age ×
`$life_value_multiplier` (row `gbd_daly_revaluation`, `published` 1), so the value-of-life slider moves them too.

**Deaths an evaluator counts itself** (`extra_deaths_per_tco2e`, a row every climate model has, 0 unless the
evaluator counts deaths): Founders Pledge counts about 26,000 US coal-plant air-pollution deaths for Clean Air Task
Force beside its tonnes. They are added per tonne at the air-pollution value, so they share the tonnes' wait and
credit steps, move with the value of a life and not with `$deaths_per_tco2e` (a waiver records that for INV-10).
The row is taken per year brought forward, so it reads no shared value (INV-2b). CATF's `air_pollution_weight` is
0: its coal retirements' smoke is inside Founders Pledge's death count.

**Judgments, labelled.** Damage that isn't death counts as 0 (`@climate.nondeath_damages_vs_deaths`, judgment,
range to the social cost of carbon's 1.06), a visible factor on the heat part. A cost per tonne that is an
organisation's past budget over its past wins is an average; the models built that way (Clean Air Task Force,
Coalition for Rainforest Nations, Carbon180, Evergreen 2021, Future Cleantech Architects, Good Food Institute,
Industrious Labs, Opportunity Green, Terrapraxis) multiply tonnes per dollar by the one shared
`$marginal_vs_past_average` (a slider since November 2026, 2.10; judgment, 50%, 18–100%), the same figure as The Life You Can Save's leverage
(`published` 1). Evergreen 2023 (a projected budget) and Woodland Trust (cost per tree delivered) don't take it.
Since late October 2026 the same factor applies in every cause (2.9, "Past average, every cause").
Evaluators' subjective best guesses (Terrapraxis's and Industrious Labs' cost per tonne, Evergreen's budget share
and years, Carbon180's spending shares) are filed as `judgment`. Won policies (CATF's rules and credit, CfRN's
REDD+ years) count `$win_years_counted` years, discounted (2.9).

**Terrapraxis is more than ten times its peers** because it values a single event (an implied $81,000 grant), not
an organisation's work, through three probabilities Founders Pledge guessed; its own conservative case is 55×
lower. Best guess kept, the reason stated on the model and write-up.

Before → after (healthy years per $1,000, our view at the defaults): Clean Air Task Force 0.12 → 4.2 (its US deaths
counted, 1.3; then 5 years per won rule); Coalition for Rainforest Nations 0.55 → 0.34; Carbon180 0.19 → 0.076;
Evergreen 2021 0.32 → 0.12, 2023 0.039 → 0.030; Future Cleantech Architects 2.2 → 0.78; Good Food Institute 0.019
→ 0.0077; Industrious Labs 0.86 → 0.30; Opportunity Green 3.0 → 0.99; Terrapraxis 77.6 → 25.7; Woodland Trust
0.0029 → 0.0024. Neev 2.0 → 1.9, Concentric Policies 17.4 → 14.7, ARMoR 9.1 → 8.1 (evaluator views unchanged).

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
- `@moral_weights.<age band>` over `@death_ages.*` (above; until late October 2026
  `@moral_weights.uov_per_death_over5`, 73.1914), read by `to_common` from the facts themselves (a unit's conversion may
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
  $90 is the same heat deaths valued at income-weighted, 2%-discounted prices (Rethink Priorities' re-run; a cross-check, no longer stored as a fact since no model reads it);
  Giving What We Can's 2016 estimate, 258,200 tonnes per life (a cross-check, no longer stored as a fact),
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

### 2.6 Anything else, and outcomes in several units

Research papers, people reached, courses, policy wins: these are not outcomes on the scale. They
must go through a bridge (layer B) into one of the units above, and the bridge's rows are ours,
in their own section, with ranges. A model with no bridge is shown but not ranked, as today.

**Several units in one model (November 2026).** A programme whose good comes in more than one unit
(a social service's wellbeing, income and health; a conservation programme's tonnes, illness,
livelihoods and catastrophic risk; illness in DALYs beside deaths in units of value) counts each
outcome in its own unit, sums it in an input row, and puts it into the model's output unit in one
**bridge row**, in an `ours` section, whose formula is exactly

```
<input> * (<to_common of the input's unit>) / (<to_common of the output unit>)
```

(`src/engine/bridges.ts` `bridgeFormula`; a factor of 1 is left out). The headline multiplies the
output unit's conversion back, so each outcome reaches the healthy years through its own unit's shared
conversion and moves with its own sliders only: a WELLBY bridged into a DALY model moves with
"1 point more life satisfaction…" exactly as in a WELLBY model, and not at all with "Healthy year vs
doubled-income year". The WELLBY models' `wellbys_from_uov` is the bridge from uov into WELLBYs (2.3).
Rows a bridge reads besides its input (a tonnes bridge's `air_pollution_weight` and
`extra_deaths_per_tco2e`) follow the conversion-row rule of 2.5. The build-cea families that count in
several units report in `daly` (domestic-services, humanitarian-relief, medical-research,
conservation, rights-advocacy); direct-health bridges illness in DALYs into uov (`uov_from_daly`), the
sanctioned route for illness averted in a charityevals model, which INV-2b used to block by forbidding
`$uov_per_daly` in any row. INV-2b, INV-10 and INV-17 check bridges (section 3); the lint refuses a
row named like a bridge (`dalys_from_<unit>`) that isn't the exact formula.

### 2.7 Shared conversions: one consistent way (October 2026)

The shared versions every model's view reads (section 1, "One consistent way"):

| Concept | Shared version | Value (range) | Source |
|---|---|---|---|
| Healthy year vs doubled-income year | `$uov_per_daly` (in rows only with the evaluator's implied rate pinned) | 2 (1–4) | judgment, assumptions |
| Income | `$uov_per_ln_consumption` | 1/ln 2 | GiveWell |
| Life satisfaction | `$daly_per_wellby` (healthy years per WELLBY; unit conversion only, slider; deaths in WELLBY models enter through `wellbys_from_uov`, INV-17) | 0.0652815 (0.05–0.275; slider 0.025–1.5) | calibrated on depression: a PHQ-9 SD-year worth the same via WELLBYs and via GBD weights at any `$uov_per_daly` (2.3); evaluator view of HLI models 0.575 (GiveDirectly, Kenya) |
| A death | `@moral_weights.<age band>` × `$life_value_multiplier`, the band of the death's age (an age mix from `@death_ages` where deaths of many ages are counted together: climate, GBD DALYs); `_over5` only for deaths of unknown age | 116.25 / 134 / 104 / 42 UoV | GiveWell moral weights |
| A death in a GiveWell sheet by finer age | `@moral_weights.givewell_age_<group>` (early, late and post-neonatal, 1–4, then five-year groups to 85+) and `givewell_neonatal` (84), × `$life_value_multiplier`; a sheet's age-weighted figure for a programme's deaths (diarrhoeal deaths, Bangladesh's over-fives, alcohol deaths) is the band's value × a measured `*_age_mix` row | 83.6 … 134.3 … 12.4 UoV | GiveWell's 2020 moral weights by age, as its sheets carry them; INV-2d |
| GiveWell's house constants | `@givewell_shared.*`: resource sharing (2), treatment costs averted (20%), investment of income gains (5%; nets 2.5%, vitamin A 3%, deworming 10%), years long-term gains last (40) and until they start, wage gain per IQ point, value of government / Global Fund / Gavi money, income-to-mortality ratio, value of a year of contraception by country (deaths part × `$life_value_multiplier`), a stillbirth (21), indirect deaths per diarrhoea death, GiveWell's discount rate for figures it states discounted | as listed | facts/givewell_shared.json, GiveWell's current sheets; every GiveWell sheet, and every other evaluator's true copy (SoGive's deworming, Founders Pledge's LEEP, Ambitious Impact's LaBri and Lead Research for Action) reads them; INV-13 |
| Disability weights | `@gbd_disability_weights.*` (tuberculosis, HIV on and off treatment, near vision loss) and `@depression.dw_*` | GBD 2019 | facts/gbd_disability_weights.json; every sheet that types a GBD weight reads it (Novah's depression and HIV weights since late October 2026) |
| Figures GiveWell's sheets share | `@givewell_common.*`: 293 figures typed under the same label into five or more of GiveWell's sheets (and SoGive's copies): supplemental adjustments, the GiveDirectly investment block, vaccine and net parameters, GBD death rates by age and cause (Bauchi state, the first column of GiveWell's New Incentives sheets), trial data | as typed | facts/givewell_common.json, generated from the sheets (INV-14); no value changed. Since 2026-11-02 each has a plain label, a unit, an explainer (what it is, where GiveWell uses it, the sheet and cell it is read from) and a section (/data groups them: vaccines, malaria, water, syphilis, deworming, cash, government spending, funding risks, value of information, development scoring, discount rate); the sheet's own row label is kept in `source.quote`, which INV-4 matches copies against. Kinds were reviewed by hand: 109 judgments (GiveWell's adjustments, weights, guesses and assumed shares), 94 estimates (studies, GBD, derived figures), 90 observed (survey coverage, trial counts, programme parameters, spending shares) |
| Staff pay below market | `@staff_pay.*`: share of cost and pay gap by kind of work (goods, staff-delivered help, research and policy, advocacy, media; GiveDirectly's and New Incentives' own) | as listed | facts/staff_pay.json, our judgment, read by 487 staff-pay rows; only matters with "Credit by share of resources" on |
| Past average vs the next dollar | `$marginal_vs_past_average` (slider, "How much the next dollar does compared with the average dollar so far") | 50% (18–100%) | judgment; every model whose `estimate_basis` is `past_average` (2.10) |
| Depression on the PHQ-9 | `@depression.dalys_per_phq9_point_year`; one SD = `@depression.phq9_sd` PHQ-9 points (4.21, 3.5–5.5) | 0.031 (0.0244–0.0435) | GBD 2019 weights for mild 0.145, moderate 0.396, severe 0.658 placed at the middle of the PHQ-9 bands (Kroenke et al. 2001; moderate covers 10–19), least-squares slope |
| "1× cash" | `@cash.uov_per_dollar` (new) | 0.00335 (0.00321–0.00872) | GiveWell's benchmark in 142 sheets; low FP's 2022 GiveDirectly, high GiveWell's 2024 GiveDirectly |
| A dollar to GiveDirectly (where money goes or would have gone) | `#givedirectly`, live | 0.00872 | GiveWell's GiveDirectly model on the site; every meta model reads it, never `@cash` |
| Currencies (pounds, euros, kroner, rupees; naira, Kenyan and Ugandan shillings, Rwandan francs, kwacha, meticais, leones) | `@fx.usd_per_<cur>_<year>` (its reciprocal where a sheet states local currency per dollar) | yearly averages | IRS where it lists the currency (2021–25 live table, 2015–20 archived), else World Bank WDI, official exchange rate (LCU per US$, period average, PA.NUS.FCRF); the year the evaluator's rate is for. A rate for a particular day (a grant date, "Google, 12 July 2024") stays the evaluator's in `published`; our view uses that year's average. `scripts/link-fx.py` |
| Prices over several years (a past average's yearly spending) | `@cpi.<iso3>_<year>`: amount × `@cpi.<iso3>_<Y>` / `@cpi.<iso3>_<year>`, then year Y's `@fx` | index, 2010 = 100 | World Bank WDI, consumer price index (FP.CPI.TOTL), 2005–2025. `scripts/link-cpi.py` |
| Time preference | `$discount_rate` | 4% (0–8%) | judgment |
| Household spillover of psychotherapy | `@wellby_factors.household_spillover_ratio_psychotherapy`, times the household of the place (next row) | 16.24% each | HLI (StrongMinds, Friendship Bench); read by HLI's, SoGive's and Founders Pledge's StrongMinds and HLI's World Spine Care |
| Household size | `@household_size.<place>`: one fact per place, the latest DHS Program survey (mean usual members per household; rural areas where the sheet counts rural households, a Nigerian state for New Incentives' state models); Botswana from its 2022 census; IRD's Sindh districts GiveWell's own | Uganda 4.7, Zimbabwe 4.1, rural Kenya 4.2, Northwest Nigeria 5.9, India 4.4 … | facts/household_size.json (2026-11-02); every model's household size reads its place's (INV-13 `household-size`), the evaluator's figure in `published`. Measured households of a programme's own participants (Bandhan, Village Enterprise's trial, GiveDirectly's Khongoni and Nampula surveys, PxD's farmers) and single Indian states' figures are other places or populations, waived with that reason |
| Earnings from learning | `@founders_pledge_2023.*` (salary +19.1% per SD × 17.5% replicability, 8 years' wait, 40 years, household ×2); prior weight `@founders_pledge_2023.prior_weight` (ours) | 50% (25–75%) | Founders Pledge's 2023 education method, its latest; every FP education model |
| Years a won reform counts | `$win_years_counted` (2.9) | 5 (1–20) | judgment, the middle of the evaluators' figures |
| Pledges kept | `@sad_factors.commitment_fulfilment_cage_free` / `_broiler` | 0.77 (0.38–0.96) / 0.3 (0.15–0.5) | Chicken Watch (Open Wing Alliance 2025), North America's rate as a judgment for pledges weighted by hens (decided 2026-11-02); judgment from CIWF ChickenTrack |
| Production per meal not eaten | `@sad_factors.production_response` | 0.76 (0.56–0.91) | Norwood and Lusk 2011 |
| Species | `@welfare_ranges.*` (2.4) | | Rethink Priorities |
| A dollar a meta charity moves | `moved_dollar_value` / `moved_dollar_net_value` (2.8): destinations read live (`#model`), `@meta.*` | 0.0413 global health (units of value per $); livelihoods and The Life You Can Save's split live | GiveWell 2024 funding; the organisation's own split |
| New money among money moved | `@meta.new_money_share` | 50% (35–80%) | Ambitious Impact, Effective Giving Incubation report |
| A new meta organisation's chance of success | `@meta.success_chance_new_org` | 55.7% (50–63.5%) | Ambitious Impact, Better Futures Guide CEA |

**Depression.** Evaluators that leave their own unit for health each turned depression into DALYs
their own way: Founders Pledge spreads GBD's severe weight over the whole PHQ-9 (0.658 / 27 = 0.0244 a
point, StrongMinds) or over the score of average severe depression (0.658 / 23.25 = 0.0283, Action for
Happiness); SoGive counts 23 points for a year as a full healthy year (1 / 23 = 0.0435, its "rather
experience nothing" score). Our view uses 0.031 a point for all three; a model measured in standard
deviations multiplies by the shared PHQ-9 spread, `@depression.phq9_sd` (4.21). HLI (StrongMinds,
Friendship Bench, Shamiri, Pure Earth's cosmetics) measures in SD-years × 2 WELLBYs (`@wellby_factors`) and
stays in WELLBYs; since 2026-10-31 the WELLBY rate's default is calibrated on this same conversion (2.3),
so one SD-year of depression is 0.13 healthy years in every model. Household spillovers of therapy are
counted the same way in all three StrongMinds models (`@wellby_factors` ratio, `@household_size.uganda`; Founders
Pledge's sheet counts none, so its model gets the household multiplier in our view, 1 in `published`).
Ambitious Impact's Kaya Guides counts QALYs per participant taken from economic evaluations (0.028 a year),
not a depression scale, so it has nothing to convert (unchanged, 1.07); its Novah sheet types GBD's moderate
weight 0.396, which reads `@depression.dw_moderate` (the same number). No GiveWell psychotherapy
model is imported.

**Two GiveDirectly figures, two concepts.** `@cash.uov_per_dollar` (0.00335) is the benchmark old sheets divided
by to state a result as "×cash": wherever it is used the multiple is multiplied back by the same figure, so it
cancels and only the sheet's units of value remain. `#givedirectly` (0.00872) is what a dollar given to
GiveDirectly does today on this site: the meta models use it for money that goes, or would have gone, to cash.
Neither replaces the other; no row reads `@cash` for a real dollar to GiveDirectly.

**Multiples of cash.** A result published only as a multiple of cash (FP's "10× GiveDirectly") is
multiplied by `@cash.uov_per_dollar`. Where a sheet made the multiple by dividing its units of value by
its own cash figure, that figure reads `@cash.uov_per_dollar` too (the sheet's in `published`), so the
benchmark cancels and our units of value are the sheet's. GiveWell's 2017 and 2019 sheets count everything in under-five life-equivalents and price one at
GiveDirectly's $11,663 (2019: $12,298), at that year's moral weights between deaths and income. Our view
re-prices it with the shared versions: GiveDirectly's cost per life-equivalent reads
`@moral_weights.uov_per_death_under5 * $life_value_multiplier / @cash.uov_per_dollar` (about $34,700), the
sheet's figure in `published`. A step stated as a multiple of cash keeps its multiple (the figure cancels);
a cost per life-equivalent that GiveWell labels as a multiple of cash (IDinsight's and Evidence Action
Beta's $2,000 / $5,000 / $10,000 / $1,000, "~5x / 2x / 1x / 10x cash") is a multiple of cash at GiveWell's own ratio
($11,663 / $2,000 = 5.83×, the label only says it is a cash multiple): GiveDirectly's cost divided by that
ratio, GiveWell's dollar figure in `published`, so it is valued through `@cash`; only a figure
with no cash meaning (Evidence Action India's $10,000 for the government's alternative use of funds) is
valued as an under-five death; per-outcome rows the sheet has
(Fortify's 2019 incubation sheet: a death at GiveWell's 2019 47.22, a year lived with disability at 2.84)
read `@moral_weights` and `$uov_per_daly` (pinned 2.84). Four of the five sheets (Evidence Action India,
Evidence Action Beta, IDinsight, IDinsight's New Incentives value of information) have no outcome rows at
all: they are leverage or value-of-information sheets whose only outcome is money moved, in multiples of
cash or life-equivalents, valued as above. Founders Pledge's Innovation in Government counts India in
life-equivalents with no cash meaning, so each is an under-five death.

Inventory of evaluator-internal conversions outside AIM's models (October 2026; AIM's are handled in
their own pass). "Before → after" is healthy years per $1,000 in our view at the defaults; the evaluator
view is unchanged unless stated.

| Evaluator, model | Conversion | Theirs | Shared version | Before → after |
|---|---|---|---|---|
| FP StrongMinds | depression, DALYs per PHQ-9 point-year; household spillovers (none) | 0.0244; 1 | `@depression` 0.031; `@wellby_factors` household multiplier 1.61 | 2.38 → 3.02 → 4.85 |
| FP Action for Happiness | depression per point; £→$ | 0.658/23.25 = 0.0283; 1.2911 | 0.031; `@fx.usd_per_gbp_2020` 1.2837 | 0.286 → 0.315 |
| SoGive StrongMinds (March 2024) | depression: 23 PHQ-9 points = 1 DALY; household 5.3 × 15% | 0.0435 a point | 0.031 a point × `@depression.phq9_sd`; `@wellby_factors` 4.73 × 16.24% | 0.816 → 0.582 → 0.568 |
| FP Development Media International | child death, 234 WELLBY-equivalents (63 DALY-eq.) | 234 | `@moral_weights.uov_per_death_under5 / $uov_per_daly` (58 DALY-eq.); pin `uov_per_daly` 1.9498 = 3.7/1.898 | 5.38 → 5.02 |
| FP Family Empowerment Media | maternal death, 41.1 DALY-eq. | 41.1 | `uov_per_death_age_15_49 / $uov_per_daly` (52; the band women give birth in); same pin | 41.5 → 37.0 → 52.5 |
| FP Suvita | under-5 death, 241.3 WELLBY-eq. (127 UoV) | 241.3 | `uov_per_death_under5` (116.25 UoV) | 32.8 → 30.0 |
| FP New Incentives | "10× cash" via FP's $164/WELLBY-eq. and 3.7 per DALY | 0.00321 UoV/$ per 1× | `@cash.uov_per_dollar`; output now `uov` (pin `uov_per_daly` 1.9498 keeps its evaluator view) | 16.5 → 16.8 |
| FP Pure Earth | "10× cash" via $164 and 1.898 | 0.00321 | `@cash` 0.00335 | 16.1 → 16.8 |
| FP The Life You Can Save | value of recipients' cash, FP's GiveDirectly | 0.00321 | `@cash` | 32.2 → 33.6 |
| FP Innovation in Government (Zambia) | 7 DALYs per child life, 3 ln(income) per DALY, GiveDirectly $11,663 per life-eq. | 1.86 UoV per ln(income) | `$uov_per_ln_consumption` 1.44; India's 2017 child-life equivalents valued as under-five deaths, `@moral_weights.uov_per_death_under5 × $life_value_multiplier` (116.25, was 39 through `@cash`) | 13.6 → 11.7 → 21.6 |
| FP GiveDirectly, Imagine Worldwide | FP's 1.898 per doubling | | undo of a figure FP publishes only in its units: waived | none |
| FP Imagine, GAIN, Iodine Global Network | own GiveDirectly figure | | cancels or off the path | none |
| GiveWell, 141 grant sheets | our multiply-back of the multiple of cash | 0.00335 literal | `@cash.uov_per_dollar` | none |
| GiveWell, 63 grant sheets | sheet's own cash figure behind the multiple (0.0033545, 0.003355, 0.00333, 0.00344, 0.0034, 33.5, 38.4, 334, 344, 3.4…) | as listed | `@cash` × scale; cancels | up to +15% (Fortify 2019 incubation 21.7 → 24.9); most ±0.1–2.7% |
| GiveWell Fortify Health iron consolidation | 1 DALY = 3 ln(consumption)-years | 4.33 UoV/DALY | `$uov_per_daly / $uov_per_ln_consumption`, pin 4.33 | 22.5 → 12.8 (evaluator view 24.4 → 11.3: it now converts at the sheet's own 4.33) |
| GiveWell Healthy Futures | neonatal death = 33.07 DALYs | 33.07 | GiveWell's own neonatal weight (84 UoV, already in the sheet) / `$uov_per_daly`, pin 2.54 | 4.92 → 5.40 |
| GiveWell Malengo | time discount 4% typed in; €→$ | 0.04; 0.8458 €/$ | `$discount_rate` (pin 0.04; 6.5% for later cohorts = ours + GiveWell's 2.5-point uncertainty premium); `1 / @fx.usd_per_eur_2021` | 8.96 → 7.42 |
| GiveWell, sheets with 2017/2019 life-equivalents | GiveDirectly cost per life-eq.; Fortify 2019: under-5 death 47.22, YLD 2.84 | 11,663; 12,298 | `uov_per_death_under5 × $life_value_multiplier / @cash` ($34,700); `@moral_weights`; `$uov_per_daly` pinned 2.84 | EA India 20.9 → 14.2, EA Beta 14.6 → 12.5 (its time discounting on top of the decay rate), IDinsight 16.1 → 16.1, IDinsight NI 19.3 (cancels), Fortify 2019 incubation 24.9 → 21.7 (evaluator view 21.7 → 15.3: it converts at the sheet's 2.84) |
| HLI Taimaka | lives saved left out of HLI's bottom line (a bonus: 65 WBp1k deprivationist, neutral point 2; grief 2.88) | 0 | our step: lives saved (HLI's 65 ÷ 231 WBs a life = 0.28 per $1,000) × `@moral_weights.uov_per_death_under5` × `$life_value_multiplier` into WELLBYs through `wellbys_from_uov` (2.3, INV-17; until late October 2026 ÷ an anchor fact); no grief on top | 10.5 → 49.6 → 17.6 (WELLBY rate and deaths; deaths alone at the old rate 28.6) |
| Years of benefit at face value (ACE ProVeg 2016; GiveWell Vital Strategies, Pure Earth, Rice KMC, CHAI TSUs, EA India, EA syphilis ×2, CPSP) | no time discount | 0 | `pv_annuity_due(1, years_discount_rate, years)`, the rate reading `$discount_rate` with 0 in `published` | ProVeg 1.14 → 1.13, Vital Strategies 21.0 → 17.7, Pure Earth 30.7 → 27.4, KMC 43.8 → 42.3, TSUs 44.8 → 43.9, CPSP 92.6 → 79.6, syphilis 50.7 → 48.2 / 48.7 → 44.3 |
| "Opportunities get worse" sheets (EA Beta, Accelerator, CHAI incubator, Fortify VoI 2021, IRD threshold, IRD ZM) | decay only, no time preference | | decay kept, `$discount_rate` on top (0 in `published`) | 15.7–42.6, each −7% to −20% |
| GiveWell age-specific moral weights (100.7, 127.3, 116…) | value of a death | | they are the shared curve (× `$life_value_multiplier`) | none |
| ACE The Humane League, Shrimp Welfare Project | £→$ | 1.2781 | `@fx.usd_per_gbp_2024` 1.277 | <0.1% |
| ACE Animal Welfare Observatory; Dansk Vegetarisk Forening | €→$; DKK→$ | 1.0822; 0.1452 | `@fx.usd_per_eur_2024` 1.0823; `@fx.usd_per_dkk_2023` 0.14514 | <0.1% |
| GiveWell New Incentives 2023-11, 2024-10, March 2025, Niger/Yobe; IRC (New Incentives template) | ₦ per $ (Central Bank of Nigeria, 25 April 2024) | 1,165 | `1 / @fx.usd_per_ngn_2024` 1,478.97 (WDI) | 35.5 → 35.2, 31.0 → 30.7, 40.7 → 40.5, 14.2 → 13.9, 45.6 → 45.3 |
| GiveWell New Incentives June 2023, 2024-04 sheet | ₦ per $ (Google, June 2019) | 362.3 | `@fx.usd_per_ngn_2019` 306.92 | 32.1 → 32.3, 35.1 → 35.3 |
| GiveWell New Incentives 2018 and 2019 sheets | ₦ per $ | 300 | `@fx.usd_per_ngn_2018` 306.08, `_2019` 306.92 | 17.1 → 17.2, 5.94 → 5.98, 14.1 → 14.1 |
| GiveWell One Acre Fund seedlings (2022, Rwanda VoI) | KES per $ (undated; the sheet's other rates are 2020 levels) | 108 | `@fx.usd_per_kes_2020` 106.45 | 16.6 → 16.9, 16.9 → 17.2 |
| GiveWell Malengo | UGX per $ 2021 (exchangerates.org.uk) | 3,586 | `@fx.usd_per_ugx_2021` 3,587.05 | <0.1% |
| GiveWell GiveDirectly 2024, v2 BOTECs | KES, MWK, MZN, RWF, UGX per $ 2017 (the World Bank's own) | WDI | `@fx.usd_per_<cur>_2017`, same figures | none |
| AIM Oxygen Access Project; Better Season Project; Opal Health | ₦ per $ (12 July 2024); $ per KES (Google, 5/12/2024); $ per old leone (undated, 2024 sheet) | 1,570; 0.00772; 0.0000508 | `@fx.usd_per_ngn_2024`; `@fx.usd_per_kes_2024` 0.007417; `@fx.usd_per_sle_2023 / 1000` 0.0000469 | 6.53 → 6.36, 62.6 → 64.1, 24.3 → 24.6 |
| FP Innovation in Government (India) | $ per crore rupees, June 2015 (OANDA) | 156,414 | `@fx.usd_per_inr_2015 × rupees_per_crore` 149,772 (IRS) | 40.4 → 39.4 |
| HLI StrongMinds, Friendship Bench, Shamiri, Pure Earth | SD-years → WELLBYs (2), household spillover, household size | literals equal to HLI's | `@wellby_factors`; WELLBYs at the depression-calibrated rate (2.3) | StrongMinds 22.2 → 2.52, Friendship Bench 26.7 → 3.03, Shamiri 18.4 → 2.09, Pure Earth 20.0 → 2.27 |
| HLI AMF | a death in WELLBYs (years × wellbeing above neutral, 133 WBs); deaths from GiveWell 2022 before leverage (0.335/$1,000); improving effects at HLI's upper bound (29.97) | | GiveWell 2026's deaths (0.232 before, 0.196 after leverage and funging, the switch on `$resource_shares`), × `@moral_weights` (81% under five) × `$life_value_multiplier` into WELLBYs through `wellbys_from_uov` (2.3, INV-17); improving effects at the middle of HLI's cases (15.0, range 0–29.97), discounted (start 3 years, over 20); HLI's in `published` | 42.8 → 11.2 (at the old WELLBY rate: 34.2 midpoint; about 29 with shared deaths) |
| HLI GiveDirectly, ACTRA, icddr,b, Pallium, Fortify Health, World Spine Care | WELLBYs at the GiveDirectly calibration | 1.15 | depression-calibrated rate (2.3) | 4.34 → 0.49, 17.8 → 2.03, 16.9 → 1.91, 20.2 → 2.29, 11.0 → 1.25, 9.88 → 1.12 |
| FP Educational Initiatives, Winning Start, Innovation in Government (Zambia) | 2019 education method: +10% earnings per SD × 80% additional, 5 years, one earner, simple-interest wait | 0.1, 0.8, 5, 1 | `@founders_pledge_2023` (19.1% × 17.5%, 40 years, ×2 household, compounded); 2019 figures in `published` | 1.04 → 3.81, 2.68 → 9.80, 21.6 → 39.4 |
| FP Imagine Worldwide Tanzania (ours) | weight on FP's prior | 25% (ours) | `@founders_pledge_2023.prior_weight` 50% (also Central Square, EIDU, Ubongo, unchanged) | 13.97 → 11.17 |
| SoGive RNLI, Breast Cancer Now, MND, Versus Arthritis, Compassion, deworming | life, QALYs, £ | | already shared (`@moral_weights`, `@fx`, `$uov_per_ln_consumption`); Versus Arthritis' 50 DALYs per life cancels | none |
| Climate, all (FP, Giving Green, SoGive) | wait until tonnes are avoided not discounted; Woodland pinned 0% | | `(1 + $discount_rate)^-years_until_avoided`; no pins (2.5) | Carbon180 0.227 → 0.187, CATF 0.190 → 0.119, CfRN 0.730 → 0.554, Evergreen 0.045 → 0.039 / 0.41 → 0.32, FCA 2.65 → 2.18, GFI 0.051 → 0.019, Industrious 1.18 → 0.86, Opportunity Green 3.52 → 3.01, Woodland 0.0039 → 0.0029 (evaluator view 0.110 → 0.0029) |

Left as the evaluator's, on purpose: evidence, not conversions, such as disability weights for single
diseases each used by one model (DMI's GBD weights, No Means No's PTSD 0.133), fade and "opportunities get
worse" rates, and GiveWell's costs averted per DALY. (Earnings per standard deviation of learning and HLI's
death values were on this list until 2026-10-31; both now read the shared versions, above.)

### 2.8 Money moved, success and career changes: one method (October 2026)

Meta charities (evaluators, fundraisers, effective-giving and research organisations) produce no outcome
of their own: they move money, and sometimes people, to charities that do. Before this section the
site valued a moved dollar three ways: CEARCH (Ambitious Impact) as EA dollars × 8 × GiveWell's cash
benchmark (our judgment 2–15), The Life You Can Save (Founders Pledge) as 40% of the money (our
judgment) × 5 × Founders Pledge's GiveDirectly, Better Futures Guide (Ambitious Impact) with Ambitious
Impact's 35% new money at 3× its pre-2024 GiveDirectly and a 55.7% chance of success, CEARCH with our
own 60%. Counterfactual shares, destinations and success chances differed for no reason. Now every
meta model values money one way, in a section of its own (`moved_money`, kind `ours`) whose rows are
written word for word from src/engine/moved-money.ts (`python3 scripts/moved-money.py <model> <global-health|livelihoods|tlycs> [net]`)
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
V = moved_dollar_value
    one cause:      value_global_health  (an organisation that only moves money to global health and poverty)
                    value_livelihoods, value_tlycs_recommended (below)
V_before = prior_dollar_value = @meta.prior_vs_cash × #givedirectly          (1×, from 0 to 3×)
net      = moved_dollar_net_value = new × V + (1 − new) × (V − V_before)     new = @meta.new_money_share = 50% (35–80%)
success  = @meta.success_chance_new_org = 55.7% (50–63.5%)                   for an organisation not yet proven
```

- *Destinations.* GiveWell's Top Charities weighted by what GiveWell directed to each in 2024
  ($150m, $87m, $54m, $12m of $303m, GiveWell's 2024 metrics post). At today's defaults: global health
  0.0413 units of value per dollar (20.7 healthy years per $1,000). GiveDirectly 0.00872.
- *Which destination.* Where the organisation's money goes: its own published split (The Life You Can
  Save), else the cause it works in (global health and poverty: CEARCH; livelihoods: Better Futures Guide).
  The across-causes mix this section first had (Giving What We Can's 2020–22 split, ACE's Recommended
  Charities, longtermist causes at 0) was removed on 2026-11-02 with its facts (`@meta.dest_share_*`,
  `@meta.value_longtermist`, facts/ace_fund_weights.json): since late October no model used it. An
  organisation that moves money across causes would rebuild it from where its own money goes.
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

**Late October 2026: destinations by evidence, one success step, one credit formula.**

- *Where the money goes, by evidence.* The Life You Can Save publishes its money moved by charity: its 2025 split
  (facts/meta.json `tlycs_moved_2025_*`, $24.1M, 19 charities modelled here for $13.4M, the rest valued at their
  average) replaces GiveWell's Top Charities (`value_tlycs_recommended`). Charities GiveWell ranks by several
  programmes (Evidence Action, Malaria Consortium) are read at GiveWell's programme-weighted figure, the one the
  rankings show, through `#owner:charity` (`#givewell:evidence-action`: one evaluator's figure for a charity,
  computed live from its ranked programme models and their locations, src/engine/ranking.ts `evaluatorFigure`);
  before, each was one sheet (Evidence Action's syphilis sheet, 0.0963 units of value per dollar, now 0.0591;
  Malaria Consortium's single SMC location, 0.0490, now 0.0803). The Life You Can Save 89.0 → 82.4. Better Futures Guide recommends
  livelihoods charities and has published none yet: the livelihoods charities the site models, live, equal weights
  (`value_livelihoods`: GiveDirectly, Bandhan, Village Enterprise, Raising the Village, One Acre Fund), not
  GiveWell's health charities. CEARCH's research and grants are global-health policy (hypertension and salt, lead,
  tobacco and alcohol taxes): global health, not the across-causes mix. No model used the mix after this, and it
  was removed on 2026-11-02 (above).
- *Leverage, latest and marginal.* The Life You Can Save's 3-year ratio is 9.19 (2025 report); a ratio of money
  moved over all costs is an average, and the next dollar moves less: `$marginal_vs_past_average` (2.10; judgment,
  50%, 18–100%; CEARCH's estimates for Giving What We Can 0.18 and 0.43, Giving What We Can's own view ~1), the same
  figure the retrospective climate models take (2.5). CEARCH and Better Futures Guide model a new organisation's
  whole costs, so they don't take it.
- *One success step* (`SUCCESS_ADJUSTMENT_FORMULA`): an expected value over success and failure for benefits and
  costs alike; a failed organisation moves `@meta.failure_money_share` (Ambitious Impact's 20%) and spends for
  `@meta.failure_years_run` (3) years. Better Futures Guide's sheet already does this (its 20% now reads the fact);
  CEARCH used to multiply benefits by the chance and charge all five years of costs.
- *One credit-by-share-of-resources formula* (`META_DONOR_COST_SHARE_FORMULA`): donors' new money moved per dollar
  (`moved_per_dollar × new_money_share`) and staff's forgone pay share the outcome, in all three models (before:
  TLYCS new money, CEARCH all money influenced, Better Futures Guide none).
- *Labelled judgments*: `prior_vs_cash` says "our judgment" on the model rows; Ambitious
  Impact's subjective inputs in CEARCH and Better Futures Guide are filed as `judgment`.

| Model | Our view before → after | Evaluator view | What changed |
|---|---|---|---|
| CEARCH | 99.4 (84.0 after 2.9) → 114 | 210 → 161 | global-health destination; one success step (+50%) |
| The Life You Can Save | 185 → 84.6 | 185 → 169 | its own split; 9.19; marginal 50% |
| Better Futures Guide | 62.7 → 27.4 | 27.9 | livelihoods charities live (0.0206 vs 0.0413 UoV per dollar) |

### 2.9 Won reforms: one way (October 2026)

A corporate pledge, a law or a regulation a campaign wins would probably have come some day anyway. Evaluators
answered "for how many years does the win count?" from 0.5 to 55 years for the same kind of win, discounted the
wait until it takes effect in some models and not others, used their own rate of pledges kept, and shared credit
in coalitions by rules that ignore the "Credit by share of resources" toggle. Now:

```
benefit of a win = per year once in effect × fulfilment × credit
                   × (1 + $discount_rate) ^ -years_until_effect
                   × pv_annuity_due(1, $discount_rate, $win_years_counted)
```

- **`$win_years_counted`** ("Years a won reform counts before it would have come anyway", Your values → How impact
  is counted): judgment, 5 (1–20), about the middle of the evaluators' own figures (Founders Pledge 0.5–1.5, ACE 3.9,
  5.5, 10, 15, 20.5, Ambitious Impact 35 and 55). Every model that credits a won commitment or policy reads it in our
  view; the evaluator's years are in `published` (or, where the sheet works with dates, the "date without the
  campaign" row becomes `expected date + $win_years_counted`, ACE's date in `published`: The Humane League, Animal
  Welfare Observatory). Ambitious Impact's year-by-year sheets weight each year after the five years to
  implementation by `max(0, min(1, years_counted - (year - 6)))`.
- **The wait** until the reform takes effect is discounted at `$discount_rate` in every such model: rows
  `*_years_until_effect` (judgment, from the commitments' deadlines, with ranges) and a discount factor with
  `published` 1 where the evaluator doesn't discount it. Already done by the evaluator: The Humane League, Animal
  Welfare Observatory, Aquatic Life Institute (its years counted now start at the stunning date), Ambitious Impact.
  Zero for meal policies (Sociedade Vegetariana Brasileira, Dansk Vegetarisk Forening, ACE 2016 institutional work).
- **Fulfilment**: `@sad_factors.commitment_fulfilment_cage_free` (0.77 since 2026-11-02, was 0.92; 0.38–0.96: Open Wing Alliance / Chicken Watch
  2025, commitments due by 2024, by count) and `@sad_factors.commitment_fulfilment_broiler` (judgment 0.3, 0.15–0.5:
  no tracker publishes a rate; CIWF ChickenTrack reports progress only). They replace every evaluator's own figure
  (0.25–0.9) in our view, and are added (with `published` 1) where the evaluator had none (ACE 2016). Pig and shrimp
  pledges keep the evaluator's figure: no shared record exists.
- **Coalition credit** follows `$resource_shares` like GiveWell's leverage and funging: off (default), the
  evaluator's credit share, filed as `judgment`; on, the charity's share of the resources all groups put into the
  win. Where the evaluator's split is already a share of the work (ACE's "% contribution made by other
  organisations", Sinergia's "% of Sinergia's collaboration", Aquatic Life Institute's "% of success contributed")
  the same share serves both modes. Where it is counterfactual responsibility (ÇHKD 100%, Dansk Vegetarisk
  Forening's 70% to others, ACE 2016's HSUS and ASF responsibility) a `*_resource_share` judgment with a range is
  used when the toggle is on. Wild Animal Initiative's credit per paper becomes, when on, a paper's cost over the
  field's spending until help arrives.
- **Diet change**: every meals-replaced or animals-spared path multiplies by `@sad_factors.production_response`
  (0.76, `published` 1), as charityevals' own diet template does, and, outside Latin America, by
  `meal_mix_vs_reference` (judgment; `published` 1): the shared per-meal figure is Sinergia's Latin American
  canteen meal. ACE's 2025 meal estimates have only Brazil, US and global tabs, in a later SAD version 9× lower, so
  only their ratio is used: US meals 1.5 (0.75–3); Denmark, Germany and China 1 (0.5–2), a labelled judgment.
- **ACE 2016 hens and broilers** read the shared SADs figures (decision 3): a cage-free hen-year 17.49 SADs (ACE 2016:
  its proportional improvement 0.105 × 28.9 = 3.03), a broiler under better standards 0.64 in 2025 SADs (ACE 2016:
  0.075 × 7/52 × 28.9 = 0.29), the broilers in a `ced_chicken_2025` pair. The ACE 2016 models are split by species
  (decision 5's condition), so they rank; HSUS's is now the highest animal figure on the site.
- **ACE's Recommended Charity Fund weights** were added here for the animal leg of the across-causes moved-money
  value (2.8); with that mix unused they were removed on 2026-11-02.
- **Also**: the cage-to-aviary hen figure's high end is now 28.94 (a caged hen's whole year), so the 17.49 best guess
  is the geometric middle of its range; the shrimp-stunning best guess stays at the bottom of its range, labelled as
  our judgment; stand-in species weights and the welfare-point bridge are labelled as judgments on every row that
  uses them.

Climate rows now read it (`pv_annuity_due(1, $discount_rate, $win_years_counted)`, the evaluator's years in
`published`, the wait being the model's `years_until_avoided`): Clean Air Task Force `years_brought_forward` (1.5),
`nsps_2012_years_forward` (0.92), `nsps_2016_years` (3), `ccs_years_forward` (1.5); Coalition for Rainforest Nations
`years_brought_forward` (3). Terrapraxis's `years_earlier` (5) cancels against the grant its page implies, so the
slider can't move it without a decision on the grant's size. Global health: GiveWell's Centre for Pesticide
Suicide Prevention `number_of_years_brought_forward` and Vital Strategies' years-forward rows read it (wave of
2026-10-31), and Founders Pledge's Innovation in Government Initiative `india_years_forward` (1.5) and
`zambia_years_forward` (3) too, the evaluator's years in `published`, with a one-year wait until each reform
takes effect discounted (`reform_years_until_effect`, judgment 1, 0–3; `reform_wait_discount`, `published` 1):
39.4 → 40.4.

**Past average, every cause (late October 2026).** The shared `@meta.marginal_vs_past_average` (since November 2026 the slider `$marginal_vs_past_average`, 2.10; judgment, 50%,
18–100%) applies to every model whose cost-effectiveness is an organisation's past spending divided by the wins
that spending achieved: campaigns, policies, corporate commitments, research. Besides The Life You Can Save and
the nine retrospective climate models (2.5), that is ACE's 2024/2025 estimates for Animal Welfare Observatory,
Aquatic Life Institute, ÇHKD, The Humane League, Sinergia Animal, Sociedade Vegetariana Brasileira and Wild
Animal Initiative, Founders Pledge's The Humane League (2015–2018 budget over its wins) and Innovation in
Government Initiative (budget to date over two reforms), and SoGive's Breast Cancer Now (UK research spending
1970–2009 over the healthy years it is credited with). Each takes the factor in an `ours` row
`marginal_vs_past_average` (`published` 1), so evaluator views are unchanged; each falls by half at the
defaults. Unit-cost delivery (nets, treatments, stunners installed, trees, chef training, people reached:
Dansk Vegetarisk Forening, Shrimp Welfare Project, Good Food Fund) and forward-looking estimates (GiveWell,
Ambitious Impact, HLI, ACE 2016's projections, Evergreen 2023) don't take it.

Before → after (healthy years per $1,000, our view at the defaults; evaluator views unchanged except Wild Animal
Initiative, whose bridge is ours in both):

| Model | Before → after | Main reasons |
|---|---|---|
| HSUS Farm Animal Protection Campaign (ACE 2016) | 213 → 746 | shared hen-year SADs (×5.8), broilers 0.64; years 3.87 → 5; fulfilment 0.92, wait 6 years; production response on meals |
| Albert Schweitzer Foundation (ACE 2016) | 48.6 → 150 | the same; wait 4 years |
| The Humane League (Founders Pledge 2019) | 129 → 684 | years 0.5–1.5 → 5, discounted with a 4–6-year wait; cage-free fulfilment 0.6 → 0.92 |
| Sinergia Animal | 675 → 379 | cage-free years 15 → 5 and a 4-year wait; pigs 1–22 years → 5 from each deadline; fulfilment 0.53 → 0.92; production response |
| The Humane League (ACE) | 126 → 122 | years brought forward 3–15 → 5; fulfilment per shared figures |
| Animal Welfare Observatory | 22.5 → 26.3 | the same |
| Sociedade Vegetariana Brasileira | 32.9 → 23.5 | years 5.5 → 5; production response |
| Çiftlik Hayvanlarını Koruma Derneği | 42.5 → 17.3 | years 20.5 → 5, a 4-year wait; fulfilment 0.63 → 0.92 |
| Centre for Aquaculture Progress (AIM) | 106 → 14.6 | 55 years → 5 |
| Animal Policy International (AIM) | 55.3 → 13.2 | 35 years → 5 |
| Vegan Outreach (ACE 2016) | 9.41 → 10.7 | production response 0.76 × US meal 1.5 |
| Aquatic Life Institute | 3.83 → 1.88 | 15 years from 2023 → 5 from the stunning date |
| Dansk Vegetarisk Forening | 2.09 → 0.87 | years 10 → 5; production response |
| ProVeg Deutschland (ACE 2016) | 1.13 → 0.89 | production response; years 3.87 → 5 |
| Good Food Fund | 0.478 → 0.363 | production response |
| Wild Animal Initiative | 0.0204 → 0.0172 | the ten years sooner discounted |
| CEARCH (reads ACE's charities live) | 99.4 → 84.0 | its animal destinations moved |


### 2.10 The next dollar vs a past average: a slider, and every model says what its dollar is (November 2026)

The shared figure for how much the next dollar does compared with an organisation's past average was a fixed fact
(`@meta.marginal_vs_past_average`). It is now a slider under Your values → How impact is counted, "How much the next
dollar does compared with the average dollar so far" (`$marginal_vs_past_average`, judgment, 50%, 18–100%), and the
fact is gone. Every model that read the fact reads the slider in the same `ours` row, the evaluator's 1 in
`published`, so evaluator views are unchanged.

**The rule.** Every charity model declares `estimate_basis` (variants inherit it):

- **`past_average`**: the result is an organisation's (or a field's) past spending divided by everything that
  spending achieved, where the achievements are not items more money buys again at a known price: won pledges,
  laws and rules, research results, money moved, a fixed service's lives saved. It reads the slider on the path to
  its output.
- **`marginal`**: the evaluator estimates the next grant, the next dollar or planned work: GiveWell's grant and
  programme sheets (with their funging, leverage and funding-bar logic), Ambitious Impact's idea reports,
  the Happier Lives Institute's predictive and expansion estimates, Founders Pledge's forward BOTECs and
  recommendation multiples, ACE's 2016 projections, Giving Green's 2022 Evergreen budget, SoGive's copies of
  GiveWell's deworming model. It does not read the slider: diminishing returns are already in it.
- **`unit_cost`**: a price per item delivered (a net, a treatment, a course, a pupil, a tree, a stunner, a
  sponsored child) times what an item achieves; more money buys more items at about that price. It does not
  read the slider.

Checked by INV-18: every `past_average` model reads the slider on the path to its output, halving it lowers our
headline, and the evaluator view keeps 1; no `marginal` or `unit_cost` model reads it, and none moves with it
except through another model it reads live (a meta charity's destinations, `#id`).

**Classification (250 charity models, 98 variants inheriting):**

| Basis | Count | Models |
|---|---|---|
| `past_average` | 23 | ACE: Animal Welfare Observatory, Aquatic Life Institute, Çiftlik Hayvanlarını Koruma Derneği, Sinergia Animal, Sociedade Vegetariana Brasileira, The Humane League, Wild Animal Initiative. Founders Pledge: The Humane League, Clean Air Task Force, Coalition for Rainforest Nations, Terrapraxis, Innovation in Government Initiative, The Life You Can Save. Giving Green: Carbon180, Evergreen 2021, Future Cleantech Architects, Good Food Institute, Industrious Labs, Opportunity Green. SoGive: Breast Cancer Now, **Royal National Lifeboat Institution**, **Motor Neurone Disease Association** (research part), **Versus Arthritis** (research part) |
| `unit_cost` | 32 | ACE: Dansk Vegetarisk Forening, Good Food Fund, Shrimp Welfare Project. Founders Pledge: Bandhan, Central Square Foundation, Clear Solutions, Educational Initiatives, EIDU, GiveDirectly, GAIN, Imagine Worldwide (Malawi, Tanzania), IRC, Iodine Global Network, No Means No Worldwide, Raising the Village, StrongMinds, Suvita, Taimaka, Teaching at the Right Level Africa, Ubongo, Village Enterprise, Winning Start. HLI: Friendship Bench, GiveDirectly, icddr,b, StrongMinds, Taimaka, Shamiri. SoGive: Compassion UK, StrongMinds (March 2024), Woodland Trust |
| `marginal` | 195 | GiveWell: all 156. Ambitious Impact: all 17. HLI: ACTRA, AMF, Fortify Health, Pallium India, World Spine Care, Pure Earth (both). Founders Pledge: Action for Happiness (scale-up), DMI, Family Empowerment Media, LEEP ($1.66 per child "in expectation" over future country campaigns), New Incentives, Pure Earth. ACE 2016: Albert Schweitzer Foundation, HSUS, ProVeg Deutschland, Vegan Outreach. Giving Green: Evergreen 2022. SoGive: the four deworming copies of GiveWell's model |

New past averages found by the audit (bold above), which the fact had missed: SoGive's RNLI (2019 spending over
2019 lives saved: the stations and campaigns already cover the coasts, so the next dollar saves fewer) and the
research parts of SoGive's two upper bounds (MND Association's £100 per healthy year is what past biomedical
research achieved; Versus Arthritis is credited with a share of all arthritis research's yearly result). The upper
bounds take the slider only on research's share of their healthy years, inside the factor that already discounts
the research lag. Borderline, kept as `unit_cost`: Dansk Vegetarisk Forening (chefs trained, though the meals count
for years like a won reform) and Shrimp Welfare Project (stunners installed under producers' commitments).

Before → after (healthy years per $1,000, our view at the defaults; evaluator views unchanged): the 20 models that
read the fact, none (same 50%). Royal National Lifeboat Institution 0.058 → 0.029 (ranked); Motor Neurone Disease
Association 1.45 → 0.84 and Versus Arthritis 8.40 → 7.59 (upper bounds, not ranked).

**What others do (sources in the slider's explainer).** GiveWell estimates the next grant and sets a funding bar in
multiples of cash that moves with the money available; ACE separates past cost-effectiveness from room for more
funding, and Giving What We Can's evaluation found that ACE "does not currently measure marginal cost-effectiveness
to a sufficient extent". CEARCH's estimate for Giving What We Can splits a budget into deciles with impact falling
from 10 to 1 (the last 30% of funding gives 6/55 of the impact, about 36% of the average per dollar) and gets a
marginal multiplier of about 13× against a 30× average. Rethink Priorities' cross-cause funding model uses a power
law, cost-effectiveness falling a fixed share per doubling of a fund's budget (10% for GiveWell, 46% for a
catastrophic-risk fund); under a power law the next dollar is (1 − elasticity) of the average whatever the size,
85% and 11% here. Open Philanthropy's prior for its own programmes is roughly logarithmic returns, under which the
ratio is (1 − B₀/B) / ln(B/B₀) for an organisation that has grown from B₀ to B: 63% after growing e-fold, 39% after
tenfold, 21% after a hundredfold. No evaluator adjusts the ratio by an organisation's age or size: there is no
age- or size-based adjustment here either (an open proposal, section 5, item 11).

### 2.11 Old estimates count less: a slider for an estimate's age (November 2026)

The rankings use each evaluator's newest model of a charity however old it is (src/engine/ranking.ts). HSUS's
newest is ACE's 2016 review, which made it the top animal charity although HSUS isn't among ACE's current
recommended charities. Owner decision 2026-11-02: an old estimate gets a discount the reader sets, like the
discount rate for future good.

**The slider.** Your values → Timing, "Each year since an estimate was made, it counts less by"
(`$estimate_age_discount`, judgment, **5% a year, range 0–15%**). A model's result is divided by
`(1 + $estimate_age_discount) ^ age`, written like `$discount_rate`, where `age` is the years from the model's
`source.published` to `common.estimate_age_as_of` in assumptions/default.json (2026-11-02). That date is part
of the data, bumped when the site's data is refreshed, never the build's clock, so a result is the same whenever
and wherever it is computed (server, browser, CI). A date given as a year or a month alone counts from its middle
(1 July; the 15th); a date after the as-of date is age 0. Every model with an output has a date (all 348 did
already: 331 full dates, 11 months, 6 years); scripts/check.ts fails on a model without one, and buildLibrary on
one it can't read. Ours only: the evaluator view never applies it.

**One place.** `modelConversion(lib, m, view)` (src/engine/model.ts) is the unit's conversion
(`headlineConversion`) divided, in our view, by the age divisor (`ageDivisorNode`). Everything reads it:
`headline` (the rankings, charity figures, sensitivity's swings, the joint range), `bottomLine(...).common`
(what `#id` and `#owner:charity` read, so a meta charity's live destinations), `usedAssumptions` (the slider is
a lever of every dated model), uncertainty (the slider is a driver through the conversion), the tree
(`headlineExprOf`: its root ends in "÷ For the estimate's age", whose parts are 1 + the slider and "Years since
the estimate was made"), the bulk stand-ins (scripts/summaries.ts keeps `source`, so the browser ages them the
same) and history (below).

- **Meta charities**: each destination read live is discounted by its own age (its common result already is),
  and the meta model's own estimate by its own age on top: The Life You Can Save (Founders Pledge, June 2023)
  takes 3.4 years of its own and each destination's. In the evaluator view neither applies: it reads its
  destinations at the reader's values with the slider at 0 (`readerValues`), however deep.
- **History** pages rebuild each past commit's library with that commit's assumptions. A commit from before the
  slider gets today's slider and as-of date (src/lib/history.ts `withAgeDiscount`): an estimate's age is how old
  it is now, so the line runs on into the page's headline instead of jumping at this commit.

**The default, from the site's data where it can.** Successive estimates of the same charity and programme by
the same evaluator, one per date, at least three months apart (programmes as `charities/*.json` declares them;
side sheets excluded), compared in the evaluator's own view:

| | GiveWell | Founders Pledge | HLI | Giving Green | ACE, SoGive, AIM |
|---|---|---|---|---|---|
| pairs | 41 (AMF, Evidence Action, Malaria Consortium, New Incentives, Helen Keller, …) | 1 (Imagine Worldwide) | 1 (Pure Earth) | 1 (Evergreen) | none: one estimate per charity on the site |
| median gap | 1.2 years | 1.9 | 0.6 | 1.0 | |
| median absolute change | 0.51 in ln (×1.67 or ×0.60) | 0.41 | 0.03 | 0.18 | |
| direction | 39% down; mean +0.08 in ln per revision, pooled +5.5% a year (our view −1.2%) | down | down | up | |

Revisions are large and not directional: GiveWell's estimates of a programme move by about two-thirds up or 40%
down per revision, and on average rise slightly. Noise without drift lowers how much an old estimate tells you
but not its expected value, so the revisions alone support 0%. What they can't see is selection: they only
cover estimates that were renewed. Evaluators re-check what they recommend every year or two (GiveWell revises
its top charities' models several times a year: the site has AMF models from 5 dates since 2023 and Malaria Consortium models from 7;
ACE moved its recommended charities to a two-year re-evaluation cycle in 2022; Founders Pledge says it
re-evaluates comprehensively about every two years) and some recommendations are withdrawn rather than renewed
(HSUS, ACE's other 2016 reviews). An estimate older than its evaluator's cycle is one the evaluator has not
re-affirmed. The data are too thin to measure that, so **the default is a labelled judgment**: 5% a year, so an
estimate inside its evaluator's two-year cycle loses under 10% (2 years: 0.91), and a ten-year-old one 40%
(0.61), less than one typical revision moves an estimate. 0% is the low end (what revisions support), 15% the
high (a ten-year-old estimate at a quarter, 0.25). The slider's explainer says the same.

Checked by INV-2a (headline = native × conversion × (1 + d)^−age; bottomLine's common result = headline ×
$uov_per_daly / 1000) and INV-19 (every model with a result in common units has a date; with the destinations it
reads live held, its headline at the default, 10% and 15% is its headline at 0 times exactly (1 + d)^−age; its
evaluator view, destinations included, never moves); src/engine/estimate-age.test.ts tests both on small
models, the tree, sensitivity and uncertainty.

**Before → after** (primary evaluator's figure, healthy years per $1,000, our view at the defaults; the median
ranked charity's primary estimate is 2.3 years old and its figure falls 11%):

| # | All, before | All, after |
|---|---|---|
| 1 | HSUS (ACE 2016) 637 | HSUS 391 |
| 2 | Sinergia Animal 166 | Sinergia Animal 153 |
| 3 | Albert Schweitzer Foundation (ACE 2016) 130 | CEARCH (AIM 2021) 87.1 |
| 4 | CEARCH 114 | Albert Schweitzer Foundation 80.0 |
| 5 | The Life You Can Save (FP 2023) 82.5 | SickKids (GiveWell 2026) 67.8 |
| 6 | SickKids 70.2 | Better Season Project (AIM 2025) 60.0 |
| 7 | Better Season Project 64.1 | The Life You Can Save 59.4 |
| 8 | Family Empowerment Media 62.1 | Family Empowerment Media 52.1 |
| 9 | The Humane League (ACE) 51.1 | The Humane League 48.7 |
| 10 | Ubongo 49.6 | Ubongo 45.8 |

Animal welfare: the same top four; Vegan Outreach (ACE 2016) 10.7 → 6.59 falls from 9th to 10th behind Shrimp
Welfare Project; Animal Policy International (AIM 2022) from 6th to 8th. Climate: Clean Air Task Force (FP 2018)
4.16 → 2.75 and Coalition for Rainforest Nations (FP 2018) 0.338 → 0.223 (5th → 6th, behind Industrious Labs).
Global health: The Life You Can Save 82.5 → 59.4 (2nd → 4th); Helen Keller and Malaria Consortium (GiveWell,
September 2026) move up into the top 10 past Development Media International. Biggest moves overall: Results for
Development (GiveWell 2019) 29th → 42nd, Vegan Outreach 68th → 78th, Better Futures Guide 26th → 34th, GAIN and
Iodine Global Network (FP 2021) 60th/61st → 67th/68th, Terrapraxis (FP 2021) 30th → 37th, Pure Earth (GiveWell
2021) 27th → 32nd; recent GiveWell sheets rise (AMF 37th → 28th, New Incentives 28th → 23rd). HSUS stays first
across the slider's range (at 15%: 157 against Sinergia's 132); it drops below Sinergia only above about 17.5%
a year. The slider alone doesn't settle HSUS: whether ACE's 2016 projection should rank at all is a separate
question, left to the owner.

### 2.12 Missing outcome data: built from the literature, always discounted (November 2026)

Owner decisions 2026-11-03 and 2026-11-04: every programme of every charity is modelled; there is no
partial coverage and no "no comparable measure". A programme with thin or no outcome data is **not**
valued at other models' result (the proxy rows `proxy_peer_result = median(#a, #b, #c)` of the first
version are retired): its family's chain is built from the research literature on that kind of work
(meta-analyses and trials of the intervention: effect per person or per dollar, persistence), with the
charity's own spending and whatever reach it reports, and wide ranges. Other site models may appear only
as a cross-check named in the explainer, never as the value.

Missing data is always discounted, thin data included, one way: by one shared slider,

- `$missing_data_discount`, "How much we count a programme whose results aren't measured" (accounting;
  default 50%, range 10%–100%, our judgment): an outcome resting on the literature or on judgment
  rather than on the charity's own data is probably not the typical one (programmes that measure their
  results tend to be the ones that work), and carries none of the programme's own detail.

**Measured or thin.** A branch's outcome is *measured* when the charity's own count of who got the
intervention (its reports, monitoring, a tracker) meets an effect with a credible counterfactual: its own
controlled evaluation, or trials of the same intervention delivered the same way (doses delivered and an
RCT's effect: measured). It is *thin* when its reach is a judgment (spending over an assumed cost per
person, no count of its own), its effect is a judgment, or the effect comes from research on other
delivery than the charity's; always for a programme with no outcome data. Money moved is measured
dollars valued at the destinations' live results (2.8) and takes no step.

**Rows.** Every build-cea skeleton has the canonical row `missing_data_adj` in `adjustments`, a factor
of `total_adj`; a model with several branches (build-cea Convention 4) has one per branch,
`<branch>_missing_data_adj` in that branch's adjustments (the policy skeleton's career changes:
`careers_missing_data_adj`), the canonical row then their outcome-weighted average for reading only.
Each marker is exactly `$missing_data_discount` (thin) or `1` (measured, the measurement named in its
explainer); nothing else. The lint (src/engine/lint.ts) makes the marker required, keeps it on the path
to the result, refuses any other formula and a 1 without a reason, flags a 1 whose branch's reach or
effect rests on judgment inputs alone (no sourced input, no shared fact), and flags any `proxy_*` row or
a value taken from a median of other models (`median(#…)`); models published before 2026-11-04 get
these as medium until rebuilt (`MISSING_DATA_RULE_DATE`). src/engine/templates.test.ts checks every
skeleton's result moves with the slider. The auditor (audit-cea) checks the cases the lint can't see: a
thin branch at 1 under sourced-looking inputs, and a branch reading a peer model's result as its value.

**One rule for every model, imported ones too (owner, 2026-11-04).** Until now only our own builds took
the slider, which penalised them against imports whose results are no better measured. In our view (never
the evaluator view) every comparable model's result is now *measured share + thin share × the slider*, by
the same definition of measured and thin. Built like the age and distance factors:

- **The field.** Every imported model has `missing_data: { thin_share, note }` (variants inherit it): the
  share of its result that is thin and why. `missingDataNode` (src/engine/model.ts) is
  `1 − thin_share × (1 − $missing_data_discount)` (the slider itself for a wholly thin model), exactly 1 at
  a slider of 1; `modelConversion` multiplies it in after the age divisor and the distance weight, so the
  headline, `bottomLine(...).common`, the rankings, sensitivity, uncertainty, `usedAssumptions` and the
  tree ("× For the part of the result that isn't measured", whose part is the thin share) read the same
  number, and every model page has a line ("Not measured for this charity (all of the result): × 0.50 at
  your settings"). charityevals' own models have no field (their factor is 1): their branches'
  `missing_data_adj` rows carry the step, so it never counts twice. History pages give a past commit's
  imports today's classification and slider (src/lib/history.ts), so their lines don't jump here.
- **Models read live, as for distance.** A charity that moves money ("destinations") reads each
  destination with its own step (the good is the destination's, as well measured as it is) and is itself
  measured (counted dollars); a stand-in is read at a slider of 1 (`refValues`) and the reading model's
  own classification applies once. The evaluator view reads every model at 1 (`readerValues`).
- **Classification** by scripts/missing-data.ts, a default per evaluator and programme with a reason per
  model (`--table` prints them): measured where the charity counts who got the intervention (or its cost per
  person comes from its own past delivery) and the effect is from a controlled evaluation of the charity
  or trials of the same intervention delivered the same way; thin where the reach is a projection for work
  not yet delivered, the effect a judgment or research on other delivery. GiveWell's top-charity and
  established-programme sheets (nets, chemoprevention, vitamin A, New Incentives after its trial,
  GiveDirectly, deworming, chlorination) are measured; malnutrition treatment is thin, as in our own builds
  (no trial measures it against none: the deaths averted rest on case series); its value-of-information,
  threshold, pilot and new-partner grant sheets thin; ACE's and Giving Green's campaign and policy
  estimates, Ambitious Impact's idea-stage ones and research funding thin; Founders Pledge, HLI and SoGive
  by model (an own RCT of the charity's programme, as for Bandhan, Village Enterprise, Friendship Bench,
  Shamiri, Imagine Worldwide, NMNW's course: measured). 348 imports: 178 measured (98 of them GiveWell
  variants), 167 thin, 3 partly thin (Educational Initiatives and NMNW 50%, Suvita 5%: its antenatal-care
  part).
- **The evaluator's evidence adjustments stay** (internal and external validity, replicability, a
  non-randomised design): they ask how well the trials transfer, which our builds ask in `evidence_adj`. A
  generic haircut for weak or missing evidence asks this step's question, so in our view it reads 1, the
  evaluator's figure in `published` ("changed for consistency"): GiveWell's 25% "overall skeptical
  adjustment" on Evidence Action's own coverage guess in its two iron and folic acid sheets, its 20%
  skeptical adjustment on Nutrition International's projected rice-fortification coverage, and Founders
  Pledge's halving of No Means No Worldwide for its unevaluated work (now its thin half).

Checked by INV-21 (every comparable model is classified: our builds by their markers and no field, imports
by `missing_data` with a reason and no row reading the slider; at 1 an import's factor is exactly 1 and an
own build's headline is its headline with every marker at 1; with live reads held an import's headline at
the default and 10% is its headline at 1 × (1 − s(1 − d)); the evaluator view never moves) and
src/engine/missing-data.test.ts (the factor, stand-ins and destinations, our builds, sensitivity,
uncertainty, the tree).

**Effect** (primary evaluator's figure per charity at the default 50%, against imports undiscounted and our
builds as they were): thin imports halve, so measured programmes rise past them. Top 10 after: HSUS (ACE
2016) 391 → 195, Sinergia 153 → 76.6, The Life You Can Save 58.7 → 51.6 (7th → 3rd; its destinations are
mostly measured), CEARCH (AIM) 87.1 → 43.5, Helen Keller 41.0 (12th → 5th), Jhpiego 40.0 (13th → 6th),
Albert Schweitzer Foundation 80.0 → 40.0, Malaria Consortium 39.4 (14th → 8th), SickKids (a GiveWell trial
sheet, thin) 67.8 → 33.9, Development Media International 33.8 (16th → 10th). Biggest moves: Better Futures
Guide 34th → 65th (21.0 → 5.43: thin itself and through its thin destinations), Imagine Worldwide 63rd →
36th, IRD Global 60th → 33rd, Nutrition International 70th → 44th, Precision Development 71st → 46th,
Unlimit Health 72nd → 48th, END Fund 73rd → 51st, Central Square Foundation 44th → 23rd, Bandhan 82nd →
62nd, GiveDirectly 85th → 70th, Sightsavers 31st → 20th, AMF 27th → 19th, Helen Keller 12th → 5th. Our
own builds (all thin or nearly) keep their figures and climb two to six places (Doctors Without Borders,
whose malaria, HIV, TB and hepatitis C branches are now measured, 0.501 → 0.668 and 104th → 98th).

### 2.13 Lives near and far: the reader's distance weight (November 2026)

Owner decision 2026-11-04: the reader can weigh lives, people's and animals', by how far they are from
them. Your values → Lives near and far:

- "Where you live" (`$home_country`, a dropdown, not a slider: the assumption schema's `control: "country"`):
  an ISO 3166 numeric code, **0 = not set**, which means no distance weighting at all. Stored as a number, it
  travels through the overrides, the URL (`?a.home_country=840`) and localStorage like any other value.
- "Each step further from you, a life counts less by" (`$distance_discount`, judgment, **default 0%**, range
  0–90%). Steps: your country (weight 1), the rest of your world region (× (1 − d)), the rest of the world
  (× (1 − d)²). Regions are the UN M49 sub-regions, Africa and Latin America split into their M49 intermediate
  regions (Northern America, Western Europe, Eastern Africa, South America …): facts/countries.json, with each
  country's alpha-3 and numeric code, name, region and 2024 population (World Bank; UN World Population
  Prospects 2024 where the World Bank has none).

**Where each model's beneficiaries are.** Every model with a result in common units has `beneficiaries`:
shares by ISO alpha-3 code summing to 1 (`{"KEN": 1}`, `{"USA": 0.5, "CAN": 0.25, "KEN": 0.25}`), with a
`"world"` share for a part spread by world population (`{"world": 0.94, "GBR": 0.06}`); `"world"` alone for a
benefit spread so (climate, research with global reach); or `"destinations"` for a charity whose good is the
money it moves. Animals count where the animals are. `beneficiaries_note` says where the field came from.
scripts/beneficiary-countries.ts fills it from what the models already carry, in this order: our own builds'
stated countries and their branches' shares of the result; climate and global research → world; a variant's
location; the family's shown location ("this page shows Togo"); the charity record's location entries; the
model's name; the location columns the evaluator's sheet reads (row labels "(Burkina Faso)"); country facts
read on the path; the summary; the sheet's notes; and only where nothing says, the charity's main country of
operation (a judgment; the script lists them). Several places from one source share equally; a variant that
names no other place inherits. A charity's figure over its programmes and locations needs nothing more: each
model's headline carries its own weight, so the combination follows from its parts.

**The weight, in one place.** `distanceNode` (src/engine/model.ts) is

    if($home_country = 0, 1, (1 − d)² + d × s + d × (1 − d) × S)

where s is the beneficiaries' share in the reader's country and S their share in the reader's region (the
country included; `region_of`, `population_share` and `region_population_share` in the formula language read
facts/countries.json). That is Σ share × (1 − d)^steps, written so it is exactly 1 with no country or at d = 0.
`modelConversion` multiplies the conversion (and age divisor) by it, so the headline, `bottomLine(...).common`,
the rankings, sensitivity, uncertainty, `usedAssumptions` and the tree ("× For where the lives it helps are",
whose parts name the shares in your country and region) all read the same number. The evaluator view never
applies it (`distanceNode` is undefined there, and `readerValues` reads other models with d = 0).

**Models read live (`#id`): one weight, never two.** A model reads another for one of two reasons, and the
rule follows:
- **A charity that moves money** (`"destinations"`: The Life You Can Save, Better Futures Guide, CEARCH): its
  good is each destination's, done where the destination works. It reads each destination with its weight
  (and the counterfactual, `prior_dollar_value = #givedirectly`, with GiveDirectly's), and has no weight of
  its own.
- **A stand-in** (every other `#id`: `proxy_peer_result`, 2.12, a US charity's unmeasured programme valued at
  GiveDirectly's result per dollar): the other model only supplies a value per dollar for this model's own
  work, whose beneficiaries are this model's. It reads the stand-in without its weight (`refValues`: d = 0),
  and its own weight applies once, to the whole.

Checked by INV-20 (every model with a result in common units has beneficiaries with known codes summing to 1,
or "world", or "destinations" only where it reads models live; with no home, or a home at d = 0, every
headline is exactly unchanged; at 50% with four homes and live reads held, the headline is the unweighted one
times the weight worked out country by country; the evaluator view never moves). src/engine/distance.test.ts
tests the weight, both kinds of live read, the evaluator view, sensitivity, uncertainty and the tree.

**Effect** (our view): at the defaults, none. Home United States at 50% a step: a US charity (United Way,
Habitat for Humanity, the American Red Cross) keeps its figure and every African programme takes a quarter,
so a US charity rises about 4× against AMF; Clean Air Task Force (world) takes 0.28, The Life You Can Save
0.25 (its destinations are almost all in Africa).

### 2.14 Consumption baselines and survivors' remaining life: one rule each (November 2026)

Owner decisions 2026-11-04, applied mechanically by script with the lint and invariants as the check (no
new audit rounds):

- **Consumption baselines** are the survey consumption of the people served wherever a survey exists: in
  the US the Consumer Expenditure Survey per person (`@united_states.ce_expenditure_per_person_2024`,
  $32,723, whose income-fifth ratios already scale it to the clients), in poor countries the World Bank's
  household-survey means (`@survey_consumption.*`). Where only national-accounts consumption exists, it is
  multiplied by the country's shared survey-to-national-accounts ratio (`@survey_consumption.survey_to_na_<iso3>`:
  the World Bank's survey mean over household final consumption per person in the same 2021 PPP dollars,
  ±15%; United Kingdom 0.84, Brazil 0.81, Mozambique 0.82, Ukraine 0.62, Bangladesh 0.52, and the median
  0.68 (0.52–0.82) for a country with no survey, Lebanon and Myanmar). A shared conversion, never thin data:
  it doesn't take `$missing_data_discount`. Templates (domestic-services, cash-income, humanitarian-relief)
  and our models: the American Red Cross (disaster relief: 0.00261 → 0.00454 years per $1,000, ×1.74),
  Habitat for Humanity US (×1.75), the Salvation Army US (×1.54), United Way (×1.16), and the drafts (St.
  Jude ×1.01, Habitat's awareness ×3.4: ×1.30 from its US branch and ×2.6 more once its verification round found the 13 Home Equals baselines still adding a share of the gap to the national accounts (the share, gap_top_share, is gone);
  the Red Cross's and Salvation Army's international work, whose shares were re-expressed on the survey
  scale, ×1.00). The national accounts stay where everyone's consumption is meant (the taxpayers who fund
  public money).
- **Survivors' remaining life.** A death averted is valued at its age band; where studies show survivors
  live shorter than their age group, × the condition's shared remaining-life ratio (facts/survival.json),
  elsewhere nothing: out-of-hospital cardiac arrest 0.8 (0.65–0.95; 84% relative ten-year survival),
  acute bleeding saved by transfusion 0.65 and transfusion-dependent patients 0.4 (Kamper-Jørgensen et al.
  2008), childhood cancer 0.86 (0.75–0.92; Yeh et al. 2020, 14% shorter life for 1990s diagnoses). Read
  by the Red Cross's blood and CPR branches (which had the same figures as their own judgments: no
  change), the British Heart Foundation's CPR and defibrillator branches (×0.98 for the model), St. Jude's
  care, global and graduate branches (draft ×0.86) and its cancer research branch (×0.91).

One model moved by more than 2×: Habitat's awareness and advocacy model (0.0021 → 0.0071 years per $1,000), above. The five models held back or changed after their last audit (the Red Cross's measles and international relief, St. Jude's patient care, Habitat's awareness, the Salvation Army's overseas work) then had a verification round of only those changes (build-cea step 4); all passed (two after one more fix and round) and are published.

## 3. Invariants

Each is a test over the built library (`buildLibrary`, as scripts/summaries.ts loads it). Put them
in src/engine/normalization.test.ts, plus a report mode (`tsx scripts/normalization-audit.ts`)
that prints every violation, so they can land before all models pass (with an allowlist that only
shrinks).

| # | Invariant | How to test |
|---|---|---|
| INV-1 | Every ranked model reports in a ranked unit: `uov`, `daly`, `wellby`, `ced` or `tco2e`. | For each model with an `output` that `rankingPlan` can pick: `output.unit ∈ RANKED`. |
| INV-2 | The headline is the native result times the unit's standard conversion, and nothing else converts. | (a) `headline(m) === compute(m)[output] × evaluate(headlineConversion(unit))` for every model, both views, times in our view the estimate's age factor `(1 + $estimate_age_discount)^−age` (2.11), and `bottomLine(m).common` (what `#id` reads) the same number in units of value. (b) No row's `assumptionDeps` contains a cross-cause rate (`chicken_vs_person`, `daly_per_sad`, `daly_per_wellby`, `sads_per_animal_spared`, the climate rates), and `uov_per_daly` only under INV-5. The one sanctioned model input to a conversion is a row the unit's `to_common` names by fixed id (`tco2e`: `air_pollution_weight`, 2.5): in an `ours` section, with no shared assumption feeding it. Bridges are exempt (2.6): a row in an `ours` section whose formula is exactly `<input> * (<to_common of its unit>) / (<to_common of the output unit>)`, which the output unit's conversion cancels; WELLBY models' `wellbys_from_uov = uov_valued_outside_wellbys / ($daly_per_wellby * $uov_per_daly)` is one (2.3, INV-17). Rows a bridge reads besides its input follow the conversion-row rule. (c) **One consistent way**: no evaluator's own conversion moves our headline. Every input row on the path whose label names a conversion (exchange rate between outcomes, value of a death, depression scale to health, cash benchmark, pound/euro rate, time discount rate) and every read of a fact holding an evaluator's conversion (`@founders_pledge.wellbys_per_daly`, `wellbys_per_doubling`, `gd_cost_per_wellby`) is moved ×1.25 in our view; the headline must not move. Rows reading the shared version are formulas and pass; a rate applied and undone cancels and passes. Checked false positives (measurements) are waived with reasons. |
| INV-3 | Every animal model passes through the species step, once per species, from the shared table. | For `unit = ced`: the model declares `output.species` (e.g. `["chicken","pig"]`). For each, a row `ced_<s>` exists, its formula equals the template for its source (`aim` or `raw`) after whitespace normalisation, it reads `@welfare_ranges.<s>_vs_chicken`, and it is upstream of the output. No other row reads `@welfare_ranges.*` or `@aim_sads.*`. Every path from a row whose unit is SAD or days of pain to the output passes through a `ced_*` row. |
| INV-4 | No literal stands in for a shared number. | An input row whose value is within 0.2% of a fact's or assumption's low/best/high (0.003355 for `@cash`'s 0.00335) and whose label resembles the shared label, or uses one of its synonyms (ln(consumption) or a doubled income for `$uov_per_ln_consumption`; a DALY or disability weight, "(DW)", for the GBD weights; GiveDirectly's cost-effectiveness or a cash benchmark for `@cash`), must be a formula reading the fact, with the evaluator's literal in `published`. Facts made from identical labels (facts/givewell_common.json, staff_pay.json) match only rows with that label (the sheet's wording, in `source.quote` where the fact's own label has been rewritten), on their best value. Also: no formula contains a constant equal to a fact or assumption value (distinctive, or under a close label; exponents and one- or two-digit constants under labels only loosely alike are arithmetic). |
| INV-5 | The evaluator view uses the evaluator's own rates. | For every model with an `evaluator`, every non-toggle assumption read inside layer E is either pinned in `evaluator.assumptions` or has a default equal to the evaluator's value (check: `expected` still reproduces when the assumption is moved ±50% in the charityevals view only). |
| INV-6 | The evaluator's bottom line reproduces. | Model declares `output.native` (the native row). That row, or its direct inputs, carry `expected`; `scripts/check.ts` already checks `expected` in the evaluator view. |
| INV-7 | Our rows are visibly ours. | Every row strictly between `output.native` and `output.row` is in a section of kind `accounting`, `bridge` or `conversion`, and has no `expected`. Every row upstream of `native` is in an evaluator section. |
| INV-8 | One view, one set of numbers. | `headline(m, av, {}, "evaluator")` converts with `viewAssumptions(m, av, "evaluator")`, not `av` (fails today: see 4.2). |
| INV-9b | Benefits over several years are discounted. | Each input on the path whose label counts years a benefit lasts (years of change/impact/benefit/funding, number of years, duration) is moved ×1.25 at a 0% and an 8% rate: if the headline rises by the same factor at both, the years are summed at face value. |
| INV-5b | Every evaluator pin is read. | Each key of `evaluator.assumptions` is read by some row or by the unit's conversion; an unread pin is a lever the model should read or dead weight. |
| INV-9 | Shared levers reach every model they apply to. | Models declare `mortality: true` / `multi_year: true` (lint suggests them from keywords: death, mortality, years of impact). Declared mortality → reads `$life_value_multiplier`; declared multi-year → reads `$discount_rate`. |
| INV-10 | Each slider moves exactly the models it should, in the expected shape. | Property test at defaults: every `ced` model's headline is linear in `$chicken_vs_person` and in `$daly_per_sad`, and independent of `$uov_per_daly`, `$daly_per_wellby`, `$uov_per_ln_consumption`; every non-animal model is independent of `$chicken_vs_person` and `$daly_per_sad`; WELLBY models, with the deaths they value outside their WELLBYs held at 0 (INV-17 checks those), are linear in `$daly_per_wellby` and independent of `$uov_per_daly`. Every bridge's input (2.6) is held at 0 for the output unit's expectations, and the part it brings in moves as a model of its own unit would. |
| INV-11 | No evaluator-internal exchange rate survives in our view where a shared one exists. | Every evaluator's model (Ambitious Impact's only until 2026-11-02). Every row on the path to the output whose label states an income-to-DALY rate, a value of a death averted (DALYs or years of life per death), a value of a stillbirth averted or a pound/euro exchange rate reads the shared version (`$uov_per_ln_consumption`, `@moral_weights.*`, `@givewell_shared.uov_per_stillbirth`, `@fx.*`), itself or through a row it is computed from. |
| INV-12 | Money moved and career changes are valued one way (2.8). | Every model (not variants) whose native unit or a row on its path names money moved, raised, influenced, affected or shifted, a leverage ratio, a gross multiplier or EA donations reaches its output through `moved_dollar_value` with one of the two shared formulas; every shared row it has (src/engine/moved-money.ts) has the shared formula word for word; every row on its path stating an organisation's chance of success reads `@meta.success_chance_new_org`. A row on the path about career changes needs `career_change_value` with the shared formula. A charity's own fundraising (Ansh) and GiveWell's value-of-information sheet (IDinsight) are waived with reasons. Tiny-model checks in src/engine/model-refs.test.ts. |
| INV-2d | No literal times a lever. | Every formula row on the path is split into its product and quotient chains and its function calls' argument lists; a chain holding both a non-toggle shared assumption and a constant outside lint's allowed literals (`8 * $life_value_multiplier`, `0.005 * $discount_rate / 0.04`, `pv_annuity_due(1, $discount_rate, 5)`) is flagged: the constant reads the shared fact (evaluator's figure in `published`) or becomes its own labelled input row, where INV-2c, INV-4 and INV-13 see it. Late October 2026: 437 rows in 100 models, GiveWell's moral weights typed beside the lever (now `@moral_weights` bands and GiveWell's curve by age, the sheet's figure in `published`), old per-staff columns and 2018/2019 units, `ln(2)` written as a number. |
| INV-13 | Same concept, same value across models. | Rows on the path (not variants) whose label names one of a curated list of concepts several evaluators state (resource sharing, treatment costs averted, investment of income gains, years long-term gains last, wage gain per IQ point, value of government / Global Fund / Gavi money, income-to-mortality ratio, value of a year of contraception, of a stillbirth, indirect deaths per diarrhoea death, household spillover of therapy, pledges kept, prior weight on education studies, depression per PHQ-9 point) read the concept's shared fact, the evaluator's figure in `published`. A place or year the facts don't cover is the only reason to differ, recorded as a waiver with the reason. Late October 2026: 81 rows; deworming's 10% investment share became a fact, the true copies in SoGive's, Founders Pledge's and Ambitious Impact's models read `@givewell_shared` (the 18 INV-4 waivers for them are gone), GiveWell's 2022 water sheets take the current 20% treatment costs averted. |
| INV-14 | No house constant without a shared fact. | Input rows on the path (not variants), grouped by whose figure it is (SoGive's copies of GiveWell's sheets count as GiveWell's), label (places and "overall" dropped) and value: a group in five or more models is a constant copied by hand and becomes a shared fact every copy reads. Round structural numbers (lint's allowed literals) and numbers that define their row (an arbitrary donation's size, a "10x bar" of 10) are exempt. Late October 2026: facts/givewell_common.json (298 figures, read by 2,275 rows in 118 models) and facts/staff_pay.json (our staff-pay defaults by kind of work and two charities' own shares, read by 487 rows); no value changed. |
| INV-15 | A ranked model far above its peers says why. | Every model the rankings use whose headline is more than 10× the median of the other ranked models of its cause (at least three) states the reason in its summary, "more than ten times its peers because …". Late October 2026: Terrapraxis (one event), Clean Air Task Force (Founders Pledge's counted deaths), Sinergia, The Humane League (Founders Pledge), HSUS and Albert Schweitzer Foundation (ACE 2016): cage-free pledges move many hen-years per dollar. |
| INV-16 | Side sheets never rank; the ranked column is the grant's. | Every model the rankings use has at most one row on its path that reads like a value-of-information or decision sheet (future funding bar, CE of reallocated funding, value of information, probability the decision changes, P(… x cash)); and where its native row's label names a place in parentheses, the model's name, id or title names that place too when it names any. Complements `isSideSheet` (title and template) in src/engine/ranking.ts. |
| INV-17 | Deaths in WELLBY models don't move with the WELLBY rate. | A WELLBY model that values a death (a row on the path reads `@moral_weights.*` or `$life_value_multiplier`) values it in units of value in `uov_valued_outside_wellbys` and converts it only in `wellbys_from_uov`; by computation, the deaths' part of the headline doesn't move when `$daly_per_wellby` moves, and the rest (every bridge's input at 0) doesn't move with `$life_value_multiplier`. Any other model with a bridge from uov values its deaths only upstream of that bridge. |
| INV-18 | Past averages, and only past averages, read the next-dollar slider (2.10). | Every model with an output has `estimate_basis` (variants inherit it). `past_average`: a row on the path to the output reads `$marginal_vs_past_average`, halving it lowers our headline, and every row reading it has `published` (or the evaluator pins it). `marginal` and `unit_cost`: no row reads it, and the headline doesn't move with it except through a model read live (`#id`). |
| INV-19 | An estimate counts less by its age, in our view only (2.11). | Every model with a result in common units has `source.published`. With the models it reads live (`#id`) held at their values at 0, its headline at the slider's default, 10% and high end is its headline at 0 times exactly `(1 + d)^−age`, age from `source.published` to `common.estimate_age_as_of`; its evaluator view, destinations included, is the same at every setting. |
| INV-20 | Lives near and far are weighed by where they are, in our view only (2.13). | Every model with a result in common units has `beneficiaries`: shares by ISO alpha-3 codes in facts/countries.json (and `"world"`) summing to 1, `"world"`, or `"destinations"` when it reads models live. With `$home_country` = 0 at 50% and 90%, and with homes United States, Nigeria, India and the United Kingdom at 0%, every headline is exactly its headline with neither. At 50% a step with each of those homes, live reads held, the headline is the unweighted one times Σ share × (1 − d)^steps worked out country by country (1 for "destinations"); the evaluator view never moves. |
| INV-21 | Missing outcome data: one rule for every model, in our view only (2.12). | Every model with a result in common units is classified: charityevals' own by their `missing_data_adj` rows (and no `missing_data` field), every import by `missing_data` (own or inherited) with a reason and no row reading `$missing_data_discount`. At 1 nothing moves (an import's factor is exactly 1; an own build's headline equals its headline with every marker at 1). With live reads held, an import's headline at the default and 10% is its headline at 1 × (1 − thin_share × (1 − d)); the evaluator view never moves. |

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
| ACE 2016: Albert Schweitzer Fdn | years of farmed-animal life spared (all species) | × 28.9 (caged-hen SADs/year, Ambitious Impact's; the fact is gone since the models read `@sad_factors.sads_per_hen_year_cage_to_aviary`) × 0.0011 | 3 (every species and system = caged hen), 7 | split years by species from ACE 2016 calculators, per-species SADs per year of life, `ced_*` | down; size needs the split (fish and broilers dominate counts). 312 today |
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
| HLI | 4 hand-built + 3 grants, `wellby` | WELLBYs × 0.575 (since 2026-10-31: × 0.0653, 2.3) | **INV-9**: none reads `$discount_rate`; AMF-HLI's deaths don't respond to `$life_value_multiplier`. INV-4: `@wellby_factors` unused (literals). | Add both levers in our view, pinned in HLI's (decision 8). Link the literals. |

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

11. **Open (November 2026): should the next-dollar share depend on an organisation's growth, age or size?**
    No evaluator does this, and none of the published methods ties the ratio to age or size; only Open
    Philanthropy's log-returns prior makes it depend on how far spending has grown. Proposal: keep the one
    slider, and add, per past-average model, the organisation's spending at the start and end of the period
    the estimate averages over (B₀, B, from annual reports); under log returns the ratio is
    (1 − B₀/B) / ln(B/B₀), shown beside the slider's value, used only if the owner adopts it.
    **Decided 2026-11-02: not now.** One slider for every past-average model; revisit if an evaluator
    publishes evidence that the ratio depends on growth, age or size.

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
   `@moral_weights.<age band> * $life_value_multiplier / $uov_per_daly`, the band matching the age of the death
   (GiveWell's 2020 moral weights by age: under five, 5–14, 15–49, 50–74; AIM's DALYs per death in `published`;
   a stillbirth at the shared `@givewell_shared.uov_per_stillbirth`, since 2026-11-02), every discount rate, AIM's fixed 4% for costs included, at
   `$discount_rate` (scripts/aim-shared-rates-2.py). No benefit grows with the economy in our view (Learning
   Alliance's 3% offset is AIM's only).
5. **INV-11** checks it.
6. **Money moved: one method** (2.8). Every slider moves every model, meta charities included: a dollar moved is
   worth its destinations' live results (`#model`), one share of new money, one value for where shifted money
   would have gone, one chance of success for a new organisation; career changes are the mirror of staff pay.
   CEARCH, The Life You Can Save and Better Futures Guide follow it; INV-12 checks it.
7. **Depression is anchored on the GBD disability weights.** The WELLBY rate is a slider, in healthy years
   per WELLBY (`$daly_per_wellby`, 0.0652815), whose default makes a PHQ-9 standard-deviation-year worth the
   same through HLI's WELLBYs as through `@depression` at any value of a healthy year (2.3); HLI's evaluator
   view converts at the GiveDirectly calibration (0.575, Kenya). Deaths in HLI models don't move with it (INV-17).
   Deaths in HLI models are valued with `@moral_weights` × `$life_value_multiplier` (AMF-HLI, Taimaka-HLI),
   AMF-HLI counts GiveWell's current deaths after leverage and funging and the middle of HLI's improving
   cases; household spillovers of therapy are counted in every StrongMinds model; Founders Pledge's maternal
   deaths sit in the 15–49 band; Founders Pledge's education models all use its 2023 method and one prior
   weight.

### Late October 2026: the checks that close the gaps (INV-2d, INV-13 to INV-17)

The owner's rule ("one consistent way") is now checked where the earlier invariants couldn't see: a constant
beside a lever inside a formula (INV-2d), one concept answered two ways (INV-13), a constant copied by hand
into five or more models (INV-14), an outlier with no stated reason (INV-15), a side sheet or another
location's column in the ranking (INV-16), deaths in WELLBY models moving with the WELLBY rate (INV-17). The
allowlist stays empty; waivers are only checked false positives, each with its reason.

Ranked models that moved more than 5% (healthy years per $1,000, our view at the defaults; evaluator views
unchanged):

| Model | Before → after | Why |
|---|---|---|
| Sinergia Animal | 379.5 → 189.7 | past average × `@meta.marginal_vs_past_average` (2.9) |
| The Humane League (Founders Pledge) | 683.8 → 341.9 | the same |
| The Humane League (ACE) | 122.0 → 61.0 | the same |
| Animal Welfare Observatory | 26.3 → 13.2 | the same |
| Sociedade Vegetariana Brasileira | 23.6 → 11.8 | the same |
| Çiftlik Hayvanlarını Koruma Derneği | 17.3 → 8.6 | the same |
| Aquatic Life Institute | 1.88 → 0.94 | the same |
| Wild Animal Initiative | 0.0172 → 0.0086 | the same |
| Breast Cancer Now (SoGive) | 0.060 → 0.030 | the same |
| The Life You Can Save (Founders Pledge) | 89.0 → 82.4 | Evidence Action and Malaria Consortium at GiveWell's programme-weighted figures (2.8) |
| WHO guideline review (GiveWell, March 2025) | 33.7 → 49.3 | a death of unknown age at the shared over-five value (73.19), not the sheet's 50 (INV-2d) |
| UCL participatory learning and action (GiveWell) | 22.8 → 21.6 | post-neonatal and maternal deaths at the shared curve (100.7, 104), not 110 and 115 (INV-2d) |

Unranked models that moved most: Evidence Action syphilis screening 2.8 → 41.2 (an under-five death at 116.25,
not one staff member's 8), Evidence Action IFA Beta India 12.8 → 29.8 and Phase 2 1.6 → 3.3 (a doubled income,
a year lived with disability and a death at the shared values, not the 2019 sheet's units), New Incentives June
2019 7.2 → 14.1 (a death at 116.25, not 2019's 47.22), Centre for Pesticide Suicide Prevention skeleton 42.4 →
53.1 (suicides at the 15–49 band, GiveWell's 80% kept), GiveWell's 2022 water-quality sheets +17–18% (the
current 20% for treatment costs averted). The WELLBY slider's move to healthy years and the deaths in AMF-HLI
and Taimaka-HLI change nothing at the defaults.

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

### Decided 2026-11-02 (owner)

- **Cage-free pledges kept: 77%, not 92%.** The Open Wing Alliance's 92% counts pledges, not hens, is
  self-reported, and covers only pledges already due. No tracker counts hens, so the best guess is North
  America's 77%, where the largest pledges are; range 38–96% unchanged. The reasoning is in the fact's
  explainer (`@sad_factors.commitment_fulfilment_cage_free`), shown on /data and on every model page
  that reads it. Effect: every cage-free model about 15% lower (HSUS 2016 746 → 637, Sinergia 190 → 166).
- **Old estimates count less (2.11).** A slider under Timing, `$estimate_age_discount`, 5% a year (0–15%):
  every model's result is divided by (1 + d)^age, age from its `source.published` to the data's as-of date
  (`common.estimate_age_as_of`, 2026-11-02, bumped when the data is refreshed). Our view only; a meta charity
  takes it on each destination and on its own estimate. The default is a labelled judgment: GiveWell's
  revisions are large but not directional. Effect: HSUS 637 → 391, still first; INV-19.
- **GiveWell's grantee-level adjustments: one figure, one sign convention.** GiveWell's sheets enter the same
  adjustment two ways: as a negative share they add (−5% within-organisation fungibility) or as a positive
  share they subtract (5%). Each standard figure is now one shared fact stored as a negative share of value
  lost (within-organisation fungibility −5%, non-funding bottlenecks −5%, false monitoring results −2% and
  −2.5% for malnutrition, change of priorities −2% and −1% for SMC); a sheet that subtracts reads its negative
  (`-@givewell_common.<id>`). Internal-validity adjustments are stored as multipliers (malaria trials 0.95, New
  Incentives 0.88, vitamin A and iron 0.8); a sheet that adds a share reads `@… - 1`. Typed-in copies of these
  standard figures (GiveWell's and SoGive's copies of its deworming sheets) read the facts too. Grantee-specific
  judgments (the END Fund's 10% false-monitoring risk, Deworm the World's 1%) stay each sheet's own. No result
  changes: every sheet still reproduces.


### Fixed 2026-11-02: the last leftovers of one consistent way

Each was an evaluator's own conversion left in our view, or a fact with no reader. Before → after: healthy years
per $1,000, our view at the defaults; every evaluator view still reproduces every `expected`.

- **A stillbirth.** Ambitious Impact's Opal Health counted 14.52 DALYs per stillbirth averted (GiveWell's older
  33.4 units of value over AIM's 2.3). It now reads the shared `@givewell_shared.uov_per_stillbirth` (21) ×
  `$life_value_multiplier` / `$uov_per_daly`, like its other deaths; AIM's figure in `published`. Every model that
  values a stillbirth reads that fact (GiveWell's syphilis, Liberia and Healthy Futures sheets already did); INV-11,
  now run on every evaluator's models, checks the label. Opal Health 22.0 → 21.8.
- **Household size: one figure per place** (facts/household_size.json, 2.7). The latest DHS Program survey's mean
  household size for the place (rural areas where the sheet counts rural households; a Nigerian state for New
  Incentives' state models; Botswana's 2022 census; GiveWell's own figure for IRD's Sindh districts). It replaces
  `@wellby_factors.household_size_psychotherapy` (StrongMinds' models now read Uganda's 4.7), GiveWell's per-country
  rural facts and its GiveDirectly-tab and India figures, and `@givewell_shared.household_size_nigeria_northwest` /
  `_bangladesh`. INV-13's `household-size` concept checks it. StrongMinds (HLI) 2.29 → 2.28, Friendship Bench
  2.75 → 2.80 (Zimbabwe 4.1, HLI 3.92), World Spine Care 1.09 → 0.98 (Botswana and the Dominican Republic, 2.4 other
  members, HLI's 3.33 for LMICs), GiveDirectly (Malawi) 5.81 → 5.72, New Incentives 4.13 → 3.98 (Northwest Nigeria
  5.9, GiveWell's 6.7; each state's page its own state, Lagos 1.80 → 1.63, Kano 19.6 → 19.5), Evidence Action water
  quality 11.6 → 9.51 (rural Kenya 4.2, Evidence Action's 5.2), Y-RISE desalination kiosks 26.8 → 22.7 (rural
  Bangladesh 4.2, Y-RISE's 5.0), DIL water vouchers 20.2 → 22.5. Rows where the size only calibrates GiveWell's
  GiveDirectly benchmark (which our view replaces with `@cash.uov_per_dollar`) read rural Kenya and move nothing.
  Still their own, with the reason waived: households measured in a programme's own participants (Bandhan,
  Village Enterprise's trial, GiveDirectly's Khongoni and Nampula surveys, PxD's farmers), single Indian states in
  Evidence Action's in-line chlorination sheet, and HLI's grieving household for AMF (part of HLI's value of a
  life, which our view replaces: it moves nothing).
- **Optionality never ranks.** Rice Institute's KMC sheet (GiveWell, 2023) adds 4.3× cash for the money GiveWell
  might later move to KMC elsewhere. Value-of-information and optionality sheets are side sheets, so our view
  counts the direct impact only (12.6× cash; GiveWell's 16.9× in `published`): 23.4 → 17.5. No other ranked sheet
  has an optionality or value-of-information component on its path.
- **Years after a grant are discounted from when they happen.** Evidence Action's two syphilis sheets discounted
  years 6–10 from year 0. Now ÷ (1 + rate)^5 for the grant period, and the government's counterfactual years
  from the end of its later scale-up; the Zambia (original) sheet also discounts the grant years, as the
  Zambia/Cameroon sheet did. 44.5 → 39.5 and 35.9 → 33.1.
- **TerraPraxis reads the years-a-win-counts slider.** Founders Pledge's $0.02 a tonne embeds five years of
  re-powering brought forward; our view scales the tonnes by `pv_annuity_due(1, rate, $win_years_counted)` / 5,
  like every won reform (2.9): 20.1 → 18.6.
- **Facts nothing reads, removed**: GiveWell's Grevillea and naira rates and givewell_common's naira rate (the
  rows read `@fx`), ACE's caged-hen SADs (the models read `@sad_factors`), AIM's 2024 shrimp weight and its
  pain-intensity ratios, the two climate cross-checks, the GBD mild-depression weight (kept in the PHQ-9 fact's
  note), and the across-causes moved-money mix with its facts (2.8). `@ace.dvf_animals_spared_per_meal` is
  Denmark's figure beside the shared Brazilian one (labelled so); neither moves a result (animal counts are
  context, SADs drive the result).

### Decided 2026-11-03 (owner): every programme is modelled

Every programme of every charity is modelled to the one scale: no partial coverage, no "unmodelled", no
"no comparable measure". The build-cea skills gained six families (domestic-services, humanitarian-relief,
medical-research, companion-animals, conservation, rights-advocacy; hospitals and hospices are direct-health
with illness in DALYs, or wellbeing, at the country's values), the bridges of 2.6 that let them count in
several units, and the missing-data step of 2.12 (first proxy rows, replaced on 2026-11-04 by a chain from the literature × the slider). Shared facts added for them:
`@united_states.consumption_per_person_2024` ($58,517) and `@united_kingdom.consumption_per_person_2024`
($32,412), household final consumption ÷ population, World Bank 2024, the base of a rich-country model's
ln(consumption) gain; `@united_states.ce_lowest_quintile_vs_all_2024` (0.446, BLS Consumer Expenditure
Survey 2024), the anchor for how far below the mean a social service's clients consume;
`@household_size.united_states` (2.4, BLS) and `@household_size.united_kingdom` (2.35, ONS 2024);
`@welfare_ranges.dog_vs_chicken` and `cat_vs_chicken` (2.4). Shared assumption added:
`$missing_data_discount` (2.12). A catastrophe's deaths (conservation's catastrophic-risk branch) are valued
like every death, by age band × `$life_value_multiplier`. Future generations need no slider of their own:
the years of healthy life a catastrophe would take from every later year (`@catastrophe.world_population_long_run`,
the UN's 2100 projection, × the share of the future lost) are discounted at `$discount_rate`, so the
discount rate is how much they count; its floor is 0.1% (was 0), so an endless future stays finite
(the yearly loss ÷ the rate: 1,000 years' worth at 0.1%, 25 at the default 4%).
