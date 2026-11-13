# Audit: dogs-trust-charityevals, round 4

Result: 0.4858 ced/$ = 5.34e-5 years of healthy life per $1,000 (combined range 8.6e-6 – 3.3e-4); cause median 7.43e-4 (×0.072). Verdict: pass.
Model-sha: 5f0b02a8662a2efc0c1c8bbf640e42b134f2bdd0b015481e06fb2c4abfe16194

Scope: unchanged from round 3 (rehoming, prevention, brand and 80% of international work, year to 31 Dec 2025; the rabies model takes the other 20%). This round checks only whether round 3's high is settled and whether the change and the text updates brought new problems.

Mechanical: lint 0 high / 0 medium / 2 low (far-below, with the summary's reason; spread, now 18,921× joint on the model's own ranges, which the summary names), invariants none, normalization-audit and simulation-check not re-run (only one row split and text changed; audit-model's tornado and result are as expected). generated/ untouched (audit-model wrote nothing).

Where the result comes from: the change barely moves the result (5.06e-5 → 5.34e-5, +5.5%): the best guess per advised owner is 0.33 × 0.1 = 0.033 points against 0.03 before, so the split is neutral at the defaults, as it should be. The owners' count (9,500, observed) is unchanged, the gain is discounted over `prev_years_better_life` inside `wellbys_people`, and the formula applies counterfactual, attribution and delivery as before. Bites stay near 14% of the result, dogs under 1%, the rest people.

Previous round:
1. `prev_owner_ls_gain` (high): **settled, downgraded to medium** (finding 1). The two choices are now separate rows (`prev_owner_share_eased` 0.33, 0.15–0.5; `prev_owner_ls_gain` 0.1, 0.03–0.3), the low end is positive, the duration is stated and discounted, and a reference class is named. What remains is that the named paper does not support the way it is described and gives no magnitude.
2. `bites_per_dog_year` (medium): **not resolved**, carried forward (finding 2).
3. `freedom_credit` (medium): **not resolved**, carried forward (finding 3).
4. Presentation (medium): **mostly resolved**. Summary now says 0.00005, names people as "most of the result" and bites as a side effect; the beneficiaries are redone (GBR 0.845, overseas 0.155: matches 84% people plus under 1% UK dogs, and the bite and overseas dog shares spread over WVS's countries, summing to 1.0); "What drives" names bites. Still open as low: finding 4.
5. Round 3 lows 5, 6, 7: **not resolved**, carried forward (findings 5, 6, 7).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | source | `prev_owner_ls_gain` | The row is still the biggest single judgment (tornado 3.2e-5 – 1.15e-4) and its reference class is misdescribed. The explainer says Spitznagel et al. (Vet Rec 2017) studied "owners of animals with chronic or behavioural problems". I checked the paper (PubMed 28870976, "Caregiver burden in owners of a sick companion animal", 238 owners, 119 with a dog or cat with chronic or terminal disease against 119 matched healthy controls): it covers chronic or terminal illness, not behaviour problems, and reports burden, stress and depression/anxiety scores, not life-satisfaction points. The 0.1 is said to be "a tenth of the gap the site's sources give for moderate life strains"; I found no such figure in assumptions/, facts/ or docs/ (the site has no row for it), so the conversion from caregiver burden to 0.1 points is unsupported. The split itself (a third eased, tied to `prev_suffering_share_avoided`'s "about a third") and the positive low end are fine. | Explainer of the row, against the paper's abstract; grep of assumptions, facts and docs. | Say what the paper covers (owners of chronically or terminally ill pets) and that behaviour problems are judged to impose a smaller burden; either give the conversion from the study's effect size to life satisfaction points with its source (for example the standardised gap times a life-satisfaction SD, or van den Berg, Fiebig and Hall 2014 for informal caregivers) or delete "a tenth of the gap the site's sources give" and state 0.1 as a judgment below the sick-pet class. Keep the range 0.03–0.3. | Not a defaults change; at 0.03 the result falls to 3.2e-5 (-40%), at 0.3 it rises to 1.15e-4 (+115%): the range stays as is. |
| 2 | medium | source | `bites_per_dog_year` | Open from round 3: anchored on a reasoning chain and Bosnia's proportional fall (PDF page 19), not on a measured bite incidence per free-roaming dog. Tornado 4.8e-5 – 6.9e-5 (bites are about 14% of the result). | Unchanged row. | Fetch Sudarshan et al. 2007 (India, about 17 million bites a year) and one more country, compute bites per free-roaming dog-year, set the range around it. | +30% at 0.06, about +150% if 0.2. |
| 3 | medium | source | `freedom_credit` | Open from round 3: 25% (10–50%) rests only on "very few refuges take pets" (report p. 21). Tornado 4.6e-5 – 6.6e-5. | Unchanged row. | Anchor on the share of survivors who delayed leaving or stayed because of a pet (Ascione et al. 2007, Violence Against Women 13(4); Dogs Trust's own Freedom research where published), converted with the time-gained rule in the explainer. | ±20% at the range ends. |
| 4 | low | presentation | write-up, `beneficiaries_note`, adopters' zero | (a) "How this model was checked" is out of order and states round 4 "verified it" before this round was written: the round 3 sentence precedes round 2's, and the round-4 clause describes an outcome the text can't yet know. (b) "Biggest uncertainties" still names only the dogs' suffering change, Freedom, WVS campaigns and the international split; the owners' gain and share eased (the top judgments) and the bite rates are not listed. (c) "What isn't modelled" still gives adopters' zero the ownership-studies reason, not the counterfactual one (adopters would adopt or buy elsewhere). (d) `beneficiaries_note` says UK dogs are "under 1%" but does not mention that the bite and overseas dog shares sit under the neutering countries; the country weights do. | Write-up lines 23-26, 30, 34. | (a) Reorder rounds 1, 2, 3 and write only what has happened (round 4's outcome after this file exists); (b) add one bullet: "How much an advised owner's life satisfaction rises and for how many (our judgment) and how many bites neutering averts"; (c) give the counterfactual reason; (d) optional. | None. |
| 5 | low | missing-adjustment | `homeless_owner_ls_gain`, tenants, bites | Open from round 3: (a) points hide the support branch's year (`sup_years_better_life`) undiscounted, no anchor beyond the report; (b) tenants' wellbeing from the Renters' Rights Act neither added nor said to be left out; (c) PEP's out-of-pocket cost not valued; (d) bite DALYs over `neu_adult_years` undiscounted (about 1% of the result). | Rows named. | (a) Split into points and `sup_years_better_life` × `pv_annuity_due`; (b) one sentence in "What isn't modelled"; (c) add the cost or say it is small; (d) `pv_annuity_due(1, $discount_rate, neu_adult_years)`. | Each under 5%. |
| 6 | low | source | `freedom_children_per_survivor` | Open from round 3: explainer "many survivors leave with children", no share. | Explainer. | Cite Women's Aid's annual audit share of residents with children and children per family. | ±7% at the range ends. |
| 7 | low | sensitivity | (lint: spread) | Joint spread is 18,921×, from the owners' gain and share, `freedom_credit`, `freedom_years_gain` and the bite rates. The summary names the uncertainty. | audit-model. | Narrow with findings 1-3's anchors; keep the summary's sentence. | None at the defaults. |

## Double counting
- Owners' gain: the share eased (0.33) and `prev_suffering_share_avoided` (about a third of dogs with a fixed problem) are the same judgment applied to two beneficiaries (owners, dogs), which is consistent, not double counting. They move together in reality, but the simulation draws them independently, a slight widening only.
- Bites against the rabies model, Freedom's counterfactual and the owners against the dogs: unchanged from round 3, no overlap.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| prev_owner_ls_gain (reference class) | https://pubmed.ncbi.nlm.nih.gov/28870976/ | mismatch | Paper is about owners of chronically or terminally ill pets, not behaviour problems; reports burden/stress/depression scores, no life-satisfaction points (finding 1). |
| prev_owner_share_eased | none | judgment | Same third as `prev_suffering_share_avoided`; ranged and positive. |
| prev_owners, problem mix | https://docs.dogstrust.org.uk/Annual-Report-2025.pdf | verified (round 3) | Unchanged. |
| bites_per_dog_year, freedom_credit, freedom_children_per_survivor, homeless_owner_ls_gain | none | unsupported (judgments) | Findings 2, 3, 5, 6. |

## Drivers
1. `prev_owner_ls_gain` and `prev_owner_share_eased` (judgments, now two rows, a named though misdescribed reference class): together the largest driver, about half the result.
2. `$missing_data_discount` and `$daly_per_wellby` (shared sliders) through every people row.
3. `prev_years_better_life` (0.5 to 5): 3.0e-5 – 9.5e-5.
4. `prev_counterfactual_adj` (0.2 to 0.8): 3.5e-5 – 7.2e-5.
5. `freedom_years_gain`, `dalys_per_bite`, `bites_per_dog_year`, `freedom_credit` (judgments): each 4.5e-5 – 7.5e-5.

What would most improve the model: correct the reference-class description and give the conversion to life-satisfaction points (finding 1), then the bite incidence and Freedom's credit anchors, and fix the write-up's round history and uncertainties.

Verdict: pass. Findings: 0 high, 3 medium, 4 low.
