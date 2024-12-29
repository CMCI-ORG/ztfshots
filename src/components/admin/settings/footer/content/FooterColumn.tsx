import { Card, CardContent } from "@/components/ui/card";
import { FooterContent, FooterColumn as IFooterColumn, FooterContentType } from "../types";
import { ContentCard } from "./ContentCard";
import { EmptyColumn } from "./EmptyColumn";
import { ColumnHeader } from "./ColumnHeader";

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
      <ColumnHeader position={column.position} />
      <CardContent className="pt-6 space-y-4">
        {columnContents.length === 0 ? (
          <EmptyColumn />
        ) : (
          columnContents.map((content, index) => {
            const contentType = contentTypes.find(type => type.id === content.content_type_id);
            return (
              <ContentCard
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
          })
        )}
      </CardContent>
    </Card>
  );
}