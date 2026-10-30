// Info tips for special terms in static prose (write-ups, method): the first use of each term on the
// page gets the same toggletip InfoTip gives React islands, from the same glossary. Islands that render
// their own text use Glossed instead.
import { TERMS } from "../lib/glossary";
import "../components/info-tip.css";

const ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';
const SKIP = "a, code, pre, h1, h2, h3, h4, h5, h6, button, .info-tip, [data-figure], summary";

function tip(text: string, meaning: string, n: number): HTMLElement {
  const wrap = document.createElement("span");
  wrap.className = "nobr";
  wrap.append(text, " ");
  const box = document.createElement("span");
  box.className = "info-tip";
  const id = `gloss-${n}`;
  box.innerHTML = `<button type="button" class="info-tip-button" aria-expanded="false" aria-controls="${id}">${ICON}</button><span id="${id}" role="status" class="info-tip-bubble" hidden></span>`;
  box.querySelector("button")!.setAttribute("aria-label", `Meaning of ${text}`);
  box.querySelector(".info-tip-bubble")!.textContent = meaning;
  wrap.append(box);
  return wrap;
}

function annotate() {
  const seen = new Set<string>();
  let n = 0;
  for (const root of document.querySelectorAll<HTMLElement>("[data-gloss]")) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (t) => (t.parentElement?.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    const texts: Text[] = [];
    while (walker.nextNode()) texts.push(walker.currentNode as Text);
    for (const t of texts) {
      for (const term of TERMS) {
        if (seen.has(term.id)) continue;
        const m = t.data.match(term.match);
        if (!m || m.index === undefined) continue;
        // Split the text node around the term and put the term with its tip in between.
        const after = t.splitText(m.index);
        const rest = after.splitText(m[0].length);
        after.replaceWith(tip(m[0], term.meaning, n++));
        seen.add(term.id);
        texts.push(rest);
        break;
      }
    }
  }
}

function close(except?: Element) {
  for (const b of document.querySelectorAll<HTMLButtonElement>("[data-gloss] .info-tip-button[aria-expanded=true]")) {
    if (b === except) continue;
    b.setAttribute("aria-expanded", "false");
    (b.nextElementSibling as HTMLElement).hidden = true;
  }
}

annotate();
document.addEventListener("click", (e) => {
  const b = (e.target as Element).closest?.("[data-gloss] .info-tip-button");
  close(b ?? undefined);
  if (!b) return;
  const open = b.getAttribute("aria-expanded") !== "true";
  b.setAttribute("aria-expanded", String(open));
  (b.nextElementSibling as HTMLElement).hidden = !open;
});
document.addEventListener("keydown", (e) => e.key === "Escape" && close());
