import { useQuery } from "@tanstack/react-query";
import { FileText, Edit, Trash, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PagesTableProps {
  onEdit: (page: any) => void;
  onAdd: () => void;
}

export const PagesTable = ({ onEdit, onAdd }: PagesTableProps) => {
  const { toast } = useToast();

  const { data: pages, refetch, isLoading, error } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages_content")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching pages:", error);
        throw error;
      }

      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("pages_content")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Page deleted",
        description: "The page has been successfully deleted.",
      });

      refetch();
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "Error",
        description: "Failed to delete the page. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (pageKey: string) => {
    window.open(`/${pageKey}`, "_blank");
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading pages. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4">Loading pages...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pages</h2>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      {pages && pages.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {page.title}
                  </div>
                </TableCell>
                <TableCell>{page.page_key}</TableCell>
                <TableCell>
                  {new Date(page.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePreview(page.page_key)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(page)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(page.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No pages found. Click the "Add Page" button to create one.
        </div>
      )}
    </div>
  );
};