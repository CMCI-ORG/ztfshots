import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/routes/RouteErrorBoundary";
import { RouteLoadingIndicator } from "@/components/routes/RouteLoadingIndicator";

const Login = lazy(() => import("@/pages/Login"));
const DeleteAccount = lazy(() => import("@/pages/DeleteAccount"));

export const authRoutes: RouteObject[] = [
  { 
    path: "/login", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <Login />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Login - Daily Dose from Z.T. Fomum",
        description: "Sign in to access your account and manage your favorite quotes",
      }
    }
  },
  { 
    path: "/delete-account", 
    element: (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <DeleteAccount />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    handle: {
      meta: {
        title: "Delete Account - Daily Dose from Z.T. Fomum",
        description: "Request to delete your account and associated data",
      }
    }
  },
];