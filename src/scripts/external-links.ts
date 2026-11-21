// Links to other sites open in a new tab. Set on the click itself, so it covers links React draws
// later too; a link that names its own target keeps it.
document.addEventListener(
  "click",
  (e) => {
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a || a.target || a.hasAttribute("download")) return;
    if (a.protocol !== "http:" && a.protocol !== "https:") return;
    if (a.origin === location.origin) return;
    a.target = "_blank";
    if (!/\bnoopener\b/.test(a.rel)) a.rel = `${a.rel} noopener`.trim();
  },
  true,
);
