# Audit: american-cancer-society-charityevals, round 4 (verification of the compliance-cost rule 2.21)
Result: 6.005e-6 daly/$ = 0.006005 years of healthy life per $1,000 (combined range 6.114e-4–0.05898); cause median 0.06863 (×0.0875). Verdict: pass.
Model-sha: 57951ebefbade62bb9ae9c000bd1489cbfd1bc3adde74d8a49663cff913c1447
Scope: scoped verification of the changed row (one sentence appended to `tob_share_burden_averted`'s explainer); headline unchanged.
Mechanical: `audit-model.ts` exit 0; lows only (two unused reference inputs, the far-below peer line being removed); invariants none.
Previous round: not applicable (verification of one changed row).

Verdict: pass

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | missing-adjustment | adv_share_burden_averted | The coverage-advocacy branch (insurance coverage of screening and testing, research budgets) is a won-rule branch with no 2.21 line: coverage mandates cost payers (premiums), and no cost is counted or stated. Not a changed row, but the rule applies to it. | Branch rows `adv_*`; the diff adds a line only to the tobacco row. | Append a line to `adv_share_burden_averted` saying whether a regulator's or state's fiscal note costs the mandates; if one does, add the cost through the bridge as rule 2.21 says, else state that none is counted. | unknown, likely small relative to benefits; the sentence alone leaves the branch unaddressed |
| 2 | low | presentation | tob_share_burden_averted | "sales rules no impact analysis covers" is absolute; add "of the year's wins". | | Reword. | none |
| 3 | low | presentation | summary | "far below the site's global-health median" compares with peers (owner rule). | Summary text. | Delete the comparison, keep the reasons. | none |

The tobacco sentence is accurate: tax rises are transfers (2.21 excludes them) and the other wins are local sales rules. No formula changed.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| (sentence) | none needed | | No regulator cost figure is used by the model. |

## Drivers
Unchanged: share of burden a year of research averts, share of the burden the year's policy wins avert, ACS's credit shares, years brought forward, next-dollar share.
