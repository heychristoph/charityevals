# Audit: representus-education-fund-charityevals, round 2
Result: 2.563e-5 daly/$ = 0.02563 years of healthy life per 1,000 dollars (combined range 0.00174–0.378); cause median 0.0652 (×0.39). Verdict: pass.
Model-sha: 4cfb028b26e7646358ba6d869f61522b995e11cc2f0a3164921085a8be5839a3
Rules: 0.3.7
Scope: scoped verification of commit 8fb7156 only (the answers to round 1's findings 1 to 6): the three volunteer rows and the three reform denominators of the model, the volunteers rule in two movement facts, the next-dollar note, the write-up's "What isn't modelled", the charity record, and the peer change in protect-democracy-charityevals (audited in its own r10). Nothing else re-audited.
Mechanical: audit-model lint 0 findings; simulation-check and normalization-audit not re-run (scoped; no checked row kind changed). Working tree clean. Result moved from 0.02645 to 0.02563 (-3.1%), no move above 2x.
Previous round (r1):
1. Volunteers' unpaid time left out (medium): **resolved.** volunteer_contacts 6,700,000 (observed, 2024 Impact Report p. 7, quote "6.7 MILLION TEXTS AND CALLS MADE BY DEDICATED VOLUNTEERS" verified in the extract), volunteer_hours_per_contact 0.01 h (0.003 to 0.03, judgment), volunteer_value = 6.7M × 0.01 × $34.79 = $2,330,930 (recomputed; @united_states.volunteer_hour_value_2024 = 34.79). The three reform shares are 0.45 + 0.12 + 0.43 = 1 (rcv_reform_share, maps_reform_share, 1 - both), so the split sums to the whole ($1.049M, $0.280M, $1.002M); none goes to the slide branch, as the explainer says (the contacts were for ballot measures). Recomputed shares: ranked-choice 0.1470 -> 0.1394 ("about 14%"), redistricting 0.0339 -> 0.0334 ("about 3%"), other reforms 0.1214 -> 0.1161 ("about 12%"): all three explainers, the model summary ("14% share") and the write-up ("14%", "3%") match; no stale "15%" remains in the model, record or write-up. The effect (-3.1%) is what finding 1 predicted (about -3%). The rule is also written into the two movement facts (us_rcv_movement_resources_per_year, redistricting_movement_resources: "It counts money: a model of a member whose volunteers' unpaid time is reported adds that time, at @united_states.volunteer_hour_value_2024, to this denominator"). The 0.01 h judgment's arithmetic holds: (6 texts × 5 s + 1 call × 180 s) / 7 = 30 s = 0.0083 h; the cited anchors are real (2 million texts in Arizona, 2024 Impact Report case study; "more than 600,000 text messages" and "more than 100,000 phone calls", 2025 Year in Review p. 7).
2. Going-concern note missing from the next-dollar note (low): **resolved.** The note now cites note 14 (p. 20: "The ability of the Fund to continue as a going concern is dependent upon the success of management's plan to raise unrestricted funding during the coming fiscal year, as well as its effort to decrease budgeting expenditures"; net deficit $2,514,564) in the room and run factors and says part of a next dollar may pay down the debt to Represent.Us. Value unchanged: 0.9 × 0.6 × 0.9 = 0.486 (49%), low 0.7 × 0.4 × 0.8 = 22%, high 1 × 0.85 × 1.05 = 89%.
3. Los Angeles city commission (low): **not implemented; reasoning judged adequate, one wording low (finding 1 below).**
4. Protect Democracy's severity placement (low): **resolved**, see protect-democracy-charityevals audit-r10.
5. "$0.8 million beyond the grant" (low): **resolved.** "$0.3 million in 2024 beyond the $0.5 million grant": Represent.Us total expenses 838,796 (its 2024 FS, verified) less the grant 513,793 = 325,003.
6. "incorporated in 2008 as Change Congress" (low): **resolved.** The record now says "its Education Fund incorporated in 2008 as the Change Congress Forum" (Fund FS note 1: "incorporated in 2008 as the Change Congress Forum"; Represent.Us FS note 1: "as Change Congress").

On the write-up's reason for leaving Los Angeles out: it is sound in what matters. The shared redistricting wins (79 million people under state commissions) and the shared $22 million denominator both count state work only, and the same holds for the Common Cause and League of Women Voters models, so a local commission counts in no model; the Fund's small LA spend (about 125,000 texts and calls, communications support, 2024 Impact Report p. 11) is credited at the state movement's rate, an overcount of the order +1 to +2% that round 1 already sized, and the write-up now names it. Adding local commissions would need the local campaign money in the denominator too, so the shared facts would have to be rebuilt for every model at once; that is a separate piece of work, not a defect here.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up "What isn't modelled" | The write-up says Los Angeles's measure "was put on the ballot by the city council, not by a petition campaign the movement's money paid for". The cited page says only that "Angelenos demanded action and spurred the city to put an independent redistricting commission proposal in front of voters" (it names the 2022 council scandal, not the council as the referrer). The council referral is outside the cited source, and the reason is not what carries the argument (the argument is that no shared figure counts local commissions or local money). | 2024 Impact Report p. 11 (extract lines 257-279); write-up "What isn't modelled". | Replace the clause with "Los Angeles's measure was a city proposal, and the shared figures count neither city commissions nor the money behind them, so the Fund's spending on it is credited at the state movement's rate." | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| volunteer_contacts | https://represent.us/wp-content/uploads/2024/12/2024-impact-report-6.9.pdf | verified | p. 7: "6.7 MILLION TEXTS AND CALLS MADE BY DEDICATED VOLUNTEERS"; both arms together (the report is RepresentUs's). |
| volunteer_hours_per_contact (explainer anchors) | same, Arizona case study; https://represent.us/wp-content/uploads/2025/12/2025-year-in-review3.3.pdf p. 7 | verified | "2 MILLION TEXTS SENT"; "more than 100,000 phone calls and sent more than 600,000 text messages". |
| @united_states.volunteer_hour_value_2024 | facts/united_states.json | verified (shared) | 34.79, Independent Sector / UMD. |
| @next_dollar.representus_education_fund (note 14) | https://represent.us/wp-content/uploads/2026/01/RUEF-24-FS-Final-1-2.pdf | verified | p. 20, note 14 quote above. |
| Los Angeles (write-up) | 2024 Impact Report p. 11 | verified, one clause beyond source | 75% for Measure DD; 75,000 texts and 50,000 calls by volunteers; "put ... in front of voters" by "the city" (finding 1). |
| write-up spending line, record | https://represent.us/wp-content/uploads/2026/01/Represent.Us-24-FS-Final-3.pdf | verified | Total expenses 838,796 (2024). Fund FS note 1 for the Change Congress Forum. |
| facts/democracy.json rcv and redistricting movement explainers | facts/democracy.json | verified | volunteers rule present in both; values 19,000,000 and 22,000,000 unchanged. |

Formulas checked: rcv_attribution_share, maps_attribution_share and oth_attribution_share (the three denominators and the branch shares they read); volunteer_value; every stated percentage against the recomputed value. Everything else unchanged since round 1.

## Drivers
Unchanged from round 1 (win_years_counted, missing_data_discount, democratization_gdp_gain, own next-dollar figure, uov_per_daly). The new volunteer hours-per-contact judgment moves the result by at most -1% to -9% over its range, as round 1 said, so it is not a driver.

Verdict: pass (0 high, 0 medium, 1 low).

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 5 rows changed, against cc9a04dd.
