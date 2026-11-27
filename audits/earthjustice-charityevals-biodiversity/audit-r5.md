# Audit: earthjustice-charityevals-biodiversity, round 5 (verification of the compliance-cost rule 2.21, text fixes of round 4)
Result: 7.148e-10 daly/$ = 7.148e-7 years of healthy life per 1,000 dollars (unchanged from round 4). Verdict: pass.
Verdict: pass
Model-sha: e6d0fc6525935dd87301fd5f21d054cf672bdebf46f57e0e4ab6f34db075b00b
Rules: 0.3.13

Scope: scoped verification of the compliance-cost sentence on `tongass_acres`.

Mechanical: `audit-model.ts` exit 0; MEDIUM outlier and far-below ignored per brief (being removed), MEDIUM spread and lows predate the change. normalization-audit, simulation-check not run (caller runs them).

Previous round: round 4 finding 1 (imprecise wording) fixed.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | "far below the site's other conservation models" compares with peers (owner rule). | Summary text. | Delete the clause, keep the reasons. | none |

Checks:
- "the Forest Service's analysis of the 2023 rule finds no material change in timber sales, jobs or income, so none is counted" matches 88 FR 5252 as read in round 4.

## Sources checked
None in scope (no regulator figure read by the changed text).

## Drivers
Unchanged: text-only fixes.

Verdict: pass
Model-sha: e6d0fc6525935dd87301fd5f21d054cf672bdebf46f57e0e4ab6f34db075b00b
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.
Re-stamped (15 Nov 2026): damage beyond deaths at EPA's 0.6 in the tco2e bridge copy, read through the side-effects weight (2.5, 2.16; mechanical); summary figure updated where it changed

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1a9667aa.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against cc9a04dd.

Re-stamped (18 Nov 2026), rule never-started-weight: Lives that never start count times a slider, 0% by default (the suffering in them always counts); future generations are the first rows it weighs, so the discount rate is time preference only. Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (18 Nov 2026), rule lives-added: The people and animals a result adds: a death averted, a stillbirth averted, a year of contraception, an income raised and a future kept are read with the births parents forgo, the survivor's descendants and the animals all of them eat, by the beneficiaries' income group; nothing moves by more than 0.2% at the defaults. Mechanical: headline 3.431e-7 → 3.431e-7 (−0.012%), 6 rows changed, against the tree before the rule.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
