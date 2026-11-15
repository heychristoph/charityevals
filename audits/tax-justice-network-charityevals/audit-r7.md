# Audit: tax-justice-network-charityevals, round 7 (verification of the compliance-cost rule 2.21)
Result: 0.002507 uov/$ = 1.253 years of healthy life per 1,000 dollars (combined range 0.105 to 15.0); cause median 0.0682 (x18.4). Verdict: pass.
Model-sha: 8f2914ec11b6cad1f85223ca154500aabd25319ff87f5e06dba9a1b7a29de661
Scope: scoped verification of the changed rows (a_ue_compliance leaves the side-effect tag; explainers of a_ue_compliance and a_unmodelled_benefits_adj).
Mechanical: audit-model exit 0, lint low only (range spread), invariants none. normalization-audit not run (scoped).
Result before 1.253, after 1.253 (unchanged at the defaults, where the side-effect weight is 1).
Previous round: round 6 re-stamp, no findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | a_unmodelled_benefits_adj (label), writeups/tax-justice-network-charityevals.md line 23 | The sum row's label still reads "Transparency standards: side effects, as a share of the branch" though it now includes the compliance cost, and the write-up still lists banks' reporting costs under "side effects". | row label; write-up bullet "side effects: ... banks' reporting costs take away 2%" | Relabel "Transparency standards: side effects and compliance costs, as a share of the branch"; take the 2% clause out of the side-effects bullet. | none |
| 2 | low | presentation | summary | The summary compares with peers ("more than ten times its peers"), against the owner rule; another agent is removing it. | summary text | Drop the clause. | none |

## Checks (all fine)
- a_ue_compliance (-0.10 / -0.02 / 0) has no side_effect tag; a_ue_deterrence and a_ue_other_reforms keep theirs. The sum feeds a_outcome as (1 + a_unmodelled_benefits_adj) as before, so the cost is in the main chain and not moved by $side_effect_weight; at the default weight (1) the result is unchanged at 1.253.
- Rule 2.21: no impact analysis costs the standards worldwide, and the explainer now says so; the judged 2% stays (borne by firms and customers in rich countries, small on the log scale). Sign negative; no double counting with the benefit rows (they count revenue, not the reporting cost).
- Explainer text accurate against the value (-2%, range -10% to 0).

## Sources checked
None in scope (a judgment; no fact read).

## Drivers
Unchanged (the network's credit share, win years, the convention's recovery share; all judgments).

Verdict: pass
