# Audit: project-drawdown-charityevals, round 10 (verification of the round 9 summary fix)
Result: -0.0012552 tco2e per donor dollar = -0.000745 years of healthy life per $1,000. Verdict: pass (no open high or medium).
Model-sha: 1fecc89db26916a9e23984d7d3a5735371f4e6f97ba82c425425c000e5e434c9
Scope: round 9's one open medium, the summary's two figures.
Previous round: round 9 finding 1 (summary tonnes rounding) resolved.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | resolved (was medium) | presentation | model `summary` | Now "about −0.0013 tonnes of CO₂e, about −0.0007 years of healthy life per $1,000": live -0.0012552 rounds to -0.0013, headline -0.000744888 rounds to -0.0007. | engine values | none | none |
| 2 | checked | presentation | write-up line 35 | "about three fifths its size" still holds: positive branches +19,372 against funders' -32,572, 59.5%. | engine values | none | none |

No row of the model changed; round 8's row checks stand.

## Sources checked
- No new inputs.
