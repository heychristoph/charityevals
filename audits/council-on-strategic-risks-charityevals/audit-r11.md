# Audit: council-on-strategic-risks-charityevals, round 11 (scoped verification)
Result: 9.117 years of healthy life per $1,000 (was 9.609 on origin/main, -5.1%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 9203eb72f5c6fd2a320e93430c944cb226a03cb8aad86af5fde579fcf9b444c3
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: r10 was "fix needed" (three stale typed figures in Biggest uncertainties: Nolan split, fellow share, nuclear cut). All three resolved: the write-up now reads 9.7 to 8.3, 4.8 to 18, and 4.5 to 55.

## Checks
- Diff vs origin/main: only never_started marks on the five *_future_dalys rows, reworded future_dalys explainer, descendants:false on value_per_death and covid_value_per_death, the future_animal_harm row, the dalys_direct formula, and summary sentences. Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 9.608519 = "origin/main, defaults". Headline now 9.116561 = scripts/headlines.ts (9.11656) = "after" 9.117 in never-started-branches.md. w_ai/w_pol 0; w_bio, w_nuclear, w_fb hold no future (main minus the future's DALYs differs by under 0.01%, the survivors' descendants).
- Preflight passes.

## Prose
Summary and write-up: the future "counted only where you count lives that never start (0% by default)" is true. Shares after adjustments recomputed: fellowships 68.2%, nuclear 23.9%, biological 7.8%, climate under 0.01%; they match the text. Typed figures hold at two significant figures: Nolan split 45% to 80% gives 9.70 to 8.34 (text 9.7 to 8.3); fellow share 3% to 25% gives 4.76 to 18.45 (text 4.8 to 18); nuclear catastrophe cut at a tenth and ten times gives 4.5 to 55 (text 4.5 to 55; moving both nuclear cuts gives 4.1 to 60, but the sentence does not say which, so it holds).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
