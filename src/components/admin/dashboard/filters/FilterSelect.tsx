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
  items?: Array<{ id: string; name: string }>;
  isLoading: boolean;
  valueKey?: string;
  labelKey?: string;
}

export const FilterSelect = ({
  placeholder,
  items,
  isLoading,
  valueKey = "id",
  labelKey = "name"
}: FilterSelectProps) => {
  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items?.map((item: any) => (
          <SelectItem key={item[valueKey]} value={item[valueKey]}>
            {item[labelKey]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};