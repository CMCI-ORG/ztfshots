import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { PageFormValues } from "../types";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

interface RichTextFieldProps {
  form: UseFormReturn<PageFormValues>;
}

export const RichTextField = ({ form }: RichTextFieldProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: form.getValues('rich_text_content'),
    onUpdate: ({ editor }) => {
      form.setValue('rich_text_content', editor.getJSON());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name="rich_text_content"
      render={() => (
        <FormItem>
          <FormLabel>Content</FormLabel>
          <div className="border rounded-md p-2">
            <div className="flex gap-2 mb-2 border-b pb-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-muted' : ''}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-muted' : ''}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-muted' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'bg-muted' : ''}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
            <EditorContent editor={editor} className="min-h-[200px] prose dark:prose-invert max-w-none" />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};