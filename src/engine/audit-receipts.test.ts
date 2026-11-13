// Every charityevals model is published only with a passing audit on its current content (build-cea's audit
// loop, audit-cea's output): the latest audits/<id>/audit-r<n>.md says "Verdict: pass" and carries the
// fingerprint scripts/audit-receipt.ts prints for the model and its write-up as they are now. An edit after
// the audit changes the fingerprint and needs a verification round. Models built before receipts are listed
// in audits/grandfathered.json.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { modelSha } from "../../scripts/audit-receipt";

const root = join(import.meta.dirname, "../..");
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const ours = walk(join(root, "models")).map((p) => JSON.parse(readFileSync(p, "utf8"))).filter((m) => m.owner === "charityevals").map((m) => m.id as string);
const grandfathered = new Set<string>(JSON.parse(readFileSync(join(root, "audits/grandfathered.json"), "utf8")).models);

/** The latest round's text, or undefined. */
function latestAudit(id: string): string | undefined {
  const dir = join(root, "audits", id);
  if (!existsSync(dir)) return undefined;
  const rounds = readdirSync(dir).map((f) => /^audit-r(\d+)\.md$/.exec(f)).filter((m) => m !== null).sort((a, b) => Number(b![1]) - Number(a![1]));
  return rounds.length ? readFileSync(join(dir, rounds[0]![0]), "utf8") : undefined;
}

describe("audit receipts", () => {
  for (const id of ours.filter((x) => !grandfathered.has(x)))
    it(`${id}: its latest audit passes on the model as it is now`, () => {
      const text = latestAudit(id);
      expect(text, `no audits/${id}/audit-r<n>.md`).toBeDefined();
      expect(text!, "the latest round's verdict").toMatch(/Verdict:[\s*_]*pass\b/i);
      expect(/Model-sha:\s*([0-9a-f]{64})/.exec(text!)?.[1], "the model or write-up changed after the audit: run a verification round").toBe(modelSha(id));
    });

  it("lists only models that exist and lack a passing receipt", () => {
    for (const id of grandfathered) expect(ours, `${id} in audits/grandfathered.json`).toContain(id);
  });
});
