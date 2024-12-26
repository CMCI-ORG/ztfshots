import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchInputProps {
  defaultValue?: string;
  onSearch: (query: string) => void;
}

export const SearchInput = ({ defaultValue = '', onSearch }: SearchInputProps) => {
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    if (debouncedValue !== defaultValue) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, defaultValue, onSearch]);

  return (
    <div className="relative">
      <Input
        placeholder="Search for a quote or topic..."
        className="pl-10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
    </div>
  );
};