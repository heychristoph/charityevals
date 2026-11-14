# Audit: the-nature-conservancy-charityevals, round 1 (scoped verification of commit 9e17551)
Result: 3.253e-7 daly/$ = 0.000325256 years of healthy life per $1,000 (combined range 0.00005-0.0021); the model sits under a tenth of the climate peers and its summary says why. Verdict: pass.

## Scope
Only the changes of commit 9e17551 to models/climate/the-nature-conservancy-charityevals.json: the new bridges row `methane_share` (0.003, judgment, 0.001-0.01) and the rewritten `dalys_from_tco2e` formula, with the shared rule (assumptions/default.json units.tco2e.to_common, facts/climate.json methane facts, docs/normalization.md 2.5). Everything else in the model is out of scope.

## What was checked
1. **methane_share value.** Computed rows at the defaults (compute() via buildLibrary): prana_tco2e = 68,181.8 t CO2e, prana_credit = 0.015309, tco2e_bridged = 319,571.7 t. PRANA's credited tonnes / tco2e_bridged = 0.3266%, matching the row's "about 0.33%". prana_tco2e is only the non-CO2 gases (residue_nonco2_tco2e_per_t, IPCC 2006 Vol. 4 Table 2.5: CH4 2.7 g/kg x 28 = 75.6, N2O 0.07 g/kg x 265 = 18.6), so the methane part is 75.6/94.2 = 80.3%, matching the explainer. Methane tonnes are therefore 0.0033 x 0.803 = 0.0026 of tco2e_bridged; the typed 0.003 is that figure rounded, inside the 0.001-0.01 range. No other branch emits methane (only PRANA's residue row mentions methane). The whole methane treatment moves the result by +0.07% (0.000325029 to 0.000325256), so the exact share cannot matter.
2. **Typed judgment is the right way.** The row is a `judgment` with a range, in the bridges section, a typed number like `fuel_share`. A computed version (prana_tco2e * prana_credit / tco2e_bridged) would read `prana_credit`, which reads `$missing_data_discount` (and tco2e_bridged reads every credit), and INV-2b forbids a row the conversion reads from reading shared assumptions; docs/normalization.md 2.5 says the same, and the explainer gives the reason. The range names its anchor (PRANA's share, the 80% methane fraction).
3. **Formula.** `dalys_from_tco2e` is exactly `tco2e_bridged * (<units.tco2e.to_common>) / ($uov_per_daly)` (string equality against assumptions/default.json: true). It reads `methane_share`, `air_pollution_weight`, `extra_deaths_per_tco2e` (0) and the shared climate facts; no retyped shared figure.
4. **Result.** `npx tsx scripts/headlines.ts the-nature-conservancy-charityevals` prints 0.000325256 (before: 0.000325029). The summary's "about 0.0004" and the write-up's 0.0004 (lines 3, 140, 162) still hold at one significant figure; the write-up needs no change.
5. **Mechanical.** `scripts/audit-model.ts`: no invariant violation, one low finding (O1 below). `scripts/check.ts the-nature-conservancy-charityevals`: all models valid. No methane row is among the tornado drivers.

## Findings
None in scope.

Out of scope (pre-existing, not failed on):

| # | Severity | Category | Finding |
|---|---|---|---|
| O1 | low | sensitivity | audit-model: the model's own ranges span 25,561x; the summary already says the result is mostly uncertainty. |
| O2 | low | presentation | The summary and write-up give the combined range as 0.00005-0.0035; audit-model now prints 4.9e-5 to 0.002147. The methane rows move it negligibly, so the figure predates this change; refresh it at the next full audit. |

Verdict: pass
Model-sha: 22c1fdb763c646607531abf81118b1236b528d78d53ed8ad2032a445595a4a37
