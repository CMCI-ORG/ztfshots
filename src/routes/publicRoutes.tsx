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
    errorElement: <RouteErrorBoundary />
  },
  { 
    path: "/", 
    element: <ClientPortal />,
    errorElement: <RouteErrorBoundary />
  },
  { 
    path: "/quotes", 
    element: <ClientQuotes />,
    errorElement: <RouteErrorBoundary />
  },
  { 
    path: "/quote/:id", 
    element: <Quote />,
    errorElement: <RouteErrorBoundary />
  },
  { 
    path: "/about", 
    element: <About />,
    errorElement: <RouteErrorBoundary />
  },
  { 
    path: "/contact", 
    element: <Contact />,
    errorElement: <RouteErrorBoundary />
  },
  { 
    path: "/privacy", 
    element: <Privacy />,
    errorElement: <RouteErrorBoundary />
  },
  { 
    path: "/terms", 
    element: <Terms />,
    errorElement: <RouteErrorBoundary />
  },
  { 
    path: "/subscribe", 
    element: <Subscribe />,
    errorElement: <RouteErrorBoundary />
  },
];