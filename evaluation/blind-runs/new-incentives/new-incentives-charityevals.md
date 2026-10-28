## Summary

New Incentives pays caregivers in northern Nigeria small cash incentives when their babies get routine vaccines at government clinics. In 2024 it enrolled 1.74 million infants in ten states and spent $25.7 million (audited). Counting the full cost of the 2024 cohort, that is about $17 per infant, which matches the charity's own figure.

Our estimate is **0.014 units of value per dollar, about 1.6 times GiveDirectly**. The joint range is very wide, roughly 0.15 to 19 times (0.2 to 11 times with the shared assumptions at their defaults). That works out to about $12,100 per child death averted, plus the value of the cash to poor households, which is about a sixth of the total.

The coverage effect is well evidenced: a randomised trial of this program found it raised full vaccination by 27 percentage points. The weaker link is the step from extra vaccinations to deaths averted. We build it from Nigerian cause-of-death data and vaccine efficacy from other trials, not from a mortality trial of the program.

## What the charity does

New Incentives works in Nigeria as the All Babies Are Equal Initiative, at government clinics in ten states:

- North West: Kano, Katsina, Jigawa, Sokoto, Kaduna, Kebbi, Zamfara
- North East: Bauchi, Gombe
- North Central: a few clinics in Niger State

Staff enrol infants at their first vaccination and pay cash at each routine vaccination visit, from BCG at birth to measles at nine months. Since July 2024 a ₦5,000 completion bonus brings the total to up to ₦11,000 per child (about $7). Staff also run community awareness work and push clinics to restock vaccines.

The vaccines and the nurses who give them come from the government and Gavi.

## How the impact happens

1. **The cash brings caregivers back for each visit.** A trial in 167 clinic catchments in Katsina, Zamfara and Jigawa (2017–2020) measured the gains in coverage, from about 25% fully vaccinated in control areas:
   - BCG: +16 points
   - Penta 1: +21 points
   - measles: +14 points
   - full immunisation: +27 points

   Vaccines given at the same visits but not incentivised rose by similar amounts.
2. **The extra vaccinated children are protected** from measles, pertussis, pneumococcus, Hib and, since the vaccine reached the north in 2022, rotavirus.
3. **These diseases cause a share of child deaths.** In these zones about 137 children in 1,000 die before age five, so protection averts deaths.
4. **The cash also raises poor households' consumption.**

## How the model works

**Cost.** We start from the audited 2024 expenses ($25.7 million, 7.2% of it management and fundraising) and scale them up by 1.15. That factor reflects two things:

- Infants enrolled in a growing program keep costing money into the next year.
- The new completion bonus is paid mostly in 2025.

The 1.15 matches New Incentives' own $17 per infant. The audited Note 8 supports a high end of 1.25: $5.8 million of board-designated "CCT commitments" was added during 2024. That also roughly explains why the annual report's tentative expense figure ($33.0 million) is higher than the audited one.

**Reach.** 1,735,305 infants were enrolled in 2024 (annual report).

**Effect per infant** is the vaccine-preventable risk of an unvaccinated child in the program zones, times the share of enrolled infants vaccinated only because of the incentive.

- *Death rates by cause.* These come from the 2024 Nigeria verbal autopsy study, a follow-up to the 2024 DHS, weighted 79/21 between the North West and North East to match 2024 enrolments:
  - measles: 5.4 deaths per 1,000 births
  - pertussis: about 2.9 per 1,000
  - diarrhoea: 9.1 per 1,000
  - pneumococcus and Hib: about 8.5 per 1,000. This is scaled from Wahl et al.'s 2015 national estimates, with some weight on the Gambian PCV trial's 16% cut in all-cause child mortality.
- *Corrections, cause by cause.* Each cause is multiplied by three factors:
  - the share of its deaths the vaccine prevents: 77% for measles, 85% for pertussis, 56% for pneumococcus and Hib, and 17% of diarrhoea deaths for rotavirus
  - the share of its deaths at ages the vaccine can protect: 90% for measles, 85% for pertussis, 95% for the others
  - how much more an unvaccinated child is at risk than the average child when the rate was measured: 1.4 for measles, 1.3 for pertussis, 1.05 for pneumococcus and Hib, and 1.0 for rotavirus, whose vaccine arrived only in 2022
