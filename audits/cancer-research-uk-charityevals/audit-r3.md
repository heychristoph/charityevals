# Audit: cancer-research-uk-charityevals, round 3 (verification)

Result: 1.662e-6 daly/$ = 0.00166 years of healthy life per $1,000, unchanged from round 2 (the changes since then are explainers, write-up text and the BHF model). Verdict: pass.
Model-sha: ca495fe9527d5b0cbf86d17b45c3af53906aa341778947cfe00fd5e5f16641aa

Scope: only the changes since round 2 (git diff 796c205 593699e): the explainers of `research_attribution_share_shared` and `research_dalys_per_gbp_credited`, the write-up's check ratio and "How this model was checked" history, and round 2's medium (the british-heart-foundation-charityevals share of the field, its summary, write-up and beneficiaries note).

Mechanical: audit-model on both models: 0 high, 0 medium, lows only (CRUK: 3 unused context rows, far-below and spread, all as in round 2; BHF: 2 unused context rows, far-below, spread; the summaries state the last two). check.ts cancer-research-uk-charityevals: all models valid. CRUK result unchanged (0.001662).

## Findings

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | medium | british-heart-foundation-charityevals write-up, "What drives the result" (line 66) | Stale after the share change: "Research is about 93% of the result, policy about 5% and the pilots about 2%". Zeroing the research share gives research 87% of the result (matches the new beneficiaries note, world 0.87 / GBR 0.13); the write-up still says 93%. | Change to 87% and recompute policy and pilots from scratch copies (together 13%). |
| 2 | low | cancer-research-uk-charityevals `research_attribution_share_shared` explainer | Arithmetic slip: "Those anchors alone give 0.46% to 0.98% (industry at 38% or 25%)". With $16bn non-commercial and $580m: industry at 38% gives 0.46%, at 25% gives 0.66%. 0.98% is industry at 15%, not 25%. The stated conclusion (range 0.3% to 1.2% is wider than the anchors) still holds. | Write "0.46% to 0.66%" (38% or 25%). |
| 3 | low | british-heart-foundation-charityevals write-up history | Line 94 ("BHF's share of the field: now counts all of industry's research, which leaves it at 1%") is an old history entry, now superseded by the 2026-11-13 entry below it; fine as history, but a reader may take it as current. | Optional: append "(1% until 2026-11-13, see below)". |

## Checks of the requested changes

1. `research_attribution_share_shared` explainer (CRUK): the $288bn × 30% = $86bn plus $16bn gives a field of about $102bn, share 0.57% (about 0.6%); the "$100bn" and "some $85bn from industry" agree. Range 0.3% to 1.2% reasoned as wider than the anchors; 30% as a judgment (25 to 38%) is labelled as one. The BHF sentence is accurate: BHF now counts industry the same way. The slip is finding 2.
2. `research_dalys_per_gbp_credited`: computed with the engine. Chain 8.09e-6, reference 2.32e-4: ratio 28.7, "about a thirtieth" and "about 30 times" are right. With years_brought_forward (15), share_burden_averted_per_research_year (0.5%) and research_attribution_share_shared (1.2%) all at their high ends the chain reaches 0.67 of the reference: "about two-thirds" is right (the first two alone give 0.34). The remark that BHF's chain is "about half the reference" checks: 0.57 (chain 1.13e-4, reference 2.00e-4).
3. "How this model was checked" history: round 1 and round 2 entries match the audit files (round 2: pass, 1 medium, 2 low; the lows were the range wording and the ratio). The BHF line ("halves its result") matches: 0.0208 to 0.0104.
4. BHF fix: `research_attribution_share_shared` 0.005 (0.003 to 0.008). $288bn × 7% = $20.2bn plus $5.5bn non-commercial = $25.7bn; $127m / $25.7bn = 0.49%. At industry 12%: 0.32%; at 4%: 0.75%. The range matches. The IQVIA 38% oncology anchor is the one verified in round 2; the 7% cardiovascular share is stated as a judgment (4 to 12%). The summary (about 0.5%, about 0.01 years per $1,000), the write-up's 0.01 headline, check ratio ("about twice", chain 0.57 of the reference), uncertainty line (0.3% to 0.8%) and change note are consistent. The beneficiaries note (world 0.87, GBR 0.13) in the model and in scripts/beneficiary-countries.ts agree with each other and with the computed branch share, apart from finding 1 in the write-up.

## Sources checked

No new sources were introduced since round 2; the figures above were recomputed from the model rows. Unchanged anchors (Evaluate Pharma $288bn via BioSpace, IQVIA 38% oncology trial starts) were verified in round 2.

Verdict: pass. Findings: 0 high, 1 medium, 2 low.
