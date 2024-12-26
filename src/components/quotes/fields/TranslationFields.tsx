import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormValues } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageOption } from "../types/translations";

interface TranslationFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
  language: LanguageOption;
}

export function TranslationFields({ form, language }: TranslationFieldsProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">
          {language.name} ({language.nativeName})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name={`translations.${language.code}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title ({language.code})</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`translations.${language.code}.text`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote Text ({language.code})</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}