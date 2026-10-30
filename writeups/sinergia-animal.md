### Summary

Sinergia Animal campaigns for farmed animals in Latin America and Southeast Asia. ACE recommended it in 2025. ACE's cost-effectiveness analysis covers three programs, about 84% of programme spending. Most of the impact comes from cage-free egg commitments.

Our model gives **<span data-figure="headline" data-model="sinergia-animal">710</span> years of healthy life per $1,000** you give, converting with our default exchange rates. The range runs from about 0.07 to 16,000. Treat the headline as an order of magnitude that depends on your values, not a measurement.

### What the charity does

- **Cage-free campaigns:** pressure food companies to stop buying eggs from caged hens. ACE counts 39 commitments won in 2023, covering about 21 million hens a year.
- **Pig welfare campaigns:** 10 Brazilian pork producers committed to group housing for sows and to ending some piglet mutilations.
- **Nourishing Tomorrow:** schools and other institutions in Argentina, Colombia and Indonesia replace some meat meals with plant-based ones, about one million meals so far.
- **Work with financial institutions (unmodelled):** the remaining ~16% of programme spending. ACE didn't model it, and we leave it unmodelled rather than assume it is worthless or as good as the rest.

### How the impact happens

A company commits, then (if it follows through) changes its supply, then hens or pigs live with less suffering for as long as the policy holds before it would have happened anyway. Each step is a discount:

1. Credit: what share of the commitment is Sinergia's (38% for cage-free, 70% for pigs).
2. Compliance: what share of companies keep their pledge (about 53% cage-free, 58% pigs).
3. Duration: how long the change lasts (4 to 36 years, best guess 15).

ACE counts the suffering averted in Ambitious Impact's suffering-adjusted days, which build in Ambitious Impact's own weight for each species (a hen counts as 46% of a person). We take those weights out and count days of each animal's pain, weighed against a chicken's by Rethink Priorities' estimates (a pig about 1.6 chickens, a fish about 0.2). The chicken slider (default 33% of a person) then turns a chicken's pain into healthy years.

### How the model works

We rebuild ACE's sheet row by row: hens credited per year, discounted over the commitment's lifetime at 4%, times compliance, times SADs averted per hen. The pig program uses ACE's per-producer totals, and meat reduction uses the shared figure for a replaced meal (which is ACE's own Sinergia estimate), split between fish, chickens and pigs by ACE's global estimate of which animals a meal spares. Costs are each program's spending, scaled to Sinergia's updated budget. In ACE's own view the site reproduces all 12 of ACE's intermediate figures exactly.

### What drives the result

Comparing animals with people is where the uncertainty lives. The three biggest levers are:

- **A chicken's suffering against a person's** (your value judgment): 4.3 to 1,900.
- **Healthy hours lost per day of disabling pain:** 170 to 1,700. AIM publishes no official rate, so this is our least grounded number.
- **Years the commitments last:** 380 to 1,100. This is the biggest factual uncertainty, from Rethink Priorities' wide interval.

At the low end of the chicken slider alone, Sinergia falls to about GiveDirectly's level; at the low end of either of the others it stays far above. All of them at once push it well below.

### Where we differ from ACE

- **Species weights.** ACE's figures weigh each species by Ambitious Impact's weights; we use Rethink Priorities' estimates relative to a chicken, and the chicken slider for chickens against people, the same for every animal model. ACE's own figure, 910 years of healthy life per $1,000, still reproduces in its own view.
- **Salary sacrifice (off by default).** Campaign work is mostly people, and campaigners could earn far more in corporate roles. Turn on "Credit by share of resources" and we count the forgone pay as an in-kind donation: we guess staff are 65% of cost and take a 35% pay cut, so the forgone salary is 35% of cash spending, which cuts the impact credited to each donated dollar by about a quarter. Both numbers are guesses with wide ranges.
- **Credit for shared outcomes (shared, as ACE does).** The cage-free and pig results count Sinergia's share of each hen and pig covered, from ACE's inputs, not every animal covered.

### Biggest uncertainties

- ACE notes its SADs values have since been updated; this model uses the values from the evaluation.
- Commitments are counted when made. Compliance rates come from trackers of other companies, not Sinergia's.
- The pig program's years of impact and SADs per animal are fixed inside ACE's producer sheet, so our range understates their uncertainty.
- Meat reduction is a small part of the result; ACE calls its SADs-per-meal figures rough.

### What isn't modelled

The financial-institutions program, room for more funding, organisational strength, and any backlash or precedent effects of campaigns. ACE's review covers several of these qualitatively.

### Sources

- Animal Charity Evaluators, [Sinergia Animal – 2025 Recommended Charity](https://animalcharityevaluators.org/charity-review/sinergia-animal/), and its [cost-effectiveness spreadsheet](https://docs.google.com/spreadsheets/d/1BcZB3WeYarZC67MgFUjGKLWdLw2WVVZO8LitYcQb3fU/edit). Reuse terms unclear.
- ACE's [pig producer estimates](https://docs.google.com/spreadsheets/d/1O8ph5b5r-V3_yXR7JcoF2z4k669ukh765xn6kAAgOmk/edit) and [cage-free company estimates](https://docs.google.com/spreadsheets/d/1BiqnEWyWVy8ae-GdS62pqC-YxwRM9Bhdwq1IPtKrlvQ/edit).
- Rethink Priorities, [corporate campaigns affect 9 to 120 years of chicken life per dollar spent](https://rethinkpriorities.org/publications/corporate-campaigns-affect-9-to-120-years-of-chicken-life-per-dollar-spent).
