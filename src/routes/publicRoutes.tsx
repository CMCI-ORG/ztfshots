import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";
import { RouteLoadingIndicator } from "@/components/routes/RouteLoadingIndicator";

const ClientPortal = lazy(() => import("@/pages/ClientPortal"));
const ClientQuotes = lazy(() => import("@/pages/ClientQuotes"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const DynamicPage = lazy(() => import("@/pages/DynamicPage"));
const HighlyRatedQuotes = lazy(() => import("@/pages/HighlyRatedQuotes"));
const FeaturedQuotes = lazy(() => import("@/pages/FeaturedQuotes"));
const RecentQuotes = lazy(() => import("@/pages/RecentQuotes"));
const Quote = lazy(() => import("@/pages/Quote"));

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <ClientPortal />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/quotes",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <ClientQuotes />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/quotes/highly-rated",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <HighlyRatedQuotes />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/quotes/featured",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <FeaturedQuotes />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/quotes/recent",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <RecentQuotes />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/quote/:id",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Quote />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <About />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/contact",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Contact />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/privacy",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Privacy />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/terms",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Terms />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:pageKey",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <DynamicPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
];