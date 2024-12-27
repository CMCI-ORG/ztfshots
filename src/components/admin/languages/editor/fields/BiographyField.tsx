import { Textarea } from "@/components/ui/textarea";

interface BiographyFieldProps {
  langName: string;
  value: string;
  onChange: (value: string) => void;
}

export function BiographyField({ langName, value, onChange }: BiographyFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Biography</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter biography in ${langName}`}
      />
    </div>
  );
}