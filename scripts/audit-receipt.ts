// The fingerprint an audit is tied to (audit-cea's output, build-cea's audit loop):
//   npx tsx scripts/audit-receipt.ts <model id>        prints "Model-sha: <sha256>"
// The SHA-256 of the model file and its write-up (writeups/<id>.md, where there is one), so an edit after the
// audit shows: src/engine/audit-receipts.test.ts fails a charityevals model whose latest audit
// (audits/<id>/audit-r<n>.md) isn't a pass on the current fingerprint.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");

function walk(d: string): string[] {
  return readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
  });
}

/** The fingerprint of a model and its write-up, or undefined for a model id with no file. */
export function modelSha(id: string): string | undefined {
  const file = walk(join(root, "models")).find((p) => JSON.parse(readFileSync(p, "utf8")).id === id);
  if (!file) return undefined;
  const h = createHash("sha256").update(readFileSync(file));
  const writeup = join(root, "writeups", `${id}.md`);
  if (existsSync(writeup)) h.update(readFileSync(writeup));
  return h.digest("hex");
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
