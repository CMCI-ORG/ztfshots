import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoginHeader } from "@/components/auth/login/LoginHeader";
import { LoginForm } from "@/components/auth/login/LoginForm";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";

const Login = () => {
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";
  
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

  // Handle authentication and redirects
  useAuthRedirect(from);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <LoginHeader 
            logoUrl={siteSettings?.logo_url}
            siteName={siteSettings?.site_name}
          />
          <LoginForm />
        </div>
      </div>

      {/* Right side - Cover Image */}
      <div className="hidden md:block md:w-1/2 relative bg-gradient-to-br from-purple-600 to-indigo-600 overflow-hidden">
        <div 
          className="absolute inset-0 transform -skew-x-12 translate-x-1/4"
          style={{
            backgroundImage: `url(${siteSettings?.cover_image_url || '/placeholder.svg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-indigo-600/80 transform -skew-x-12 translate-x-1/4" />
      </div>
    </div>
  );
};

export default Login;