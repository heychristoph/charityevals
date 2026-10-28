import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import logos from "../../generated/logos.json";
import { monogram } from "./CharityLogo";

const repo = join(import.meta.dirname, "../..");
const charityIds = new Set(readdirSync(join(repo, "charities")).map((f) => f.replace(/\.json$/, "")));

describe("charity logos", () => {
  it("are small square WebP files for known charities, with their source recorded", () => {
    for (const [id, e] of Object.entries(logos)) {
      expect(charityIds.has(id), id).toBe(true);
      expect(e.file).toBe(`/logos/${id}.webp`);
      expect(e.source).toMatch(/^https?:\/\//);
      const path = join(repo, "public", e.file);
      expect(statSync(path).size, id).toBeLessThanOrEqual(20 * 1024);
      const head = readFileSync(path).subarray(0, 12).toString("latin1");
      expect(head.slice(0, 4) + head.slice(8, 12), id).toBe("RIFFWEBP");
    }
  });

  it("has no file without a manifest entry", () => {
    const listed = new Set(Object.values(logos).map((e) => e.file.split("/").pop()));
    for (const f of readdirSync(join(repo, "public/logos"))) expect(listed.has(f), f).toBe(true);
  });

  it("falls back to one or two initials", () => {
    expect(monogram("Against Malaria Foundation")).toBe("AM");
    expect(monogram("The Humane League")).toBe("HL");
    expect(monogram("J-PAL")).toBe("J");
    expect(monogram("Çiftlik Hayvanlarını Koruma Derneği")).toBe("ÇH");
  });
});
