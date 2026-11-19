# Audit: epoch-ai-charityevals, round 5 (scoped verification)
Result: 0.03349 years of healthy life per $1,000 (was 0.03510 on origin/main, -4.6%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: fa31e687aaa121288b1134466c72db03906952eaee7ca2ef0cf4aa9f459fc718
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: r4 passed (no findings).

## Checks
- Diff vs origin/main: only never_started marks on the five *_future_dalys rows, reworded future_dalys explainer, descendants:false on value_per_death and covid_value_per_death, the future_animal_harm row, the dalys_direct formula, and the summary's future sentence. Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 0.03509744 = "origin/main, defaults" (identical). Headline now 0.03349406 = scripts/headlines.ts (0.0334941) = "after" 0.03349 in never-started-branches.md. w_ai = 19,817 holds no future (main 20,766 minus the future's 946.6 = 19,819; the 0.009% gap is survivors' descendants); other branches are 0.
- Preflight passes.

## Prose
Summary and write-up (lines on the future, the discount rate, lives that never start) are true at the defaults. Typed figures recomputed: AI catastrophe chance 0.38% to 50% gives 0.0025 to 0.33 (text same); misuse catastrophe cut at a tenth and ten times gives 0.0115 to 0.253 (text 0.012 to 0.25); misuse spend share 0 gives 0.0090 and 8% gives 0.124 (text 0.0090, 0.12); misuse share of the result 1 - 0.00904/0.03349 = 73% (text 73%); speed-up harm range -1.5% to -18% and uptake 0.3 to 1.2 are input ranges, as stated; Long-run value set gives 0.244 (text 0.24).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
