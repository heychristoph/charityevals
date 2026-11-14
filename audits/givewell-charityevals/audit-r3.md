# Audit: givewell-charityevals, round 3
Result: 0.07209 uov/$ = 36.0 years of healthy life per 1,000 dollars (combined range 14.3–91.1); cause median 0.0690 (×522). Verdict: pass.
Scope: scoped verification of the five round 2 fixes only; scope, sources and structure otherwise as in round 2.
Mechanical: audit-model lint 0 findings; invariants none; check.ts "all models valid". Not re-run (not in scope): normalization-audit, simulation-check.
Previous round (round 2, findings 1 to 5): all five resolved in substance; two small residues are listed as new findings 1 and 2 below (low).

## Verification of each change

1. `survey_response_adj` (round 2 finding 1): verified.
   - Formula `survey_response_share + (1 - survey_response_share) * @meta.survey_nonrespondent_influence`. Computed: share = 8,010,602 / 19,300,000 = 0.41506; adj = 0.41506 + 0.58494 × 0.5 = 0.70753; `donor_own_effect` = 0.8403 × 0.70753 = 0.5945 (59%). Low end (influence 0.25): 0.561 × 0.8403 = 0.471 (47%); high end (influence 1): 0.8403 (84%). All three match the explainers, summary and write-up (59%, 47%–84%).
   - `survey_respondents_giving` 8,010,602: verified in the Internet Archive copy of Metrics 2016, PDF p. 14, "Total 583 100% $8,010,602 100%".
   - `surveyed_donors_giving` 19,300,000: verified, p. 12: "…the 1,882 donors surveyed who each gave $2,000 – $1 million in 2016 (in total, this set of donors gave $19.3 million)".
   - `drawn_with` links the two rows, so the share holds in the simulation (the tornado shows both as point inputs, with the new shared fact as a ranged input at 34.2–39.8).
   - `@meta.survey_nonrespondent_influence` (0.5, 0.25–1, estimate) is in facts/meta.json with source, note and explainer. The values and the explainer's rule match the Giving What We Can passage that round 2 quoted. The fact's `quote` is weaker than that passage (new finding 1).
   - The note of `own_effect_share` is corrected about the 40.2% (it now says the estimate already counts non-respondents at half), but its closing phrase is not (new finding 2).
2. `granted_dollar_value` (round 2 finding 2): verified. Its formula is `value_destinations` with the `@meta.givewell_influenced_2024` term removed from numerator and denominator; it computes to 0.05469 (round 2 predicted 0.0547) against `moved_dollar_value` 0.05142. It is used in `uov_per_donor_dollar` in the freed term (`next_dollar_freed_for_grants * granted_dollar_value + ...`), and `moved_dollar_value` is kept for money moved. The explainer states the difference. Result 36.04 (round 2 expected about 36).
3. `next_dollar_freed_for_grants` source (round 2 finding 3): verified. The Excess Assets Policy archive (web.archive.org/web/20261019185724) is reachable and says: "Once we surpass that level of unrestricted assets, we designate the excess assets for granting"; "continue operating for two years into the future"; "The Board meets at minimum once a year to approve a budget … vote to irrevocably earmark them for regranting". The `source.url`, quote and note match. The explainer now answers the Unrestricted Fund page's "most donors' gifts are spent on operations" (the excess is taken from the largest gifts, so a further gift still raises the excess one for one). The write-up says "as GiveWell's excess-assets policy implies" (line 40). The archive URL is the one in the task; the source block cites the live URL (as the other sources do).
4. `donors_moved` (round 2 finding 4): verified. The formula is `donors_moved_gross * donor_own_effect + influenced_funding * survey_response_adj`: 290,990,796 × 0.5945 + 45,000,000 × 0.7075 = 173.0M + 31.8M = $204.8M, matching the engine's value 204,843,358. The explainer says why only the survey-response step applies.
5. Write-up (round 2 finding 5 and money-moved figures): verified. "from a 2015 survey of engaged donors" (line 33). Money moved: the engine gives $230.6M ("about $231 million", line 27) and $11.12 moved per dollar ("about eleven dollars", lines 3 and the summary). The 59% (47%–84%) and "42% of what all surveyed donors gave" in the write-up (line 18) match the rows. The headline figure 36 matches the model.

## New findings

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `@meta.survey_nonrespondent_influence` (facts/meta.json) | The quote "Pledge counterfactuality coefficient 33% 26%" is a table label with its two numbers; it does not contain the 50% / 25% rule the fact is about. The rule is stated in the passage that round 2 quoted. | Round 2 finding 1 evidence (GWWC 2023–2024 Impact Evaluation, counterfactuality section). | Set `source.quote` to: "we assumed that GWWC's counterfactual influence on non-respondents was 50% as large as our influence on respondents for our best-guess estimates and 25% as large for our conservative estimates". | none |
| 2 | low | presentation | facts/meta.json `own_effect_share` note | The note ends "Low: below the conservative non-pledge figure; high: above the raw survey." The high end 45% lies above the discounted survey figure (40.2%) but below the raw survey's 55%, so "raw" is wrong (round 2 finding 1(d) asked for "above the discounted survey"). | Round 2 finding 1 evidence: the Value Survey reads 55% / 40% / 33%. | Replace "above the raw survey" with "above the survey's discounted 40.2%". | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| survey_respondents_giving | Metrics 2016 (archive 20260917080129) p. 14 | verified | $8,010,602, 583 donors |
| surveyed_donors_giving | Metrics 2016 (archive 20260917080129) p. 12 | verified | 1,882 donors, $19.3 million |
| next_dollar_freed_for_grants | givewell.org/about/official-records/Excess-Assets-Policy (archive 20261019185724) | verified | two-year rule; excess designated for granting; Board earmarks at minimum once a year |
| survey_nonrespondent_influence | GWWC 2023–2024 Impact Evaluation | verified in round 2 (passage); quote field to be replaced (finding 1) | 50% best guess, 25% conservative |

## Drivers
Unchanged from round 2: the freed share (`next_dollar_freed_for_grants`, 27.4–62.1), the value of a life and the discount rate, then `@next_dollar.givewell` and the survey step (`@meta.survey_nonrespondent_influence`, 34.2–39.8). The result sits between Giving What We Can (37.3) and a dollar granted by GiveWell itself; at 522 times the cause median the summary gives the reason (its grantees), as INV-15 requires.

Fixed after this round (builder, facts/meta.json notes only; the model is unchanged, same Model-sha): the `survey_nonrespondent_influence` quote is now Giving What We Can's passage with the 50% and 25% rule; the `own_effect_share` note's high end now reads "above the survey's discounted 40.2%".

Verdict: pass
Model-sha: 197b403854a88455bf5a376766ec265d2c5d75d544162ea024a889edfe5dd45f
