import { RouteObject } from "react-router-dom";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
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
        <AdminLayout>
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Dashboard />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/admin/quotes",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Quotes />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/admin/authors",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Authors />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/admin/categories",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Categories />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/admin/subscribers",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Subscribers />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/admin/settings",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Settings />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/admin/feedback",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={<RouteLoadingIndicator />}>
            <Feedback />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
];