# Audit: centre-for-long-term-resilience-charityevals, round 4 (scoped verification, credit rule 2.24)
Result: 0.006482 daly/$ = 6.48 years of healthy life per 1,000 dollars (combined range 0.28-151). Verdict: pass.
Model-sha: 32214cbcf4943f9ecbef39968a1a7df8253254a0a8dec265e4753f44663d9ec3
Scope: only the re-judged rows ai_, bio_ and rm_attribution_share_shared, the classes on the used shares, and text that quotes them. No full re-audit.
Preflight: pass (only the out-of-date distributions line, ignored).
Previous round: round 3 had no findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | ai_attribution_share_shared | The explainer says "some reports are written with partners" and "from the partners named on its reports". Of the AI reports checked (Preparing for AI security incidents; the Loss of Control Observatory), neither names a co-author: the first lists Tommy Shaffer Shane alone, the second "Author(s): Centre for Long-Term Resilience", partly funded by the UK AI Security Institute with "CLTR retains operational independence" (a funder of CLTR's own budget, not a co-author). The 0.9 stands; the stated basis is not shown. | longtermresilience.org/reports pages, fetched 17 Nov 2026 | Reword to: "0.9 (0.7 to 1), our judgment: the AI reports checked are CLTR staff's alone; the 0.7 end allows for co-written work and joint events not visible on its pages." | none |
| 2 | low | presentation | writeup "How this model was checked" | Said only that the biosecurity share was raised from 0.8 to 0.85; the shares are now 0.9, 0.9 and 0.8. | writeup line 54 | Done by this round: sentence added on the re-judging and this verification round. | none |

## Checks per row
| Check | Result |
|---|---|
| 1. Denominator is co-advocates only | ai: officials and companies removed (adopters), partners only as a possible co-author. bio: RAND Europe, the named co-author of the AI-biology risk index, kept; civil servants' roundtable time removed (adopters). rm: civil servants and ministers removed; the outside voices (Institute for Government, National Preparedness Commission, as named in rm_counterfactual_adj) kept. No named co-advocate dropped. |
| 2. Facts | RAND Europe collaboration verified on the biosecurity page ("a new risk index to monitor AI-enabled biological tools in collaboration with RAND Europe"). AI partners: see finding 1. Risk management's many outside advisers: consistent with the sources named in rm_counterfactual_adj (not re-fetched). |
| 3. Value and range | ai 0.9 (0.7-1), bio 0.9 (0.7-1), rm 0.8 (0.5-1): best guesses given mostly own-staff output; rm below the policy units, as its explainer says, for the more crowded field. No arithmetic in the explainers to contradict. |
| 4. Classes | ai, bio, nuclear, fb "research", pol and rm "win": each used share is `<branch>_attribution_share_shared * mobiliser_share` and nothing else in the model reads mobiliser_share, so it is taken once per branch. The own-services class is not relevant: all branches are advice and research. rm_ as "win" is acceptable (advice that changes how government assesses risk); both classes read the same setting. |
| 5. Counterfactual | Not touched: "would have happened anyway" stays in the *_counterfactual_adj rows and years_of_impact; the shares no longer carry the adopters, so nothing is cut twice. |
| 6. Text | Summary's "about 85%, a tenth, the rest": recomputed branch products after adjustments (bio 92,176 x 0.85 x 0.75 x 0.9 = 52,891; AI 18,683 x 0.6375 x 0.6 x 0.9 = 6,432; rm 15,362 x 0.4 x 0.7 x 0.8 = 3,441): 84.3%, 10.2%, 5.5%. Holds, and the writeup's "about 85%, a tenth, about 5%" too. Writeup table shares 0.9/0.9/0.8 match the model. Headline 6.482 (writeup uses a placeholder). No stale 0.5-1 ai range, 0.6-1 bio range or 0.75 rm anywhere. |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| bio_attribution_share_shared | https://www.longtermresilience.org/biosecurity/ | verified | RAND Europe collaboration |
| ai_attribution_share_shared | https://www.longtermresilience.org/ai/ and two report pages | unsupported (partners) | see finding 1 |

## Drivers
Not re-assessed (scoped round). The credit shares now matter little at s = 100% (bio 0.9 versus 0.85 earlier) and are scaled by the mobiliser setting.
