import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
import { AddCategoryForm } from "@/components/categories/AddCategoryForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Categories = () => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <ErrorBoundary>
            <main className="container mx-auto py-6 px-4">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Categories</h1>
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Category
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Add New Category</SheetTitle>
                      <SheetDescription>
                        Create a new category for organizing quotes.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <AddCategoryForm onSuccess={handleSuccess} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <CategoriesTable />
            </main>
          </ErrorBoundary>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Categories;