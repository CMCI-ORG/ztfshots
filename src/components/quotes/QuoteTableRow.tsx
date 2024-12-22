import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuoteTableRowProps {
  quote: any;
  onEdit: (quote: any) => void;
  onDelete: (quote: { id: string; text: string }) => void;
}

export function QuoteTableRow({ quote, onEdit, onDelete }: QuoteTableRowProps) {
  return (
    <TableRow>
      <TableCell className="max-w-md truncate">{quote.text}</TableCell>
      <TableCell>{quote.authors?.name}</TableCell>
      <TableCell>{quote.categories?.name}</TableCell>
      <TableCell>
        {quote.source_title && (
          <div className="flex items-center gap-2">
            <span>{quote.source_title}</span>
            {quote.source_url && (
              <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                <a href={quote.source_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>
        <Badge 
          variant={quote.status === 'live' ? 'default' : 'secondary'}
          className="capitalize"
        >
          {quote.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => onEdit(quote)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete({ id: quote.id, text: quote.text })}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}