import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSourcesQuery, findSourceByTitle } from "./useSourcesQuery";
import type { SourceFieldsProps } from "./types";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function SourceFields({ control, setValue }: SourceFieldsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isNewSource, setIsNewSource] = useState(false);
  const { data: sources, isLoading } = useSourcesQuery();
  const { toast } = useToast();

  const handleSourceSelect = async (title: string) => {
    try {
      const source = await findSourceByTitle(title);
      
      setValue("source_title", title, { 
        shouldValidate: true,
        shouldDirty: true 
      });
      
      setValue("source_url", source?.url || "", {
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
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <FormField
          control={control}
          name="source_title"
          render={({ field }) => (
            <FormItem className="flex-1 relative">
              <FormLabel>Source Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., The Art of War" 
                  {...field} 
                  value={field.value || ''} 
                  onFocus={() => !isNewSource && setShowSuggestions(true)}
                  onChange={(e) => {
                    field.onChange(e);
                    setIsNewSource(true);
                  }}
                />
              </FormControl>
              <FormDescription>
                Select an existing source or enter a new one
              </FormDescription>
              {showSuggestions && sources && sources.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
                  <ScrollArea className="h-[200px]">
                    <div className="p-2">
                      {sources.map((source) => (
                        <div
                          key={source.id}
                          className="flex flex-col gap-1 p-2 hover:bg-accent rounded-sm cursor-pointer"
                          onClick={() => handleSourceSelect(source.title)}
                        >
                          <span className="font-medium">{source.title}</span>
                          {source.url && (
                            <span className="text-sm text-muted-foreground truncate">
                              {source.url}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="mb-6"
          onClick={handleNewSource}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>

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
              />
            </FormControl>
            <FormDescription>
              The URL where this quote can be found (must start with http:// or https://)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}