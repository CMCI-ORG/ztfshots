import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { SubscribersTable } from "@/components/subscribers/SubscribersTable";

const Subscribers = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6 text-[#8B5CF6]">Subscribers</h1>
            <SubscribersTable />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Subscribers;