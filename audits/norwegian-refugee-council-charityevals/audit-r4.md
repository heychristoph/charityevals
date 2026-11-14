# Audit: norwegian-refugee-council-charityevals, round 4 (verification)
Result: 2.039e-4 daly/$ = 0.2039 years of healthy life per 1,000 dollars (combined range 0.051–0.81). Verdict: pass.
Scope: verification of the shared-aid-value change only: nor_aid_vs_cash now `@aid_value.humanitarian_vs_cash` (was a judgment 0.25, 0.08-0.8), facts/aid_value.json (humanitarian_vs_cash), section 2.20 of docs/normalization.md, and the write-up's NORCAP paragraph and "How this model was checked".
Mechanical: lint 0 findings; invariants none; check.ts "all models valid"; simulation-check 5% 0.528 / 50% 1 / 95% 1.99 × best guess (stable); normalization-audit not re-run (0 violations reported by the caller).
Previous round: round 3's low #1 (write-up "0.25" then "0.20") was already fixed in round 3's text and the paragraph now reads consistently.

Derivation recomputed (tsx script on buildLibrary/headline/assumptionValues): for the 17 models with template humanitarian-relief and owner charityevals, headline with $missing_data_discount = 1, /1000 × $uov_per_daly (2) / @cash.uov_per_dollar (0.00335) gives 0.049–0.837 × cash, median 0.206 (brief: 0.05–0.84, median 0.21). With the step at its default 0.1: 0.025–0.418, median 0.122 (brief: 0.02–0.42, median 0.12). The fact's 0.2 (0.05–0.8) matches the anchor. NRC's own model is one of the 17 (0.201 before the step), but the fact is a typed constant, not a live read, so there is no loop: changing NRC's model does not move the fact or itself. The anchor is a documentation figure refreshed by hand, not a dependency.

Rule application: NORCAP's dollar is aid whose use is unknown (host agencies' response, coordination, protection, climate, peace, elections), so the humanitarian figure × `@cash.uov_per_dollar` is right under 2.20; the row `nor_value_per_dollar` still multiplies by cash. The fact is "before the missing-data step" and this branch applies its own missing-data step once, so no double discount. Result 0.2044 → 0.2039 (-0.2%), as 2.20 and the write-up say. The row is now a formula with no own range; its 0.05–0.8 comes from the fact, and the combined range (0.051–0.81) is essentially unchanged.

Text agreement: write-up NORCAP paragraph (0.2 times cash), "How this model was checked" (0.25 → 0.2; the result stays 0.20), the model summary (no NORCAP multiple quoted) and the row explainer all match the model and `check.ts`/`audit-model.ts` (0.2039).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | writeup "How this model was checked" | The last sentence ("as in every model that values aid; the result stays 0.20, with a verification round") is a changelog line in a paragraph that already narrates earlier rounds; it adds text, not understanding. | Write-up, last paragraph. | Cut the "November 2026: ..." sentence, or shorten it to "NORCAP's dollar takes the site's shared humanitarian figure (0.2 times cash)." | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| aid_value.humanitarian_vs_cash | facts/aid_value.json (anchor: the 17 relief models) | verified | Range and median recomputed from the library at the defaults; judgment ranged 0.05-0.8 naming its anchor. |

## Drivers
Unchanged from round 3: $uov_per_daly, $missing_data_discount, $discount_rate, baseline consumption, and the education earnings and persistence judgments; NORCAP's value per dollar is no longer in the top 12 of the tornado, and the shared fact carries its range.

Verdict: pass
Model-sha: 74bd9181c7825153e2ae38e77d6c33ed09a44a7e034faee026425a1ec643a6b6
