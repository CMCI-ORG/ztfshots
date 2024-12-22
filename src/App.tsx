import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

// Create router with all routes
const router = createBrowserRouter([
  ...publicRoutes,
  ...protectedRoutes,
  ...adminRoutes,
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
        <AuthProvider>
          <TooltipProvider>
            <MetaUpdater />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </RouterProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;