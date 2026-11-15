# Audit: transparency-international-charityevals, round 4 (verification of the compliance-cost rule 2.21)
Result: 3.360e-5 daly/$ = 0.03360 years of healthy life per $1,000 (combined range 0.001266–0.8917); cause median 0.06863 (×0.49). Verdict: pass.
Model-sha: 250e72545a8edff4f3d05c006ec174d6d889c187cf11d02fa320f34181ff6b30
Scope: scoped verification of the changed row (one sentence appended to `pol_people_per_change`'s explainer; `beneficiaries` only reformatted); headline unchanged.
Mechanical: `audit-model.ts` exit 0, one low (spread), no high or medium; invariants none.
Previous round: not applicable (verification of one changed row).

Verdict: pass

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | pol_people_per_change | "no impact analysis gives the changes' reporting and due-diligence costs" is too absolute for the EU anti-corruption directive (two of its articles are among the counted changes): the Commission's proposal came with an impact assessment (SWD(2023) 246) that will cost the measures, mainly to member states' authorities (public money, 2.20, not payers' compliance). I could not retrieve its figures in a quick search. The note also sits on a derived row (formula of reach rows), not on the branch's effect row. | Search for the assessment returned no cost figures; not fetched. | Reword to what is known: "the changes are mostly criminal-law, public-sector and national measures whose costs fall on governments; no private payer's compliance cost is costed for them, so none is counted", and put it on `pol_share_removed` or `pol_p_success`. Optionally cost SWD(2023) 246 if its private-sector burden is material. | probably small: 2 of 63 changes, mostly public costs |
| 2 | low | presentation | summary | "about half the site's global-health median" compares with peers (owner rule). Not a changed row. | Summary text. | Delete the clause. | none |

Counting no compliance cost is a reasonable best guess for this branch; the sentence's claim is the only weak point. No formula changed.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| pol_changes | https://images.transparencycdn.org/images/2025_-TransparencyInternationalAnnualReport_EN.pdf | not re-checked | unchanged row |
| (sentence) | Commission SWD(2023) 246 | unreachable in a quick search | see finding 1 |

## Drivers
Unchanged: pol_share_removed, pol_people_per_national_change (judgments), pol_tis_share, pol_movement_share, win years.
