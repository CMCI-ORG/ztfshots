import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { CategoriesTable } from "@/components/categories/CategoriesTable";

const Categories = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Categories</h1>
            </div>
            <CategoriesTable />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Categories;