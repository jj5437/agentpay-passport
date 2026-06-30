import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@agentpay/db": path.resolve(__dirname, "../../packages/db/src/index.ts"),
      "@agentpay/email": path.resolve(__dirname, "../../packages/email/src/index.ts"),
      "@agentpay/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts")
    }
  },
  test: {
    environment: "node"
  }
});
