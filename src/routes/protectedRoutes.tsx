import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";
import { RouteLoadingIndicator } from "@/components/routes/RouteLoadingIndicator";
import { lazy, Suspense } from "react";

const Profile = lazy(() => import("@/pages/Profile"));
const Favorites = lazy(() => import("@/pages/Favorites"));

export const protectedRoutes: RouteObject[] = [
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<RouteLoadingIndicator />}>
          <Profile />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/favorites",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<RouteLoadingIndicator />}>
          <Favorites />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
];