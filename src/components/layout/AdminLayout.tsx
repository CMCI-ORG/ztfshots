import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";
import { QuoteNotifications } from "../notifications/QuoteNotifications";
import { SidebarProvider } from "@/components/ui/sidebar";

export const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="container mx-auto p-4 md:p-8 max-w-7xl">
              <QuoteNotifications />
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};