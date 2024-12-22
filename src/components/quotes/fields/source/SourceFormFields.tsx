import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Control } from "react-hook-form";
import { SourceSuggestions } from "./SourceSuggestions";
import { Source } from "./types";

interface SourceFormFieldsProps {
  control: Control<any>;
  sources: Source[];
  showSuggestions: boolean;
  isNewSource: boolean;
  onSourceSelect: (source: Source) => void;
  onNewSource: () => void;
  setShowSuggestions: (show: boolean) => void;
  setIsNewSource: (isNew: boolean) => void;
}

export function SourceFormFields({
  control,
  sources,
  showSuggestions,
  isNewSource,
  onSourceSelect,
  onNewSource,
  setShowSuggestions,
  setIsNewSource,
}: SourceFormFieldsProps) {
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
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
                  onBlur={handleBlur}
                  onChange={(e) => {
                    field.onChange(e);
                    setIsNewSource(true);
                  }}
                />
              </FormControl>
              <FormDescription>
                Select an existing source or enter a new one
              </FormDescription>
              <SourceSuggestions
                sources={sources}
                isVisible={showSuggestions}
                onSelect={onSourceSelect}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="mb-6"
          onClick={onNewSource}
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