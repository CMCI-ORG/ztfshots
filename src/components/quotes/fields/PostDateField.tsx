import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormValues } from "../types";
import { useState } from "react";

interface PostDateFieldProps {
  form: UseFormReturn<QuoteFormValues>;
}

export function PostDateField({ form }: PostDateFieldProps) {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Set time to noon to avoid timezone issues
      const adjustedDate = new Date(date);
      adjustedDate.setHours(12, 0, 0, 0);
      form.setValue("post_date", adjustedDate, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setOpen(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="post_date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Post Date</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  type="button"
                  aria-label="Pick a date"
                  onClick={() => setOpen(true)}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                initialFocus
                required
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}