# Audit: ican-charityevals, round 3
Result: 0.007595 daly/$ = 7.6 years of healthy life per 1,000 dollars (combined range 0.27–217; model's own ranges 0.12–630). Verdict: pass (one low finding on a citation's wording).
Model-sha: 4ae5e3c4219707625532312808c2970a14c6da7eded449512f986a562b68a190
Scope: scoped verification of the four round-2 fixes (commit 8e359e1) and the write-up. Nothing else re-audited.

Fixes against the round-2 findings:
1. nuclear_implementation_share: now 0.15 (0.05–0.4); the explainer says the pages show about 5-10% and reasons why the Geneva staff's diplomatic work is above that. Resolved. nuclear_evidence_adj = 0.15 × 0.1 + 0.85 × 0.3 = 0.27, as the write-up's table says.
2. facts/next_dollar.json `ican`: note now 77/23 with 0.77 × 0.7 + 0.23 × 0.6 = 0.68; explainer says 0.8 × 0.68 = 54% (0.24 to 0.90 unchanged); the fact stays 0.54. Resolved.
3. nuclear_attribution_share: 0.55 (0.35–0.9) with partners' costs $1-1.5M; 1.6 / (1.6 + 1 to 1.5) = 0.52–0.62, 0.55 inside it. Resolved.
4. tpnw_vs_typical: both anchors now cited, see finding 1 for what the sources say.

Computed values against the write-up: headline 7.595 (write-up "8", summary "about 8"); range 0.27–217 (write-up and summary "0.27 to 220"); 0.1% discount rate 26.4 (write-up "26"); treaty swing 5.73–26.27 ("6 to 26"); campaign-versus-typical swing 3.0–20.5 ("3 to 20"); nuclear dollar 1.46–68.96 ("1.5 to 69"); 0.27, 0.55, 15% in the adjustments table and text; 0.54 next dollar. "Three-quarters campaign, a quarter new parties" was 77/23 in round 2, and the changes move it by under a point. All agree. The "How this model was checked" section matches the rounds (round 1 pass with 3 medium and 4 low, round 2 pass with four lows).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | tpnw_vs_typical | The explainer says the US "adopted in 2014 a policy of not using anti-personnel mines outside Korea, reversed in 2020 and restored in 2022", citing the CRS report IF11440. The report (fetched) says the policy was announced in 2014 (June 2014: no producing or acquiring), issued as PPD-37 in January 2016 with the ban on use outside the Korean Peninsula, cancelled by a DOD memo of 31 January 2020, and replaced on 21 June 2022 by a policy aligned with the Ottawa Convention (no use outside Korea, plus no development, production, acquisition, export or transfer). So the 2020 reversal and 2022 return are supported, but the use ban is dated 2016 in this source, and 2022 is a new, broader policy rather than a restoration. The cluster-munitions link (OPB, 7 July 2023) supports the announcement on that date and the humanitarian warnings, but says the United States is not a party to the 2008 treaty and doesn't name the Convention on Cluster Munitions; "despite the Convention" is better "despite humanitarian warnings and the 2008 treaty". The anchor's point (a state outside the treaty, policy reversed and later restored) holds. | CRS IF11440; OPB 2023-07-07 | Reword to "announced in 2014 and issued in 2016 as a ban on use outside Korea, cancelled in 2020, and replaced in 2022 by a policy at the Ottawa Convention's level", and "announced cluster munitions for Ukraine on 7 July 2023 despite humanitarian warnings (the US is outside the 2008 Convention)". | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| tpnw_vs_typical (mines) | https://www.everycrsreport.com/reports/IF11440.html | verified with date differences | finding 1 |
| tpnw_vs_typical (cluster munitions) | https://www.opb.org/article/2023/07/07/the-u-s-is-sending-cluster-bombs-to-ukraine-despite-humanitarian-warnings/ | verified | announcement 7 July 2023 by the Pentagon; treaty not named; finding 1 |
| nuclear_implementation_share | ICAN AR 2024 pp. 12-13 | checked in round 2 | the 5-10% page share is the round-2 count, not re-fetched |

Nothing else was changed or re-checked; no new double counting from the four fixes (each moves a single judgment).

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
