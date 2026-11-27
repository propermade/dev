import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { Suspense } from "react";
import { renderToString } from "react-dom/server";

import { createAppRouter, routePaths } from "./router";

export { routePaths };

export async function render(url: string) {
  // The router uses trailing slashes. Asked for a path without one, it redirects and renders nothing.
  const entry = url.endsWith("/") ? url : `${url}/`;
  const router = createAppRouter(createMemoryHistory({ initialEntries: [entry] }));
  await router.load();
  const title = router.state.matches.at(-1)?.meta?.find((m) => m?.title)?.title ?? "";
  return {
    html: renderToString(
      // The client router wraps its matches in a Suspense boundary; mirror it so hydration lines up.
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>,
    ),
    title: String(title),
  };
}
