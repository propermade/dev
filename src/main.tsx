import { RouterProvider } from "@tanstack/react-router";
import { createRoot, hydrateRoot } from "react-dom/client";

import { createAppRouter } from "./router";

const router = createAppRouter();
await router.load();

// Keep the tab title in step on client navigation (the prerender sets it for the first load).
router.subscribe("onResolved", () => {
  const t = router.state.matches.at(-1)?.meta?.find((m) => m?.title)?.title;
  if (t) document.title = String(t);
});

const root = document.getElementById("root")!;
const app = <RouterProvider router={router} />;
// Built pages ship prerendered HTML to hydrate. The dev server serves the bare template (just the
// <!--app--> comment), so there is nothing to hydrate and a plain render avoids a mismatch.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
