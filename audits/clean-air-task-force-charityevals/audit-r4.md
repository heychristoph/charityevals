# Audit round 4: Clean Air Task Force (scoped verification)

Scope: only the changes of commit 9e17551 to this model and the shared files it reads (assumptions/default.json tco2e unit, facts/climate.json, docs/normalization.md, src/engine/invariants.ts, the INV-10 waiver), against round 2's findings 1, 5 and 6, and the summary and write-up.

## What was checked

1. Methane in the shared conversion (round 2 finding 1).
   - The `to_common` formula is right. Heat: `(1 - methane_share) * (1+r)^-60 + methane_share * 0.5 * (1+r)^-23`, so the non-methane part is unchanged and the methane part has its own delay and ratio. Ozone: `methane_share * ozone_deaths_per_tco2e_methane / (1 + ln(1+r) * 11.8)`, which is the integral of an exponential decay of the extra methane discounted at ln(1+r), 0.68 at 4%. It is valued with the air-pollution age mix, like other air deaths.
   - No double count: the model's `extra_deaths_per_tco2e` is now formula 0 (relabelled), so the ozone enters once, through `methane_share`. At the defaults the heat and ozone parts of a methane tonne are each about 5e-4 units of value (heat 8.7e-6 deaths x 59.7, ozone 1.06e-5 x 47.6), so "ozone about as much as its heat deaths" in the write-up is right, and a methane tonne is about 4.2 times a CO2 tonne's discounted heat deaths, as the unit explainer says.
   - Facts' derivation. I re-ran the AR5 8.SM.11 impulse responses (the CO2 airborne fraction and the two-box temperature response named in the note; methane over its 11.8-year lifetime, scaled to GWP100 equality; temperature summed to 2300): the 4% discount-weighted delay is 60.4 years for CO2 (the site's 60) and 22.5 for methane (23), and the undiscounted ratio is 0.50 (the note says 0.51). The derivation is coherent and the CO2 anchor matches the site's own figure. `methane_lifetime_years` 11.8 (10 to 13.6) is the AR6 value and the range is its stated plus or minus 1.8. `methane_heat_death_delay` (23, 18 to 30) and `methane_heat_deaths_vs_co2` (0.5, 0.3 to 0.8) are `kind: judgment` with a derivation and named cross-checks (EPA social cost of methane about 8.5 times CO2, 0.29 of GWP100), which is the right kind and an anchored range. The IPCC page is bot-blocked, as the note says; the parameters I used are the published ones and reproduce the note's numbers.
   - INV-10: `src/engine/invariants.ts` holds `methane_share` at 0 for the `$deaths_per_tco2e` proportionality check of tco2e models (bridged parts too), and the CATF waiver is removed from `normalization-waivers.json`. `check.ts` reports all models valid and `audit-model` finds 0 invariant violations, so INV-10 holds without the waiver.
   - Model rows: `methane_share` explainer now names the shared figures; the summary and write-up describe methane's own earlier warming and its ozone.
2. Capture delivery anchor (round 2 finding 5). The fact's note cites CSIS (28 July 2025). Fetched: "enough installed capacity to capture over 20 million metric tons per year" and announced facilities "with a combined capture capacity of over 130 Mtpa" (over 130 facilities). Both match. The explainer's "by mid-2025 running was still about 20 million tonnes a year, about the level before the law" follows from the CSIS figure and the Carbon Capture Coalition number the note gives (22 Mt at 19 plants). The 60 Mt judgment (20 to 185) stays within the evidence.
3. Other groups' resources (round 2 finding 6). ProPublica Nonprofit Explorer for EDF (EIN 11-6107128): total expenses $356,751,950 for the fiscal year ending September 2025, matching "$357M". Gizmodo (published 6 February 2026): "an $88 million satellite designed to track methane emissions" matches "$88M". Both explainers (`eumr_` and `usmeth_attribution_share_shared`) carry the figures with the source in the row; the 20% and 10% judgments are unchanged, and EDF's scale supports them.
4. Summary and write-up. `audit-model` bottom line is 0.006591 years of healthy life per $1,000, which rounds to 0.0066; the model summary and the write-up's headline both say 0.0066. `scripts/headlines.ts` prints 0.00659143. The write-up's methane sentences (sooner, discounted less; ozone about as much as heat; the driver bullet on methane's ozone per tonne, "a third to three times", matching 0.05 to 0.48 around 0.16) match the model. "+3.5%" for the change matches 0.00637 to 0.00659. The tornado shows the ozone fact moving the result 0.0045 to 0.0127.

## Commands

- `npx tsx scripts/audit-model.ts models/climate/clean-air-task-force-charityevals.json`: 0 findings (warnings as before: wide plausible range, share of uncertainty from judgment calls, 14 point inputs on the path). Combined range 2.4e-4 to 0.18; the model's own ranges with shared figures at best 5.3e-4 to 0.066. The only hand-built tco2e peer is woodland-trust-sogive (8.9e-4).
- `npx tsx scripts/check.ts clean-air-task-force-charityevals`: all models valid.

## Previous round

- Finding 1 (methane timing and ozone discounting): resolved in the shared conversion (formula, facts and INV-10 above).
- Finding 5 (capture delivery anchor): resolved (CSIS verified).
- Finding 6 (other groups' figures): resolved (ProPublica and Gizmodo verified).
- Findings 2 (docs), 3 (other methane models) and 4 (VOC share, fixed in round 3): docs/normalization.md section 2.5 now describes the rule and lists the methane shares of the other models.

## Findings

None.

Verdict: pass
Model-sha: 5df9500f0e7a51ce6d2dcbf45c6e045e3abbf67ed95d3dec27a94acbcc60b6cf
