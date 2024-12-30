import { UseFormReturn } from "react-hook-form";
import { FooterContentType } from "./types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AddressFields } from "./fields/AddressFields";
import { ArrayFields } from "./fields/ArrayFields";
import { validateField } from "./utils/validation";

interface ContentTypeFieldsProps {
  contentType: FooterContentType;
  form: UseFormReturn<any>;
}

export function ContentTypeFields({ contentType, form }: ContentTypeFieldsProps) {
  const { toast } = useToast();

  const renderField = (key: string, type: string, path: string = '') => {
    const fieldPath = `content.${path}${key}`;
    const error = form.formState.errors?.content?.[path]?.[key];
    const fieldName = key.charAt(0).toUpperCase() + key.slice(1);

    const handleValidation = (value: any) => {
      const validationResult = validateField(value, type, fieldName);
      if (validationResult !== true) {
        toast({
          title: "Validation Error",
          description: validationResult,
          variant: "destructive",
        });
        return false;
      }
      return true;
    };

    switch (type) {
      case 'string':
        return (
          <FormField
            key={key}
            control={form.control}
            name={fieldPath}
            rules={{ 
              required: `${fieldName} is required`,
              validate: (value) => {
                if (!value || value.trim() === '') {
                  return `${fieldName} cannot be empty`;
                }
                return handleValidation(value);
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{fieldName}</FormLabel>
                <FormControl>
                  {key === 'text' ? (
                    <Textarea 
                      {...field} 
                      className={error ? 'border-destructive' : ''}
                      onBlur={(e) => {
                        field.onBlur();
                        handleValidation(e.target.value);
                      }}
                    />
                  ) : (
                    <Input 
                      {...field} 
                      className={error ? 'border-destructive' : ''}
                      onBlur={(e) => {
                        field.onBlur();
                        handleValidation(e.target.value);
                      }}
                    />
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
            name={fieldPath}
            rules={{ 
              required: `${fieldName} is required`,
              validate: (value) => {
                if (!value) {
                  return `${fieldName} is required`;
                }
                return handleValidation(value);
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{fieldName}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => {
                      const value = e.target.value;
                      if (value && handleValidation(Number(value))) {
                        field.onChange(Number(value));
                      }
                    }}
                    className={error ? 'border-destructive' : ''}
                  />
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
            name={fieldPath}
            rules={{ 
              required: `${fieldName} is required`,
              validate: (value) => {
                if (!value) {
                  return `${fieldName} URL is required`;
                }
                return handleValidation(value);
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{fieldName}</FormLabel>
                <FormControl>
                  <Input 
                    type="url" 
                    placeholder="Enter image URL..."
                    {...field}
                    className={error ? 'border-destructive' : ''}
                    onBlur={(e) => {
                      field.onBlur();
                      handleValidation(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        rules={{ 
          required: "Title is required",
          validate: (value) => {
            if (!value || value.trim() === '') {
              return "Title cannot be empty";
            }
            if (value.trim().length < 2) {
              return "Title must be at least 2 characters";
            }
            return true;
          }
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                value={field.value || ''} 
                className={form.formState.errors.title ? 'border-destructive' : ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {contentType.type === 'address' ? (
        <AddressFields form={form} />
      ) : (
        Object.entries(contentType.fields).map(([key, value]) => {
          if (typeof value === 'object') {
            return <ArrayFields key={key} form={form} fieldKey={key} fields={value[0]} />;
          }
          return renderField(key, value);
        })
      )}
    </div>
  );
}