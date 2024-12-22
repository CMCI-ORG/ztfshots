import { RouteObject } from "react-router-dom";
import { Navigate, Routes, Route } from "react-router-dom";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Dashboard from "@/pages/Dashboard";
import Quotes from "@/pages/Quotes";
import Authors from "@/pages/Authors";
import Categories from "@/pages/Categories";
import Subscribers from "@/pages/Subscribers";
import Settings from "@/pages/Settings";
import Feedback from "@/pages/Feedback";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <Navigate to="/admin/dashboard" replace />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/*",
    element: (
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
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
];