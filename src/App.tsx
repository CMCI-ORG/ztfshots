import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
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

const MetaUpdater = () => {
  const { data: siteSettings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching site settings:", error);
        return null;
      }
      return data;
    },
  });

  useEffect(() => {
    if (siteSettings) {
      // Update meta tags
      document.title = siteSettings.site_name;
      
      // Update standard meta tags
      const descriptionTag = document.querySelector('meta[name="description"]');
      if (descriptionTag) {
        descriptionTag.setAttribute('content', siteSettings.description || '');
      }

      // Update Open Graph meta tags
      const ogTitleTag = document.querySelector('meta[property="og:title"]');
      const ogDescTag = document.querySelector('meta[property="og:description"]');
      const ogImageTag = document.querySelector('meta[property="og:image"]');

      if (ogTitleTag) {
        ogTitleTag.setAttribute('content', siteSettings.site_name);
      }
      if (ogDescTag) {
        ogDescTag.setAttribute('content', siteSettings.description || '');
      }
      if (ogImageTag && siteSettings.cover_image_url) {
        ogImageTag.setAttribute('content', siteSettings.cover_image_url);
      }

      // Update Twitter Card meta tags
      const twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
      const twitterDescTag = document.querySelector('meta[name="twitter:description"]');
      const twitterImageTag = document.querySelector('meta[name="twitter:image"]');

      if (twitterTitleTag) {
        twitterTitleTag.setAttribute('content', siteSettings.site_name);
      }
      if (twitterDescTag) {
        twitterDescTag.setAttribute('content', siteSettings.description || '');
      }
      if (twitterImageTag && siteSettings.cover_image_url) {
        twitterImageTag.setAttribute('content', siteSettings.cover_image_url);
      }
    }
  }, [siteSettings]);

  return null;
};

const FaviconUpdater = () => {
  const { data: siteSettings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching site settings:", error);
        return null;
      }
      return data;
    },
  });

  useEffect(() => {
    if (siteSettings?.icon_url) {
      const existingLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      const link = (existingLink || document.createElement('link')) as HTMLLinkElement;
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = siteSettings.icon_url;
      if (!existingLink) {
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    }
  }, [siteSettings?.icon_url]);

  return null;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <MetaUpdater />
          <FaviconUpdater />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/client-portal" element={<ClientPortal />} />
              <Route path="/client-portal/quotes" element={<ClientQuotes />} />
              <Route path="/quote/:id" element={<Quote />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/quotes" element={<Quotes />} />
              <Route path="/admin/authors" element={<Authors />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/subscribers" element={<Subscribers />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/feedback" element={<Feedback />} />
              
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