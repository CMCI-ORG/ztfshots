import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Quotes from "./pages/Quotes";
import Quote from "./pages/Quote";
import Login from "./pages/Login";
import Authors from "./pages/Authors";
import Categories from "./pages/Categories";
import ClientPortal from "./pages/ClientPortal";
import ClientQuotes from "./pages/ClientQuotes";
import Subscribers from "./pages/Subscribers";
import Settings from "./pages/Settings";

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
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Index />} />
              <Route path="/admin/quotes" element={<Quotes />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/quote/:id" element={<Quote />} />
              <Route path="/admin/authors" element={<Authors />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/subscribers" element={<Subscribers />} />
              <Route path="/client-portal" element={<ClientPortal />} />
              <Route path="/client-portal/quotes" element={<ClientQuotes />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <div>Profile Page</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <div>Favorites Page</div>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/client-portal" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;