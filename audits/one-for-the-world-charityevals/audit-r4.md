# Audit: one-for-the-world-charityevals, round 4 (scoped verification of the round-3 fixes)
Result: 0.02566 uov/$ = 12.83 years of healthy life per 1,000 dollars (combined range 2.43–67.7); cause median 0.06519 (x197). Verdict: pass.
Model-sha: ac362dc53d24dc91d5b0ed3323233524e931c8e6a643cf0ec53cc8a8ee7e183d
Scope: only the five round-3 fixes (new_pledge_size_adj, recurring_share explainer, corporate_pledge_moved, cohort_years_giving explainer, the summary and write-up driver lists) and the numbers in the summary, those explainers and the write-up. Everything else is as audited in rounds 2 and 3.
Mechanical: audit-model reports 0 findings and no invariant violations; result 12.83 years per $1,000 (the summary's "about 13"). Row values recomputed with the engine (script in the scratchpad): new_pledge_size_adj 0.95, yearly_gift_per_pledger $1,074, active_pledger_years 828.7, pledge_persistence_years 6.23, pledge_moved $323.5K, corporate_pledge_moved $151.3K (= 55,000 x recording_adj x 6.23 x 0.5 x 1.65 x 0.5), oneoff_moved $248.8K, money_moved $723.6K, moved_per_dollar 0.955, cost_total $758,075.
Previous round (round 3):
1. new_pledge_size_adj: resolved. Best 0.95 (0.8-1.3); the explainer's arithmetic uses the 58/42 book: (0.73 x 629 + 0.27 x 1,350) / (0.58 x 629 + 0.42 x 1,350) = 823.7 / 931.8 = 0.884, and 0.95 is stated as that plus "newer pledges are giving more" and pay rises. 44 of 166 graduate = 27%. Tornado: 11.92-14.94.
2. recurring_share explainer: resolved. The corporate one-offs are $82,922 (p. 18) and the $252,909 of Benevity payroll giving is named as part of the recurring 70%, taken out of the gift per university pledger.
3. corporate_pledge_moved: resolved. The formula carries x 0.5 x (1 + own_retention_adj) (0.825 at 0.65); the explainer says the "~100% retention" covers 2 to 17 months only and takes retention halfway between the curve and its university pledgers'. It no longer gives the nine-month average tenure (finding 3 below). The effect matches the predicted 183K to 151K.
4. cohort_years_giving explainer: resolved by the second option offered (keep the ages, say why). It states age 0 is a cohort's first year of giving and that the 2022-2023 pledges give their first year in 2023-2024 after the wait. Ages 0-2 and 3-8 in the formula and in recent_cohort_years / pledges_to_mid_2020 explainers are consistent with it.
5. Driver lists: partly resolved. The write-up's opening sentence now names the value of a young child's life; the model summary is unchanged (finding 1); the write-up's "What drives the result" list is not in tornado order (finding 2).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary (model JSON) | The summary still ends its drivers sentence "...its own count of what it caused, the value of a child's life and how long its pledgers keep giving". In the tornado `own_retention_adj` (11.02-15.56) is seventh, below the value of a child's life, `resource_shares` (12.83-7.18) and `side_effect_weight` (8.73-12.83), and is within the range of the corporate run rate (11.37-15.51). Round 3 finding 5 asked for the fifth driver to change; the model summary kept it. | `npx tsx scripts/audit-model.ts` tornado | Cut the fifth item (the corporate run rate, ninth, is no better) so the list is the four that lead the tornado after the discount rate: "The result moves most with the discount rate, its next-dollar figure, its own count of what it caused and the value of a child's life". Run `npx tsx scripts/summaries.ts` afterwards. | none |
| 2 | low | presentation | write-up, "What drives the result" | The list runs discount rate, next dollar, share caused, retention and corporate donors, then the value of a child's life. By the tornado the child's life (8.92-16.74) is fourth, ahead of retention (seventh) and the corporate run rate (ninth); `resource_shares` and `side_effect_weight` also outrank both and are not listed. The opening sentence of the write-up's Summary is right. | tornado | Move "The value of a young child's life" up to follow "The share it caused", and add "Whether credit is shared by resources (on: 12.8, off: 7.2)" and the 5% side-effect weight if the list is to match the tornado, or keep the last two items as a labelled "also" line. | none |
| 3 | low | missing-adjustment | corporate_pledge_moved (explainer) | The explainer says the retention covers 2 to 17 months but drops the post's average donor tenure of about 9 months, which is the number that shows how little the evidence says about decades. The 0.5 in the formula is the one judgment step here and is not a row of its own. | EA Forum, "Lessons and results from workplace giving talks" (March 2022): "~100% retention (over a timespan of 2-17 months; average donor tenure so far is ~9 months)" | Add "average tenure about nine months" to the explainer, and name the 0.5 as "halfway". No row change needed. | none |

## Checks
- **Numbers in the summary and write-up.** "About 13" (12.83); "about $720K" (723.6K); "each dollar it spends leads to about a dollar" (0.955); "about 830 pledgers giving" (828.7) at "about $1,070" ($1,074); "$758,000" (758,075); "$1.55 million" and gross ratio "about 2" (1.55M / 758K = 2.04); "166 new pledges ... 95% of the average gift"; "65% of the curve's (45% to 100%)"; "$55,000 (25,000 to 110,000)"; "about 415" (2,913 - 2,498). All match. The explainers' "about $720K" (money_moved), "about one dollar" (moved_per_dollar), "About 830 pledgers", "about $1,070" and "About 6.2" (6.23) hold. pledge_moved is $323.5K and corporate_pledge_moved $151.3K; no explainer or summary quotes them, so none is stale.
- **Direction of the changes.** 0.95 and the corporate halving both lower the result (13.70 to 12.83, -6%); the summary's "about 13" and the write-up's "13" follow.
- **Corporate retention factor.** (1 + own_retention_adj) / 2 moves with the slider: at 0.45 it is 0.725, at 1.0 it is 1.0, so the slider still moves every branch that uses retention.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| new_pledge_size_adj | FY20OFTWAnnualReport.pdf pp. 10, 12 (local copy FY20OFTWAnnualReport.txt) | verified | "Average pledge value from Undergraduates was $629/year, versus $1286/year for MBA students and $1528/year for Law students"; end-of-FY20 donors 160/285/19/25 = 489, dollars $282,871; "we're churning more low value pledges" |
| corporate_pledge_moved | https://forum.effectivealtruism.org/posts/QpAbe8Dqig3o5GPrx (local copy post_QpAbe8Dqig3o5GPrx.txt) | verified | "~100% retention (over a timespan of 2-17 months; average donor tenure so far is ~9 months)"; "Totals 47 $134,592 $2,800 $604,727" |
| recurring_share | Impact Report 2024 pp. 13, 18 | carried from round 3 | $335,831 from corporate workplaces; $82,922 corporate one-off |
| new_pledge_size_adj (27% graduate) | Impact Report 2024 p. 22 | carried from round 3 | 117 UG, 29 MBA, 13 Law, 2 Med, 5 referrals = 166 |
| cohort_years_giving | 2022-2023 Impact Report p. 3 | carried from round 3 | "closing out our ninth year of operation" |

## Drivers
1. Discount rate (31.1-8.0), judgment: unchanged.
2. Next-dollar share (6.5-21.4), estimate: unchanged and deferred.
3. Own effect (7.7-15.7), estimate: sourced to its own strict 44%.
4. Value of a child's life (8.9-16.7), judgment, shared: unchanged.
5. Credit by resource shares (12.8-7.2) and own retention (11.0-15.6): the best next improvement is the corporate run rate (11.4-15.5, 24% of money moved on one 2022 anchor): a count of its 2023-24 talks and their recurring giving from the charity.

**Verdict: pass** (0 high, 0 medium, 3 low)

Re-stamped (orchestrator, 14 Nov 2026): this round's summary low fixed (pledgers' retention, 7th in sensitivity, dropped from the drivers named); no value changed.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): Preflight cleanup: a typed figure now read from its shared fact at the same value (@depression.suicide_rr_with_depression, @meta.fundraiser_side_effects_share, @irap.years_gain_lasts); labels and explainers reworded. Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against a8d130f3.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.
