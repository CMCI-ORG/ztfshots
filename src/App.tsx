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
import Feedback from "./pages/Feedback";

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
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/client-portal" element={<ClientPortal />} />
              <Route path="/client-portal/quotes" element={<ClientQuotes />} />
              
              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/quotes"
                element={
                  <ProtectedRoute>
                    <Quotes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/quotes/new"
                element={
                  <ProtectedRoute>
                    <Quotes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/quotes/featured"
                element={
                  <ProtectedRoute>
                    <Quotes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/feedback"
                element={
                  <ProtectedRoute>
                    <Feedback />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/authors"
                element={
                  <ProtectedRoute>
                    <Authors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/subscribers"
                element={
                  <ProtectedRoute>
                    <Subscribers />
                  </ProtectedRoute>
                }
              />
              
              {/* Protected User Routes */}
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
              
              {/* Quote Detail Route */}
              <Route path="/quote/:id" element={<Quote />} />
              
              {/* Default Route */}
              <Route path="/" element={<Navigate to="/client-portal" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;