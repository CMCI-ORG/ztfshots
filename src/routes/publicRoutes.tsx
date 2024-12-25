import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { RouteLoadingIndicator } from "@/components/routes/RouteLoadingIndicator";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";

// Lazy load components
const ClientPortal = lazy(() => import("@/pages/ClientPortal"));
const ClientQuotes = lazy(() => import("@/pages/ClientQuotes"));
const FeaturedQuotes = lazy(() => import("@/pages/FeaturedQuotes"));
const HighlyRatedQuotes = lazy(() => import("@/pages/HighlyRatedQuotes"));
const RecentQuotes = lazy(() => import("@/pages/RecentQuotes"));
const Quote = lazy(() => import("@/pages/Quote"));
const DynamicPage = lazy(() => import("@/pages/DynamicPage"));

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
  // Quote routes need to come before the dynamic page catch-all
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
    path: "/quotes/featured",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <FeaturedQuotes />
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
  // Static pages
  {
    path: "/about",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <DynamicPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/privacy",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <DynamicPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/terms",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <DynamicPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/contact",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <DynamicPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  // Dynamic page catch-all should be last
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

export default publicRoutes;