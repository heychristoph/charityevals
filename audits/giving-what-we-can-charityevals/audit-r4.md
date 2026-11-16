# Audit: giving-what-we-can-charityevals, round 4 (scoped verification)
Result: 0.1123 uov/$ = 56.17 years of healthy life per 1,000 dollars (combined range 10.9–289.7; joint low–high of the model's own ranges 27.2–105.0); cause median 0.06841 (×821). Verdict: pass.
Model-sha: 21ff39becbfcc0f9eeaa573261f09e9fa372cf95649e4b975a7e75447f8447cd
Scope: unchanged from rounds 1 to 3. Scoped verification round: only the change since round 3 (the catastrophic-risk part of `value_destinations`: hand-typed `avg(#charityevals:center-for-ai-safety, #charityevals:far-ai, #charityevals:machine-intelligence-research-institute, #charityevals:nuclear-threat-initiative)` replaced by `#cause:catastrophic-risk`, normalization.md 2.8 "November 2026: a cause's average, read live"; the explainer, summary and write-up that follow from it). No source changed, so none re-fetched.
Mechanical: invariants none (check.ts "all models valid"; scripts/normalization-audit.ts on the full library: INV-18 and every other invariant 0 violations for this model); lint none. `scripts/audit-model.ts` prints one "high" INV-18 finding (NaN → NaN), a false positive of the script, not of the model (finding 1).
Previous round: r3 had no findings; r2's one low (effective-share fact typed from the model's own defaults) is unchanged, still accepted.

Verification of the change:

1. Rule. normalization.md 2.8 "Its own split": a recipient without a model is valued at its cause's modelled average within the split, or, when none of the cause's recipients is modelled, at the cause's charities on the rankings with equal weights (`#cause:x`). GWWC's $11.5M catastrophic-risk money goes to the Long-Term Future Fund, Longview and its Risks and Resilience Fund, none of which has a model here, so `#cause:catastrophic-risk` is the right reference and the old four-model list (4 of 12 ranked) was the stale hand-typed list the rule replaces. The reader (giving-what-we-can) is not in that cause, and money movers (beneficiaries "destinations", e.g. 80,000 Hours) are left out, so nothing reads itself. `isDestinationMix` still holds (a `#cause:` reference is a live result, no typed value per dollar). The weight `gwwc_high_impact_2023_24_gcr` is unchanged and still in the denominator once. The 82% non-placed share, the global-health and animal terms are untouched.
2. Number. Headline 54.67 → 56.17 (scripts/headlines.ts 56.1669; audit-model 56.17; summary "about 56"); the move is the catastrophic-risk term only (four-charity mean to the 12-charity mean, about 9.06 healthy years per $1,000). normalization.md's table (54.7 → 56.2) agrees.
3. Text. Explainer of `value_destinations` names the three recipients, says none has a model and that the catastrophic-risk charities on the rankings are used at equal weights (#cause:catastrophic-risk); summary says 56 and "each at its figure on the rankings"; write-up headline span reads the model and its static text says 56 (it reads the live figure); the write-up's catastrophic-risk bullet matches. No "four catastrophic-risk models", 54 or 37 remains in the model, summary, explainers or write-up. INV-15 sentence ("more than ten times its peers because it moves about nine dollars ... for each dollar it spends") still holds: 56.2 against cause median 0.0684 (×821); $34M caused over $3.9M spent is 8.7 ("about nine"), unchanged by this change; most of the destination value is still global health.
4. Claims whose numbers this change moves: only the headline (56) and the two sentences above; the biggest-uncertainties bullet on catastrophic-risk and animal giving still names the right sliders (see finding 2 for its wording).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium (tooling, not the model) | audit tooling | scripts/audit-model.ts `liveIds` | The script's live-reference closure reads `#cause:catastrophic-risk` as owner `cause`, charity `catastrophic-risk`, finds no models, so its library has no members, `#cause` is NaN and INV-18's halving check reports "NaN → NaN" as a high finding. | normalization-audit.ts (full library) INV-18: 0 violations; headlines.ts and check.ts compute 56.17 normally. | In `liveIds`, treat `cause:<x>` as every model of the charities whose `cause` or `area` is `<x>` (like `refTargets`), not as an owner:charity pair. Until then ignore this finding for any model that reads a `#cause:` reference. | none |
| 2 | low | stale wording | write-up, "Biggest uncertainties" | "The value of the catastrophic-risk and animal giving, which rests on the site's stand-in models and on the species-weight and risk sliders." Catastrophic risk is no longer a stand-in list; it is the 12 ranked charities, and animal giving is The Humane League's ranked figure. | writeups/giving-what-we-can-charityevals.md line 57. | Change to: "The value of the catastrophic-risk and animal giving, which rests on the site's models of the catastrophic-risk charities and of The Humane League and on the species-weight and risk sliders." | none |

## Sources checked
None re-fetched (no source changed). Checked against the code and docs: src/engine/ranking.ts `causeFigure`/`causeMembers`, src/engine/model.ts `modelResult`/`refTargets`, docs/normalization.md 2.8.

## Drivers
Unchanged from round 3. The catastrophic-risk term now moves with the rankings as models are added to the cause; its equal weights remain a judgment (no recipient split is published for the Long-Term Future Fund, Longview or the Risks and Resilience Fund).

Verdict: pass

Re-stamped (orchestrator, 14 Nov 2026): marginal_vs_past_average explainer's range corrected to its fact's (20–85%, raised by One for the World's build); no value changed.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): Preflight cleanup: a typed figure now read from its shared fact at the same value (@depression.suicide_rr_with_depression, @meta.fundraiser_side_effects_share, @irap.years_gain_lasts); labels and explainers reworded. Mechanical: headline 55.49 → 55.49 (+0.00068%), 9 rows changed, against e247896f.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline 55.49 → 55.49 (+2.7e-8%), against a8d130f3.
