import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusFilter } from "./filters/StatusFilter";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload } from "lucide-react";
import { exportQuotes, importQuotes } from "@/utils/quoteImportExport";

export interface QuoteTableToolbarProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export function QuoteTableToolbar({
  searchQuery = "",
  onSearchChange = () => {},
  statusFilter,
  onStatusFilterChange,
}: QuoteTableToolbarProps) {
  const { toast } = useToast();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importQuotes(file);
      toast({
        title: "Import Successful",
        description: "Quotes have been imported successfully.",
      });
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import quotes",
        variant: "destructive",
      });
    }

    // Reset the input
    event.target.value = "";
  };

  const handleExport = async () => {
    try {
      await exportQuotes();
      toast({
        title: "Export Successful",
        description: "Quotes have been exported successfully.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export quotes",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4">
      <div className="flex flex-1 items-center gap-4">
        <Input
          placeholder="Search quotes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
        />
        <StatusFilter value={statusFilter} onChange={onStatusFilterChange} />
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>
      </div>
    </div>
  );
}