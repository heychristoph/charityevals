# Audit: campaign-for-tobacco-free-kids-charityevals, round 7 (verification of the compliance-cost rule 2.21, text fixes of round 6)
Result: 1.350e-4 daly/$ = 0.1350 years of healthy life per 1,000 dollars (unchanged from round 6). Verdict: pass.
Verdict: pass
Model-sha: 2536876e6f44363ee8f782e36fd0ef36be89e10b5c2d138e0c567729de056e5e

Scope: scoped verification of the compliance-cost lines on `us_share_burden_averted`, `glob_share_burden_averted`, `ghai_share_burden_averted`. No formula changed.

Mechanical: `audit-model.ts` exit 0, 0 findings. normalization-audit, simulation-check not run (caller runs them).

Previous round: round 6 finding 1 (lines for the other two branches) fixed; 2 (absolute wording) still open, low; 3 (peer comparison in summary) still open, low.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | "is above the median of the site's global-health models" compares with peers (owner rule); repeated from round 6 finding 3. | Summary text. | Delete the clause, keep "because tobacco kills about 1.6 million people a year ...". | none |
| 2 | low | presentation | `us_`, `glob_`, `ghai_share_burden_averted` | "no impact analysis covers" is absolute (a country's tobacco-packaging or flavour rule may have one). | Explainers. | Add "of the year's wins" or "none used" as in the rule's wording. | none |

Checks:
- Each branch's explainer now has one line saying what the wins are (taxes, transfers; labelling, smoke-free, advertising rules) and that no cost is counted; the US line is limited to the US wins, the others name their own. Tax rises are transfers (rule 2.21). Reads consistent with the rows; no value or formula touched.

## Sources checked
None in scope (no regulator figure read by the changed text).

## Drivers
Unchanged: text-only fixes.

Verdict: pass
Model-sha: 2536876e6f44363ee8f782e36fd0ef36be89e10b5c2d138e0c567729de056e5e
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.
Re-stamped (15 Nov 2026): side-effect tags (2.16, mechanical; headline unchanged)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against b10cf49b.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against cc9a04dd.
