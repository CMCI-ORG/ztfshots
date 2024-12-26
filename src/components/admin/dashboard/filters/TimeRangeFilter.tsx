import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TimeRange = 'today' | 'week' | 'month' | 'year' | 'lifetime';

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
        <SelectItem value="today">Today</SelectItem>
        <SelectItem value="week">This Week</SelectItem>
        <SelectItem value="month">This Month</SelectItem>
        <SelectItem value="year">This Year</SelectItem>
        <SelectItem value="lifetime">Lifetime</SelectItem>
      </SelectContent>
    </Select>
  );
};