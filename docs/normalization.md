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
- **Exchange rates never appear inside a model** except where the evaluator itself used one (GiveWell's
  2.3 units of value per DALY), and then only pinned to the evaluator's number in the evaluator
  view.
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
ced_s = sads_s / @aim_sads.wr_s * if($rp_species_weights, @welfare_ranges.s_vs_chicken,
                                                         @aim_sads.wr_s / @aim_sads.wr_chicken)
```

In the evaluator view `$rp_species_weights` = 0 and `$chicken_vs_person` is pinned to
`@aim_sads.wr_chicken`, so the evaluator headline equals SADs × 0.0011 × 1,000, exactly as today.

What AIM's weights are (new facts/aim_sads.json), as far as is documented:

- Chicken: **not found in a public source.** The site assumes 0.332 (RP's median). If AIM's figure
  differs, every chicken model moves by 0.332 / AIM's figure.
- Shrimp: 0.199 = 43.3% probability of sentience × 46.0% welfare range given sentience (AIM 2025,
  quoted by Vasco Grilo:
  <https://ea.greaterwrong.com/posts/waL3iwczrjNt8PreZ/announcing-ace-s-2025-charity-recommendations/comment/zssTWeCRzy4HogCrk>).
  Secondary source; confirm with AIM.
- Fish: probability of sentience 52.6%; pigs 92.5% (same author,
  <https://forum.effectivealtruism.org/posts/yoDTsrR95YRnBW6fk/cost-effectiveness-of-the-fish-welfare-interventions>).
  Welfare range given sentience not found.
- AIM's intensity weights and the per-species sheet are not public. The fish post says to ask
  AIM's animal welfare research team for it. **Getting that sheet is step 1 of the work (section 6).**
- AIM changed method in 2026 (v2; docs/eval-skills.md notes it moves SWP's SAD factor a lot). Each
  `@aim_sads.*` fact records the version, and each ACE model says which version its sheet used.

So, on shrimp, AIM puts a shrimp at 0.199 / 0.332 = 0.60 of a chicken and RP at 0.093: 6.4 times
less. Rebasing multiplies shrimp SADs by 0.093 × 0.332 / 0.199 = **0.156**.

**Counts that aren't SADs** (bridges): fill the first line of the recipe yourself, by species
(`ced_s = disabling_days_s * @welfare_ranges.s_vs_chicken`). "Animals spared" becomes animals
spared by species × days each would have lived × intensity, never a single all-species ratio.

### 2.5 Anything else

Research papers, people reached, courses, policy wins: these are not outcomes on the scale. They
must go through a bridge (layer B) into one of the units above, and the bridge's rows are ours,
in their own section, with ranges. A model with no bridge is shown but not ranked, as today.

## 3. Invariants

Each is a test over the built library (`buildLibrary`, as scripts/summaries.ts loads it). Put them
in src/engine/normalization.test.ts, plus a report mode (`tsx scripts/normalization-audit.ts`)
that prints every violation, so they can land before all models pass (with an allowlist that only
shrinks).

| # | Invariant | How to test |
|---|---|---|
| INV-1 | Every ranked model reports in a ranked unit: `uov`, `daly`, `wellby` or `ced`. | For each model with an `output` that `rankingPlan` can pick: `output.unit ∈ RANKED`. |
| INV-2 | The headline is the native result times the unit's standard conversion, and nothing else converts. | (a) `headline(m) === compute(m)[output] × evaluate(headlineConversion(unit))` for every model, both views. (b) No row's `assumptionDeps` contains a cross-cause rate (`chicken_vs_person`, `daly_per_sad`, `uov_per_wellby`, `sads_per_animal_spared`), and `uov_per_daly` only under INV-5. |
| INV-3 | Every animal model passes through the species step, once per species, from the shared table. | For `unit = ced`: the model declares `output.species` (e.g. `["chicken","pig"]`). For each, a row `ced_<s>` exists, its formula equals the template for its source (`aim` or `raw`) after whitespace normalisation, it reads `@welfare_ranges.<s>_vs_chicken`, and it is upstream of the output. No other row reads `@welfare_ranges.*` or `@aim_sads.*`. Every path from a row whose unit is SAD or days of pain to the output passes through a `ced_*` row. |
| INV-4 | No literal stands in for a shared number. | Facts get a `match` field (row label/id pattern). For every input row matching a fact's pattern whose value equals the fact's low/best/high: it must be a formula reading the fact, with the evaluator's literal in `published`. Also: no formula contains a constant equal to a fact or assumption value (extends lint's magic-number rule to all models). |
| INV-5 | The evaluator view uses the evaluator's own rates. | For every model with an `evaluator`, every non-toggle assumption read inside layer E is either pinned in `evaluator.assumptions` or has a default equal to the evaluator's value (check: `expected` still reproduces when the assumption is moved ±50% in the charityevals view only). |
| INV-6 | The evaluator's bottom line reproduces. | Model declares `output.native` (the native row). That row, or its direct inputs, carry `expected`; `scripts/check.ts` already checks `expected` in the evaluator view. |
| INV-7 | Our rows are visibly ours. | Every row strictly between `output.native` and `output.row` is in a section of kind `accounting`, `bridge` or `conversion`, and has no `expected`. Every row upstream of `native` is in an evaluator section. |
| INV-8 | One view, one set of numbers. | `headline(m, av, {}, "evaluator")` converts with `viewAssumptions(m, av, "evaluator")`, not `av` (fails today: see 4.2). |
| INV-9 | Shared levers reach every model they apply to. | Models declare `mortality: true` / `multi_year: true` (lint suggests them from keywords: death, mortality, years of impact). Declared mortality → reads `$life_value_multiplier`; declared multi-year → reads `$discount_rate`. |
| INV-10 | Each slider moves exactly the models it should, in the expected shape. | Property test at defaults: every `ced` model's headline is linear in `$chicken_vs_person` and in `$daly_per_sad`, and independent of `$uov_per_daly`, `$uov_per_wellby`, `$uov_per_ln_consumption`; every non-animal model is independent of `$chicken_vs_person` and `$daly_per_sad`. |

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
| Sinergia Animal | SADs; hens 75%, pigs 25%, meals 0.1% | same | 3, 4 (17.49 literal) | `ced_chicken`, `ced_pig`, meals by species | hens none; pigs × (1.55 × 0.332 / AIM pig weight), unknown until AIM's sheet; 912 today |
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
