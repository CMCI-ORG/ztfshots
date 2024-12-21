import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormValues } from "../types";

interface AuthorFieldProps {
  form: UseFormReturn<QuoteFormValues>;
  authors: Array<{ id: string; name: string; }>;
}

export function AuthorField({ form, authors }: AuthorFieldProps) {
  return (
    <FormField
      control={form.control}
      name="author_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Author</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select an author" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {authors?.map((author) => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}