- *Mortality trend.* The verbal-autopsy causes are also scaled by 0.9 for the fall in child mortality since the reference period.
- *Result.* An unvaccinated child has a 1.3% risk of a death before five that full vaccination would prevent.
- *Share vaccinated because of the incentive.* We take the trial's coverage gain, weighted by where the deaths are (19 points), and divide it by the share of catchment children who enrol (75%). So about 25% of enrolled infants are vaccinated because of the incentive.
- *Before adjustments*, that is 0.0034 deaths averted per enrolled infant, about one per 300 infants.

**Adjustments** (combined product 0.42):

| Adjustment | Value | Why |
|---|---|---|
| Evidence | 0.75 | Carrying the trial to today's scale, caregiver self-report, and the mortality chain |
| Counterfactual | 0.85 | Later catch-up, and campaign doses that may not have been counted in the trial |
| Attribution | 0.77 | New Incentives' share of total cost, counting about $20 of government and Gavi vaccine and delivery cost per extra vaccinated child |
| Delivery | 0.95 | Enrolment counts are administrative |
| Leverage and funging | 0.90 | Large reserves and a runway policy mean a marginal dollar partly sits in reserve |

**Outcome.** About 2,400 deaths are averted for the 2024 cohort. Each is valued at GiveWell's under-five moral weight, and we add 23% for benefits not modelled.

We add the cash itself as a separate branch of the direct-health template: $8.5 million of transfers. It is valued in ln-consumption units anchored on GiveDirectly and converted with the shared consumption weight, so it moves with the benchmark.

**Your dollar's share.** Staff pay is 34% of costs, mostly local field staff. We assume a 5% pay gap.

## What drives the result

The inputs that move the result most, in multiples of GiveDirectly:

| Input | Range tested | Result |
|---|---|---|
| Value of a life (shared assumption) | 0.6–1.4 | 1.1× to 2.2× |
| Evidence adjustment | 0.55–0.95 | 1.3× to 2.0× |
| Coverage gain | 14–27 points | 1.35× to 2.05× |
| Leverage and funging | 0.7–1.05 | 1.3× to 1.9× |
| Counterfactual catch-up | 0.65–1.0 | 1.3× to 1.9× |
| Pneumococcal and Hib death burden | 5–12 per 1,000 | 1.45× to 1.85× |
| Share of children who enrol | 0.65–0.95 | 1.8× to 1.4× |

No single input moves the result above about 2.2×. The joint range is wide because many moderately uncertain inputs multiply together. About 74% of the uncertainty comes from judgment calls and shared assumptions.

## Biggest uncertainties

**How many deaths the vaccines avert here.** Verbal autopsy labels about a third of child deaths "sepsis", and some of those are pneumococcal, Hib or measles deaths. We do not count the contested "non-specific" all-cause effects of measles vaccine.

**Whether the trial's effect holds at today's scale.** The program is now 75 times the size of the trial arm, in different states, with a different incentive. New Incentives' before/after surveys in nine expansion cohorts show gains of a similar size after 24 months:

- Penta 1: +25 points
- measles: +18 points
- zero-dose children: −26 points

These surveys are not randomised. The charity's own staff collect the data, and an external firm analyses it.

**The enrolment base.** The trial effect is per child in a catchment, but the cost is per infant enrolled.

**Late catch-up.** We did not find NDHS 2024 tables of catch-up vaccination by zone to anchor the counterfactual adjustment.

## What isn't modelled

These are covered only through the 23% allowance (range 10–45%):

- non-fatal illness averted
- herd protection of unenrolled children
- stockout reductions that benefit unenrolled children
- vaccines we don't count: BCG, IPV, hepatitis B, yellow fever, meningitis A, diphtheria
- deaths averted after age five
- possible developmental effects

Caregivers' time and travel are a small offset.

