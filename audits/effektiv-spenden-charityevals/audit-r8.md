# Audit round 8 (scoped verification): Effektiv Spenden (charityevals)
Result: 0.02101 uov/$ = 21.01 years of healthy life per 1,000 dollars (was 23.82 in round 7; the credit shared with GiveWell and Giving What We Can lowers it 12%).

## Scope
The overlap rows added under docs/normalization.md 2.24 ("Overlap"): `caused_donations` (the old `money_moved`), `givewell_shared_share`, `givewell_shared_moved`, `givewell_credit_share`, `gwwc_shared_moved`, `gwwc_sheet_years`, `gwwc_credit_share`, the new `money_moved`, and the facts `@meta.shared_credit_donor_side` (0.5, 0.3-0.7) and `@meta.gwwc_moved_2023_24_via_effektiv_spenden` (and its two sibling totals). The summary and writeups/effektiv-spenden-charityevals.md. No source or scope re-audit.

## Checked
1. `givewell_shared_share` recomputed by hand: poverty share 0.48 x [(1 - 0.2654) x (0.404 + 0.070 + 0.056) / 0.852 + 0.2654 x 719,562 / 2,219,360] = 0.48 x [0.4570 + 0.0860] = 0.2607, the row's 0.26065. Same blend and the same listed-recipients denominators as `value_destinations`, so the two rows describe the same money. Classification: the poverty fund (the fact says it follows GiveWell's All Grants Fund), Malaria Consortium, Against Malaria Foundation, Helen Keller Intl, New Incentives. GiveDirectly, Evidence Action/Deworm the World, StrongMinds and Lafiya are left out as not directed by GiveWell's Top Charities list; that undercounts, which is the fair direction. Reading the 2024 split's unlisted 14.7% as proportional to the listed recipients matches `value_destinations`.
2. `gwwc_shared_moved`: 1,541,950 / 2 x 0.3045 = $234,780 a year. The 2023-24 total divided by the sheet's two years, held for 2025, times ES's own `donor_own_effect`; `gwwc_sheet_years` has a source note. Giving What We Can's `effektiv_spenden_shared_moved` takes (pledge_moved + trial_moved) x the same fact / `@meta.gwwc_donations_2023_24_pledge`, i.e. the same recorded money as its own caused part over its own two years. Each side deducts the other's share of its own caused part of the same recorded gifts, a consistent base. Shares: `gwwc_credit_share` = 1 - fact here, `effektiv_spenden_credit_share` = the fact there, so they sum to 1. The fact is a floor (five named top-100 rows); the note says so.
3. Mechanics: `money_moved` = caused_donations - givewell_shared_moved x 0.5 - gwwc_shared_moved x 0.5 = 9.730M - 1.268M - 0.117M = $8.344M, deducted once, on the amount of money, ahead of the value rows (moved value reads `money_moved`). `informed_money` (advised gifts, $1.016M) untouched. `donor_cost_share` = 1 reads no money moved (cost_total only). At `mobiliser_share` 0.5 the ES-side value row halves exactly (moved_dollar_net_value 0.01966 -> 0.00891 = 0.5 x the value at 0.5); the headline ends at 9.51, not 10.51, only because the recipients' own values (value_destinations) also fall with s. Not new in this change.
4. Summary and writeup: placeholders for result, caused_donations, money_moved, givewell_shared_share, moved_per_dollar; no peer comparison; no "effective altruism". Numbers stale after the change: see findings 1 and 2.
5. Preflight: passes, only the two "out of date" lines for generated files.

## Findings
| # | Severity | Row | Finding | Fix |
|---|----------|-----|---------|-----|
| 1 | Low | writeup, first paragraph | "about eight dollars of giving it caused" no longer matches the model (caused 7.3 dollars per dollar spent, credited 6.2, `moved_per_dollar` 7.0 with advised gifts); typed figure. | Replace with `{{row:moved_per_dollar}}`, or reword to "about {{row:moved_per_dollar}} of giving credited to it for each dollar it spends". |
| 2 | Low | `informed_money` explainer | "Platform donations it caused (money_moved, about $10M)": typed, and `money_moved` is now $8.3M credited ($9.7M caused). | Use `{{row:money_moved}}`. |
| 3 | Low | writeup, "How the model works" | "(30% to 70%)" is a typed figure from the shared fact. | Drop the parenthesis, or say "half, from 30% to 70% by the shared judgment" without numbers inside a row placeholder. |
| 4 | Low | `gwwc_shared_moved` | Pledgers' gifts to the poverty fund (about $115K of the $1.54M over two years) can also sit in `givewell_shared_moved`, so a few $10K are deducted twice (under 0.5% of `money_moved`). | Accept and note in the explainer, or scale `gwwc_shared_moved` by (1 - givewell_shared_share) in both models together. |

Verdict: pass
Model-sha: 780a43cb685d21a669069b4eee6ef695ca0fef9069813ab56f25932b702cc8ba
