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

interface SiteSettingsTabProps {
  onManageTranslations: (id: string) => void;
}

export function SiteSettingsTab({ onManageTranslations }: SiteSettingsTabProps) {
  const { data: siteSettings } = useQuery({
    queryKey: ["site-settings-translations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (!siteSettings) return null;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Site Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Primary Language</TableHead>
            <TableHead>Translations</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className="font-medium">{siteSettings.site_name}</div>
              <div className="text-sm text-muted-foreground">
                {siteSettings.tag_line}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground line-clamp-2">
                {siteSettings.description}
              </div>
            </TableCell>
            <TableCell>{siteSettings.primary_language?.toUpperCase()}</TableCell>
            <TableCell>
              {siteSettings.translations ? Object.keys(siteSettings.translations).length : 0} languages
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                onClick={() => onManageTranslations(siteSettings.id)}
              >
                Manage Translations
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}