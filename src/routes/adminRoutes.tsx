import { RouteObject } from "react-router-dom";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";
import { RouteLoadingIndicator } from "@/components/routes/RouteLoadingIndicator";
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Quotes = lazy(() => import("@/pages/Quotes"));
const Authors = lazy(() => import("@/pages/Authors"));
const Categories = lazy(() => import("@/pages/Categories"));
const Subscribers = lazy(() => import("@/pages/Subscribers"));
const Settings = lazy(() => import("@/pages/Settings"));
const Feedback = lazy(() => import("@/pages/Feedback"));

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <Suspense fallback={<RouteLoadingIndicator />}>
          <Dashboard />
        </Suspense>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/admin/quotes",
    element: (
      <AdminProtectedRoute>
        <Suspense fallback={<RouteLoadingIndicator />}>
          <Quotes />
        </Suspense>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/admin/authors",
    element: (
      <AdminProtectedRoute>
        <Suspense fallback={<RouteLoadingIndicator />}>
          <Authors />
        </Suspense>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/admin/categories",
    element: (
      <AdminProtectedRoute>
        <Suspense fallback={<RouteLoadingIndicator />}>
          <Categories />
        </Suspense>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/admin/subscribers",
    element: (
      <AdminProtectedRoute>
        <Suspense fallback={<RouteLoadingIndicator />}>
          <Subscribers />
        </Suspense>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/admin/settings",
    element: (
      <AdminProtectedRoute>
        <Suspense fallback={<RouteLoadingIndicator />}>
          <Settings />
        </Suspense>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/admin/feedback",
    element: (
      <AdminProtectedRoute>
        <Suspense fallback={<RouteLoadingIndicator />}>
          <Feedback />
        </Suspense>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
];