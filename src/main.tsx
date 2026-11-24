import { RouterProvider } from "@tanstack/react-router";
import { hydrateRoot } from "react-dom/client";
import { createAppRouter } from "./router";

const router = createAppRouter();
await router.load();
hydrateRoot(document.getElementById("root")!, <RouterProvider router={router} />);
