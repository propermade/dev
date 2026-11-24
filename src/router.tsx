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
import { AiPage, HomePage, UiPage } from "./routes/pages";
import { ModeToggle, ThemeShell } from "./components/ThemeShell";
import "@propermade/core/index.css";
import "./styles/site.css";

const Root = () => (
  <ThemeShell>
    <a className="skip" href="#main">Skip to content</a>
    <header>
      <Link to="/">{site.name}</Link>
      <nav aria-label="Primary">
        <Link to="/ui/">ui</Link>
        <Link to="/ai/">ai</Link>
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
  createRoute({ getParentRoute: () => rootRoute, path, head: () => ({ meta: [{ title }] }), component });

export const routePaths = ["/", "/ui/", "/ai/"] as const;

const routeTree = rootRoute.addChildren([
  route("/", pages[0]!.title, HomePage),
  route("/ui/", pages[1]!.title, UiPage),
  route("/ai/", pages[2]!.title, AiPage),
]);

export const createAppRouter = (history?: RouterHistory) =>
  createRouter({ routeTree, history, defaultPreload: "intent", trailingSlash: "always" });

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
