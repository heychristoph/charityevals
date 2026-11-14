# Audit: tax-justice-network-charityevals, round 3 (scoped verification of round 2's fixes)
Result: 0.002512 uov/$ = 1.256 years of healthy life per 1,000 dollars (model's own ranges 29,000× joint low to high); cause median 0.0652 (×19). Verdict: pass.
Scope: only round 2's seven findings and the rows, beneficiaries, summary and write-up lines they changed. Not re-audited: everything round 2 passed.
Mechanical: audit-model lint 1 low (spread, as round 2), 0 high or medium; check.ts all models valid.

Round 2 findings:
1. resolved: `own_gbp_2017` is 723,955 = 799,934 (2018 accounts p. 35 note 9, prior-year column, re-read in the extracted text) less 75,979 for ICRICT (-4,033 + 100,387 - 20,375, 2017 accounts' deferred-income note, re-added).
2. resolved: `own_gbp_2005`-`2011` re-derived from the extracted accounts: 54,905 (17,784 + 37,121); 52,219 (10,716 + 41,503); 93,759 (48,669 + 45,090); 119,319 (66,863 + 52,456); 208,133 (147,130 + 61,003); 228,163 (97,313 + 130,850); 520,427 (196,439 + 323,988). `own_gbp_2015` 747,215 = 361,670 + 370,903 + 14,642 (2016 accounts p. 26 prior-year column). `first_accounts_year` 2005, `early_years_real_gbp` 60,000 (20,000 to 150,000, judgment, 2003-2004 only), `early_years` = 2, and `average_spend_vs_year` includes 2005-2011 (formula checked term by term; 0.4476, summary and write-up say 45%).
3. resolved in substance, with a low residual (finding 1 below): `a_lic_share` 35% (20% to 55%) and `a_india_share` 35% (15% to 55%) now rest on Africa (EUR 0.4 billion) and Latin America (EUR 0.6 billion: 94 + 491 million) against the EUR 2.8 billion total, leaving about EUR 1.8 billion Asian and other; a 35% LIC share (about EUR 1 billion) is consistent with that split. Asia's own figures are not given, so the share stays a judgment with its range kept.
4. resolved in substance: `b_share_recovered` range 1% to 30%; the explainer anchors it on the OECD global minimum tax estimate (US$155-192 billion a year, about a third of US$480 billion), called an upper anchor for a reform of wider reach. The 5% was kept rather than re-derived, which is reasonable for an upper anchor (the first protocols are narrower); the figure has no URL (finding 2 below).
5. resolved: `a_tjn_movement_share` says GBP 0.2 to 0.75 million a year, matching the accounts (0.21 to 0.75).
6. resolved: both losses explainers say the release does not define the groups and give the reading used.
7. stays (low): the model's own ranges span 29,000×, as the summary says ("over ten-thousandfold").

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | a_lic_share | The Latin American figures (EUR 94 million + about EUR 491 million) are in the explainer with a name ("the Global Forum's 2025 Latin America report") but the source field carries only the African quote, and no URL for the Latin America release is given. | Row source and explainer. | Add the Latin America release's URL and quote to the explainer or a second source. | 0. |
| 2 | low | source | b_share_recovered | The OECD US$155-192 billion estimate has no title, URL or page. | Row has no source field; explainer only. | Add the OECD source (title, URL, page, quote) to the row. | 0. |

Beneficiaries recomputed from the engine's rows at the defaults (branch outcomes 2,905.6 and 2,818.8, 51% and 49% of 5,724.4; each branch's revenue by group from `a_revenue_lic` × shares, `value_*_revenue`, `b_losses_*`): low and lower-middle income other than India 78.0%, India 9.1%, upper-middle income 9.9%, high income 3.0%. The model's beneficiaries (12 countries at 0.065 = 0.78; IND 0.0911; BRA 0.035, MEX 0.035, COL 0.015, ZAF 0.0137 = 0.0987; GBR 0.0302) match and sum to 1.000; the note in the model and `scripts/beneficiary-countries.ts` agree (78%, 9%, 10%, 3%). The summary's figures (GBP 2.09 million, 45%, 1.3, 40% chance, 5%, India's a quarter of Africa's: 0.00122 / 0.00505 = 0.24, over ten-thousandfold) agree with the rows; the write-up's cost line (2005-2025, GBP 60,000 for 2003-2004, 45%), the 51% / 49% split, 35% / 35%, the upper-anchor clause and the round-2 sentence (1.3) are right.

Result check: 1.256 against round 2's 1.109 (+13%): the `a_lic_share` 30% to 35% rise and India 40% to 35% raise the value of revenue in low and lower-middle income countries (about +10%), and the extra years of spending lower the cost (about +2.5%); consistent with round 2's expectation. No row moves the result by more than 2× except as listed.

Verdict: pass (no high or medium; two low)
Model-sha: 90d2ca94592a850e518e2d970ab9a3485c1c454f633c6391939b2e4c5721469f
