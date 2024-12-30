import { UseFormReturn } from "react-hook-form";
import { FooterContentType } from "./types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentTypeFieldsProps {
  contentType: FooterContentType;
  form: UseFormReturn<any>;
}

export function ContentTypeFields({ contentType, form }: ContentTypeFieldsProps) {
  const { toast } = useToast();

  const validateField = (value: any, type: string, fieldName: string) => {
    if (!value && type !== 'array') {
      return `${fieldName} is required`;
    }
    
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          return `${fieldName} must be text`;
        }
        break;
      case 'number':
        if (isNaN(Number(value))) {
          return `${fieldName} must be a number`;
        }
        break;
      case 'url':
        try {
          new URL(value);
        } catch {
          return `${fieldName} must be a valid URL`;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return `${fieldName} must be a valid email address`;
        }
        break;
    }
    return true;
  };

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
              validate: handleValidation
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
                        handleValidation(e.target.value);
                        field.onBlur();
                      }}
                    />
                  ) : (
                    <Input 
                      {...field} 
                      className={error ? 'border-destructive' : ''}
                      onBlur={(e) => {
                        handleValidation(e.target.value);
                        field.onBlur();
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
              validate: handleValidation
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{fieldName}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => {
                      const value = Number(e.target.value);
                      if (handleValidation(value)) {
                        field.onChange(value);
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
              validate: (value) => handleValidation(value, 'url', fieldName)
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
                      handleValidation(e.target.value);
                      field.onBlur();
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

  const renderAddressFields = () => {
    const fields = [
      { name: 'street', type: 'string' },
      { name: 'city', type: 'string' },
      { name: 'state', type: 'string' },
      { name: 'zip', type: 'string' },
      { name: 'phone', type: 'string' },
      { name: 'email', type: 'email' }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ name, type }) => (
          <FormField
            key={name}
            control={form.control}
            name={`content.${name}`}
            rules={{ 
              required: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
              validate: (value) => validateField(value, type, name)
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{name.charAt(0).toUpperCase() + name.slice(1)}</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    type={type === 'email' ? 'email' : 'text'}
                    value={field.value || ''}
                    className={form.formState.errors?.content?.[name] ? 'border-destructive' : ''}
                    onBlur={(e) => {
                      validateField(e.target.value, type, name);
                      field.onBlur();
                    }}
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
                if (currentItems.length > 1) {
                  form.setValue(`content.${key}`, currentItems.filter((_, i) => i !== index));
                } else {
                  toast({
                    title: "Cannot Remove",
                    description: "You must have at least one item",
                    variant: "destructive",
                  });
                }
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
        rules={{ 
          required: "Title is required",
          minLength: {
            value: 2,
            message: "Title must be at least 2 characters"
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
                onBlur={(e) => {
                  validateField(e.target.value, 'string', 'Title');
                  field.onBlur();
                }}
              />
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