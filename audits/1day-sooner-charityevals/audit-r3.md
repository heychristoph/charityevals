# Audit: 1day-sooner-charityevals, round 3 (verification)

| # | Check | Result |
|---|---|---|
| a | `pol_relative_cut` explainer says about 0.005%; audit-model computes 5.150e-5 (0.00515%) | correct |
| b | `hepatitis_c_*` death_ages rows (4 share rows) carry the note that only shares are used; 488,708 (GHE 2023) and 239,000 (WHO fact sheet, used by `hcv_deaths_per_year`) match the row notes and the model | correct, no error introduced |
| c | Anything else changed in the model since round 2 | no: the diff is the one explainer; the round-2 model content hashes to the r2 sha |
| d | Lint (audit-model) | 1 low (spread across joint ranges, already stated in the summary); unchanged |

Verdict: pass
Model-sha: e59fab663d76134026b7a5f284af3ee02be78b4599ce3e3023fcd8559ab5d181

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): Unused field-building adjustments fixed at 1 (fb_people 0); headline unchanged. Mechanical: headline unchanged, 1 row changed, against ee138d3d.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 8904b83b.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against e8ecb2b3.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.
