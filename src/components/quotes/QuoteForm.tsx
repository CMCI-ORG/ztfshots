import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { quoteFormSchema, type QuoteFormValues } from "./types";
import { QuoteTextField } from "./fields/QuoteTextField";
import { QuoteTitleField } from "./fields/QuoteTitleField";
import { AuthorField } from "./fields/AuthorField";
import { CategoryField } from "./fields/CategoryField";
import { PostDateField } from "./fields/PostDateField";
import { SourceFields } from "./fields/source/SourceFields";
import { useQuoteSubmit } from "./hooks/useQuoteSubmit";
import { supabase } from "@/integrations/supabase/client";
import { TranslationFields } from "./fields/TranslationFields";
import { useLanguages } from "./hooks/useLanguages";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface QuoteFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<QuoteFormValues>;
  mode: 'add' | 'edit';
  quoteId?: string;
}

export function QuoteForm({ onSuccess, initialValues, mode, quoteId }: QuoteFormProps) {
  const { submitQuote } = useQuoteSubmit(mode, quoteId);
  const [primaryLanguage, setPrimaryLanguage] = useState(initialValues?.primary_language || 'en');
  const { data: languages = [] } = useLanguages();

  const { data: authors, error: authorsError } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: categories, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      text: initialValues?.text || "",
      author_id: initialValues?.author_id || "",
      category_id: initialValues?.category_id || "",
      source_title: initialValues?.source_title || "",
      source_url: initialValues?.source_url || "",
      post_date: initialValues?.post_date || new Date(),
      title: initialValues?.title || "",
      translations: initialValues?.translations || {},
      primary_language: initialValues?.primary_language || "en",
    },
  });

  if (authorsError) throw authorsError;
  if (categoriesError) throw categoriesError;

  async function onSubmit(values: QuoteFormValues) {
    const success = await submitQuote({
      ...values,
      primary_language: primaryLanguage,
    });
    if (success) {
      form.reset();
      onSuccess?.();
    }
  }

  const otherLanguages = languages.filter(lang => lang.code !== primaryLanguage);

  return (
    <ErrorBoundary>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Primary Language</h3>
            <Select
              value={primaryLanguage}
              onValueChange={(value) => setPrimaryLanguage(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <QuoteTitleField form={form} />
          <QuoteTextField form={form} />
          <AuthorField form={form} authors={authors || []} />
          <CategoryField form={form} categories={categories || []} />
          <PostDateField form={form} />
          <SourceFields control={form.control} setValue={form.setValue} />

          {otherLanguages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Translations</h3>
              {otherLanguages.map((lang) => (
                <TranslationFields
                  key={lang.code}
                  form={form}
                  language={lang}
                />
              ))}
            </div>
          )}

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting 
              ? (mode === 'add' ? "Adding..." : "Updating...") 
              : (mode === 'add' ? "Add Quote" : "Update Quote")}
          </Button>
        </form>
      </Form>
    </ErrorBoundary>
  );
}