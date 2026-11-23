# Rule change cause-portfolios (23 Nov 2026)

Money to a cause with no named recipient (#cause:x) is valued at the cause's portfolio: named charities weighted by a published fund's grants (assumptions portfolios), not the average of the charities on the site, so adding a charity moves no other figure (normalization 2.8). Applied by `/private/tmp/claude-501/-Users-christoph-repos-charityevals/09e73550-50b4-4a60-ac31-228f774f9f07/scratchpad/apply-portfolios.sh`; files changed: 38. 16 models moved; 3 receipts re-stamped (headline within 1%), 11 to verify, 0 other models moved more than 2×.

Rules 0.3.17 → 0.4.0 (major); 0 receipts moved to 0.4.0, the 11 to verify stay on theirs until verified.

## Verification list

- [ ] **rethink-priorities-charityevals-global-health**: rule cause-portfolios moved the headline 0.04752 → 1.114 (+2.2e+3%); rows changed: value_destinations, moved_dollar_value, shifted_dollar_value, informed_money_value +6. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **rethink-priorities-charityevals-cross-cause**: rule cause-portfolios moved the headline 0.004128 → 0.07512 (+1.7e+3%); rows changed: value_destinations, moved_dollar_value, prior_dollar_value, shifted_dollar_value +7. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **rethink-priorities-charityevals**: rule cause-portfolios moved the headline 0.000007389 → 0.0000225 (+2.0e+2%); rows changed: value_destinations, moved_dollar_value, prior_dollar_value, shifted_dollar_value +7. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **project-drawdown-charityevals**: rule cause-portfolios moved the headline 0.0004607 → -0.0002388 (−1.5e+2%); rows changed: value_destinations, moved_dollar_value, prior_dollar_value, shifted_dollar_value +12. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **animal-charity-evaluators-charityevals**: rule cause-portfolios moved the headline 0.0000649 → 0.0001517 (+1.3e+2%); rows changed: prior_dollar_value, moved_dollar_net_value, shifted_dollar_value, moved_value +3. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **founders-pledge-charityevals**: rule cause-portfolios moved the headline 3.597 → 6.666 (+85%); rows changed: value_destinations, moved_dollar_value, prior_dollar_value, shifted_dollar_value +8. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **longview-philanthropy-charityevals**: rule cause-portfolios moved the headline 0.2346 → 0.3662 (+56%); rows changed: value_destinations, moved_dollar_value, prior_dollar_value, shifted_dollar_value +8. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **80000-hours-charityevals**: rule cause-portfolios moved the headline 0.3317 → 0.2487 (−25%); rows changed: value_destinations, moved_dollar_value, prior_dollar_value, moved_dollar_net_value +6. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **effektiv-spenden-charityevals**: rule cause-portfolios moved the headline 3.439 → 3.312 (−3.7%); rows changed: value_destinations, moved_dollar_value, shifted_dollar_value, informed_money_value +7. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **giving-what-we-can-charityevals**: rule cause-portfolios moved the headline 10.21 → 9.907 (−3.0%); rows changed: value_destinations, moved_dollar_value, moved_dollar_net_value, moved_value +5. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.
- [ ] **sentinel-bio-charityevals**: rule cause-portfolios moved the headline 2.093 → 2.123 (+1.4%); rows changed: climate_value_per_dollar, prior_dollar_value, shifted_dollar_value, informed_money_value +5. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.

## Before and after

| model | before | after | move | rows changed | receipt |
|---|---|---|---|---|---|
| rethink-priorities-charityevals-global-health | 0.04752 | 1.114 | +2.2e+3% | value_destinations, moved_dollar_value, shifted_dollar_value, informed_money_value +6 | verify |
| rethink-priorities-charityevals-cross-cause | 0.004128 | 0.07512 | +1.7e+3% | value_destinations, moved_dollar_value, prior_dollar_value, shifted_dollar_value +7 | verify |
| rethink-priorities-charityevals | 0.000007389 | 0.0000225 | +2.0e+2% | value_destinations, moved_dollar_value, prior_dollar_value, shifted_dollar_value +7 | verify |
| project-drawdown-charityevals | 0.0004607 | -0.0002388 | −1.5e+2% | value_destinations, moved_dollar_value, prior_dollar_value, shifted_dollar_value +12 | verify |
| animal-charity-evaluators-charityevals | 0.0000649 | 0.0001517 | +1.3e+2% | prior_dollar_value, moved_dollar_net_value, shifted_dollar_value, moved_value +3 | verify |
| founders-pledge-charityevals | 3.597 | 6.666 | +85% | value_destinations, moved_dollar_value, prior_dollar_value, shifted_dollar_value +8 | verify |
| better-futures-guide-aim | 1.908 | 0.5697 | −70% | value_livelihoods, moved_dollar_value, moved_dollar_net_value, moved_money_revaluation +1 | - |
| longview-philanthropy-charityevals | 0.2346 | 0.3662 | +56% | value_destinations, moved_dollar_value, prior_dollar_value, shifted_dollar_value +8 | verify |
| 80000-hours-charityevals | 0.3317 | 0.2487 | −25% | value_destinations, moved_dollar_value, prior_dollar_value, moved_dollar_net_value +6 | verify |
| effektiv-spenden-charityevals | 3.439 | 3.312 | −3.7% | value_destinations, moved_dollar_value, shifted_dollar_value, informed_money_value +7 | verify |
| giving-what-we-can-charityevals | 10.21 | 9.907 | −3.0% | value_destinations, moved_dollar_value, moved_dollar_net_value, moved_value +5 | verify |
| sentinel-bio-charityevals | 2.093 | 2.123 | +1.4% | climate_value_per_dollar, prior_dollar_value, shifted_dollar_value, informed_money_value +5 | verify |
| bulletin-of-the-atomic-scientists-charityevals | 4.761 | 4.761 | −0.00061% | climate_value_per_dollar, climate_uov, uov_bridged, dalys_from_uov +8 | re-stamp |
| ambitious-impact-charityevals | 6.49 | 6.49 | +0.00033% | prior_dollar_value, shifted_dollar_value, informed_money_value, moved_dollar_net_value +4 | re-stamp |
| ploughshares-fund-charityevals | 8.282 | 8.282 | −0.0000019% | grl_uov, grl_dalys, outcome_total, dalys_per_dollar +1 | receipt current |
| cearch-charityevals | 3.265 | 3.265 | unchanged | - | re-stamp |
