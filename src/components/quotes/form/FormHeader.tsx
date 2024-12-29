import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormHeaderProps {
  primaryLanguage: string;
  onLanguageChange: (value: string) => void;
  languages: Array<{ code: string; name: string; nativeName: string; }>;
}

export const FormHeader = ({ primaryLanguage, onLanguageChange, languages }: FormHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <h3 className="text-lg font-semibold">Primary Language</h3>
      <Select
        value={primaryLanguage}
        onValueChange={onLanguageChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name} ({lang.nativeName})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};