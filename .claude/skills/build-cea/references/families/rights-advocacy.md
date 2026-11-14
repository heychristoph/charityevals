# rights-advocacy (WELLBYs, uov, DALYs → daly; past_average)

Civil-liberties and human-rights litigation and advocacy, legal aid that frees people, campaigns for
laws and rulings. The chain follows the charity's own theory of change to where it lands: the people a
win covers, and what it changes for them in wellbeing, income or health.

## The chain

```
wins        people_affected_per_year × (ls_gain_per_person_year | ln_gain_per_person_year | dalys_per_person_year)
            × p_success × pv($win_years_counted) × wait                → each unit's bridge
casework    released_people × released_ls_gain_per_year × pv(released_years)  → wellbys_bridged
(sum) × total_adj (implementation_adj: the share of the win enforced) ÷ cost_total × $marginal_vs_past_average
```

**Relation to policy-research-meta.** The wins branch is that family's won-policy branch (units per
year × value per unit-year × `p_success` × the discounted `$win_years_counted` × the wait), split by
outcome unit so a win that changes wellbeing and income counts each through its own conversion. A
rights charity whose only good is in one unit and that also moves money or careers can use
policy-research-meta instead; the result is the same chain.

## Shared figures it reads

- `$win_years_counted` and `$discount_rate` for wins (normalization.md 2.9); a released person's
  years are their own, discounted, not a won reform's.
- `$uov_per_ln_consumption` through the uov bridge; `@wellby_factors.wellbys_per_sd_year` for SD
  effects; `@gbd_disability_weights.*` for health; `@moral_weights.*` × `$life_value_multiplier` for
  deaths (executions, deaths in custody), in units of value.
- `$marginal_vs_past_average`: a year's spending against the wins it achieved is a past average.

## Evidence to look for

- **Wins**: the year's rulings, laws and settlements the charity led or joined, and the population
  each covers (court records, official statistics). Pending cases: `p_success` from the court's or the
  organisation's win rate in similar cases.
- **Share of the cause**: for a win already in, `p_success` is the charity's share of it (lead counsel,
  co-counsel, brief), Convention 2 for coalitions.
- **Effect per person**: studies of the right's effect on those covered (discrimination law and
  wellbeing or earnings; detention and mental health; legal status and income).
- **Enforcement**: how much of similar rulings is applied (`implementation_adj`).
- **Casework**: people released or kept out of detention, the time avoided, and the wellbeing gap
  between detention and release.

## Pitfalls

- **Symbolic wins** with no change in people's lives count only what changes; a law never enforced
  has a low `implementation_adj`.
- **Years brought forward and counterfactual** are one question (Convention 5): `$win_years_counted`
  already says the change would have come some day.
- **Losses and backlash**: a negative share in `unmodelled_benefits_adj` where evidence shows them.
- A rights charity's media and public-education spending is part of the campaign that wins, not a
  separate reach count.

## Democracy and governance

Voting methods, election rules, voter access, anti-corruption and checks on power: the wins branch,
with better government as an income gain per person governed, `ln(1 + gain)` in
`ln_gain_per_person_year` (the uov bridge). The shared figures are in facts/democracy.json:

- **Backsliding averted or democratization**: `@democracy.democratization_gdp_gain`, built up over
  `democratization_years_to_effect` (the average share reached in the years counted, a ranged judgment),
  × the chance the work changes the outcome.
- **Less corruption**: `@democracy.bribery_share_gdp` × the share of its cost removed, ranged; bribes
  are a transfer, so say what that share stands for.
- **Better-run spending**: public investment per person × `public_investment_efficiency_gap_<advanced
  | emerging | low_income>` × the share a reform closes.
- **A reform within a democracy** (voting method, districting, campaign finance, registration): a ranged
  share of the democratization gain, anchored on studies of that reform's effect on who is elected or
  what is decided; never the whole gain. Turnout, registration and voter information count through that
  change, not per vote.
- **Years**: `pv_annuity_due(1, $discount_rate + @democracy.electoral_reform_repeal_rate,
  years_of_impact)` (`years_of_impact` reads `$win_years_counted`; repeal is a separate question from
  "would have come anyway"); a reform already repealed counts its years in force instead.
- **Pending campaigns**: `p_success` from `@democracy.lobbied_issue_change_rate`, moved by the issue's
  own record (a jurisdiction's past ballot measures, a court's rulings), `single_event` for one measure.
- **Coalitions**: credit is the charity's share of the money behind the win (Convention 2): the ballot
  committee's donors in the campaign-finance filings, else the named coalition members' spending on it
  (their 990s), the charity's in-kind staff time counted; never an equal split. A measure put on the
  ballot by the charity's own petition wouldn't have been voted on without it: that is the counterfactual,
  `$win_years_counted` already saying it would have come some day.
- **Backlash** (bans or counter-measures a win provokes, as at state level against local wins): a
  negative `unmodelled_benefits_adj` share where the record shows it.
