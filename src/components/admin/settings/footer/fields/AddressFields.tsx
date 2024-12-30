import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { validateField } from "../utils/validation";

interface AddressFieldsProps {
  form: UseFormReturn<any>;
}

export const AddressFields = ({ form }: AddressFieldsProps) => {
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
            validate: (value) => {
              if (!value || value.trim() === '') {
                return `${name.charAt(0).toUpperCase() + name.slice(1)} cannot be empty`;
              }
              return validateField(value, type, name);
            }
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