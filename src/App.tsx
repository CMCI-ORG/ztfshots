import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <MetaUpdater />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              {publicRoutes.map((route) => (
                <Route key={route.path} {...route} />
              ))}
              
              {/* Protected Routes */}
              {protectedRoutes.map((route) => (
                <Route key={route.path} {...route} />
              ))}
              
              {/* Admin Routes */}
              {adminRoutes.map((route) => (
                <Route key={route.path} {...route} />
              ))}

              {/* 404 Page - Must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;