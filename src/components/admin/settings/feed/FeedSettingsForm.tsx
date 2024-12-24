import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeedSettingsFormData } from "./types";

const formSchema = z.object({
  rss_url: z.string().url({ message: "Please enter a valid RSS feed URL" }),
  section_title: z.string().min(2, { message: "Section title must be at least 2 characters" }),
  feed_count: z.number().min(1).max(20),
  footer_position: z.enum(['none', 'column_1', 'column_2', 'column_3', 'column_4']),
  footer_order: z.number().min(0).max(10),
});

interface FeedSettingsFormProps {
  defaultValues: FeedSettingsFormData;
  onSubmit: (data: FeedSettingsFormData) => void;
  isSubmitting: boolean;
}

export function FeedSettingsForm({ defaultValues, onSubmit, isSubmitting }: FeedSettingsFormProps) {
  const form = useForm<FeedSettingsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="rss_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RSS Feed URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/feed.xml" {...field} />
              </FormControl>
              <FormDescription>
                The URL of the RSS feed you want to display on your site
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="section_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Title</FormLabel>
              <FormControl>
                <Input placeholder="Latest Updates" {...field} />
              </FormControl>
              <FormDescription>
                The title that will appear above the feed content
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feed_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Items</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  max={20} 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                How many feed items to display (1-20)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="footer_position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Footer Position</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select footer position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="column_1">Column 1</SelectItem>
                  <SelectItem value="column_2">Column 2</SelectItem>
                  <SelectItem value="column_3">Column 3</SelectItem>
                  <SelectItem value="column_4">Column 4</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Where to display this feed in the footer (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="footer_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Footer Display Order</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={0} 
                  max={10} 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Order in which this feed appears in its footer column (0-10)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  );
}