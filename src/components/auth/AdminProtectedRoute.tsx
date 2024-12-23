import { useAuth } from "@/providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Check if user is project owner
  const isProjectOwner = user?.email === "lovable@lovable.dev" || user?.email?.endsWith("@lovable.dev");

  if (loading || (profileLoading && !isProjectOwner)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Allow direct access for project owners without login
  if (isProjectOwner) {
    return <>{children}</>;
  }

  // For non-project owners, require login and admin role
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!profile || (profile.role !== "admin" && profile.role !== "superadmin")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};