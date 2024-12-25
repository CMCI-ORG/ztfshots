import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

const Roadmap = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Roadmap Management</h1>
        <Button>
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
                <TableCell>{item.priority}</TableCell>
                <TableCell>
                  <Badge>{item.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Roadmap;