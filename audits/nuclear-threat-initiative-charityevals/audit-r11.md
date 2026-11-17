# Audit: nuclear-threat-initiative-charityevals, round 11 (scoped verification, credit rule 2.24)
Result: 24.9 years of healthy life per $1,000 at mobiliser_share 100% (was 23.6). Verdict: pass.
Model-sha: 71a9a996582ef1d5870638ddb4a1375a2b999a59d815d6e210bec4cea94218fb
Scope: only `attribution_share_shared`, the class of `attribution_share`, `fb_credit_share`, and text following from them.
Preflight: pass (only the distributions.json out-of-date line, ignored).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | attribution_share_shared | The "third of the outside time" is a bare judgment: no cited source sizes the officials' part, and the Deterrence Study Group and Bio Funders Compact claims could not be fetched (nti.org returned 403 / no matching text). No study or NTI document in the model offers a better anchor (the 990 holds NTI's own spending, not partners' or officials' time). | Arithmetic is consistent: old outside share 0.15, minus a third (0.05) = 0.10, so 0.90; low 0.6 gives outside 0.40, minus a third = 0.27, so about 0.7. | Keep 0.9 (0.7 to 1). Word the anchor: "judged a third of the outside time because the study group's and the reviews' participants are mainly officials, while the Compact and partners' staff are the other funders' and NGOs' own time; no source sizes either." | none |
| 2 | low | presentation | writeups/nuclear-threat-initiative-charityevals.md line 41 | Quoted the old 0.85. | Table row | Edited to 0.9 with a one-line reason (done). | none |

Checks
1. Denominator: officials of the study group and fail-safe reviews (adopters) are out; CEPI and partners (co-advocates/co-deliverers) stay. No co-advocate dropped without reason. Pass.
2. Factual claims: unreachable (nti.org 403); claims are consistent with the model's own spending explainer (fail-safe reviews, Track 2 dialogues in the Global Nuclear Policy Program) and with the charity file.
3. Value and range: a defensible best guess, not conservative; consistent with the explainer's arithmetic.
4. Class: one branch share, `research`, formula `attribution_share_shared * mobiliser_share`, used once in `total_adj`; no other row reads the share or mobiliser_share. fb_credit_share is unused (fb_people 0), takes the default 1 (0.5 to 1), no effect. Pass.
5. Counterfactual: stays in `counterfactual_adj` (0.7) and years_of_impact; not touched. Pass.
6. Text: summary and other explainers quote no old share; writeup line 41 corrected.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| attribution_share_shared | https://www.nti.org/analysis/articles/bio-funders-compact/ | unreachable | 403 |

## Drivers
Not re-assessed (scoped round).
