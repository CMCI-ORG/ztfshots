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
const AuthorDetail = lazy(() => import("@/pages/AuthorDetail"));
const CategoryDetail = lazy(() => import("@/pages/CategoryDetail"));
const About = lazy(() => import("@/pages/About"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Contact = lazy(() => import("@/pages/Contact"));
const Releases = lazy(() => import("@/pages/Releases"));
const Roadmap = lazy(() => import("@/pages/Roadmap"));
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
  {
    path: "/authors/:id",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <AuthorDetail />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/categories/:id",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <CategoryDetail />
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
    path: "/contact",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Contact />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/releases",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Releases />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/roadmap",
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Roadmap />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  // Dynamic page catch-all route should come last
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