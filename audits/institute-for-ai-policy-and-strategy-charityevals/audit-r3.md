# Audit: institute-for-ai-policy-and-strategy-charityevals, round 3 (verification round)
Result: 0.001240 daly/$ = 1.24 years of healthy life per 1,000 dollars (combined range 0.028-55; model's own ranges 0.096-4.9); cause median 5.57 (x0.22). Verdict: pass.
Model-sha: 3d88eae5c966200928e4dc3142826103b5a96e843468406e0215e795336c5bf6
Scope: only round 2's finding 1 (the model's `summary`), the change in commit 1696f63 (the file's only change is the `summary` line); every number in the new summary was checked against audit-model and the model's rows.
Mechanical: audit-model lint 0/0/0, findings (0). Not re-run this round (scoped): check.ts, normalization-audit, simulation-check. No file in generated/ was changed.

Previous round (round 2):
- 1 (medium, presentation): resolved. The summary now says "about 1.2 years" (1.240), "from 0.1 to 5 on the model's own ranges" (audit-model 0.09623-4.919), "about four fifths of GovAI's result" (1.240 / 1.576 = 0.787), "the same share of work aimed at misuse (20%, its cyber work)" (ai_misuse_cost_share best 0.2 in both models; IAPS 0.1-0.3, GovAI 0.1-0.35), "a lower next-dollar figure" (38.5% against GovAI's 42%).
- Other figures in the summary: 28 fellows (fb_people 28), $3.9M programme spending (program_spend 3,905,273) and about $4.2M with the sponsor's central costs (overhead_ratio 1.065, i.e. $4.16M), 38.5% next dollar (facts/next_dollar.json best 0.385), "about half of the result each" for research and fellowship (round 2's check: 53% and 47%; the model's rows are unchanged), "no measure it worked on had become law" (pol_wins 0, unchanged).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | model `summary` | "The biggest swings" lists Rethink's cut for misuse work, the chance of a catastrophe, the years a cut counts and the next-dollar figure, but the tornado has the next-dollar slider sixth (0.42-2.45); the catastrophe death share (0.53-3.12, fifth) is wider and not named. | audit-model tornado | Replace "the next-dollar figure" with "the share of the catastrophe that is deaths", or leave as is. | none |

## Sources checked
None re-fetched (scoped round; no source or row changed).

**Verdict: pass** (no high or medium finding; one low presentation note)
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against e8ecb2b3.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 6 rows changed, against HEAD.
