import { describe, expect, it } from "vitest";
import { lib, primaryOf } from "./data";
import { similarCharities } from "./similar";

const similar = similarCharities(lib, primaryOf);
const withPage = [...lib.charities.values()].filter((c) => primaryOf(lib, c.id));

describe("similar charities", () => {
  it("gives every charity with a page a few others with pages, never itself, same cause first", () => {
    for (const c of withPage) {
      const ids = similar.get(c.id)!;
      expect(ids.length).toBe(4);
      expect(ids).not.toContain(c.id);
      for (const id of ids) expect(primaryOf(lib, id), `${c.id} → ${id}`).toBeDefined();
      const sameCause = withPage.filter((o) => o.id !== c.id && o.cause === c.cause).length;
      const shown = ids.filter((id) => lib.charities.get(id)!.cause === c.cause).length;
      expect(shown).toBe(Math.min(4, sameCause));
    }
  });

  it("finds charities doing the same work", () => {
    expect(similar.get("against-malaria-foundation")).toContain("malaria-consortium");
    expect(similar.get("the-humane-league")!.some((id) => lib.charities.get(id)!.cause === "animal-welfare")).toBe(true);
  });
});
