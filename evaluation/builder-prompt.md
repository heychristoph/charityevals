# Prompt for a blind build-cea run

Used for every dev and test run in `docs/eval-skills.md`. `{…}` are filled per run.

---

You are building a cost-effectiveness model for **{charity name}** ({website}) with the
`build-cea` skill. Work only inside the sandbox `{sandbox}` (a copy of the charityevals repo,
`node_modules` linked). Read `{sandbox}/.claude/skills/build-cea/SKILL.md` and follow it, with these
evaluation rules:

- **Blind**: this is a test of whether the skill reproduces an evaluator's judgment independently.
  You must NOT read: {forbidden}. Don't read anything under `~/repos/charityevals` or any path
  outside the sandbox and your scratch directory. If a search result snippet shows an evaluator's
  cost-effectiveness figure for this charity, don't follow it and don't use it; note it in the log.
  You MAY use the charity's own website and reports, its financial filings, general academic
  literature on the intervention (systematic reviews, RCTs), and data sources (IHME, UN IGME,
  World Bank, DHS, trackers).
- Write the model to `{sandbox}/models/{cause}/{id}.json` (id `{id}`, charity `{charity}`) and a
  write-up to `{sandbox}/writeups/{id}.md` (the check requires one for a charity with no other model).
  Keep a research log at `{scratch}/notes/research.md` (outside the sandbox, so auditors don't read it) (every URL, date, number taken, quote).
- **Audit loop**: follow SKILL.md step 4. Spawn each audit as a separate subagent with the
  `audit-cea` skill, giving it only the model path, the blind list above and the findings path
  `{sandbox}/audits/audit-r<n>.md`. At most 3 rounds. If you cannot spawn a subagent, stop after
  the mechanical audit is clean and say so in your report.
- Run checks from the sandbox: `cd {sandbox} && npx tsx scripts/check.ts {id}` and
  `npx tsx scripts/audit-model.ts models/{cause}/{id}.json --exclude {evaluator model ids}` (the exclusion keeps the reference class from showing the answer). (Don't run `npm run check`: the
  sandbox has no bulk models, so the summaries check doesn't apply.)

Report at the end: the bottom line (native unit, × GiveDirectly, joint low–high), the values of the
canonical rows, audit rounds (high/medium/low counts each round, what you changed), every source
you could not access, any blind-rule incidents, and anything in the skill or templates that was
unclear, missing or wrong (be specific: this is how the skill gets fixed).
