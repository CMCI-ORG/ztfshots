import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAuthRedirect = (from: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        try {
          // Check user role
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (error) throw error;

          // Redirect based on role
          if (profile?.role === "admin" || profile?.role === "superadmin") {
            // If coming from admin route, go there, otherwise go to admin dashboard
            navigate(from.startsWith("/admin") ? from : "/admin");
          } else if (profile?.role === "author") {
            navigate("/author-dashboard");
          } else {
            // Regular users (subscribers) go to profile or original location
            navigate(from);
          }

          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
        } catch (error) {
          console.error("Error checking user role:", error);
          toast({
            title: "Error",
            description: "There was a problem logging you in. Please try again.",
            variant: "destructive",
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, from, toast]);
};