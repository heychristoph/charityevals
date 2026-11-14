# Audit round 3 (scoped verification): SecureBio

Checked only the round-2 low and the changes made for it (next-dollar fact, summary, write-up).

| Round-2 finding | Status |
|---|---|
| Low: next-dollar range 0.2 to 0.8 not the product of the factor ranges | Settled: 0.4 x 0.5 x 0.85 = 0.17 and 0.9 x 0.9 x 1.05 = 0.8505, so 0.17 to 0.85 with best 0.7 x 0.7 x 1.0 = 0.49; the fact's note and explainer state the same factors and products |

Figures against `scripts/audit-model.ts`: combined range 0.3976 to 96.17 (summary "0.4 to 96", write-up "about 0.4 to about 96"); `@next_dollar.securebio` tornado line 0.17 to 0.85 giving 2.145 to 10.73 (write-up "17% to 85% ... 2.1 to 10.7"); headline 6.183 (summary and write-up placeholder 6.2). The new sentence in "How this model was checked" matches this round. `check.ts securebio-charityevals` passes ("all models valid"); audit-model shows only the same low point-estimate warnings as before.

New findings: none.

Model-sha: c922109fff0f91885b2009f9d2f3e5ad49abf6542aa0132de5c829215d8d4253

**Verdict: pass**
