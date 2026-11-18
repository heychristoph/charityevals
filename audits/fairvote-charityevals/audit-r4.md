# Audit: fairvote-charityevals, round 4
Result: 2.264e-5 daly/$ = 0.0226 years of healthy life per 1,000 dollars (combined range 0.0014–0.38); cause median 0.0693 (×0.33). Verdict: pass.
Model-sha: 208440ad74865e48bda5fba6b335b93fb35bc870904d60ba512fd6e272f594af
Rules: 0.3.4
Scope: scoped verification of commit 61b6097 only (the answer to round 3's 3 low findings): facts/democracy.json (rcv_local_coverage, rcv_state_federal_coverage, us_pr_movement_resources_per_year, local_offices_weight explainer), the model's rcv_implementation_adj and the explainers that state its numbers, charities/fairvote.json summary, the write-up. Everything else as in rounds 1-3.
Mechanical: audit-model lint 0 findings; invariants none; check.ts "all models valid" (this and protect-democracy-charityevals); simulation-check stable (5% 0.155×, 50% 1.00×, 95% 5.46× the best guess); normalization-audit not re-run (no row of the kinds it checks changed; scoped round). No script wrote generated/ (working tree clean). Result moved from 0.0230 to 0.0226 (-1.6%), no move above 2×.
Previous round (r3):
1. rcv_offices_share "about 0.45" against the note's own 0.436 (low): **resolved.** The fact is split. Recomputed from the note's weights over 14.45M people added (8.3 + 2.0 + 0.65 + 1.4 + 0.7 + 1.4 = 14.45): local part (8.3 × 0.9 + 2.0 × 1 + 0.65 × 0.5) / 14.45 = 9.795 / 14.45 = 0.678 (best 0.68); state and federal part (1.4 × 0.5 + 0.7 × 0.9 + 1.4 × 0.05) / 14.45 = 1.40 / 14.45 = 0.0969 (best 0.097). Portland, Oregon is now listed apart from "the other cities and counties (about 2.0 million)", so the overlap is gone. Ranges 0.55-0.80 (±0.12) and 0.06-0.15 are consistent.
2. local_offices_weight read only by the PR branch (low): **resolved.** `rcv_implementation_adj = @democracy.rcv_local_coverage * @democracy.local_offices_weight + @democracy.rcv_state_federal_coverage` = 0.68 × 0.5 + 0.097 = 0.437 (computed; 0.436 from the unrounded parts), so a change of local_offices_weight now moves both branches. No other model or fact reads the removed rcv_offices_share (grep over models, facts, charities, writeups, src: none).
3. Charter Commission's $0.3M unsourced (low): **resolved as a labelled judgment** (finding 1 below). The note now shows its computation: 20 × 78 weeks × 10 hours × $35 = $546,000 (recomputed), staff and consultants judged $1.5M, about $2.05M / 10 years = $0.2M a year; parts $0.9M + $0.8M + $1.5M + $0.2M = $3.4M (FairVote $4.7M × 20% = $0.94M; Protect Democracy $0.8M; the 1.7M "other" = 1.5 + 0.2). Best 3,400,000 in the fact matches. A search of the City of Portland's pages found no commission budget line either, as the note says.

## Formulas and stated numbers (all checked)
- Computed values: rcv_implementation_adj 0.437, pr_implementation_adj 0.41, pr_spend_share 0.2, rcv_spend_share 0.8, pr_attribution_share 0.3768, uov rcv 490.1 / pr 137.6.
- Without pr_uov the result is 0.01767, so proportional representation is 21.9% and ranked-choice voting 78.1%: "about four fifths" (summary, write-up) and "about a fifth" match.
- Summary and write-up: $3.4 million (movement), 44% of a full switch (0.437), 1.4 million, 103,000, $19 million, 2% and 5%, 42% next dollar unchanged; result 0.0226 reads "about 0.02", ×0.33 reads "about a third of the median". Match.
- Explainers: pr_attribution (cost_total × share / $3.4M) "about 38%" = 0.377 (1.3M / 3.4M); rcv_implementation_adj "about 44%", 68%, 50%, 10% (0.097) match the facts; rcv_local_coverage explainer "68% ... (55% to 80%) ... about 44%" and rcv_state_federal "about 10% (6% to 15%)" match; us_pr_movement_resources explainer $3.4M, $2M-$7M match.
- No stale 3.5 million, 37%, 45% (RCV share) or rcv_offices_share remains in models, facts, charities or write-ups.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | @democracy.us_pr_movement_resources_per_year | The commissioners' time uses 78 weeks, 10 hours a week and $35 an hour, none cited; the commissioners' terms ran 3 December 2020 to 3 December 2022 (104 weeks), and the $1.5M for staff and consultants is a pure judgment. The commission's budget was not found, so the label "our judgment" is honest; the pieces are still unanchored. | portland.gov Charter Commission pages (terms); fact note. | Say why 78 of 104 weeks (active months) or take the adopted-budget line from the FY 2021-22 city budget when found. | none: Charter Commission is $0.2M of $3.4M; the 2-7M range covers it |
| 2 | low | normalization | @democracy.rcv_local_coverage | The New York City weight 0.9 ("about 0.9 of its own elections", primaries and special elections decisive in a one-party city) is a judgment with no figure for the share of city races decided in primaries; it carries 7.5 of the 9.8 numerator points. | Fact note. | Cite the share of NYC city offices won by the primary winner (Board of Elections results 2021 and 2025) to anchor 0.9. | the local part moves about ±0.05 for NYC at 0.8-1.0, about ±0.03 on the result |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| @democracy.rcv_local_coverage, rcv_state_federal_coverage | https://fairvote.org/our-reforms/ranked-choice-voting-information/ | quote verified in round 2; weights are judgments | arithmetic recomputed here |
| @democracy.us_pr_movement_resources_per_year | ProPublica Form 990s (FairVote, Protect Democracy) | verified in earlier rounds | figures unchanged; parts recomputed |

## Drivers
Unchanged from round 3. No finding above low.

Verdict: pass (0 high, 0 medium, 2 low).

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 3 rows changed, against cc9a04dd.
