import stylex from "@stylexjs/unplugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// @propermade/core is linked from a sibling ui checkout, so keep one copy of React
// and bundle core into the SSR build (its CSS imports and "use client" files need Vite).
export default defineConfig({
  plugins: [stylex.vite({ useCSSLayers: true, dev: false, runtimeInjection: false }), react()],
  resolve: { dedupe: ["react", "react-dom"] },
  ssr: { noExternal: ["@propermade/core", /^@astryxdesign\//] },
});
