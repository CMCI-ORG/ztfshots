import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";
import { RouteLoadingIndicator } from "@/components/routes/RouteLoadingIndicator";

const Home = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Releases = lazy(() => import("@/pages/Releases"));
const Roadmap = lazy(() => import("@/pages/Roadmap"));

export const publicRoutes: RouteObject[] = [
  { 
    path: "/", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Home />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Home - Daily Dose from Z.T. Fomum",
        description: "Get your daily dose of spiritual wisdom from Z.T. Fomum's teachings.",
      }
    }
  },
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
    path: "/releases", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Releases />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Release Notes - Daily Dose from Z.T. Fomum",
        description: "Check out our latest updates and improvements to the platform.",
      }
    }
  },
  { 
    path: "/roadmap", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Roadmap />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Product Roadmap - Daily Dose from Z.T. Fomum",
        description: "See what's coming next in our journey to share Z.T. Fomum's teachings.",
      }
    }
  },
];