import { UseFormReturn } from "react-hook-form";
import { QuoteFormValues } from "../types";
import { QuoteTitleField } from "../fields/QuoteTitleField";
import { QuoteTextField } from "../fields/QuoteTextField";
import { AuthorField } from "../fields/AuthorField";
import { CategoryField } from "../fields/CategoryField";
import { PostDateField } from "../fields/PostDateField";
import { SourceFields } from "../fields/source/SourceFields";

interface FormFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
  authors: Array<{ id: string; name: string; }>;
  categories: Array<{ id: string; name: string; }>;
}

export const FormFields = ({ form, authors, categories }: FormFieldsProps) => {
  return (
    <>
      <QuoteTitleField form={form} />
      <QuoteTextField form={form} />
      <AuthorField form={form} authors={authors} />
      <CategoryField form={form} categories={categories} />
      <PostDateField form={form} />
      <SourceFields control={form.control} setValue={form.setValue} />
    </>
  );
};