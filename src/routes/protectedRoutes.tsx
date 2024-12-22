import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const protectedRoutes: RouteObject[] = [
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <div>Profile Page</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/favorites",
    element: (
      <ProtectedRoute>
        <div>Favorites Page</div>
      </ProtectedRoute>
    ),
  },
];