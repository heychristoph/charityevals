# Lives that never start: one plan (issue 33)

Status: step 1 of section 7 is built (2026-11-18), uncommitted: no headline moved in either view, at
0% or 100%. Steps 2–9 are not built, and no move from them has been measured. Figures marked "rough" are
back-of-envelope and unsourced.

## 1. What was decided

| Question | Decision |
|---|---|
| Scope | A generic population-ethics slider, not a future-generations weight |
| Form | It weighs the good years in lives that never start; suffering in them always counts |
| Default | 0% |
| Non-pain life value of animals | One slider, "An animal's pain-free time counts as … % good", default 0%, shown only when the main slider is above 0%. No per-species sliders: it scales the sourced pain-free time of each species |
| Animals eaten by added people | Included in this build, although it moves headlines at the default |

Calls made by rule (consistency), not asked case by case:

| Call | Why |
|---|---|
| Descendants of people saved are counted | Future generations after a catastrophe are counted the same way |
| A stillbirth averted keeps today's 21 units at every slider value; the rest up to a newborn's value × the weight | Keeps 0% equal to today for the 12 models that read it |
| Fertility effects of income and schooling: none counted | No sourced elasticity in the repo; stated as a row at 0 |
| Wild animals and insects: none counted | No sourced sign for the welfare of a life |
| Biodiversity (a species or ecosystem lost as such): outside this build | Not valued anywhere today; its own rule, issue 37 |
| Meat eaten per person held at today's level | No sourced projection; logged in the fact's explainer |

## 2. The rule (normalization.md, new 2.19)

1. **Count, not identity.** The rule applies to changes in the number of lives, human or animal.
   Better or longer lives for the same number of individuals count in full as now (cage-free hens not
   yet hatched, climate deaths of people not yet born).
2. **A life that never starts is worth** `weight × good − pain`.
   - People: good = healthy life expectancy at birth, discounted from the birth; no pain term.
   - Animals: pain = the pain days already in the models; good = pain-free days × `$pain_free_time_good`.
3. **Net-negative lives need no special case.** The sign comes out of the two terms. Preventing a
   life is a gain while its pain outweighs its weighted good, and a loss once it does not.
4. **The discount rate goes back to one job** (time preference). It still applies to every future year.
5. **Where it stops.** No sourced figure for the sign or size means a row at 0 labelled "none counted".

One consequence to know before building: because pain always counts, the **number of people added**
(net of the fertility response, plus descendants) matters at 0% too, through the animals they eat.
So the demographic step is live at the default, not only above 0%.

## 3. Sliders

| Slider | Change |
|---|---|
| `$never_started_weight`, "Lives that never start count … %" | New, 0–100%, default 0%. Explainer: "0%: only the suffering in them counts. 100%: their good years count like anyone's." |
| `$discount_rate` | Explainer no longer says it is how much future generations count |
| `$side_effect_weight` | Also scales the second-order rows of section 5 (they carry both marks) |
| `$pain_free_time_good`, "An animal's pain-free time counts as … % good" | New, 0–100%, default 0% (pain-free time is neutral). Hidden while the main slider is at 0%, where it changes nothing. One slider for every species |
| `$chicken_vs_person`, species table, `$daly_per_sad` | Unchanged; they convert good days and the pain of animals eaten |
| Value set "Longtermist" | Adds the new weight at 100% beside the 0.1% discount rate |

A fully good day converts with no new judgment: 1/365 of a healthy year × the species weight.

## 4. Shared facts (new, each with source, quote, range)

| Fact | Source to fetch | Used by |
|---|---|---|
| Healthy life expectancy at birth, by country | WHO Global Health Observatory | every human life not started |
| Births averted per year of contraception; share that lowers completed fertility rather than delaying | GiveWell "Valuing contraception", Guttmacher / MSI Impact 2 | family planning |
| Births averted per child death averted, by fertility level | Roodman 2014 for GiveWell | fertility response |
| Net reproduction by region and decade | UN World Population Prospects 2024 | descendants |
| Pain-free days per life, by species and farming system | Welfare Footprint (days alive minus time in any pain); no source for a species means 0, "none counted" | animals never bred, animals eaten |
| Animals eaten per person-year by country and species | FAO food balance sheets × animals per kg | animals eaten |
| Pain days per animal eaten, by species | existing `facts/sad_factors.json`, extended where a species is missing | animals eaten |
| Income elasticity of meat demand, low-income countries | to find | animals eaten through income gains |

Sensitivity to state in the slider's explainer (rough): a caged hen has about 62 disabling-equivalent
pain days, worth about 25 healthy days at the default pain conversion. With the main slider at 100%,
setting the pain-free slider above roughly 5–7% makes that life net-positive.

## 5. Where it attaches

### Direct rows (move nothing at 0%)

