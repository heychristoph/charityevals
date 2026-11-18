# Audit: ambitious-impact-charityevals, round 9 (scoped verification)
Result: 5.634 years of healthy life per 1,000 dollars at defaults (`npx tsx scripts/headlines.ts ambitious-impact-charityevals`); combined range and cause median not re-checked in this scoped round. Verdict: fix needed (one medium: a stale write-up claim, fix below).
Model-sha: fe5d48440a968e143fc0ff8b10b254f75205c223fc1fd62177b4905165739032
Rules: 0.2.0
Scope: value_destinations reads only ranked figures (rule theoretical-never-ranks), and the text that describes it
Preflight: pass (`npx tsx scripts/preflight.ts ambitious-impact-charityevals`: "passes")
Previous round: r8 had no open high or medium. Not applicable; the model changed since (headline 9.52 to 5.634).

## Checked
1. **Formula reads exactly the intended charities.** `value_destinations` = (`@meta.aim_founded_2025_human` x avg of 15 refs + `@meta.aim_founded_2025_animal` x avg(`#ace:shrimp-welfare-project`)) / (human + animal). The 15: GiveWell's ten (Suvita, Family Empowerment Media, Fortify Health, Ansh, Taimaka, Lafiya Nigeria, Notify Health, Healthy Futures, Clear Solutions, Spiro), `#hli:actra`, and `#charityevals:` Learning Alliance, NOVAH, Oxygen Access Project, Respira Health. No `#ambitious-impact:` reference remains in the formula (grep of the model: none anywhere outside the explainer's words). The previous version also read nine AIM idea-stage figures for human well-being (Kaya Guides, Alliance for Reducing Microbial Resistance, Concentric Policies, Lead Research for Action, LABRI, First Embrace, Opal Health, Neev, Better Season Project), AIM's NOVAH and Learning Alliance estimates, and `#ambitious-impact:animal-policy-international` for animals; all gone.
2. **Each `#charityevals:` reference resolves to the charity's ranked figure.** Via the engine (`refTargets` / `modelResult` under default values): `#charityevals:learning-alliance` -> learning-alliance-charityevals (0.0388 units of value per dollar), `#charityevals:novah` -> novah-charityevals (0.000127), `#charityevals:oxygen-access-project` -> oxygen-access-project-charityevals (0.00691), `#charityevals:respira-health` -> respira-health-charityevals (7.6e-6). The old `#ambitious-impact:novah` and `#ambitious-impact:learning-alliance` no longer resolve (NaN): those idea-stage models are gone, so nothing stale is read. The GiveWell and HLI references each resolve to one model; `#ace:shrimp-welfare-project` -> shrimp-welfare-project (5.82e-7).
3. **Cause shares unchanged.** `@meta.aim_founded_2025_human` = 8, `@meta.aim_founded_2025_animal` = 1 (facts/meta.json, Ambitious Impact accounts p. 18); facts/meta.json was last changed in b58659bd, before the commits of this change.
4. **The move is explained by removing the idea-stage figures.** Human-cause average in units of value per dollar, default values:
   - Without the idea-stage figures (the current 15 references): 0.017534.
   - With the nine remaining idea-stage models added (24 references, the old set minus the two AIM models that no longer exist): 0.027505, 1.57 times higher. The Alliance for Reducing Microbial Resistance alone is 0.277; leaving it out of the "with" set gives 0.016654.
   - Value of a dollar to the charities it founds (8:1 weights): 0.015586 now; 0.024449 with the nine idea-stage figures and Animal Policy International's, 1.57 times higher. The headline fell 1.69 times (9.52 to 5.634): about 1.57 from the idea-stage figures; the rest is the replacement of the two AIM estimates for Learning Alliance and NOVAH (no longer computable) by our models. The other drivers of the headline (founded money, discount rate, shifted money) are untouched in the diff.
5. **Missing-data discount rows don't touch `value_destinations`.** `value_destinations` is read only by `moved_dollar_value` (and `uov_per_donor_dollar`); the discount rows (`founded_projected_missing_data_adj`, `egi_missing_data_adj`, `f2g_missing_data_adj`, `careers_missing_data_adj`, `missing_data_adj`) are each `$missing_data_discount` and multiply quantities of money, careers or informed money, never the value of a dollar. The write-up phrase saying the discount applies to idea-stage figures is gone.
6. **Explainer matches the formula.** It names GiveWell's ten, ACTRA (HLI), our four models, Shrimp Welfare Project (ACE), equal weights within each cause, the 8:1 causes, and the unranked youngest charities valued at their cause's average. The counts (eight in human well-being, one animal) match the facts; "ten" matches the formula.
7. **Write-up "What a dollar to its charities does"** matches the formula (ten GiveWell, ACTRA, four own models, the youngest at their cause's average, Shrimp Welfare Project, "eight to one"); one copy only.

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | write-up, "Biggest uncertainties" and "What isn't modelled" | Stale claim: "The figures of its youngest charities, which are Ambitious Impact's own forecasts made before the charities ran" is listed as an uncertainty, but the model no longer reads those figures; the youngest charities are valued at their cause's average. "What isn't modelled" names LEEP, FarmKind, Rahi Impact and Scale Welfare but not the youngest charities with only an idea-stage estimate. | writeups/ambitious-impact-charityevals.md, bullet under "Biggest uncertainties" (line 49); formula has no `#ambitious-impact:` reference | Replace the line 49 bullet with "How the youngest charities, with no model here, are valued: at the average of their cause, which the ranked charities set." (or delete it); add "its youngest charities, whose only figure is an estimate made before they existed" to the "What isn't modelled" bullet (valued at the average of their cause). | None on the result |

## Sources checked
None needed: no number or source changed in this round's scope.

## Drivers
Unchanged: missing-data discount, mobiliser share, `win_years_counted`, `@next_dollar.ambitious_impact`, discount rate; plus the human-cause average of the ranked charities (0.0175 units of value per dollar), now the value of a dollar to the charities it founds.

Verdict: fix needed (finding 1; a text-only fix, then pass).
