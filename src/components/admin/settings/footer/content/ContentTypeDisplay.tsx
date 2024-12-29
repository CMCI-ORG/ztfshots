import { Badge } from "@/components/ui/badge";
import { FooterContent, FooterContentType } from "../types";

interface ContentTypeDisplayProps {
  content: FooterContent;
  contentType?: FooterContentType;
}

export function ContentTypeDisplay({ content, contentType }: ContentTypeDisplayProps) {
  return (
    <div>
      <span className="font-medium">
        {content.title || contentType?.name}
      </span>
      <Badge variant="outline" className="ml-2">
        {contentType?.name}
      </Badge>
    </div>
  );
}