| Channel | Where | Models | Change |
|---|---|---|---|
| Future generations | `future_dalys_averted` in `models/climate/the-nature-conservancy-charityevals.json`; `facts/catastrophe.json`; conservation template; AI safety models to come (issue 18) | 1 | Mark the row. The future stream must start after people alive today, whose years are already in the value of their deaths |
| Animals never bred | diet change (Dansk Vegetarisk Forening, Good Food Fund, Sociedade Vegetariana Brasileira, Sinergia's meals, HSUS and ProVeg ACE 2016, The Humane League's other programmes), shrimp stocking density, import ban, chick culling; pet neutering models (not on this branch) | about 11 | A good-days row per species beside the pain days |
| Births averted | `@givewell_shared.uov_per_cyp_*`; family-planning models | 5 read the fact, 9 by keyword | One shared term next to the value of a year of contraception |
| Stillbirths | `@givewell_shared.uov_per_stillbirth` | 12 | The split in section 1 |

### Second-order rows (carry both the side-effect mark and the new mark)

| Channel | Where | Models | Moves at 0%? |
|---|---|---|---|
| Fertility response and descendants: people added per death averted, by age band and country | shared death values (`@moral_weights.*`, `$daly_per_child_death`) | about 148 read them | No for the people themselves; yes through the animals they eat |
| Animals eaten by added people | same hook, in chicken-equivalent pain days | same 148, plus the 11 climate models through the `tco2e` conversion | Yes |
| Animals not eaten after births averted | family-planning term | 9 | Yes (upwards) |
| Animals eaten out of income gains | income rows of cash and livelihood models | not yet mapped | Yes |
| Future farmed animals after a catastrophe averted | catastrophic-risk template | 1 (0 at its best guess today) | Yes, and large for extinction-scale models to come |

Models with their own death values (AIM standard inputs, SoGive) are linked to the shared ones by script.

## 6. Engine and checks

| Piece | File | Change |
|---|---|---|
| Row mark `never_started` | `src/engine/schema.ts` | Beside `side_effect` |
| Reading a marked row through its weight | `src/engine/model.ts` (`withSideEffectWeight`) | Generalised: a row may carry both marks, the weights multiply; a marked row computed from another marked row stays an error |
| Evaluator view | `viewAssumptions` in `model.ts` | Weight pinned to 0, so every import still reproduces |
| People added per death, by band and country | derived shared assumption (`src/engine/derive.ts`) | Reads the model's beneficiary country as the distance slider does (to verify) |
| The one cross-cause term in a human model | `src/engine/invariants.ts` (INV-2b) | Sanctioned for the shared animals-eaten term only, as a bridge under 2.6 |
| New invariant | `invariants.ts`, `normalization.test.ts` | With the new weight at 0 and the second-order rows off, every headline equals today's; every row counting lives not started is marked or waived; no evaluator figure moves |
| Lint | `src/engine/lint.ts` | Keywords (births averted, animals spared, not farmed, future generations) need the mark or a waiver |
| Tests | new `never-started.test.ts`; `side-effects.test.ts`, `montecarlo.test.ts`, `templates.test.ts` | Mirror the side-effect tests; the weight is a value, never drawn |
| Simulation check | `scripts/simulation-check.ts` | Good-days rows are negative amounts, not percentages |

## 7. Build order

1. Rule text 2.19, engine mark, both sliders at 0% (the second hidden while the first is 0%), value set, the one future-generations row. Nothing moves.
2. Shared facts, each fetched and quoted.
3. Direct rows by script; templates (diet-change, companion-animals, corporate-campaign, conservation) through `gen-templates.py`. Nothing moves at 0%.
4. Hook on death values: people added. Nothing moves at 0% until step 5.
5. Animals eaten (deaths averted, births averted, income, catastrophe). **Headlines move at the default.**
6. Invariant, lint, tests, simulation check.
7. Skills: one line each in build-cea, import-cea (and `references/batch.md`), audit-cea's checklist, pruned to the word budget.
8. Site: replace the "The future, and lives far away" text on `src/pages/method.astro`; fix the discount-rate explainers (normalization.md lines 1511–1514, `facts/catastrophe.json`, `assumptions/default.json`); glossary.
9. Dry run and report (section 8). Audit only models that move more than 2×.

Steps 1–4 can merge on their own. Step 5 merges only after its dry run.

## 8. Dry run before step 5 merges

| Run | Reported |
|---|---|
| Default (0%), with animals eaten | Count of models moved, median move, sign flips, by cause |
| 50% and 100% | Same |
| Each at 4% and 0.1% discount | Same |
| Pain-free slider at 0%, 10%, 50% and 100%, main slider at 100% | Which animal models change sign |

## 9. Still open

| Item | Why it is open |
|---|---|
| Size of the animals-eaten effect | Unknown until run; fish and shrimp counts likely dominate |
| Attach point for income gains | No single shared hook found yet |
| Pain-free days by species | Welfare Footprint covers hens and broilers; coverage for fish, shrimp, pigs, cattle, dogs and cats is unchecked |
| Issue 33's text | Proposes a 100% default and a symmetric slider; needs rewriting to this plan |
