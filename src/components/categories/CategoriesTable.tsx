import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CategoryTableRow } from "./table/CategoryTableRow";
import { CategoryDeleteDialog } from "./dialogs/CategoryDeleteDialog";
import { CategoryEditDialog } from "./dialogs/CategoryEditDialog";
import { useCategoriesData } from "./hooks/useCategoriesData";
import { Category } from "./types";
import { Json } from "@/integrations/supabase/types";

export function CategoriesTable() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  const { categories, fetchError, deleteCategory } = useCategoriesData();

  const handleDeleteSuccess = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id);
      } catch (error) {
        console.error("Error in handleDeleteSuccess:", error);
      }
      setCategoryToDelete(null);
    }
  };

  const handleEditSuccess = () => {
    setEditingCategory(null);
  };

  if (fetchError) {
    throw fetchError;
  }

  const transformedCategories = categories?.map((category): Category => ({
    id: category.id,
    name: category.name,
    description: category.description || "",
    quote_count: category.quote_count,
    translations: category.translations as Record<string, any> | null,
    primary_language: category.primary_language
  }));

  return (
    <ErrorBoundary>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Quotes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transformedCategories?.map((category) => (
              <CategoryTableRow
                key={category.id}
                category={category}
                onEdit={setEditingCategory}
                onDelete={setCategoryToDelete}
              />
            ))}
          </TableBody>
        </Table>

        <CategoryDeleteDialog
          category={categoryToDelete}
          onOpenChange={(open) => !open && setCategoryToDelete(null)}
          onConfirm={handleDeleteSuccess}
        />

        <CategoryEditDialog
          category={editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
          onSuccess={handleEditSuccess}
        />
      </div>
    </ErrorBoundary>
  );
}