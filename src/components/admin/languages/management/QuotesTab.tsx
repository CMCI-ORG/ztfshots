import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuotesTabProps {
  onManageTranslations: (id: string) => void;
}

export function QuotesTab({ onManageTranslations }: QuotesTabProps) {
  const { data: quotes = [] } = useQuery({
    queryKey: ["quotes-translations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          id,
          text,
          title,
          translations,
          primary_language,
          authors (
            name
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title/Text</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Primary Language</TableHead>
            <TableHead>Translations</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow key={quote.id}>
              <TableCell>
                <div className="space-y-1">
                  {quote.title && (
                    <div className="font-medium">{quote.title}</div>
                  )}
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {quote.text}
                  </div>
                </div>
              </TableCell>
              <TableCell>{quote.authors?.name}</TableCell>
              <TableCell>{quote.primary_language?.toUpperCase()}</TableCell>
              <TableCell>
                {quote.translations ? Object.keys(quote.translations).length : 0} languages
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  onClick={() => onManageTranslations(quote.id)}
                >
                  Manage Translations
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}