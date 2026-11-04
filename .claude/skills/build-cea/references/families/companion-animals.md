# companion-animals (days of pain → ced; unit_cost)

Shelters, rehoming, rescue, cruelty inspection, neutering and vet care for dogs and cats. They go
through the animal pipeline like every species: days of suffering spared, counted in the animal
itself, then the species step into chicken-equivalent pain days with Rethink Priorities' welfare
range (normalization.md 2.4, the `raw` template of INV-3).

## The chain

```
care        animals_helped × suffering_share_avoided × 365 × pv(years_better_life)
neutering   neuters × births_averted_per_neuter × pain_days_per_unowned_life (a year later, discounted)
(sum) × total_adj = outcome_total (days of disabling pain); ÷ cost_total × donor share
species     pain_days_dog = … × share_dog → ced_dog = pain_days_dog × @welfare_ranges.dog_vs_chicken
            (cats the same) → ced_per_donor_dollar
```

Days are counted on Ambitious Impact's pain scale (disabling 1, hurtful about a tenth, annoying about
a hundredth of a day of disabling pain), in the animal's own terms: no species weight goes in before
the `ced_` rows.

## Shared figures it reads

- `@welfare_ranges.dog_vs_chicken`, `@welfare_ranges.cat_vs_chicken`: Rethink Priorities publishes no
  dog or cat figure, so both are a ranged judgment anchored on Rethink's pig, the mammal they did
  estimate (facts/welfare_ranges.json says so). Only the `ced_` rows read them.
- `$discount_rate` on the animal's future years; the chicken slider and the pain-day rate act through
  the `ced` unit's conversion, never in a row.

## Evidence to look for

- **Reach**: animals taken in, rehomed, returned to owners, neutered and treated in the year (the
  charity's annual report; shelter-data platforms where it reports to one). Rehomed animals, not
  enquiries.
- **Suffering avoided**: veterinary and shelter-welfare studies of strays and surrendered animals
  (disease, injury, body condition, stress), cruelty-case reports for seized animals; translate hours
  of each pain level into disabling-pain days and say how.
- **Remaining life**: veterinary cohort studies of lifespan (dogs about 12 years, cats about 14, less
  for some breeds), from the age at intake.
- **Neutering**: free-roaming population models (litters per year, survival, rebound when neutering
  coverage is low); births averted net of the population refilling.
- **Counterfactual**: local intake and rehoming rates, other shelters' capacity, council services.

## Pitfalls

- **Deaths are not suffering**: euthanasia averted or a longer life counts only through the days of
  suffering spared or added, as in every animal model; a longer good life is not counted as a gain on
  its own (the site counts suffering averted).
- **Neutering and rehoming overlap** (a neutered rehomed animal): count each change once.
- **Inspection and prosecution** work: animals removed from cruelty are `animals_helped`; a law or
  deterrence effect is a won-reform branch (policy-research-meta with the animal species step).
- **Shop and lottery income** isn't programme cost; their cost is fundraising (overhead).
- Never borrow a farm-animal SADs figure: those carry Ambitious Impact's species weights and a
  different change.
