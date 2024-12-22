import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";

export const protectedRoutes: RouteObject[] = [
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <div>Profile Page</div>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
  {
    path: "/favorites",
    element: (
      <ProtectedRoute>
        <div>Favorites Page</div>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />
  },
];