# Audit: st-jude-charityevals, round 3
Result: 7.206e-6 uov/$ = 0.003603 years of healthy life per 1,000 dollars (combined range 0.00047–0.0276); cause median 0.1085 (×0.033). Verdict: pass.
Model-sha: 062f901bc40ff8a908305830c680f1e38aec615d7f3d4cae4c9d152da7c469d0
Rules: 0.3.5
Scope: scoped verification of commit a1555789 (the two deleted rows and the three reworded explainers) and round 2's items. Scope of the model itself (FY2025, all programmes) unchanged since round 1 and not re-audited.
Mechanical: lint 0 high / 1 medium (`far-below`, explained in round 1 #3, unchanged) / 1 low (`spread`, the summary states it); the two `unused` lows of round 2 are gone. Invariants: none. `scripts/check.ts st-jude-charityevals`: all models valid. normalization-audit and simulation-check not re-run (no shared-figure conversion touched). generated/ untouched (git status clean).
Previous round: round 2's three lows (#13, #14, #15) all resolved (table below); no new findings.

## Round 2 items
| # | R2 sev | Status | Check |
|---|---|---|---|
| 13 | low | resolved | `internal_validity_adj` now cites only Deeks 2003 (concurrent non-randomised comparisons) and says the review gives no average size of the bias, so the value is a judgment inside that class. `gl_evidence_adj` says Sacks gives rates of positive findings (79% against 20%), not the size of the overstatement, so 0.6 is a judgment inside that class. Both as proposed. |
| 14 | low | resolved | `hospital_total_expenses` and `research_expenses` deleted. No reference to either id remains in this model or `writeups/st-jude-charityevals.md` (grep). `hospital_et_expenses` keeps its derivation in explainer and `source.note`. The `unused` lows are gone from the lint. |
| 15 | low | resolved | `us_attribution_share` explainer now says both sides are the same cost of St. Jude's care split by who paid it, so neither takes `hospital_indirect_uplift`. That is the second of round 2's two allowed fixes and the reasoning holds: `us_program_spend` and `patient_care_expenses` are both St. Jude's own cost of care, insurers' payments being the remainder of the latter. |

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Checks of the changed rows
- Deleted rows: no formula, `source.note` or explainer references either id; the model loads, `check.ts` passes, and the result is unchanged at 7.206e-6 uov/$ = 0.003603 (care 0.00360).
- Reworded explainers: values and ranges unchanged (0.6 with 0.3–1.0 for `internal_validity_adj`; 0.6 with 0.3–0.9 for `gl_evidence_adj`). The wording now matches what each source supports.

## Sources checked
Not re-fetched this round (no number, URL or quote changed in this model; the Sacks citation was only narrowed to `gl_evidence_adj`). Round 2's open items stand: Ward 2019 and Sacks 1982 unreachable from here, Deeks 2003 cited only for the general claim.

## Drivers
Unchanged: the shared missing-data discount, `gl_mortality_reduction`, `gl_local_cost_per_child_2018`, `gl_evidence_adj`, `daly_per_child_death`. The most useful remaining improvement is a published outcome series across St. Jude Global sites.

Re-stamped (16 Nov 2026): Preflight cleanup: judgments' explainers name their reference class (or say plainly there is none); labels and unit labels say what the rows are; no value changed. Mechanical: headline unchanged, against migrate/data-model.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 480880ba.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against 32b69cd7.
