import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { QuoteContent } from "./table/QuoteContent";
import { QuoteSource } from "./table/QuoteSource";
import { QuoteActions } from "./table/QuoteActions";

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
    translations?: Record<string, { text: string; title?: string }>;
  };
  onEdit: (quote: any) => void;
  onDelete: (quote: { id: string; text: string }) => void;
}

export function QuoteTableRow({ quote, onEdit, onDelete }: QuoteTableRowProps) {
  return (
    <TableRow className="group hover:bg-muted/50">
      <TableCell className="align-top py-4">
        <QuoteContent 
          title={quote.title}
          text={quote.text}
          translations={quote.translations}
        />
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
        <QuoteSource 
          sourceTitle={quote.source_title}
          sourceUrl={quote.source_url}
        />
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
        <QuoteActions 
          onEdit={() => onEdit(quote)}
          onDelete={() => onDelete({ id: quote.id, text: quote.text })}
        />
      </TableCell>
    </TableRow>
  );
}