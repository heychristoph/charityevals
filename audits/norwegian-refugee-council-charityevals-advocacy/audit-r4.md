# Audit: norwegian-refugee-council-charityevals-advocacy, round 4 (verification)
Result: 2.641e-5 uov/$ = 0.0132 years of healthy life per 1,000 dollars (combined range 0.00078–0.225); cause median 0.104 (×0.127). Verdict: pass.
Scope: only the shared change of docs/normalization.md 2.20 and facts/aid_value.json as it reaches this model: aid_counterfactual_vs_nrc, aid_mix_vs_nrc and aid_vs_nrc removed; aid_value_per_dollar = @aid_value.humanitarian_vs_cash × @cash.uov_per_dollar (was #norwegian-refugee-council-charityevals × aid_vs_nrc ≈ 1.1); the summary.
Mechanical: audit-model lint 0 high / 0 medium / 1 low (spread, stated in the summary), invariants none; check.ts "all models valid"; normalization-audit not re-run (0 violations reported by the caller). The summary's 0.013 and combined range 0.001–0.23 match audit-model (0.01321; 0.00078–0.225).

Previous round: no open findings (round 3 passed with none).

Checks:
- The fact's derivation reproduced with a tsx script (buildLibrary/assumptionValues/headline, default sliders): the 17 models with template humanitarian-relief and owner charityevals, headline with $missing_data_discount = 1, /1000 × $uov_per_daly (2) / 0.00335: range 0.049–0.837, median 0.206 before the step (the fact says 0.05–0.84, median 0.21); at the default 0.5, 0.025–0.418, median 0.122 (the fact says 0.02–0.42, 0.12). Best 0.2 sits on the median, low 0.05 / high 0.8 on the ends. Script: /private/tmp/claude-501/-Users-christoph-repos-charityevals/bb44fb39-21b4-46d5-b849-26e1d7a49e7d/scratchpad/aidvalue/audit-nrcadv/recompute.ts
- Rule application: the appeals' money funds every kind of relief and the destination is unknown, so the shared figure is the right one under 2.20 (not NRC's programmes, not oda_vs_cash). Both branches (fund_value_per_year, value_per_unit_year) read the single row aid_value_per_dollar, so the funding/access split (97%/3%) is unchanged. The row reads the fact and @cash.uov_per_dollar, so both sliders and the fact's range reach the model (humanitarian_vs_cash is the tornado's second input). No retyped multiple.
- Leftover text: none of aid_vs_nrc, aid_counterfactual_vs_nrc, aid_mix_vs_nrc or "NRC's programmes" remains in the model JSON or any formula; no writeup exists for this model. The cause-wide references to the old figure in other models are outside this scope.
- Summary: "about a fifth of cash" (0.2), "the site's relief models before their missing-data step" and the 97%/3% split match; 0.013 and 0.001–0.23 match.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | "a seventh of the site's global-health median" is a little off: the result is ×0.127 of the median 0.104, closer to an eighth (1/7.9) than a seventh (0.143). | audit-model: "median of 71 global-health models: 0.1042 (this model ×0.1267)" | Say "an eighth of the site's global-health median". | none |

Verdict: pass
Model-sha: 0d81de26ea14b647b82f5f4c8a94a612597fa10f3bf14232c17fe6682c416450
