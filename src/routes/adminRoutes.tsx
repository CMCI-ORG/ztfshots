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
const UserManagement = lazy(() => import("@/pages/UserManagement"));
const Settings = lazy(() => import("@/pages/Settings"));
const WhatsappTemplates = lazy(() => import("@/pages/WhatsappTemplates"));

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
        path: "users",
        element: (
          <Suspense fallback={<RouteLoadingIndicator />}>
            <UserManagement />
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