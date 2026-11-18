# Audit: environmental-defense-fund-charityevals, round 15 (scoped verification of credit step 5, rule 2.24)
Result: 0.001046 years of healthy life per $1,000 at mobiliser_share 100% (0.001033 before). Verdict: pass (no high or medium finding).
Model-sha: 5f3cc9ad4c90d2993d42944b633defd10cb8d9cd26f21bd3e5b50358f844c974
Rules: 0.3.11
Scope: `msat_attribution_share_shared` (0.6 (0.4-0.8) -> 0.7 (0.5-0.85)), the `research` class on `msat_attribution_share`, and a read of the other branches' share explainers (eumr, usmeth, pwr, veh, ira) for adopters left in a denominator.
Preflight: pass (only the out-of-date generated/distributions.json line, ignored as instructed).
Previous round: round 14's two mediums were resolved; no open high or medium.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | msat_attribution_share_shared | The row has no `source` object; the partners it names (New Zealand government and space agency, Harvard, Smithsonian, Google) are only partly checkable. NZ Space Agency as co-funder (NZ$26M) and the Bezos Earth Fund's US$100M grant to EDF (a donor inside these accounts) are confirmed on Wikipedia's MethaneSAT page; Harvard, Smithsonian and Google were not found on the pages fetched. | fetch of en.wikipedia.org/wiki/MethaneSAT and methanesat.org/about | Add a `source` with EDF's MethaneSAT partners page (or the 2024 launch release) and keep the note "the share is our judgment". | none |

Checks 1 to 6 for the listed row:
1. Denominator: counts EDF's own donors plus partners who put resources into the project (NZ government and space agency, Harvard, Smithsonian, Google). The companies and regulators acting on the data are out and stated to sit under the mobiliser's share. No named partner was dropped without reason.
2. Claims: NZ government and space agency a partner (NZ$26M) and the large donor funding inside EDF's accounts hold. Google, Harvard and Smithsonian not reached (low above).
3. Value: NZ's about US$16M and the in-kind science and processing against EDF's capitalised $81.4M plus operations gives a money share near 80%; 70% (50% to 85%) after in-kind partner inputs is a defensible best guess, consistent with the explainer.
4. Class: `research` on `msat_attribution_share = msat_attribution_share_shared * mobiliser_share` is right (regulators' and companies' use of the data is adoption). The share enters `msat_total_adj` once. The satellite's cost (write-off less insurance, `msat_writeoff_per_year`) is EDF's own spending and stays at 100%, correctly outside s. `msat_expected_tonnes` and the weighted-average display rows read the shared figure, for reading only, as for every branch.
5. Counterfactual: "would have happened anyway" stays in `msat_counterfactual_adj` (70%, other satellites) and the judged cut share and years; the share does not carry it. No double count.
6. Text: the model summary and writeups/environmental-defense-fund-charityevals.md do not quote the MethaneSAT share or any figure derived from it (the write-up's shares are the win branches' 25/15/10/8/2%, unchanged). No writeup edit needed.

Other branches (adopters in a denominator?): none.
- eumr: EDF Europe, CATF, Bellona, ECOS, EIA, national groups; "industry lobbying on both sides" is advocacy. Clean.
- usmeth: CATF, NRDC, Earthjustice, Sierra Club, Earthworks, state groups, Moms Clean Air Force; industry lobbied against. Clean.
- pwr: NRDC, Sierra Club, Earthjustice, CATF; utilities' and coal states' lobbying is advocacy. Clean.
- veh: NRDC, Sierra Club, UCS, ALA, ICCT; carmakers and dealers lobbied on both sides. Clean.
- ira: groups and "a much larger industry lobby" (advocacy); legislators and the administration are stated as already left out. Clean.
All five carry `credit: win` on the used share, multiplying by `mobiliser_share` once.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| msat_attribution_share_shared | https://en.wikipedia.org/wiki/MethaneSAT | verified (partly) | Funded and operated by EDF and the NZ Space Agency; NZ$26M; Bezos Earth Fund US$100M to EDF. Harvard, Smithsonian, Google not found. |
| msat_attribution_share_shared | https://www.methanesat.org/about/ | unsupported | Partner names not found in the fetched text. |

## Drivers
Not re-assessed (scoped round). The change moves the headline +1.3% at s = 100%.
