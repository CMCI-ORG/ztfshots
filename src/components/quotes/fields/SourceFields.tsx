import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, UseFormSetValue } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuoteFormValues } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

interface SourceFieldsProps {
  control: Control<QuoteFormValues>;
  setValue: UseFormSetValue<QuoteFormValues>;
}

export function SourceFields({ control, setValue }: SourceFieldsProps) {
  const [open, setOpen] = useState(false);

  const { data: sources, isLoading } = useQuery({
    queryKey: ["sources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sources")
        .select("*")
        .order("title");
      if (error) throw error;
      return data || [];
    },
  });

  const handleSourceSelect = (title: string) => {
    const selectedSource = sources?.find(source => source.title === title);
    if (selectedSource) {
      setValue("source_title", selectedSource.title);
      setValue("source_url", selectedSource.url || "");
    }
    setOpen(false);
  };

  return (
    <>
      <FormField
        control={control}
        name="source_title"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Source Title</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between w-full"
                  >
                    {field.value || "Select a source..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search sources..." />
                  <CommandEmpty>No source found.</CommandEmpty>
                  <CommandGroup>
                    {isLoading ? (
                      <div className="p-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full mt-2" />
                        <Skeleton className="h-8 w-full mt-2" />
                      </div>
                    ) : (
                      (sources || []).map((source) => (
                        <CommandItem
                          key={source.id}
                          value={source.title}
                          onSelect={handleSourceSelect}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === source.title ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {source.title}
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="source_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source URL (optional)</FormLabel>
            <FormControl>
              <Input 
                type="url" 
                placeholder="https://example.com/book" 
                {...field} 
                value={field.value || ''} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}