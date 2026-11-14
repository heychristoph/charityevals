# Audit: jesuit-refugee-service-charityevals-advocacy, round 3 (scoped verification)
Result: 2.699e-5 uov/$ = 0.0135 years of healthy life per 1,000 dollars (combined range 0.00053–0.34), unchanged from round 2. Verdict: **PASS** (no findings).
Model-sha: fb082acf6aa9e70ffb58b0133d887adfdaabf6f527a1b9ad67a1dde44bb1dc1b
Scope: the summary wording change since round 2 only; nothing else re-verified.
Mechanical: `audit-model` lint 0 high / 0 medium / 1 low (spread 42,000× on the model's own ranges; the summary says so), result identical to round 2. A field-by-field comparison of the JSON against `HEAD~1` shows exactly one difference, the summary text. The `beneficiaries` block was only re-indented; its values are identical.

| # | Check | Result |
|---|---|---|
| 1 | Summary: "JRS's share (0.4%, judged from its southern regions' spending, 0.34% of the appeals' funding)" | Consistent with `attribution_share_shared` (0.4%, 0.15–1.5%) and its round 2 anchor ($55.7m against $16.6bn = 0.34%); the 0.4% is now stated as a judgment from that anchor, as its explainer says. |
| 2 | Summary figures | 0.013, range 0.0005–0.34 still match the computed 0.0135 and 0.00053–0.34. |

No findings. Drivers unchanged from round 2.
