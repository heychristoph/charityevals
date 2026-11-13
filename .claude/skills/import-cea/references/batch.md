# Batch runs (many imports or builds in one session)

For an orchestrator running many import-cea or build-cea agents, and for each agent in the batch.

## Before the run

- Agents' worktrees start from the remote's `main`: push the commit the batch starts from, or each agent
  must fast-forward to local `main` first (below).
- `python3 -m venv .venv && .venv/bin/pip install openpyxl`: the sheet scripts run as
  `.venv/bin/python -I scripts/…` (`-I` hides packages installed with `--user`).
- `npm ci`, then `npm run check` and `npx vitest run` pass on the starting commit: a failure you inherit
  looks like yours.
- Write the batch list, `[{ "charity", "kind": "build" | "import", "branch" }]`, to a file outside the
  repository; `npx tsx scripts/batch-status.ts <file>` then says where each item stands at any time, from
  the repository alone: resume from it after a crash or a lost context, not from memory.

## Each agent

- Works in its own git worktree (`isolation: "worktree"`), one charity or one evaluator source per agent,
  so a half-written model never breaks another agent's checks. First: if this file isn't in the worktree,
  or `git log -1 main` is newer than the worktree's start, `git merge --ff-only main`.
- Changes only `models/`, `charities/`, `facts/`, `writeups/`, `inventory/`, `audits/`,
  `scripts/resource-shares-switches.json` and its own entries in the shared registers (below); commits on
  its branch; never commits `generated/` (normalization-audit writes there: `git checkout -- generated`).
- Runs its own model's checks: `scripts/check.ts <id>`, `scripts/audit-model.ts <path>`,
  `scripts/simulation-check.ts <id>`, `scripts/normalization-audit.ts`, `npx tsc --noEmit`; skips
  `npm run dev` (it never exits). `npm run check` and the full vitest wait for the merge (they need fresh
  `generated/`).
- A build keeps every audit round in `audits/<id>/audit-r<n>.md`, the last one a pass on the model as it
  is (its `Model-sha`, from `npx tsx scripts/audit-receipt.ts <id>`): src/engine/audit-receipts.test.ts
  fails any of our models without one.
- Records every source it looked at in `inventory/<owner>-models.json` (a new evaluator gets a new file and
  a line in inventory/README.md): `{ "title", "report", "sheet", "published", "charity", "status":
  "imported" | "not imported: <reason>", "model_id" }`. Text-only figures get a minimal model from the
  stated inputs, not a skip. (A build's sources live in its model and write-up: no inventory entry.)
- A new ranged fact whose low or high equals a number in another model trips INV-4 there: check it's a
  coincidence and add a waiver with the reason.
- Keeps its scratch files in a folder named by its model or charity id (agents may share a scratch
  directory); its audits go in the repository, never only in scratch.
- Reports the model ids it added, its charity's `lines` change, and anything it couldn't settle.

## Shared registers (merge by hand, one entry per model)

`OURS` in scripts/beneficiary-countries.ts (our own builds only; imports fill in themselves), the
classification in scripts/missing-data.ts, src/engine/normalization-waivers.json, facts/next_dollar.json
and owners.json. Two agents adding to the same register conflict only textually: keep both entries.

## After merging the branches, once, in this order

1. `npx tsx scripts/missing-data.ts`
2. `npx tsx scripts/beneficiary-countries.ts`
3. `npx tsx scripts/summaries.ts` (stand-ins and simulations)
4. `npx tsx scripts/bulk-writeups.ts`
5. `npx tsx scripts/simulation-check.ts <new ids>`: fix any unstable model before going on
6. `npx tsx scripts/normalization-audit.ts`: no violation
7. `npm run check`, `npx vitest run`, `npx tsc --noEmit`
8. `npx tsx scripts/batch-status.ts <file>`: every item done

A failure at a step goes back to the agent (or a fresh one) for that model; the others proceed.
