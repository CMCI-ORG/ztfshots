import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RoadmapDialog } from "@/components/admin/development/RoadmapDialog";

const Roadmap = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: roadmapItems, isLoading } = useQuery({
    queryKey: ["admin-roadmap"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmap_items")
        .select("*")
        .order("year", { ascending: true })
        .order("quarter", { ascending: true })
        .order("priority", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-roadmap"] });
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 0: return "Low";
      case 1: return "Medium";
      case 2: return "High";
      default: return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Roadmap Management</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quarter</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roadmapItems?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.quarter}</TableCell>
                <TableCell>{item.year}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <Badge variant={item.priority === 2 ? "destructive" : item.priority === 1 ? "default" : "secondary"}>
                    {getPriorityLabel(item.priority)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge>{item.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RoadmapDialog
        item={selectedItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Roadmap;