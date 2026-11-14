# Audit: hias-charityevals, round 3 (scoped)
Result: 3.133e-6 daly/$ = 0.0031 years of healthy life per 1,000 dollars (combined range 0.00055-0.018); cause median 0.0954 (x0.033). Round 2 result 3.140e-6, so the changes moved it -0.2%.
Model-sha: f59e6692a53555d70e32e7d5a44ad1e4f31c3cc16149bece8adab772b65f46ba
Scope: only the round-2 findings N1-N5 and the rows changed in 04a7b33 (leg_stay_ln, leg_removed_if_lost, leg_wait_years, leg_remit_share, rst_pre_cut_share, rst_cf_post, leg_central_america_share, leg_cons_origin, leg_other_ls_gain, write-up side-effects line).
Mechanical: audit-model 0 high / 0 medium / 2 low (far-below and spread, both stated in the summary, unchanged); no files rewritten.

| R2 # | Status | Check |
|---|---|---|
| N1 | resolved | `leg_stay_ln` now uses `ln(leg_cons_stayed * (1 - leg_remit_share) / leg_cons_origin)`; the remittance term still sends the same share. Netting is correct (ln 0.94 = -0.062 per year before annuity and discount), explainer updated. |
| N2 | resolved with a low remainder (F1, F2) | Anchors and URLs added for `leg_removed_if_lost` (ICE 1,445,549 final orders, about 55% executable: verified at the Fox News URL), `leg_wait_years` (1,424 days, TRAC: verified at the Gigafact URL) and `leg_remit_share` (13 transfers a year: verified at the Inter-American Dialogue URL). |
| N3 | resolved | `rst_pre_cut_share` best 0.40 (range 0.30-0.60) with the 38% arithmetic (4/12 x 91.1M = 30.4M of 80.4M, matches Exhibit B); "courts later restored" dropped from `rst_cf_post`; `rst_leverage_funging_adj` keeps the one court clause. |
| N4 | resolved | `leg_central_america_share` 0.5 (0.30-0.75) judgment row; `leg_cons_origin` weights Honduras and Peru by it. Formula and units right (consumption, PPP dollars). |
| N5 | resolved with a low remainder (F3) | "work permits" dropped from the `leg_other_ls_gain` explainer; the write-up's adjustments line names legal clients' work permits and social services. |

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect |
|---|---|---|---|---|---|---|---|
| F1 | low | source | leg_wait_years | The Gigafact page gives 1,424 days as the average wait overall in fiscal 2024 (TRAC, 20 March 2024), not for "pending" cases, and does not give the 1,016 days for completed asylum cases in fiscal 2023. | Fetched page. | Say "average wait overall" and cite a source for the 1,016 days (TRAC) or drop it. | none |
| F2 | low | source / consistency | leg_removed_if_lost, leg_remit_share | (a) "about 270,000 removals a year (ICE annual report, fiscal 2024)" and "about $300 each time for the median Mexican sender (NPR, 10 February 2017)" have no URL; the Dialogue page does not state the amount. (b) 270,000 removals against about 795,000 executable orders (55% of 1,445,549) is a third a year, not "a fifth". | Explainer text; arithmetic. | Add the ICE annual report and NPR URLs, and say "perhaps a quarter to a third a year of the executable orders" (the 40% judgment and 15-70% range stand). | none at the default |
| F3 | low | presentation | writeup | The legal-services bullet still says "The other clients gain a little life satisfaction from family reunions and work permits", but the model's row now says reunions and green cards, with work permits as a side-effect row. | writeups/hias-charityevals.md line 23. | Replace "work permits" with "green cards". | none |

No other new inconsistency: the advocacy line's "more than 80 refugees" matches hias-charityevals-advocacy.json. No double counting between the netted remittances and the family term (the share leaves the client's consumption once and arrives at the family's once).

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| leg_removed_if_lost | foxnews.com/politics/new-data-reveals-america-has-tens-thousands-noncitizens-from-us-adversary-deportation-orders | verified | 1,445,549 final orders, about 55% executable, 24 Nov 2024 |
| leg_wait_years | gigafact.org/fact-briefs/is-the-waiting-period-for-an-immigration-asylum-hearing-six-to-eight-years | partly | 1,424 days overall; no 1,016 (F1) |
| leg_remit_share | thedialogue.org remittances 2017 press release | partly | 13 times a year verified; the $300 is from NPR, not fetched (F2) |

**PASS** (no high findings)
Model-sha: f59e6692a53555d70e32e7d5a44ad1e4f31c3cc16149bece8adab772b65f46ba
