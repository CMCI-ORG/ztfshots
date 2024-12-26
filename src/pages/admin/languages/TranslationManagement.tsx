import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { TranslationEditor } from "@/components/admin/languages/TranslationEditor";
import { QuotesTab } from "@/components/admin/languages/management/QuotesTab";
import { CategoriesTab } from "@/components/admin/languages/management/CategoriesTab";
import { SiteSettingsTab } from "@/components/admin/languages/management/SiteSettingsTab";

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
          <TabsTrigger value="site_settings">Site Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <QuotesTab onManageTranslations={setSelectedItemId} />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTab onManageTranslations={setSelectedItemId} />
        </TabsContent>

        <TabsContent value="site_settings">
          <SiteSettingsTab onManageTranslations={setSelectedItemId} />
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