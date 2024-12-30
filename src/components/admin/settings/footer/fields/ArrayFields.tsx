import { UseFormReturn } from "react-hook-form";
import { FormLabel, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateField } from "../utils/validation";

interface ArrayFieldsProps {
  form: UseFormReturn<any>;
  fieldKey: string;
  fields: Record<string, string>;
}

export const ArrayFields = ({ form, fieldKey, fields }: ArrayFieldsProps) => {
  const { toast } = useToast();
  const items = form.watch(`content.${fieldKey}`) || [{}];

  const validateArrayField = (value: any, type: string, name: string) => {
    if (!value || value.trim() === '') {
      return `${name} cannot be empty`;
    }
    return validateField(value, type, name);
  };

  return (
    <div className="space-y-4">
      <FormLabel>{fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}</FormLabel>
      {items.map((_, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg">
          {Object.entries(fields).map(([key, type]) => (
            <FormField
              key={key}
              control={form.control}
              name={`content.${fieldKey}.${index}.${key}`}
              rules={{ 
                required: `${key.charAt(0).toUpperCase() + key.slice(1)} is required`,
                validate: (value) => validateArrayField(value, type, key)
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type={type === 'url' ? 'url' : 'text'}
                      className={form.formState.errors?.content?.[fieldKey]?.[index]?.[key] ? 'border-destructive' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const currentItems = form.getValues(`content.${fieldKey}`) || [];
              if (currentItems.length > 1) {
                form.setValue(
                  `content.${fieldKey}`,
                  currentItems.filter((_, i) => i !== index)
                );
              } else {
                toast({
                  title: "Cannot Remove",
                  description: "You must have at least one item",
                  variant: "destructive",
                });
              }
            }}
          >
            <Minus className="h-4 w-4 mr-2" />
            Remove {fieldKey.slice(0, -1)}
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          const currentItems = form.getValues(`content.${fieldKey}`) || [];
          form.setValue(`content.${fieldKey}`, [...currentItems, {}]);
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {fieldKey.slice(0, -1)}
      </Button>
    </div>
  );
};