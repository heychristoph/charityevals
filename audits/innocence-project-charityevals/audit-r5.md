# Audit round 5: innocence-project-charityevals (verification of the round-4 wording fixes)

Scope: only the three explainers changed since round 4 (pol_int_pop_share, ex_p_execution, comp_years_until_paid). No row values or formulas changed. `audit-model.ts` runs clean: only the two standing LOW notes (far below the median, spread), both covered by the summary. Result 0.0006 years of healthy life per $1,000.

## Findings

1. [OK] ex_p_execution (round-4 finding 8, DPIC): the explainer now says the one-in-six figure is our reading of DPIC's counts "a judgment, not a quoted figure", and the Gross et al. claim is stated as the paper's. Nothing is claimed that the source must support. The source link is still the DPIC home page (its census datasets exist at datasets.deathpenaltyinfo.org); the input is a judgment and tiny in the result, so this is not a finding.
2. [OK] comp_years_until_paid (round-4 finding 9): the explainer now says the clock starts at exoneration for the Innocence Project's own clients and at passage for the compensation laws' newly eligible exonerees, matching how the row is used (round 4, point 5). The Florida filing-window source supports only "claims take a few years to file", which is what is claimed. Value unchanged.
3. [LOW] pol_int_pop_share (round-4 finding 7): the NPR claim is now limited to ten states and Illinois in 2021 (re-fetched: the page says laws banning lying to juveniles in interrogations, starting with Illinois in 2021), and Oregon and California are dropped; the population share is stated as our reading. But the same sentence still says the Innocence Project campaigned for these bans with partners, now without a source; the NPR page quotes only the Washington Innocence Project and cites the national organisation for a false-confession statistic, nothing on leading the campaign. Fix: cite the annual report page on interrogation reform for that clause, or soften to "Innocence Project affiliates took part" or drop it.
4. [LOW] The label of comp_years_until_paid still reads "Years from exoneration until compensation is paid", while the explainer now also covers the laws' clock from passage. Fix: "Years until compensation is paid".

Previous round: finding 7 partly resolved (finding 3 here), 8 resolved as wording (DPIC link left), 9 resolved.

Verdict: pass (no high, no medium, two low)
Model-sha: bbc7f132435730623ffdb29115171f9274eb60f3bc2e1712b66a22b912f5ae76
