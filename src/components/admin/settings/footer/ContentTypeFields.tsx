import { UseFormReturn } from "react-hook-form";
import { FooterContentType } from "./types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { ImageUpload } from "../ImageUpload";

interface ContentTypeFieldsProps {
  contentType: FooterContentType;
  form: UseFormReturn<any>;
}

export function ContentTypeFields({ contentType, form }: ContentTypeFieldsProps) {
  const renderField = (key: string, type: string, path: string = '') => {
    switch (type) {
      case 'string':
        return (
          <FormField
            key={key}
            control={form.control}
            name={`content.${path}${key}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                <FormControl>
                  {key === 'text' ? (
                    <Textarea {...field} />
                  ) : (
                    <Input {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'number':
        return (
          <FormField
            key={key}
            control={form.control}
            name={`content.${path}${key}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'image':
        return (
          <FormField
            key={key}
            control={form.control}
            name={`content.${path}${key}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    bucket="site-assets"
                    path="footer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      default:
        return null;
    }
  };

  const renderAddressFields = () => {
    const fields = ['street', 'city', 'state', 'zip', 'phone', 'email'];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => (
          <FormField
            key={field}
            control={form.control}
            name={`content.${field}`}
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
                <FormControl>
                  <Input 
                    {...fieldProps}
                    value={value || ''}
                    onChange={onChange}
                    type={field === 'email' ? 'email' : 'text'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    );
  };

  const renderArrayField = (key: string, fields: Record<string, string>) => {
    const items = form.watch(`content.${key}`) || [{}];

    return (
      <div key={key} className="space-y-4">
        <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
        {items.map((_, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            {Object.entries(fields).map(([fieldKey, fieldType]) =>
              renderField(fieldKey, fieldType, `${key}.${index}.`)
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const currentItems = form.getValues(`content.${key}`) || [];
                form.setValue(`content.${key}`, currentItems.filter((_, i) => i !== index));
              }}
            >
              <Minus className="h-4 w-4" />
              Remove {key.slice(0, -1)}
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const currentItems = form.getValues(`content.${key}`) || [];
            form.setValue(`content.${key}`, [...currentItems, {}]);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {key.slice(0, -1)}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {contentType.type === 'address' ? (
        renderAddressFields()
      ) : (
        Object.entries(contentType.fields).map(([key, value]) => {
          if (typeof value === 'object') {
            return renderArrayField(key, value[0]);
          }
          return renderField(key, value);
        })
      )}
    </div>
  );
}