# Audit: ibbis-charityevals, round 6 (scoped verification)
Result: 2.406 years of healthy life per $1,000 (was 2.670, -9.9%). Combined range not re-run (scoped round). Verdict: fix needed.
Model-sha: 4b8368f73a8d5dadd175231ff6162c0fb665a5426b2f93c8c77a8233f59d56b2
Rules: 0.3.12
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes (no blocking problem; low range lints only)
Previous round: round 5, pass, re-stamp after wording fixes (Rules 0.3.8, headline 8.90 under older rules).

## Checks
- Diff against origin/main: only the `never_started` mark and reworded explainer on `future_dalys_averted`, `descendants: false` on `value_per_death` and `covid_value_per_death`, the new `future_animal_harm` row, the `dalys_direct` formula, and the reworded summary sentence. Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 2.669983 = origin/main defaults (equal to 7 figures). Branch defaults 2.406142 = `headlines.ts` 2.40614 = lives-added.md "after" 2.406. never-started-weight alone moves 2.670 to 2.406 (-9.9%); lives-added a further -0.012%. Long-run value set gives 36.77.
- Preflight passes.

## Prose
Summary is true: the future counts only where lives that never start count (default 0%). Write-up: "about 37" for the Long-run value set matches 36.77, and the default-zero future sentences hold. One stale figure remains (below).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | stale prose | writeup, Biggest uncertainties | "The shared slider runs from 1 to 20 years: 1.9 to 27" is false at the defaults | win_years_counted 1 gives 0.52, 20 gives 7.3 | Write "0.52 to 7.3" | none |
