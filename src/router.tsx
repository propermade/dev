import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  type RouterHistory,
} from "@tanstack/react-router";
import { site } from "./content/site";
import { pages } from "./seo";
import { Home } from "./routes";
import { Work } from "./routes/work";
import { ModeToggle, ThemeShell } from "./components/ThemeShell";
import "@propermade/core/index.css";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-mono/400.css";
import "./styles/site.css";

const Root = () => (
  <ThemeShell>
    <a className="skip" href="#main">
      Skip to content
    </a>
    <header className="site-header">
      <Link to="/">{site.name}</Link>
      <nav aria-label="Primary">
        <ModeToggle />
      </nav>
    </header>
    <main id="main" tabIndex={-1}>
      <Outlet />
    </main>
  </ThemeShell>
);

const rootRoute = createRootRoute({ component: Root });

const route = <P extends string>(path: P, title: string, component: () => React.JSX.Element) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path,
    head: () => ({ meta: [{ title }] }),
    component,
  });

export const routePaths = ["/", "/work"] as const;

const routeTree = rootRoute.addChildren([
  route("/", pages[0]!.title, Home),
  route("/work", pages[1]!.title, Work),
]);

export const createAppRouter = (history?: RouterHistory) =>
  createRouter({
    routeTree,
    history,
    defaultPreload: "intent",
    defaultViewTransition: true,
    trailingSlash: "always",
  });

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
