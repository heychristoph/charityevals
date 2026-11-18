# Audit: ambitious-impact-charityevals, round 10 (scoped verification)
Result: 5.634 years of healthy life per 1,000 dollars at defaults (`npx tsx scripts/headlines.ts ambitious-impact-charityevals`); combined range and cause median not re-checked in this scoped round. Verdict: pass.
Model-sha: fe5d48440a968e143fc0ff8b10b254f75205c223fc1fd62177b4905165739032
Rules: 0.2.0
Scope: round 9's finding only
Preflight: not re-run (no model change; the diff is the write-up only)
Previous round: r9 finding 1 (medium, stale write-up claim about idea-stage figures): resolved.

## Checked
1. **Fix against the model.** `value_destinations` is the average of 15 references (ten GiveWell, `#hli:actra`, `#charityevals:` Learning Alliance, NOVAH, Oxygen Access Project, Respira Health) for human well-being and `#ace:shrimp-welfare-project` for animals, weighted by `@meta.aim_founded_2025_human` and `@meta.aim_founded_2025_animal`. `grep -c "ambitious-impact:"` on the model file gives 0: no idea-stage estimate is read. Its explainer says the youngest charities, whose only figure is Ambitious Impact's estimate from before they existed (which never ranks), are valued at the average of their cause.
2. **"Biggest uncertainties"** now lists two bullets (lifetime fundraising, how much of existence it caused). The idea-stage bullet is gone, which is right: the model no longer depends on those forecasts.
3. **"What isn't modelled"** now names LEEP, FarmKind, Rahi Impact, Scale Welfare and "its youngest ones, whose only figure is an estimate from before they existed", valued at the average of their cause. This matches the explainer.
4. **Nothing else stale.** `grep -i "idea-stage|forecast"` on the write-up: no matches. "What a dollar to its charities does" (ten GiveWell, ACTRA, four own models, youngest at their cause's average, Shrimp Welfare Project, eight to one) matches the formula. "What drives the result" applies the missing-data discount only to projected fundraising and future donations, as the model does. The headline is a placeholder; the summary's drivers are unchanged.

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | No high or medium remains. | | | |

## Sources checked
None needed: no number or source changed in this round's scope.

## Drivers
Unchanged from round 9.

Verdict: pass.
