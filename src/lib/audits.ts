// A model's audit as its page shows it: the latest round (audits/<id>/audit-r<n>.md) when it passes, and the
// rules version it was audited under (scripts/rules-version.ts), to compare with the latest.
import versions from "../../audits/versions.json";

const rounds = import.meta.glob<string>("../../audits/*/audit-r*.md", { eager: true, query: "?raw", import: "default" });
export const releases = versions.releases;
export const latestRules = releases[0].version;

export type Audit = { path: string; rules?: string; behind: boolean };
const latestRound = new Map<string, { round: number; text: string }>();
for (const [key, text] of Object.entries(rounds)) {
  const m = /audits\/([^/]+)\/audit-r(\d+)\.md$/.exec(key);
  if (m && Number(m[2]) > (latestRound.get(m[1])?.round ?? 0)) latestRound.set(m[1], { round: Number(m[2]), text });
}

/** The model's latest audit round if it passes, else undefined. */
export function auditOf(id: string): Audit | undefined {
  const r = latestRound.get(id);
  if (!r || !/Verdict:[\s*_]*pass\b/i.test(r.text)) return undefined;
  const rules = /^Rules:\s*(\d+\.\d+\.\d+)\s*$/m.exec(r.text)?.[1];
  return { path: `audits/${id}/audit-r${r.round}.md`, rules, behind: !!rules && rules !== latestRules };
}
