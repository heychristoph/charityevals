# Audit: cepi-charityevals, round 6 (wording-only follow-up to round 5)
Result: 5.577e-4 daly/$ = 0.5577 years of healthy life per 1,000 dollars at mobiliser_share 100%, unchanged from round 5. Verdict: **pass** (no high, no medium; 2 low left open).
Model-sha: 1ad27890cefecb8e32d09d279db391d54fa3c7228417436a0b3378d17aab07ab
Rules: 0.2.2
Scope: confirm only wording changed since round 5 and that the fix reads correctly.
Preflight: not re-run (no value, formula or class changed).
Previous round (round 5, four lows):
- Low 2 (`end_attribution_share_shared` "Delivery by trial countries and Gavi"): resolved. It now reads "Rollout after licensure by countries and Gavi is the adopters', under the mobiliser's share, not in this one", which separates trial-time co-funding from post-licensure adoption and matches the bio row.
- Low 4 (write-up typed figures): resolved in round 5; the intro's typed range follows the next regeneration (unchanged, not a model fault).
- Low 1 (reference class for awardees' co-investment) and low 3 (a line on un-netted procurement cost): not resolved, left open by the builder as lows; they never reopen a round.

Checks: headline 0.557691, equal to round 5. `bio_attribution_share_shared` 0.75 (0.55-0.9) and `end_attribution_share_shared` 0.55 (0.35-0.8) unchanged; every `<branch>_attribution_share` formula still `<shared> * mobiliser_share`, classes unchanged (ai, bio, end, nuclear, fb research; pol win). The new sentence adds no factual claim needing a source.

No new findings.

## Sources checked
None needed.

## Drivers
Unchanged from round 5.

Re-stamped (17 Nov 2026): credit rule 2.24: the verification round's low findings fixed (wording, no value change). Mechanical: headline unchanged, 1 row changed, against 2b24b73c.
