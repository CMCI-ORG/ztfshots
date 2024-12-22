import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
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
import { useToast } from "@/components/ui/use-toast";

interface Source {
  id: string;
  title: string;
  url?: string;
}

interface SourceFieldsProps {
  control: Control<QuoteFormValues>;
  setValue: UseFormSetValue<QuoteFormValues>;
}

export function SourceFields({ control, setValue }: SourceFieldsProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: sources, isLoading, error } = useQuery({
    queryKey: ["sources"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("sources")
          .select("*")
          .order("title");

        if (error) {
          throw error;
        }

        return data || [];
      } catch (err) {
        console.error("Error fetching sources:", err);
        toast({
          title: "Error",
          description: "Failed to load sources. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const handleSourceSelect = (title: string) => {
    if (!sources) return;
    
    try {
      const selectedSource = sources.find(source => source.title === title);
      if (selectedSource) {
        setValue("source_title", selectedSource.title, { 
          shouldValidate: true,
          shouldDirty: true 
        });
        setValue("source_url", selectedSource.url || "", {
          shouldValidate: true,
          shouldDirty: true
        });
        setOpen(false);
      }
    } catch (err) {
      console.error("Error selecting source:", err);
      toast({
        title: "Error",
        description: "Failed to select source. Please try again.",
        variant: "destructive",
      });
    }
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty URL is valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
                    className={cn(
                      "justify-between w-full",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value || "Select a source..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search sources..." />
                  <CommandEmpty>No sources found.</CommandEmpty>
                  <CommandGroup>
                    {isLoading ? (
                      <CommandItem value="loading" disabled>
                        <div className="p-2 space-y-2">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      </CommandItem>
                    ) : error ? (
                      <CommandItem value="error" disabled>
                        <div className="py-6 text-center text-sm text-destructive">
                          Error loading sources
                        </div>
                      </CommandItem>
                    ) : sources && sources.length > 0 ? (
                      sources.map((source) => (
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
                    ) : (
                      <CommandItem value="no-results" disabled>
                        <div className="py-6 text-center text-sm">
                          No sources available
                        </div>
                      </CommandItem>
                    )}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>
              Select an existing source or enter a new one
            </FormDescription>
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
                onChange={(e) => {
                  const url = e.target.value;
                  field.onChange(url);
                  
                  // Validate URL format if not empty
                  if (url && !validateUrl(url)) {
                    toast({
                      title: "Invalid URL",
                      description: "Please enter a valid URL (e.g., https://example.com)",
                      variant: "destructive",
                    });
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              The URL where this quote can be found (must start with http:// or https://)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}