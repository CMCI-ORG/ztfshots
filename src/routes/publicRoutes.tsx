import { RouteObject } from "react-router-dom";
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
  { path: "/login", element: <Login /> },
  { path: "/", element: <ClientPortal /> },
  { path: "/quotes", element: <ClientQuotes /> },
  { path: "/quote/:id", element: <Quote /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/terms", element: <Terms /> },
  { path: "/subscribe", element: <Subscribe /> },
];