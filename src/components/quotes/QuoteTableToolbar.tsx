import { StatusFilter } from "./filters/StatusFilter";

interface QuoteTableToolbarProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export function QuoteTableToolbar({ statusFilter, onStatusChange }: QuoteTableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <StatusFilter value={statusFilter} onChange={onStatusChange} />
    </div>
  );
}