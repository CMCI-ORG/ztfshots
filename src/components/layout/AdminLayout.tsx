import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";
import { QuoteNotifications } from "../notifications/QuoteNotifications";
import { SidebarProvider } from "@/components/ui/sidebar";
import { EmailVerification } from "../auth/EmailVerification";

export const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto bg-background w-full">
            <div className="container mx-auto p-2 sm:p-4 md:p-8 max-w-7xl">
              <EmailVerification />
              <QuoteNotifications />
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};