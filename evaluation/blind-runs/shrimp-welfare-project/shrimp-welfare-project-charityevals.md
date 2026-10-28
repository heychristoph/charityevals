## Summary

Shrimp Welfare Project (SWP) buys electrical stunners and lends them to large shrimp producers, so that shrimp are knocked unconscious before they are chilled to death in ice slurry. We model this program, the Humane Slaughter Initiative, for SWP's financial year April 2024 to March 2025. Our estimate is **about 15 suffering-adjusted days (SADs) averted per dollar you give, about 3.9 times GiveDirectly**, at the site's default exchange rates between animal suffering and human wellbeing.

The result is mostly uncertainty. The suffering one stunned shrimp is spared moves it on its own from 0.35 to 70 times GiveDirectly. With all of our inputs at their ends, and the shared exchange rates held at their defaults, it runs from 0.013 to 620 times. Three other readings bracket ours (see "How the model works"):

- **Ambitious Impact's newer 2026 method:** about 0.6 times GiveDirectly.
- **Rethink Priorities' pain weights:** about 35 times.
- **Ambitious Impact's 2024 figure with 20 minutes of pain:** about 67 times. The site's Aquatic Life Institute model uses this figure.

## What the charity does

SWP is a UK charity (number 1204414), founded in 2021 through Charity Entrepreneurship (now Ambitious Impact). It works mainly in South and Southeast Asia and Latin America. Its programs:

- **Humane Slaughter Initiative**, modelled here. SWP pays for an electrical stunner (about $65,000) and keeps ownership of it. The producer commits to stunning at least 1,800–2,000 tonnes of shrimp a year, pays freight and import duties, and lets other producers visit. SWP can take the stunner back if the terms aren't met. By autumn 2026 SWP reported 37 signed agreements in 9 countries, 20 stunners installed, and about 3.6 billion shrimp a year covered by the installed ones.
- **Sustainable Shrimp Farming in India**, which works on farm practices such as sludge removal.
- **Corporate and retailer work**: shrimp welfare policies (for example Morrisons in 2024) and commitments to stop eyestalk ablation.
- **Research**, such as a Shrimp Welfare Index and a stunning study with the University of Stirling.

## How the impact happens

