import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";
import { QuoteNotifications } from "../notifications/QuoteNotifications";

export const AdminLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-8">
          <QuoteNotifications />
          <Outlet />
        </main>
      </div>
    </div>
  );
};