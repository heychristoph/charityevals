# Audit: environmental-defense-fund-charityevals-health-nature, round 5 (verification)
Result: 1.796e-6 daly/$ = 0.0018 years of healthy life per 1,000 dollars (combined range 1.0e-4 to 0.032); cause median 0.0018 (x0.97). Verdict: pass.
Verdict: pass
Model-sha: 5bd61cc6ce274bc16c1d399f9817d8e17b5c0e13e740ecb6da64c2d6fc945d94
Scope: scoped verification of the uncommitted change to the EPA 2024 soot standard branch (shared facts us_pm_naaqs_2024_*, illness in healthy years per death, pm_evidence_adj) against round 4; unchanged rows not re-audited.
Mechanical: audit-model.ts 0 findings; check.ts all models valid; summaries.ts and simulation-check.ts ran, simulation stable (5% 0.219, 95% 4.31 x best guess); normalization-audit not run (caller runs it). `git checkout -- generated` done.
Previous round: round 4 had no findings.

Checks:
- Formulas and units: pm_uov = deaths x value per death x p_success x pm_years (units of value); pm_illness_dalys = deaths x 2.54 DALYs/death x p_success x pm_years (DALYs, same wait and discounting); pm_dalys_raw = deaths / uov_per_daly + illness, so the weights for the averages are in one unit; dalys_direct adds pm_illness_dalys x pm_credit, then outcome_total applies leverage and unmodelled adjustments to it like every other branch. No double counting: deaths are valued in uov, illness is DALYs only, and the old 1/(1-share) gross-up is gone. The slider $life_value_multiplier moves deaths only; the illness part is a direct DALY count, consistent with INV-17.
- pm_illness_dalys_per_death = cvd_yld_share_gbr 0.14 / cvd_deaths_per_daly_gbr 0.055 = 2.54, matches the explainer (14%, about 2.5). Both facts are from one population (UK, GBD).
- Evaluated branch values: deaths 3,000, wait 9, pm_years 3.25, credit 0.0225 (evidence 1 x counterfactual 0.9 x attribution 0.10 x delivered 0.5 x missing-data 0.5). Soot gives 793 (deaths) + 168 (illness) of about 2,190 DALYs; lead-pipe 1,178 (54%). Summary ("over half from lead-pipe, most of the rest soot", 0.0018) and write-up (0.0018, "about 55%") match the model.
- pm_total_adj uses pm_evidence_adj; evidence_adj still feeds lcri, fish and ag totals; its explainer now says so.
- Credit fit: EDF 10% (range 4-25%) plus Earthjustice 25% (10-45%) = 35% at best guesses, 70% at both highs, within 100% of the advocacy; both explainers say so. Credit shares remain each model's own.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | normalization | pm_illness_dalys_per_death | Illness is counted only for the soot branch; the lead-pipe rule's deaths are also heart-disease deaths (lcri_value_per_death) with no illness added. | no lcri illness row; same rich_value_per_death used | Add lcri_illness_dalys = lcri deaths x pm_illness_dalys_per_death x p_success x years, into lcri_dalys_raw and dalys_direct x lcri_credit, as for soot (or state in lcri_value_per_death why not). | about +10% on the lead branch (illness ~21% of its death DALYs), about +5% total |
| 2 | low | source | us_pm_naaqs_2024_counterfactual (source.url) | The source url is the EDF model's own site page, not evidence; it is a pure judgment. | url charityevals.org/... | Point the url at the RIA (baseline already holds rules then in force, RIA p. 3, PDF p. 26) with a note. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_pm_naaqs_2024_deaths_per_year | epa.gov .../naaqs_pm_reconsideration_ria_final.pdf (extracted text) | verified | Table ES-6 (printed p. 17, PDF p. 40): 9/35 Pope 4,500 (3,200 to 5,700), Wu 2,100 (1,900 to 2,400); quote "should not be added to one another" is there. Table 5A-1 (PDF p. 343): 9/35 Pope 7,400, Wu 3,500. Low 1,900 and high 5,700 are the ends of those intervals. |
| us_pm_naaqs_2024_years_until_effect | same RIA, PDF p. 26 | verified | "likely finalize designations ... in late 2025"; Moderate areas "attain in late 2032"; 2032 chosen as analysis year. Court-ordered designations Feb 2027 verified below. |
| us_pm_naaqs_2024_delivered_share | eelp.law.harvard.edu tracker | verified | EPA asked D.C. Circuit to vacate 24 Nov 2025 (quote exact); D.C. Circuit upheld June 2026; Kentucky v. EPA cert petition 2 Sept 2026; district court ordered designations by 6 Feb 2027, EPA appealing. |
| us_pm_naaqs_2024_counterfactual, _evidence | n/a | judgment | Ranges and explainers match the merged model rows; see finding 2. |
| cvd_yld_share_gbr, cvd_deaths_per_daly_gbr | facts/death_ages.json | verified (values) | 0.14 and 0.055019 read as the explainer says. |

## Drivers
Unchanged: win_years_counted, missing_data_discount, advocacy share, next-dollar figure, discount rate; the soot inputs (delivered share, deaths per year) are in the top ten as sourced judgments with an EPA anchor.
