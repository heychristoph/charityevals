// Lint every model in the library and print findings by severity and code.
//   npx tsx scripts/lint-all.ts [--severity high|medium|low] [--owner charityevals] [--json]
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary } from "../src/engine/model";
import { lintModel, type Finding } from "../src/engine/lint";

const root = join(import.meta.dirname, "..");
const args = process.argv.slice(2);
const flag = (n: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : undefined);
const order = ["high", "medium", "low"];
const minSev = order.indexOf(flag("--severity") ?? "medium");
const owner = flag("--owner");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
  });

const lib = buildLibrary(
  walk(join(root, "models")).map(read),
  read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read),
  walk(join(root, "charities")).map(read),
  read(join(root, "owners.json")),
);
const out: (Finding & { model: string })[] = [];
for (const m of lib.models.values()) {
  if (owner && m.owner !== owner) continue;
  for (const f of lintModel(lib, m)) if (order.indexOf(f.severity) <= minSev) out.push({ ...f, model: m.id });
}
if (args.includes("--json")) console.log(JSON.stringify(out, null, 2));
else {
  const by = new Map<string, typeof out>();
  for (const f of out) by.set(`${f.severity} ${f.code}`, [...(by.get(`${f.severity} ${f.code}`) ?? []), f]);
  for (const [k, fs] of [...by].sort((a, b) => order.indexOf(a[0].split(" ")[0]) - order.indexOf(b[0].split(" ")[0]))) {
    console.log(`\n## ${k}: ${fs.length} findings, ${new Set(fs.map((f) => f.model)).size} models`);
    for (const f of fs.slice(0, 8)) console.log(`- ${f.model}${f.row ? ` ${f.row}` : ""}: ${f.message}`);
  }
  console.log(`\n${out.length} findings over ${lib.models.size} models (errors loading: ${lib.errors.length})`);
}
