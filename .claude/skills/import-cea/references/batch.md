# Batch runs (many imports or builds in one session)

For an orchestrator running many import-cea or build-cea agents, and for each agent in the batch.

## Before the run

- Agents' worktrees start from the remote's `main`: push the commit the batch starts from, or each agent
  must fast-forward to local `main` first (below).
- `python3 -m venv .venv && .venv/bin/pip install openpyxl` in the main checkout: the sheet scripts run
  as `.venv/bin/python -I scripts/…` (`-I` hides packages installed with `--user`). In a worktree `.venv`
  isn't there (it isn't committed): use the main checkout's, `"$(git rev-parse --path-format=absolute
  --git-common-dir)/../.venv/bin/python" -I scripts/…`.
- `npm ci`, then `npm run check` and `npx vitest run` pass on the starting commit: a failure you inherit
  looks like yours.
- Write the batch list, `[{ "charity", "kind": "build" | "import", "branch" }]`, to a file outside the
  repository; `npx tsx scripts/batch-status.ts <file>` then says where each item stands at any time, from
  the repository alone: resume from it after a crash or a lost context, not from memory.

## Waves

- **Rules are frozen during a wave** (skills, templates, docs/normalization.md, shared facts): no agent
  gets a rule change mid-build.
- At most 20 subagents run at once, researchers and auditors included: leave each builder room for its
  own, and when the cap refuses a launch, queue it and launch when one finishes.

## Each agent

- Works in its own git worktree (`isolation: "worktree"`), one charity or one evaluator source per agent,
  so a half-written model never breaks another agent's checks. First: if this file isn't in the worktree,
  or `git log -1 main` is newer than the worktree's start, `git merge --ff-only main`.
- Shell: the worktree guard refuses heredocs, compound commands, `git -C` and any word containing
  "git": put multi-step shell in a script file and run that; git one command at a time.
- Changes only `models/`, `charities/`, `facts/`, `writeups/`, `inventory/`, `audits/`,
  `scripts/resource-shares-switches.json`, new files in `.claude/skills/build-cea/templates/proposals/`
  and its own entries in the shared registers (below); commits on its branch; never commits `generated/`.
- Passes `npx tsx scripts/preflight.ts <id>` before each audit round; skips `npm run dev` (it never
  exits). `npm run check` and the full vitest wait for the merge.
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

## Between waves

1. Merge each finished branch with `python3 scripts/merge-branch.py <branch>` (it merges, regenerates
   `generated/` and runs the checks): no separate After-merge commit. A failure goes back to the agent
   (or a fresh one) for that model; the others proceed.
2. Apply `.claude/skills/build-cea/templates/proposals/` (its README).
3. Land each rule change with `npx tsx scripts/rule-change.ts <rule-id> --apply <script>`; it writes
   inventory/rule-changes/<rule-id>.md, the models to verify, each once by a scoped verification.
4. A change that moves no result (wording, a rename) is re-stamped, not re-audited:
   `npx tsx scripts/restamp.ts <ids> --note "<what changed>"`.
5. `npx tsx scripts/batch-status.ts <file>`: every item of the wave done, then start the next.
