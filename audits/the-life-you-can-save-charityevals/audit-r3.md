# Audit: the-life-you-can-save-charityevals, round 3 (verification of the round-2 fix)
Result: 14.03 years of healthy life per 1,000 dollars; cause median 0.0686 uov/$ (×204). Verdict: pass.
Model-sha: b8da8f1ea16e112513819f454d393720aa787cdf77e8b29dcdcb5a050f1c293a
Scope: only the round-2 finding (next-dollar figure), fixed in e683fb67.
Mechanical: `scripts/audit-model.ts` shows one medium (far-above, judged in rounds 1 and 2), no high; the bottom line is 14.03 years per $1,000.
Previous round: finding 1 (next-dollar room from the Australian balance sheet): resolved.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | facts/next_dollar.json the_life_you_can_save | room 0.5 x use 0.55 x run 1.0 is 0.275; the value is stored as 0.28 and the explainer says "= 28%" | 0.275 rounds to 28%; stored 0.28 vs 0.275 is 1.8% | Optional: store 0.275 | none material |

Checks:
- ACNC AIS 2024 row (ABN 90623716370): net assets 5,194,276, total assets 6,845,789, liabilities 1,651,513, revenue 15,234,482, expenses 10,894,880 (period 01/01/2024 to 31/12/2024). All match the note.
- Financials 2025: A$14,498,577 revenue and A$14,047,381 expenses (surplus A$451,196, "about A$451,000"); the 2024 column A$15,234,482 / A$10,894,880 matches the ACNC row; US operations $1,074,897 against $2,186,576. Form 990: net assets without donor restrictions $1,121,165 (Part X line 27), -$246,086 (Part I line 19).
- Reserves: (5,194,276 + 451,196) x 0.644745 (facts/fx.json) = $3.64M, plus $1,121,165 = $4.76M; over $2.617M a year (the annual report's 2025 operating expenses) is 21.8 months, "about 22"; over the quoted $2.61M, 21.9.
- Products: best 0.5 x 0.55 x 1.0 = 0.275 (28%); low 0.35 x 0.4 x 0.9 = 0.126 (13%); high 0.75 x 0.8 x 1.05 = 0.63 (63%). The stored 0.13 / 0.28 / 0.63 match the note, explainer, summary, model row, and write-up (28%, 13% to 63%).
- The model's `marginal_vs_past_average` explainer, summary (about 14 years, 28%) and write-up (28%, 13% to 63%, A$5.2 million at the end of 2024, about 22 months, $4.8 million) agree with the fact and with the live result of 14.03. The write-up's "balance sheet for the end of 2025 isn't published yet" is consistent with using the 31 Dec 2024 figure plus the 2025 surplus.
- No comparison with other charities, medians or peers in the summary or write-up (grep for median/peer/other charities finds only the sentence on where the other half of the new-money share would have gone, which is not a comparison).
- `git status`: only the untracked scripts/zz-dump-tlycs.ts; generated/ untouched.
Re-stamped (15 Nov 2026): TLYCS destinations: GAIN and Village Enterprise now read their new models (14.0 -> 13.1; mechanical)
Re-stamped (15 Nov 2026): TLYCS destinations: IGN and TaRL Africa now read their new models (13.1 -> 12.7; mechanical)
Re-stamped (15 Nov 2026): shared LMIC learning-to-earnings and iodine facts (consistency, mechanical)
Re-stamped (15 Nov 2026): TLYCS destinations: Carbon180 reads its new model (mechanical)
Re-stamped (15 Nov 2026): TLYCS destinations: Evergreen reads its new model (mechanical)
