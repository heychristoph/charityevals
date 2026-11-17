# Audit: rainforest-foundation-us-charityevals, round 4 (verification)
Result: 1.157e-5 daly/$ = 0.01157 years of healthy life per 1,000 dollars (combined range 0.0022-0.060). Verdict: pass.
Scope: the changes in commit bc48e00 only (A, B, beneficiaries, write-up table). The full battery was not re-run.

Mechanical: audit-model 0 invariant violations; only warnings (range spans a wide factor, 90% of the uncertainty from judgments) and an info line, as in round 3. check.ts: all models valid.

## Checks
| Change | Check | Status |
|---|---|---|
| A. `tero_attribution_share` 0.45 to 0.38 (25-75%) | 0.7 x 40% + 0.3 x 30% = 37%, so 38% is consistent with the explainer; the Guyana 30-50% (say 40%) and 30% elsewhere are stated judgments. The round-3 finding A is resolved. | resolved |
| B. `glob_attribution_share` count | RFUS about $1.3M of roughly $8-15M (stated as "about 1.3 of 12", 10.8%) against 10% (3-30%): consistent, the guesses are labelled as guesses. The round-3 finding B is resolved. | resolved |
| C. `glob_ha` | No change needed, as round 3 said. | n/a |
| Write-up table | Elsewhere share 38%, matches the row. | ok |
| Beneficiaries | Branch shares below: pay 29.9%, so world 0.7005, Peru 0.299 x 291/400 = 0.2178, Guyana 0.0568, Brazil 0.0194, Panama 0.0054. These match the model and scripts/beneficiary-countries.ts (the two agree). | ok |

## Figures against the model
Branch shares at the defaults, from scratch copies with each branch's credit set to 0 (base 0.01157):

| Branch | Share | Summary / write-up says |
|---|---|---|
| Peru's territories | 49.1% | "about half" |
| Other territories | 8.5% | none stated |
| Global work | 3.5% | "about 3%" (3.46%; a rounding, fine) |
| Titles | 9.0% | none stated |
| Patrollers' pay | 29.9% | "three tenths" |
| Pandemic risk (risk_per_ha_year zeroed) | 56.2% | "nearly three fifths" |

The headline 0.01157 rounds to the 0.012 in the summary and write-up.

## New findings
None.

Verdict: pass (0 high, 0 medium, 0 low).
Model-sha: 64f6b6c44057e43f0b5b43144eb6a2dce7010480b14b982bcb077409108e4591
Re-stamped (15 Nov 2026): damage beyond deaths at EPA's 0.6 in the tco2e bridge copy, read through the side-effects weight (2.5, 2.16; mechanical); summary figure updated where it changed

Re-stamped (16 Nov 2026): Local market spillover reads the new shared fact cash.local_market_spillover_share (same value and range). Mechanical: headline unchanged, against 2492e3fc.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 8904b83b.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7224423b.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 2 rows changed, against d150f0b2.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against 7c76c006.
