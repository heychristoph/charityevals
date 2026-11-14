# Audit: 1day-sooner-charityevals, round 3 (verification)

| # | Check | Result |
|---|---|---|
| a | `pol_relative_cut` explainer says about 0.005%; audit-model computes 5.150e-5 (0.00515%) | correct |
| b | `hepatitis_c_*` death_ages rows (4 share rows) carry the note that only shares are used; 488,708 (GHE 2023) and 239,000 (WHO fact sheet, used by `hcv_deaths_per_year`) match the row notes and the model | correct, no error introduced |
| c | Anything else changed in the model since round 2 | no: the diff is the one explainer; the round-2 model content hashes to the r2 sha |
| d | Lint (audit-model) | 1 low (spread across joint ranges, already stated in the summary); unchanged |

Verdict: pass
Model-sha: 8999ad677f10ec1652774a64bdb7fd008ccbcbec373c47cd28f08251ea99fabf

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.
