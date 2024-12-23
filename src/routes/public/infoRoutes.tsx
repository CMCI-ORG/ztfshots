import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";
import { RouteLoadingIndicator } from "@/components/routes/RouteLoadingIndicator";

const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Subscribe = lazy(() => import("@/pages/Subscribe"));

export const infoRoutes: RouteObject[] = [
  { 
    path: "/about", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <About />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "About - Daily Dose from Z.T. Fomum",
        description: "Learn about our mission to share Z.T. Fomum's spiritual wisdom and teachings with the world.",
      }
    }
  },
  { 
    path: "/contact", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Contact />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Contact Us - Daily Dose from Z.T. Fomum",
        description: "Get in touch with us for any questions or feedback about Z.T. Fomum's quotes and teachings.",
      }
    }
  },
  { 
    path: "/privacy", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Privacy />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Privacy Policy - Daily Dose from Z.T. Fomum",
        description: "Read our privacy policy to understand how we protect your information while using our platform.",
      }
    }
  },
  { 
    path: "/terms", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Terms />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Terms of Service - Daily Dose from Z.T. Fomum",
        description: "Review our terms of service for using the Daily Dose from Z.T. Fomum platform.",
      }
    }
  },
  { 
    path: "/subscribe", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Subscribe />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Subscribe - Daily Dose from Z.T. Fomum",
        description: "Subscribe to receive daily inspirational quotes from Z.T. Fomum directly in your inbox.",
      }
    }
  },
];