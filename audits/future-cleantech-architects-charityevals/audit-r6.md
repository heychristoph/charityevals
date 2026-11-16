# Audit: future-cleantech-architects-charityevals, round 6 (verification of the two cost explainers only)
Result: 0.001216 tco2e/$ = 7.275e-4 years of healthy life per 1,000 dollars (unchanged; combined range 1.573e-5 to 0.03364).
Model-sha: fde487198e8be66c9891ddb8a93e5258a2622459db16f5c0463fe4c59e58c0ac
Scope: the `ren_tonnes_per_year` and `h2_tonnes_per_year` explainers and the matching write-up sentences. Mechanical: `audit-model.ts` reproduces the result and range; `check.ts` all models valid. No value or formula changed.

## Checks
| Claim | Check | Status |
|---|---|---|
| SWD(2021) 621 Parts 1 and 2 cost no target for innovative renewable capacity | Searched both Council texts (ST-10746-2021-ADD-3 and ADD-4, text-extracted) for innovative technology, new capacity, ocean, offshore, innovation target and sub-target. The option sets (section 5.3) cover the overall target, sectoral sub-targets, the transport target with a 3.5% advanced-biofuel sub-target, and RFNBO sub-targets; none is a share of new capacity from innovative technologies. The only "reserve a portion for innovative technologies" text (ADD-4, stakeholder workshop notes) is a stakeholder suggestion, not an option and not costed. | holds |
| Section 6.6 concerns sub-targets for hydrogen-based fuels | ADD-3 section 6.6 "Promotion of innovative renewable and low carbon fuels" is about RFNBOs and low-carbon fuels; options 3 to 6 of 5.3.2.4 are RFNBO and low-carbon-fuel sub-targets. Costs discussed there are for those fuels. | holds |
| "5% target came later from a Parliament amendment" | Not in these documents (they predate it); consistent with the 2021 proposal's contents above. Carried from earlier rounds. | not re-checked here |
| Delegated Regulation (EU) 2025/2359 came with no impact assessment and states no compliance cost | EUR-Lex text: no impact assessment or cost estimate in the act's recitals or articles; recital (7) only says the Commission should assess impacts later. About 8.6k characters at the end (annex tail) were not read by the fetch tool. | holds (annex tail unread) |
| Article 3 asks for an assessment of alternative pathways by 1 July 2028 | Article 3 (Monitoring and review): by 1 July 2028 the Commission shall assess the impact of the introduction of alternative pathways (nuclear low-carbon electricity, average-based emission intensity, country-specific standard values). The explainer's "assess alternative pathways by July 2028" is a fair short form. | holds |
| Write-up "What isn't modelled" sentences | Match the explainers (SWD(2021) 621 costs no such target; its innovation section covers hydrogen-fuel sub-targets; 2025/2359 no impact assessment, no figure). | holds |
| Write-up "How this model was checked", last sentence | Round 5 recheck and round 6 check of the two cost explainers: accurate. | holds |

## Findings
1. Low. The "no impact assessment" claim for 2025/2359 rests on the act's text as fetched, with the last 8.6k characters unread; delegated acts are normally adopted without one, so the risk is small. No fix needed.

No high finding.

Verdict: pass
Re-stamped (15 Nov 2026): damage beyond deaths in the tco2e bridge copy (mechanical); unmodelled_benefits_adj tagged side_effect added (2.16, mechanical; headline unchanged at the default); summary figure updated

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1a9667aa.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.
