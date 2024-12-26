import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditCategoryForm } from "../EditCategoryForm";
import { Category } from "../types";

interface CategoryEditDialogProps {
  category: Category | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CategoryEditDialog = ({
  category,
  onOpenChange,
  onSuccess,
}: CategoryEditDialogProps) => {
  return (
    <Dialog 
      open={category !== null} 
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        {category && (
          <EditCategoryForm
            category={category}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};