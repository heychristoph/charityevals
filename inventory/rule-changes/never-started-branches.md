# Rule change never-started-branches (19 Nov 2026)

In the catastrophic-risk family the mark for lives that never start moves from the sum of the future to each branch's future row, so the branch weights that average the adjustments count the future as the outcome does (they counted it in full); the future's farmed animals read the branches' own formulas. Applied by `scripts/_never-started-branches.py`; files changed: 26. 32 models moved; 15 receipts re-stamped (headline within 1%), 11 to verify, 0 other models moved more than 2×.

Rules 0.3.12 → 0.3.13 (minor); 161 receipts moved to 0.3.13, the 11 to verify stay on theirs until verified.

## Verification list

- [ ] **govai-charityevals**: rule never-started-branches moved the headline 2.466 → 2.662 (+8.0%); rows changed: future_dalys_averted, w_ai, w_fb, w_pol +8. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **1day-sooner-charityevals**: rule never-started-branches moved the headline 1.595 → 1.519 (−4.8%); rows changed: future_dalys_averted, w_bio, w_pol, w_total +8. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **securebio-charityevals**: rule never-started-branches moved the headline 2.157 → 2.181 (+1.1%); rows changed: future_dalys_averted, w_ai, w_bio, evidence_adj +4. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **council-on-strategic-risks-charityevals**: rule never-started-branches moved the headline 9.159 → 9.117 (−0.46%); rows changed: future_dalys_averted, w_bio, w_nuclear, w_fb +9. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **bulletin-of-the-atomic-scientists-charityevals**: rule never-started-branches moved the headline 4.758 → 4.761 (+0.067%); rows changed: future_dalys_averted, w_ai, w_bio, w_nuclear +7. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **cepi-charityevals**: rule never-started-branches moved the headline 0.1508 → 0.1508 (+0.042%); rows changed: future_dalys_averted, w_bio, w_total, evidence_adj +7. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **johns-hopkins-center-for-health-security-charityevals**: rule never-started-branches moved the headline 2.889 → 2.889 (−3.3e-14%); rows changed: future_dalys_averted, w_bio, w_fb. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **mats-charityevals**: rule never-started-branches moved the headline 3.066 → 3.066 (+2.2e-14%); rows changed: future_dalys_averted, w_ai, w_fb, w_total. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **blueprint-biosecurity-charityevals**: rule never-started-branches moved the headline 1.593 → 1.593 (unchanged); rows changed: future_dalys_averted, w_bio, w_total. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **ibbis-charityevals**: rule never-started-branches moved the headline 2.406 → 2.406 (unchanged); rows changed: future_dalys_averted, w_bio, w_total. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **redwood-research-charityevals**: rule never-started-branches moved the headline 0.02913 → 0.02913 (unchanged); rows changed: future_dalys_averted. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.

## Before and after

