import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash, Pencil, Power } from "lucide-react";

interface ContentActionsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
}

export function ContentActions({ 
  onMoveUp, 
  onMoveDown, 
  onEdit,
  onDelete, 
  onToggleActive,
  isFirst, 
  isLast,
  isActive 
}: ContentActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onMoveUp}
        disabled={isFirst}
        data-testid="move-up"
        title="Move up"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onMoveDown}
        disabled={isLast}
        data-testid="move-down"
        title="Move down"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onEdit}
        data-testid="edit-content"
        title="Edit content"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onToggleActive}
        data-testid="toggle-active"
        title={isActive ? "Deactivate content" : "Activate content"}
      >
        <Power className={`h-4 w-4 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onDelete}
        data-testid="delete-content"
        title="Delete content"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}