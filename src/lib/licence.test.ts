import { describe, expect, it } from "vitest";
import { citation, licenceOf, OWN_LICENCE } from "./licence";

describe("licenceOf", () => {
  it("gives our own models CC BY 4.0", () => {
    expect(licenceOf({ owner: "charityevals", source: { license: "anything", publisher: "charityevals" } })).toBe(OWN_LICENCE);
  });

  it("keeps an evaluator's licence, linked when it is a known one", () => {
    const gw = licenceOf({ owner: "givewell", source: { license: "CC BY-NC-SA 3.0 US", publisher: "GiveWell" } });
    expect(gw.url).toBe("https://creativecommons.org/licenses/by-nc-sa/3.0/us/");
    expect(gw.attribution).toBe("GiveWell, rebuilt by charityevals (charityevals.org)");
    expect(licenceOf({ owner: "x", source: { license: "CC BY 4.0 (Zenodo record 1)" } }).url).toBe(OWN_LICENCE.url);
    expect(licenceOf({ owner: "x", source: { license: "EA Forum posts: CC BY 4.0; the sheet carries no licence" } }).url).toBeUndefined();
  });

  it("says when a source states no terms", () => {
    expect(licenceOf({ owner: "ace", source: { publisher: "Animal Charity Evaluators" } }).name).toMatch(/^Animal Charity Evaluators's terms/);
  });
});

describe("citation", () => {
  const day = new Date("2026-11-16T12:00:00Z");
  it("cites our own models as charityevals", () => {
    expect(citation({ owner: "charityevals", name: "Malaria nets" }, "https://charityevals.org/amf", day)).toBe(
      'charityevals, "Malaria nets", https://charityevals.org/amf, accessed 16 November 2026.',
    );
  });
  it("credits the evaluator of a rebuilt model", () => {
    expect(citation({ owner: "givewell", name: "AMF", source: { publisher: "GiveWell" } }, "https://charityevals.org/amf", day)).toMatch(/^GiveWell, rebuilt by charityevals, "AMF"/);
  });
});
