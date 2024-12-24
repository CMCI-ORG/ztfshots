import { useState } from "react";
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
import { PageDialog } from "./PageDialog";
import { useToast } from "@/components/ui/use-toast";

export const PagesTable = () => {
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: pages, refetch } = useQuery({
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pages</h2>
        <Button
          onClick={() => {
            setSelectedPage(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

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
          {pages?.map((page) => (
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
                    onClick={() => {
                      setSelectedPage(page);
                      setIsDialogOpen(true);
                    }}
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

      <PageDialog
        page={selectedPage}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          setIsDialogOpen(false);
          refetch();
        }}
      />
    </div>
  );
};