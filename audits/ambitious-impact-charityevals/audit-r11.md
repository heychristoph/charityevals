# Audit round 11 (scoped verification): Ambitious Impact (charityevals)

## Scope
Only the change since round 6: row `value_destinations` reads `#charityevals:kaya-guides` and `#charityevals:first-embrace` (were `#ambitious-impact:...`, which stopped resolving once charityevals built models of the two); its explainer ("charityevals for Kaya Guides and First Embrace", "eleven" idea-stage estimates); summary and writeups/ambitious-impact-charityevals.md for stale figures; whether the move 48.5 to 9.4 is explained by these two inputs.

## Checked
1. References: both resolve (headline 9.362, not NaN). Count in the formula: 24 human-well-being refs = 10 GiveWell + ACTRA (HLI) + 2 charityevals + 11 Ambitious Impact idea-stage (alliance-for-reducing-microbial-resistance, concentric-policies, novah, learning-alliance, lead-research-for-action, oxygen-access-project, respira-health, labri, opal-health, neev, better-season-project): "eleven" in the explainer is right. Same treatment as Ansh: each charity read at its primary evaluator's figure on the rankings (`#owner:charity`); a charityevals model is the only other kind of owner and the charity files give each a `lines` entry with `^<id>-charityevals$`. The shared-figure rule is kept (no typed number, no own conversion).
2. Inputs: first-embrace-charityevals 5.248, kaya-guides-charityevals 0.784 years per $1,000 (headline, our view); the Ambitious Impact estimates they replace: first-embrace-aim 10.55, kaya-guides-aim 0.395.
3. Explainer text agrees with the formula (two charityevals, eleven Ambitious Impact, ten GiveWell, ACTRA).
4. The move is NOT explained by these two inputs. Scratch copy with the two refs set to the Ambitious Impact models (`#first-embrace-aim`, `#kaya-guides-aim`): 9.520 at the defaults against 9.362 now (-1.7%); at `mobiliser_share` 1 the tornado high end is 48.46 with them and 48.08 without (-0.8%). The 48.5 is the headline at `mobiliser_share` 1, the default before d4363785 ("the mobiliser's share defaults to 30%", between b58659bd and now); the fall to about 9.4 is that default, not the two charities. The cause of the fall for the restamp note and the changelog: the credit rule's 30% default, with these two inputs worth under 2% of it.
5. Preflight: passes.
6. Peers: 78x the cause's median (audit-model far-above, medium, standing since the model credits the founding of charities at GiveWell-level figures); round 6 reviewed this and the row behind it is the live read of the founded charities, unchanged here.

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | writeups/ambitious-impact-charityevals.md, bullet "What a dollar to its charities does" | Stale typed figure: "thirteen younger ones are Ambitious Impact's own idea-stage estimates"; only eleven are now, and the two charityevals-modelled charities are not named | Formula has 11 `#ambitious-impact:` refs for the human charities; explainer says "eleven" | Replace the sentence with: "ACTRA is the Happier Lives Institute's, Kaya Guides and First Embrace are charityevals', and eleven younger ones are Ambitious Impact's own idea-stage estimates." | none (text) |
| 2 | low | presentation | restamp / change note | The stated explanation (these two inputs) is wrong, see check 4 | 9.520 vs 9.362; 48.46 vs 48.08 | In the restamp note and the changelog entry, attribute the fall to the mobiliser share default of 30% (d4363785) | none |

Verdict: fix needed (one medium, a stale figure in the write-up; the model JSON and explainer are correct, no blocking preflight line)
Model-sha: f60a02a41fb54b2bb314fe0b5238b3aabd936d1f222437066cd91e8f2dc717ee
Rules: 0.1.0

(Numbered 7 on its branch; renumbered at merge.)
