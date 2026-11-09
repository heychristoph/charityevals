import { configDefaults, defineConfig } from "vitest/config";

// Agent worktrees under .claude/ are separate checkouts, and sources/ holds other projects' code we
// keep for reference; neither's tests are this checkout's.
export default defineConfig({ test: { exclude: [...configDefaults.exclude, ".claude/**", "sources/**"] } });
