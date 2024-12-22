import { RouteObject } from "react-router-dom";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";
import Dashboard from "@/pages/Dashboard";
import Quotes from "@/pages/Quotes";
import Authors from "@/pages/Authors";
import Categories from "@/pages/Categories";
import Subscribers from "@/pages/Subscribers";
import Settings from "@/pages/Settings";
import Feedback from "@/pages/Feedback";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Dashboard />
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
          <Quotes />
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
          <Authors />
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
          <Categories />
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
          <Subscribers />
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
          <Settings />
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
          <Feedback />
        </AdminLayout>
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
];