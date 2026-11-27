// Enforces the palette's contrast floors, then builds core's theme (src/theme/site.*) with the Astryx CLI.
// The palette reaches CSS as theme tokens (see siteTokens in src/theme/theme.ts).
import { spawnSync } from "node:child_process";

import { pairs, ratio } from "../src/theme/theme";

let failed = 0;
for (const [fg, bg, min, modes = [0, 1] as (0 | 1)[]] of pairs) {
  for (const mode of modes) {
    const r = ratio(fg, bg, mode);
    if (r < min) {
      console.error(
        `contrast ${fg} on ${bg} (${mode ? "dark" : "light"}): ${r.toFixed(2)} < ${min}`,
      );
      failed++;
    }
  }
}
if (failed) process.exit(1);
console.log(`palette ok (${pairs.reduce((n, p) => n + (p[3]?.length ?? 2), 0)} contrast checks)`);

const build = spawnSync("bunx", ["astryx", "theme", "build", "src/theme/theme.ts"], {
  stdio: "inherit",
});
if (build.status) process.exit(build.status);
