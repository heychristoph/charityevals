import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { modelHistory } from "./history";
import { buildLibrary } from "../engine/model";

const repo = join(import.meta.dirname, "../..");

describe("model history", () => {
  it("recomputes the bottom line at each commit and lists changed rows", () => {
    const dir = mkdtempSync(join(tmpdir(), "ce-history-"));
    cpSync(join(repo, "assumptions"), join(dir, "assumptions"), { recursive: true });
    // Only the facts these two models read; the generated GiveWell facts would just slow git down.
    for (const f of ["kenya.json", "malawi.json", "sad_factors.json", "aim_sads.json", "welfare_ranges.json"]) cpSync(join(repo, "facts", f), join(dir, "facts", f));
    for (const f of ["animal-welfare/sinergia-animal.json", "global-health/givedirectly.json"])
      cpSync(join(repo, "models", f), join(dir, "models", f));
    const g = (...args: string[]) =>
      execFileSync("git", args, { cwd: dir, env: { ...process.env, GIT_AUTHOR_NAME: "T", GIT_AUTHOR_EMAIL: "t@example.com", GIT_COMMITTER_NAME: "T", GIT_COMMITTER_EMAIL: "t@example.com" } });
    g("init", "-q");
    g("add", ".");
    g("commit", "-qm", "Import Sinergia");

    const path = "models/animal-welfare/sinergia-animal.json";
    const file = JSON.parse(readFileSync(join(dir, path), "utf8"));
    file.rows.find((r: { id: string }) => r.id === "cf_years_until_effect").value = { low: 2, best: 6, high: 7 };
    writeFileSync(join(dir, path), JSON.stringify(file));
    g("commit", "-qam", "Longer wait for cage-free");

    const lib = buildLibrary([file], JSON.parse(readFileSync(join(dir, "assumptions/default.json"), "utf8")));
    const model = lib.models.get("sinergia-animal")!;
    const h = modelHistory(dir, model, [path]);

    expect(h.map((e) => e.subject)).toEqual(["Import Sinergia", "Longer wait for cage-free"]);
    expect(h[0].note).toMatch(/First version/);
    expect(h[1].changes.map((c) => c.id)).toEqual(["cf_years_until_effect"]);
    expect(h[1].changes[0]).toMatchObject({ before: "4", after: "6", kind: "value" });
    expect(h[1].ours!).toBeLessThan(h[0].ours!);
  }, 30_000); // runs git a dozen times; slow when other test files run alongside
});
