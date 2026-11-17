# Audit round 8 (scoped verification): campaign-for-tobacco-free-kids-charityevals
Result: 2.080e-4 daly/$ = 0.208 years of healthy life per 1,000 dollars at the defaults (round 7: 0.135). Verdict: fix needed.

## Scope
Credit rule 2.24, step 5: `glob_attribution_share_shared` 0.15 -> 0.25 (0.12 to 0.40), `ghai_attribution_share_shared` 0.15 -> 0.20 (0.08 to 0.40), and whether `us_attribution_share_shared` (unchanged 0.12) still counts an adopter. Nothing else re-audited.

## Checked
- Used rows `glob_attribution_share`, `ghai_attribution_share` read `<x>_shared * mobiliser_share` and carry `"credit": "win"`: right (laws others carry out).
- Global: ministries are out of the denominator; Bloomberg partners, Gates and CTFK's grantees stay in. Anchor: $420m over 2023-2026 is about $105m a year; $29.5m of it is 28%, "about a quarter" holds. The $29.5m and $9.6m grants figures match the model's own sourced Form 990 row. No double cut found.
- GHAI: governments out, funders and partners in; the anchor is a stated judgment (equal split among about five supporters) and says so.
- US: see finding 1.

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | medium | `us_attribution_share_shared` | The explainer still lists "state and local health departments" in the denominator. They adopt, enforce and carry out the laws, so they are mobilised, not co-advocates. It also anchors on ACS CAN's own model (30%), which the rule forbids as an anchor. | Delete "state and local health departments and" (keep "state and local coalitions"); drop the ACS CAN 30% clause and say what it rests on (a stated judgment among about five national coalition partners plus the Action Fund, CTFK the lead strategist). Re-judge value: about 0.15 (0.06 to 0.30) once health departments are out. |
| 2 | medium | summary | "(12% in the US, 15% abroad)" is a typed figure and is now wrong (global 25%, GHAI 20%). | Use `{{row:us_attribution_share_shared}}`, `{{row:glob_attribution_share_shared}}` and `{{row:ghai_attribution_share_shared}}`, e.g. "(x% in the US, y% in the ten countries, z% for the incubator)". |
| 3 | low | `ghai_attribution_share_shared` | "About five outside supporters" is unsourced; the explainer names WHO, UNICEF, Bloomberg, Gates and Resolve to Save Lives, so with GHAI that is six (about 17%). | Say "one of about six" or "about 20%"; value stays within the range. |

## Sources checked
Model's own rows for $29.5m, $9.6m and the Bloomberg $420m (cited release); no new fetch.

## Drivers
Headline moved 0.135 -> 0.208 (about 1.5x): the global branch's share rose from 0.15 to 0.25 and GHAI's from 0.15 to 0.20.

Verdict: fix needed
Model-sha: 92674656d41749734cae198f628784c3fd2c98c5f8cbcdb2eb4bb4216b08fe10
