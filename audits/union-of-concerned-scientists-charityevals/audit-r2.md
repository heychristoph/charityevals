# Audit: union-of-concerned-scientists-charityevals, round 2

Result: 0.01578 daly/$ = 15.78 years of healthy life per 1,000 dollars (combined range 0.68-368); cause median 1.576 (x10.01). Verdict: pass.

Scope: scoped verification of the four round-1 fixes (git diff 85cd58a of the model, facts/next_dollar.json and the write-up). Nothing else re-audited.

Mechanical: audit-model.ts shows 0 findings; check.ts "all models valid".

| # | Round-1 finding | Status | Check |
|---|---|---|---|
| 1 (medium) | single blended next-dollar figure | settled | The fact is split. `union_of_concerned_scientists_global_security` = 0.6 x 0.7 x 1.0 = 0.42 (0.4 x 0.5 x 0.9 = 0.18 to 0.85 x 0.9 x 1.05 = 0.80), and the model's marginal_vs_past_average reads it. `union_of_concerned_scientists` is re-based to 0.6 x 0.55 x 1.0 = 0.33 (0.14-0.71); the climate model still reads it (one reference). Notes and explainers carry the factor reasoning, and the room facts match round 1's checked 990 numbers. Headline 13.65 to 15.78 (+15.6%, round 1 predicted +16.7% before the range and 0.07 change). Summary and write-up updated (16, 0.7-370; climate 0.0011). |
| 2 (low) | unmodelled_benefits_adj anchored on the wrong base | settled | Best 0.07 (0-0.25); the 6% limited-nuclear-war and 1% RECA parts remain; the election and justice 1% is removed, with the reason in the explainer. Write-up sentence updated to match. |
| 3 (low) | unsourced budget figures in gov_public_dollars_per_dollar | settled | The explainer now cites only NOAA (annual report p. 4) and the 402 attacks (p. 6), and the 100 (10-1,000) is argued without the EPA and NOAA dollar figures. |
| 4 (low) | unsourced "run" claims | settled | The Charity Navigator and new-president claims are gone; run is the neutral 1.0 (0.9-1.05). |

New-problem check:
- INV-15: the result is 10.01x the median, which triggers the "more than ten times its peers" rule. The summary gained that sentence with a stated reason (peers mostly work only on AI; Rethink's nuclear project averts more deaths per dollar). It names no unsupported number. Pass.
- Ranges, and the two facts' label and explainer pair, are consistent with each other; the explainers cross-reference correctly (42% / 33%).
- The other round-1 checks (sources, double counting, drivers) are unchanged by the diff.
- The next_dollar.json diff also adds a league_of_women_voters_education_fund entry belonging to another build; it is outside this audit's scope.

No findings.

**Verdict: pass (all four round-1 findings settled; no new findings).**

Model-sha: 3a5e14768d0fa4782429edc841ec0e4a3dd19ae53909ab80ffd146dd097872f9
