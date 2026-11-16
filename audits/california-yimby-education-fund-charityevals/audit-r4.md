# Audit: california-yimby-education-fund-charityevals, round 4
Result: 1.308e-4 daly/$ = 0.131 years of healthy life per 1,000 dollars. Verdict: pass.
Model-sha: 61a8ed422e23e1cf8056b4d36559ed38715af4d314808a6340c1de318d260aad
Scope: scoped verification of the round-3 fixes only (coalition resources built from parts, ADU permits series, ADU survey cost inflation, write-up and summary numbers).
Mechanical: audit-model lint 0 high / 0 medium / 1 low (spread, the summary says it); check.ts passes ("all models valid"). normalization-audit, summaries and simulation-check not re-run (only observed/judgment rows and formulas on shared CPI changed).

Round 3 points:
1. `adu_others_resources` / `oth_others_resources` built from parts: resolved. Both are formulas over an observed 990 total, a judgment share (YIMBY Action 0.4, 0.2-0.6) and judged lobby/public totals with ranges, each explainer says Cal-Access gives lobbying only in total and refuses automated fetches. CPI ratios check: 1,208,706 x 143.857/134.211 = 1.296M, so the ADU total is 33.3M; 6,870,121 x 0.4 x 143.857/124.266 = 3.18M, so the other total is 153.2M.
2. `adu_permits_2024`: resolved. data.ca.gov datastore_search_sql (resource fe505d9b-..., UNIT_CAT='ADU', SUM(NO_BUILDING_PERMITS) by YEAR) returns 9,008 / 15,086 / 16,041 / 24,640 / 31,805 / 35,720 / 39,077 / 41,977 for 2018-2025, matching the quote; 2024 = 39,077. Completions in the quote not re-queried.
3. `adu_gap_share` explainer: resolved. 150,000 x 143.857/117.244 = 184,043 (about $184,000); consumer prices up 22.7% (about 23%).

Source checks:
- ProPublica Casita Coalition (843860605): the organisation page shows 128,114 (2021) and 220,041 (2022); the API shows 324,916 (2023). 2024 = 535,635 confirmed in the 990 e-file (IRS TEOS, scripts/irs-990.py: total expenses 535,635). Sum 1,208,706 correct. 2019-2020 nil as stated.
- ProPublica Yimby Action (815140915): API gives 2017-2023 = 455,214 / 611,893 / 193,866 / 542,631 / 821,235 / 1,094,902 / 1,399,677; 2024 = 1,750,703 from its 990 e-file. Sum 6,870,121 correct.

Findings:
- [LOW] Write-up, "Each law counts..." paragraph: says the other laws' resources are "about $152 million"; the model gives 153.2M (3.18M from YIMBY Action plus 150M). Fix: write "about $153 million".
- [LOW] spread (mechanical): model's own ranges span 7361x; the summary already says so. No action.

Write-up and summary: headline 0.13 matches 0.1308; about 11,000 extra ADUs a year, 39,077 permits (30,354 handbook noted), the coalition totals ($1.2M Casita, $12M, $20M, about $33M) and "How this model was checked" (four rounds, 0.10 to 0.13) are consistent with the model. Summary's 0.13, 11,000 and 42% match.

Re-stamped (15 Nov 2026): one consumption scale for US public money (normalization.md 2.14); 0.131 → 0.131.
Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): damage beyond deaths at EPA's 0.6 in the tco2e bridge copy, read through the side-effects weight (2.5, 2.16; mechanical); summary figure updated where it changed

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1a9667aa.
