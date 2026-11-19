# Audit: mats-charityevals, round 7 (scoped verification)
Result: 3.066 years of healthy life per $1,000 (was 3.120, -1.70%). Combined range not re-run (scoped round). Verdict: fix needed.
Model-sha: 84b5855c154f59861de3e06fa3d409204b002381d204d119f86b02e70eee0ebc
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 6 was "fix needed" (write-up said the discount rate moves the result several-fold); resolved, the write-up now says the years move it several-fold and the discount rate little.

## Checks
- Diff against origin/main: only `never_started` marks on ai/bio/nuclear/pol/fb `_future_dalys` rows, the reworded explainer on future_dalys_if_extinct, `descendants: false` on value_per_death and covid_value_per_death, the new future_animal_harm row, the dalys_direct formula, and the summary's future sentence. Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 3.119510 = origin/main defaults (6+ figures). Headline now 3.066483 = scripts/headlines.ts (3.06648) = never-started-branches.md "after" (3.066).
- Weights at 0: w_ai 15260.1533 and w_fb 541040.4708 equal `<branch>_deaths_averted * dalys_from_uov / deaths_averted` exactly; w_bio, w_nuclear, w_pol are 0. No future in the weights.
- sens.mts: years counted 1 -> 0.6623, 20 -> 9.361; discount 8% -> 2.669, 0.1% -> 3.548; Long-run value set (0.1%, weight 1) -> 10.60. Training (w_fb) is 97.3% of the weights.

## Prose
Summary holds: future "counted only where you count lives that never start (0% by default)", training 98% (97.3%, within 2 points). Write-up: the future sentence holds; "years move the result several-fold" holds (0.66 to 9.4 against 3.07); "discount rate moves it little" holds (+16% at the low end, -13% at the high). One stale figure: the "How the impact happens" paragraph says the shared chance is 5% and then "You can move the 3% with a slider"; the slider's default (assumptions/default.json ai_catastrophe_chance) is 5%, and the first half of the same paragraph was changed to 5% already.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | prose | writeups/mats-charityevals.md, "How the impact happens" | Slider named as 3% in the sentence after the shared 5%. | assumptions/default.json ai_catastrophe_chance best 0.05 | Replace "You can move the 3% with a slider." with "You can move the 5% with a slider." | none |
