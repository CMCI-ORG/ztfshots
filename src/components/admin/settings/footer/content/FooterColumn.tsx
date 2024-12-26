/**
 * Renders a column of footer content with its content cards
 */
import { Card, CardContent } from "@/components/ui/card";
import { FooterContent, FooterColumn as IFooterColumn, FooterContentType } from "../types";
import { FooterContentCard } from "./FooterContentCard";

interface FooterColumnProps {
  column: IFooterColumn;
  contents: FooterContent[];
  contentTypes: FooterContentType[];
  onMove: (content: FooterContent, direction: 'up' | 'down') => Promise<void>;
  onEdit: (content: FooterContent) => void;
  onDelete: (id: string) => Promise<void>;
}

export function FooterColumn({
  column,
  contents,
  contentTypes,
  onMove,
  onEdit,
  onDelete
}: FooterColumnProps) {
  const columnContents = contents
    .filter(content => content.column_id === column.id)
    .sort((a, b) => a.order_position - b.order_position);

  return (
    <Card className="relative">
      <div className="absolute -top-3 left-4 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
        Column {column.position}
      </div>
      <CardContent className="pt-6 space-y-4">
        {columnContents.length === 0 && (
          <div className="p-3 text-sm text-muted-foreground text-center bg-muted/50 rounded-md">
            No content in this column
          </div>
        )}
        {columnContents.map((content, index) => {
          const contentType = contentTypes.find(type => type.id === content.content_type_id);
          return (
            <FooterContentCard
              key={content.id}
              content={content}
              contentType={contentType}
              isFirst={index === 0}
              isLast={index === columnContents.length - 1}
              onMove={onMove}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}