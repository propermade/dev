import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { Suspense } from "react";
import { renderToString } from "react-dom/server";
import { createAppRouter, routePaths } from "./router";

export { routePaths };

export async function render(url: string) {
  const router = createAppRouter(createMemoryHistory({ initialEntries: [url] }));
  await router.load();
  const title = router.state.matches.at(-1)?.meta?.find((m) => m?.title)?.title ?? "";
  return { html: renderToString(
      // The client router wraps its matches in a Suspense boundary; mirror it so hydration lines up.
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>,
    ), title: String(title) };
}
