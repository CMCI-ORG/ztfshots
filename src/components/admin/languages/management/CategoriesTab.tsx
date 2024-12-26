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

interface CategoriesTabProps {
  onManageTranslations: (id: string) => void;
}

export function CategoriesTab({ onManageTranslations }: CategoriesTabProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories-translations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, description, translations, primary_language")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Primary Language</TableHead>
            <TableHead>Translations</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div className="font-medium">{category.name}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </div>
              </TableCell>
              <TableCell>{category.primary_language?.toUpperCase()}</TableCell>
              <TableCell>
                {category.translations ? Object.keys(category.translations).length : 0} languages
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  onClick={() => onManageTranslations(category.id)}
                >
                  Manage Translations
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}