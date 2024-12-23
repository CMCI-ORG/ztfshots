import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DateFilters = () => {
  return (
    <>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }, (_, i) => (
            <SelectItem key={i} value={String(i + 1)}>
              {format(new Date(2024, i, 1), "MMMM")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
};