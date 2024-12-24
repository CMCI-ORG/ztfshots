import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Menu, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { QuoteNotifications } from "@/components/notifications/QuoteNotifications";
import { useAuth } from "@/providers/AuthProvider";

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
            {siteSettings?.logo_url ? (
              <Link to="/" className="flex-shrink-0">
                <img 
                  src={siteSettings.logo_url} 
                  alt={siteSettings?.site_name || "Site Logo"} 
                  className="h-8 sm:h-12 w-auto"
                />
              </Link>
            ) : (
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#8B5CF6] font-['Open_Sans']">
                  {siteSettings?.site_name || "#ZTFBooks"}
                </h1>
              </Link>
            )}
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList className="space-x-2">
                  <NavigationMenuItem>
                    <Link to="/" className={navigationMenuTriggerStyle()}>
                      Home
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/quotes" className={navigationMenuTriggerStyle()}>
                      Explore Quotes
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/about" className={navigationMenuTriggerStyle()}>
                      About
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/contact" className={navigationMenuTriggerStyle()}>
                      Contact
                    </Link>
                  </NavigationMenuItem>
                  {isAdmin && (
                    <NavigationMenuItem>
                      <Link 
                        to="/admin" 
                        className={navigationMenuTriggerStyle() + " flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"}
                      >
                        <Settings className="h-4 w-4" />
                        Admin Portal
                      </Link>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Notification Bell and Quote Notifications */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
              </Button>
              <QuoteNotifications />
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80vw] sm:w-[280px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link 
                      to="/" 
                      className="text-base sm:text-lg font-semibold hover:text-[#8B5CF6] transition-colors"
                    >
                      Home
                    </Link>
                    <Link 
                      to="/quotes" 
                      className="text-base sm:text-lg font-semibold hover:text-[#8B5CF6] transition-colors"
                    >
                      Explore Quotes
                    </Link>
                    <Link 
                      to="/about" 
                      className="text-base sm:text-lg font-semibold hover:text-[#8B5CF6] transition-colors"
                    >
                      About
                    </Link>
                    <Link 
                      to="/contact" 
                      className="text-base sm:text-lg font-semibold hover:text-[#8B5CF6] transition-colors"
                    >
                      Contact
                    </Link>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="text-base sm:text-lg font-semibold flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Admin Portal
                      </Link>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        <p className="text-xs sm:text-sm md:text-base font-['Roboto'] mt-1 sm:mt-2 line-clamp-2">
          {siteSettings?.tag_line}
        </p>
      </div>
    </header>
  );
};