import stylex from "@stylexjs/unplugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// @propermade/core ships uncompiled stylex.create calls, so Vite must not prebundle it
// (optimizeDeps) or externalize it (ssr.noExternal); the StyleX plugin has to see its source.
const stylexDeps = ["@propermade/core", "@astryxdesign/core"];

export default defineConfig({
  plugins: [stylex.vite({ useCSSLayers: true, dev: false, runtimeInjection: false }), react()],
  resolve: { dedupe: ["react", "react-dom"] },
  optimizeDeps: { exclude: stylexDeps },
  ssr: {
    noExternal: [/^@propermade\//, /^@astryxdesign\//],
    optimizeDeps: { exclude: stylexDeps },
  },
});
