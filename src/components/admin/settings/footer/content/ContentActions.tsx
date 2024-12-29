import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash } from "lucide-react";

interface ContentActionsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ContentActions({ onMoveUp, onMoveDown, onDelete, isFirst, isLast }: ContentActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onMoveUp}
        disabled={isFirst}
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
        title="Move down"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onDelete}
        title="Delete content"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}