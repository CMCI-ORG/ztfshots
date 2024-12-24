import { Button } from "@/components/ui/button";
import { StatusFilter } from "./filters/StatusFilter";
import { ProcessScheduledQuotesButton } from "./ProcessScheduledQuotesButton";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

interface QuoteTableToolbarProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export function QuoteTableToolbar({ statusFilter, onStatusChange }: QuoteTableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <StatusFilter value={statusFilter} onChange={onStatusChange} />
      <div className="flex items-center gap-2">
        <ProcessScheduledQuotesButton />
        <Button asChild>
          <Link to="/admin/quotes/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Quote
          </Link>
        </Button>
      </div>
    </div>
  );
}