# Audit: the-bail-project-charityevals, round 3
Result: 1.251e-5 daly/$ = 0.0125 years of healthy life per 1,000 dollars (combined range 0.0020–0.0779); cause median 0.0682 (about a fifth, as the summary says). Verdict: pass (no high findings).
Model-sha: 771f4aa65d519fb815524e380e0665b1b2c12d631f92dc88a6566d5792714bbe
Scope: unchanged from round 2 (bail assistance and client support line, fiscal 2025). Verification round: only the round-2 findings and the changed rows, facts, summary and write-up.
Mechanical: audit-model lint 0 high/medium/low; check.ts: all models valid; simulation-check: stable (5% 0.276x, 50% 1x, 95% 3.1x the best guess; the only warnings are the usual range and judgment-share notes); normalization-audit: no violation mentions `bail_leverage_funging` or either Bail Project model (generated/ restored with git checkout).

Round-2 findings:
1. INV-4 coincidence of `bail_leverage_funging`: settled. The fact is now 0.94 (0.83 to 1.02), retitled "charityevals' judgment for charitable bail", with an explainer anchored on bail (families, bondsmen's fees and other funds pay some bail; no government pays bail; grants to partner funds are in the cost). No other model's value matches, and the audit shows no INV-4 hit from it.
2. Unstable simulation: settled. `days_prevented_fy2025` (81,732) and `clients_fy2025` (5,394) are single observed facts, no longer remainders of drawn cumulative counts; the spread is 0.28x to 3.1x.
3. Bailouts from the charity's own counts: settled. `bailouts_fy2025` is a shared estimate fact, 3,300 (3,050 to 3,570); `days_per_bailout` = days / bailouts (about 25, 40 kept as the cumulative cross-check in the explainer); `pilot_clients_fy2025` = clients - bailouts (about 2,100); cost per bailout about $2,900. Result moved 0.0106 to 0.0125 (+18%), the +20% the auditor predicted.

New findings: none above low.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | facts `bailouts_fy2025` note | The range's low end uses 31,525 (34,525 clients less the Chicago pilot's 3,000), which treats every other client before June 2024 as bailed out and the pilot clients as all in Chicago; the note states only 31,000 to 31,500. 34,572 - 31,525 = 3,047 and 34,572 - 31,000 = 3,572 reproduce 3,050 and 3,570. | 2024 report PDF p. 27 "more than 31,000 people", p. 17 "has served 3,000 people"; 2025 report "34,572 bailouts". | Optional: state in the note that 3,050 comes from 34,525 - 3,000 = 31,525. | none |

Consistency: summary and write-up read about 3,300 bailouts, 2,100 pilot clients, about 25 days, about $2,900 a bailout, $9.7M cost, 5,394 clients, 0.013; these match the rows ($9.7M / 3,300 = $2,940; $9.7M / 5,394 = $1,800). The write-up's "Bailouts in the year" uncertainty says ours is derived from cumulative counts, as the facts do.

## Sources checked

| Row | URL | Status | Note |
|---|---|---|---|
| `days_prevented_fy2025` | https://bailproject.org/2025annualreport/, https://bailproject.org/annualreport2024 | verified (round 2 quotes) | 1,381,170 - 1,299,438 = 81,732. |
| `clients_fy2025` | same | verified (round 2 quotes) | 39,919 - 34,525 = 5,394. |
| `bailouts_fy2025` | same | verified by arithmetic from round-2 quotes | 34,572 bailouts; "more than 31,000" (p. 27); Chicago pilot 3,000 (p. 17). |
| `bail_leverage_funging` | judgment | no source number | anchored on the bail setting; no longer equals another model's value. |

Verdict: pass (0 high).
Model-sha: 771f4aa65d519fb815524e380e0665b1b2c12d631f92dc88a6566d5792714bbe
