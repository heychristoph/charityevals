# Audit: council-on-strategic-risks-charityevals, round 10 (scoped verification)
Result: 9.159 years of healthy life per $1,000 (was 9.609, -4.68%). Combined range not re-run (scoped round). Verdict: fix needed.
Model-sha: 7325fcbd43de093b391ecf9fbde3929a338f9f049f1acce256afbd55d024cc3d
Rules: 0.3.12
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 9 (scoped, `fb_credit_share` range 0.4 to 1), pass.

## Checks
- Diff against origin/main: only the `never_started` mark and reworded explainer on `future_dalys_averted`, `descendants: false` on `value_per_death` and `covid_value_per_death`, the new row `future_animal_harm`, `dalys_direct` = `(future_dalys_averted + future_animal_harm)`, and the reworded summary sentence. Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 9.608519 = "origin/main, defaults" (identical). Headline now 9.158976 = `scripts/headlines.ts` (9.15898) = "after" 9.159 in lives-added.md. never-started-weight alone: 9.6085 to 9.15995 (-4.67%; the future's 44,358 DALYs leave). lives-added: 9.15995 to 9.15898 (-0.011%). animals-never-bred: no effect.
- Preflight passes.

## Prose
Summary: "the future lost counted only where you count lives that never start (0% by default)" is true. Write-up "How the impact happens" sentence on the unborn is true. The 69/23/8% shares still hold at the defaults (deaths only: about 69/23/8). Typed result figures under "Biggest uncertainties" were computed with the future counted and are now stale: the Nolan Center split reads 9.8 to 8.4 (not "10 to 8.8"), the fellow share reads 4.8 to 19 (not "5.0 to 19"), and the nuclear cut at a tenth and ten times (both nuclear cut rows) reads 4.1 to 60 (not "17 to 190").

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | Medium | Stale prose | writeups/council-on-strategic-risks-charityevals.md, Biggest uncertainties | Three typed figures predate the rules (future counted). | Script runs: csw_bio_share 0.45/0.8 gives 9.759/8.353; fb_share_working 0.03/0.25 gives 4.787/18.50; nuclear cuts x0.1/x10 give 4.085/59.59. | Write "from about 9.8 to 8.4", "from about 4.8 to 19", "From about 4.1 to 60". | None |
