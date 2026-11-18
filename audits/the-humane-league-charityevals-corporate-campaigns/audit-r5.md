# Verification round (scoped)
Result: 3.213 ced/$ = 0.000353451 years of healthy life per $1,000 (was 0.000350880). Verdict: **pass**
Model-sha: 10800bc0f86924c96a30df4dca0d463e0728f3582420333c8a82af225489acac
Rules: 0.3.0
Scope: the stock deduction (member_switches_in_count replaces owaacc_hens), uk_switches_in_count read from facts/the_humane_league.json, the new facts file, the write-up's double-counting bullet and summary.
Mechanical: audit-model 0 findings; scripts/check.ts "all models valid".

## Checked, resolved
- No row or formula in this model still uses the five removed rows (owaacc_rewe_hens, owaacc_rewe_progress, owaacc_wins, owaacc_hens_per_other_win, owaacc_hens); grep finds none.
- Same figure as the other-programmes model: both read @the_humane_league.member_switches_in_count and @the_humane_league.uk_switches_in_count (that model's vol_outcome deducts vol_member_switches_in_count and uk_switches_in_count), so the pooled hens are 7.5M less the same two figures in both and no hen is credited twice. The other-programmes and grants models keep their own owaacc_* rows for the Alliance's accountability wins; that is their branch, not this pool.
- Arithmetic: the pool is 7.5M - 0.4M - 1.6M = 5.5M (r4: 5.46M); the result scales with the pool: 0.000350880 x 5.5/5.46 = 0.000353451, as printed. Write-up and model summary say 5.5M, 0.4M, 1.6M; no comparison with other charities, medians or peers.
- facts/the_humane_league.json: member 0.5/1.6/3.5M and UK 0.1/0.4/1.85M match the former values; the UK high end (82.7% - 78.6% of ~45M = 1.85M) checks. The explainers are consistent with the former rows. ACE's figures (113.9M abroad vs 135.5M US; 2.55M UK) were not re-fetched (unchanged judgment, sources verified in rounds 1-3).

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | battery_share explainer | Still reads "the hens taken out above (THL UK's and REWE's) are nearly all in enriched cages", but the deduction is now the Alliance members' switches, not REWE. | Reword to "the hens taken out above (THL UK's and the Alliance members') ..." |
| 2 | low | the_humane_league.member_switches_in_count | Explainer says "best guess about a fifth of the 7.5 million" while the best is 1.6M (21%); fine, but the unrelated owaacc rows in the sister models also sit near 1.6M by construction. | Optional: say "about a fifth (1.6 million)". |
Re-stamped (15 Nov 2026): this round's low findings fixed in explainers, write-ups and the egg-share fact's wording; no value changed.

Re-stamped (16 Nov 2026): pre-audit cleanup: shared facts read (US layers, preemption chance, market leakage, evaluator side effects), reference classes named, ranges widened where evidence is thin; headline unchanged. Mechanical: headline unchanged, against 9d3d36e4.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1b0eb29e.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against 32b69cd7.
