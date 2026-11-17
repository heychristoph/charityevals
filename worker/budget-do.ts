// The Durable Object behind the MCP server's daily budget for calculations with custom values
// (worker/mcp/budget.ts says why a Durable Object). One instance, named "global". Its storage calls block
// other requests to it while they run, so a count is never read twice before it is written.
import { DurableObject } from "cloudflare:workers";
import { nextCount, today, type Count } from "./mcp/budget";

export class McpBudget extends DurableObject {
  /** Counts one calculation; false when today's `limit` is used up. */
  async take(limit: number): Promise<boolean> {
    const next = nextCount(await this.ctx.storage.get<Count>("count"), today(), limit);
    if (next) await this.ctx.storage.put("count", next);
    return !!next;
  }
}
