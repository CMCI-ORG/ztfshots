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
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ReleaseDialog } from "@/components/admin/development/ReleaseDialog";
import { ReleaseEvaluation } from "@/components/admin/development/ReleaseEvaluation";

const Releases = () => {
  const [selectedRelease, setSelectedRelease] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: releases, isLoading } = useQuery({
    queryKey: ["admin-releases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("releases")
        .select("*")
        .order("release_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (release: any) => {
    setSelectedRelease(release);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedRelease(null);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-releases"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Release Management</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Release
        </Button>
      </div>

      <ReleaseEvaluation />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {releases?.map((release) => (
              <TableRow key={release.id}>
                <TableCell>v{release.version}</TableCell>
                <TableCell>{release.title}</TableCell>
                <TableCell>
                  {format(new Date(release.release_date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge>{release.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(release)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ReleaseDialog
        release={selectedRelease}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Releases;