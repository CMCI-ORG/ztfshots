import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FooterContent, FooterContentType } from "../types";
import { ContentActions } from "./ContentActions";

interface ContentCardProps {
  content: FooterContent;
  contentType?: FooterContentType;
  isFirst: boolean;
  isLast: boolean;
  onMove: (content: FooterContent, direction: 'up' | 'down') => Promise<void>;
  onEdit: (content: FooterContent) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (content: FooterContent) => Promise<void>;
}

export function ContentCard({
  content,
  contentType,
  isFirst,
  isLast,
  onMove,
  onEdit,
  onDelete,
  onToggleActive
}: ContentCardProps) {
  return (
    <Card className={`shadow-sm ${!content.is_active ? 'opacity-50' : ''}`}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-medium truncate">
              {content.title || contentType?.name}
            </h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {contentType?.name}
              </Badge>
              {!content.is_active && (
                <Badge variant="secondary" className="text-xs">
                  Inactive
                </Badge>
              )}
            </div>
          </div>
          <ContentActions
            onMoveUp={() => onMove(content, 'up')}
            onMoveDown={() => onMove(content, 'down')}
            onEdit={() => onEdit(content)}
            onDelete={() => onDelete(content.id)}
            onToggleActive={() => onToggleActive(content)}
            isFirst={isFirst}
            isLast={isLast}
            isActive={content.is_active}
          />
        </div>
      </CardContent>
    </Card>
  );
}