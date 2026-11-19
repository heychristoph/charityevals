# Audit: center-for-ai-safety-charityevals, round 12 (scoped verification)
Result: 3.892 years of healthy life per $1,000 (was 3.922, -0.77%). Combined range not re-run (scoped round). Verdict: fix needed.
Model-sha: ec0d655e26152b9e92d08b28335ed81dbf32aa4b2ce8bd381882a7f143461af4
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes (low lint range lines only).
Previous round: r11 ended "pass"; nothing outstanding.

## Checks
- Diff against origin/main: only `never_started` marks on the five `*_future_dalys` rows, the reworded future explainer, `descendants: false` on `value_per_death` and `covid_value_per_death`, the new `future_animal_harm` row, the `dalys_direct` formula, and the summary. Nothing else.
- verify.mts: lives_added off with never_started_weight 1 gives 3.922064, equal to origin/main defaults (3.922064). Headline now 3.89188 equals `scripts/headlines.ts` and the 3.892 "after" in never-started-branches.md.
- `w_ai` (172235.497) and `w_fb` (384234.433) equal `<branch>_deaths_averted * dalys_from_uov / deaths_averted` exactly; no future in them at weight 0.
- sens.mts: Long-run value set 8.466; AI chance 0.38% to 50% gives 0.30 to 38.9 (text 0.30 to 39); misuse catastrophe cut x0.1/x10 gives 0.53 to 37.5 (text 0.53 to 37); misuse share 10%/40% gives 1.65/6.13 (text 1.7 to 6.1); course students 1%/15% gives 1.32/10.3 (text 1.3 to 10); course carries 83% (text four fifths).
- preflight: passes.

## Prose
Summary and write-up read; future, discount-rate and never-started sentences are true, and the typed figures hold at two significant figures. One stale sentence remains in the write-up: it says the shared chance is 5% and then "You can move the 3% with a slider" (the slider's default is 5%).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | prose | writeups/center-for-ai-safety-charityevals.md line 19 | Second sentence still names the old 3% default | `$ai_catastrophe_chance` best is 0.05; the preceding sentence says 5% | Replace "You can move the 3% with a slider." with "You can move the 5% with a slider." | none |
