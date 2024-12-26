import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface DateFiltersProps {
  startDate?: string;
  endDate?: string;
  onDateChange: (startDate: string, endDate: string) => void;
}

export const DateFilters = ({ startDate, endDate, onDateChange }: DateFiltersProps) => {
  const [start, setStart] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined
  );
  const [end, setEnd] = useState<Date | undefined>(
    endDate ? new Date(endDate) : undefined
  );

  const handleStartDateSelect = (date: Date | undefined) => {
    setStart(date);
    if (date) {
      onDateChange(date.toISOString(), end?.toISOString() || '');
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEnd(date);
    if (date) {
      onDateChange(start?.toISOString() || '', date.toISOString());
    }
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {start ? format(start, "PPP") : "Start date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={start}
            onSelect={handleStartDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {end ? format(end, "PPP") : "End date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={end}
            onSelect={handleEndDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};