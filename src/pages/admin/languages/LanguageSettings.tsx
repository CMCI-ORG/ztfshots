import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { AddLanguageDialog } from "@/components/admin/languages/AddLanguageDialog";

export default function LanguageSettings() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: languages, refetch } = useQuery({
    queryKey: ["languages-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const handleStatusChange = async (code: string, isActive: boolean) => {
    const { error } = await supabase
      .from("languages")
      .update({ is_active: isActive })
      .eq("code", code);

    if (error) {
      toast.error("Failed to update language status");
      return;
    }

    toast.success("Language status updated successfully");
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Language Settings</h2>
          <p className="text-muted-foreground">
            Manage available languages and their status
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Language</TableHead>
              <TableHead>Native Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-right">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {languages?.map((language) => (
              <TableRow key={language.code}>
                <TableCell>{language.name}</TableCell>
                <TableCell>{language.native_name}</TableCell>
                <TableCell>{language.code}</TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={language.is_active}
                    onCheckedChange={(checked) => 
                      handleStatusChange(language.code, checked)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddLanguageDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          refetch();
          setIsAddDialogOpen(false);
        }}
      />
    </div>
  );
}