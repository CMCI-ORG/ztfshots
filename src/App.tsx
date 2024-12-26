import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { queryClient } from '@/lib/queryConfig';
import * as LazyRoutes from '@/routes/lazyRoutes';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/quotes" element={<LazyRoutes.ClientQuotes />} />
          <Route path="/authors" element={<LazyRoutes.Authors />} />
          <Route path="/categories" element={<LazyRoutes.Categories />} />
          <Route path="/author/:id" element={<LazyRoutes.AuthorDetail />} />
          <Route path="/category/:id" element={<LazyRoutes.CategoryDetail />} />
          <Route path="/quote/:id" element={<LazyRoutes.Quote />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<LazyRoutes.Dashboard />} />
          <Route path="/admin/quotes" element={<LazyRoutes.Quotes />} />
          <Route path="/admin/settings" element={<LazyRoutes.Settings />} />
          <Route path="/admin/subscribers" element={<LazyRoutes.Subscribers />} />
          <Route path="/admin/whatsapp" element={<LazyRoutes.WhatsappTemplates />} />
          
          {/* Content Management Routes */}
          <Route path="/admin/content/footer" element={<LazyRoutes.FooterManagement />} />
          <Route path="/admin/content/feed" element={<LazyRoutes.FeedManagement />} />
          <Route path="/admin/content/pages" element={<LazyRoutes.PagesManagement />} />
        </Routes>
      </Suspense>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
