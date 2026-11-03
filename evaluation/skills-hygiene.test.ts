// The build-cea / audit-cea / import-cea skills must not learn the evaluation set (docs/eval-skills.md):
// no dev or test charity is named in them, and each file stays within its word budget, so lessons are
// written as general rules and the skills stay readable. (Not copied into eval sandboxes.)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(import.meta.dirname, "..");
const skills = join(root, ".claude/skills");
const files = (d: string): string[] =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? files(p) : [p];
  });

const EVAL_SET = [
  "against malaria foundation", "\\bAMF\\b", "humane league", "\\bTHL\\b", "strongminds", "vegetariana brasileira", "\\bSVB\\b",
  "helen keller", "new incentives", "shrimp welfare", "\\bSWP\\b", "dansk vegetarisk", "\\bDVF\\b", "friendship bench",
  "village enterprise", "life you can save", "\\bTLYCS\\b",
].map((s) => new RegExp(s, "i"));

/** Words per file; a lesson that doesn't fit replaces or merges an older one. */
const BUDGET: Record<string, number> = {
  "build-cea/SKILL.md": 2000,
  "build-cea/references/templates.md": 3000,
  "build-cea/references/research.md": 800,
  "audit-cea/SKILL.md": 1800,
  "audit-cea/references/checklist.md": 900,
  "import-cea/SKILL.md": 3000,
};

describe("skills", () => {
  // Skill files only: template JSON reads live models by id (#…), which isn't a lesson.
  for (const p of files(skills).filter((p) => /\.(md|py)$/.test(p))) {
    const rel = p.slice(skills.length + 1);
    it(`${rel} names no evaluation charity`, () => {
      const text = readFileSync(p, "utf8");
      expect(EVAL_SET.filter((r) => r.test(text)).map(String)).toEqual([]);
    });
  }
  for (const [rel, max] of Object.entries(BUDGET))
    it(`${rel} is at most ${max} words`, () => {
      expect(readFileSync(join(skills, rel), "utf8").split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(max);
    });
});
