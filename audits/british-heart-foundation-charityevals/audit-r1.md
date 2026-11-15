# Audit: british-heart-foundation-charityevals, round 1 (verification of the shared tobacco figures)
Result: 1.034e-5 daly/$ = 0.01034 years of healthy life per 1,000 dollars (combined range 6.6e-4 to 0.162); cause median 0.0667 (x0.155). Verdict: pass.
Model-sha: 0d317c6aee36f14311123951288078810036800687109560c131443041ecaeda
Scope: commit 3e68437 only (policy branch re-pointed to facts/tobacco.json, credit restructured, side-effect rows, unmodelled share).
Mechanical: audit-model lint no high or medium, invariants none; check.ts "all models valid"; simulation-check ran with only info/warn notes on range width. normalization-audit not run (scoped).
Result before 0.0103830, after 0.01034 (-0.4%).
Previous round: none.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | adv_evidence_adj (reads @tobacco.uk_act_evidence_adj) | The fact's explainer now says vaping substitution is its own side effect and 0.7 "covers the rest" (repeal, modelled not observed), but the value 0.4/0.7/1 is unchanged from when it also covered vaping. Vaping is now taken off in both places, mildly (3% of the branch). | Diff: value identical before and after; old explainer listed vaping as covered. | Raise best to about 0.72, or say in the explainer that 0.7 is kept because the vaping part (3%) is immaterial. | under 0.1% of the result (branch is 9%) |
| 2 | low | source | @tobacco.smoking_dalys_gbr, shs_dalys_gbr | Could not verify 1,903,996 and 171,622: the OWID grapher is a JS table and its CSV download returns 403 (non-redistributable). The ratio 171,622 / 1,903,996 = 9.01% matches the model's 9%. | fetch gave no values | Add a second source (IHME GBD Results tool, UK 2023, smoking and secondhand smoke DALYs) to source.url or page. | none |
| 3 | low | source | uk_act_england_14_30, uk_act_ages_14_30, uk_act_uk_uplift, uk_act_prevalence_cut, never_start_lag_years | The DHSC PDF fetched but its text layer could not be extracted here (no PDF tools), so paras 120, 148, 169, 178 were not re-read. Values, quotes, pages and retrieval date (2026-11-03) are identical to the previous model rows. | | Someone with a PDF reader ticks the four paragraphs. | none |

## Re-pointing check
- adv_people_affected_per_year: same arithmetic (11,777,381 / 17 x 1.19 = about 824,000), same values.
- adv_prevalence_cut (0.025/0.08/0.092), adv_dalys_per_smoker (1.5/3/6), adv_years_until_health (30/40/50), adv share of campaign (0.1/0.2/0.4), adv_years_until_effect (0.5/1/1.5), adv_evidence_adj (0.4/0.7/1): same best values and ranges as before, same meaning. Now one shared slider each, also read by Cancer Research UK.
- Credit: 0.4 x 0.125 = 0.05, equal to the old best 0.05. Range 0.0125 to 0.18 versus old 0.02 to 0.15 (product of two judgments; acceptable). At best guesses the two UK charities (25% and 12.5%) sum to 37.5%, within the 40% campaigners' share; only at both high ends could they exceed it, which is a joint-range artefact, not a best-guess breach.
- Side effects: both rows tagged `side_effect: added`, read in both credited advocacy rows as (1 + adv_side_effects), so $side_effect_weight moves them; the sum row is untagged, same as CRUK's. Signs right: second-hand smoke +9.0%, vaping -3% (0.3 x 0.1). Applied after adv_total_adj once, no double application.
- No double count with unmodelled_benefits_adj: its explainer drops second-hand smoke (about 1 point; best 8% to 7%, range shifted by 1 point) and keeps the benefit of limits on youth vaping, a different effect from substitution among those kept from smoking. See finding 1 for the evidence adjustment. adv_evidence_adj does not cover second-hand smoke.
- Minor: second-hand smoke valued with smokers' age mix (stated in the explainer; undervalues children's deaths).

## Write-up
Statements match the model: 8 points, 3 healthy years, 40 years, side effects 9% and 3%, a fifth, 40% x an eighth = a twentieth. The "Research about 86%" figure is consistent with the small result change. The unmodelled list was updated.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| uk_act_england_14_30, ages, uplift, prevalence_cut, lag | DHSC impact assessment PDF | unreachable (text not extractable) | unchanged from prior verified rows |
| smoking_dalys_gbr, shs_dalys_gbr | OWID grapher | unreachable (JS table, CSV 403) | ratio 9.0% consistent |

## Drivers
share_burden_averted_per_research_year (judgment), missing_data_discount (judgment), discount_rate (judgment), years_brought_forward (judgment), @next_dollar (estimate). The change touches none of the top drivers; the policy branch is about 9% of the result.

Verdict: pass

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
