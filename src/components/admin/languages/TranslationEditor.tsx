import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TranslatableItem, TranslationEditorProps } from "./types";

export function TranslationEditor({
  itemId,
  itemType,
  onClose,
  languages,
}: TranslationEditorProps) {
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: item } = useQuery({
    queryKey: [itemType, itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(itemType)
        .select("*")
        .eq("id", itemId)
        .maybeSingle();
      
      if (error) throw error;
      
      // Safely handle translations for different item types
      const itemData = data as TranslatableItem;
      setTranslations(itemData?.translations || {});
      return itemData;
    },
  });

  const handleTranslationChange = (
    langCode: string,
    field: string,
    value: string
  ) => {
    setTranslations((prev) => ({
      ...prev,
      [langCode]: {
        ...prev[langCode],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from(itemType)
        .update({ translations })
        .eq("id", itemId);

      if (error) throw error;

      toast.success("Translations updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating translations:", error);
      toast.error("Failed to update translations");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return null;

  const otherLanguages = languages.filter(
    (lang) => lang.code !== item.primary_language
  );

  // Get the display text based on item type
  const getDisplayText = () => {
    if (itemType === 'categories') return item.name || '';
    if (itemType === 'pages_content') return item.content || '';
    if (itemType === 'site_settings') return item.description || '';
    return item.text || '';
  };

  // Get the display title based on item type
  const getDisplayTitle = () => {
    if (itemType === 'categories') return item.name || '';
    if (itemType === 'site_settings') return item.site_name || '';
    return item.title || '';
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Translations</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Original Content ({item.primary_language?.toUpperCase()})</h3>
            {(itemType === 'quotes' || itemType === 'pages_content' || itemType === 'site_settings') && (
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {itemType === 'site_settings' ? 'Site Name' : 'Title'}
                </label>
                <Input value={getDisplayTitle()} disabled />
              </div>
            )}
            {itemType === 'site_settings' && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Tagline</label>
                <Input value={item.tag_line || ''} disabled />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                {itemType === 'site_settings' ? 'Description' : 'Text'}
              </label>
              <Textarea value={getDisplayText()} disabled />
            </div>
            {itemType === 'quotes' && (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Source Title</label>
                  <Input value={item.source_title || ''} disabled />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Source URL</label>
                  <Input value={item.source_url || ''} disabled />
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Translations</h3>
            {otherLanguages.map((lang) => (
              <Card key={lang.code}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {lang.name} ({lang.native_name})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(itemType === 'quotes' || itemType === 'pages_content' || itemType === 'site_settings') && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        {itemType === 'site_settings' ? 'Site Name' : 'Title'}
                      </label>
                      <Input
                        value={translations[lang.code]?.title || ""}
                        onChange={(e) =>
                          handleTranslationChange(lang.code, "title", e.target.value)
                        }
                        placeholder={`Enter ${itemType === 'site_settings' ? 'site name' : 'title'} in ${lang.name}`}
                      />
                    </div>
                  )}
                  {itemType === 'site_settings' && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Tagline</label>
                      <Input
                        value={translations[lang.code]?.tag_line || ""}
                        onChange={(e) =>
                          handleTranslationChange(lang.code, "tag_line", e.target.value)
                        }
                        placeholder={`Enter tagline in ${lang.name}`}
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      {itemType === 'site_settings' ? 'Description' : 'Text'}
                    </label>
                    <Textarea
                      value={translations[lang.code]?.text || ""}
                      onChange={(e) =>
                        handleTranslationChange(lang.code, "text", e.target.value)
                      }
                      placeholder={`Enter ${itemType === 'site_settings' ? 'description' : 'text'} in ${lang.name}`}
                    />
                  </div>
                  {itemType === 'quotes' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Source Title</label>
                        <Input
                          value={translations[lang.code]?.source_title || ""}
                          onChange={(e) =>
                            handleTranslationChange(lang.code, "source_title", e.target.value)
                          }
                          placeholder={`Enter source title in ${lang.name}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Source URL</label>
                        <Input
                          value={translations[lang.code]?.source_url || ""}
                          onChange={(e) =>
                            handleTranslationChange(lang.code, "source_url", e.target.value)
                          }
                          placeholder={`Enter source URL in ${lang.name}`}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Translations"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}