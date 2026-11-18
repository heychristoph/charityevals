# Audit: union-of-concerned-scientists-charityevals-food, round 5 (verification of the compliance-cost rule 2.21, text fixes of round 4)
Result: 5.069e-7 uov/$ = 2.534e-4 years of healthy life per 1,000 dollars (unchanged from round 4). Verdict: pass.
Verdict: pass
Model-sha: 9273f82fc881928f50a87e71dadd479a1e676647307df8dd32896432a5809482
Rules: 0.3.2

Scope: scoped verification of the compliance-cost sentence on `wetland_flood_damage_study`.

Mechanical: `audit-model.ts` exit 0; one low (spread). normalization-audit, simulation-check not run (caller runs them).

Previous round: round 4 finding 1 (wording) fixed; 2 (peer comparison in summary) still open, low.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | "It is far below its peers" compares with other charities (owner rule). | Summary text. | Delete the clause, keep the reasons. | none |

Checks:
- The sentence now matches AER-765 as read in round 4: converting farmers "would gain only minor income" and farm income as a whole falls $1.6 to 3.2 billion; "no impact analysis gives farmers' cost" is right for the 2025 case.

## Sources checked
None in scope (no regulator figure read by the changed text).

## Drivers
Unchanged: text-only fixes.

Verdict: pass
Model-sha: 9273f82fc881928f50a87e71dadd479a1e676647307df8dd32896432a5809482
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.
Re-stamped (15 Nov 2026): side-effect tags (2.16, mechanical; headline unchanged)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against b10cf49b.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7224423b.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against ca214e5f.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: typed results in the model's text made placeholders or recomputed at the 30% mobiliser share, and wrong prose placeholders corrected; no row changes. Mechanical: headline 0.0004532 → 0.000136 (−70%), 6 rows changed, against 2b24b73c.
