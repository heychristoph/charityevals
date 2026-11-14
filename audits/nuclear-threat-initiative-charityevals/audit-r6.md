# Audit: nuclear-threat-initiative-charityevals, round 6 (verification)

Result: 0.02123 daly/$ = 21.23 years of healthy life per $1,000 (combined range 1.103 – 408.8); cause median 1.080 over the three ranked models of the audit-model reference class (×19.7). Verdict: **pass**.
Model-sha: 10e33402e14e22ae3d88ac48d7ee502d7d57f0cae96351e0635c3f8766625015

Scope: verification round, only the change since round 5: one sentence added to the model's `summary` ("It is more than ten times its peers because they work only on AI, and Rethink's typical pandemic or nuclear project averts from about 4 to over 400 times more deaths per dollar than a typical AI project, depending on how much of the AI work is against misuse."), added because far-ai-charityevals gave NTI three ranked peers and switched on INV-15. No row, input or result changed (21.23, range 1.103 – 408.8, as in round 5).

Mechanical: audit-model unchanged from round 5 (no high or medium finding; the same low lint items). normalization-audit: INV-15 row "checked 166, 0 violations"; no violation for this model in any invariant. generated/ restored with `git checkout -- generated`.

Previous round: round 5 had no findings.

Checks of the new sentence:
- "More than ten times its peers": peers are CAIS 1.351, FAR.AI 1.080, MIRI 0.0659 years per $1,000; NTI 21.23 is ×15.7, ×19.7 and ×322 of them, and ×19.7 the median of the three. True, and this is the INV-15 reason the rule asks for.
- "They work only on AI": in all three peers bio_cost_share, nuclear_cost_share and pol_cost_share are 0 (MIRI and FAR.AI ai_cost_share 1; CAIS has no bio, nuclear or policy share, only a field-building share). True. NTI works on nuclear, bio and a small AI programme, as the summary's first sentence says.
- Per-million deaths rows (audit-model canonical rows): bio_deaths_per_million 308.4, nuclear_deaths_per_million 1361 (NTI); ai_deaths_per_million at the peers' defaults: CAIS 76.02 (misuse share 0.25), FAR.AI 70.19 (0.23), MIRI 3.059 (0). Ratios: bio/AI 4.06 (CAIS), 4.39 (FAR.AI), 100.8 (MIRI); nuclear/AI 17.9, 19.4, 444.9. So the low end is "about 4" (bio against the peers with a quarter of the AI work against misuse) and the high end "over 400" (nuclear against MIRI, with none against misuse). The range 4 to over 400 is right, and the dependence on the misuse share is the driver (3.06 at 0, 76 at 0.25; NTI's own AI row at 0.7 is 207.4).
- "Deaths per dollar" is the right measure for the claim: the future-lost rows (bio 1439, nuclear 1215, AI 25 to 31 per million) are not mentioned and do not change it.
- Readability: the sentence follows the description of the valuation and precedes the uncertainty sentences; "Rethink's typical ... project" matches the model's source. The summary stays accurate (headline 21, range 1 to 410). Length is one sentence, within the less-text rule.

Findings: none.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| (none) | | | No input changed; the claim rests on the models' own canonical rows, recomputed above. |

## Drivers
Unchanged from round 5: the nuclear and bio extinction and catastrophe cuts per million (Rethink's placeholders, estimate), the years a cut counts and the discount rate (judgment).

Verdict: **pass**. Findings: 0 high, 0 medium, 0 low.
