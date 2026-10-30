import { describe, expect, it } from "vitest";
import { parseEdit, parseTyped } from "../lib/format";

describe("typed assumption values", () => {
  it("reads percent as shown, with or without the sign", () => {
    expect(parseTyped("4", "percent", false)).toBeCloseTo(0.04);
    expect(parseTyped("0.5%", "percent", true)).toBeCloseTo(0.005);
  });
  it("accepts values past the slider's ends", () => {
    expect(parseTyped("40", "number", true)).toBe(40);
    expect(parseTyped("1,000,000", "number", true)).toBe(1e6);
    expect(parseTyped("2×", "multiple", true)).toBe(2);
  });
  it("rejects what the scale can't hold", () => {
    expect(parseTyped("", "number", true)).toBeUndefined();
    expect(parseTyped("abc", "number", true)).toBeUndefined();
    expect(parseTyped("-1", "number", false)).toBeUndefined();
    expect(parseTyped("0", "number", true)).toBeUndefined();
    expect(parseTyped("0", "percent", false)).toBe(0);
  });
});

describe("typed edits to a model's numbers", () => {
  it("reads them in the number's own terms", () => {
    expect(parseEdit("35%", "percent")).toBeCloseTo(0.35);
    expect(parseEdit("35", "percent")).toBeCloseTo(0.35);
    expect(parseEdit("$1,200", "usd")).toBe(1200);
    expect(parseEdit("-0.5", "number")).toBe(-0.5);
    expect(parseEdit("0", "number")).toBe(0);
  });
  it("rejects what isn't a number", () => {
    expect(parseEdit("", "number")).toBeUndefined();
    expect(parseEdit("  ", "usd")).toBeUndefined();
    expect(parseEdit("ten", "number")).toBeUndefined();
  });
});
