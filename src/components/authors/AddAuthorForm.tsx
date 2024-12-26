import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Author name must be at least 2 characters.",
  }).max(100, {
    message: "Author name must not exceed 100 characters.",
  }),
  bio: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }).max(1000, {
    message: "Bio must not exceed 1000 characters.",
  }),
  image: z.instanceof(FileList)
    .refine((files) => files?.length === 0 || files?.length === 1, "Please upload one file")
    .refine(
      (files) => files?.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
      "Max file size is 5MB"
    )
    .refine(
      (files) =>
        files?.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp files are accepted"
    )
    .optional(),
});

interface AddAuthorFormProps {
  onSuccess?: () => void;
}

export function AddAuthorForm({ onSuccess }: AddAuthorFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch the current user's preferred language
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('profiles')
        .select('preferred_language')
        .eq('id', user.id)
        .single();
      
      return data;
    },
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let imageUrl = null;

      if (values.image?.length) {
        const file = values.image[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('author-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw new Error(`Error uploading image: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
          .from('author-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("authors").insert({
        name: values.name,
        bio: values.bio,
        image_url: imageUrl,
        primary_language: profile?.preferred_language || 'en',
        translations: {},
      });

      if (error) throw new Error(`Error adding author: ${error.message}`);

      toast({
        title: "Success",
        description: "Author has been added successfully.",
      });
      
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error adding author:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add author. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter author's name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter author's biography..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of the author's background and achievements.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={(e) => onChange(e.target.files)}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Upload an image (max 5MB, .jpg, .jpeg, .png, .webp)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Adding..." : "Add Author"}
        </Button>
      </form>
    </Form>
  );
}