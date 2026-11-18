# Audit round 4 (scoped verification): KIND advocacy

Scope: credit rule 2.24, step 5. One share re-judged: `dc_attribution_share_shared` 0.30 (0.10 to 0.60) to 0.35 (0.15 to 0.65), the council's sponsors taken out of the denominator. Headline 0.00865 to 0.00934 years of healthy life per $1,000 at the defaults (`headlines.ts` prints 0.00933662). `check.ts` passes.

Checked:
- Denominator: now D.C. legal-aid groups, youth groups and KIND; the council members who sponsored and passed the act are under `mobiliser_share` through `dc_attribution_share = dc_attribution_share_shared * mobiliser_share` (`"credit": "win"`, correct class: a law others carry out).
- No double cut: `dc_counterfactual_adj` asks whether the council would have passed the act in the period without the coalition's push, a different question from who shares the credit; the council is not cut in both.
- Anchor and range: an equal split among the three kinds of group named gives a third; 35% sits just above it, range 15% to 65% brackets one in six to two in three. The explainer says what it rests on.
- Text: no comparison with other charities, no "effective altruism", short and plain.

Findings:
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | dc_attribution_share_shared | The anchor counts "kinds of group", not groups; the real number of D.C. legal-aid and youth groups in the coalition is not given. | If the coalition's member list is found, name the count; otherwise leave (stated judgment). |

Verdict: pass
Model-sha: 98eab411dd564684cf7464d22cb22dd7dd4a0d719d4ba687ed91b31a44e6d814
Rules: 0.3.2
