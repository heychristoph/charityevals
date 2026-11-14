# Audit: ploughshares-fund-charityevals, round 3 (verification)
Result: 0.02598 daly/$ = 26.0 years of healthy life per 1,000 dollars (combined range 1.22–555; model's own ranges 2.17–102), unchanged from round 2. Verdict: pass.
Model-sha: 9380d2f36217aa669ba5e1fc612aaa837664f26ddbe83e9a4aa1774ead976cde
Scope: verification only of the changes since round 2 (`git diff 76ae567~1 76ae567 -- models facts writeups`): the MacArthur wording (gr_cf_other_funders explainer, NTI's next-dollar note), the Ploughshares next-dollar note's reserve sentence, the funder-influence wording in unmodelled_benefits_adj, the write-up table row and the write-up's "How this model was checked" paragraph. The model's structure and numbers are unchanged, so nothing else was re-audited.
Mechanical: audit-model lint 0/0/7 (the same seven structural zeros, accepted in round 2); check.ts all models valid; result identical to round 2 (25.98).
Previous round (round 2 findings):
1. Rename gr_cf_other_funders / weighted-average leverage_funging_adj: **not applied, accepted**. The batch brief fixes leverage_funging_adj at 1 for catastrophic-risk models, and the round-2 finding itself found no effect on the result: the grantees' other funders are asked about once (gr_cf_other_funders), the explainer says why leverage_funging_adj stays 1, and the write-up table shows the question in its own row. Filing it inside gr_counterfactual_adj is a labelling choice, not a double count or an omission.
2. MacArthur: **resolved**. Both places now say it announced in 2021 that it would leave nuclear grantmaking, its last grants running to 2023, with the macfound.org press release URL. This agrees with the round-2 evidence (announced February 2021, grants to 2023). The 2022 in NTI's note is gone. (The press release was not re-fetched; its URL and the dates are as verified in round 2.)
3. "Mostly unrestricted": **resolved**. The Ploughshares note now says 93% of its reserve is donor-restricted. Form 990 Part X: with donor restrictions 20,123,060, without 1,494,912, total 21,617,972; 20,123,060 ÷ 21,617,972 = 93.1%. The note no longer says anything about NTI's restrictions.
4. Funder-influence wording: **resolved**. "Appearances at the Global Philanthropy Forum and the Skoll World Forum in spring 2025, annual report p. 8": the report's page 8 lists "Dr. Belcher's appearances and participations in 2025" with Global Philanthropy Forum, San Francisco, 3/14/2025 and Skoll World Forum, Oxford, 4/3/2025. "Advice to donors" is gone; the 3% (0 to 10%) is kept.
5. Table row: **resolved**. The first row now reads "Share of the spending counted" (0.86, 0.75, 1).

New text, "How this model was checked": it says round 1 passed with two medium findings, both fixed (the grants' running cost counted again as own work; the missing question whether the grantees' other funders would have paid), that fixing them moved the result from 32 to 26, and that round 2 passed with small source and wording fixes checked by a verification round. This matches audit-r1.md (31.6, two medium findings) and audit-r2.md (26.0, five low findings, source and wording fixes).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Sources checked
| Row | Source | Status | Note |
|---|---|---|---|
| @next_dollar.ploughshares_fund (93%) | Form 990 Part X (dump fy2025.txt) | verified | 20,123,060 of 21,617,972 = 93.1% |
| unmodelled_benefits_adj | annual report p. 8 | verified | 3/14/2025 and 4/3/2025, listed as appearances |
| gr_cf_other_funders, NTI note (MacArthur) | macfound.org press release | consistent with round 2 | not re-fetched |

**Verdict: pass** (no findings)
Model-sha: 9380d2f36217aa669ba5e1fc612aaa837664f26ddbe83e9a4aa1774ead976cde
