# Audit: sentinel-bio-charityevals, round 4 (verification of the change to destination_reads)
Result: 0.004575 daly/$ = 4.57 years of healthy life per 1,000 dollars (combined range 0.34–61.7; model's own ranges 1.6–10.6); cause median about 5.26 (×0.87, median from round 3, not recomputed). Verdict: pass.
Model-sha: 9adcd9ecf3e0ed14389fef1b08e642ff29b2283be1219024bd26ca4375bc44d5
Scope: unchanged (everything spent in the first tax year, 16 May to 31 December 2024). Only what changed since round 3 was checked: the engine's `destination_reads` and the model rows that changed with it. No source was fetched again.
Mechanical: lint 0/0/1 (pol_cost_share unused, context), invariants none, normalization-audit 0 violations (generated/ restored), check.ts all models valid.

Previous round (round 3):
1. **(low, write-up "How this model was checked") not changed, optional.**
2. **(low, prior_dollar_value read mode) resolved.** The prior no longer reads its members as stand-ins: `destination_reads` lists the Council on Strategic Risks, Epoch AI, the Johns Hopkins Center, GiveWell's four top charities, givedirectly, cause:global-health and cause:catastrophic-risk, so the shared row is read at the members' figures with their steps. prior_dollar_value = 0.01029 (was 0.01275 in the stand-in read), as the change predicted.

Checks asked for:
1. **One missing-data step per source.** (a) Council on Strategic Risks grant: value_csr (0.02395) is read as a destination, with the Council's own step, age and risk; nothing of Sentinel's is applied on top (live_grants_uov = grant_csr × value_csr + grant_epoch × value_epoch = 7,371, then live_uov = live_grants_uov + informed_money_value, no adjustment row). (b) Epoch grant: same, at Epoch's own step. (c) Advised gift: informed_money_value = informed_money (322,800) × shifted_dollar_value (0.004758) × evidence_adj (0.8286) × missing_data_adj (0.5) = 636, which reproduces by hand. One step for the advice (missing_data_adj, the shared rule for advice) plus the Center's own step inside value_destinations (0.01504). Those are two different sources (the advice's own outcome not measured; the Center's outcome), each once. The prior inside shifted_dollar_value takes its members' steps. (d) The Maryland and Rosetta fellowships, and the three typical grants: Sentinel's own pandemic step, once, through missing_data_adj in total_adj; the live terms are added after total_adj (outcome_total), so total_adj does not reach them. (e) `live_missing_data_adj` is gone from the model; grep finds no mention in the model or the write-up. Nothing twice, nothing missing. The distance weight is Sentinel's own (spread by world population), not the targets'.
2. **Prior read.** The prior's references are read the way a "destinations" model reads the same shared row (longview-philanthropy-charityevals has the same prior_dollar_value form with its cause refs, read at the cause members' figures with their steps). Same row text, same read mode. `#cause:climate` stays a stand-in (climate option, share 0), as intended.
3. **Explainers and write-up.** The explainers of live_cost_share, live_grants_uov, live_uov, informed_money and informed_money_value say that the recipients carry their own adjustments and that the advice carries its own steps; none mentions the removed row. Branch shares, by scratch runs at the defaults (headline 4.5745): no fellows (fb_people 0) −20.4%; no typical grants (bio_cost_share 0) −51.3%; no Council grant (value_csr 0) −25.7%; no advised gift −2.2%; no Epoch grant −0.04%. The write-up's "about half, a fifth, a quarter, a few percent, Epoch almost nothing" is still right. "The result stayed at about 4.7" in "How this model was checked" is now about 4.6 (4.57): low, below.
4. **Mechanical.** `scripts/check.ts sentinel-bio-charityevals`: all models valid. `scripts/normalization-audit.ts`: no violation (INV-18's text on destination reads included). The tornado's top inputs are as in round 3 (no new input on the path).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up "How this model was checked" | "The result stayed at about 4.7" and "with the missing-data discount taken on the grants read live" describe the earlier build; the grantees' steps now come from their own figures on the rankings, and the headline is 4.57. | write-up, last paragraph before Sources. | Say "about 4.6" and replace the discount clause with "the grants read live carry their recipients' own missing-data steps, and the advised gift its own". | none |

## Sources checked
None changed; the round 2 and 3 checks stand.

## Drivers
Unchanged: discount rate, years a win counts, missing-data discount, the shared bio cut estimates, @next_dollar.sentinel_bio; own judgments bio_evidence_adj, bio_cf_other_orgs, fb_share_working. Round 3's engine limitation is gone.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline 4.571 → 4.592 (+0.47%), 9 rows changed, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against e8ecb2b3.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7dbeec92.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.
