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
  const [selectedTab, setSelectedTab] = useState<'quotes' | 'categories' | 'pages_content' | 'site_settings'>('quotes');
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

  const { data: categories = [] } = useQuery({
    queryKey: ["categories-translations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, description, translations, primary_language")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: siteSettings } = useQuery({
    queryKey: ["site-settings-translations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      
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

      <Tabs value={selectedTab} onValueChange={(value: 'quotes' | 'categories' | 'pages_content' | 'site_settings') => setSelectedTab(value)}>
        <TabsList>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="pages_content">Pages</TabsTrigger>
          <TabsTrigger value="site_settings">Site Settings</TabsTrigger>
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

        <TabsContent value="categories" className="space-y-4">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Primary Language</TableHead>
                  <TableHead>Translations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="font-medium">{category.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </div>
                    </TableCell>
                    <TableCell>{category.primary_language?.toUpperCase()}</TableCell>
                    <TableCell>
                      {category.translations ? Object.keys(category.translations).length : 0} languages
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedItemId(category.id)}
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

        <TabsContent value="site_settings" className="space-y-4">
          {siteSettings && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Primary Language</TableHead>
                    <TableHead>Translations</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">{siteSettings.site_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {siteSettings.tag_line}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {siteSettings.description}
                      </div>
                    </TableCell>
                    <TableCell>{siteSettings.primary_language?.toUpperCase()}</TableCell>
                    <TableCell>
                      {siteSettings.translations ? Object.keys(siteSettings.translations).length : 0} languages
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedItemId(siteSettings.id)}
                      >
                        Manage Translations
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
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