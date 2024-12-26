import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { MetaUpdater } from "./components/MetaUpdater";
import NotFound from "./pages/NotFound";
import { publicRoutes } from "./routes/publicRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";
import { adminRoutes } from "./routes/adminRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Create a root layout that includes the providers and UI components
const RootLayout = () => {
  return (
    <AuthProvider>
      <TooltipProvider>
        <MetaUpdater />
        <Toaster />
        <Sonner />
        <Outlet />
      </TooltipProvider>
    </AuthProvider>
  );
};

// Create router with all routes - order matters!
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Admin routes should be first to take precedence
      ...adminRoutes,
      // Then protected routes
      ...protectedRoutes,
      // Public routes should be last
      ...publicRoutes,
      // 404 route should always be last
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;