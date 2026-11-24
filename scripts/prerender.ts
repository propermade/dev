import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const dist = "dist/client";
const template = await readFile(join(dist, "index.html"), "utf8");
const { render, routePaths } = await import(join(process.cwd(), "dist/server/entry-server.js"));

for (const url of routePaths as string[]) {
  const { html, title } = await render(url);
  const page = template
    .replace("<!--app-->", html)
    .replace("<!--head-->", `<title>${esc(title)} · Ryan Watkins-Hughes</title>`);
  const dir = url === "/" ? dist : join(dist, url);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), page);
  console.log("prerendered", url);
}
