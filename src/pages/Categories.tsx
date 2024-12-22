import { AdminLayout } from "@/components/layout/AdminLayout";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
import { AddCategoryForm } from "@/components/categories/AddCategoryForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Categories = () => {
  const [open, setOpen] = useState(false);

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Categories</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <AddCategoryForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <CategoriesTable />
      </div>
    </main>
  );
};

export default Categories;