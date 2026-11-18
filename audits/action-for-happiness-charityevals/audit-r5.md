# Audit: action-for-happiness-charityevals, round 5 (verification)

Result: 0.1169 years of healthy life per $1,000 (0.001791 wellby/$), unchanged from round 4; the r4 low finding is fixed.
Verdict: pass
Model-sha: 7140f9474fa7a9fdf57e6a5e3e21628acb533a800ce99184bc97f1fd831e5884
Rules: 0.2.0

| # | Check | Outcome |
|---|---|---|
| a | `digital_evidence_adj` explainer states internal about 0.7, external about 0.7 (with how the external figure is reached) and "internal 0.7 × external 0.7 ≈ 0.5", matching the row's best 0.5 (0.3-0.8) | pass |
| b | `audit-model.ts`: bottom line 0.001791 wellby/$ = 0.1169 years per $1,000; only finding is the expected LOW estimate-basis (past_average) note | pass |
| c | `git diff --stat` (4 files) and `git diff models/`: changes in the model are the round-3 fixes (beneficiary weights, beneficiaries_note, summary 0.14 to 0.12, program_spend explainer "unlike most" removed, digital_evidence_adj value 0.6 to 0.5 and range 0.3-0.8) plus the r4 explainer rewording. No other digital_evidence_adj field (source, quote, kind, format) changed; no numeric value differs from the r3/r4 stated state | pass |

No findings.

Re-stamped (16 Nov 2026): Preflight cleanup: a typed figure now read from its shared fact at the same value (@depression.suicide_rr_with_depression, @meta.fundraiser_side_effects_share, @irap.years_gain_lasts); labels and explainers reworded. Mechanical: headline unchanged, against abfc2f3a.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against a8d130f3.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against d150f0b2.
