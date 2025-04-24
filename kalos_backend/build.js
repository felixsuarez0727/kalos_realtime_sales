require("esbuild").build({
    entryPoints: ["server.ts"],
    outfile: "dist/server.js",
    bundle: true,
    platform: "node",
    target: "es2020"
  }).catch(() => process.exit(1));