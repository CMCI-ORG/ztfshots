import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const SearchInput = () => {
  return (
    <div className="relative">
      <Input
        placeholder="Search for a quote or topic..."
        className="pl-10"
      />
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
    </div>
  );
};