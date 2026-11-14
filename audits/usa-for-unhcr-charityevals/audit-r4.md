# Audit round 4 (verification): usa-for-unhcr-charityevals

Scope: the two text edits since round 3 (HEAD 4f9d26b against 334b6a0).

## Checks
- `git diff 334b6a0 -- models/`: 2 lines changed, only the summary and the `pro_doc_rights_share` explainer. Nothing else changed.
- Summary: "about 38% of each cash dollar pays for fundraising and management". On the cash basis overhead_ratio = total_expenses / program_expenses = 84.91M / 52.70M = 1.611, so 1 - 1/1.611 = 38.0%. Correct. The rest of the sentence is unchanged.
- `pro_doc_rights_share` explainer: names UNHCR, Global Trends: Forced Displacement in 2024 (the ~40 million under UNHCR's care) and the Global Refugee Work Rights Report 2022 (CGD, Refugees International, Asylum Access) for the half-in-hosts-with-work-rights anchor. Arithmetic (8% x 50% x half = 2%, range 0.5-8%) and value unchanged. Both are named reports, and this is a judgment row, so the naming meets the round-3 low.
- `audit-model.ts`: 0.06033 years per $1,000 (combined range 0.0136-0.268), unchanged; no high finding; only the known low (spread, stated in the summary).

## Findings
None. Round 3's two lows are resolved.

## Verdict
Verdict: pass. No high or medium finding; the result is unchanged at 0.060.

Model-sha: a2f538aa3ec834f09ee92bfd5506fd6142d3adb4b83582fe72ab7ed0e8e7a1a0
