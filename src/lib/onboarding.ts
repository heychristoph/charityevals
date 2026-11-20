// The walk through Your values on a first visit to the landing page. Only there, and only when the visit
// starts there: a shared link (values in the address), a link to any other page, or a click back home
// from inside the site goes straight to the page. Once finished or skipped it isn't shown again in this
// browser (local storage, like the values themselves; the values chosen are also in the address).

export const ONBOARDED_KEY = "charityevals:onboarded";

export function shouldOnboard(o: { path: string; search: string; referrer: string; origin: string; done: boolean }): boolean {
  if (o.done) return false;
  if (o.path !== "/" && o.path !== "/index.html") return false;
  if ([...new URLSearchParams(o.search).keys()].some((k) => k.startsWith("a."))) return false;
  try {
    // From another page of the site; a reload of the landing page itself still counts as arriving.
    const from = o.referrer ? new URL(o.referrer) : undefined;
    if (from && from.origin === o.origin && from.pathname !== "/") return false;
  } catch {
    /* an unreadable referrer counts as from elsewhere */
  }
  return true;
}

/** Whether this page load opens the walk-through. */
export function onboardingDue(): boolean {
  return shouldOnboard({ path: location.pathname, search: location.search, referrer: document.referrer, origin: location.origin, done: onboarded() });
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
