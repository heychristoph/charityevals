# Audit: cepi-charityevals, round 8 (scoped verification)
Result: 0.1508 years of healthy life per $1,000 (was 0.1673, -9.8%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 779fbb25a495c47a501748bf94dd66482c581e044019c42e47135ad85f4023c8
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: r7 ended "fix needed" on one medium finding (stale one-year and twenty-year figures); resolved, the write-up now says 0.033 and 0.46, which the script reproduces.

## Checks
- Diff against origin/main: only `never_started` marks on the five `*_future_dalys` rows, `descendants: false` on `value_per_death` and `covid_value_per_death`, the reworded future explainer, the new `future_animal_harm` row and the `dalys_direct` formula. The summary is unchanged (it has no sentence about the future). Nothing else.
- verify.mts: lives_added off with never_started_weight 1 gives 0.1673072, equal to origin/main defaults (0.1673072). Headline now 0.150843 equals `scripts/headlines.ts` and the 0.1508 "after" in never-started-branches.md.
- `w_bio` (190000.85) and `w_ai` (89135.68) equal the deaths-only terms exactly; `w_bio` holds no future at weight 0. `w_end` is deaths plus illness years, with no future.
- sens.mts: Long-run value set 2.478; 8% discount 0.1255; one year 0.0331; twenty years 0.459; no size step (bio_scale_adj 1) 2.17; extinction-cut ratio ends 0.084 and 0.82; mission achieved 10%/60% 0.051/0.301; mission cost ends 0.076 and 0.30; next dollar 22.5%/89% scales linearly to 0.069/0.27.
- preflight: passes.

## Prose
Summary read: no claim about the future, none stale. Write-up read: the future sentences ("counts only where you count lives that never start (0% by default)", "all of the value at the defaults") are true, and every typed figure under "Biggest uncertainties" and "around 2.2" holds at two significant figures.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
