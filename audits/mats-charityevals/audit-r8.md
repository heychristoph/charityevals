# Audit: mats-charityevals, round 8 (scoped verification)
Result: 3.066 years of healthy life per $1,000. Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 34b239bf0c16035da553261d1fbc6a8e05687c070c6ba13fb730aad8eaefdca9
Rules: 0.3.13
Scope: the previous round's findings only (rules never-started-weight, lives-added, never-started-prose and never-started-branches). No source or scope re-audit.
Preflight: passes
Previous round: round 7, fix needed: slider named as 3% beside the shared 5%.

## Checks
- Resolved: writeups/mats-charityevals.md line 16 now reads "You can move the 5% with a slider."; the slider default is 0.05; no 3% remains. Headline unchanged (3.06648, same Model-sha as round 7).
- Biggest uncertainties states no numeric result figures (many-fold, several-fold, little); nothing to recompute.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
