import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { MetaUpdater } from "./components/MetaUpdater";
import { AdminLayout } from "./components/layout/AdminLayout";
import Login from "./pages/Login";
import ClientPortal from "./pages/ClientPortal";
import ClientQuotes from "./pages/ClientQuotes";
import Quote from "./pages/Quote";
import Settings from "./pages/Settings";
import Authors from "./pages/Authors";
import Categories from "./pages/Categories";
import Quotes from "./pages/Quotes";
import Subscribers from "./pages/Subscribers";
import Feedback from "./pages/Feedback";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Subscribe from "./pages/Subscribe";
import NotFound from "./pages/NotFound";

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
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ClientPortal />} />
              <Route path="/quotes" element={<ClientQuotes />} />
              <Route path="/quote/:id" element={<Quote />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/subscribe" element={<Subscribe />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminProtectedRoute><Navigate to="/admin/dashboard" replace /></AdminProtectedRoute>} />
              <Route
                path="/admin/*"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="quotes" element={<Quotes />} />
                        <Route path="authors" element={<Authors />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="subscribers" element={<Subscribers />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="feedback" element={<Feedback />} />
                        {/* Catch all route for admin - redirect to dashboard */}
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                      </Routes>
                    </AdminLayout>
                  </AdminProtectedRoute>
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