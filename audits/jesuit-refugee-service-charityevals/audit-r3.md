# Audit: jesuit-refugee-service-charityevals, round 3 (scoped verification)
Result: 3.696e-4 daly/$ = 0.370 years of healthy life per 1,000 dollars (combined range 0.028–4.9), unchanged from round 2. Verdict: **PASS** (no findings).
Model-sha: 4013cfeefede5810935a76d4584a2be6a982df940b133f1fc8a37e7fc6469799
Scope: the text change since round 2 only (the two page citations); nothing else re-verified.
Mechanical: `audit-model` lint 0 high / 0 medium / 1 low (spread 2,739× on the model's own ranges; the summary says so), result identical to round 2. A field-by-field comparison of the JSON against `HEAD~1` shows exactly two differences, both explainer text: `edu_spend` (row 0) and `edu_access_share` (row 47). The `beneficiaries` block was only re-indented; its values are identical.

| # | Check | Result |
|---|---|---|
| 1 | `edu_spend` explainer: "Annual Report 2024 printed p. 14, PDF p. 8" | Matches the text extraction of the 2024 report (`ar2024.txt`, line 505). The passage on UNHCR's lead partner role sits on the page printed 14, PDF page 8. |
| 2 | `edu_access_share` explainer quote 'delivering a wide range of services in 19 refugee camps' | Verbatim in `ar2024.txt` (the line break after "wide" is the only difference): "JRS serves as UNHCR's lead partner for education response, delivering a wide range of services in 19 refugee camps." Citation "printed p. 14 (PDF p. 8)" is the same page. |
| 3 | Numbers | No input, formula or range changed; 0.370 and 0.028–4.9 as in round 2. |

No findings. Drivers unchanged from round 2.
