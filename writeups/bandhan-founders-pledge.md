### Summary

Bandhan Konnagar runs Targeting the Hardcore Poor, a graduation program that gives the poorest women in West Bengal a productive asset, a small stipend, training and coaching over a two-year program. Founders Pledge's 2018 analysis, which we rebuilt row by row, comes to **<span data-figure="headline" data-model="bandhan-founders-pledge">8.4</span> years of healthy life per $1,000**.

Founders Pledge's own figure is $62 to double one person's consumption for a year. The model reproduces all 11 of its calculated figures.

### What the charity does

Bandhan selects the poorest households in a village, usually ones headed by women with no regular income, and transfers an asset such as goats or a cow. It pays a weekly stipend while the asset starts to earn, and its staff visit each week to train and coach. Founders Pledge put the cost at $410 per household in 2018.

### How the impact happens

1. The asset and coaching raise the household's earnings and consumption.
2. The randomised trial of the program in West Bengal (Banerjee, Duflo and Sharma) found the gains persisting, and even growing, ten years on.
3. Founders Pledge values the gain on a log scale, like GiveWell: doubling one person's consumption for one year is one unit of value, the site's common unit.

### How the model works

The [model](/bandhan/bandhan-founders-pledge) follows Founders Pledge's sheet. It takes consumption in the control group and the gain over it at 1.5, 2.5, 7 and 10 years after the program, and averages the gain over time, weighting each follow-up by the years it stands for. It then assumes the gain lasts 15 years, discounts later years at 4.5%, and scales the total down by 20% because the trial ran in 2007–08 and circumstances have changed. Dividing the cost per person by that total gives the cost of a doubled-income year.

### What drives the result

- **How long the gain lasts.** Founders Pledge's range, 10 to 20 years, moves the result from about three-quarters to about 1.2 times the central figure.
- **The discount for changed circumstances** (50% to 100%, Founders Pledge's judgment).
- **The exchange rate between a healthy year and a doubled-income year** (Your values): a GiveWell-style unit of value is half a healthy year by default.

### Where we differ from Founders Pledge

- **Discount rate:** our view uses the shared rate under Your values (4% by default); Founders Pledge's view keeps its 4.5%.
- **Staff pay:** with credit by share of resources on, staff's pay below what they could earn elsewhere counts as part of the cost. We guess staff pay is 30% of the cost (the rest is mostly the asset and stipend) and the pay gap 15%. Off by default.

### Biggest uncertainties

- The consumption figures come from private correspondence with the trial's authors in 2018, before the ten-year results were published (2021); the sheet gives no ranges for them.
- The program has changed since the trial, and Bandhan now runs it in other states; the 20% discount for this is a guess.
- The household size of 3 sets how many people share the gain; a larger household would raise the result.

### What isn't modelled

Effects beyond consumption (assets, health, children's schooling, women's agency) enter only insofar as they show up in consumption. Founders Pledge's report discusses them; the sheet doesn't count them.

### Sources

- Founders Pledge, [Bandhan's Targeting the Hardcore Poor programme](https://www.founderspledge.com/research/bandhan-targeting-the-hardcore-poor-programme), and its [Women's Empowerment report](https://founderspledge.com/research/fp-womens-empowerment) (December 2018) with the [cost-effectiveness spreadsheet](https://docs.google.com/spreadsheets/d/1kPqBeHN3b7tq9gxho-9M7VGCuO-14CCI1YEsywmy66E/edit). No licence published.
- Banerjee, Duflo and Sharma (2021), [Long-term effects of the Targeting the Ultra Poor program](https://www.aeaweb.org/articles?id=10.1257/aeri.20200667), *AER: Insights*.
