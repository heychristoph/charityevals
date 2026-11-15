# Audit: campaign-for-tobacco-free-kids-charityevals, round 5 (verification of the shared tobacco figures)
Result: 1.350e-4 daly/$ = 0.1350 years of healthy life per 1,000 dollars (combined range 0.0096–1.893); cause median 0.06415 (x2.1). Verdict: pass.
Model-sha: 9caaeac6fb8ff347babb170879d9fefecaef4bf3c63432d39125e997523b0c34
Scope: verification round on commit 3e68437 only (re-pointing to facts/tobacco.json, the (1 - yld_share) removal, the vape-ban side effect, waivers, write-up). Programmes and year unchanged from round 4.
Mechanical: lint 0 high / 0 medium / 0 low (audit-model findings: 0), invariants none, normalization-audit none for this model (generated/ restored), check.ts passes, simulation stable (5%-95%: 0.246x-3.79x of best guess).
Previous round: round 4 findings not re-examined (out of scope); nothing in this diff reopens them.

Result before 0.134368, after 0.1350 (+0.5%): the 40-year never-start lag lowers the lag discount by about 9% (at a 3% rate, 0.60 to 0.55), the removed (1 - yld_share) raises the death term by about 11%, the vape-ban re-form is about neutral.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up, "From fewer smokers to fewer deaths" (line 47) | Still says half of the cut is reached "after about 30" years; the model and the "Counting the wins" bullet now say about 40. | writeups/campaign-for-tobacco-free-kids-charityevals.md line 47: "half of it reached after about 8 years and half after about 30." | Change "about 30" to "about 40". | none |
| 2 | low | sensitivity | glob_vape_ban_smokers_kept | The new input is a judgment (3.3%, 0 to 17%) with no stated anchor; the values are the old -3% (-15% to 0) divided by 0.9, so it is back-solved, not reasoned from a share of smokers. | explainer: "3.3%, 0 to 17%." No reference class. | Name an anchor in the explainer (e.g. the share of the priority countries' smokers who would otherwise switch to vaping and are blocked by the bans CTFK backs, net of youth vaping averted), or state that it is carried over from the earlier -3% judgment. | none now |

## Checks made (all pass)
- **Re-pointed rows keep meaning and value.** us_smoking_dalys, glob_smoking_dalys, the two second-hand-smoke ratios, US share averted (0.25%, 0.08-0.7%), US evidence (0.8, 0.5-1), US enforcement (0.9, 0.75-1) and the policy delay (1 yr, 0.25-2) are read from facts/tobacco.json with identical values and ranges (diff shows the old values moved verbatim; GBD figures and sources carried with their quotes).
- **Quit share and lags.** Quit share 0.5 (0.4-0.8) and quit lag 8 (3-15) unchanged. Never-start lag 30 to 40 (30-50): justified. In facts/death_ages.json 58% of US, 69% of UK and 44% of ten-country smoking deaths are at 70 or older, and 83% (US) are at 50 or older; people start at 14-25, so the lag to the death is four to six decades. The fact's explainer says this and cites the UK impact assessment. The summary and the "Counting the wins" bullet say 40; only the line in finding 1 is stale.
- **(1 - yld_share) removal is right.** death_ages `smoking_deaths_per_daly_*` is total smoking deaths over all smoking DALYs (333,101 / 9,447,628 = 0.035; 1,645,067 / 47,750,256 = 0.034), so DALYs x deaths_per_daly already gives all deaths. Multiplying by (1 - yld_share) first cut deaths by about 10% (cvd 7.6% for GHAI) without any matching reason. The illness part is counted separately and unchanged (`*_illness_credited` = dalys x yld_share x adjustments, summed into outcome_total), so no double count. American Cancer Society and Cancer Research UK use the same form (`dalys * deaths_per_daly * value_per_death * total_adj`, illness `dalys * yld_share`), so the three now agree. The `*_yld_share` rows are still read (illness rows, dalys_direct).
- **Vape-ban side effect keeps its value.** Old row: -3% (-15% to 0). New: `-glob_vape_ban_smokers_kept * (1 - @tobacco.vaping_relative_harm)` = -0.033 x 0.9 = -2.97% best; low end -0.167 x 0.9 = -15.0%, high end 0. Same shape and interval kept on the input; the shared vaping harm (10%, 3-33%) now also moves it, as intended. The tagged row is glob_vape_ban_harm_share (`side_effect: "added"`); the input row is untagged, correct; glob_side_effects still sums it with the second-hand-smoke and household rows.
- **side_effect tags.** The two second-hand-smoke ratios (formulas now `@tobacco.shs_* / @tobacco.smoking_*`), the vape-ban harm and the household row keep `side_effect: "added"`; ghai_side_effects stays 0 with its reason.
- **INV-4 waivers.** The two CTFK reasons are right: glob_share_burden_averted (own range 0.1-0.8%, anchored on Lyle and Hendrie MPOWER) shares only the 0.25% best with the US share (from US elasticities); glob_implementation_adj (0.75 best, 0.5-0.9) shares only the 0.75 with the US enforcement low end. Different places, different evidence; each states what the fact is. (The Cancer Research UK waiver in the same diff is outside this model.)
- **Write-up and summary match the model** apart from finding 1: the summary, "Counting the wins" (lags, shared-figures sentence naming the other three models) and the tornado inputs agree; headline is a live figure.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| @tobacco.smoking_dalys_usa, smoking_dalys_priority10, shs_* | ourworldindata.org/grapher/disease-burden-by-risk-factor | carried over unchanged from rounds 1-4 | values, quote and page identical to those the model held; not re-fetched (scope: verification of the move) |

## Drivers
Win years counted (judgment, site rule), missing-data discount (judgment, site rule), next-dollar slider at 42% (estimate), the priority-country share averted (judgment anchored on Lyle and Hendrie), the discount rate. The tobacco facts now in the tornado (quit share 0.4-0.8, lags) move the result by under +/-20%. Best improvement: a sourced per-charity next-dollar figure (deferred by owner decision).

Verdict: pass

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
