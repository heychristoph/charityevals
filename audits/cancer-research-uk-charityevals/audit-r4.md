# Audit: cancer-research-uk-charityevals, round 4 (verification)

Result: 1.662e-6 daly/$ = 0.00166 years of healthy life per $1,000, unchanged (the changes since round 3 are one explainer, two write-ups). Verdict: pass.
Model-sha: 6db3935641cd122a3d56d30c9d580d393df3f34f43f2616212dbad9f8febfaa6

Scope: only the changes since round 3 (git diff 593699e 052ad7c -- models writeups): the `research_attribution_share_shared` explainer, the BHF write-up's branch shares and superseded history line, and the CRUK write-up's round-3 note.

Mechanical: check.ts cancer-research-uk-charityevals: all models valid (warns as before: wide range, judgment-driven uncertainty, 9 inputs without ranges). No row, formula or value changed, so the result is unchanged.

## Findings

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | british-heart-foundation-charityevals write-up, "What drives the result" | Branch shares recomputed from the model's rows (each branch's illness credit plus its deaths' UoV through the shared bridge): research 86.8%, policy 8.7%, pilots 4.5%. "87%, 9% and 4%" is right for the first two; pilots at 4.51% would round to 5% (the three then sum to 101%). The write-up says "about", and the beneficiaries note (0.87 / 0.13) matches 87% and 13%. | Optional: "about 4.5%" or leave. |

## Checks of the requested changes

1. Round 3 finding 1 (medium, BHF write-up shares): resolved. Research 87% matches the computed 86.8% and the beneficiaries note (world 0.87, GBR 0.13: policy plus pilots 13.2%).
2. Round 3 finding 2 (low, explainer arithmetic): resolved. Anchors: $16bn non-commercial plus industry at 38% of $288bn ($109bn) is $125bn, so $580m / $125bn = 0.46%; at 25% ($72bn) the field is $88bn, 0.66%. "0.46% to 0.66%" is right and the 0.3% to 1.2% range still reads as wider than the anchors.
3. Round 3 finding 3 (low, old history line): resolved. The line now says "(superseded by the change of method below)".
4. CRUK write-up round-3 note: accurate (round 3 passed, with a corrected explainer figure and the BHF write-up's shares; this round verifies them). No numbers in it to check.

## Sources checked

No new sources; all figures recomputed from the model rows. Unchanged anchors (Evaluate Pharma $288bn, IQVIA 38%) were verified in round 2.

Verdict: pass. Findings: 0 high, 0 medium, 1 low.
