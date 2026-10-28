import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

class MemoryStorage {
  private m = new Map<string, string>();
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}

let beacons: { e: string; c: number }[];

/** A minimal browser: storage, a privacy signal, and a beacon that records what was sent. */
function browser(signal: { gpc?: boolean; dnt?: string } = {}) {
  const win = Object.assign(new EventTarget(), { localStorage: new MemoryStorage(), sessionStorage: new MemoryStorage() });
  beacons = [];
  vi.stubGlobal("window", win);
  vi.stubGlobal("navigator", {
    globalPrivacyControl: signal.gpc,
    doNotTrack: signal.dnt ?? null,
    sendBeacon: (_url: string, body: string) => (beacons.push(JSON.parse(body)), true),
  });
  vi.stubGlobal("location", { pathname: "/", hostname: "charityevals.org" });
  vi.stubGlobal("document", { querySelector: () => null });
  return win;
}

// The module keeps an in-memory choice, so each test gets a fresh copy.
const load = () => import("./analytics");

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllGlobals());

describe("shouldAsk", () => {
  it("asks a first-time visitor", async () => {
    browser();
    expect((await load()).shouldAsk()).toBe(true);
  });

  it("doesn't ask once a choice is made, either way", async () => {
    browser();
    const a = await load();
    a.setConsent(false);
    expect(a.shouldAsk()).toBe(false);
    a.setConsent(true);
    expect(a.shouldAsk()).toBe(false);
  });

  it("doesn't ask when the browser sends Global Privacy Control or Do Not Track, and sends nothing", async () => {
    for (const signal of [{ gpc: true }, { dnt: "1" }]) {
      vi.resetModules();
      browser(signal);
      const a = await load();
      expect(a.shouldAsk()).toBe(false);
      a.track("page_view");
      expect(beacons).toEqual([]);
    }
  });

  it("asks again when the stored choice is over a year old", async () => {
    const win = browser();
    win.localStorage.setItem("charityevals:consent", JSON.stringify({ analytics: true, at: Date.now() - 366 * 24 * 3600 * 1000 }));
    expect((await load()).shouldAsk()).toBe(true);
  });
});

describe("setConsent", () => {
  it("announces the choice and starts a session on accept", async () => {
    const win = browser();
    const a = await load();
    const seen: unknown[] = [];
    win.addEventListener(a.CONSENT_EVENT, (e) => seen.push((e as CustomEvent).detail));
    a.setConsent(true);
    expect(seen).toEqual([true]);
    expect(a.getConsent()).toBe("granted");
    expect(beacons.map((b) => [b.e, b.c])).toEqual([["session_start", 1]]);
  });

  it("sends nothing after decline and deletes the ids", async () => {
    const win = browser();
    const a = await load();
    a.setConsent(true);
    a.track("page_view");
    expect(win.localStorage.getItem("charityevals:visitor")).toMatch(/^[a-f0-9]{24}$/);
    beacons.length = 0;
    a.setConsent(false);
    a.track("page_view");
    expect(beacons).toEqual([]);
    expect(win.localStorage.getItem("charityevals:visitor")).toBeNull();
    expect(win.sessionStorage.getItem("charityevals:session")).toBeNull();
  });
});
