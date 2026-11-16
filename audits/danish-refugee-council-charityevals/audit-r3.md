# Audit: danish-refugee-council-charityevals, round 3 (verification)
Scope: only the changes since round 2 (pass, 3 lows): csh_transfer_share, goods_share explainer, shl_mic_share explainer, the summary's combined range, the write-up (cash $87, food security $61, "How this model was checked").
Mechanical: audit-model 0 findings (no high, medium or low); generated/ untouched. Headline 0.0682 years of healthy life per $1,000 (round 2: 0.0703; round 2's predicted 0.0683); combined range 0.0158-0.2941.

Previous round:
1. csh_transfer_share: resolved. Row is 0.47 (0.33-0.67); 0.50/1.0593 = 0.472, 0.35/1.0593 = 0.33, 0.71/1.0593 = 0.67. The explainer says it is NRC's 50% (35-71%) divided by 1.06 for project support. Result moved -2.9%, as predicted. The write-up's "just under half ... about $87 a person" fits the row's value (csh_transfer_per_person falls from $92).
2. goods_share explainer and food security $ a person: resolved. The explainer now reads "Used for food security, shelter and infrastructure (cash uses csh_transfer_share)". The write-up says $61, matching value_delivered_per_person as round 2 computed it.
3. shl_mic_share: resolved in the text: "nearly 6,000 war-damaged homes repaired in Mykolaiv oblast since the operation began, p. 31", the wording round 2 asked for from the report's sentence ("Since the beginning of its operation ... repaired nearly 6,000 conflict-damaged homes", Mykolaiv). I could not re-read the report text this round (the scratchpad text file was missing and the PDF's text layer didn't fetch), so I rely on round 2's verbatim reading. The 35% judgment is unchanged.

Other changes checked:
- Summary combined range now 0.02-0.29: matches 0.0158-0.2941. Its "about 0.07" and the shares (cash about 60%, food security about 15%) stay right against round 2's shares (59%, 15%); the 2.9% fall doesn't move them.
- Write-up "How this model was checked": says round 2 passed with three lows, all fixed, and the result went from 0.073 to 0.068; 0.073 is round 1's headline per the round 2 note's chain, 0.068 matches the headline now. Fine.
- beneficiaries reformatted to multi-line with the same values (checked in the diff); no other row changed.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
(none)

Verdict: pass (0 high, 0 medium, 0 low)
Model-sha: e8575944c6ed894da6cbdc846cdef6e528e12087dc36d2d5d2327786d4afe7e9

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)

Re-stamped (16 Nov 2026): Typed refugee-relief figures now read shared facts (@humanitarian_response.*, @ukraine.war_affected_aid_recipients_consumption_share) at the same values; judgment explainers anchored on studies and published data (pre-audit gate cleanup). Mechanical: headline unchanged, against bebc953e.

Re-stamped (16 Nov 2026): Local market spillover reads the new shared fact cash.local_market_spillover_share (same value and range). Mechanical: headline unchanged, against 2b148c62.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 8904b83b.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.
