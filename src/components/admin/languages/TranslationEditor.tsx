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
        .single();
      
      if (error) throw error;
      
      setTranslations(data.translations || {});
      return data as TranslatableItem;
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Translations</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Original Content ({item.primary_language?.toUpperCase()})</h3>
            {item.title && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Title</label>
                <Input value={item.title} disabled />
              </div>
            )}
            {item.text && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Text</label>
                <Textarea value={item.text} disabled />
              </div>
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
                  {item.title && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={translations[lang.code]?.title || ""}
                        onChange={(e) =>
                          handleTranslationChange(lang.code, "title", e.target.value)
                        }
                        placeholder={`Enter title in ${lang.name}`}
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Text</label>
                    <Textarea
                      value={translations[lang.code]?.text || ""}
                      onChange={(e) =>
                        handleTranslationChange(lang.code, "text", e.target.value)
                      }
                      placeholder={`Enter text in ${lang.name}`}
                    />
                  </div>
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