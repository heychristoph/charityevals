# Audit: central-square-foundation-charityevals, round 6 (scoped to the round 5 lows)
Result: 0.001757 uov/$ = 0.879 years of healthy life per 1,000 dollars. Verdict: pass (0 high, 0 medium, 0 low).
Model-sha: 9662bb14bace4a8b2faabc8e1daf376eedb0cea9e53da503df515c9397736146
Rules: 0.3.13
Scope: only the two wording fixes from round 5 and that nothing else changed.
Preflight: pass.
Previous round:
1. Low, `gov_downstream_value` explainer: **resolved**. It now reads that the districts' staff and teachers' time on the assessments and report cards "are a mobilised resource, valued only through the side effects' teacher-time harm (docs/normalization.md 2.24)", which matches the model.
2. Low, `gov_attribution_share_shared` explainer: **resolved**. It now cites annual report pp. 44-46 for CSF designing the assessments, report cards and parent materials, says the report names no co-advocate, and that the range allows for partners not named. The claim matches the pages checked in round 5. Value 0.85 (0.6-1) unchanged.

Nothing else changed: headline 0.878592, identical to round 5. The six delivery shares (fln, ece, pal, php, edo, hps) still carry `"credit": "delivery"` with the same formulas; `gov_attribution_share` is still `gov_attribution_share_shared * mobiliser_share`, class `win`.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No new findings. | Model JSON; headlines.ts. | - | none |

## Sources checked
None needed (no factual claim added; the page citation was verified in round 5).

Re-stamped (17 Nov 2026), rule credit-switch-co-funders: Credit rule 2.24, step 6: the co-funder switch counts co-funders only; the donors whose money a mover moves are mobilised (under mobiliser_share), so their new money leaves donor_cost_share. Only results with the switch on move. Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
