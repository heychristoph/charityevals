# Audit: save-the-children-charityevals-advocacy, round 1
Result: 9.801e-4 uov/$ = 0.49 years of healthy life per 1,000 dollars (combined range 0.071–3.39; simulation 5%–95%: 0.18–4.15, stable); cause median 0.338 (×1.45). Verdict: pass.
Scope: advocacy and awareness £13.473m (note 7(a) p. 82) plus Elrha's restricted expenditure £11.161m (note 22 p. 96) = £24.634m. With the sister model's £208.986m programmes line the two sum to the full £233.620m of charitable activities (checked: 80,304 + 49,552 + 39,670 + 19,535 + 17,498 + 13,588 + 13,473 = 233,620). No gap, no overlap; charities/save-the-children.json `lines` match. Year 2025, audited.
Mechanical: lint 0 high / 0 medium / 1 low (spread), invariants none, normalization-audit none for this model, check.ts valid, simulation stable.
Previous round: none.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | normalization | elrha_value_per_dollar, adv_aid_vs_cash | The better-spent humanitarian dollar is valued at 1× cash (0.00335 uov/$), but the sister model values humanitarian relief at about 0.29 years/$1,000, roughly 0.17× cash (a cash dollar is 1.67 years/$1,000 here). Two values for a humanitarian dollar on one site. | vals: elrha_value_per_dollar 0.00335; sister summary humanitarian-relief 0.29 | Read the humanitarian-relief value per dollar from the sister model's emergencies branch (or a shared fact both read) instead of a typed multiple of cash. Keep `adv_aid_vs_cash` for the displaced-aid side only. | Elrha is 19% of the result; at the sister's value Elrha falls by up to ~80%, headline about -15% (0.49 to about 0.42). |
| 2 | medium | sensitivity | gavi_counterfactual_adj (1–8%, best 3%) | Third-largest driver; the Gavi branch is ~61% of the result, but the 3% is a bare judgment with no reference class. | tornado 0.29–0.99; explainer "No study measures it" | Anchor it in the explainer: e.g. donors' 2025 pledges to Gavi against their 2020 pledges, and the share of the gap to the $12bn target the campaign could plausibly have moved; or cite a published estimate of advocacy's effect on replenishments. | Anchor could move 0.29–0.99. |
| 3 | medium | sensitivity | adv_other_wins_ratio (0–1, best 0.3) | The extra 30% for "other campaigns" adds ~23% to the three-win result with no reference class. | tornado 0.40–0.70 | Anchor to a count: the share of the 2025 report's named campaigns that moved money (Gavi, N4G, two-child limit are 3 of about 9), or the average win credited per named campaign; cite AR 2025 pp. 23, 39. | -19% at 0, +44% at 1 |
| 4 | medium | sensitivity | adv_average_spend_vs_year (0.9–1.3, best 1.05) | "Earlier years' accounts weren't read." The 2022–2024 accounts are published; this ratio scales every win. Only 2024 (£15.1m) is anchored. | row explainer | Read the advocacy line from the 2022–2024 annual reports, deflate with `@cpi`, and set the ratio to mean real spending over each campaign's years over 2025's (Gavi 2024–25, N4G 2024–25, two-child limit 2022–25). | about ±10% on the wins |
| 5 | low | normalization | tcl_couple_share | Typed as a judgment 46% (40–55%), but Save the Children's page, checked, states it: 54% single households, 46% couple households. | press release fetched | Make it `observed` 0.46 with source, quote and the DWP April 2025 date; drop the range. | under 1% |
| 6 | low | normalization | staff_cost_share | Explainer says "the accounts don't split staff by line". Note 7(a) does: advocacy staff costs £6,870k of £13,473k (51%). The group's 20% understates forgone pay in the credit-by-resources view. | AR p. 82 | Use the advocacy line's 6,870/13,473 for the advocacy part (Elrha: 54 staff, p. 41, as a judgment), weighted by spend. | donor_cost_share about 0.98 to about 0.96, only with resource shares on |
| 7 | low | presentation | tcl_taxpayer_value_per_year, tcl_cost_gbp explainers | "About half the families' gain": computed loss $111k of $330k gain a year, about one third. "First year matches the April 2025 household count" is unsupported (2026-27 families will outnumber the April 2025 count; total gain still equals the Budget cost). Payers' loss at the UK average consumption slightly overstates it (payers are richer). | vals | Reword to "about a third"; drop the matching claim or use a DWP projected April 2026 count if sourced. | TCL branch is 7% of the result; under 2% |
| 8 | low | presentation | Elrha allocation | The accounts don't say which thematic line holds Elrha; note 22 lists only its restricted fund. cost_total applies the group overhead ratio 1.18 (fundraising and shops) to Elrha, which is grant-funded. | AR p. 96 | State in the explainer that the line allocation is an assumption; optionally apply only management and support costs to Elrha. | under 3% |
| 9 | info | double-counting | Gavi and N4G branches vs the sister model | Sister credits SCUK's Gavi-funded delivery; this model credits pledges at 0.2% (Gavi) and 0.04% (N4G) after adjustments. Different dollars, no double count. Accounts split verified above, so Elrha is not counted twice either. | sister rows | None. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| adv_spend_gbp | AR 2025 PDF p. 82 (PDF 83) | verified | 13,473 advocacy and awareness (2024: 15,102); column values match |
| total expenditure, charitable activities, staff costs (facts) | AR pp. 82, 84 | verified | 275,822; 233,620; staff 55,693 |
| elrha_expenditure_gbp_2025 | AR p. 96 (PDF 97) | verified | "Elrha 721 11,047 (11,161) 2 609" |
| gavi_pledged_usd | AR p. 16 (PDF 17) | verified | "more than US$9 billion (£7.8 billion) was committed to Gavi's next strategy cycle – 2026–2030"; 200+ civil society organisations |
| n4g_committed_usd | AR p. 16 | verified | "key role in persuading ... more than US$27 billion" |
| tcl_cost_gbp | gov.uk Budget 2025 Table 5.1 row 6 | verified | "Spend +0m -2,365m -2,590m -2,815m -3,095m -3,235m", 2025-26 to 2030-31; "taking 450,000 children out of poverty" |
| tcl_households, tcl_children | Save the Children press release, April 2025 | verified | 1,665,540 children, 469,780 households (DWP's own table not re-read) |
| DWP impact paper (450,000 by 2029-30; explainer only) | dera.ioe.ac.uk PDF | not fetched | not a numeric input; Budget and AR p. 23 also say 450,000 |
| next_dollar save_the_children | AR pp. 13, 46-50 | verified | £262m income, £43m lower, £10m deficit, reserves within target, Refocus for Impact; 0.9 × 0.6 × 1.0 = 0.54 |
| cf_value_gavi, cash, UK consumption, fx | shared facts | shared; read, not re-checked | |

## Drivers
1. Missing-data slider (0.5, shared): halves everything; right for all four branches (no measured effect of any campaign).
2. uov_per_daly (shared slider).
3. Gavi counterfactual 3% and attribution 15% (judgments, no reference class; finding 2): Gavi is about 61% of the result.
4. The next dollar at 54% of the average (sourced estimate; arithmetic checks).
5. Elrha's spend influenced ($20m, $5m–$100m) and the value of a humanitarian dollar (finding 1).

Best improvement: reference classes for the Gavi and other-campaign judgments, and valuing Elrha's humanitarian dollar as the sister model does. Structure is sound: wins and costs of the same period in one year's prices, each branch's counterfactual, attribution and missing-data rows applied once, waits and years discounted, the two-child limit's taxpayer loss and the displaced aid as side-effect rows, money moved and careers 0 with reasons. Peers: ×1.45 the cause median, about 6.5× the MSF advocacy model (0.075); the gap comes from the size of the Gavi and N4G pledges ($36bn) at tiny credit, and the summary says the result is mostly uncertainty.

Verdict: pass (no high findings; four medium).
Model-sha: aedd7833406032e3101b44616d419c9351e8c3f0132be70c385be3abd6b12a15
