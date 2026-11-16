// Edits to a JSON file's top-level fields that leave the rest of its text as it is: the scripts that
// write tool fields into models (beneficiary-countries.ts) change those lines and nothing else, and
// never write invalid JSON (every edit is parsed back and compared with what was meant).

type Member = { key: string; start: number; valueStart: number; end: number };

const WS = /\s/;

function skipWs(t: string, i: number): number {
  while (i < t.length && WS.test(t[i])) i++;
  return i;
}

function skipString(t: string, i: number): number {
  // t[i] is the opening quote
  for (i++; i < t.length; i++) {
    if (t[i] === "\\") i++;
    else if (t[i] === '"') return i + 1;
  }
  throw new Error("unterminated string");
}

function skipValue(t: string, i: number): number {
  if (t[i] === '"') return skipString(t, i);
  if (t[i] === "{" || t[i] === "[") {
    let depth = 0;
    for (; i < t.length; i++) {
      const c = t[i];
      if (c === '"') { i = skipString(t, i) - 1; continue; }
      if (c === "{" || c === "[") depth++;
      else if (c === "}" || c === "]") { depth--; if (depth === 0) return i + 1; }
    }
    throw new Error("unterminated object or array");
  }
  while (i < t.length && !/[,}\]\s]/.test(t[i])) i++;
  return i;
}

/** The top-level members of a JSON object's text, with where each starts (its key's quote), where its value
 * starts and where it ends. */
export function topLevelMembers(text: string): Member[] {
  let i = skipWs(text, 0);
  if (text[i] !== "{") throw new Error("not a JSON object");
  i = skipWs(text, i + 1);
  const out: Member[] = [];
  while (text[i] !== "}") {
    const start = i;
    const keyEnd = skipString(text, i);
    const key = JSON.parse(text.slice(i, keyEnd)) as string;
    i = skipWs(text, keyEnd);
    if (text[i] !== ":") throw new Error(`no ":" after ${key}`);
    const valueStart = skipWs(text, i + 1);
    const end = skipValue(text, valueStart);
    out.push({ key, start, valueStart, end });
    i = skipWs(text, end);
    if (text[i] === ",") i = skipWs(text, i + 1);
    else if (text[i] !== "}") throw new Error(`unexpected ${JSON.stringify(text[i])} after ${key}`);
  }
  return out;
}

const canonical = (x: unknown): string => Array.isArray(x)
  ? `[${x.map(canonical).join(",")}]`
  : x && typeof x === "object"
    ? `{${Object.keys(x).sort().map((k) => `${JSON.stringify(k)}:${canonical((x as Record<string, unknown>)[k])}`).join(",")}}`
    : JSON.stringify(x);

/** Sets top-level fields in a JSON object's text, each written on one line (`"key": <compact JSON>`):
 * a field set to undefined is removed with its comma, a field already there gets its value replaced (only
 * when its text differs), a new field goes after `after` (or the field inserted just before it, or last).
 * Everything else keeps its bytes. Throws, writing nothing, if the result wouldn't parse to the intended
 * object. */
export function setTopLevel(text: string, fields: Record<string, unknown>, opts: { after?: string } = {}): string {
  const intended = JSON.parse(text) as Record<string, unknown>;
  let t = text;
  let anchor = opts.after;
  for (const [key, value] of Object.entries(fields)) {
    const members = topLevelMembers(t);
    const at = members.findIndex((m) => m.key === key);
    if (value === undefined) {
      delete intended[key];
      if (at < 0) continue;
      const m = members[at];
      // The member and the separator before it (or, for the first member, the one after it).
      if (at > 0) t = t.slice(0, members[at - 1].end) + t.slice(m.end);
      else t = t.slice(0, m.start) + (at + 1 < members.length ? t.slice(members[at + 1].start) : t.slice(skipWs(t, m.end)));
      continue;
    }
    intended[key] = value;
    const json = JSON.stringify(value);
    if (at >= 0) {
      const m = members[at];
      if (t.slice(m.valueStart, m.end) !== json) t = t.slice(0, m.valueStart) + json + t.slice(m.end);
    } else {
      const indent = members.length ? /([ \t]*)$/.exec(t.slice(0, members[0].start))![1] : "  ";
      const after = (anchor && members.find((m) => m.key === anchor)) || members[members.length - 1];
      const entry = `${JSON.stringify(key)}: ${json}`;
      if (after) t = `${t.slice(0, after.end)},\n${indent}${entry}${t.slice(after.end)}`;
      else t = t.replace(/^(\s*)\{\s*/, `$1{\n${indent}${entry}\n`);
    }
    anchor = key;
  }
  let parsed: unknown;
  try { parsed = JSON.parse(t); } catch (e) { throw new Error(`setTopLevel would write invalid JSON (${(e as Error).message})`); }
  if (canonical(parsed) !== canonical(intended)) throw new Error("setTopLevel: the edited text doesn't hold the intended fields");
  return t;
}
