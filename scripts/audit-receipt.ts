// The fingerprint an audit is tied to (audit-cea's output, build-cea's audit loop):
//   npx tsx scripts/audit-receipt.ts <model id>        prints "Model-sha: <sha256>"
// The SHA-256 of the model's content (not its write-up, which is prose about it and may be reworded), so an
// edit to the model after the audit shows: src/engine/audit-receipts.test.ts fails a charityevals model whose latest audit
// (audits/<id>/audit-r<n>.md) isn't a pass on the current fingerprint. The content, not the file's bytes: keys
// sorted, layout ignored, and the fields the after-merge scripts write (`beneficiaries`, `beneficiaries_note`, `missing_data`) left
// out, so running them doesn't void an audit.
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const TOOL_WRITTEN = new Set(["beneficiaries", "beneficiaries_note", "missing_data"]);

function walk(d: string): string[] {
  return readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
  });
}

/** JSON with sorted keys, so layout and key order don't count. */
function canonical(x: unknown): string {
  if (Array.isArray(x)) return `[${x.map(canonical).join(",")}]`;
  if (x && typeof x === "object")
    return `{${Object.keys(x).sort().map((k) => `${JSON.stringify(k)}:${canonical((x as Record<string, unknown>)[k])}`).join(",")}}`;
  return JSON.stringify(x);
}

/** The fingerprint of a parsed model's content. */
export function contentSha(model: Record<string, unknown>): string {
  const m = { ...model };
  for (const k of TOOL_WRITTEN) delete m[k];
  return createHash("sha256").update(canonical(m)).digest("hex");
}

/** The fingerprint of a model's content, or undefined for a model id with no file. */
export function modelSha(id: string): string | undefined {
  const file = walk(join(root, "models")).find((p) => JSON.parse(readFileSync(p, "utf8")).id === id);
  if (!file) return undefined;
  return contentSha(JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const id = process.argv[2];
  const sha = id && modelSha(id);
  if (!sha) {
    console.error(`usage: npx tsx scripts/audit-receipt.ts <model id> (no model "${id}")`);
    process.exit(1);
  }
  console.log(`Model-sha: ${sha}`);
}
