import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormValues } from "./types";

interface QuoteSourceFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
}

export function QuoteSourceFields({ form }: QuoteSourceFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
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
        control={form.control}
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