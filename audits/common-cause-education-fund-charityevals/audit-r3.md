# Audit: common-cause-education-fund-charityevals, round 3 (scoped: movement figures read from shared facts)

Result: 0.0225563 years of healthy life per $1,000, unchanged from round 2 (0.0226). Verdict: pass.
Model-sha: 7f095778df399ac1f5102d1b29de98d11b78e3844332dd72c8a7396fbc8e993b
Rules: 0.3.4
Scope: scoped verification; only that eight rows now read shared facts in facts/democracy.json instead of holding their own values.
Mechanical: audit-model findings (0); `npx tsx scripts/headlines.ts` gives 0.0225563 for this model (Brennan Center 0.0701159).

## Checks
Each row's formula is now `@democracy.<fact>`; the fact's value (point or low/best/high) was compared programmatically with the row's value in `git show main:` and is identical in every case; the facts keep the old rows' source URLs and quotes.

| Row | Reads | Value (old = fact) |
|---|---|---|
| maps_people_strong | @democracy.redistricting_people_strong | 55,389,268 |
| maps_people_weak | @democracy.redistricting_people_weak | 23,702,457 |
| maps_window_years | @democracy.redistricting_window_years | 18 |
| maps_gain_share | @democracy.redistricting_gain_share | 0.002 / 0.01 / 0.04 |
| maps_movement_resources | @democracy.redistricting_movement_resources | 12M / 22M / 45M |
| maps_weak_delivery | @democracy.redistricting_weak_delivery | 0.1 / 0.3 / 0.6 |
| maps_evidence_adj | @democracy.redistricting_evidence_adj | 0.3 / 0.6 / 0.9 |
| oth_relative_effect | @democracy.other_reform_relative_effect | 0.05 / 0.25 / 1 |

The result is unchanged at 0.0225563, as required. The same facts are read by the Brennan Center model's reform branch (one consistent way).

Verdict: pass

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 8befb8ad.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 4 rows changed, against cc9a04dd.
