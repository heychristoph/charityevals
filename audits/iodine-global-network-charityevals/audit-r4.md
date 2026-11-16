# Audit: iodine-global-network-charityevals, round 4 (verification)
Result: 0.004813 uov/$ = 2.41 years of healthy life per 1,000 dollars (combined range 0.096-60.2). Verdict: pass.
Model-sha: bfef29ab506dc6237bc2e4471d7cdda574726fe8e638a2bb832bcaa3160230e6
Scope: only the changes of commit 480880ba: `dav_share_deficient_without` 0.4 (0.2-0.7) -> 0.5 (0.25-0.7) with a new explainer; explainer-only edits to `qa_persistence_years`, `dav_years_until_effect`, `net_years_until_effect`, `reg_years_until_effect`.
Mechanical: preflight no high or medium lines (two lows: stale generated distributions, to be refreshed by summaries.ts); lint 0 high/0 medium; headline 2.406 -> 2.410.

Changes checked:
- Source (fetched jofem.org/index.php/jofem/article/view/414): Perlas et al., J Endocrinol Metab 2017;7(3):86-93: school-aged children's median UI "mild deficiency with a median of 71 ug/L in 1998 to 201 ug/L in 2003", national nutrition surveys 1998/2003/2008/2013; ASIN Law 1995. The explainer matches. "Over half below the 100 ug/L cut-off" follows from a median of 71. The 1995-law-to-2003-adequacy statement in `net_years_until_effect` matches the abstract.
- Value: a national median of 71 puts over half of children below the cut-off, so best 0.5 follows; low 0.25 and high 0.7 are the stated spread for Davao's other iodine sources (fish, seaweed). Unit (share), formula `dav_births * dav_share_gain * dav_share_deficient_without` and kind (judgment, ranged, reference class named) unchanged.
- Other four rows: text only; values unchanged; each says plainly "no reference class" where none exists.
- No explainer compares the charity with other charities, medians or peers, and none mentions effective altruism.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| dav_share_deficient_without, net_years_until_effect | https://jofem.org/index.php/jofem/article/view/414 | verified | 71 ug/L (1998) to 201 ug/L (2003); ASIN Law 1995. |

## Drivers
Unchanged from round 3.

Verdict: pass

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 480880ba.
