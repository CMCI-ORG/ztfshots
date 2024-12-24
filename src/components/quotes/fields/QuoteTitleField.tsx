import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormValues } from "../types";

interface QuoteTitleFieldProps {
  form: UseFormReturn<QuoteFormValues>;
}

export function QuoteTitleField({ form }: QuoteTitleFieldProps) {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title (optional)</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter a title for the quote..."
              className="font-semibold"
              {...field}
              value={field.value || ''}
            />
          </FormControl>
          <FormDescription>
            A title for the quote that will be displayed in bold
          </FormDescription>
        </FormItem>
      )}
    />
  );
}