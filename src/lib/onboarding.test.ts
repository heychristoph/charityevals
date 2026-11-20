import { describe, expect, it } from "vitest";
import { shouldOnboard } from "./onboarding";

const base = { path: "/", search: "", referrer: "", origin: "https://charityevals.org", done: false };

describe("the values walk-through", () => {
  it("opens on a first visit that starts on the landing page", () => {
    expect(shouldOnboard(base)).toBe(true);
    expect(shouldOnboard({ ...base, referrer: "https://www.google.com/" })).toBe(true);
    expect(shouldOnboard({ ...base, referrer: "https://charityevals.org/" })).toBe(true);
  });
  it("never opens once done, on another page, from a shared link or from inside the site", () => {
    expect(shouldOnboard({ ...base, done: true })).toBe(false);
    expect(shouldOnboard({ ...base, path: "/method" })).toBe(false);
    expect(shouldOnboard({ ...base, search: "?a.discount_rate=0.01" })).toBe(false);
    expect(shouldOnboard({ ...base, referrer: "https://charityevals.org/method" })).toBe(false);
  });
});
