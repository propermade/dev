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
import "@fontsource/atkinson-hyperlegible-next/400.css";
import "@fontsource/atkinson-hyperlegible-next/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./styles/site.css";

const Root = () => (
  <ThemeShell>
    <a className="skip" href="#main">Skip to content</a>
    <header className="site-header">
      <Link to="/">{site.name}</Link>
      <nav aria-label="Primary">
        <Link to="/ui/" className="nav-link" activeProps={{ "aria-current": "page" }}>ui</Link>
        <Link to="/ai/" className="nav-link" activeProps={{ "aria-current": "page" }}>ai</Link>
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
  createRouter({ routeTree, history, defaultPreload: "intent", defaultViewTransition: true, trailingSlash: "always" });

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
