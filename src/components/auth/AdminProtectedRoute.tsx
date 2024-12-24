import { useAuth } from "@/providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const isDevelopmentPreview = import.meta.env.DEV && import.meta.env.VITE_PREVIEW_ADMIN === "true";

export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Skip authentication in development preview mode
  if (isDevelopmentPreview) {
    console.log("⚠️ Admin preview mode enabled - bypassing authentication");
    return <>{children}</>;
  }

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch user profile. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  if (!profile || (profile.role !== "admin" && profile.role !== "superadmin")) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this area.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};