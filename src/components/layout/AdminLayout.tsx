import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <div className="container mx-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};