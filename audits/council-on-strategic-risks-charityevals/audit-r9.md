# Audit round 9 (scoped verification): Council on Strategic Risks

## Scope

`fb_credit_share` only: the low end of its range moved from 0.5 to 0.4 and its explainer was reworded, as round 6's low finding 2 suggested. Nothing else is re-audited.

## Checked

1. Diff against HEAD for the model file: one hunk, the `fb_credit_share` explainer and `low` 0.5 to 0.4. Best 1 and high 1 unchanged; no other row changed.
2. Round 6 finding 2 asked for "keep 1; set the range to 0.4 to 1 so the uncertainty is not one-sided". The range is now 0.4 / 1 / 1 and the explainer gives the reason ("staff at this stage often attend several"), keeps the best guess of 1 with its basis ("no other programme named in the sources trained or placed the same fellows"), and keeps the sentence that employers are under the mobiliser's share (2.24). The wording matches the range (0.4, not the old 0.5), and nothing else in the model or write-up mentions the old 0.5 for this row.
3. Headline: `scripts/headlines.ts` gives 32.0284, the 32.0 of round 8; the change sits in the low end only, so the best-guess result cannot move.
4. `scripts/preflight.ts`: passes; its one low note is that the stored simulation is out of date.

## Findings

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | Low | generated/distributions.json | The simulation draws `fb_credit_share` from the range, so the stored distribution is now stale (preflight says so). The headline is unaffected. | Run `npx tsx scripts/summaries.ts`. |

Verdict: pass
Model-sha: 51a09e87c2b37e762f5791653cd1f090a8b1934c65565959e94b4366ccd434fe
Rules: 0.3.3
