import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WhatsappTemplate } from "@/types/whatsapp";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  language: z.string().min(1, "Language is required"),
  content: z.string()
    .min(1, "Content is required")
    .max(1024, "Content must be less than 1024 characters"),
  status: z.string(),
});

interface WhatsappTemplateDialogProps {
  template: WhatsappTemplate | null;
  onClose: () => void;
  onSubmit: (data: WhatsappTemplate) => Promise<void>;
  isSubmitting?: boolean;
}

export function WhatsappTemplateDialog({
  template,
  onClose,
  onSubmit,
  isSubmitting = false,
}: WhatsappTemplateDialogProps) {
  const form = useForm<WhatsappTemplate>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: template?.id,
      name: template?.name || "",
      language: template?.language || "en",
      content: template?.content || "",
      status: template?.status || "pending",
    },
  });

  const handleSubmit = async (data: WhatsappTemplate) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Error submitting template:", error);
    }
  };

  return (
    <Dialog open={!!template} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {template?.id ? "Edit Template" : "Create Template"}
          </DialogTitle>
          <DialogDescription>
            {template?.id 
              ? "Update your WhatsApp message template details below."
              : "Create a new WhatsApp message template with the form below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Template name" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Template content"
                      className="min-h-[100px]"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}