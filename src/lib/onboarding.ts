import { shouldAsk } from "./analytics";

// The values screen on a first visit to the landing page. Only there, and only when the visit
// starts there: a shared link (values in the address), a link to any other page, or a click back home
// from inside the site goes straight to the page. Once closed it isn't shown again in this
// browser (local storage, like the values themselves; the values chosen are also in the address).
// Kept light (no React, no data): the page opens it from a small script before its islands load.

export const ONBOARDED_KEY = "charityevals:onboarded";

export function shouldOnboard(o: { path: string; search: string; referrer: string; origin: string; done: boolean }): boolean {
  if (o.done) return false;
  if (o.path !== "/" && o.path !== "/index.html") return false;
  // A link that carries values (?set=…, ?values=…, or the old a.… form; src/lib/assumption-state.ts
  // parseShare) opens straight on them.
  if ([...new URLSearchParams(o.search).keys()].some((k) => k === "set" || k === "values" || k.startsWith("a."))) return false;
  try {
    // From another page of the site; a reload of the landing page itself still counts as arriving.
    const from = o.referrer ? new URL(o.referrer) : undefined;
    if (from && from.origin === o.origin && from.pathname !== "/") return false;
  } catch {
    /* an unreadable referrer counts as from elsewhere */
  }
  return true;
}

/** Whether this page load opens the values screen. */
export function onboardingDue(): boolean {
  return shouldOnboard({ path: location.pathname, search: location.search, referrer: document.referrer, origin: location.origin, done: onboarded() });
}

/** Opens the values screen (server-rendered, in the Onboarding island) as soon as the page
 * is parsed, before the island's code has loaded; html[data-onboarding] says whether that screen asks the
 * analytics question ("ask") or not ("start"). The island takes over once it hydrates. */
export function openOnboarding() {
  const d = document.querySelector<HTMLDialogElement>("dialog.onboarding");
  if (!d || d.open || !onboardingDue()) return;
  document.documentElement.dataset.onboarding = shouldAsk() ? "ask" : "start";
  // Before the island hydrates, Escape mustn't close it either.
  d.addEventListener("cancel", (e) => e.preventDefault());
  d.showModal();
  // The browser would focus the first card, which then looks chosen; the title takes focus instead.
  d.querySelector<HTMLElement>("#onboarding-title")?.focus();
}

export function onboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARDED_KEY) !== null || (localStorage.getItem("charityevals:assumptions") ?? "{}") !== "{}";
  } catch {
    return false;
  }
}

export function markOnboarded() {
  try {
    localStorage.setItem(ONBOARDED_KEY, "1");
  } catch {
    /* private mode: shown again next time */
  }
}
