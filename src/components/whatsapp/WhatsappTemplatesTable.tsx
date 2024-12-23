import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Plus, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WhatsappTemplateDialog } from "./WhatsappTemplateDialog";
import { WhatsappTemplate } from "@/types/whatsapp";
import { useToast } from "@/hooks/use-toast";

export function WhatsappTemplatesTable() {
  const [editingTemplate, setEditingTemplate] = useState<WhatsappTemplate | null>(
    null
  );
  const { toast } = useToast();

  const { data: templates, refetch } = useQuery({
    queryKey: ["whatsapp-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WhatsappTemplate[];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("whatsapp_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Template deleted",
        description: "The template has been deleted successfully.",
      });

      refetch();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "Failed to delete the template. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditingTemplate({} as WhatsappTemplate)}>
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
            {templates?.map((template) => (
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
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!templates?.length && (
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
        onSubmit={async (data) => {
          try {
            if (data.id) {
              const { error } = await supabase
                .from("whatsapp_templates")
                .update(data)
                .eq("id", data.id);
              if (error) throw error;
              toast({
                title: "Template updated",
                description: "The template has been updated successfully.",
              });
            } else {
              const { error } = await supabase
                .from("whatsapp_templates")
                .insert([data]);
              if (error) throw error;
              toast({
                title: "Template created",
                description: "The template has been created successfully.",
              });
            }
            setEditingTemplate(null);
            refetch();
          } catch (error) {
            console.error("Error saving template:", error);
            toast({
              title: "Error",
              description: "Failed to save the template. Please try again.",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
}