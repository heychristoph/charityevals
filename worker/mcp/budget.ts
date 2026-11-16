// The global daily budget for MCP calculations with custom values (the defaults and the value sets are
// precomputed and free). One Durable Object holds the count, so every isolate everywhere shares it:
// a Rate Limiting binding counts per Cloudflare location and over at most a minute, and KV is eventually
// consistent with one write a second per key, so neither caps a day globally. At 20,000 a day the object
// stays well inside Workers Paid's included Durable Object requests and storage. The class itself is
// worker/budget-do.ts (it needs the Workers runtime); the counting is here, where it can be tested.

export const DAILY_CUSTOM = 20_000;

export type Count = { day: string; used: number };

/** One more calculation on `day` (YYYY-MM-DD, UTC), if the day's `limit` allows: the new count, or
 * undefined when it is used up. A new day starts from zero. */
export function nextCount(count: Count | undefined, day: string, limit: number): Count | undefined {
  const used = count?.day === day ? count.used : 0;
  return used < limit ? { day, used: used + 1 } : undefined;
}

export const today = (now = new Date()) => now.toISOString().slice(0, 10);
