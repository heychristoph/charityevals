# Audit: lead-exposure-elimination-project-charityevals, round 4
Result: 0.03040 uov/$ = 15.2 years of healthy life per 1,000 dollars, unchanged from round 3. Verdict: pass (no high findings; one low carried over).
Model-sha: 1b752064622afaa5402934f8d20a950df2ab48952b5829f256651c177337557f
Scope: round 3's two lows only. The diff since round 3 is one sentence in the explainer of `adult_deaths_value_per_birth`; `git diff HEAD~1 -U0` shows no other line changed.
Mechanical: audit-model 0 high / 1 medium (far-above, explained in round 2: reach) / 1 low (spread, accepted); result identical to round 3.

Previous round:
1. (low) `lead_deaths_2023` quote word order: not resolved. The stored quote reads "more than 3.5 million deaths globally were attributed to lead exposure in 2023, primarily due to cardiovascular effects". The WHO page fetched today has only "Lead exposure was attributed to more than 3.5 million deaths globally in 2023, primarily due to cardiovascular effects"; the grep for the stored wording returns nothing. Number, year and cause match.
2. (low) conservatism sentence: resolved. The added sentence ("The world's deaths over the world's births slightly understate the rate in the protected countries, where blood lead is higher, so this is a little conservative.") states the right direction. No number or formula changed.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `lead_deaths_2023` | Stored quote does not appear verbatim on the WHO page as served today (word order differs); the figure is right. | https://www.who.int/news-room/fact-sheets/detail/lead-poisoning-and-health | Replace the `quote` with "Lead exposure was attributed to more than 3.5 million deaths globally in 2023, primarily due to cardiovascular effects". | 0 |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| lead_deaths_2023 | https://www.who.int/news-room/fact-sheets/detail/lead-poisoning-and-health | verified (number, year, cause); wording differs, finding 1 | more than 3.5 million deaths in 2023, primarily cardiovascular |
