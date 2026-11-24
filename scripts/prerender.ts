import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { headFor, llmsTxt, robotsTxt, sitemapXml } from "../src/seo";

const dist = "dist/client";
const template = await readFile(join(dist, "index.html"), "utf8");
const { render, routePaths } = await import(join(process.cwd(), "dist/server/entry-server.js"));

for (const url of routePaths as string[]) {
  const { html } = await render(url);
  const page = template
    .replace("<!--app-->", html)
    .replace("<!--head-->", headFor(url));
  const dir = url === "/" ? dist : join(dist, url);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), page);
  console.log("prerendered", url);
}

await writeFile(join(dist, "sitemap.xml"), sitemapXml());
await writeFile(join(dist, "robots.txt"), robotsTxt());
await writeFile(join(dist, "llms.txt"), llmsTxt());
console.log("wrote sitemap.xml, robots.txt, llms.txt");
