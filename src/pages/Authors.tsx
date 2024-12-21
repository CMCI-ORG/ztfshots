import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { AddAuthorForm } from "@/components/authors/AddAuthorForm";
import { AuthorsTable } from "@/components/authors/AuthorsTable";

const Authors = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            <div className="space-y-8">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-bold mb-6">Add New Author</h1>
                <AddAuthorForm />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">Authors List</h2>
                <AuthorsTable />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Authors;