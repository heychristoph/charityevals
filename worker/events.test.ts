import { describe, expect, it } from "vitest";
import { BLOBS, toDataPoint, token } from "./events";

const blob = (p: ReturnType<typeof toDataPoint>, name: (typeof BLOBS)[number]) => p!.blobs[BLOBS.indexOf(name)];
const ID = "a1b2c3d4e5f6a7b8c9d0e1f2";

describe("analytics events", () => {
  it("drops unknown events and junk bodies", () => {
    expect(toDataPoint({ e: "nope" })).toBeUndefined();
    expect(toDataPoint(null)).toBeUndefined();
    expect(toDataPoint("page_view")).toBeUndefined();
  });

  it("keeps the path but not the query string, which holds the visitor's assumptions", () => {
    const p = toDataPoint({ e: "page_view", p: "/givedirectly?a.discount=0.04#flags" });
    expect(blob(p, "path")).toBe("/givedirectly");
  });

  it("sends no ids or country without consent", () => {
    const p = toDataPoint({ e: "donate_click", p: "/", ch: "givedirectly", v: ID, s: ID }, "NL");
    expect(blob(p, "tier")).toBe("anon");
    expect(blob(p, "visitor")).toBe("");
    expect(blob(p, "session")).toBe("");
    expect(blob(p, "country")).toBe("");
    expect(p!.indexes).toEqual(["anon:donate_click"]);
  });

  it("keeps the random ids and country with consent, and samples by session", () => {
    const p = toDataPoint({ e: "page_view", c: 1, p: "/", v: ID, s: ID, r: "news.ycombinator.com" }, "NL");
    expect(blob(p, "tier")).toBe("consent");
    expect(blob(p, "visitor")).toBe(ID);
    expect(blob(p, "country")).toBe("NL");
    expect(blob(p, "referrer")).toBe("news.ycombinator.com");
    expect(p!.indexes).toEqual([ID]);
  });

  it("rejects ids that aren't random tokens, and free text in any field", () => {
    const p = toDataPoint({ e: "assumption_change", c: 1, v: "jane@example.org", k: "discount rate; DROP", d: "higher", n: 0.04321 });
    expect(blob(p, "visitor")).toBe("");
    expect(blob(p, "key")).toBe("discountrateDROP");
    expect(p!.doubles).toEqual([0.043]);
    expect(token("hello world @x")).toBe("helloworldx");
  });

  it("has at most 20 blobs", () => {
    expect(BLOBS.length).toBeLessThanOrEqual(20);
  });
});
