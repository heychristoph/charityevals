# Audit: 1day-sooner-charityevals, round 3 (verification)

| # | Check | Result |
|---|---|---|
| a | `pol_relative_cut` explainer says about 0.005%; audit-model computes 5.150e-5 (0.00515%) | correct |
| b | `hepatitis_c_*` death_ages rows (4 share rows) carry the note that only shares are used; 488,708 (GHE 2023) and 239,000 (WHO fact sheet, used by `hcv_deaths_per_year`) match the row notes and the model | correct, no error introduced |
| c | Anything else changed in the model since round 2 | no: the diff is the one explainer; the round-2 model content hashes to the r2 sha |
| d | Lint (audit-model) | 1 low (spread across joint ranges, already stated in the summary); unchanged |

Verdict: pass
Model-sha: c921e995b740760a13337c9270732d3e91c8d0662fd50ffea91a040fa0d69ee3
