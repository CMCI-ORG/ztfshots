import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { AddAuthorForm } from "@/components/authors/AddAuthorForm";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const Authors = () => {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1">
            <Navbar />
            <main className="container mx-auto py-6 px-4">
              <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Add New Author</h1>
                <AddAuthorForm />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Authors;