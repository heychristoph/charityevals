# Audit: cepi-charityevals, round 3 (verification of round 2's four lows)
Result: 5.205e-4 daly/$ = 0.5205 years of healthy life per 1,000 dollars (combined range 0.0208–13.05; the model's own ranges, shared figures at their best, 0.0129–8.20); cause median 1.576 over 15 catastrophic-risk models (×0.33). Verdict: **pass** (no high findings; 0 medium, 1 low).
Model-sha: bc16508da7b209f0a0ddbd4e66c7ed6e679443d668720c3aa859c3f7127309a9
Scope: unchanged from round 2 (all of CEPI's 2025 programmes, $449M; pandemic branch plus endemic branch on the same dollars). Only the changed rows and the rows they touch were checked.
Mechanical: lint 0 high / 0 medium / 0 low. Invariants: none. normalization-audit: not re-run (no shared figure, standard step or section touched; the round-2 run was clean). check.ts: all models valid (warnings only: joint-extreme span, judgment share ~70%, 30 point inputs). simulation-check: stable (5% 0.151, 50% 1, 95% 12.5 × best guess; the single event misses 0% of draws).
Previous round: finding 1 (`mpox_deaths_per_year` unsupported high end): resolved, see below (one low remains on the new wording). Finding 2 (one wait for licensed and unlicensed vaccines): resolved. Finding 3 (`mission_effort_per_year` anchor): resolved (the explainer now says no published total of the mission's funding exists and keeps the judgment with its anchor, CEPI 3.0's $720M a year). Finding 4 (long `bio_scale_adj` explainer and summary): resolved.

Checks of the changes:
- **Finding 1.** `mpox_deaths_per_year` has no `source` block and is `kind: judgment`, 500 (170–1,100). The low end rests on WHO sitrep 67 (244 deaths among confirmed cases, 1 January 2025 to May 2026, about 170 a year; verified in round 2). The best and high ends are named as judgment from under-testing in the Democratic Republic of Congo. The ranged judgment names its anchor (the 170 floor), as the rules require.
- **Finding 2.** `end_licensed_years_until_effect` is a ranged judgment (1, 0–3) with its reason. `end_licensed_discounted_years` = `pv_annuity_due(1, $discount_rate, end_years_brought_forward) * (1 + $discount_rate) ^ -end_licensed_years_until_effect`: the same brought-forward years and shared discount rate as `end_discounted_years`, only the wait differs. `end_deaths_averted` applies `end_discounted_years` to the Lassa, filovirus, Nipah and Rift Valley fever term and `end_licensed_discounted_years` to the mpox term; `end_dalys_illness` (chikungunya, licensed) uses the licensed one; both gate on `end_p_licensed_use`. The unlicensed branches keep `end_years_until_effect`, relabelled "the unlicensed vaccines" with its explainer now "from phase 2 to licensure, prequalification and campaigns". Wait discounted at `$discount_rate`: yes. The result moved from 0.5203 to 0.5205, as expected for a branch worth 0.4% of it.
- **Finding 3.** Wording only; value and range unchanged; the explainer's anchor is verified (round 1, cepi.net/investors).
- **Finding 4.** `bio_scale_adj` explainer is now the step, the formula's parts and the cancellation sentence (kept, and it matches the round-2 judgment that the extinction part keeps Rethink's ratio). The summary's size-step clause is one sentence. The formula and the result are unchanged; the stated 0.07 and the 7% in the summary match the model.
- **Write-up.** The "How this model was checked" paragraph matches the audit history (0.69 to 0.52; round 2's four lows; "a verification round checked them"). No stale number.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `mpox_deaths_per_year` explainer | The high end is glossed "deaths among suspected cases at the 2024 epidemic's height", a factual claim with no source in the row or in the write-up's sources (WHO sitrep 67 gives confirmed-case deaths only). It is a judgment, so the number stands, but the gloss reads as a measured figure. | row text; mpox sitrep 67 has no suspected-case death count | Replace the parenthesis with "our judgment of under-testing at the epidemic's height", or cite the Africa CDC briefing for the roughly 2,000 deaths in 21 months. | none (the branch is 0.4% of the result) |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `mpox_deaths_per_year` low end | WHO sitrep 67 | verified in round 2 | 244 deaths among confirmed cases, 1 January 2025 to 31 May 2026. Not re-fetched; the claim did not change. |
| `mission_effort_per_year` | cepi.net/investors | verified in round 1 | "The full CEPI 3.0 strategy requires US$3.6 billion"; 3.6B over 2027-2031 is $720M a year. |
| `end_*` wait rows | none (judgments) | n/a | Ranged, reasons given. |

## Drivers
Unchanged from round 2: (1) `$discount_rate`, (2) `$win_years_counted`, (3) the Rethink ratio of extinction cut to catastrophe cut, (4) `$missing_data_discount`, `mission_p_achieved` and `@next_dollar.cepi`, (5) `mission_effort_years` and `mission_effort_per_year`. The endemic branch is 0.4% of the result and the new wait row moves it by under 0.1%.
