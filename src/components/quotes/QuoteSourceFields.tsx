import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface QuoteSourceFieldsProps {
  control: Control<any>;
}

export function QuoteSourceFields({ control }: QuoteSourceFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="source_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source Title (optional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g., The Art of War" {...field} value={field.value || ''} />
            </FormControl>
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}