import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SourceCombobox } from "./SourceCombobox";
import { useSourcesQuery } from "./useSourcesQuery";
import type { SourceFieldsProps } from "./types";

export function SourceFields({ control, setValue }: SourceFieldsProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { data: sources, isLoading, error } = useSourcesQuery();

  const handleSourceSelect = (title: string) => {
    if (!sources) return;
    
    try {
      const selectedSource = sources.find(source => source.title === title);
      if (selectedSource) {
        setValue("source_title", selectedSource.title, { 
          shouldValidate: true,
          shouldDirty: true 
        });
        setValue("source_url", selectedSource.url || "", {
          shouldValidate: true,
          shouldDirty: true
        });
        setOpen(false);
      }
    } catch (err) {
      console.error("Error selecting source:", err);
      toast({
        title: "Error",
        description: "Failed to select source. Please try again.",
        variant: "destructive",
      });
    }
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <>
      <FormField
        control={control}
        name="source_title"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Source Title</FormLabel>
            <SourceCombobox
              sources={sources}
              isLoading={isLoading}
              error={error}
              value={field.value}
              onSelect={handleSourceSelect}
              open={open}
              onOpenChange={setOpen}
            />
            <FormDescription>
              Select an existing source or enter a new one
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="source_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source URL (optional)</FormLabel>
            <FormControl>
              <Input 
                type="url" 
                placeholder="https://example.com/book" 
                {...field} 
                value={field.value || ''} 
                onChange={(e) => {
                  const url = e.target.value;
                  field.onChange(url);
                  
                  if (url && !validateUrl(url)) {
                    toast({
                      title: "Invalid URL",
                      description: "Please enter a valid URL (e.g., https://example.com)",
                      variant: "destructive",
                    });
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              The URL where this quote can be found (must start with http:// or https://)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}