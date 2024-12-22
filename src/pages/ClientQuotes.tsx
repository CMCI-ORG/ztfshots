import { SidebarProvider } from "@/components/ui/sidebar";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { FilterSidebar } from "@/components/client-portal/quotes/FilterSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ClientQuotes = () => {
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

  return (
    <div className="min-h-screen bg-[#FEF7CD] bg-opacity-20">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <FilterSidebar />
          <div className="flex-1">
            <div className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
              <div className="container mx-auto py-4 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-8">
                    {siteSettings?.logo_url ? (
                      <Link to="/client-portal">
                        <img 
                          src={siteSettings.logo_url} 
                          alt={siteSettings?.site_name || "Site Logo"} 
                          className="h-12 w-auto"
                        />
                      </Link>
                    ) : (
                      <Link to="/client-portal">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#8B5CF6] font-['Open_Sans']">
                          {siteSettings?.site_name}
                        </h1>
                      </Link>
                    )}
                    
                    {/* Navigation Menu */}
                    <NavigationMenu>
                      <NavigationMenuList className="space-x-2">
                        <NavigationMenuItem>
                          <Link 
                            to="/client-portal" 
                            className={navigationMenuTriggerStyle()}
                          >
                            Home
                          </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <Link 
                            to="/client-portal/quotes" 
                            className={navigationMenuTriggerStyle()}
                          >
                            Quotes
                          </Link>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm md:text-base font-['Roboto'] mt-2">
                  {siteSettings?.tag_line}
                </p>
              </div>
            </div>
            <main className="flex-1 p-4 md:p-6">
              <div className="max-w-7xl mx-auto">
                <QuotesGrid />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ClientQuotes;