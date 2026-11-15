# Audit: union-of-concerned-scientists-charityevals-climate, round 7 (scoped verification of the summary and write-up restatement and the INV-4 waivers)
Result: 0.005202 t CO₂e/$ = 0.001350 years of healthy life per $1,000 (combined range 1.265e-5–0.1441); cause median 0.002152 (×0.63), unchanged from round 6 (0.001350). Verdict: pass.
Model-sha: 44ccab49793dcb00d21879d1b5b818b38dac860f757f4928b906b87c96120812
Scope: scoped to what changed since round 6: the summary ("about -11%"), the write-up's 0.0014, and src/engine/normalization-waivers.json (INV-4 waivers for usmeth_first_year, none of them for this model). Programmes and sources of earlier rounds not re-audited.
Mechanical: audit-model exit 0, "Findings (0)"; normalization-audit: 0 violations (INV-4 included).
Previous round: round 6 finding 1 (compliance costs "-12%", IRA money "+3%") resolved for the compliance figure.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | "the act gives about half of the result" understates it: the Inflation Reduction Act's tonnes are 58% of the gross tonnes (1.16M of 1.98M tonne-years, before the 15% share for other wins) and, with the household money, about two thirds of the net result. | Evaluated: ira_downstream × ira_total_adj against the sum of the five branches | Say "about three fifths". | none |
| 2 | low | presentation | summary | "it is low because each win is shared…" grades the result without saying against what (the same wording flagged for another build as a ranking cue). | Model summary | Start the clause "each win is shared with many groups…". | none |

## Checked
- Summary: 0.0014 (0.001350), 0.0052 tonnes a dollar (0.005202), about $190 a tonne (1000/5.202 = $192); the household money +3% (evaluated: +3.4% of the gross tonnes) and the compliance costs −11% (−11.0%); both match. The write-up's headline span 0.0014 for this model matches; its credit shares (1%, 3%, 4%, 6%, 10%) and the 15% for other wins match the rows.
- INV-4 waivers: the six entries for usmeth_first_year concern EDF, Clean Air Task Force and Earthjustice only; they name a real different quantity (EPA's methane rule's first year against another rule's final year). Not this model's; no effect here.

## Drivers
Unchanged: the vehicle rule's compliance cost, its delivered share, the shared advocacy share, the next-dollar figure (judgments or estimates); the IRA branch gives most of the tonnes.

Verdict: pass (no high or medium finding; two lows).
Model-sha: 44ccab49793dcb00d21879d1b5b818b38dac860f757f4928b906b87c96120812
Re-stamped (15 Nov 2026): summary wording only, the round's two lows: no value changed
