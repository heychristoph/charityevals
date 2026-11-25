# Audit: far-ai-charityevals, round 6 (scoped: merged pandemic death-age rule and funging = 1)
Result: 9.578e-4 daly/$ = 0.9578 years of healthy life per 1,000 dollars (combined range 0.0195–47.0); cause median 0.0733 (×13.1). Verdict: pass.
Model-sha: cb3353e4e08cb08ca24347a4caa4bfca9641d9af4644550da987b41f24a5e843
Rules: 0.3.13
Scope: unchanged from round 3 (all four programmes, 2024); this round checks that the two changes verified on separate branches (round 4: COVID-scale death ages; round 5: `leverage_funging_adj` = 1) are both present in the merged model and consistent with each other.
Mechanical: audit-model lint no high or medium; invariants none (INV-15 included); normalization-audit none (full run, "all models valid", 0 violations); `scripts/check.ts far-ai-charityevals` passes.
Previous round: rounds 4 and 5 had no open findings; both changes are present.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | none | double-counting | `leverage_funging_adj`, `@next_dollar.far_ai` | Funging is asked once: the row is 1 (0.85–1.05) with an explainer saying the room factor of `@next_dollar.far_ai` already asks it; no other row asks it (only `total_adj` multiplies it). The write-up's table says "Counted once, in the next-dollar figure". | model rows | none | none |
| 2 | none | normalization | `bio_covid_scale_share`, `covid_scale_deaths_averted`, `covid_value_per_death`, `uov_bridged` | The four rows equal the catastrophic-risk template (formula, value, unit compared); `covid_value_per_death` reads `@death_ages.covid_scale_*`. `bio_cost_share` is 0 (AI-only model), so the COVID-scale part carries zero weight and the age rule does not move this model. The two changes touch different rows and do not interact. | template comparison | none | 0% |
| 3 | none | presentation | summary, write-up | All figures equal `npx tsx scripts/headlines.ts far-ai-charityevals` (0.957847): 0.96, range "0.02 to 47" (0.0195–47.0), "about 13 times MIRI's" (0.958 / 0.0733 = 13.07), "more than ten times its peers' median". INV-15 sentences are right: the model is above ten times the cause median, and the reason stated (the over-a-quarter share of misuse work; misuse preset about 450 times misalignment) is true of the rows. Tornado figures quoted (0.13–9.2, 0.12–6.4, 0.40–1.4) match audit-model. | audit-model, headlines | none | none |
| 4 | low | presentation | `audit-r5.md` | The note "(Numbered 4 on its branch; renumbered at merge.)" was misleading once renumbered. | audit-r5.md | Removed. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| all | | not re-fetched | no new or changed facts; the only changed values are shared-fact reads and the funging row, verified in rounds 4 and 5 |

## Drivers
Misuse cut per dollar (estimate), AI catastrophe chance (judgment), years a cut counts (judgment), missing-data discount (judgment), next-dollar figure (estimate). Unchanged.

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): Reference class named in a judgment's explainer (published data on disclosure windows, rule start dates or grant-voucher periods); Rewiring America's cohort tonnes unit corrected; values unchanged. Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 8904b83b.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against e8ecb2b3.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against 7dbeec92.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against ca214e5f.

Re-stamped (17 Nov 2026): credit rule 2.24: fb_credit_share is the skeleton's row (unused here, or wording only): no value change. Mechanical: headline unchanged, 1 row changed, against 2b24b73c.

Re-stamped (18 Nov 2026), rule never-started-weight: Lives that never start count times a slider, 0% by default (the suffering in them always counts); future generations are the first rows it weighs, so the discount rate is time preference only. Mechanical: headline 0.4789 → 0.4756 (−0.69%), 4 rows changed, against the tree before the rule.

Re-stamped (18 Nov 2026), rule lives-added: The people and animals a result adds: a death averted, a stillbirth averted, a year of contraception, an income raised and a future kept are read with the births parents forgo, the survivor's descendants and the animals all of them eat, by the beneficiaries' income group; nothing moves by more than 0.2% at the defaults. Mechanical: headline 0.4756 → 0.4756 (−0.0096%), 9 rows changed, against the tree before the rule.

Re-stamped (18 Nov 2026), rule never-started-prose: Wording: the summaries and write-ups of the models that count a future say it counts only where the reader counts lives that never start, give the Long-run value set's figure where they gave a 0.1% discount rate's, and Redwood Research states no range; no row or result changes. Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (19 Nov 2026), rule never-started-branches: In the catastrophic-risk family the mark for lives that never start moves from the sum of the future to each branch's future row, so the branch weights that average the adjustments count the future as the outcome does (they counted it in full); the future's farmed animals read the branches' own formulas. Mechanical: headline unchanged, 1 row changed, against the tree before the rule.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.
