import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";
import Login from "@/pages/Login";
import ClientPortal from "@/pages/ClientPortal";
import ClientQuotes from "@/pages/ClientQuotes";
import Quote from "@/pages/Quote";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Subscribe from "@/pages/Subscribe";

export const publicRoutes: RouteObject[] = [
  { 
    path: "/login", 
    element: <Login />,
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
    element: <ClientPortal />,
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
    element: <ClientQuotes />,
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Explore Quotes - Daily Dose from Z.T. Fomum",
        description: "Browse our extensive collection of Christian quotes by Z.T. Fomum. Find inspiration for your spiritual growth and daily walk with God.",
      }
    }
  },
  { 
    path: "/quote/:id", 
    element: <Quote />,
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
    element: <About />,
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
    element: <Contact />,
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
    element: <Privacy />,
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
    element: <Terms />,
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
    element: <Subscribe />,
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Subscribe - Daily Dose from Z.T. Fomum",
        description: "Subscribe to receive daily inspirational quotes from Z.T. Fomum directly in your inbox.",
      }
    }
  },
];