import { SidebarProvider } from "@/components/ui/sidebar";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { FilterSidebar } from "@/components/client-portal/quotes/FilterSidebar";
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
            <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
              <div className="container mx-auto py-6 px-4">
                <div className="flex flex-col gap-4">
                  <h1 className="text-3xl font-bold text-[#8B5CF6] font-['Open_Sans']">
                    #ZTFBooks Quotes
                  </h1>
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
                  <p className="text-muted-foreground mt-2 font-['Roboto']">
                    Browse and filter our collection of inspirational quotes
                  </p>
                </div>
              </div>
            </header>
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