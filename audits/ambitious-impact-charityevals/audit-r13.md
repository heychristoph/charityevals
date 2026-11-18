# Audit: ambitious-impact-charityevals, round 13 (scoped verification)
Result: 3.994 years of healthy life per 1,000 dollars at defaults (`npx tsx scripts/headlines.ts ambitious-impact-charityevals`); combined range and cause median not re-checked in this scoped round. Verdict: fix needed (one medium, a one-phrase text fix).
Model-sha: bcd2c2504845ccbbe74742af23df2c0c151c84c1d328071876c93ac43121d230
Rules: 0.2.1
Scope: value_destinations after the remaining own models replaced idea-stage estimates
Preflight: pass (`npx tsx scripts/preflight.ts ambitious-impact-charityevals`: "passes")
Previous round: r10 (pass, 5.634) had no open high or medium. The folder also holds older r11 and r12 files from an earlier lineage (headline 48.5 / 9.4); the rounds go on from r12.

## Checked
1. **Formula reads exactly the stated references.** `value_destinations` = (`@meta.aim_founded_2025_human` x avg of 21: ten GiveWell (Suvita, Family Empowerment Media, Fortify Health, Ansh, Taimaka, Lafiya Nigeria, Notify Health, Healthy Futures, Clear Solutions, Spiro), `#hli:actra`, ten `#charityevals:` (Learning Alliance, NOVAH, Oxygen Access Project, Respira Health, LABRI, Lead Research for Action, ARMoR, First Embrace, Kaya Guides, Concentric Policies) + `@meta.aim_founded_2025_animal` x avg(`#ace:shrimp-welfare-project`, `#charityevals:animal-policy-international`)), divided by the two shares. CEARCH is not in it. `grep -c "ambitious-impact:"` on the model file: 0.
2. **Each reference resolves to the ranked figure.** `modelResult` on every reference at default values gives a finite number, no model-library error mentions the model, and preflight passes. Figures (units of value per dollar): GiveWell 0.0633 / 0.0521 / 0.00569 / 0.0191 / 0.0133 / 0.0230 / 0.0177 / 0.00150 / 0.00908 / 0.0105; ACTRA 0.00187; own: Learning Alliance 0.0388, NOVAH 0.000127, Oxygen Access 0.00691, Respira 0.0000076, LABRI 0.00316, Lead Research for Action 0.000263, ARMoR 0.000101, First Embrace 0.0105, Kaya Guides 0.00157, Concentric Policies 0.000062; Shrimp Welfare Project 5.8e-7; Animal Policy International -1.1e-5 (negative, kept as is).
3. **The move 5.634 to 3.994 is explained.** Human average over 15 references (round 10) 0.01753, now over 21 references 0.01327 (-24%): the six added models (ARMoR, LABRI, Lead Research for Action, First Embrace, Kaya Guides, Concentric Policies) are all at or below 0.0105, mostly one to three orders of magnitude below GiveWell's top charities, so the average falls. Animal average 5.8e-7 (Shrimp Welfare Project alone) now -5.3e-6 (with Animal Policy International's net harm), about zero either way, and at one cause share in nine it moves nothing visible. The headline falls 29%, more than the human average's 24%, which is expected: the institutional share of its charities' money counts only for the gain over an ordinary charity of the same cause, so a lower destination figure against an unchanged baseline cuts the gain by more than the figure itself.
4. **Explainer and write-up name the right charities and the formula.** The explainer lists the ten GiveWell charities, ACTRA (HLI), the ten own models and Animal Policy International, Shrimp Welfare Project (ACE), equal weights within a cause, the shares eight to one, and leaves out CEARCH (named as a meta charity valued at the average of the rest). The write-up paragraph "What a dollar to its charities does" matches (ten GiveWell, ACTRA, eleven own models named, Shrimp Welfare Project, eight to one). "What isn't modelled" (LEEP unpublished, FarmKind, Rahi Impact, Scale Welfare, the youngest) matches the explainer. The write-up makes no comparison with other charities', peers' or causes' averages, no median.
5. **Stale typed numbers.** Counts and shares in the write-up ("60 charities", "$107 million", "eight to one", 2.5 times, 60%) are unchanged by this round's inputs. One typed figure is stale (finding 1).

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | write-up, "What drives the result", bullet "The discount rate" | "at 0.1% the result is about three times higher" is out of date. | Headline at default discount rate (0.04): 3.994; with `discount_rate` = 0.001: 7.29, i.e. 1.8 times higher. | In writeups/ambitious-impact-charityevals.md replace "so at 0.1% the result is about three times higher" with "so at 0.1% the result is about twice as high" (1.8 times). | none |

## Sources checked
None needed: no number or source changed in this round's scope; reference figures taken live from the engine.

## Drivers
Unchanged in order from round 10: the missing-data discount, where shifted money would have gone, the discount rate, the next dollar, Founding to Give's donations. The destinations average is now dominated by GiveWell's Suvita (0.063) and Family Empowerment Media (0.052) and Learning Alliance (0.039); the other seven own models and ACTRA contribute little.

Verdict: fix needed (finding 1 only; no high).
