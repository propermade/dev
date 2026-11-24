import { RouterProvider } from "@tanstack/react-router";
import { hydrateRoot } from "react-dom/client";
import { createAppRouter } from "./router";

const router = createAppRouter();
await router.load();

// Keep the tab title in step on client navigation (the prerender sets it for the first load).
router.subscribe("onResolved", () => {
  const t = router.state.matches.at(-1)?.meta?.find((m) => m?.title)?.title;
  if (t) document.title = `${t} · Ryan Watkins-Hughes`;
});

hydrateRoot(document.getElementById("root")!, <RouterProvider router={router} />);
