import { configDefaults, defineConfig } from "vitest/config";

// Agent worktrees under .claude/ are separate checkouts; their tests aren't this checkout's.
export default defineConfig({ test: { exclude: [...configDefaults.exclude, ".claude/**"] } });
