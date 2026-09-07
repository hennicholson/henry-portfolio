import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Pin the workspace root to this project. A stray package-lock.json in the
     home directory otherwise makes Turbopack infer ~ as the root, which
     mis-scopes file watching and the persistent dev cache (globals.css edits
     were served stale). */
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
