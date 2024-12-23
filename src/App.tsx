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

// Create router with all routes
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      ...publicRoutes,
      ...protectedRoutes,
      ...adminRoutes,
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