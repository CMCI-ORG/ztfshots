import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";
import { RouteLoadingIndicator } from "@/components/routes/RouteLoadingIndicator";

const ClientPortal = lazy(() => import("@/pages/ClientPortal"));
const ClientQuotes = lazy(() => import("@/pages/ClientQuotes"));
const HighlyRatedQuotes = lazy(() => import("@/pages/HighlyRatedQuotes"));
const FeaturedQuotes = lazy(() => import("@/pages/FeaturedQuotes"));
const RecentQuotes = lazy(() => import("@/pages/RecentQuotes"));
const Quote = lazy(() => import("@/pages/Quote"));

export const contentRoutes: RouteObject[] = [
  { 
    path: "/", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <ClientPortal />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Daily Dose from Z.T. Fomum - Inspirational Christian Quotes",
        description: "Discover daily inspiration through powerful Christian quotes by Z.T. Fomum. Transform your spiritual journey with biblical wisdom and teachings.",
      }
    }
  },
  { 
    path: "/quotes", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <ClientQuotes />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Explore Quotes - Daily Dose from Z.T. Fomum",
        description: "Browse our extensive collection of Christian quotes by Z.T. Fomum. Find inspiration for your spiritual growth and daily walk with God.",
      }
    }
  },
  { 
    path: "/quotes/highly-rated", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <HighlyRatedQuotes />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Highly Rated Quotes - Daily Dose from Z.T. Fomum",
        description: "Explore our most impactful and beloved quotes, as rated by our community.",
      }
    }
  },
  { 
    path: "/quotes/featured", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <FeaturedQuotes />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Featured Quotes - Daily Dose from Z.T. Fomum",
        description: "Discover our handpicked selection of inspiring and transformative quotes.",
      }
    }
  },
  { 
    path: "/quotes/recent", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <RecentQuotes />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Recent Quotes - Daily Dose from Z.T. Fomum",
        description: "Stay updated with our latest additions of inspiring quotes.",
      }
    }
  },
  { 
    path: "/quote/:id", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Quote />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Quote Details - Daily Dose from Z.T. Fomum",
        description: "Read and reflect on this powerful quote from Z.T. Fomum's teachings.",
      }
    }
  },
];