| model | before | after | move | rows changed | receipt |
|---|---|---|---|---|---|
| govai-charityevals | 2.466 | 2.662 | +8.0% | future_dalys_averted, w_ai, w_fb, w_pol +8 | verify |
| 1day-sooner-charityevals | 1.595 | 1.519 | −4.8% | future_dalys_averted, w_bio, w_pol, w_total +8 | verify |
| securebio-charityevals | 2.157 | 2.181 | +1.1% | future_dalys_averted, w_ai, w_bio, evidence_adj +4 | verify |
| 80000-hours-charityevals | 0.3286 | 0.3317 | +0.95% | value_destinations, moved_dollar_value, prior_dollar_value, moved_dollar_net_value +6 | receipt current |
| centre-for-long-term-resilience-charityevals | 1.796 | 1.783 | −0.76% | future_dalys_averted, w_ai, w_bio, w_rm +9 | re-stamp |
| council-on-strategic-risks-charityevals | 9.159 | 9.117 | −0.46% | future_dalys_averted, w_bio, w_nuclear, w_fb +9 | verify (latest round isn't a pass) |
| rethink-priorities-charityevals-cross-cause | 0.004112 | 0.004128 | +0.39% | value_destinations, moved_dollar_value, prior_dollar_value, shifted_dollar_value +7 | receipt current |
| longview-philanthropy-charityevals | 0.2337 | 0.2346 | +0.39% | value_destinations, moved_dollar_value, prior_dollar_value, shifted_dollar_value +8 | receipt current |
| sentinel-bio-charityevals | 2.097 | 2.093 | −0.20% | value_csr, live_grants_uov, future_dalys_averted, w_bio +10 | re-stamp |
| bulletin-of-the-atomic-scientists-charityevals | 4.758 | 4.761 | +0.067% | future_dalys_averted, w_ai, w_bio, w_nuclear +7 | verify (latest round isn't a pass) |
| cepi-charityevals | 0.1508 | 0.1508 | +0.042% | future_dalys_averted, w_bio, w_total, evidence_adj +7 | verify (latest round isn't a pass) |
| federation-of-american-scientists-charityevals | 0.432 | 0.432 | +0.0099% | future_dalys_averted, w_ai, w_bio, w_nuclear +9 | re-stamp |
| founders-pledge-charityevals | 3.597 | 3.597 | +0.0068% | value_destinations, moved_dollar_value, prior_dollar_value, shifted_dollar_value +8 | receipt current |
| effektiv-spenden-charityevals | 3.439 | 3.439 | +0.0066% | value_destinations, moved_dollar_value, shifted_dollar_value, informed_money_value +7 | receipt current |
| giving-what-we-can-charityevals | 10.21 | 10.21 | +0.0057% | value_destinations, moved_dollar_value, moved_dollar_net_value, moved_value +5 | receipt current |
| ploughshares-fund-charityevals | 8.282 | 8.282 | +0.00021% | grl_uov, future_dalys_averted, w_gr, w_own +5 | re-stamp |
| allfed-charityevals | 8.169 | 8.169 | −0.00013% | future_dalys_averted, w_nuclear, w_total, evidence_adj +4 | re-stamp |
| union-of-concerned-scientists-charityevals | 4.645 | 4.645 | −0.000060% | future_dalys_averted, w_nuclear, w_total, evidence_adj +7 | re-stamp |
| epoch-ai-charityevals | 0.03349 | 0.03349 | +4.4e-14% | future_dalys_averted, w_ai, w_total | re-stamp |
| johns-hopkins-center-for-health-security-charityevals | 2.889 | 2.889 | −3.3e-14% | future_dalys_averted, w_bio, w_fb | verify (latest round isn't a pass) |
| center-for-ai-safety-charityevals | 3.892 | 3.892 | −2.2e-14% | future_dalys_averted, w_ai, w_fb | re-stamp |
| mats-charityevals | 3.066 | 3.066 | +2.2e-14% | future_dalys_averted, w_ai, w_fb, w_total | verify (latest round isn't a pass) |
| arms-control-association-charityevals | 12.17 | 12.17 | unchanged | future_dalys_averted | re-stamp |
| blueprint-biosecurity-charityevals | 1.593 | 1.593 | unchanged | future_dalys_averted, w_bio, w_total | verify (latest round isn't a pass) |
| far-ai-charityevals | 0.4756 | 0.4756 | unchanged | future_dalys_averted | re-stamp |
| ibbis-charityevals | 2.406 | 2.406 | unchanged | future_dalys_averted, w_bio, w_total | verify (latest round isn't a pass) |
| ican-charityevals | 2.545 | 2.545 | unchanged | future_dalys_averted, w_nuclear, w_pol, w_total | re-stamp |
| institute-for-ai-policy-and-strategy-charityevals | 2.114 | 2.114 | unchanged | future_dalys_averted, w_ai, w_fb, w_total | re-stamp |
| machine-intelligence-research-institute-charityevals | 0.03117 | 0.03117 | unchanged | future_dalys_averted | re-stamp |
| metr-charityevals | 0.02748 | 0.02748 | unchanged | future_dalys_averted | re-stamp |
| nuclear-threat-initiative-charityevals | 7.292 | 7.292 | unchanged | future_dalys_averted | re-stamp |
| redwood-research-charityevals | 0.02913 | 0.02913 | unchanged | future_dalys_averted | verify (latest round isn't a pass) |
