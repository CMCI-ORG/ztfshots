import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FooterContent, FooterContentType } from "../types";
import { ArrowUp, ArrowDown, Trash, Pencil } from "lucide-react";

interface ContentCardProps {
  content: FooterContent;
  contentType: FooterContentType | undefined;
  index: number;
  totalItems: number;
  onEdit: (content: FooterContent) => void;
  onMove: (content: FooterContent, direction: 'up' | 'down') => void;
  onDelete: (id: string) => void;
}

export function ContentCard({
  content,
  contentType,
  index,
  totalItems,
  onEdit,
  onMove,
  onDelete
}: ContentCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-medium truncate">
              {content.title || contentType?.name}
            </h4>
            <p className="text-xs text-muted-foreground">
              {contentType?.name}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onMove(content, 'up')}
              disabled={index === 0}
              title="Move up"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onMove(content, 'down')}
              disabled={index === totalItems - 1}
              title="Move down"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(content)}
              title="Edit content"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(content.id)}
              title="Delete content"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}