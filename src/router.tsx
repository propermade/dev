import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  type RouterHistory,
} from "@tanstack/react-router";
import { site } from "./content/site";
import { ai } from "./content/ai";
import { home } from "./content/home";
import { ui } from "./content/ui";
import { AiPage, HomePage, UiPage } from "./routes/pages";
import "./styles/site.css";

const Root = () => (
  <>
    <a className="skip" href="#main">Skip to content</a>
    <header>
      <Link to="/">{site.name}</Link>
      <nav aria-label="Primary">
        <Link to="/ui/">ui</Link>
        <Link to="/ai/">ai</Link>
      </nav>
    </header>
    <main id="main" tabIndex={-1}>
      <Outlet />
    </main>
  </>
);

const rootRoute = createRootRoute({ component: Root });

const route = <P extends string>(path: P, title: string, component: () => React.JSX.Element) =>
  createRoute({ getParentRoute: () => rootRoute, path, head: () => ({ meta: [{ title }] }), component });

export const routePaths = ["/", "/ui/", "/ai/"] as const;

const routeTree = rootRoute.addChildren([
  route("/", home.title, HomePage),
  route("/ui/", ui.title, UiPage),
  route("/ai/", ai.title, AiPage),
]);

export const createAppRouter = (history?: RouterHistory) =>
  createRouter({ routeTree, history, defaultPreload: "intent", trailingSlash: "always" });

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
