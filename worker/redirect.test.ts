import { describe, expect, it } from "vitest";
import worker, { redirectTarget } from "./redirect";

describe("charityevals.com redirect", () => {
  it("keeps the path and query", () => {
    expect(redirectTarget("http://www.charityevals.com/givedirectly?view=evaluator#x")).toBe("https://charityevals.org/givedirectly?view=evaluator#x");
    expect(redirectTarget("https://charityevals.com/")).toBe("https://charityevals.org/");
  });

  it("answers with a permanent redirect", () => {
    const r = worker.fetch(new Request("https://charityevals.com/about"));
    expect(r.status).toBe(301);
    expect(r.headers.get("Location")).toBe("https://charityevals.org/about");
  });
});
