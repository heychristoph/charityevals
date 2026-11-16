// Editing a page URL's query without re-encoding the rest: URLSearchParams would rewrite every param
// (`values=a:1,b:2` becomes `values=a%3A1%2Cb%3A2`), so each state module edits only its own keys and
// leaves the others exactly as written.

const keyOf = (pair: string) => {
  const k = pair.split("=")[0].replace(/\+/g, " ");
  try {
    return decodeURIComponent(k);
  } catch {
    return k;
  }
};

/** A query value, readable: `:` and `,` stay as they are. */
const encodeValue = (v: string) => encodeURIComponent(v).replace(/%3A/gi, ":").replace(/%2C/gi, ",");

/** `href` without the params `drop` picks, with `add` appended; every other param, and the hash, untouched. */
export function editQuery(href: string, drop: (key: string) => boolean, add: [string, string][] = []): string {
  const url = new URL(href);
  const pairs = url.search.slice(1).split("&").filter((p) => p && !drop(keyOf(p)));
  for (const [k, v] of add) pairs.push(`${encodeURIComponent(k)}=${encodeValue(v)}`);
  url.search = pairs.length ? `?${pairs.join("&")}` : "";
  return url.href;
}
