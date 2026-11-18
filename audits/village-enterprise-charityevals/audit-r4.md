# Audit: village-enterprise-charityevals, round 4 (verification of the round-3 changes)
Result: 0.007652 uov/$ = 3.83 years of healthy life per 1,000 dollars (unchanged from round 3). Verdict: pass (0 high, 0 medium, 0 low).
Scope: scoped verification round. Only the two low findings of round 3 and the lines changed in commit 4a6a9447 were checked; nothing else was re-audited.
Mechanical: audit-model reports no high finding; the one medium (far-above) is the known flag explained in earlier rounds (the row is `ln_gain_per_person`, supported by two trials). The result is unchanged at 0.007652.

## Round-3 findings

| Round-3 item | Status | Check |
|---|---|---|
| 1. `program_spend` explainer list punctuation | resolved | Now reads "(Nawiri, 6%, ended early in 2025), the work helping the Kenyan and Rwandan governments adopt the model (...), valued in uov_government_adoption, and two small activities ...". Nawiri is separated from the government-adoption work. |
| 2. `savings_leader_usd` explainer figure | resolved | Explainer now says "about US$68,000"; the formula gives 47,505 / 30 x 3 x 75 x 382.9 / 2,000 = US$68,211. Matches. |
| Write-up round-2 line | resolved | Now adds "found two wording slips in explainers, fixed and checked again"; this is accurate (round 3 found two low wording findings, fixed in 4a6a9447, verified here). The result "3.77 to 3.83" still matches. |
| Nothing else changed | confirmed | The model diff between 4a6a9447~1 and HEAD is 2 lines (the two explainers); no formula, value or range changed. |

## New findings

No findings.

Verdict: pass. Findings: 0 high, 0 medium, 0 low.
Model-sha: f905017dc7f412a7643f87e2babca615cf04354547d931d33b2cabf16f1ca2ef
Rules: 0.2.1

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 32c25050.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.
