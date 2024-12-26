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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { TranslationEditor } from "@/components/admin/languages/TranslationEditor";

export default function TranslationManagement() {
  const [selectedTab, setSelectedTab] = useState("quotes");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { data: languages = [] } = useQuery({
    queryKey: ["languages-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Translation Management</h2>
        <p className="text-muted-foreground">
          Manage translations for different types of content
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-4">
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
                        onClick={() => setSelectedItemId(quote.id)}
                      >
                        Manage Translations
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {selectedItemId && (
        <TranslationEditor
          itemId={selectedItemId}
          itemType={selectedTab}
          onClose={() => setSelectedItemId(null)}
          languages={languages}
        />
      )}
    </div>
  );
}