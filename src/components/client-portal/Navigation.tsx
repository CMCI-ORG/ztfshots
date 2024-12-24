import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteNotifications } from "@/components/notifications/QuoteNotifications";
import { useAuth } from "@/providers/AuthProvider";
import { Logo } from "./navigation/Logo";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileNav } from "./navigation/MobileNav";
import { UserMenu } from "@/components/layout/UserMenu";

export const Navigation = () => {
  const { user } = useAuth();
  
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

  const { data: profile } = useQuery({
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

  const isAdmin = profile?.role === "admin" || profile?.role === "superadmin";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto py-2 sm:py-4 px-2 sm:px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Logo logoUrl={siteSettings?.logo_url} siteName={siteSettings?.site_name} />
            <DesktopNav isAdmin={isAdmin} />
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>
            <QuoteNotifications />
            <UserMenu />
            <MobileNav isAdmin={isAdmin} />
          </div>
        </div>
        <p className="text-xs sm:text-sm md:text-base font-['Roboto'] mt-1 sm:mt-2 line-clamp-2">
          {siteSettings?.tag_line}
        </p>
      </div>
    </header>
  );
};