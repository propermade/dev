import { lazy, Suspense, useEffect, useState } from "react";

// The live demo needs the browser (Web Workers, canvas), so it loads only on the client and is
// split into its own chunk: the grid and chart code never ships with the other pages.
const DemoLive = lazy(() => import("../demo/DemoLive"));

export const Demo = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <>
      <div className="page-head">
        <p className="label">Live demo</p>
        <h1>The design system, running</h1>
        <p>
          Real components, live theming, and a streaming workspace with isolated panes, all built
          from the same packages as the projects on the work page.
        </p>
      </div>
      {mounted ? (
        <Suspense fallback={<p className="band">Loading the demo…</p>}>
          <DemoLive />
        </Suspense>
      ) : (
        <p className="band">The demo loads in your browser.</p>
      )}
    </>
  );
};
