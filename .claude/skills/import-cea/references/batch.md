# Batch runs (many imports or builds in one session)

For an orchestrator running many import-cea or build-cea agents, and for each agent in the batch.

## Before the run

- `python3 -c "import openpyxl"` works (`python3 -m pip install --user openpyxl` if not): sheet-dump.py and
  convert-sheet.py need it.
- `npm ci`, then `npm run check` and `npx vitest run` pass on the starting commit: a failure you inherit
  looks like yours.

## Each agent

- Works in its own git worktree (`isolation: "worktree"`), one charity or one evaluator source per agent,
  so a half-written model never breaks another agent's checks.
- Changes only `models/`, `charities/`, `facts/`, `writeups/`, `inventory/` and its own entries in the
  shared registers (below); commits on its branch; never regenerates `generated/`.
- Runs its own model's checks (`scripts/check.ts <id>`, `scripts/audit-model.ts <path>`) and skips
  `npm run dev` (it never exits).
- Records every source it looked at in `inventory/<owner>-models.json` (a new evaluator gets a new file and
  a line in inventory/README.md): `{ "title", "report", "sheet", "published", "charity", "status":
  "imported" | "not imported: <reason>", "model_id" }`. Text-only figures get a minimal model from the
  stated inputs, not a skip.
- Reports the model ids it added, its charity's `lines` change, and anything it couldn't settle.

## Shared registers (merge by hand, one entry per model)

`OURS` in scripts/beneficiary-countries.ts, the classification in scripts/missing-data.ts,
src/engine/normalization-waivers.json, facts/next_dollar.json and owners.json. Two agents adding to the
same register conflict only textually: keep both entries.

## After merging the branches, once, in this order

1. `npx tsx scripts/missing-data.ts`
2. `npx tsx scripts/beneficiary-countries.ts`
3. `npx tsx scripts/summaries.ts` (stand-ins and simulations)
4. `npx tsx scripts/bulk-writeups.ts`
5. `npx tsx scripts/simulation-check.ts <new ids>`: fix any unstable model before going on
6. `npx tsx scripts/normalization-audit.ts`: no violation
7. `npm run check`, `npx vitest run`, `npx tsc --noEmit`

A failure at a step goes back to the agent (or a fresh one) for that model; the others proceed.
