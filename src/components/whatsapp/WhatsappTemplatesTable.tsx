import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WhatsappTemplateDialog } from "./WhatsappTemplateDialog";
import { WhatsappTemplate } from "@/types/whatsapp";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export function WhatsappTemplatesTable() {
  const [editingTemplate, setEditingTemplate] = useState<WhatsappTemplate | null>(
    null
  );
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates, isLoading, error } = useQuery({
    queryKey: ["whatsapp-templates"],
    queryFn: async () => {
      console.log("Fetching WhatsApp templates...");
      const { data, error } = await supabase
        .from("whatsapp_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching templates:", error);
        throw error;
      }
      
      console.log("Successfully fetched templates:", data);
      return data as WhatsappTemplate[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting template:", id);
      const { error } = await supabase
        .from("whatsapp_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-templates"] });
      toast({
        title: "Template deleted",
        description: "The template has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "Failed to delete the template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data: WhatsappTemplate) => {
      console.log("Saving template:", data);
      if (data.id) {
        const { error } = await supabase
          .from("whatsapp_templates")
          .update({
            name: data.name,
            language: data.language,
            content: data.content,
            status: data.status,
          })
          .eq("id", data.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("whatsapp_templates").insert([{
          name: data.name,
          language: data.language,
          content: data.content,
          status: data.status,
        }]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-templates"] });
      setEditingTemplate(null);
      toast({
        title: editingTemplate?.id ? "Template updated" : "Template created",
        description: `The template has been ${editingTemplate?.id ? "updated" : "created"} successfully.`,
      });
    },
    onError: (error) => {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: "Failed to save the template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: WhatsappTemplate) => {
    try {
      await saveMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load WhatsApp templates. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={() => setEditingTemplate({ 
            name: "", 
            language: "en", 
            content: "", 
            status: "pending" 
          } as WhatsappTemplate)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : templates?.length ? (
              templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.language}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        template.status === "approved"
                          ? "success"
                          : template.status === "rejected"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {template.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {template.content}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTemplate(template)}
                        disabled={saveMutation.isPending || deleteMutation.isPending}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(template.id)}
                        disabled={saveMutation.isPending || deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No templates found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <WhatsappTemplateDialog
        template={editingTemplate}
        onClose={() => setEditingTemplate(null)}
        onSubmit={handleSubmit}
        isSubmitting={saveMutation.isPending}
      />
    </div>
  );
}