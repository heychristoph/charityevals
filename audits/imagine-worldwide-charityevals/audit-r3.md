# Audit: imagine-worldwide-charityevals, round 3 (scoped to the changes since round 2)
Result: 0.004626 uov/$ = 2.313 years of healthy life per 1,000 dollars, unchanged from round 2 (the shared facts have the same best values, 20% and 40%). Verdict: pass.
Model-sha: 4955209748eb7e7b810b5594a4c97b03c6c4d3ad3f5d5e03260f14be9780b3b1
Rules: 0.3.7
Scope: only the changes since 4423e385 (tablets_in_service_2023, edu_earnings_per_sd, edu_persistence, write-up).
Mechanical: audit-model 0 high, 1 medium (far-above, 28.8x the cause median; reasoning unchanged from rounds 1-2); the round-2 spread finding no longer appears. check.ts: all models valid. generated/ unchanged.

## Round 2 finding: status
| # | Status | Check |
|---|---|---|
| 1 | fixed | tablets_in_service_2023 high is 82,000; the explainer says 6,534 children at about five a tablet add about 1,300, rounded up to 82,000. Arithmetic correct. |

## Findings (this round)
None.

## Checks of the changed rows
- Fact ids: edu_earnings_per_sd = @education.earnings_gain_per_sd_adult_skills_lmic (label: adult earnings gain per SD of literacy and numeracy skills held in adult life, LMICs; 20%, 10-30%; source Rossiter, Sandefur and Hares, CGD 2025, quote verified present in facts/education.json). edu_persistence = @education.test_gain_persistence_to_adulthood (share of a programme's test gain still there as skill in adult life; 40%, 20-70%, judgment). Both exist and mean what the rows' labels say.
- No double counting of fade-out: the earnings fact is per SD of skill held in adult life and its explainer says the programme's gain is first multiplied by the lasting share; the persistence fact is that share. The effect formula multiplies rct_learning_gain_sd x edu_earnings_per_sd x edu_persistence once, with no other fade or decay factor on the path (evidence_adj covers trial trust only, per round 2).
- Explainers: both are short, name the fact and its role; the model's explainer for the earnings row points to reading it with the lasting share, which matches the fact's own explainer. The old judgment text and the NBER and Bailey citations are gone from the model; the facts carry them.
- Ranges: high ends fell (earnings 40% to 30%, persistence 80% to 70%), so the plausible range narrows slightly; lows and bests are unchanged.
- Write-up: line 11 and the main-driver and uncertainty text speak of the earnings gain per SD, the share that lasts and fade-out, consistent with the rows; "How this model was checked" notes the shared figures; the two removed source links are no longer referenced by the model.

Findings by severity: high 0, medium 0, low 0.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 3f77fd0e.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against 5724c36c.
