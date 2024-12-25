import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";
import { RouteLoadingIndicator } from "@/components/routes/RouteLoadingIndicator";
import { Suspense } from "react";
import Releases from "@/pages/Releases";
import Roadmap from "@/pages/Roadmap";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/about",
    element: <About />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/contact",
    element: <Contact />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/releases",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Releases />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/roadmap",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Roadmap />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />
  },
];
