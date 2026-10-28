## Summary

Sociedade Vegetariana Brasileira (SVB) works with Brazilian public institutions to put plant-based meals on the menu one or more days a week. Our model covers only that institutional program, Segunda Sem Carne ("Meatless Monday"). Our best guess is **about 19 suffering-adjusted days (SADs) averted per dollar, roughly 5× GiveDirectly** at the site's default exchange rates. The plausible range is very wide. Most of that width comes from the shared cross-cause rates and from what one replaced meal is worth, not from anything specific to SVB.

## What the charity does

SVB is a São Paulo nonprofit. Its 2023 budget was about R$3.0 million (US$0.6 million). Since 2009 its institutional program has helped São Paulo's city and state schools, the Bom Prato popular restaurants, social-assistance centres, hospitals and companies serve plant-based meals. Its support covers diagnosis, recipes, training for cooks, and materials. SVB says these partners have served more than 530 million such meals. SVB also runs a vegan certification label (Selo Vegano), restaurant outreach (Opção Vegana), nutrition and health content, events and public campaigns.

## How the impact happens

A school or canteen serves a plant-based meal instead of one with meat. Less meat is bought, so somewhat fewer animals are raised. The model counts the suffering of those animals in SADs, Ambitious Impact's unit, which weights days of suffering by intensity and by each species' welfare range.

## How the model works