We also don't model the 2024 program additions separately (rewards for clinic staff, malnutrition screening), or the expansions that began in late 2024.

## Sources

- New Incentives, audited consolidated financial statements 2024 and 2023: https://drive.google.com/file/d/1kZPVSMi669EeWQ30qF0iBQgT7NeBNnW4/view
- New Incentives, Annual Report 2024: https://drive.google.com/file/d/1ZCBUAXqp54e0r-5PDSnMoA_uBtedDBrE/view
- New Incentives, Coverage Report 2024 (cohorts 1–8 and 11): https://drive.google.com/file/d/1nJkNCgCkJ6s30yJVEyUpWcTCKa5pUT0g/view
- IDinsight, evaluation brief of the randomised trial (coverage effects): https://cdn.prod.website-files.com/5f7c51bf9fac9b5ed62aa37b/5fae20fa406525d30087de19_New%20Incentives%20Evaluation%20Brief.pdf
- 2024 Nigeria Verbal Autopsy and Social Autopsy Study, Policy Brief No. 1: https://dhsprogram.com/pubs/pdf/PB15/PB15.pdf
- Wahl et al. 2018, Lancet Glob Health (pneumococcus and Hib burden): https://europepmc.org/article/MED/29903376
- Cutts et al. 2005, Lancet (Gambian PCV trial): https://europepmc.org/article/MED/15794968
- Uzicanin & Zimmerman 2011, J Infect Dis (measles vaccine effectiveness): https://europepmc.org/article/MED/21666154
- Fulton et al. 2016, Clin Infect Dis (pertussis vaccines): https://europepmc.org/article/MED/26908803
- Jonesteller et al. 2017, Clin Infect Dis (rotavirus vaccine effectiveness): https://europepmc.org/article/MED/28444323
- Troeger et al. 2018, JAMA Pediatrics (rotavirus deaths): https://europepmc.org/article/MED/30105384
- UNICEF Supply Division, PCV price data: https://www.unicef.org/supply/media/25651/file/PCV-vaccine-prices-17062026.pdf

## How this model was checked

**Mechanical audit** (`scripts/audit-model.ts`): no high-severity findings. The remaining low findings are point values on rows that cancel out or are zero by design.

**Independent audit round 1**: 0 high, 6 medium and 11 low findings. All six medium findings were fixed, and with them most of the low ones. Together these moved the result from 2.4× to 1.9× GiveDirectly.

Medium findings fixed:

- Replaced the single unvaccinated-risk multiplier with one per cause.
- Added the share of deaths at ages each vaccine can protect.
- Added a mortality-trend adjustment to the verbal-autopsy rates.
- Raised the cohort cost factor to 1.15 and reconciled it with Note 8 of the audited statements.
- Tied the value of the cash to the shared consumption weight.
- Anchored the counterfactual on the campaigns that ran in the trial areas just before its endline.

Low findings fixed:

- Raised the pneumococcal and Hib best guess to give the Gambian trial some weight.
- Narrowed the enrolment-share floor.
- Widened the measles efficacy range.
- Removed the stockout double count.
- Applied funging to the cash.
- Lowered the coverage gain for the three-dose series.
- Write-up consistency fixes.

**Independent audit round 2**: 0 high, 2 medium and about 8 low findings. Round 1's medium findings were confirmed resolved, except that the counterfactual still has no data anchor. Changes made, which moved the result from 1.9× to 1.65× GiveDirectly:

- Set the counterfactual back to 0.85: it is unclear whether the trial counted campaign doses as "Measles 1".
- Widened leverage and funging to 0.7–1.05 (best 0.9), given New Incentives' $89.5 million in net assets and its runway policy.
- Fixed the Gambian-trial comparison (deaths prevented vs burden) and the pertussis wording.
- Cited NDHS 2023–24 Table 15 for the coverage behind the risk multipliers.
- Lowered the cash value to 0.006 ln-units per dollar after a direct consumption check.
- Anchored the evidence adjustment on the at-scale survey gains.
- Corrected the overhead percentage.

The audit loop stopped after round 2, as neither round found any high-severity issues.
