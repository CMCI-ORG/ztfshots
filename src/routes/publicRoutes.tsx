import { RouteObject } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import EmailVerificationSuccess from "@/pages/EmailVerificationSuccess";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import ClientPortal from "@/pages/ClientPortal";
import ClientQuotes from "@/pages/ClientQuotes";
import Quote from "@/pages/Quote";
import CategoryDetail from "@/pages/CategoryDetail";
import AuthorDetail from "@/pages/AuthorDetail";
import DynamicPage from "@/pages/DynamicPage";
import HighlyRatedQuotes from "@/pages/HighlyRatedQuotes";
import FeaturedQuotes from "@/pages/FeaturedQuotes";
import RecentQuotes from "@/pages/RecentQuotes";
import Subscribe from "@/pages/Subscribe";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ClientPortal />,
  },
  {
    path: "/quotes",
    element: <ClientQuotes />,
  },
  {
    path: "/quotes/highly-rated",
    element: <HighlyRatedQuotes />,
  },
  {
    path: "/quotes/featured",
    element: <FeaturedQuotes />,
  },
  {
    path: "/quotes/recent",
    element: <RecentQuotes />,
  },
  {
    path: "/quote/:id",
    element: <Quote />,
  },
  {
    path: "/categories/:id",
    element: <CategoryDetail />,
  },
  {
    path: "/authors/:id",
    element: <AuthorDetail />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:slug",
    element: <BlogPost />,
  },
  {
    path: "/subscribe",
    element: <Subscribe />,
  },
  {
    path: "/login",
    element: (
      <MainLayout>
        <Login />
      </MainLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <MainLayout>
        <Register />
      </MainLayout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <MainLayout>
        <ForgotPassword />
      </MainLayout>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <MainLayout>
        <ResetPassword />
      </MainLayout>
    ),
  },
  {
    path: "/verify-email",
    element: (
      <MainLayout>
        <EmailVerificationSuccess />
      </MainLayout>
    ),
  },
  {
    path: "/:pageKey",
    element: <DynamicPage />,
  },
];