- **Cost**: SVB's 2023 program costs (R$2.84 million) times an estimated 20% share for the institutional program, based on headcount. Add overhead (×1.07) and convert at 4.994 BRL/USD: about US$121,000.
- **Reach**: about 35 million meals a year (20–55 million). SVB publishes only cumulative totals, so this is the difference between them: 327 million in July 2019, over 500 million in October 2023, over 530 million in October 2024.
- **Effect per meal**: the shared SADs-per-meal figure, scaled to SVB's portions. SVB reported 2,000 tonnes of meat saved over 47 million meals in 2017, about 43 g per meal (range 25–60 g). The shared figure comes from canteen meals (schools, universities, community kitchens) in Argentina, Colombia and Indonesia. We compare SVB's portion with about 60 g of meat in the reference meal (35–100 g; the source doesn't say whether its values describe canteen portions or an average national meal), and we adjust for Brazil's beef-and-chicken mix: 80% of the shared value, between Argentina's 0.60 and Colombia's 0.88 SADs per meal. That gives about 0.52 SADs per meal. The result is multiplied by the shared production response (0.76). Each year of spending is credited with one year of the meal flow.
- **Adjustments**:
  - Evidence, 0.75: people may compensate by eating more meat at other meals, and some meals use eggs or cheese.
  - Counterfactual, 0.5: many partnerships are years old and might continue without SVB. None of them is mandated by law: São Paulo state's bill was vetoed in 2018, and a federal bill was rejected in committee.
  - Attribution, 0.7: credit is shared with municipalities, Humane Society International and Mercy For Animals.
  - Delivery, 0.7: the meal counts are SVB's own and likely planned rather than eaten, and pupils may skip the meatless meal.
  - Combined: 0.18.
- **Your dollar's share**: staff, mostly contracted consultants, are about 45% of costs, with a 20% pay gap.

## What drives the result

The biggest single driver is the SADs per replaced meal, a shared fact (0.084–1.72). Across that range the result moves from 0.4× to 9× GiveDirectly. The shared exchange rates come next: animal moral weight, DALYs per SAD, and units of value per DALY. The SVB-specific inputs that matter most are:

- the share of spending on the institutional program
- the counterfactual adjustment
- the annual meal count
- the meat per meal

Comparisons with other animal charities on the site are not like-for-like. Those models are imports from Animal Charity Evaluators, which don't apply the production response; ours does, which lowers the result by 24%.

## Biggest uncertainties

- **Annual meals**: SVB has published no annual count since 2019, and none is independently verified.
- **Dependence on SVB**: most of the year's meals come from long-standing partnerships. We don't know how many would continue if SVB stopped.
- **Compensation**: no study measures whether Brazilian pupils eat more meat at home after a meatless school meal. Helsinki's vegetarian school day at first reduced how many pupils took lunch.
- **Cost split**: SVB's accounts don't break costs down by program.

## What isn't modelled

- Selo Vegano certification
- Opção Vegana restaurant outreach
- Individual Segunda Sem Carne pledges. SVB cites a survey in which a third of sign-ups became vegetarian, but the respondents chose themselves.
- Public campaigns and events
- Policy work, such as municipal bills for plant-based meals
- Health and environmental benefits for people

## How this model was checked

Independent audits by separate reviewers (audit-cea skill):

- **Round 1**: 1 high, 5 medium, 5 low findings.
  - High: we credited each year of spending with 1.5 years of the meal flow, which double counts future meals. Now 1 year.
  - Pupils skipping the meal was discounted twice. It now sits only in the delivery adjustment, and the evidence adjustment rose to 0.75.
  - The institutional share was lowered to the headcount-based 20%.
  - Meat per meal now has a range.
  - The reference portion is explained, with notes on species mix.
  - We also added notes on the reach window, the pay gap for consultants and the production response for beef.
- **Round 2**: 1 high, 2 medium, 4 low findings.
  - High: the 110 g adult reference portion compared SVB's school meals with the wrong kind of meal, because the shared figure comes from canteen meals. The reference is now a 50 g canteen meal, plus a species-mix adjustment for Brazil (80%). This raised the result from about 3× to about 6× GiveDirectly.
  - The counterfactual explainer now notes that no partnership is legally mandated.
  - Sources were added for the Humane World for Animals partnerships and the 2018 meal count.
- **Round 3**: 0 high, 3 medium, 4 low findings.
  - The reference portion was widened to 35–100 g (best 60 g). The source gives one value per country, which may describe an average national meal rather than a canteen portion. This lowered the result to about 5× GiveDirectly.
  - The species-mix row was relabelled as our judgment.
  - The counterfactual explainer now mentions parallel school-meal programs and the unconfirmed Santos bill.
  - An unsourced claim about Humane Society International was removed.
  - Still open: the counterfactual and evidence adjustments have no reference class, and the joint range is very wide.

## Sources

- SVB, [Demonstrações Contábeis 2023 e 2022](https://svb.org.br/wp-content/uploads/2024/08/FinanceiroSVB2023.pdf) and the [accountability page](https://svb.org.br/a-svb/prestacao-de-contas/).
- [Segunda Sem Carne campaign history](https://segundasemcarne.com.br/a-campanha-segunda-sem-carne/).
- SVB, [15 years of Segunda Sem Carne](https://svb.org.br/comemoracao-dos-15-anos-da-segunda-sem-carne-no-brasil-reuniu-parceiros-amigos-e-jornalistas/).
- SVB, [12+ achievements in 2024](https://svb.org.br/12-conquistas-da-svb-em-2024/).
- SVB, [Segunda Sem Carne do Brasil é a maior do mundo](https://svb.org.br/2456-segunda-sem-carne-do-brasil-e-a-maior-do-mundo/).
- TNH1, [No país do churrasco…](https://www.tnh1.com.br/noticia/nid/no-pais-do-churrasco-movimento-por-um-dia-sem-carne-e-o-maior-no-mundo/) (2018).
- SVB, [team and departments](https://svb.org.br/a-svb/sobre-a-svb/equipe-e-departamentos/).
- Lombardini and Lankoski (2013), [Forced Choice Restriction in Promoting Sustainable Food Consumption](https://ideas.repec.org/a/kap/jcopol/v36y2013i2p159-178.html), Journal of Consumer Policy 36:159–178.
- IRS, [yearly average exchange rates](https://www.irs.gov/individuals/international-taxpayers/yearly-average-currency-exchange-rates).
