## Summary

Helen Keller Intl helps ministries of health in 14 African countries give every child aged 6–59 months a high-dose vitamin A capsule twice a year. In its fiscal year to June 2025 it reported reaching **47 million children with both doses**. We estimate that it spent about **$42 million** on this program in that year, about **$51 million with overhead**. That is **about $1.08 of its own money per child per year, or $0.54 per dose**.

Our estimate is **0.025 units of value per dollar you give, about 2.9× GiveDirectly**. The joint low–high range is very wide (about 0.15× to 36×, with every input at its extreme at once), and judgments account for about 80% of the uncertainty. The result rests on three things: how much vitamin A still reduces child deaths in today's lower-deficiency settings, how many of the doses would have been given without Helen Keller, and how much of the credit belongs to Helen Keller, which pays roughly half of what each dose costs.

## What the charity does

Helen Keller Intl is a US nonprofit, founded in 1915, with programs in nutrition, eye health and neglected tropical diseases in Africa, Asia and the US. In FY2025 it spent $125.9M, of which $76.9M went to "Nutrition, including Vitamin A" (audited statements). Vitamin A supplementation (VAS) is its largest nutrition program.

For VAS, Helen Keller funds and organises distribution campaigns run by governments, and increasingly community-based routine delivery. It trains and pays per diems to health workers, pays for supervision and logistics, and runs coverage surveys. The capsules themselves are mostly donated through UNICEF. The countries are Nigeria, DRC, Niger, Cameroon, Côte d'Ivoire, Guinea, Mali, Burkina Faso, Mozambique, Madagascar, Kenya, Senegal, Tanzania and Sierra Leone. Helen Keller's country pages give children reached for 13 of them, about 48 million in total; DRC, Niger, Cameroon and Nigeria are 63% of that.

## How the impact happens

Vitamin A deficiency weakens the immune system, so children die more often of diarrhoea and measles, and it causes night blindness and xerophthalmia. A high dose builds up liver stores for 4–6 months. The Cochrane review (Imdad et al. 2022, 19 trials, 1.2 million children) finds that VAS cuts all-cause mortality at 6–59 months by **12% (95% CI 7–17%)**. The random-effects estimate is 24%. Excluding DEVTA, the very large null trial in India, also gives about 23%.

## How the model works

The model follows charityevals' direct-health template:

- **Cost.** Audited FY2025 nutrition expenses × the VAS share (a judgment: 55%, range 40–70%, anchored on Helen Keller's 2025 pledge of at least $35M a year for 40 million children) × the overhead multiplier (1.20).
- **Reach.** 47 million children given two doses, as Helen Keller reports in its FY2025 Form 990. We treat each as one child-year of supplementation.
- **Baseline mortality.** All-cause deaths per child-year at 6–59 months, from UN IGME 2024 under-five, infant and neonatal rates for each country, weighted by children reached. The result is **1.0% a year**: Nigeria and Niger are 1.4%, Kenya, Senegal and Tanzania about 0.25%. The country rates are new facts in `facts/<country>.json`.
- **Effect.** A 12% reduction (Cochrane fixed effect, range 7–24%), giving 0.0012 deaths averted per child-year before adjustments.
- **Adjustments** (product 0.18):
  - evidence 0.85: external validity, since deficiency and measles are less common than in the trials. The discount is modest because the 12% estimate already gives DEVTA most of its weight;
  - counterfactual 0.6: about 40% of the doses would have been given anyway through routine services or other partners. Reference class: when polio campaigns were scaled back, two-dose coverage in West and Central Africa fell from 79% to 54% in a year (UNICEF). That is about a third of doses lost, not all of them;
  - attribution 0.47: Helen Keller's direct field spending per dose actually received ($0.45 / 0.8 = $0.56), out of an estimated $1.20 full cost per dose received (study costs from 2022–23, adjusted for inflation). Governments and capsule donors pay the rest;
  - implementation 0.8: campaign tallies exceed surveyed coverage;
  - leverage and funging 0.95: only whether a marginal donation adds to Helen Keller's VAS spending.
- **Outcome.** About 10,300 child deaths averted credited to Helen Keller, each valued at GiveWell's 116 units of value for an under-five death. Unmodelled benefits add 10%: less illness and blindness, and other services delivered at the same campaigns.
- **Your dollar's share.** Staff pay is 37% of costs, with an assumed 10% pay gap, so donations pay 96% of the full cost when salary sacrifice is counted.

Because attribution is Helen Keller's share of the full cost per dose received, the uncertain VAS share of spending largely cancels out, and so does the delivery adjustment. In effect, the model values every field dollar anyone spends on these campaigns equally, at about $1.20 per dose received.

## What drives the result

- **The mortality effect** (7% to 24%): 1.7× to 5.8× GiveDirectly.
- **Full cost per dose** ($0.80 to $2.10): 4.3× to 1.7×.
- **The value of a life** (shared multiplier 0.6 to 1.4): 1.7× to 4.1×.
- **Full credit** for shared outcomes: 2.9× becomes 6.2× if Helen Keller gets all the credit for doses it co-funds.
- **The counterfactual** (0.4 to 0.85): 1.9× to 4.1×.
- **The evidence adjustment** (0.55 to 1.0): 1.9× to 3.4×.

## Biggest uncertainties

- **Does VAS still save lives at the trials' rate?** Most trials are from the 1980s and 1990s. Deficiency among under-fives in WHO's African region is still about 31% (Song et al. 2023), but measles vaccination and oral rehydration have changed what children die of. DEVTA, the largest and most recent trial, found little effect. Our 0.85 evidence adjustment is a judgment. No trial measures the effect in today's high-mortality African settings.
- **What would happen without Helen Keller?** Routine-only delivery reached only 9–51% of children in northern Côte d'Ivoire in 2023. But other partners (UNICEF, Nutrition International) also fund VAS, and we have no country-by-country evidence on who would step in.
- **Cost and credit.** We don't know Helen Keller's VAS spending. The full cost per dose is anchored on two Helen Keller co-authored costing studies plus Helen Keller's own "a little more than $1 a dose", and costs vary several-fold between delivery strategies: $0.75 to $2.70 per child in Côte d'Ivoire.
- **Reach matters less than it seems.** The 47 million figure is Helen Keller's own tally, and the surveys we found (Tanzania 2010 ratio 0.66, Sierra Leone 2011 ratio 0.87, Burkina Faso 2022 coverage 88%) are old, few, and run by Helen Keller itself. But reach, the delivery adjustment and the VAS share of spending cancel out of the result. What matters instead is the full cost per dose actually received, which comes from two small costing studies.
- **Sub-national targeting.** We use national mortality rates, but Helen Keller works in specific regions or states in some countries (Nigeria, Madagascar). The children campaigns miss may also be at higher risk than those they reach.

## What isn't modelled

- Helen Keller's other programs: neglected tropical diseases, eye health, other nutrition work (home gardens, malnutrition treatment, fortification) and its Asian programs.
- Illness averted is not modelled separately: diarrhoea, measles, night blindness and xerophthalmia go into the 10% unmodelled-benefits adjustment.
- Deworming and other interventions co-delivered at campaigns are included there only roughly.
- Later-life income effects are set to zero: we found no evidence.
- Caregivers' time spent attending campaigns is a cost not counted.
- Any systems-strengthening value of Helen Keller's support to health ministries.

## Sources

- Helen Keller Intl, audited consolidated financial statements FY2025 and Form 990 FY2025; 2024 annual report; country pages and 2025 Nutrition for Growth pledge (helenkellerintl.org).
- Imdad A et al. (2022), *Vitamin A supplementation for preventing morbidity and mortality in children from six months to five years of age*, Cochrane CD008524.pub4 (plain-language summary). The 2017 version is on PMC (PMC6464706) for the sensitivity analyses.
- UN IGME child mortality estimates 2024, via the World Bank WDI API.
- Song P et al. (2023), J Glob Health 13:04084, prevalence of vitamin A deficiency.
- Vosti SA et al. (2025), Food and Nutrition Bulletin, cost of a VAS campaign in Burkina Faso (PMC13250235).
- Baker MM et al. (2025), PLoS One 20(12):e0338784, routine VAS strategies in Côte d'Ivoire.
- Nyhus Dhillon C et al. (2013), PLoS One, coverage surveys versus tally sheets in Tanzania.
- Hodges MH et al. (2013), Global Health: Science and Practice, Sierra Leone VAS coverage survey.
- WHO (2011), guideline on vitamin A supplementation in children 6–59 months.
- UNICEF (2018), *Coverage at a Crossroads: New directions for vitamin A supplementation programmes*.

## How this model was checked

We built the model with the build-cea skill from public sources, without reading any evaluator's assessment of this program. The mechanical audit (`scripts/audit-model.ts`) reports no high findings; two low findings remain, for the zero-valued illness and income rows, which have no range. Independent auditors, run as separate agents with fresh context, then reviewed the model.

**Round 1** found 1 high, 3 medium and 7 low issues. The result moved from 2.96× to 3.68× GiveDirectly. Changes:

- **High, fixed.** The attribution share compared Helen Keller's cost per *reported* dose with study costs per *surveyed* dose. That counted the delivery shortfall twice. Attribution now uses doses actually received on both sides.
- **Medium, fixed.**
  - The evidence adjustment went from 0.75 to 0.85, because the fixed-effect 12% already carries DEVTA's weight.
  - Funging was narrowed to the donation-level question (0.9 to 0.95), so it no longer overlaps the counterfactual.
  - The high end of the full cost per dose went from $1.50 to $2.00 to reflect costly catch-up strategies, and the explainer now shows how the $1.10 was derived.
- **Low, fixed.**
  - Attribution now uses Helen Keller's direct cost, without headquarters overhead, to match the field costing studies.
  - The "nine countries" claim is now sourced to the Global Nutrition Report tracker.
  - The 94.4M capsules caveat says they cover 18 countries.
  - The counterfactual now cites UNICEF's evidence of coverage falling after polio-campaign funding ended.
  - We added the sub-national targeting caveat.

**Round 2** found 0 high, 1 medium and 4 low issues. It confirmed that round 1's high and medium findings were resolved. The result moved from 3.68× to 2.89×. Changes:

- **Medium, fixed.** The counterfactual misread its reference class. UNICEF's regional data show West and Central Africa lost about a third of coverage, 79% to 54%, when polio campaigns were scaled back, not a collapse. The counterfactual is now 0.6 (0.4–0.85), down from 0.7 (0.5–0.9).
- **Low, fixed.**
  - The full cost per dose was raised about 8% for inflation from the studies' 2022–23 prices to FY2025: $1.20, range $0.80–2.10.
  - The write-up now says that reach cancels out, and that the full cost per dose is what matters.
- **Low, answered in the explainer.** Leaving Helen Keller's headquarters overhead out of its cost share is deliberate: the field studies leave out every partner's headquarters costs. Counting it on both sides would add about 9%.
- **Low, accepted.** The zero-valued illness and income rows still have no range, because those benefits are in the unmodelled-benefits adjustment.

The audit loop stopped after round 2, which had no high findings. The changes made after round 2 were not re-audited.
