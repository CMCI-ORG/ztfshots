import { Input } from "@/components/ui/input";

interface TitleFieldProps {
  langName: string;
  value: string;
  onChange: (value: string) => void;
  itemType: 'quotes' | 'categories' | 'pages_content' | 'site_settings' | 'authors';
}

export function TitleField({ langName, value, onChange, itemType }: TitleFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {itemType === 'site_settings' ? 'Site Name' : 'Title'}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${itemType === 'site_settings' ? 'site name' : 'title'} in ${langName}`}
      />
    </div>
  );
}