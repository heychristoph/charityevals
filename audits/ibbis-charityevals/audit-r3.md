# Audit: ibbis-charityevals, round 3
Result: 0.008344 daly/$ = 8.34 years of healthy life per 1,000 dollars (combined range 0.43–160); cause median 1.50 (×5.6). Verdict: pass.
Model-sha: 249d8d912b022cf6b07e47bec16c431399ee1d7a6f838a354a1fed1cd4349763
Scope: a scoped verification of the changes since round 2 (its two low findings and the newly written audit section of the write-up). No other part of the model was re-audited.
Mechanical: audit-model.ts 0 high / 0 medium (only the low "estimate with no range" lines for the switched-off branches' point inputs, as in round 2); check.ts all models valid; result and combined range unchanged from round 2 (8.344, 0.43–160), as expected since spending does not enter the per-dollar result.

Previous round:
- 1 (low, fellows possibly inside the team of 10): resolved. `fellows_fte` is 0.5 (0.25 to 1.5), and its explainer says the letter's full-time team of 10 may already include some fellows, so only those beyond it are counted. Spending is (7.5 + 0.5 × 0.6) × $250,000 × 1.2 = $2,340,000. charities/ibbis.json `spending.programme` and `lines[0].dollars` are both 2340000, and the spending source text now says "half a fellow beyond that team". The model's `program_spend` and `bio_attribution_share` explainers and the summary say about $2.3M, and the write-up says about $2.3 million. No stale 2.4M or 2,430,000 remains in the model, the write-up, the charity record or the next-dollar entry.
- 2 (low, Sentinel Bio's second grant): resolved. The `ibbis` room note in facts/next_dollar.json now says Sentinel Bio gave a second grant in May 2026 of an unpublished amount, matching the Manifund page as quoted in round 2. The factor is unchanged: 0.85 × 0.7 × 1.0 = 60%, from 26% to 95%, and the explainer agrees. The tornado still shows `@next_dollar.ibbis` 0.26–0.95.

Write-up "How this model was checked": matches audits/ibbis-charityevals/audit-r1.md and audit-r2.md.
- Round 1: one high (ten rows with the template's placeholder sources, now citing the tournament and IBBIS's own pages), one medium (the write-up's result split, corrected here and in the SecureBio and Johns Hopkins write-ups), and lows (evidence wording, the Johns Hopkins comparison, fellows paid by their own programmes now left out of the cost). All as in r1 and r2's "Previous round".
- Round 2: pass with two lows, the two resolved above.
- It says a verification round checked those changes (this one) and that the rounds are in audits/ibbis-charityevals/ (all three files exist). The text names no figure that conflicts with the model.

Findings: none.

Verdict: pass (no high or medium findings; no findings).
