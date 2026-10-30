import { describe, expect, it } from "vitest";
import { gloss } from "./glossary";

describe("gloss", () => {
  it("marks the first use of each term and leaves the rest as text", () => {
    const seen = new Set<string>();
    const p = gloss("SADs averted per dollar, and more SADs", seen);
    expect(p.map((x) => (typeof x === "string" ? x : `[${x.text}]`)).join("")).toBe("[SADs] averted per dollar, and more SADs");
    expect(seen.has("sad")).toBe(true);
  });

  it("explains a term once across texts that share `seen`", () => {
    const seen = new Set<string>();
    gloss("SADs per dollar", seen);
    expect(gloss("SADs per year", seen)).toEqual(["SADs per year"]);
  });

  it("doesn't match inside longer words", () => {
    expect(gloss("SADNESS and DALYsomething")).toEqual(["SADNESS and DALYsomething"]);
  });
});
