# Audit: mercy-corps-charityevals, round 3

Result: 1.768e-4 daly/$ = 0.177 years of healthy life per $1,000 (combined range 0.033–0.952); global-health median 0.207 (×0.85). Verdict: pass (0 high, 0 medium, 1 low).
Model-sha: 3136c2278679c16512d2be6347bbbc8e9c385a633f0d4089a9ba2e72729a3e27

Scope: only the changes since round 2 (`git diff c080ee8 6d26408 -- models writeups`): the household-sharing multiplier, the relief cost anchor, the summary and write-up figures, the write-up's round list.

Mechanical: audit-model 0 high / 0 medium, one LOW spread note (own ranges span 1396×, the summary says the result is mostly uncertainty). `check.ts`: all models valid. normalization-audit and simulation-check not re-run: the only new shared reads are `@household_size` rows already used by siblings.

Previous round: 3 findings.
- 1 (medium, household sharing) resolved in substance: `liv_household_gain_multiplier` = 1 + `liv_participant_only_share` × (`liv_household_size` − 1), with `liv_household_size` = avg(@household_size.nigeria 4.5, kenya_rural 4.2, uganda_rural 4.9) = 4.53 (values checked in facts/household_size.json). The multiplier is 1.71 at the defaults; the share's slider (0–0.6) moves the result 0.146–0.239, so the lever works. The factor is now tied to the shared figure and the sliders move it. The explainer now says p. 22 is Europe's table and the 19M on p. 25 is wider. The share's best value is 0.2, not the 0.5 suggested; see finding 1.
- 2 (low, $30 anchor) resolved: the World Vision model's `wvp_relief_spend` is 1,060,000,000 and `wvp_relief_people` 35,600,000, and `relief_cost_per_person` is their ratio (about $29.8). The citation is accurate.
- 3 (low, delete the round list) not applied, and rightly: build-cea SKILL.md step 3 requires the write-up to include "How this model was checked" (audit rounds and what changed). The Round 1 and Round 2 bullets describe what the checks changed and the effect, which that section asks for. Keep them. One note: the Round 2 bullet ends with "a third, short verification round checked those changes"; when this round is added to the history, state it as a result ("Round 3: pass") rather than a forward reference.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | judgment | `liv_participant_only_share` | The best value 0.2 has no anchor of its own: the explainer says many programmes count every household member, but gives no figure for how many, so the choice between 0.2 and the 0.5 suggested last round is a bare judgment. It gives a multiplier of 1.7 where World Vision (about 4.5) and Save the Children read the whole household for their direct participants. The difference may be right (those two models count households or participants of other kinds), but the explainer does not say why this model sits at a third of theirs. | Result at share 0 / 0.2 / 0.6: 0.146 / 0.177 / 0.239 per $1,000. | Add one clause to the explainer saying why 0.2: for instance that Mercy Corps' economic-opportunity KPIs count households or members in the largest market and savings programmes, with a cited page, or state it as unanchored. Keep the range. | up to +30% at the top of the range; already in the combined range |

## Sources checked

| Row | Source | Status | Note |
|---|---|---|---|
| liv_household_size | facts/household_size.json (nigeria 4.5, kenya_rural 4.2, uganda_rural 4.9) | verified | average 4.53 |
| relief_cost_per_person ($30) | models/global-health/world-vision-charityevals.json, `wvp_relief_spend` / `wvp_relief_people` | verified | 1,060M / 35.6M = $29.8 |
| summary and write-up headline (0.18; range 0.03–0.95) | audit-model output | verified | 0.1768 and 0.0328–0.9516; the write-up's "a fifth to five times" matches |
| all other rows | unchanged since round 2 | not re-checked | |

## Drivers

Unchanged from round 2 except that `liv_participant_only_share` (judgment, 0.2, 0–0.6) replaces the multiplier as the sharing lever; `$missing_data_discount`, `$uov_per_daly`, `liv_direct_gain` and `liv_years` remain the largest.
