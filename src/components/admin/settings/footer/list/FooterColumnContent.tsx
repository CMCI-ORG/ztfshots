import { Card, CardContent } from "@/components/ui/card";
import { FooterContent, FooterContentType } from "../types";
import { ContentCard } from "./ContentCard";

interface FooterColumnContentProps {
  columnId: string;
  columnPosition: number;
  contents: FooterContent[];
  contentTypes: FooterContentType[];
  onEdit: (content: FooterContent) => void;
  onMove: (content: FooterContent, direction: 'up' | 'down') => void;
  onDelete: (id: string) => void;
}

export function FooterColumnContent({
  columnId,
  columnPosition,
  contents,
  contentTypes,
  onEdit,
  onMove,
  onDelete
}: FooterColumnContentProps) {
  const columnContents = contents
    .filter(content => content.column_id === columnId)
    .sort((a, b) => a.order_position - b.order_position);

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground">
        Column {columnPosition}
      </h3>
      {columnContents.length === 0 && (
        <Card className="shadow-sm bg-muted/50">
          <CardContent className="p-3 text-sm text-muted-foreground text-center">
            No content in this column
          </CardContent>
        </Card>
      )}
      {columnContents.map((content, index) => (
        <ContentCard
          key={content.id}
          content={content}
          contentType={contentTypes.find(type => type.id === content.content_type_id)}
          index={index}
          totalItems={columnContents.length}
          onEdit={onEdit}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}