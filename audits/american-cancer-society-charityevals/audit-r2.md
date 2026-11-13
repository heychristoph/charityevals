# Audit: american-cancer-society-charityevals, round 2 (verification of round 1's fixes)

Model-sha: 6be6201439ee13acd9bb14cb58a22438c89b2362f5451a27fe358a844287ba36

Result: 3.327e-6 daly/$ = 0.00333 years of healthy life per $1,000 (combined range 3.1e-4 to 0.035); global-health median 0.338 (x0.0098). The write-up's headline 0.0033 matches. Mechanical: `audit-model.ts` 0 high / 0 medium / 4 low (two context rows flagged unused, far-below and spread, all explained or acknowledged in the summary), no invariant violated. Only the diff since round 1 was checked.

## Round 1 findings

| # | R1 | Status | Check |
|---|---|---|---|
| 1 | medium, `adv_noncancer_ratio` | settled | Best 0.9 (0.5 to 1.3) now matches the worked numbers (tobacco about half of the cancer burden averted, times two); the explainer says so. Result 0.0027 to 0.0033, as the write-up states. |
| 2 | medium, `research_attribution_share_shared` | settled, one low left (A) | IQVIA page fetched: "Cancer medicine spending at list prices rose to $252Bn globally in 2024". It is in `resources`. $252bn at a fifth to a quarter gives $50-65bn, plus $10-15bn non-commercial, gives $60-80bn; $193m / $77bn = 0.25%. Consistent. |
| 3 | low, `screen_screenable_share` | settled | High end 0.41 and GHE 2023 wording match the 41% I computed in round 1. Best 0.30 kept. |
| 4 | low, years double-counted | settled | `adv_years_until_health` is relabelled as counted from the policy taking effect; best 10 (3 to 25) is unchanged and is now discounted once on top of `adv_years_until_effect`. |
| 5 | low, `ref_value_per_qaly_gbp` | settled | Quote replaced by a page pointer. Europe PMC full text fetched: "using a base-case value of a QALY of GB£25,000" and NICE's threshold range at an average of GBP 25,000. The pointer is accurate. |
| 6 | low, smoking credit | settled | The research explainer now credits smoking's fall to policy only; it agrees with `research_dalys_per_gbp_credited`. |
| 7 | low, advocacy example | settled | Cancer.org our-impact page fetched: "$2 per pack" tax rise, projected 14.3% fall in youth smoking, and "25.6 million lives impacted" through ACS CAN. Both are cited. The 0.05% tobacco part is not re-derived from them; it stays a ranged judgment with a named anchor, which is acceptable. |

## New findings

| # | Severity | Category | Row | Finding | Fix | Effect |
|---|---|---|---|---|---|---|
| A | low | plausibility | `research_attribution_share_shared` | The range's low end (0.12%) is explained as "$80bn of R&D and more non-commercial funding". That total is about $95-100bn, which gives 0.2%; 0.12% needs about $160bn. The round-1 low (0.1%) had the same gap. The "a fifth to a quarter of sales" R&D intensity is stated without a source. | Say what a $160bn total means (e.g. R&D near the full $252bn of sales' upper intensity plus more public funding) or raise the low to 0.002 (a $95bn total). Add a source for the R&D share if one is at hand. | Low end only; in the tornado this input is not in the top 12. |
| B | low | consistency | `ref_dalys_per_gbp_credited` explainer | The gap is "about a twelfth" now. Not checked against the printed value, since the row is reading-only. | None needed beyond confirming the figure on the next edit. | none |

No change introduces a high or medium problem. Write-up checked against the model: headline 0.0033, advocacy about 65% and research about 28% of the result (beneficiaries 0.28 world), screening 8%, ratio 0.9 ("about as much again"), $50-65bn industry spend and 0.25% all agree with the rows. The write-up's audit history describes the changes accurately.

Findings by severity: high 0, medium 0, low 2.

Verdict: pass (high 0, medium 0, low 2)
