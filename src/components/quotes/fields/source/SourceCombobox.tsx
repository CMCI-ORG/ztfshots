import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Source } from "./types";

interface SourceComboboxProps {
  sources: Source[] | undefined;
  isLoading: boolean;
  error: Error | null;
  value: string;
  onSelect: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SourceCombobox({
  sources = [], // Provide default empty array
  isLoading,
  error,
  value,
  onSelect,
  open,
  onOpenChange,
}: SourceComboboxProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between w-full",
              !value && "text-muted-foreground"
            )}
          >
            {value || "Select a source..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search sources..." />
          <CommandGroup>
            {isLoading ? (
              <div className="p-2 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : error ? (
              <div className="py-6 text-center text-sm text-destructive">
                Error loading sources: {error.message}
              </div>
            ) : sources.length === 0 ? (
              <CommandEmpty>No sources found.</CommandEmpty>
            ) : (
              sources.map((source) => (
                <CommandItem
                  key={source.id}
                  value={source.title}
                  onSelect={onSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === source.title ? "opacity-100" : "opacity-0"
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
  );
}