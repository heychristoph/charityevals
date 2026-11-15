# Audit round 4: opportunity-green-charityevals

Scope: scoped check that the three round-3 findings (1 medium, 2 low) are fixed. Explainer text only; result unchanged at -0.1127. audit-model.ts: 0 findings.

| # | Round-3 finding | Status | Evidence |
|---|---|---|---|
| 1 | `imo_nzf_abatement_cost_per_tco2e` explainer said payments net out across the fleet | Fixed | Now says rewards and surplus-unit sales return to ships, and what leaves the fleet for the Fund's other uses is 0-12 billion dollars a year in the levy scenarios (DNV pp. 17-18) |
| 2 | `imo_compliance_uov` explainer lacked the real reason the EU trading branch has no row | Fixed | Says no impact analysis found; abatement cost under 2% of the shipping term. Check: EU about 2 Mt x about 80 EUR = about $0.17B against shipping 130 Mt x $300 = $39B before chain steps (about 0.4%), and the EU branch's chain is smaller, so under 2% holds |
| 3 | Write-up fallback headline and displaced share | Fixed | Fallback headline is -0.11; displaced share stated as 15% |

Verdict: pass (no findings).

Model-sha: 76914bf2680727e2031062d27ff99e75fa045dd3f7652ba93ad919fb3826d30a
