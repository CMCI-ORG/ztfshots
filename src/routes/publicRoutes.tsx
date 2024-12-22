import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";
import { RouteLoadingIndicator } from "@/components/routes/RouteLoadingIndicator";
import { lazy, Suspense } from "react";

// Lazy load components
const Login = lazy(() => import("@/pages/Login"));
const ClientPortal = lazy(() => import("@/pages/ClientPortal"));
const ClientQuotes = lazy(() => import("@/pages/ClientQuotes"));
const HighlyRatedQuotes = lazy(() => import("@/pages/HighlyRatedQuotes"));
const FeaturedQuotes = lazy(() => import("@/pages/FeaturedQuotes"));
const RecentQuotes = lazy(() => import("@/pages/RecentQuotes"));
const Quote = lazy(() => import("@/pages/Quote"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Subscribe = lazy(() => import("@/pages/Subscribe"));

export const publicRoutes: RouteObject[] = [
  { 
    path: "/login", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Login />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Login - Daily Dose from Z.T. Fomum",
        description: "Sign in to access your account and manage your favorite quotes",
      }
    }
  },
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
