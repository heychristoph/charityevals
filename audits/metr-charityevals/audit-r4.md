# Audit: metr-charityevals, round 4

Result: 0.108 years of healthy life per 1,000 dollars at mobiliser_share 100% (was 0.094). Verdict: pass (no high or medium; one low).
Model-sha: 6986e7b3ef14de166576d0fb961874cc86e4693f5b4fc95f4758dc65cda699b8
Scope: credit step 5, scoped to `attribution_share_shared` (0.7 (0.5-0.9) -> 0.8 (0.6-0.95)) and the class `research` on `attribution_share`.
Preflight: pass (lows only; distributions.json out of date, ignored).
Previous round: round 3 had no open findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | attribution_share_shared (source.quote, explainer) | The quoted sentence "These companies have also provided access and tokens..." is no longer on https://metr.org/about. The page now says "METR has not accepted funding from AI companies, though we make use of significant free tokens, which we use for evaluations, research, and engineering, as noted above." The fact (free tokens) holds; the quote is stale. | Fetched 17 Nov 2026 | Replace `source.quote` and the quoted text in the explainer with the current sentence; set retrieved to 2026-11-17. Model access before release is cited by the evaluation reports on other rows. | None |

## Checks on the listed rows
1. Denominator: now METR's own activity plus in-kind inputs (model access, tokens), which pass 2.24's co-funder test as donated goods and partners' inputs flowing into METR's own work. The companies' staff time in taking up the evaluations is removed to the adopter side (mobilised), as 2.24 requires for adoption of research by labs. No co-advocate named in the old text was dropped without reason; no adopter, enforcer or mobilised funder remains. Right split.
2. Claims: free tokens and no company funding verified (see above); cloud computing $1.09M (Part IX line 14) and no fees are from the cited 990 and the earlier audit rounds, not re-fetched. Anchor is METR's own page and accounts.
3. Value: in-kind inputs worth around 20-25% of METR's $6.9M gives 0.75-0.8 (the 2024 cloud bill alone is $1.09M, so free tokens of similar size give about 0.8). 0.8 (0.6 to 0.95) is a fair best guess and the explainer's own reasoning ("work is METR's own but runs on the companies' models and tokens") matches it. The explainer does not give arithmetic, so none to contradict.
4. Class: `attribution_share` = shared x mobiliser_share, `"credit": "research"`, read once in `total_adj`; no other row reads the mobiliser's share. No cost rows read the branch share, none needed here (no mobilised spending modelled). Correct, taken once.
5. "Would it have happened anyway" stays in `counterfactual_adj` (0.65) and years_of_impact; the share no longer carries any adoption question. No loss or double count.
6. Text: summary has no share figures. writeups/metr-charityevals.md line 33 already says 0.8 and "model access and free tokens"; line 13 consistent. No stale figures; no writeup edits made.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| attribution_share_shared | https://metr.org/about | verified (fact), mismatch (quote) | see finding 1 |

## Drivers
Not re-assessed (scoped round).
