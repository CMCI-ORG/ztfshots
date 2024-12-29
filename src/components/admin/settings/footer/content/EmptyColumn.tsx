import { Card, CardContent } from "@/components/ui/card";

export function EmptyColumn() {
  return (
    <div className="p-3 text-sm text-muted-foreground text-center bg-muted/50 rounded-md">
      No content in this column
    </div>
  );
}