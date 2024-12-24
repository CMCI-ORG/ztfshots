import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  rss_url: z.string().url({ message: "Please enter a valid RSS feed URL" }),
  section_title: z.string().min(2, { message: "Section title must be at least 2 characters" }),
  feed_count: z.number().min(1).max(20),
});

type FeedSettings = z.infer<typeof formSchema>;

interface FeedSettingsFormProps {
  defaultValues: FeedSettings;
  onSubmit: (data: FeedSettings) => void;
  isSubmitting: boolean;
}

export function FeedSettingsForm({ defaultValues, onSubmit, isSubmitting }: FeedSettingsFormProps) {
  const form = useForm<FeedSettings>({
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  );
}