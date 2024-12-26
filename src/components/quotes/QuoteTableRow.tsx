import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuoteTableRowProps {
  quote: any;
  onEdit: (quote: any) => void;
  onDelete: (quote: { id: string; text: string }) => void;
}

export function QuoteTableRow({ quote, onEdit, onDelete }: QuoteTableRowProps) {
  return (
    <TableRow className="group">
      <TableCell className="font-medium">
        <div className="max-w-xl">
          {quote.title && (
            <div className="font-semibold text-primary mb-1">{quote.title}</div>
          )}
          <div className="line-clamp-2">{quote.text}</div>
        </div>
      </TableCell>
      <TableCell>
        <span className="font-medium text-muted-foreground">
          {quote.authors?.name}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-muted-foreground">{quote.categories?.name}</span>
      </TableCell>
      <TableCell>
        {quote.source_title && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground truncate max-w-[150px]">
              {quote.source_title}
            </span>
            {quote.source_url && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <a
                  href={quote.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>
        <Badge
          variant={quote.status === "live" ? "default" : "secondary"}
          className="capitalize"
        >
          {quote.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(quote)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete({ id: quote.id, text: quote.text })}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}