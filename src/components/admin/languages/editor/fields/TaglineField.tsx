import { Input } from "@/components/ui/input";

interface TaglineFieldProps {
  langName: string;
  value: string;
  onChange: (value: string) => void;
}

export function TaglineField({ langName, value, onChange }: TaglineFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Tagline</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter tagline in ${langName}`}
      />
    </div>
  );
}