# Audit round 3: Clean Air Task Force (scoped verification)

Scope: only the changes in commit 503c8e9 (`voc_health_share` to 1%, write-up "+3.5%" to "+1%", headline 0.0065 to 0.0064), against round 2's finding 4 and the EPA tables it cites.

## What was checked

- `voc_health_share` is now 0.01 (low 0.005, high 0.02), exactly the value and range finding 4 asked for.
- Explainer: still cites EPA RIA Tables 3-8/3-9 (56 deaths a year in 2028, 74 in 2038, verified in round 1). Its claim that these VOC deaths are about an eighth of the US methane branch's heat-death value, and about 1% of the model's value once methane's own ozone is counted, is consistent with finding 4's arithmetic: 3.5% of the US branch, which is about 29% of the tonnes, gives about 1% of the value. The old "an eighth of the US branch" claim is correctly qualified as heat-death value only. The explainer now also says these deaths are apart from methane's own ozone, which avoids a double count with `extra_deaths_per_tco2e`.
- Write-up: "+3.5%" changed to "+1%", matching the row.
- Headline: `audit-model` bottom line is 0.006370, which rounds to 0.0064; the model summary and the write-up's headline span both say 0.0064. The summary's other figures are unchanged.
- `npx tsx scripts/audit-model.ts models/climate/clean-air-task-force-charityevals.json`: 0 findings; only the existing warnings (wide plausible range, share of uncertainty from judgment calls, 14 inputs without published ranges).
- `npx tsx scripts/check.ts clean-air-task-force-charityevals`: "all models valid".

## Findings

None.

Verdict: pass
Model-sha: 297309bfd7cd9eec52d54242ed3b01a083bf8d66c473aa61c1904c69855377bd
