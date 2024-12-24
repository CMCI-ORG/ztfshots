import { RouteObject } from "react-router-dom";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";
import { RouteLoadingIndicator } from "@/components/routes/RouteLoadingIndicator";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Quotes = lazy(() => import("@/pages/Quotes"));
const Authors = lazy(() => import("@/pages/Authors"));
const Categories = lazy(() => import("@/pages/Categories"));
const Subscribers = lazy(() => import("@/pages/Subscribers"));
const Settings = lazy(() => import("@/pages/Settings"));
const Feedback = lazy(() => import("@/pages/Feedback"));
const WhatsappTemplates = lazy(() => import("@/pages/WhatsappTemplates"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const FooterManagement = lazy(() => import("@/pages/content/FooterManagement"));
const FeedManagement = lazy(() => import("@/pages/content/FeedManagement"));

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "quotes",
        element: (
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Quotes />
          </Suspense>
        ),
      },
      {
        path: "authors",
        element: (
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Authors />
          </Suspense>
        ),
      },
      {
        path: "categories",
        element: (
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Categories />
          </Suspense>
        ),
      },
      {
        path: "subscribers",
        element: (
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Subscribers />
          </Suspense>
        ),
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Notifications />
          </Suspense>
        ),
      },
      {
        path: "content/footer",
        element: (
          <Suspense fallback={<RouteLoadingIndicator />}>
            <FooterManagement />
          </Suspense>
        ),
      },
      {
        path: "content/feed",
        element: (
          <Suspense fallback={<RouteLoadingIndicator />}>
            <FeedManagement />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "feedback",
        element: (
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Feedback />
          </Suspense>
        ),
      },
      {
        path: "whatsapp-templates",
        element: (
          <Suspense fallback={<RouteLoadingIndicator />}>
            <WhatsappTemplates />
          </Suspense>
        ),
      },
    ],
  },
];