1. **Stunners bought.** In the year, SWP bought about 7.6 stunners: £388,162 of equipment at about $65,000 each.
2. **Shrimp reached.** Each stunner handles about 2,550 tonnes of shrimp a year (SWP's figures for installed stunners and signed agreements). At about 66,000 shrimp per tonne, that is about 1.3 billion shrimp a year.
3. **Suffering spared.** Each shrimp is stunned in a second or so instead of dying conscious in ice slurry, which Rethink Priorities estimates involves about 48 seconds of excruciating and 3 minutes of disabling pain. Valued with Ambitious Impact's SAD method (its pain weights, intensity convention and moral weight for shrimp), that is 0.0056 SADs per shrimp.
4. **Duration.** The benefit lasts as long as the producer stuns earlier than it otherwise would have: about 5 years, or 4.6 discounted.
5. **Adjustments.** Together they come to 0.43:
   - stun quality in commercial use: 0.7
   - producers that would have bought a stunner anyway: 0.85
   - credit shared with producers, who pay for installation and running: 0.9
   - stunners used on less than the full committed volume: 0.8

## How the model works

**Cost.** We use the audited accounts for the year to 31 March 2025, filed at Companies House, and count cash:

- total expenditure: £592,743
- minus depreciation on stunners bought in earlier years: £116,346
- plus stunners bought this year: £388,162

That comes to about £865,000, or $1.10 million at 0.783 £/$. The stunner program is costed as the stunners themselves plus half of SWP's other program costs (a judgment, range 30–70%). With a 7% overhead multiplier, the cost is **$818,000**.

**Reach.** Stunners bought (purchases ÷ price) × tonnes per stunner per year × shrimp per tonne = **1.28 billion shrimp a year**. As a check, SWP's own headline of about 1,400 shrimp helped per dollar per year matches our unadjusted 1,600.

**Effect.** We added a shared fact, `@sad_factors.sads_per_shrimp_stunned` (0.0056, range 0.0005–0.1). It uses Ambitious Impact's (AIM) 2024 calculation for shrimp stunning (its version 1), as ACE used it for Aquatic Life Institute. That calculation has these inputs:

- pain weights: excruciating pain counts 11.85 times disabling pain
- probability that shrimp are sentient: 0.3
- welfare range: 0.62
- share of shrimp the stunner knocks out: 0.97
- a ×3.18 multiplier for the steep rise in pain intensity

The ×3.18 was part of AIM's version 1 for every species: ACE's 2025 sheets apply it to AIM's pig figures too. We stay on version 1 on purpose, because the site's other SAD facts come from ACE's 2025 sheets, which use it. The ×3.18 scales every pain level equally, so the ratio of excruciating to disabling pain stays at AIM's 11.85. That is at the low end of Rethink Priorities' range of 5 to 1,000.

In early 2026 AIM replaced this method with version 2. Version 2 drops the ×3.18, lowers shrimp's moral weight from about 0.19 to about 0.083, and uses about 4.8 minutes of slaughter pain, citing Rethink Priorities. On version 2 the fact would be about 0.0008, which puts SWP at about 0.6 times GiveDirectly. When the site's SAD facts move to version 2, this fact should move with them.

We change one input, the duration. AIM assumes 20 minutes of excruciating pain. That figure is the Global Seafood Alliance's recommended minimum time in the slurry to stop all movement, which is an upper bound for the slowest animals. We use Rethink Priorities' estimate instead: about 48 seconds excruciating plus 3 minutes disabling.

The range around 0.0056 is mostly about how much worse excruciating pain is than disabling pain:

- **High end, 0.1.** This is AIM's unmodified version 1 figure. It sits above Rethink Priorities' own weighting: Rethink Priorities treats excruciating pain as 5 to 1,000 times disabling pain, with a mean of 502, which gives 0.051, or about 35 times GiveDirectly. The high end also allows for producers whose alternative is slower death by asphyxiation in air.
- **Low end, 0.0005.** About a minute of pain, at AIM's weights without the ×3.18.

**Outcome.** 1.28 billion × 4.63 years × 0.0056 × 0.43 = about 14 million SADs, or **17 SADs per dollar**. With salary sacrifice counted, that is **15 per dollar you give**. People are 43% of costs and are paid about 25% below what they could earn elsewhere.

## What drives the result

1. **SADs per shrimp stunned** (0.0005–0.1): 0.35× to 70× GiveDirectly. Inside it, the weight on excruciating against disabling pain and the duration of pain are the two biggest judgments.
2. **The shared exchange rates**: the weight on animal suffering (0.05–1) and DALYs per SAD. These move every animal model on the site equally.
3. **Years brought forward** (2–10): 1.7× to 7.1×.
4. **Stun quality** (0.4–0.9): 2.2× to 5.0×.

## Biggest uncertainties

- **How long and how badly a shrimp suffers in ice slurry, and how much that counts.** These are the duration (Rethink Priorities' roughly 4 minutes against AIM's 20), the intensity weight (AIM's against Rethink Priorities' 5–1000 range) and the moral weight (AIM's 0.19 against Rethink Priorities' median of 0.031 and long tail). Together they span a 200-fold range. We follow AIM's version 1 method, the basis of the site's other SAD figures, and change only the duration. AIM's own 2026 version 2 gives a figure about 7 times lower.
- **Whether stunning works in the field.** The only controlled study on whiteleg shrimp (Somerville et al. 2026, Stirling) found that electrical stunning makes shrimp insensible faster than ice slurry alone. However, some shrimp given the shorter, lower-voltage stun responded again once in the slurry. No field audits of stun quality at SWP's partners have been published.
- **Use versus commitment.** SWP's shrimp numbers are projections from signed volumes, and its monitoring of verified use is still being built.
- **How many years earlier.** We found no published service life for the stunners; the accounts write them down at 25% a year on a reducing balance. UK and EU retailers have begun requiring stunning, so some partners that export to them would have adopted it within a few years anyway.
- **Cost coverage.** We treat the UK charity's accounts as all of SWP's spending, since it is the only entity SWP names. People costs look small for the size of the team, and the accounts don't split costs by program.
- **Reserves.** SWP ended the year with £2.65 million in cash, about four years of that year's spending. A new donation therefore mostly funds future years, at a cost per shrimp we can't yet see.

## What isn't modelled

- **Industry tipping.** SWP's strategy is to show that stunning works at scale, so that other producers and retailers adopt it. Any adoption beyond the stunners SWP buys is not counted. This is a potentially large upside that we couldn't estimate from evidence.
- **SWP's other programs**: Sustainable Shrimp Farming in India, eyestalk-ablation commitments, retailer policies, research and policy work. Their costs are left out, except their share of overhead.
- **Other welfare effects at partner farms**, such as the "good or improving" practices SWP requires of partners.
- **Agreements without a purchased stunner.** Stunners that were committed but not yet bought in the year are not counted, and neither is their future cost.

## Sources

- Shrimp Welfare Project Ltd, audited accounts and trustees' report for the year ended 31 March 2025 (Companies House 14013279), pp. 3, 9, 10, 15, 16. https://find-and-update.company-information.service.gov.uk/company/14013279/filing-history
- SWP, Humane Slaughter Initiative page and (Shr)Impact page, retrieved 2026-10-28. https://www.shrimpwelfareproject.org/humane-slaughter-initiative, https://www.shrimpwelfareproject.org/shrimpact
- Boddy & Jiménez Zorrilla (September 2023), Two years of Shrimp Welfare Project (source of the stunner price). https://forum.effectivealtruism.org/posts/Qo3559TqP5BzoQyWX/
- SWP (2025), 2030 vision and absorbency plans. Only SWP's own figures were used. https://forum.effectivealtruism.org/posts/Ztqzt4BWMPZW5ECfP/
- Ambitious Impact SADs, via ACE's Aquatic Life Institute CEA (2024), SADs Estimate tab. https://docs.google.com/spreadsheets/d/113VWopanUvFiSS9KO3ruj4W8d77MUg0b2IlsVg-hr7M/edit
- McKay & McAuliffe (2024), Quantifying and prioritizing shrimp welfare threats, Rethink Priorities. https://rethinkpriorities.org/wp-content/uploads/2024/06/Quantifyingandprioritizingshrimpwelfarethreats.pdf
- Fischer (2023), Rethink Priorities' welfare range estimates. https://forum.effectivealtruism.org/posts/Qk3hd6PrFManj8K6o/
- Somerville et al. (2026), Aquaculture 626:744375. https://www.stir.ac.uk/research/hub/publication/2280970
- IRS yearly average exchange rates. https://www.irs.gov/individuals/international-taxpayers/yearly-average-currency-exchange-rates

## How this model was checked

Mechanical checks (`scripts/audit-model.ts`, `scripts/check.ts`) pass. Each audit round was done by a separate reviewer with no access to the build notes.

**Round 1** found 3 high, 5 medium and 8 low findings. The high findings were all in the SADs-per-shrimp figure:

- AIM's ×3.18 multiplier was not disclosed.
- AIM's 20 minutes is a minimum immersion time, not a duration of pain.
- The Rethink Priorities comparison used a median against a point value.

We rebuilt the fact: AIM's method without the ×3.18, with Rethink Priorities' durations. This moved the result from 57× to about 1.3× GiveDirectly. Medium findings fixed:

- Retailer pressure was counted three times. It was removed from the credit share, which went from 0.8 to 0.9.
- The delivery adjustment had been based on agreements rather than stunners bought. It went from 0.65 to 0.8.
- Years brought forward were tied to the stunners' accounting life: 5 instead of 6, with a range of 2–10.

Low findings fixed: the date of the stunner price, the exchange rate, notes on reserves and cost coverage, and explicit notes on the staff share and on the dropped template row.

**Round 2** found 2 high findings and 3 medium ones, plus some low ones. Both high findings were again in the SAD fact:

- The best value paired Rethink Priorities' mean durations with AIM's lowest-end intensity weight, and the explainer misstated Rethink Priorities' mean.
- ACE's sheets show that the ×3.18 is AIM's convention across species, including pigs, so dropping it for shrimp alone undervalued shrimp against the other SAD facts.

We restored the ×3.18 and kept AIM's method, changing only the duration. We made the intensity weight an explicit part of the range, with a high end of 0.1 that covers Rethink Priorities' mean weighting (0.051) and AIM's unmodified figure. The result moved from 1.3× to 3.9× GiveDirectly. We also fixed the stale total-adjustment explainer, the summary's range qualifier, the price citation, the source for the agreement counts, and the "indefinite usage" term.

**Round 3** found 1 high finding, 2 medium ones and several low ones.

- **High:** the fact called the ×3.18 AIM's "current" convention, but AIM's 2026 version 2 drops it and lowers shrimp's moral weight. We now say that the fact stays on version 1 on purpose, for consistency with the site's other SAD facts, and give the version 2 reading (about 0.6 times GiveDirectly) next to ours.
- **Medium:** the explanation of the pain-intensity ratio was wrong, and the comparison with Rethink Priorities' weights was misstated. Both are corrected.
- **Low:** the source of the "overestimating" note (ACE, not AIM), the description of the depreciation method, and a rounding error in the cost figure. All are corrected.

These round 3 changes were not re-audited, because the process allows at most three rounds.
