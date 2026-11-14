import { configDefaults, defineConfig } from "vitest/config";

// Agent worktrees under .claude/ are separate checkouts, and sources/ holds other projects' code we
// keep for reference; neither's tests are this checkout's. Whole-library tests take seconds, more when several
// checkouts test at once: a minute before a test counts as hung.
export default defineConfig({ test: { exclude: [...configDefaults.exclude, ".claude/**", "sources/**"], testTimeout: 60_000 } });
