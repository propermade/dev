import stylex from "@stylexjs/unplugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// @propermade/core ships uncompiled stylex.create calls, so Vite must not prebundle it
// (optimizeDeps) or externalize it (ssr.noExternal); the StyleX plugin has to see its source.
const stylexDeps = ["@propermade/core", "@astryxdesign/core"];

export default defineConfig({
  plugins: [stylex.vite({ useCSSLayers: true, dev: false, runtimeInjection: false }), react()],
  resolve: { dedupe: ["react", "react-dom"] },
  optimizeDeps: {
    exclude: stylexDeps,
    // Core's grid imports react-grid-layout, whose fast-equals dependency ships a UMD `browser`
    // build with no named exports. Served raw, it fails in dev with "does not provide an export
    // named 'deepEqual'"; pre-bundling inlines it. Core is excluded above, so name the dependency
    // explicitly instead of relying on Vite to discover it while the page loads.
    include: ["@propermade/core > react-grid-layout"],
  },
  ssr: {
    noExternal: [/^@propermade\//, /^@astryxdesign\//],
    optimizeDeps: { exclude: stylexDeps },
  },
});
