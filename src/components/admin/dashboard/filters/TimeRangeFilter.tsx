import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TimeRange = 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'this_year' | 'last_year' | 'lifetime';

interface TimeRangeFilterProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  'aria-label'?: string;
}

export const TimeRangeFilter = ({ 
  value, 
  onChange,
  'aria-label': ariaLabel 
}: TimeRangeFilterProps) => {
  return (
    <Select 
      value={value} 
      onValueChange={(val) => onChange(val as TimeRange)}
      aria-label={ariaLabel || "Time range filter"}
    >
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Select time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="this_week">This Week</SelectItem>
        <SelectItem value="last_week">Last Week</SelectItem>
        <SelectItem value="this_month">This Month</SelectItem>
        <SelectItem value="last_month">Last Month</SelectItem>
        <SelectItem value="this_year">This Year</SelectItem>
        <SelectItem value="last_year">Last Year</SelectItem>
        <SelectItem value="lifetime">Lifetime</SelectItem>
      </SelectContent>
    </Select>
  );
};