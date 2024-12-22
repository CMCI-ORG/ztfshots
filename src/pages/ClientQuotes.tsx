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

const ClientQuotes = () => {
  return (
    <div className="min-h-screen bg-[#FEF7CD] bg-opacity-20">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <FilterSidebar />
          <div className="flex-1">
            <PageHeader 
              title="#ZTFBooks Quotes"
              subtitle="Browse and filter our collection of inspirational quotes"
            />
            <div className="container mx-auto px-4 py-4">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/client-portal" className={navigationMenuTriggerStyle()}>
                      Home
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/client-portal/quotes" className={navigationMenuTriggerStyle()}>
                      Quotes
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
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