import { useState } from "react";
import { useSourcesQuery, findSourceByTitle } from "./useSourcesQuery";
import { SourceFormFields } from "./SourceFormFields";
import type { SourceFieldsProps } from "./types";
import { useToast } from "@/components/ui/use-toast";

export function SourceFields({ control, setValue }: SourceFieldsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isNewSource, setIsNewSource] = useState(false);
  const { data: sources, isLoading } = useSourcesQuery();
  const { toast } = useToast();

  const handleSourceSelect = async (source: { title: string; url?: string }) => {
    try {
      setValue("source_title", source.title, { 
        shouldValidate: true,
        shouldDirty: true 
      });
      
      setValue("source_url", source.url || "", {
        shouldValidate: true,
        shouldDirty: true
      });
      
      setShowSuggestions(false);
      setIsNewSource(false);
    } catch (error) {
      console.error("Error selecting source:", error);
      toast({
        title: "Error",
        description: "Failed to select source. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewSource = () => {
    setIsNewSource(true);
    setShowSuggestions(false);
    setValue("source_title", "", { 
      shouldValidate: true,
      shouldDirty: true 
    });
    setValue("source_url", "", {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  return (
    <SourceFormFields
      control={control}
      sources={sources || []}
      showSuggestions={showSuggestions}
      isNewSource={isNewSource}
      onSourceSelect={handleSourceSelect}
      onNewSource={handleNewSource}
      setShowSuggestions={setShowSuggestions}
      setIsNewSource={setIsNewSource}
    />
  );
}