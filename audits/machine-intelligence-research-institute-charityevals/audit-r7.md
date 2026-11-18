# Audit: machine-intelligence-research-institute-charityevals, round 7 (scoped: merged pandemic death-age rule and funging = 1)
Result: 7.327e-5 daly/$ = 0.0733 years of healthy life per 1,000 dollars (combined range 0.0003–17.7); cause median 0.958 (×0.077). Verdict: pass.
Model-sha: 12bad0689e59a3fd0ce11b4b0a6bb7a864f8fb18b5ec2dc1e66a5ce187e04825
Rules: 0.3.5
Scope: unchanged from round 4. Checks only that both merged changes are present together and consistent: (a) rows bio_covid_scale_share, covid_scale_deaths_averted, covid_value_per_death and uov_bridged (round 5); (b) leverage_funging_adj 1 with the explainer naming the next-dollar room factor (round 6).
Mechanical: lint no high or medium (lows: ranges on small-catastrophe rows, unused pol_/fb_cost_share, far-below confirmed by the summary's reason), invariants none, normalization-audit none (all checks 0 violations; generated restored), scripts/check.ts passes, simulation-check stable (5% 0.065, 95% 9.18 × best guess; single events miss 0%).
Previous round: rounds 5 and 6 had no open findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | audit-r6.md | A "Numbered 5 on its branch; renumbered at merge" note was misleading after the merge. | audit-r6.md | Removed. | none |

## Consistency of the two changes
- The four COVID-scale rows match .claude/skills/build-cea/templates/catastrophic-risk.json (formulas compared row by row); uov_bridged splits deaths_averted into the COVID-scale part (covid_value_per_death, @death_ages.covid_scale_*) and the rest (value_per_death, world mix). bio_cost_share is 0, so the COVID-scale part is 0 and the result is unchanged by (a).
- leverage_funging_adj is 1 (0.85–1.05); its explainer says the room factor of @next_dollar.machine_intelligence_research_institute already asks the funging question. The next-dollar row (room 0.5 × use 0.7 × run 1.0 = 35%) names the same funders (reserves tripled, two donors of $12.9M). Funging is asked once: no double count. The two changes touch different rows and do not interact.

## Numbers checked against headlines.ts (0.0732721)
- Summary: 0.07, "0.0003 to 18" (0.000303–17.73), "about 320 times below NTI" (23.39 / 0.07327 = 319), under a tenth of the 0.958 median (0.077): match. Write-up: headline 0.073 (live), 0.0003 to 18, chance 0.009–0.49, 0.1% discount about 1.5, funging 1, next dollar 35%: match.
- INV-15: below a tenth of the median, the summary states the reason (all work against misaligned AI, for which the typical project cuts survivable-catastrophe deaths far less than misuse work does; matches the AI cuts in facts/catastrophe.json). Not over 10x. Pass.

## Sources checked
None re-fetched; no new or changed facts.

## Drivers
AI catastrophe chance, extinction cut per dollar, discount rate, years a cut counts, missing-data discount. Unchanged.

Verdict: pass

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against e8ecb2b3.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against 7dbeec92.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against ca214e5f.

Re-stamped (17 Nov 2026): credit rule 2.24: fb_credit_share is the skeleton's row (unused here, or wording only): no value change. Mechanical: headline unchanged, 1 row changed, against 2b24b73c.
