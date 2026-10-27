// <lastmod> for the sitemap: when a charity or model page's own content last changed, from git: the
// newest commit to its model file (and the files it extends), its write-up or its charity's file. A
// charity's page counts all of that charity's models. Changes to the shared assumptions and facts
// shift figures on every page at once; they are left out, so the dates say which pages changed.
// Pages without a model (about, method, ...) get no lastmod. Without git, nothing does.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

/** @param {string} root repository root @returns {(url: string) => string | undefined} */
export function lastmodFor(root) {
  /** @type {Map<string, string>} newest commit date per file */
  const dates = new Map();
  try {
    const log = execFileSync("git", ["log", "--format=@%cI", "--name-only", "--", "models", "charities", "writeups"], {
      cwd: root, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"],
    });
    let date = "";
    for (const line of log.split("\n")) {
      if (line.startsWith("@")) date = new Date(line.slice(1)).toISOString();
      else if (line && !dates.has(line)) dates.set(line, date);
    }
  } catch {
    return () => undefined;
  }

  const walk = (dir) => readdirSync(join(root, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".json") ? [join(dir, e.name)] : []);
  /** @type {Map<string, { id: string; file: string; charity?: string; extends?: string }>} */
  const models = new Map();
  for (const file of walk("models")) {
    const m = JSON.parse(readFileSync(join(root, file), "utf8"));
    models.set(m.id, { id: m.id, file: relative(root, join(root, file)), charity: m.charity, extends: m.extends });
  }
  const chain = (id) => {
    const out = [];
    for (let m = models.get(id); m && out.length < 20; m = m.extends ? models.get(m.extends) : undefined) out.push(m);
    return out;
  };
  const charityOf = (id) => chain(id).find((m) => m.charity)?.charity;
  const filesOf = (id) => chain(id).flatMap((m) => [m.file, `writeups/${m.id}.md`]);
  const newest = (files) => files.map((f) => dates.get(f)).filter(Boolean).sort().at(-1);

  return (url) => {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    if (parts.length === 1) {
      const charity = parts[0];
      const own = [...models.keys()].filter((id) => charityOf(id) === charity);
      if (!own.length) return undefined;
      return newest([`charities/${charity}.json`, ...own.flatMap(filesOf)]);
    }
    if (parts.length === 2 && models.has(parts[1])) return newest([`charities/${parts[0]}.json`, ...filesOf(parts[1])]);
    return undefined;
  };
}
