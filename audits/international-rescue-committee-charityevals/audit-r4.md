# Audit: international-rescue-committee-charityevals, round 4 (scoped verification)
Result: 3.764e-4 daly/$ = 0.38 years of healthy life per 1,000 dollars (combined range 0.11–1.29); cause median 0.102 (×3.7). Verdict: pass (no findings).
Model-sha: 960ff0d2fa71c390b39faac8e5be44e50b7606c2caf38d53141e498b52af684a
Scope: only the round-3 fix (`git diff eab604a 135055d` on the model and write-up). Nothing else re-audited.
Mechanical: audit-model lint 0 findings, no invariant findings; result 0.3764 unchanged; `generated/` and the tree otherwise unchanged.

Previous round: 1 resolved. The summary and the write-up "Contraception" paragraph now say "about a fifteenth". Contraception is 21.5k of 330.6k healthy years (6.5%; a fifteenth is 6.7%) and vaccination 19.9k (6.0%); both fit. The diff of the model JSON is that one word in `summary` (twentieth to fifteenth); the write-up diff is the same word in one paragraph. No value, formula or range changed.

## Findings (0)

## Sources checked
None needed; wording-only change.

## Drivers
Unchanged from round 3.

Verdict: pass.
Model-sha: 960ff0d2fa71c390b39faac8e5be44e50b7606c2caf38d53141e498b52af684a

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)
Re-stamped (15 Nov 2026): shared LMIC learning-to-earnings and iodine facts (consistency, mechanical)

Re-stamped (16 Nov 2026): Typed refugee-relief figures now read shared facts (@humanitarian_response.*, @ukraine.war_affected_aid_recipients_consumption_share) at the same values; judgment explainers anchored on studies and published data (pre-audit gate cleanup). Mechanical: headline unchanged, against 4a6180e3.
