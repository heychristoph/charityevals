### Summary

Shrimp Welfare Project buys electrical stunners and lends them to shrimp producers in Asia, Latin America and Africa. In return the producers commit to stunning part of their harvest before slaughter, where the shrimp would otherwise die slowly in ice slurry or by asphyxiation. Our own model covers the stunners bought in the year to March 2025 and comes to **<span data-figure="headline" data-model="shrimp-welfare-project-charityevals">1.6</span> years of healthy life per $1,000** you give, using our default exchange rates between suffering and healthy life.

The figure is highly uncertain. Most of that comes from two shared figures: how much a shrimp can suffer compared with a chicken, and how much suffering one stun spares. The model covers the stunner programme, about four-fifths of the charity's programme spending that year. Its work with retailers, its farmer programme in India and its research aren't counted.

### What the charity does

Shrimp Welfare Project is a UK charity founded in 2021. Its main programme, the Humane Slaughter Initiative, pays for an electrical stunner (about $55,000 to $106,000) for a producer that commits to stun at least about 1,900 tonnes of shrimp a year. The producer pays freight and import duties. The charity keeps ownership and can take the stunner back if the producer doesn't stun the agreed volumes. By November 2026 it had signed 37 such agreements in 9 countries, and 20 stunners were installed. It also asks retailers to adopt shrimp welfare policies (Morrisons in the year modelled), works with farmers in India on pond water quality, and publishes research.

### How the impact happens

A stunned shrimp loses consciousness in seconds instead of dying over minutes. Each stunner the charity buys commits a producer to stunning a fixed volume each year. Credit goes to the years the producer stuns because of the loan, before it would have bought a stunner anyway.

### How the model works

- **Cost:** what the stunner programme cost in the year to 31 March 2025, from the audited accounts. That is the stunners bought (£388,162) plus the programme's share of running costs, which is our judgment of 55% (35–70%) because the accounts don't split spending by programme. Depreciation and currency losses are left out, so stunners aren't counted twice. Support and governance costs are spread on top, on the same cash basis. Pounds are converted at the shared 2024 rate.
- **Reach:** the charity's own list of producer agreements gives each agreement's yearly production, the share committed to be stunned and the stunner's price. The eleven agreements of that year commit 0.042 tonnes a year per stunner dollar. At about 60 shrimp a kilogram (FAO's pond harvest sizes of 15–25 g; the charity assumes about 70), the year's purchases come to about 1.3 billion shrimp a year.
- **Effect:** the site's shared figure for suffering averted per shrimp stunned. A stunner's work counts for the site's "Years a won reform counts before it would have come anyway" (5 by default), but never longer than the stunner works (8 years, 4–12). Two waits are discounted: about a year in reserves, since the charity held about three years of spending in the bank at year end, and about a year between purchase and stunning.
- **Adjustments:** whether everyday stuns work as the shared figure assumes (0.85). The share of producers who wouldn't have bought a stunner themselves as soon (0.75). The charity's share of everything that went into the stunning, producers' costs and other groups' retailer campaigns included (0.75). The share of committed volume actually stunned (0.6, 0.3–0.85; shrimp pledges have no shared record of pledges kept, and 20 of 37 agreements were installed by November 2026). Effects not modelled, mostly other producers following the example (+10%).
- **The dollar:** a price per stunner, so the next dollar buys more stunners at about that price (`unit_cost`). It isn't discounted as a past average.

### What drives the result

The two shared animal figures matter most: **how much a shrimp can suffer relative to a chicken** and **suffering spared per stunned shrimp**. The shared figure's best guess sits at the bottom of its range, so the result could be many times higher. After those come **how many years a won reform counts** and **the share of committed volume producers actually stun**.

### Biggest uncertainties

- Whether producers stun what they committed to. The charity's own page says its checks of actual use are still being strengthened.
- Whether producers would have bought stunners themselves anyway, as European retailers start asking for stunned shrimp.
- How the year's spending splits between programmes. The accounts give no split.
- How long a stunner works in a wet processing hall. No source gives this.

### What isn't modelled

Retailer engagement (about 7% of the year's programme spending), research and communications (about 9%) and the Sustainable Shrimp Farming in India programme (about 5%) have no figure we can turn into suffering averted, so they are left out. Their cost stays out of the result, so the result covers the stunner programme only. Retailers' stunning policies also raise demand for stunned shrimp, which helps the stunner programme. That part is in the charity's share of credit, not counted separately.

### How this model was checked

The mechanical audit (lint and invariants) has no findings. Independent audits, each by a fresh reviewer:

- **Round 1** (1 high, 3 medium, 8 low). High: money waiting in reserves wasn't discounted. We added a year's wait (0.5–2). Medium: the programme-share judgment cited the trustees' report for something it doesn't say, so it is now anchored on the team and its low end widened to 0.35. Shrimp per kilogram now rests on FAO's harvest sizes (60, 40–90) instead of the charity's assumption alone. The explainer for producers keeping their commitments now quotes the charity's pages and is anchored on the installed share (0.6, 0.3–0.85). Low: the overhead multiplier is now on the same cash basis, currency losses are out of cost, and the staff share is the programme's own. The evidence adjustment covers only misuse beyond what the shared figure assumes (0.85). Unsourced anchors were sourced or removed, and the summary now says about 2 years.

- **Round 2** (1 high, 1 medium, 5 low). High: with this model in the library, the animal-welfare median fell and The Humane League's figure rose above ten times its peers without its summary saying why; its summary now gives the reason. The earlier normalization checks had left this model out by mistake, so they were rerun with it included. Medium: the counterfactual's anchor wrongly put a stunner at a year's margin. At FAO's prices and costs it is about 6% of a year's margin on the committed volume, so the judgment now rests on buyers not paying more, missing know-how and first purchase. Low: interest earned on cash in reserves now grows the waiting dollar, the reserves explainer gives the right cash spending (£0.80 million), shrimp per kilogram also cites the charity's all-commitments figure, and the fallback headline text matches the result.

- **Round 3** (0 high, 0 medium, 3 low). The waiting money's return now nets the year's currency losses against its interest. The species claim behind shrimp per kilogram is worded as the source supports, and the summary gives the result as about 1.6. With this model included, the normalization invariants all pass.

### Sources

Shrimp Welfare Project's [audited accounts for the year to 31 March 2025](https://register-of-charities.charitycommission.gov.uk/en/charity-search/-/charity-details/5201958/accounts-and-annual-returns), its [(Shr)Impact page](https://www.shrimpwelfareproject.org/shrimpact), its [Humane Slaughter Initiative impact model](https://www.getguesstimate.com/models/22982) and [programme page](https://www.shrimpwelfareproject.org/humane-slaughter-initiative), and its [team page](https://www.shrimpwelfareproject.org/team).
