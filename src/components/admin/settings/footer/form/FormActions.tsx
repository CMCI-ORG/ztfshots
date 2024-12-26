import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
  mode: "create" | "edit";
}

export const FormActions = ({ isSubmitting, onCancel, mode }: FormActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === "edit" ? "Updating..." : "Creating..."}
          </>
        ) : (
          mode === "edit" ? "Update Content" : "Create Content"
        )}
      </Button>
    </div>
  );
};