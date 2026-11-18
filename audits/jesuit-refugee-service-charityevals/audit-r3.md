# Audit: jesuit-refugee-service-charityevals, round 3 (scoped verification)
Result: 3.696e-4 daly/$ = 0.370 years of healthy life per 1,000 dollars (combined range 0.028–4.9), unchanged from round 2. Verdict: **PASS** (no findings).
Model-sha: 170377e0b1089291d2aba81700faede4dd91cc96126f71b00b1578d2cac0ce33
Rules: 0.3.12
Scope: the text change since round 2 only (the two page citations); nothing else re-verified.
Mechanical: `audit-model` lint 0 high / 0 medium / 1 low (spread 2,739× on the model's own ranges; the summary says so), result identical to round 2. A field-by-field comparison of the JSON against `HEAD~1` shows exactly two differences, both explainer text: `edu_spend` (row 0) and `edu_access_share` (row 47). The `beneficiaries` block was only re-indented; its values are identical.

| # | Check | Result |
|---|---|---|
| 1 | `edu_spend` explainer: "Annual Report 2024 printed p. 14, PDF p. 8" | Matches the text extraction of the 2024 report (`ar2024.txt`, line 505). The passage on UNHCR's lead partner role sits on the page printed 14, PDF page 8. |
| 2 | `edu_access_share` explainer quote 'delivering a wide range of services in 19 refugee camps' | Verbatim in `ar2024.txt` (the line break after "wide" is the only difference): "JRS serves as UNHCR's lead partner for education response, delivering a wide range of services in 19 refugee camps." Citation "printed p. 14 (PDF p. 8)" is the same page. |
| 3 | Numbers | No input, formula or range changed; 0.370 and 0.028–4.9 as in round 2. |

No findings. Drivers unchanged from round 2.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): shared LMIC learning-to-earnings and iodine facts (consistency, mechanical)

Re-stamped (16 Nov 2026): Typed refugee-relief figures now read shared facts (@humanitarian_response.*, @ukraine.war_affected_aid_recipients_consumption_share) at the same values; judgment explainers anchored on studies and published data (pre-audit gate cleanup). Mechanical: headline unchanged, against 4a6180e3.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2b148c62.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against d150f0b2.
