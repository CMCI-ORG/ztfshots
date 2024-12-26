import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface FilterSelectProps {
  placeholder: string;
  items?: { id: string; name: string }[] | null;
  isLoading?: boolean;
  value?: string;
  onChange: (value: string) => void;
}

export const FilterSelect = ({
  placeholder,
  items,
  isLoading,
  value,
  onChange,
}: FilterSelectProps) => {
  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All</SelectItem>
        {items?.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};