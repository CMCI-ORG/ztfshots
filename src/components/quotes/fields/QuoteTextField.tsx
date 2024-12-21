import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormValues } from "../types";

interface QuoteTextFieldProps {
  form: UseFormReturn<QuoteFormValues>;
}

export function QuoteTextField({ form }: QuoteTextFieldProps) {
  return (
    <FormField
      control={form.control}
      name="text"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Quote</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Enter the quote text..."
              className="min-h-[100px]"
              {...field}
            />
          </FormControl>
          <FormDescription>
            The inspirational quote you want to share.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}