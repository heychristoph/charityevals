# Retrospective: the model batch of 13–16 November 2026

848 agents and 7.27B tokens (97% cache reads) produced 162 audited models. Opus did 88% of the weighted cost.
Raw data, scripts and method: notes folder `batch-tools/retro-data-2026-11-16.md`.

## Where the skills worked

- **The method holds.** Highs fall about 3× per round (182, 58, 13, 1, 0) and the loop converges by round 4.
- **Sources.** 80% of 3,626 source checks were verified and only 2.5% were mismatches. Misread sources are 3% of findings.
- **Simulation.** It was unstable in only 4% of receipts.
- **Rarely high.** Presentation, plausibility and sensitivity findings almost never reach high (2–8 highs each).
- **Scoped sonnet verification is cheap.** Median 0.9M tokens and 1.4 minutes, against 7M and 11 minutes for an opus audit.
- **Imports.** 8 imports raised one skill problem between them.

## Where they failed

| Problem | Size | Cause |
|---|---|---|
| A high in round 1 | 101 of 162 models | Builders miss standard steps: 32% of highs are a skipped normalization step |
| Own copy of a shared figure | 168 of 926 high+medium findings (18%) | There's no lookup before typing a value. INV-14 fires only at the fifth copy |
| Mechanical findings reaching the auditor | 168 (18%) | Units, stale generated/ and stale prose numbers, unused or duplicate rows, unstable simulation: tooling could catch these first |
| Builds over their time box | 22 of 129 (17%) | Research and PDF work inside one opus agent |
| Fixes deferred to later | 17 builders | Batch agents may not edit templates, skills or `src/`, so each gap became a fix-up agent and a re-audit |
| Rules changing mid-wave | 23 notices to 18 builds; 32 site-wide or fix-up agents (8% of tokens) | Rules landed while builds ran, re-opening finished models |
| Re-stamp churn | 175 of 737 receipts (24%) | Wording edits and rule changes. Each re-stamp was written by hand |
| Merge losses | at least 6 | Fixed: the merge tool is now three-way. Still to fix: register unions and beneficiary-countries.ts writing to other agents' files |
| Tool friction | 68% of agents hit the Bash guard (1,148 refusals); 33% rebuilt PDF extraction; 91 rewrote IRS range-reads | No shared helpers in `scripts/` |
| Low findings never converge | 33 models needed 5+ receipts | "Fix every low" forces another verification round for wording |

## Changes, by what they save

1. **A pre-audit gate (`scripts/preflight.ts`)** that the builder must pass before any audit:
   - check, lint, invariants and simulation;
   - a units check;
   - the unused-row lint, exempting rows the template requires;
   - a `kind` check;
   - prose numbers checked against the model;
   - a **shared-fact match** that flags any typed value whose concept or value matches a fact in `facts/` at the first copy.

   The mechanical and shared-fact classes are 36% of high+medium findings. This is the main fix for the feedback loops.
2. **Generated prose numbers.** Write-ups and explainers read results from the model (placeholders), not typed text. That removes the 37 stale-number findings and most of the 86 wording re-stamps.
3. **Rules frozen per wave.** Rule changes land between waves. A `scripts/rule-change.ts` lists the models a change touches, applies it, re-stamps mechanical receipts in one go, and launches one scoped sonnet verification per touched model.
4. **Template proposals instead of deferrals.** A builder that finds a template or family gap writes a patch to a staging folder. The orchestrator applies it once between waves, before the next builds start.
5. **Shared helpers committed to `scripts/`:**
   - a PDF text extractor (PDFKit);
   - an IRS 990 range-reader, fixed for older indexes;
   - a fetch helper;
   - a mechanical re-stamp command;
   - a merge tool that regenerates generated/ itself (91 "After-merge" commits).

   Also stop beneficiary-countries.ts from writing to other models.
6. **Cheaper audit rounds.**
   - Round 2 and later become sonnet scoped verifications instead of opus full audits (133 agents, 668M tokens → about 120M).
   - Lows are fixed without a further verification round.
7. **Split builds into research and modelling.** A sonnet research pass produces quoted sources, accounts and PDFs as text. Opus then builds from that file. Builds are 51% of tokens and mostly long-context cache reads, and research is the part that overran time boxes.
8. **Skills.** Add to build-cea a short "before you type a number" step: search `facts/`, then `@next_dollar`, then the template defaults. Add a shell note to the batch brief: put multi-step shell in script files and run git one command at a time. Keep both within the word budget. Prune duplicated rule text from the skills into the gate's messages.

Estimated effect, roughly:
- Changes 1–2 remove up to a third of round-1 findings, and so many of the round-2 and later rounds.
- Change 6 alone saves about 7% of all tokens.
- Change 7 is the biggest lever but is untested, so try it on three builds first.

Every finding class that needs judgment still goes to an opus round-1 audit, so quality is unchanged.
