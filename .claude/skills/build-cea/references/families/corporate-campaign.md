# corporate-campaign: accountability on pledges

The template's chain and shared figures are in templates.md; this is the recipe for pressing a stock of
existing pledges (`acc_` branch) beside new pledges (`new_`).

- **Accountability on a stock of existing pledges** (`acc_`): one year's pressure gets one year's share
  of the compliance it causes, anchored on the observed pace:
  - `acc_switched_per_year`: animals that came out of cages in the year under the pledges pressed (published
    by the charity or a tracker). Observed switches are delivered already: no
    `implementation_adj`, no division by years of pressure. Without a count: the pressed stock (all
    animals under the pledges) × `implementation_adj` ÷ `acc_years_pressed` (start of the pressure to
    the deadlines, a judgment).
  - `acc_counterfactual_adj`: the share of those switches that wouldn't have come *yet* without the
    pressure (anchored on pressed against unpressed pledges in the tracker). Each counts
    `$win_years_counted` years, so never "would it ever have come" (Convention 5).
  - `acc_years_until_effect`: the lag from pressure to switch (0–2 years), not the time to every deadline.
  - New pledges of the year (`new_`) take `1 − share later pressed × acc_counterfactual_adj`, since
    later pressure is credited to later years' accountability.
