# Audit: american-red-cross-charityevals, round 2 (verification of the volunteer share and counterfactual explainer changes)
Result: 4.428e-6 daly/$ = 0.004428 years of healthy life per 1,000 dollars (combined range 0.001867–0.01050); cause median 0.2028 (×0.022, global-health median of 142 models). Verdict: pass.
Model-sha: 6fa07c51ba6159148d3b52a30b3c85fa7a68eebea253f23b9ef54d2f94d9e491
Scope: scoped to the changes since round 1 (commits 36d2fd53 and 1f524029 against 263d13da): volunteer_share_domestic (best 0.7 to 0.75, range 0.5-0.85 to 0.65-0.81), hf_counterfactual_adj (low 0.5 to 0.4, new explainer), ls_counterfactual_adj (explainer only). Programmes, year and the rest not re-audited.
Mechanical: lint 0 high / 1 medium / 0 low (far-below, 0.022x the global-health median; the summary already states the reason, as in round 1 where it was graded low), invariants none, check.ts all valid, simulation-check stable (5% 0.619, 50% 1, 95% 1.58 x best guess), normalization-audit not rerun (coordinator: none).
Previous round: r1 findings 1-3 were low and needed no fix: unchanged, not affected by these edits.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | normalization | volunteer_hours vs volunteer_share_domestic | The share's explainer now rests on the FY2025 Volunteer Services report (10.3 million hours), but volunteer_hours, which the share multiplies, still reads "over 9 million" from the Volunteer Connection page. The two rows describe the same quantity in different years/sources. | Report p. 5 area: "more than 325,000 volunteers who dedicated over 10.3 million hours". Scratch copy with volunteer_hours 10,300,000: 0.004428 to 0.004296. | Set volunteer_hours to 10300000 (kind observed), source the FY2025 Volunteer Services annual report, quote "Engaged more than 325,000 volunteers who dedicated over 10.3 million hours in service of the Red Cross mission", and update the explainer ("over 325,000 volunteers"). Re-run the audit stamp after. | -3.0% (0.004428 to 0.004296) |
| 2 | low | source | hf_counterfactual_adj (explainer) | The NFPA figures (99% of households have an alarm; 16% of those who think all theirs work have a faulty one; "Smoke Alarms in the U.S., 2024") carry no URL and could not be located: the NFPA page I could fetch gives other figures (2018-2022: 59% of home fire deaths with no alarm (43%) or a failed one (16%)). "Three in five ... 2012-2016" matches the 2019 report already cited in the model. | NFPA current page text; 99%/16% not found there. | Add the URL of the 2024 NFPA report, or replace the two numbers with the NFPA 2018-2022 key finding (59% of home fire deaths, 43% no alarm, 16% alarm failed) with its URL. | none (explainer only) |
| 3 | low | plausibility | volunteer_share_domestic | Range 0.65-0.81: high 0.81 is the exact remainder (1 - 13.6% - 5.8% = 80.6%), right. Best 0.75 and low 0.65 imply 5 and 15 points of training hours, unsupported by a number; reasonable for a judgment with a clear anchor. | 1.4/10.3 = 13.6%, 0.6/10.3 = 5.8%, remainder 80.6%, as the explainer says ("about 80%"). | None needed. | none |

## Checks of what was asked
- **Numbers vs sources**: 10.3 million hours, 1.4 million hours supporting blood donors, over 600,000 hours across corporate departments, over 1.6 million hours for military/veterans: all in the Volunteer Services FY25 report. NORC 2022: "6 percent of high-risk households reported zero alarms, compared to 1 percent of low-risk households": verified. Press release: "supports more than 60,000 emergency communications cases worldwide": verified (the model sentence says "for military families a year", the release says worldwide; fine).
- **Arithmetic**: 14% (13.6) + 6% (5.8) leaves 80% (80.6), as stated. 1.6 million armed-forces hours sit inside the remainder, not subtracted: correct. Restoring Family Links (about 13,000 hours) is inside it too.
- **Reasonableness**: share best 0.75 below the 0.806 ceiling, headroom for training; hf low 0.4 and the 40-90% range widen an unmeasured counterfactual honestly (NORC shows 8% of unvisited high-risk homes with zero alarms and 29% were visited by someone, so some fill by others). Headline move -1.4% matches the share change. Both fine.
- **Site rules**: none of the three explainers compares with other charities, models or medians, or mentions effective altruism.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| volunteer_share_domestic | https://www.redcross.org/content/dam/redcross/volunteer/pdfs/SS_RED_CROSS_VOLUNTEERSERVICES_2025ANNUALREPORT_Final.pdf | verified | 10.3M, 1.4M, 600,000+, 1.6M hours |
| hf_counterfactual_adj | https://www.norc.org/content/dam/norc-org/pdf2024/Red%20Cross%20Home%20Fire%20Risk%20Map%20Evaluation.pdf | verified | 6% vs 1% zero alarms |
| hf_counterfactual_adj | NFPA, Smoke Alarms in the U.S., 2024 (no URL) | unsupported | 99% and 16% not found; see finding 2 |
| ls_counterfactual_adj | https://www.redcross.org/about-us/news-and-events/press-release/2026/how-the-red-cross-helps-military-families-during-emergencies.html | verified | 60,000+ emergency communications cases a year |

## Drivers
Unchanged from round 1: uov_per_daly, inc_cf_large, uov_per_ln_consumption, unmodelled_benefits_adj, large_vs_poorest_fifth (all judgment or estimate). The three rows changed here are not among the top 12 of the tornado.

Verdict: pass
Model-sha: 6fa07c51ba6159148d3b52a30b3c85fa7a68eebea253f23b9ef54d2f94d9e491
