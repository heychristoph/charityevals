# Audit: shrimp-welfare-project-charityevals, round 3

Result: 4.618 ced/$ = 1.686 years of healthy life per $1,000 (joint 4.0e-7 – 1.6e5; model's own ranges 0.080 – 11.1); cause median 8.719 (×0.19). Verdict: **pass** (no high findings).

Scope: the Humane Slaughter Initiative, year to 31 March 2025, the latest audited year. Cost is the stunners at price (£388,162, note 9) plus a 55% (35–70%) judgment of direct running costs, with depreciation (£116,346) and currency losses (£64,373) out. That is about 79% of cash-basis programme spending. Retailer engagement (about 7%), research and communications (about 9%) and the India farmer programme (about 5%) are each under a tenth. They are left out under Convention 12, and the summary and `program_spend` say so. Reach is the eleven agreements of the same period, verified this round (below). Scope is acceptable. The accounts give no programme split (note 5 is by cost type), so the share stays a judgment.

Mechanical: lint 0/0/0 (audit-model "Findings (0)", with warnings only for the wide joint range and the judgment share). Invariants on the model: none. `check.ts shrimp-welfare-project-charityevals`: "✓ all models valid". Normalization-audit (`--exclude shrimp-welfare-project-ace`, which matches nothing, so this model is included): every invariant shows 0 violations, INV-15 included (65 models checked, 0 failing). The run ended with the expected ENOENT writing generated/normalization-audit.json, after the report was printed. No models were reported skipped. Waivers: none cover this model. Allowlist `{}`.

Previous round:
1. (high) INV-15 on the-humane-league after this model lowered the cause median: **resolved**. Both THL models' summaries now say "more than ten times its peers because …", with reasons from their own drivers. INV-15 shows 0 violations with this model in the run.
2. (medium) `counterfactual_adj` anchor ("a year's margin"): **resolved**. The explainer now gives about 6% of a year's margin from FAO's price and cost, which I re-verified: "about USD 3.0–3.5/kg in 2005"; "approximately USD 2.5–3.0/kg for P. vannamei". It rests the 0.75 on the barriers that remain (no buyer premium, know-how, first purchase) and on PT Brother. The unsourced "close to absent" claim is gone.
3. (low) Normalization-audit exclude dropped the model: **resolved**. The write-up records the rerun with the model included. This round's run includes it too.
4. (low) Interest on waiting funds: **resolved**. `interest_income_gbp` 62,651, `cash_start_gbp` 1,269,848 and `cash_end_gbp` 2,647,564 were added, and `interest_yield` and the factor are in `wait_discount`, as proposed. All three figures are verified in the accounts. See finding 1 for an asymmetry this adds.
5. (low) "£0.75 million" cash spending: **resolved**. It now says £0.80 million, matching 592,743 − 116,346 − 64,373 + 388,162 = 800,186.
6. (low) `shrimp_per_kg` charity figure and species mix: **partly resolved**. The 72/kg all-commitments figure was added. The (Shr)Impact FAQ confirms the 6.5 billion is HSI volumes only. A global share was added (EU observatory, verified: "whiteleg shrimp (Penaeus vannamei) (80% of global production)", 2023, citing FAO). But the explainer still says whiteleg shrimp are "nearly all the agreements' production", which no source says (finding 2).
7. (low) Stale headline fallback: **resolved**. The fallback is 1.7, against a live 1.686. A new mismatch is in the model summary (finding 3).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | missing-adjustment | `interest_yield`, `currency_losses_gbp`, `wait_discount` | The waiting dollar now grows by the bank interest on held cash (3.2%), but the same year's £64,373 currency loss on that cash is left out. That loss is close to the interest (£62,651). `currency_losses_gbp`'s own explainer calls it "a revaluation of the currency the charity holds (cash £2.65 million …)", so it is a return on the waiting money, just as the interest is. Counting one and dropping the other overstates the net yield, which is about −0.1% (62,651 − 64,373 over average cash of £1.96M). | Accounts p. 14 note 4 "Bank interest 62,651"; p. 15 note 5 "Foreign exchange (gains)/losses 64,373"; p. 10 cash 2,647,564 / 1,269,848 | Define `interest_yield = (interest_income_gbp - currency_losses_gbp) / avg(cash_start_gbp, cash_end_gbp)` and say so in its explainer. Or, if the cash is held in dollars so that the loss exists only in pounds, say that in `currency_losses_gbp`'s explainer, sourced, and keep the formula. | −3.1% (1.686 → about 1.63) |
| 2 | low | source | `shrimp_per_kg` explainer | "Pond-farmed whiteleg shrimp, nearly all the agreements' production" is still unsourced. The added source gives the global share (80% of farmed penaeids), not the agreements' share. | EU market observatory: "80% of global production" (2023); the Guesstimate agreement cells give tonnes and shares, not species | Replace "nearly all the agreements' production" with "about 80% of farmed penaeid shrimp worldwide (EU market observatory, citing FAO), and probably most of the agreements' production". Keep 60 (40–90). | none at the best guess |
| 3 | low | presentation | `summary`; write-up "How this model was checked" | The summary says "about 2 years of healthy life per $1,000". The result is 1.69, and the write-up's live figure says 1.7. The write-up also doesn't list round 3 yet. | audit-model: 1.686; write-up headline span 1.7 | Say "about 1.7 years" in the summary. Add "Round 3 (0 high, 0 medium, 3 low)" with its fixes to "How this model was checked". | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| total_expenses_gbp | Charity Commission register, accounts FY to 31 Mar 2025 (PDF via the register's accounts resource) | verified | SOFA p. 9: total expenditure 592,743 |
| program_expenses_gbp | same | verified | Note 5 p. 15: charitable activities 532,685; support 54,058; governance 6,000 |
| depreciation_gbp | same | verified | Note 5: 116,346; note 9: charge for the year 116,346 |
| currency_losses_gbp | same | verified | Note 5: "Foreign exchange (gains)/losses 64,373" |
| stunner_purchases_gbp | same | verified | Note 9: additions 388,162, cost at year end 630,121; cash flow: (388,162) |
| interest_income_gbp | same | verified | Note 4 p. 14: "Bank interest 62,651" |
| cash_start_gbp, cash_end_gbp | same | verified | Balance sheet p. 10: 2,647,564 (2025), 1,269,848 (2024) |
| staff_pay_gbp | same | verified | Note 5: 330,739 + 44,364; note 7: average employees 1 |
| funds_held_years (anchor) | same | verified | Income 2,242,275; trustees' report section 5: reserves target "6 months of core operating costs" |
| tonnes_per_stunner_dollar | api.getguesstimate.com/spaces/22982 (the charity's model, updated 2026-11-02) | verified | I recomputed it from the cells: Asia 02–09, Asia 12, LatAm 06 and LatAm 07 commit 28,468 t (for example 9,500 × 26%, 12,500 × 14.4%, 6,000 × 100%) for $674,350 (one at 73,200, nine at 55,000, one at 106,150), 0.0422 t per $ |
| shrimp_per_kg | fao.org … en_whitelegshrimp.htm | verified | "Cultured shrimp harvested from ponds (after 4–5 months at 15–25 g)"; extensive "small shrimp of 11–12 g" |
| shrimp_per_kg (species share) | fishery-aquaculture-market-observatory.ec.europa.eu … shrimp-penaeus | verified | 80% of global production, 2023, citing FAO. The agreements' share is unsourced (finding 2) |
| shrimp_per_kg, implementation_adj (anchors) | shrimpwelfareproject.org/shrimpact | verified | 37 agreements, 9 countries; 20 installed and commissioned, 54,175 MT (about 3.6 billion); 89,774 MT for all; "a projection based on signed commitments"; "progressively strengthening"; the FAQ says the figure covers HSI volumes only |
| counterfactual_adj | FAO whiteleg fact sheet | verified | USD 3.0–3.5/kg price (2005), USD 2.5–3.0/kg cost: about 6% of a year's margin on 1,900 t |
| implementation_adj (ALI anchor) | models/animal-welfare/aquatic-life-institute.json (in the sandbox) | verified | Retailer stunning-goal certainty 0.55 (0.35–0.75), Tesco 0.6 (0.4–0.8), Waitrose 0.5 (0.3–0.7). That is ACE's model of another charity, not of SWP |
| counterfactual_adj (PT Brother), programme page | perishablenews.com; shrimpwelfareproject.org/humane-slaughter-initiative | not re-fetched | Verified in round 2; unchanged |
| usd_per_gbp, SADs, welfare range, staff pay gap | shared facts | shared | The site's; source links not opened |

Blind-list note: I opened no evaluator analysis of SWP and ran no web search, so no evaluator figures came up in snippets. The Guesstimate model and (Shr)Impact page are the charity's own. Its "1,400 shrimps per dollar a year" is the charity's own figure. The ALI anchor is an ACE model of a different charity, already in the sandbox.

## Drivers
1. `@welfare_ranges.shrimp_vs_chicken` (shared estimate): 0.027 – 62.5. The site's.
2. `$chicken_vs_person` (shared judgment): 0.010 – 4.41. The site's.
3. `@sad_factors.sads_per_shrimp_stunned` (shared estimate, best at the bottom of its range): 1.69 – 38.8. The site's.
4. `$daly_per_sad` and `$win_years_counted` (shared judgments): 0.41 – 4.14 and 0.36 – 2.55.
5. The model's own: `implementation_adj` (judgment, 0.84 – 2.39, anchored on the installed share and the ALI retailer figures), `shrimp_per_kg` (FAO-sourced, 1.12 – 2.53), and `counterfactual_adj` and `attribution_share_shared` (judgments, 1.12 – 2.14 each, anchored).

What would most improve the model: the charity's verified-use data (tonnes stunned per installed stunner, from its post-harvest forms) in place of the `implementation_adj` judgment.

Plausibility: the model implies about 1,560 shrimp committed a year per dollar of `cost_total`, close to the charity's own 1,400 (970–1,900). The result is 0.19× the cause median and about 2× the nearest peer, Aquatic Life Institute (0.85). The gap with the median comes from the shared shrimp figures (a SADs best guess at the bottom of its range, a small welfare range), not from scope or counting. The model's own range (0.080 – 11.1) reflects real uncertainty, not a reflexive ±20%.

Counts: high 0, medium 0, low 3.
