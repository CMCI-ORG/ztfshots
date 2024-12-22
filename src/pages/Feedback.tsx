import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";

const Feedback = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">User Feedback</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">Feedback functionality coming soon...</p>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Feedback;