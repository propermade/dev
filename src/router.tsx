import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  type RouterHistory,
} from "@tanstack/react-router";
import "./styles/site.css";

const Root = () => (
  <>
    <a className="skip" href="#main">Skip to content</a>
    <header>
      <Link to="/">Ryan Watkins-Hughes</Link>
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

const page = <P extends string>(path: P, title: string, body: string) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path,
    head: () => ({ meta: [{ title }] }),
    component: () => (
      <>
        <h1>{title}</h1>
        <p>{body}</p>
      </>
    ),
  });

export const routePaths = ["/", "/ui/", "/ai/"] as const;

const routeTree = rootRoute.addChildren([
  page("/", "Design Systems & Frontend Platform Lead", "Placeholder: lead claim, selected work, about, contact."),
  page("/ui/", "ui", "Placeholder: the design system."),
  page("/ai/", "ai", "Placeholder: the agent workflow."),
]);

export const createAppRouter = (history?: RouterHistory) =>
  createRouter({ routeTree, history, defaultPreload: "intent", trailingSlash: "always" });

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
