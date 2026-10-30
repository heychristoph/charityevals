### Summary

Sinergia Animal campaigns for farmed animals in Latin America and Southeast Asia. ACE recommended it in 2025. ACE's cost-effectiveness analysis covers three programs, about 84% of programme spending. Most of the impact comes from cage-free egg commitments.

Our model gives **<span data-figure="headline" data-model="sinergia-animal">910</span> years of healthy life per $1,000** you give, after counting staff salary sacrifice as an in-kind donation and converting with our default exchange rates. The range runs from about 4 to 22,000. Treat the headline as an order of magnitude that depends on your values, not a measurement.

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

ACE converts improved animal lives into SADs using Ambitious Impact's estimates of suffering per animal under each housing system. Those estimates already weight each species by its welfare range relative to humans.

### How the model works

We rebuild ACE's sheet row by row: hens credited per year, discounted over the commitment's lifetime at 4%, times compliance, times SADs averted per hen. The pig program uses ACE's per-producer totals, and meat reduction uses ACE's meals-to-SADs estimate. Costs are each program's spending, scaled to Sinergia's updated budget. The site reproduces all 12 of ACE's intermediate figures exactly.

### What drives the result

Comparing animals with people is where the uncertainty lives. The four biggest levers are:

- **A chicken's suffering against a person's** (your value judgment): 46 to 2,700.
- **Healthy hours lost per day of disabling pain:** 220 to 2,200. AIM publishes no official rate, so this is our least grounded number.
- **Years the commitments last:** 450 to 1,400. This is the biggest factual uncertainty, from Rethink Priorities' wide interval.

Even at the low end of each of these alone, Sinergia stays above GiveDirectly. All of them at once can push it below.

### Where we differ from ACE

- **Salary sacrifice (on by default).** Campaign work is mostly people, and campaigners could earn far more in corporate roles. We guess staff are 65% of cost and take a 35% pay cut. That makes the forgone salary 35% of cash spending, and cuts the impact credited to each donated dollar by about a quarter. Both numbers are guesses with wide ranges.
- **Credit for shared outcomes (shared by default, as ACE does).** Switch to full credit and the cage-free and pig results count every hen and pig covered, not Sinergia's share. That raises the result about 2.3-fold.

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
