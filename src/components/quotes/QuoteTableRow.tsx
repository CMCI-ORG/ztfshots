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
  quote: {
    id: string;
    text: string;
    title?: string;
    author_id: string;
    category_id: string;
    source_title?: string;
    source_url?: string;
    post_date: string;
    status: string;
    authors?: { name: string };
    categories?: { name: string };
  };
  onEdit: (quote: any) => void;
  onDelete: (quote: { id: string; text: string }) => void;
}

export function QuoteTableRow({ quote, onEdit, onDelete }: QuoteTableRowProps) {
  return (
    <TableRow className="group hover:bg-muted/50">
      <TableCell className="align-top py-4">
        <div className="max-w-xl space-y-1">
          {quote.title && (
            <div className="font-semibold text-primary">{quote.title}</div>
          )}
          <div className="text-sm text-muted-foreground line-clamp-2">
            {quote.text}
          </div>
        </div>
      </TableCell>
      <TableCell className="align-top py-4">
        <span className="font-medium text-sm">
          {quote.authors?.name}
        </span>
      </TableCell>
      <TableCell className="align-top py-4">
        <span className="text-sm text-muted-foreground">
          {quote.categories?.name}
        </span>
      </TableCell>
      <TableCell className="align-top py-4">
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
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <a
                  href={quote.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="align-top py-4">
        <Badge
          variant={quote.status === "live" ? "default" : "secondary"}
          className="capitalize"
        >
          {quote.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right align-top py-4">
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
            <DropdownMenuItem onClick={() => onEdit({
              id: quote.id,
              text: quote.text,
              title: quote.title,
              author_id: quote.author_id,
              category_id: quote.category_id,
              source_title: quote.source_title,
              source_url: quote.source_url,
              post_date: quote.post_date,
              status: quote.status,
            })}>
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