import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { TranslatableItem, TranslationEditorProps } from "./types";
import { OriginalContent } from "./editor/OriginalContent";
import { TranslationFields } from "./editor/TranslationFields";

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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Translations</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <OriginalContent item={item} itemType={itemType} />

          <div className="space-y-4">
            <h3 className="font-medium">Translations</h3>
            {otherLanguages.map((lang) => (
              <TranslationFields
                key={lang.code}
                langCode={lang.code}
                langName={lang.name}
                nativeName={lang.native_name}
                translations={translations}
                itemType={itemType}
                onTranslationChange={handleTranslationChange}
              />
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