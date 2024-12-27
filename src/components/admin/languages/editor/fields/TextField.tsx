import { Textarea } from "@/components/ui/textarea";

interface TextFieldProps {
  langName: string;
  value: string;
  onChange: (value: string) => void;
  itemType: 'quotes' | 'categories' | 'pages_content' | 'site_settings' | 'authors';
}

export function TextField({ langName, value, onChange, itemType }: TextFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {itemType === 'site_settings' ? 'Description' : 'Text'}
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${itemType === 'site_settings' ? 'description' : 'text'} in ${langName}`}
      />
    </div>
  );
}