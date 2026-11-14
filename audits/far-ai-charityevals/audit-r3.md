# Audit: far-ai-charityevals, round 3
Result: 0.000814 daly/$ = 0.814 years of healthy life per 1,000 dollars (combined range 0.016–40.3); cause median 1.351 (×0.60). Verdict: pass.
Model-sha: ce7ae7cd2b5bf643cefb3dbad2ef2eb670e91bfe853ef89142d74fe63e8e6e40
Scope: unchanged from round 2 (all four programmes, 2024, $7.52M of $8.60M); this scoped round checks only the changes of commit b8b1c73 to the model, `facts/next_dollar.json` and the write-up.
Mechanical: lint no output from audit-model (no findings), invariants none, normalization-audit none (all 27 checks show 0 violations, INV-15 included; `generated` restored with `git checkout -- generated`).
Previous round:
1. Grant's misuse share (medium): **resolved**. `ai_misuse_cost_share` is 0.28 (0.11–0.40). The explainer lists all four areas and says three of the four are against attackers, so three quarters ($1.10M); (0.99 + 1.095) / 7.517 = 27.7%. The source is the archived grants page (the saved copy contains the quote word for word). Result 0.814 (1.080 → 0.814 with finding 2).
2. `@next_dollar.far_ai` use (medium): **resolved**. Use 0.45, from 0.7 times the non-grant programmes' dollar relative to the average. I recomputed the ratio: value per dollar ∝ evidence × (313.8 + 27,550 × misuse share), read from audit-model's `ai_deaths_per_million` and `ai_future_per_million` at shares 0, 0.28 (also CAIS and MIRI rows, which fix the slope) and the model's evidence adjustments (research 1.2, hub 0.6, events 1.0, grant 1.0) and spending. With research at 1/3, the hub and events at 0, the grant at 0.75, the average dollar is 8,667 and the other three programmes' dollar 5,700: ratio **0.66**, so 0.7 × 0.66 = 0.46 against the model's 0.45. 0.45 × 0.45 × 1.0 = 20.25% (20%); low 0.25 × 0.3 × 0.85 = 6.4%; high 0.75 × 0.65 × 1.05 = 51.2%. The explainer's arithmetic is right.
3. Low end of the range (low): **resolved**. Research by papers alone (2/12 × $2.957M = $0.49M) plus a quarter of the grant ($0.365M) is 11.4% of $7.52M; the model says 11% and the explainer's words now match. The high end (research half, the grant all) is 39%.
4. Computing claim (low): **resolved**. The explainer now says only that the red-teaming of safeguards (990 Part III line 4a) is also misuse work.
5. Unsourced explainer claims (low): **resolved**. (a) `spend_grants` takes the $12M from the grants page, drops "June 2024" and names Coefficient Giving; `grants_evidence_adj` carries the same archived page as its source with the quote "Our grantmaking is funded by a $12 million grant generously provided by Coefficient Giving." (in the saved page). (b) `research_evidence_adj` no longer says the Go attacks were taken up; it says the attacks on frontier models' safeguards "reach the developers", which the GPT-5 card supports (round 2 verified §6.3.3.4). (c) `hazard_harm_share` dropped "it tells the developers first".
6. Summary (low): **resolved**. It names the grant for AI security research, says "about 12 times MIRI's" (0.8142 / 0.06594 = 12.3) and range "0.02 to 40" (audit-model 0.016–40.3), and gives the next dollar "a fifth of the past average".
7. Volunteers (low): **resolved**. `partner_share` names "the 17 volunteers the 990 reports (Part I line 6)".

Write-up checked against audit-model: headline 0.81 (0.814), range 0.02–40 (0.016–40.3), "about 12 times MIRI's", misuse cut 0.11–7.8 (tornado 0.1132–7.824), chance 0.10–5.4 (0.1031–5.428), misuse share "from 11% to 40% moves the result from 0.34 to 1.1" (0.3407–1.148), next dollar 20%, "together they lower the result by a quarter" (1.080 → 0.814 is −24.6%). The round-2 paragraph in "How this model was checked" is accurate.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | @next_dollar.far_ai (range) | The range 0.3–0.65 is a little off its own recipe. The use ratio 0.66 with the round-2 scaling (0.5 and 0.9 of the neutral factor) gives 0.33 and 0.59; the entry has 0.3 and 0.65. The best guess 0.45 is right (0.46). | Recomputed ratio 0.658 (above) | Optional: set low 0.33 and high 0.6 (next dollar 7%–47%), or state in the note that the range also covers the uncertainty in the 0.66. | none at best; the tornado would narrow slightly |
| 2 | low | presentation | write-up, "How this model was checked" | "A verification round checked the changes" is written before the round that does so reports. It is true once this round's receipt is in, so no change is needed unless the round fails. | this file | None. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| ai_misuse_cost_share (grant's areas) | archived far.ai/programs/grantmaking (saved copy gm2.html) | verified | "data poisoning, consistency checks, model stealing, and prompt injection" |
| spend_grants, grants_evidence_adj ($12M) | same | verified | "$12 million grant generously provided by Coefficient Giving" |
| ai_misuse_cost_share (the quote in `source.quote`) | same | verified | the quote in the model reads "Broad project examining robustness across four vectors: ..." as in round 2 |
| @next_dollar.far_ai (restricted grant, use arithmetic) | audit-model rows | verified | see Previous round 2 |
| partner_share (17 volunteers) | 990 Part I line 6 | verified in round 2 | unchanged |

## Drivers
Unchanged from round 2: the shared misuse cut (0.11–7.8), the chance of an AI catastrophe (0.10–5.4), the years counted and the missing-data discount, `@next_dollar.far_ai` (now 0.24–2.1; its use factor now reflects the restricted grant) and `ai_misuse_cost_share` (0.34–1.1, the one model-specific judgment, now anchored on the papers, the red-teaming and the grantee's four named areas). What would most improve the model remains a spending split of FAR.AI's research between misuse and misalignment work from FAR.AI itself. Peers: 0.81 against a cause median of 1.35 (×0.60), about 12 times MIRI, with the reason stated in the summary.

Verdict: pass (0 high, 0 medium, 2 low).
Model-sha: ce7ae7cd2b5bf643cefb3dbad2ef2eb670e91bfe853ef89142d74fe63e8e6e40
