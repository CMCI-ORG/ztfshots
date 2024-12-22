import { AdminLayout } from "@/components/layout/AdminLayout";
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
    <AdminLayout>
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
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
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default Categories;