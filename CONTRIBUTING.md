# Contributing

## Suggest a charity

Use the form at [charityevals.org/suggest](https://charityevals.org/suggest), or comment on the
[suggestions issue](https://github.com/heychristoph/charityevals/issues/29).

## Report an error

Each model page has a "Report an error" link that opens a
[prefilled issue](https://github.com/heychristoph/charityevals/issues/new?template=report-error.yml).
You can also write to the corrections address on [charityevals.org/terms](https://charityevals.org/terms).
Charities correcting their own data can use the
[charity data form](https://github.com/heychristoph/charityevals/issues/new?template=charity-data.yml).

## Add or improve a model

Open a pull request. Build models with the skills in `.claude/skills`: `build-cea` for a new model
from public evidence, `import-cea` for a published analysis. CI checks that:

- `npx tsx scripts/preflight.ts <id>` passes, and
- an independent audit (`audit-cea`) has left a passing receipt in `audits/<id>/`.

Run the checks locally:

```
npm ci
npm run check
npx vitest run src
```

## Licence

By contributing you agree that models, data and write-ups are licensed
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and code [MIT](LICENSE). Sign off each
commit (`git commit -s`) to certify the [Developer Certificate of Origin](https://developercertificate.org).
