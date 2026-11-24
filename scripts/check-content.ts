// Fails the build if content or built pages contain material the brief rules out.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const banned: [RegExp, string][] = [
  [/200%\+?\s*YoY/i, "unpublished DriveWealth figure (200%+ YoY)"],
  [/99\.99\s*%/, "unpublished DriveWealth figure (99.99%)"],
  [/20,000\s+(records|trades)/i, "unpublished DriveWealth figure (20,000/s)"],
  [/sub-?100\s*ms/i, "unpublished DriveWealth figure (sub-100ms)"],
  [/60%\s+fewer\s+UI\s+regressions/i, "unpublished DriveWealth figure (60% fewer regressions)"],
  [/40%\s+delivery\s+velocity/i, "unpublished DriveWealth figure (40% velocity)"],
  [/DriveHub/i, "private DriveWealth detail (DriveHub)"],
  [/\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/, "possible phone number"],
];

async function* walk(dir: string): AsyncGenerator<string> {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx|html|md|vtt|txt|xml|json)$/.test(e.name)) yield p;
  }
}

let failed = 0;
for (const root of process.argv.slice(2)) {
  for await (const file of walk(root)) {
    const text = await readFile(file, "utf8");
    for (const [re, why] of banned) {
      if (re.test(text)) {
        console.error(`${file}: ${why}`);
        failed++;
      }
    }
  }
}
if (failed) process.exit(1);
console.log("content check passed");
