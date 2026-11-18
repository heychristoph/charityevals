# Audit: united-way-charityevals, round 4
Result: 1.138e-5 daly/$ = 0.0114 years of healthy life per 1,000 dollars (combined range 0.0016–0.082); cause median 0.117 (×0.097). Verdict: pass.
Model-sha: 6c995599e4ae79d09ac7f3edabeeea75a9e3db192692f067bf51cd92efc9eb64
Rules: 0.3.5
Scope: verification of the changes in 646c0f7e only; not a full re-audit.
Mechanical: lint 0 high / 1 medium (far-below, judged right in kind in rounds 1-3) / 0 low (audit-model.ts); check.ts: all models valid; simulation-check.ts: stable (5% 0.53x, 50% 1x, 95% 2.25x); normalization-audit not run (not asked, and no shared row changed).
Previous round: all four resolved. 1 (`mentoring_cost`): resolved. The explainer now anchors on WSIPP program 765 (cash only, $1,675 in 2016 dollars, about $2,250 in 2025 prices), says program 766's $4,399 adds about 68 volunteer hours at $39.99 that `mentoring_volunteer_hours` counts separately, and gives Alfonso's costs as marginal, from 2008-2015 records. The row is $2,700 (1,500–4,000), as asked. The result moved 0.01130 to 0.01138, as round 3 predicted. 2 (discount-rate figure): resolved. The write-up says "0.0075 at 8%"; the tornado gives 0.007512. 3 (three stale explainers): resolved. `clients_vs_poorest_fifth`, `bn_evidence_adj` and `consumption_mean` name `bn_consumption_share` for basic needs and 211. 4 (`early_cost` source): resolved. It cites the report linked from the NIEER landing page and The 74's quote of the $8,856.

Write-up figures against the live model: headline 0.011 (0.01138) matches. Branch shares of the result are 20.2 / 46.2 / 24.9 / 5.7 / 3.0%, the write-up's 20/46/25/6/3. Within services, children / financial / health are 75.3 / 17.4 / 7.3% (the write-up's 75/18/7, rounded so they sum to 100). Mentoring cost "about $2,700" matches the row. "What drives the result" against the tornado: missing data 0.002–0.023, discount 0.0075 at 8% and 0.024 at 0.1%, financial gain 0.010–0.017, earnings per SD 0.008–0.013, after-school 0.010–0.014, children's share 0.009–0.013. All match.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No findings | - | - | - |

Verdict: pass.

Re-stamped (16 Nov 2026): Pre-audit cleanup (16 Nov 2026): shared figures read from facts at the same values (@myanmar.household_consumption_share_of_gdp, @survey_consumption.disaster_affected_share_of_survey_mean, @volunteering.disaster_volunteer_ls_gain_year); judgments' reference classes named from sources; volunteer-hours labels name the charity. Values unchanged. Mechanical: headline unchanged, against 0b12c4f1.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2b370f40.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.
