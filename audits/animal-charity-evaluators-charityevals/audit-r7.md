# Audit: animal-charity-evaluators-charityevals, round 7 (scoped verification)
Result: -3.906e-9 uov/$ = -1.953e-6 years of healthy life per 1,000 dollars (was 3.280e-5; -1.1e+2%, crossing zero). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 701154d09126513662e90e46c1f3a33eb0925734ea9938ab225dd087e52296ba
Rules: 0.3.4
Scope: rule theoretical-cause-aggregates only (commit 65635d2e; inventory/rule-changes/theoretical-cause-aggregates.md). No source or scope re-audit.
Preflight: not re-run; the model file is unchanged, so lint and invariants are as in round 6.
Previous round: round 6's findings stay as they were; this round adds none to the model.

## Checks
- Model unchanged: `npx tsx scripts/audit-receipt.ts animal-charity-evaluators-charityevals` equals round 6's Model-sha (both 701154d0).
- Headline now -1.95279e-6 (`scripts/headlines.ts`), before 3.280e-5: matches the rule's table.
- Row diff, engine at 07e611bd against the current engine on the same data: only the rows below change.
  prior_dollar_value 1.2928e-6 → 1.6499e-6; shifted_dollar_value -9.576e-8 → -2.029e-7; moved_dollar_net_value 9.816e-8 → 4.461e-8; moved_value 0.37516 → -0.022337; outcome_total, uov_per_dollar (2.187e-7 → -1.302e-8), uov_per_donor_dollar (6.560e-8 → -3.906e-9). `moved_dollar_value` (9.736e-7, read from the eight `#ace:` recipients) and every other row are unchanged.
- Why it crosses zero (the rule's arithmetic, not a bug). `prior_dollar_value = prior_vs_cash × #givedirectly / #cause:global-health × #cause:animal-welfare`. Global-health mean ×0.814 and animal-welfare mean ×1.038 raise it ×1.276 (1.2928e-6 → 1.6499e-6; GiveDirectly's value over the mean is 0.755 of animal-welfare's, was 0.614), which is now above `moved_dollar_value` 9.736e-7, so `shifted_dollar_value = 0.3 × (9.736e-7 − 1.6499e-6) = −2.029e-7` (was −9.576e-8). `moved_value = (donors_moved 4,567,362 × 0.99563 × 4.461e-8 + grantmakers_moved 1,100,000 × −2.029e-7) × 1.1 = (0.2028 − 0.2232) × 1.1 = −0.0223`. Before: (0.4464 − 0.1053) × 1.1 = 0.3752. The grantmakers' $1.1M is all shifted money, so it carries the whole negative gain; the donors' half-new money stays positive but small. `downstream_value` is 0 (no own policy wins), so the headline is `moved_value` over cost: negative. Negative net-harm results are allowed. The mean of the ranked animal charities (2.18e-6) is well above ACE's fund-weighted recipients (9.7e-7, dominated by its split), so an ordinary animal charity at 75% of the mean beats the weighted recipients: arithmetic, not an error.

## Prose
Write-up writeups/animal-charity-evaluators-charityevals.md has no typed result and no sign claim (the result is a placeholder). One typed figure is stale.
- Low, line 23 ("By the site's rule for an organisation outside global health, an ordinary animal charity is to the animal charities on the rankings as GiveDirectly is to the global-health ones: about 60% of their average"): now about 75% (GiveDirectly 0.00792 over the global-health mean 0.010485 = 0.755; was 0.614). Fix: change "about 60%" to "about 75%".
- Low, summary (model text) and "The animal weights..." prose read as if the result is a small positive; no sentence states a sign, so nothing is wrong, but the result is now slightly negative because the Recommended Charities' fund-weighted figure is below an ordinary animal charity's. Not worded as a fix: adding a line is against the less-text rule, and `{{result}}` shows the sign.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | writeups/animal-charity-evaluators-charityevals.md line 23 | typed "about 60%" is now about 75% | prior_dollar_value / #cause:animal-welfare = 1.6499e-6 / 2.1844e-6 = 0.755 | change to "about 75%" | none |

## Sources checked
None (scoped round: no source read).

## Drivers
Unchanged by this round; the move comes from the `#cause:` aggregates alone.
