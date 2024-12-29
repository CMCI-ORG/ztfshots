import { Badge } from "@/components/ui/badge";

interface ColumnHeaderProps {
  position: number;
  contentCount: number;
}

export function ColumnHeader({ position, contentCount }: ColumnHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        Column {position}
        <Badge variant="secondary">
          {contentCount} items
        </Badge>
      </h3>
    </div>
  );
}